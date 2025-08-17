import { InternalConfig } from './types/options';
import { EventCenter, eventCenter } from './lib/eventCenter';
import { DataSender } from './lib/dataSender';
import { initReplace } from './lib/AOPFactory';
import { nativeTryCatch } from './utils/exceptions';
import { setConfig, getConfig } from './common/config';
import { initBaseInfo } from './common/base';
import { setGlobalHawkTracker, getGlobalHawkTracker } from './utils/global';

console.log('🔥 Core package hot reload test - ' + new Date().toLocaleTimeString());

export class HawkTracker {
  config: InternalConfig; // 配置项
  dataSender: DataSender;
  eventCenter: EventCenter;
  baseInfo: any;

  constructor(configs: InternalConfig) {
    setConfig(configs);
    this.config = getConfig();
    this.dataSender = new DataSender({
      dsn: configs.dsn,
      sampleRate: configs.sampleRate,
      debug: configs.debug,
      // ... 其他 DataSender 需要的配置
    });
    this.eventCenter = eventCenter;
    this.baseInfo = initBaseInfo(configs)
  }


  public use(plugin: any, option: any) {
    const instance = new plugin(option);
    nativeTryCatch(() => {
      instance.install(this);
    });
    return this;
  }

  public track(type: string, data: any, isImmediate: boolean = true) {
    this.dataSender.sendData(type, data, isImmediate);
  }
}

export function init(configs: InternalConfig) {
  const instance = new HawkTracker(configs);
  setGlobalHawkTracker(instance);
  // 在设置全局实例后初始化 AOP，因为要用到全局实例
  initReplace();
  console.log('Core package updated!'); // 添加这行
  return getGlobalHawkTracker();
}

// 统一导出
export * from './types';
export * from './utils';
export * from './common';
