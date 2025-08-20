import {
  BasePlugin,
  HawkTrackerCore,
  SEND_TYPES,
  LISTEN_TYPES,
} from '@hawk-tracker/core';

export class PerformancePlugin extends BasePlugin {
  constructor() {
    super(SEND_TYPES.PERFORMANCE);
  }
  
  install({ dataSender, eventCenter }: HawkTrackerCore, options: any) {
    // 监听页面加载完成
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.LOAD,
      callback: () => {
        // 收集性能数据
        const perfData = this.collectPerformanceData();
        
        // 性能数据可以批量上报
        dataSender.sendData(
          SEND_TYPES.PERFORMANCE, 
          perfData, 
          false
        );
      }
    });
  }
  
  private collectPerformanceData() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      firstPaint: this.getFirstPaint(),
      // ... 其他性能指标
    };
  }
  
  private getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }
}

// 导出插件实例
export default PerformancePlugin;
