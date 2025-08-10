import { isWindow } from './is';

/**
 * 安全地获取全局对象
 * 在浏览器环境返回 window，在 Node.js 环境返回模拟对象
 */
function getGlobalObject(): any {
  // 浏览器环境
  if (typeof window !== 'undefined') {
    return window;
  }

  // Node.js 环境，返回一个模拟的 window 对象
  if (typeof global !== 'undefined') {
    // 如果 global 上已经有模拟的 window，直接返回
    if ((global as any).__mockWindow) {
      return (global as any).__mockWindow;
    }

    // 创建模拟的 window 对象
    const mockWindow = {
      // 基本属性
      document: {},
      navigator: { userAgent: 'Node.js' },
      location: { href: 'about:blank' },

      // HawkTracker 相关属性
      hawkTracker: undefined,
      _hawkTrackerInit_: false,

      // 基本方法
      addEventListener: () => {},
      removeEventListener: () => {},
      setTimeout: global.setTimeout,
      clearTimeout: global.clearTimeout,
      setInterval: global.setInterval,
      clearInterval: global.clearInterval,
    };

    // 缓存模拟对象
    (global as any).__mockWindow = mockWindow;
    return mockWindow;
  }

  // 其他环境兜底
  return {};
}

// 使用安全的全局对象
const _global = getGlobalObject();

/**
 * 设置全局 HawkTracker 实例
 * @param instance HawkTracker实例
 */
export function setGlobalHawkTracker(instance: any): void {
  _global.hawkTracker = instance;
  // 同时设置初始化标记
  _global._hawkTrackerInit_ = true;
}

/**
 * 获取全局 HawkTracker 实例
 * @returns HawkTracker实例或undefined
 */
export function getGlobalHawkTracker(): any {
  return _global.hawkTracker;
}

/**
 * 判断sdk是否初始化
 * @returns sdk是否初始化
 */
export function isInit(): boolean {
  return !!_global.hawkTracker;
}

/**
 * 判断是否为浏览器环境
 */
export function isBrowserEnv(): boolean {
  return typeof window !== 'undefined';
}

const $sdkInstance = getGlobalHawkTracker();
export { _global, $sdkInstance };
