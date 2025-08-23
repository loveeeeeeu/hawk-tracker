import { BasePlugin, SEND_TYPES } from '@hawk-tracker/core';
import { record } from 'rrweb';

type RecordOptions = Omit<
  NonNullable<Parameters<typeof record>[0]>,
  'emit' | 'sampling'
>;

type PresetName = 'privacy' | 'balanced' | 'quality';

/**
 * rrweb 插件配置项
 * @property maxEvents - 最多缓存多少条录制事件，超过则丢弃最早的
 * @property sampling - 采样配置，详见 rrweb 文档，控制各类事件的采样频率
 * @property emit - 事件回调，每次有新事件时触发
 */
type RrwebPluginOptions = {
  /**
   * 最大事件缓存数，默认300
   */
  maxEvents?: number;
  /**
   * 采样配置，详见 rrweb 文档
   * 例如：{ mousemove: 50, scroll: 50, media: 50, input: 'last' }
   */
  sampling?: NonNullable<Parameters<typeof record>[0]>['sampling'];
  /**
   * 事件回调函数，每次有新事件时触发
   */
  emit?: (event: any) => void;
  preset?: PresetName;
  recordOptions?: RecordOptions;
};

type InternalOptions = {
  preset: PresetName;
  maxEvents: number;
  sampling: NonNullable<Parameters<typeof record>[0]>['sampling'];
  recordOptions: RecordOptions;
  emit: (event: any) => void;
};

/**
 * rrweb 录屏插件
 * 用于集成 rrweb 录屏能力到 hawk-tracker
 */
export class RrwebPlugin extends BasePlugin {
  /**
   * 插件配置项，已合并默认值
   */
  private options: InternalOptions;
  /**
   * 事件缓存队列
   */
  private events: any[] = [];
  /**
   * 停止录制的函数
   */
  private stopFn: (() => void) | null = null;
  /**
   * 错误标记点
   */
  private errorPoints: Array<{
    type: string;
    error: any;
    timestamp: number;
    eventIndex: number;
  }> = [];
  /**
   * 当前事件索引
   */
  private currentEventIndex: number = 0;

  /**
   * 构造函数
   * @param options 插件配置项
   */
  constructor(options: RrwebPluginOptions = {}) {
    super(SEND_TYPES.CUSTOM);

    const preset = this.getPreset(options.preset);

    const mergedSampling = {
      ...preset.sampling,
      ...(options.sampling || {}),
    } as NonNullable<Parameters<typeof record>[0]>['sampling'];

    const mergedRecordOptions: RecordOptions = {
      ...preset.recordOptions,
      ...(options.recordOptions || {}),
    } as RecordOptions;

    const mergedMaxEvents = options.maxEvents ?? preset.maxEvents;

    this.options = {
      preset: preset.name,
      maxEvents: mergedMaxEvents,
      sampling: mergedSampling,
      recordOptions: mergedRecordOptions,
      emit: options.emit ?? (() => {}),
    };
  }

