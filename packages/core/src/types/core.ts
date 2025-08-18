import { AnyFun } from './common';
import { LISTEN_TYPES, SEND_TYPES } from '../common/event';
import { EventCenter } from '../lib/eventCenter';
import { DataSender } from '../lib/dataSender';
import { BehaviorStackManager } from '../lib/behaviorStackManager';
// 定义 SDK 核心实例的类型
export interface HawkTrackerCore {
  dataSender: DataSender; //数据上报
  eventCenter: EventCenter; //事件中心
  options: any; //公共配置
  behaviorStackManager: BehaviorStackManager; // 行为栈管理器
}

// 事件处理函数
export interface EventHandler {
  type: LISTEN_TYPES;
  callback: AnyFun;
}

export interface ReportData {
  type: SEND_TYPES;
  data: any;
  pageUrl: string;
  triggerTime: number;
}

// export interface DeviceInfo {
//   clientHeight: number;
//   clientWidth: number;
//   colorDepth: number;
//   pixelDepth: number;
//   screenWidth: number;
//   screenHeight: number;
// }
