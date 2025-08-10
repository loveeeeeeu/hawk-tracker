import pako from 'pako'
import { _global } from '../utils';
import { log } from '../utils/debug';

// 定义上报数据的类型
type ReportData = {
  // 数据类型，如 'error', 'performance', 'behavior'
  type: string; 
  // 实际数据
  data: any;    
  // 时间戳
  timestamp: number; 
  // 基础信息，如页面 URL、会话 ID 等
  baseInfo: Record<string, any>; 
  // 是否需要立即上报，用于高优先级数据
  isImmediate: boolean; 
  // 当前重试次数
  retryCount: number;
};

// DataSender 的配置
interface SenderConfig {
  dsn: string;
  sampleRate?: number;
  batchSize?: number;
  sendInterval?: number;
  maxConcurrentRequests?: number;
  offlineStorageKey?: string;
  debug?: boolean;
}

export class DataSender {
  // 队列
  private queue: ReportData[] = [];
  // 配置
  private readonly config: Required<SenderConfig>;
  // 定时器
  private timer: number | null = null;
  // 当前进行中的请求数
  private concurrentRequests = 0;
  // 日志方法
  private readonly log: (level: 'info' | 'warn' | 'error', message: string, ...args: any[]) => void;

  constructor(config: SenderConfig) {
    // 设置默认配置并合并
    this.config = {
      dsn: config.dsn,
      sampleRate: config.sampleRate ?? 1,
      batchSize: config.batchSize ?? 50,
      sendInterval: config.sendInterval ?? 5000,
      maxConcurrentRequests: config.maxConcurrentRequests ?? 3,
      offlineStorageKey: config.offlineStorageKey ?? 'sdk_report_queue',
      debug: config.debug ?? false,
    };

    if (this.config.debug) {
      this.log = log;
    } else {
      this.log = () => {};
    }
    
    // 初始化时从本地存储恢复数据
    this.restoreFromLocalStorage();

    // 监听网络变化和页面卸载
    this.setupEventListeners();
    
    // 启动定时上报
    this.startScheduler();
  }

  // 对外暴露的唯一接口
  public sendData(type: string, data: any, isImmediate: boolean = false): void {
    // 采样过滤
    if (Math.random() > this.config.sampleRate) {
      this.log('info', `Data dropped due to sampling:`, data);
      return;
    }
    
    // 封装基础信息
    const reportData: ReportData = {
      type,
      data,
      timestamp: Date.now(),
      baseInfo: this.getBaseInfo(),
      isImmediate,
      retryCount: 0,
    };
    
    // 将数据入队
    this.queue.push(reportData);
    this.log('info', `Added data to queue:`, reportData);

    // 立即触发上报
    if (isImmediate) {
      this.flush();
    }
  }

  // 上报调度器
  private startScheduler(): void {
    if (this.timer !== null) return;

    const tick = () => {
      // 在浏览器空闲时触发上报，最大化性能
      // requestIdleCallback 仅在浏览器有空闲时间时才会执行
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => this.flush());
      } else {
        // 如果不支持，则直接执行
        this.flush();
      }
    };

    this.timer = window.setInterval(tick, this.config.sendInterval);
  }

  // 清空队列并发送数据
  private async flush(): Promise<void> {
    // 并发控制：如果正在进行的请求数已达上限，则等待
    if (this.concurrentRequests >= this.config.maxConcurrentRequests) {
      this.log('warn', `Reached max concurrent requests (${this.config.maxConcurrentRequests}), waiting...`);
      return;
    }

    // 队列为空，无需操作
    if (this.queue.length === 0) {
      return;
    }

    // 从队列头部取出一定数量的数据
    const dataToSend = this.queue.splice(0, this.config.batchSize);
    
    this.concurrentRequests++;
    this.log('info', `Flushing ${dataToSend.length} items from queue. Concurrent requests: ${this.concurrentRequests}`);

    try {
      await this.transport(dataToSend);
      this.log('info', `Successfully sent ${dataToSend.length} items.`);
    } catch (error) {
      // 失败时，将数据放回队列，并增加重试次数
      this.log('error', `Failed to send data, error:`, error);
      dataToSend.forEach(item => item.retryCount++);
      this.queue.unshift(...dataToSend); // 将数据重新放回队列头部
    } finally {
      this.concurrentRequests--;
    }
    
    // 如果队列中还有数据，立即再次尝试上报
    if (this.queue.length > 0) {
      this.flush();
    }
  }
  
  // 传输通道，选择最合适的传输方式
  private async transport(data: ReportData[]): Promise<void> {
    const payload = JSON.stringify(data);
    
    // 使用 pako 进行 gzip 压缩
    const compressedPayload = pako.gzip(payload);

    // 根据网络状态决定是否发送
    if (!navigator.onLine) {
        throw new Error('Network is offline, suspending transport.');
    }

    // 数据大小超过 64KB，sendBeacon 降级到 fetch
    if (compressedPayload.length > 64 * 1024) {
      this.log('warn', `Payload size exceeds sendBeacon limit, falling back to fetch.`);
      await fetch(this.config.dsn, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' },
        body: compressedPayload,
      });
    } else {
      // 优先使用 sendBeacon
      navigator.sendBeacon(this.config.dsn, compressedPayload);
    }
  }

  // 离线存储与恢复
  private restoreFromLocalStorage(): void {
    try {
      const storedData = localStorage.getItem(this.config.offlineStorageKey);
      if (storedData) {
        this.queue = JSON.parse(storedData);
        localStorage.removeItem(this.config.offlineStorageKey);
        this.log('info', `Restored ${this.queue.length} items from offline storage.`);
      }
    } catch (e) {
      this.log('error', 'Failed to restore data from localStorage:', e);
    }
  }

  // 事件监听器，处理网络状态和页面卸载
  private setupEventListeners(): void {
    // 监听网络恢复
    window.addEventListener('online', () => {
      this.log('info', 'Network online, flushing pending data.');
      this.flush(); // 立即上报积压的数据
      this.startScheduler(); // 重新启动定时器
    });
    
    // 监听网络断开
    window.addEventListener('offline', () => {
      this.log('warn', 'Network offline, pausing scheduler.');
      if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    });

    // 页面卸载时进行离线存储
    window.addEventListener('beforeunload', () => {
      this.flush(); // 再次尝试清空队列
      if (this.queue.length > 0) {
        localStorage.setItem(this.config.offlineStorageKey, JSON.stringify(this.queue));
        this.log('info', `Saved ${this.queue.length} items to offline storage.`);
      }
    });
  }

  // 辅助方法，获取基础信息
  private getBaseInfo(): Record<string, any> {
    return {
      pageUrl: _global.location.href,
      userAgent: navigator.userAgent,
      // IP 和会话 ID 等通常在后端通过请求头获取，前端无法直接获取
      // 这里可以放置会话 ID 或其他客户端信息
    };
  }
}