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
        // 超出最大缓存数则丢弃最早的事件
        if (this.events.length > this.options.maxEvents) {
          this.events.splice(0, this.events.length - this.options.maxEvents);
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
