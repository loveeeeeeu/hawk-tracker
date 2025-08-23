import {
  BasePlugin,
  HawkTrackerCore,
  SEND_TYPES,
  LISTEN_TYPES,
} from '@hawk-tracker/core';
import {
  PerformanceData,
  PerformanceOptions,
  ResourceTimingData,
} from './types';

/**
 * 性能监控插件
 * 继承 BasePlugin 基类，实现性能数据收集和监控功能
 */
export class PerformancePlugin extends BasePlugin {
  private options: PerformanceOptions;
  private observers: PerformanceObserver[] = [];
  private isInstalled: boolean = false;

  constructor(options: PerformanceOptions = {}) {
    super(SEND_TYPES.PERFORMANCE);

    // 验证和设置默认选项
    this.options = this.validateAndSetDefaults(options);

    // 绑定方法到实例，确保 this 上下文正确
    this.handleLoadEvent = this.handleLoadEvent.bind(this);
    this.handleDOMContentLoadedEvent =
      this.handleDOMContentLoadedEvent.bind(this);
  }

  /**
   * 插件安装方法 - 必须实现
   * @param core HawkTracker 核心实例
   * @param options 安装选项
   */
  install(core: HawkTrackerCore, options: any): void {
    try {
      // 防止重复安装
      if (this.isInstalled) {
        console.warn('PerformancePlugin 已经安装，跳过重复安装');
        return;
      }

      const { dataSender, eventCenter } = core;

      // 验证核心组件
      if (!dataSender || !eventCenter) {
        throw new Error('PerformancePlugin 安装失败：缺少必要的核心组件');
      }

      // 订阅页面加载事件
      this.subscribeToEvents(eventCenter, dataSender);

      // 设置性能观察器
      this.setupPerformanceObservers(dataSender);

      // 标记为已安装
      this.isInstalled = true;

      console.log('PerformancePlugin 安装成功', this.options);
    } catch (error) {
      console.error('PerformancePlugin 安装失败:', error);
      throw error;
    }
  }

  /**
   * 插件卸载方法
   */
  uninstall(): void {
    try {
      // 清理所有观察器
      this.cleanupObservers();

      // 重置状态
      this.isInstalled = false;

      console.log('PerformancePlugin 卸载成功');
    } catch (error) {
      console.error('PerformancePlugin 卸载失败:', error);
    }
  }

