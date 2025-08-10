import { AnyFun } from '../types/common';
import { _global } from './global';

/**
 * 添加事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param options 选项
 */
export function subscribeListener(
  target: Window | Document | Element,
  eventName: string,
  handler: AnyFun,
  options = false,
): void {
  console.log('subscribeListener xxxxx', {
    target,
    eventName,
    handler,
    options,
  });
  target.addEventListener(eventName, handler, options);
}

/**
 * 移除事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param options 选项
 */
export function unsubscribeListener(
  target: Window | Document | Element,
  eventName: string,
  handler: AnyFun,
  options = false,
): void {
  target.removeEventListener(eventName, handler, options);
}

/**
 * 重写对象上的某个属性 (AOP)
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @param isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceMethod<T extends Record<string, any>>(
  source: T,
  name: keyof T,
  replacement: (original: AnyFun) => AnyFun,
  isForced = false,
): void {
  if (source === undefined) return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      (source as any)[name] = wrapped;
    }
  }
}

/**
 * 函数节流
 * @param func 需要节流的函数
 * @param delay 节流的时间间隔
 * @param immediate 是否立即执行第一次
 */
export function throttle<T extends AnyFun>(
  func: T,
  delay: number,
  immediate = false,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T>;

  return function (this: any, ...args: Parameters<T>) {
    lastArgs = args;

    if (timer === null) {
      if (immediate) {
        func.apply(this, lastArgs);
      }
      timer = setTimeout(() => {
        timer = null;
        if (!immediate) {
          func.apply(this, lastArgs);
        }
      }, delay);
    }
  };
}

/**
 * 获取当前时间戳
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 检查对象是否有指定属性
 */
export function hasOwnProperty<T extends Record<string, any>>(
  obj: T,
  prop: string | number | symbol,
): prop is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * 安全地检查全局对象是否存在某个属性
 */
export function hasGlobalProperty(prop: string): boolean {
  return typeof _global !== 'undefined' && prop in _global;
}

/**
 * 创建事件处理器存储对象
 */
export function createEventStorage<T extends string>(): Record<
  T,
  AnyFun | null
> {
  return {} as Record<T, AnyFun | null>;
}

/**
 * 创建原始方法存储对象
 */
export function createOriginalMethodsStorage<T extends string>(): Record<
  T,
  AnyFun | null
> {
  return {} as Record<T, AnyFun | null>;
}

/**
 * 获取cookie
 * @param name
 * @returns
 */
export function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1] || null
  );
}

/**
 * 设置cookie
 * @param name
 * @param value
 * @param days
 */
export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

/**
 * 生成UUID
 * @returns
 */
export function generateUUID(): string {
  // uuid生成
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