  /**
   * 安装插件，启动 rrweb 录制
   */
  install(): void {
    if (typeof window === 'undefined') return; // 仅在浏览器环境下生效
    if (this.stopFn) return; // 已经启动过则不重复启动

    // 启动 rrweb 录制
    const stop = record({
      ...this.options.recordOptions,
      sampling: this.options.sampling,
      emit: (e: any) => {
        // 缓存事件
        this.events.push(e);
        this.currentEventIndex++;
        
        // 超出最大缓存数则丢弃最早的事件
        if (this.events.length > this.options.maxEvents) {
          this.events.splice(0, this.events.length - this.options.maxEvents);
          // 调整错误标记点的索引
          this.errorPoints = this.errorPoints.map(point => ({
            ...point,
            eventIndex: Math.max(0, point.eventIndex - (this.events.length - this.options.maxEvents))
          }));
        }
        
        // 触发自定义 emit 回调
        this.options.emit(e);
      },
    });
    if (stop) {
      this.stopFn = stop;
    }

    // 挂载全局方法，便于外部获取录制数据和停止录制
    (window as any).$hawkRrweb = {
      /**
       * 获取最近的录制事件
       * @param maxSize 返回的最大事件数，默认等于配置的 maxEvents
       * @returns 事件数组
       */
      getReplay: ({ maxSize = this.options.maxEvents } = {}) => {
        const size = Math.min(maxSize, this.events.length);
        return this.events.slice(this.events.length - size);
      },
      
      /**
       * 停止录制
       */
      stop: () => {
        if (this.stopFn) {
          this.stopFn();
          this.stopFn = null;
        }
      },
      
      /**
       * 新增：标记错误发生的时间点
       */
      markErrorPoint: (errorInfo: { type: string; error: any; timestamp: number }) => {
        this.errorPoints.push({
          ...errorInfo,
          eventIndex: this.currentEventIndex
        });
        
        // 限制错误标记点数量
        if (this.errorPoints.length > 10) {
          this.errorPoints.shift();
        }
      },
      
      /**
       * 新增：获取错误发生时的上下文信息
       */
      getErrorContext: (errorInfo: { errorType: string; errorMessage: string; timestamp: number }) => {
        const now = Date.now();
        const timeWindow = 30 * 1000; // 30秒内的错误
        
        // 找到最近的错误标记点
        const recentErrors = this.errorPoints.filter(point => 
          now - point.timestamp < timeWindow
        );
        
        if (recentErrors.length === 0) return null;
        
        const latestError = recentErrors[recentErrors.length - 1];
        if (!latestError) return null;
        
        // 获取错误发生前后的录屏事件
        const beforeError = this.events.slice(
          Math.max(0, latestError.eventIndex - 20),
          latestError.eventIndex
        );
        
        const afterError = this.events.slice(
          latestError.eventIndex,
          Math.min(this.events.length, latestError.eventIndex + 10)
        );
        
        return {
          errorPoint: latestError,
          eventsBeforeError: beforeError,
          eventsAfterError: afterError,
          totalEvents: this.events.length,
          errorCount: this.errorPoints.length
        };
      },
      
      /**
       * 新增：获取错误相关的用户行为
       */
      getErrorBehavior: (errorInfo: { errorType: string; errorMessage: string }) => {
        const now = Date.now();
        const timeWindow = 60 * 1000; // 1分钟内的行为
        
        // 分析录屏事件，提取用户行为
        const userActions = this.events
          .filter(event => now - event.timestamp < timeWindow)
          .map(event => {
            switch (event.type) {
              case 2: // mouse
                return { type: 'mouse', x: event.data.x, y: event.data.y, timestamp: event.timestamp };
              case 3: // scroll
                return { type: 'scroll', x: event.data.x, y: event.data.y, timestamp: event.timestamp };
              case 4: // viewport
                return { type: 'viewport', width: event.data.width, height: event.data.height, timestamp: event.timestamp };
              case 5: // input
                return { type: 'input', tag: event.data.tagName, value: event.data.value, timestamp: event.timestamp };
              default:
                return null;
            }
          })
          .filter(Boolean);
        
        return {
          userActions,
          actionCount: userActions.length,
          timeWindow
        };
      }
    };
  }

  private getPreset(preset?: PresetName): {
    name: PresetName;
    maxEvents: number;
    sampling: NonNullable<Parameters<typeof record>[0]>['sampling'];
    recordOptions: RecordOptions;
  } {
    const name: PresetName = preset || 'balanced';
    if (name === 'privacy') {
      return {
        name,
        maxEvents: 200,
        sampling: { mousemove: 80, scroll: 80, input: 'last', media: 80 },
        recordOptions: { maskAllInputs: true, recordCanvas: false },
      } as any;
    }
    if (name === 'quality') {
      return {
        name,
        maxEvents: 600,
        sampling: { mousemove: 20, scroll: 20, input: 'all', media: 20 },
        recordOptions: { maskAllInputs: false, recordCanvas: true },
      } as any;
    }
    return {
      name: 'balanced',
      maxEvents: 300,
      sampling: { mousemove: 50, scroll: 50, input: 'last', media: 50 },
      recordOptions: { maskAllInputs: false, recordCanvas: false },
    } as any;
  }
}
