import { AnyFun, AnyObj } from './common';
import { EVENTTYPES } from '../common/event';
// 定义 SDK 核心实例的类型
export interface HawkTracker {
  options: any;
  // baseInfo: BaseInfo;
  // 这里可以暴露 EventBus, sendData 等类的实例给插件
  // sendData: ISendData;
  // eventBus: IEventBus;
  // ...其他核心方法
}

export interface SdkBase {
  dataSender: any; //数据上报
  // actionQueue: any;//用户行为
  options: any; //公共配置
  runEvent: any; //发布消息 通知事件调度器
}

// 事件处理函数
export interface IEventHandler {
  type: EVENTTYPES;
  callback: AnyFun;
}

// 事件总线
export interface IEventBus {
  addEvent: (handler: IEventHandler) => void;
  delEvent: (handler: IEventHandler) => void;
  changeEvent: (handler: IEventHandler, newCallback: AnyFun) => void;
  getEvent: (type: EVENTTYPES) => AnyFun[];
  runEvent: (type: EVENTTYPES, ...args: any[]) => void;
}
export interface EventHandler {
  type: EVENTTYPES;
  callback: AnyFun;
}
// 数据发送器
// 这个文件中所有接口定义的必要性是什么？
export interface ISendData {
  // 暴露给插件的方法
  emit: (e: AnyObj, flush?: boolean) => void;
  destroy: () => void;
}
