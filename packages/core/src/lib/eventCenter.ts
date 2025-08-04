import { EventHandler } from '../types/core';

export class EventCenter {}

function subscribeEvent(handler: EventHandler): boolean {
  console.log('subscribeEvent', handler);
  // todo: 订阅事件
  return true;
}

// function unsubscribeEvent(handler: EventHandler) {
//   return true
// }

// function publishEvent(handler: EventHandler) {
// }

export { subscribeEvent };
