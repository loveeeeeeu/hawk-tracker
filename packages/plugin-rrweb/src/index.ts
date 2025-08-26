import { BasePlugin, SEND_TYPES, SEND_SUB_TYPES } from '@hawk-tracker/core';
import { record } from 'rrweb';

type RecordOptions = Omit<
  NonNullable<Parameters<typeof record>[0]>,
  'emit' | 'sampling'
>;

type PresetName = 'privacy' | 'balanced' | 'quality';

/**
 * rrweb 插件配置项
 */
type RrwebPluginOptions = {
  maxEvents?: number;
  sampling?: NonNullable<Parameters<typeof record>[0]>['sampling'];
  emit?: (event: any) => void;
  preset?: PresetName;
  recordOptions?: RecordOptions;
  /** 批量大小，达到后立刻上报 */
  flushBatchSize?: number;
  /** 定时上报间隔（毫秒） */
  flushIntervalMs?: number;
};

type InternalOptions = {
  preset: PresetName;
  maxEvents: number;
  sampling: NonNullable<Parameters<typeof record>[0]>['sampling'];
  recordOptions: RecordOptions;
  emit: (event: any) => void;
  flushBatchSize: number;
  flushIntervalMs: number;
};

export class RrwebPlugin extends BasePlugin {
  private options: InternalOptions;
  private events: any[] = [];
  private stopFn: (() => void) | null = null;
  private errorPoints: Array<{
    type: string;
    error: any;
    timestamp: number;
    eventIndex: number;
  }> = [];
  private currentEventIndex: number = 0;

  // 自动上报相关
  private core: any | null = null;
  private buffer: any[] = [];
  private flushTimer: any = null;

  constructor(options: RrwebPluginOptions = {}) {
    super(SEND_TYPES.RRWEB);

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
      flushBatchSize: options.flushBatchSize ?? 100,
      flushIntervalMs: options.flushIntervalMs ?? 5000,
    };
  }

  /** 安装插件，启动 rrweb 录制，并接入自动上报 */
  install(core: any): void {
    this.core = core;
    if (typeof window === 'undefined') return;
    if (this.stopFn) return;

    const stop = record({
      ...this.options.recordOptions,
      sampling: this.options.sampling,
      emit: (e: any) => {
        this.events.push(e);
        this.currentEventIndex++;
        // 维护环形缓存
        if (this.events.length > this.options.maxEvents) {
          this.events.splice(0, this.events.length - this.options.maxEvents);
          this.errorPoints = this.errorPoints.map((point) => ({
            ...point,
            eventIndex: Math.max(
              0,
              point.eventIndex - (this.events.length - this.options.maxEvents),
            ),
          }));
        }
        // 自定义回调
        this.options.emit(e);
        // 加入上报缓冲
        this.buffer.push(e);
        if (this.buffer.length >= this.options.flushBatchSize) {
          this.flush(false);
        }
      },
    });
    if (stop) this.stopFn = stop;

    // 定时器
    if (!this.flushTimer) {
      this.flushTimer = setInterval(() => this.flush(false), this.options.flushIntervalMs);
    }

    // 全局调试 API（新）
    (window as any).__hawk_rrweb = {
      getEvents: () => this.events.slice(),
      stop: () => this.stop(),
      getErrorPoints: () => this.errorPoints.slice(),
      // 兼容两种调用：markErrorPoint(type, error) 或 markErrorPoint({ type, error, timestamp })
      markErrorPoint: (arg1: any, arg2?: any) => {
        if (typeof arg1 === 'object' && arg1 && 'type' in arg1) {
          const info = arg1 as { type: string; error: any; timestamp?: number };
          this.errorPoints.push({
            type: info.type,
            error: info.error,
            timestamp: info.timestamp ?? Date.now(),
            eventIndex: this.currentEventIndex,
          });
        } else {
          this.errorPoints.push({
            type: String(arg1),
            error: arg2,
            timestamp: Date.now(),
            eventIndex: this.currentEventIndex,
          });
        }
      },
    };

    // 全局调试 API（旧，向后兼容给错误插件使用）
    (window as any).$hawkRrweb = {
      getReplay: ({ maxSize = this.options.maxEvents } = {}) => {
        const size = Math.min(maxSize, this.events.length);
        return this.events.slice(this.events.length - size);
      },
      getErrorContext: (_: any) => {
        // 简化的错误上下文：取错误点附近的片段
        const last = this.errorPoints.at(-1);
        if (!last) return null;
        const before = this.events.slice(Math.max(0, last.eventIndex - 20), last.eventIndex);
        const after = this.events.slice(last.eventIndex, Math.min(this.events.length, last.eventIndex + 10));
        return {
          errorPoint: last,
          eventsBeforeError: before,
          eventsAfterError: after,
          totalEvents: this.events.length,
          errorCount: this.errorPoints.length,
        };
      },
      markErrorPoint: (info: { type: string; error: any; timestamp?: number }) => {
        (window as any).__hawk_rrweb.markErrorPoint(info);
      },
    };
  }

  /** 立刻停止录制并上报剩余缓冲 */
  public stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(true);
    if (this.stopFn) {
      this.stopFn();
      this.stopFn = null;
    }
  }

  /** 批量上报缓冲事件 */
  private flush(isImmediate: boolean) {
    if (!this.core || this.buffer.length === 0) return;
    const batch = this.buffer.splice(0, this.options.flushBatchSize);
    try {
      this.core.dataSender.sendData(
        SEND_TYPES.RRWEB,
        SEND_SUB_TYPES.RRWEB,
        { data: { events: batch } },
        isImmediate,
      );
    } catch {}
  }

  private getPreset(preset?: PresetName): {
    name: PresetName;
    sampling: NonNullable<Parameters<typeof record>[0]>['sampling'];
    recordOptions: RecordOptions;
    maxEvents: number;
  } {
    const pres: Record<PresetName, { sampling: any; recordOptions: RecordOptions; maxEvents: number }> = {
      privacy: {
        sampling: { mousemove: 80, scroll: 80, input: 'last', media: 80 },
        recordOptions: { maskAllInputs: true, recordCanvas: false } as any,
        maxEvents: 200,
      },
      balanced: {
        sampling: { mousemove: 50, scroll: 50, input: 'last', media: 50 },
        recordOptions: { maskAllInputs: false, recordCanvas: false } as any,
        maxEvents: 300,
      },
      quality: {
        sampling: { mousemove: 20, scroll: 20, input: 'all', media: 20 },
        recordOptions: { maskAllInputs: false, recordCanvas: true } as any,
        maxEvents: 600,
      },
    };
    const name: PresetName = preset ?? 'balanced';
    const cfg = pres[name];
    return { name, sampling: cfg.sampling, recordOptions: cfg.recordOptions, maxEvents: cfg.maxEvents };
  }
}
