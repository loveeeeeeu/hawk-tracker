import { SEND_TYPES } from '../common/event';
import { HawkTrackerCore } from './core';

// 定义插件的基础结构

export abstract class BasePlugin {
  public type: SEND_TYPES; //插件类型
  constructor(type: SEND_TYPES) {
    this.type = type;
  }
  abstract install(core: HawkTrackerCore, options: any): void; //安装插件
}
