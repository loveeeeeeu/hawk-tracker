import {
  BehaviorEvent,
  BehaviorStackConfig,
  SnapshotOptions,
  BehaviorStackStats,
} from '../types/behavior';
import { generateUUID } from '../utils/common';

/**
 * 行为栈类 - 用于存储和管理用户行为事件
 * 提供环形缓冲区、事件过滤、快照等功能
 */
export class BehaviorStack {
  private events: BehaviorEvent[] = [];
  private maxSize: number;
  private maxAge: number;
  private debug: boolean;
  private name: string;
  private filter?: (event: BehaviorEvent) => boolean;
  private cleanupTimer?: NodeJS.Timeout;
  private totalEventsCount: number = 0;

  constructor(config: BehaviorStackConfig = {}) {
    this.maxSize = config.maxSize ?? 100;
    this.maxAge = config.maxAge ?? 5 * 60 * 1000; // 默认5分钟
    this.debug = config.debug ?? false;
    this.name = config.name ?? 'default_stack';
    this.filter = config.filter;

    // 启动定期清理
    this.startCleanupTimer();

    if (this.debug) {
      console.log(`[BehaviorStack:${this.name}] 初始化完成`, {
        maxSize: this.maxSize,
        maxAge: this.maxAge,
        debug: this.debug,
      });
    }
  }

  /**
   * 添加事件到栈中
   * @param event 行为事件
   * @returns 是否添加成功
   */
  public addEvent(event: Omit<BehaviorEvent, 'id' | 'timestamp'>): boolean {
    try {
      // 生成事件ID和时间戳
      const fullEvent: BehaviorEvent = {
        ...event,
        id: generateUUID(),
        timestamp: Date.now(),
      };

      // 应用过滤器
      if (this.filter && !this.filter(fullEvent)) {
        if (this.debug) {
          console.log(
            `[BehaviorStack:${this.name}] 事件被过滤器过滤`,
            fullEvent,
          );
        }
        return false;
      }

      // 添加到事件数组
      this.events.push(fullEvent);
      this.totalEventsCount++;

      // 如果超过最大大小，移除最旧的事件
      if (this.events.length > this.maxSize) {
        this.events.shift();
      }

      if (this.debug) {
        console.log(`[BehaviorStack:${this.name}] 事件已添加`, {
          type: fullEvent.type,
          id: fullEvent.id,
          currentSize: this.events.length,
          totalEvents: this.totalEventsCount,
        });
      }

      return true;
    } catch (error) {
      console.error(`[BehaviorStack:${this.name}] 添加事件失败`, error);
      return false;
    }
  }

  /**
   * 添加自定义事件
   * @param type 事件类型
   * @param data 自定义数据
   * @param context 事件上下文
   * @returns 是否添加成功
   */
  public addCustomEvent(
    type: string,
    data: Record<string, any> = {},
    context: Partial<BehaviorEvent['context']> = {},
  ): boolean {
    return this.addEvent({
      type,
      pageUrl: window.location.href,
      context: {
        ...context,
        customData: data,
      },
    });
  }

  /**
   * 获取事件快照
   * @param options 快照选项
   * @returns 事件数组
   */
  public getSnapshot(options: SnapshotOptions = {}): BehaviorEvent[] {
    let filteredEvents = [...this.events];

    // 按时间过滤
    if (options.startTime || options.endTime) {
      filteredEvents = filteredEvents.filter((event) => {
        if (options.startTime && event.timestamp < options.startTime)
          return false;
        if (options.endTime && event.timestamp > options.endTime) return false;
        return true;
      });
    }

    // 按类型过滤
    if (options.includeTypes && options.includeTypes.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        options.includeTypes!.includes(event.type),
      );
    }

    if (options.excludeTypes && options.excludeTypes.length > 0) {
      filteredEvents = filteredEvents.filter(
        (event) => !options.excludeTypes!.includes(event.type),
      );
    }

    // 限制数量
    if (options.maxCount && filteredEvents.length > options.maxCount) {
      filteredEvents = filteredEvents.slice(-options.maxCount);
    }

    if (this.debug) {
      console.log(`[BehaviorStack:${this.name}] 获取快照`, {
        originalCount: this.events.length,
        filteredCount: filteredEvents.length,
        options,
      });
    }

    return filteredEvents;
  }

  /**
   * 获取栈统计信息
   * @returns 统计信息
   */
  public getStats(): BehaviorStackStats {
    const typeDistribution: Record<string, number> = {};

    this.events.forEach((event) => {
      typeDistribution[event.type] = (typeDistribution[event.type] || 0) + 1;
    });

    const stats: BehaviorStackStats = {
      totalEvents: this.totalEventsCount,
      currentEvents: this.events.length,
      earliestEventTime: this.events.length > 0 ? this.events[0].timestamp : 0,
      latestEventTime:
        this.events.length > 0
          ? this.events[this.events.length - 1].timestamp
          : 0,
      typeDistribution,
      name: this.name,
    };

    if (this.debug) {
      console.log(`[BehaviorStack:${this.name}] 统计信息`, stats);
    }

    return stats;
  }

  /**
   * 清空栈
   */
  public clear(): void {
    this.events = [];
    if (this.debug) {
      console.log(`[BehaviorStack:${this.name}] 栈已清空`);
    }
  }

  /**
   * 获取当前栈大小
   * @returns 事件数量
   */
  public getSize(): number {
    return this.events.length;
  }

  /**
   * 获取栈名称
   * @returns 栈名称
   */
  public getName(): string {
    return this.name;
  }

  /**
   * 启动定期清理定时器
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    // 每分钟清理一次过期事件
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * 清理过期事件
   */
  private cleanup(): void {
    if (this.maxAge <= 0) return;

    const now = Date.now();
    const originalSize = this.events.length;

    this.events = this.events.filter(
      (event) => now - event.timestamp <= this.maxAge,
    );

    const removedCount = originalSize - this.events.length;
    if (removedCount > 0 && this.debug) {
      console.log(`[BehaviorStack:${this.name}] 清理过期事件`, {
        removedCount,
        currentSize: this.events.length,
      });
    }
  }

  /**
   * 销毁栈
   */
  public destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }

    this.events = [];
    this.totalEventsCount = 0;

    if (this.debug) {
      console.log(`[BehaviorStack:${this.name}] 栈已销毁`);
    }
  }
}
