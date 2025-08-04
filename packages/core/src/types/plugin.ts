import { SdkBase } from './core';

// 定义插件的基础结构

export abstract class BasePlugin {
  public type: string; //插件类型
  constructor(type: string) {
    this.type = type;
  }
  abstract bindOptions(options: object): void; //校验参数
  abstract core(SdkBase: SdkBase): void; //核心方法
  abstract transform(data: any): void; //数据转化
}
