import { EventHandler } from '../types/core';
import { AnyFun } from '../types/common';
import { LISTEN_TYPES } from '../common/event';

// 事件中心
export class EventCenter {
  private eventMap: Map<LISTEN_TYPES, EventHandler[]> = new Map(); // 事件类型与事件处理函数的映射
  private eventQueue: EventHandler[] = []; // 事件队列

  subscribeEvent(handler: EventHandler) {
    console.log('subscribeEvent xxxxx', { handler });
    const handlers = this.eventMap.get(handler.type) || [];
    handlers.push(handler);
    this.eventMap.set(handler.type, handlers);
  }

  delEvent(handler: EventHandler) {
    const handlers = this.eventMap.get(handler.type) || [];
    this.eventMap.set(
      handler.type,
      handlers.filter((h) => h !== handler),
    );
  }

  changeEvent(handler: EventHandler, newCallback: AnyFun) {
    const handlers = this.eventMap.get(handler.type) || [];
    this.eventMap.set(
      handler.type,
      handlers.map((h) =>
        h === handler ? { ...h, callback: newCallback } : h,
      ),
    );
  }

  getEvent(type: LISTEN_TYPES) {
    return this.eventMap.get(type) || [];
  }

  runEvent(type: LISTEN_TYPES, ...args: any[]) {
    const handlers = this.getEvent(type);
    handlers.forEach((handler) => handler.callback(...args));
  }

  // 别名方法，与runEvent功能相同
  emit(type: LISTEN_TYPES, ...args: any[]) {
    this.runEvent(type, ...args);
  }
}

export const eventCenter = new EventCenter();
