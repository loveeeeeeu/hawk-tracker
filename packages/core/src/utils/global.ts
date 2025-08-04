import { isWindow } from './is';
import { HawkTracker } from '../types/core';

/**
 * 是否为浏览器环境
 */
export const isBrowserEnv = isWindow(
  typeof window !== 'undefined' ? window : 0,
);

/**
 * 是否为 electron 环境
 */
export const isElectronEnv = !!(window as any)?.process?.versions?.electron;

/**
 * 是否为测试环境
 */
export const isTestEnv =
  (typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom')) ||
  // @ts-expect-error: jsdom
  (typeof window !== 'undefined' && window.jsdom);

/**
 * 获取全局变量
 */
export function getGlobal(): Window {
  if (isBrowserEnv || isElectronEnv || isTestEnv) return window;
  return {} as Window;
}

// 延迟初始化全局变量，避免循环依赖
const _global = getGlobal();

/**
 * 获取全部变量 __hawkTracker__ 的引用地址
 */
export function getGlobalSupport() {
  _global['_hawkTracker'] = _global['_hawkTracker'] || ({} as HawkTracker);
  return _global['_hawkTracker'];
}

// 延迟初始化 support 对象
const _support = getGlobalSupport();

/**
 * 判断sdk是否初始化
 * @returns sdk是否初始化
 */
export function isInit(): boolean {
  const global = _global as unknown as { _hawkTrackerInit__?: boolean };
  return !!global._hawkTrackerInit__;
}

export { _global, _support };