  /**
   * 订阅事件监听器
   */
  private subscribeToEvents(eventCenter: any, dataSender: any): void {
    // 监听页面加载完成
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.LOAD,
      callback: this.handleLoadEvent,
    });

    // 监听DOM内容加载完成 - 使用 READYSTATECHANGE 替代
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.READYSTATECHANGE,
      callback: this.handleDOMContentLoadedEvent,
    });
  }

  /**
   * 处理页面加载事件
   */
  private handleLoadEvent(dataSender: any): void {
    try {
      const perfData = this.collectPerformanceData();
      dataSender.sendData(SEND_TYPES.PERFORMANCE, perfData, false);
      console.log('页面加载性能数据已收集:', perfData);
    } catch (error) {
      console.error('收集页面加载性能数据失败:', error);
    }
  }

  /**
   * 处理DOM内容加载事件
   */
  private handleDOMContentLoadedEvent(dataSender: any): void {
    try {
      // 检查文档是否已经准备就绪
      if (
        document.readyState === 'interactive' ||
        document.readyState === 'complete'
      ) {
        const domData = this.collectDOMPerformanceData();
        dataSender.sendData(SEND_TYPES.PERFORMANCE, domData, false);
        console.log('DOM内容加载性能数据已收集:', domData);
      }
    } catch (error) {
      console.error('收集DOM性能数据失败:', error);
    }
  }

  /**
   * 设置性能观察器
   */
  private setupPerformanceObservers(dataSender: any): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('当前环境不支持 PerformanceObserver，跳过性能观察器设置');
      return;
    }

    // 设置 Web Vitals 观察器
    if (this.options.enableWebVitals) {
      this.setupWebVitalsObserver(dataSender);
    }

    // 设置资源监控观察器
    if (this.options.enableResourceTiming) {
      this.setupResourceObserver(dataSender);
    }
  }

  /**
   * 收集页面性能数据
   */
  private collectPerformanceData(): PerformanceData {
    try {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;

      if (!navigation) {
        throw new Error('无法获取导航性能数据');
      }

      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(
        (entry) => entry.name === 'first-paint',
      );
      const firstContentfulPaint = paintEntries.find(
        (entry) => entry.name === 'first-contentful-paint',
      );

      return {
        type: 'navigation',
        timestamp: Date.now(),
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: firstPaint ? firstPaint.startTime : 0,
        firstContentfulPaint: firstContentfulPaint
          ? firstContentfulPaint.startTime
          : 0,
        dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpTime: navigation.connectEnd - navigation.connectStart,
        requestTime: navigation.responseEnd - navigation.responseStart,
        domParseTime:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        domReadyTime:
          navigation.domComplete - navigation.domContentLoadedEventEnd,
        redirectTime: navigation.redirectEnd - navigation.redirectStart,
        unloadTime: navigation.unloadEventEnd - navigation.unloadEventStart,
        secureConnectionTime:
          navigation.secureConnectionStart > 0
            ? navigation.connectEnd - navigation.secureConnectionStart
            : 0,
      };
    } catch (error) {
      console.error('收集性能数据失败:', error);
      return this.getDefaultPerformanceData();
    }
  }

  /**
   * 收集DOM性能数据
   */
  private collectDOMPerformanceData(): PerformanceData {
    try {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;

      if (!navigation) {
        throw new Error('无法获取DOM性能数据');
      }

      return {
        type: 'dom_ready',
        timestamp: Date.now(),
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.fetchStart,
        domParseTime:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
      };
    } catch (error) {
      console.error('收集DOM性能数据失败:', error);
      return this.getDefaultPerformanceData();
    }
  }

  /**
   * 设置 Web Vitals 观察器
   */
  private setupWebVitalsObserver(dataSender: any): void {
    // LCP 观察器
    this.setupLCPObserver(dataSender);

    // FID 观察器
    this.setupFIDObserver(dataSender);

    // CLS 观察器
    this.setupCLSObserver(dataSender);
  }

  /**
   * 设置 LCP 观察器
   */
  private setupLCPObserver(dataSender: any): void {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (lastEntry?.startTime !== undefined) {
          const lcpData: PerformanceData = {
            type: 'web_vitals',
            timestamp: Date.now(),
            metric: 'LCP',
            value: lastEntry.startTime,
            element: (lastEntry as any).element?.tagName || 'unknown',
          };

          dataSender.sendData(SEND_TYPES.PERFORMANCE, lcpData, false);
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP 观察器设置失败:', error);
    }
  }

  /**
   * 设置 FID 观察器
   */
  private setupFIDObserver(dataSender: any): void {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0];

        if (firstInput?.startTime !== undefined) {
          const fidData: PerformanceData = {
            type: 'web_vitals',
            timestamp: Date.now(),
            metric: 'FID',
            value: (firstInput as any).processingStart - firstInput.startTime,
            element: (firstInput as any).target?.tagName || 'unknown',
          };

          dataSender.sendData(SEND_TYPES.PERFORMANCE, fidData, false);
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn('FID 观察器设置失败:', error);
    }
  }

  /**
   * 设置 CLS 观察器
   */
  private setupCLSObserver(dataSender: any): void {
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        const clsData: PerformanceData = {
          type: 'web_vitals',
          timestamp: Date.now(),
          metric: 'CLS',
          value: clsValue,
        };

        dataSender.sendData(SEND_TYPES.PERFORMANCE, clsData, false);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS 观察器设置失败:', error);
    }
  }

  /**
   * 设置资源观察器
   */
  private setupResourceObserver(dataSender: any): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          if (this.isResourceTiming(entry)) {
            const resourceData = this.createResourceData(entry);

            // 只监控重要的资源类型
            if (this.shouldMonitorResource(entry.initiatorType)) {
              dataSender.sendData(
                SEND_TYPES.PERFORMANCE,
                {
                  type: 'resource',
                  timestamp: Date.now(),
                  ...resourceData,
                },
                false,
              );
            }
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('资源观察器设置失败:', error);
    }
  }

  /**
   * 创建资源数据
   */
  private createResourceData(
    entry: PerformanceResourceTiming,
  ): ResourceTimingData {
    return {
      name: entry.name,
      duration: entry.duration,
      transferSize: entry.transferSize,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd,
      domainLookupStart: entry.domainLookupStart,
      domainLookupEnd: entry.domainLookupEnd,
      connectStart: entry.connectStart,
      connectEnd: entry.connectEnd,
      requestStart: entry.requestStart,
      responseStart: entry.responseStart,
    };
  }

  /**
   * 判断是否应该监控该资源类型
   */
  private shouldMonitorResource(initiatorType: string): boolean {
    const monitoredTypes = ['script', 'css', 'img', 'fetch', 'xmlhttprequest'];
    return monitoredTypes.includes(initiatorType);
  }

  /**
   * 类型守卫函数
   */
  private isResourceTiming(
    entry: PerformanceEntry,
  ): entry is PerformanceResourceTiming {
    return entry.entryType === 'resource';
  }

  /**
   * 清理所有观察器
   */
  private cleanupObservers(): void {
    this.observers.forEach((observer) => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('清理观察器失败:', error);
      }
    });
    this.observers = [];
  }

  /**
   * 验证和设置默认选项
   */
  private validateAndSetDefaults(
    options: PerformanceOptions,
  ): PerformanceOptions {
    const defaults: PerformanceOptions = {
      enableWebVitals: true,
      enableResourceTiming: true,
      enableNavigationTiming: true,
    };

    // 合并选项
    const mergedOptions = { ...defaults, ...options };

    // 验证选项
    if (typeof mergedOptions.enableWebVitals !== 'boolean') {
      console.warn('enableWebVitals 应该是布尔值，使用默认值 true');
      mergedOptions.enableWebVitals = true;
    }

    if (typeof mergedOptions.enableResourceTiming !== 'boolean') {
      console.warn('enableResourceTiming 应该是布尔值，使用默认值 true');
      mergedOptions.enableResourceTiming = true;
    }

    if (typeof mergedOptions.enableNavigationTiming !== 'boolean') {
      console.warn('enableNavigationTiming 应该是布尔值，使用默认值 true');
      mergedOptions.enableNavigationTiming = true;
    }

    return mergedOptions;
  }

  /**
   * 获取默认性能数据
   */
  private getDefaultPerformanceData(): PerformanceData {
    return {
      type: 'navigation',
      timestamp: Date.now(),
      loadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      dnsTime: 0,
      tcpTime: 0,
      requestTime: 0,
      domParseTime: 0,
      domReadyTime: 0,
      redirectTime: 0,
      unloadTime: 0,
      secureConnectionTime: 0,
    };
  }

  // 公共 API 方法

  /**
   * 手动收集性能数据
   */
  public collectManualPerformanceData(): PerformanceData {
    return this.collectPerformanceData();
  }

  /**
   * 获取资源加载性能数据
   */
  public getResourceTimingData(): ResourceTimingData[] {
    try {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter((entry): entry is PerformanceResourceTiming =>
          this.isResourceTiming(entry),
        )
        .map((entry) => this.createResourceData(entry));
    } catch (error) {
      console.error('获取资源性能数据失败:', error);
      return [];
    }
  }

  /**
   * 获取资源摘要
   */
  public getResourceSummary() {
    try {
      const resources = this.getResourceTimingData();
      const summary = {
        totalResources: resources.length,
        totalBytes: resources.reduce(
          (sum, resource) => sum + (resource.transferSize || 0),
          0,
        ),
        byType: {} as Record<string, { count: number; bytes: number }>,
      };

      resources.forEach((resource) => {
        const type = resource.initiatorType;
        if (!summary.byType[type]) {
          summary.byType[type] = { count: 0, bytes: 0 };
        }
        summary.byType[type].count++;
        summary.byType[type].bytes += resource.transferSize || 0;
      });

      return summary;
    } catch (error) {
      console.error('获取资源摘要失败:', error);
      return { totalResources: 0, totalBytes: 0, byType: {} };
    }
  }

  /**
   * 获取插件状态
   */
  public getPluginStatus() {
    return {
      isInstalled: this.isInstalled,
      options: this.options,
      observersCount: this.observers.length,
    };
  }
}

// 导出插件实例
export default PerformancePlugin;
