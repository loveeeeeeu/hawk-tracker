import { InternalConfig } from './types/options';
import { EventCenter,eventCenter } from './lib/eventCenter';
import { DataSender, } from './lib/dataSender';
import { initReplace } from './lib/AOPFactory';
import { nativeTryCatch } from './utils/exceptions';
import { BasePlugin } from './types/plugin';
import { setConfig,getConfig } from './common/config';
import { initBaseInfo } from './common/base';
import { setGlobalHawkTracker, getGlobalHawkTracker } from './utils/global';

export class HawkTracker {
  config: InternalConfig; // 配置项
  dataSender: DataSender;
  eventCenter: EventCenter;
  // plugins: BasePlugin[];
  baseInfo: any;
  // configManager: ConfigManager;

  constructor(configs: InternalConfig) {
    setConfig(configs)
    this.config = getConfig()
    this.dataSender = new DataSender({
      dsn: configs.dsn,
      sampleRate: configs.sampleRate,
      debug: configs.debug,
      // ... 其他 DataSender 需要的配置
    });
    this.eventCenter = eventCenter
    // 延迟到全局实例设置后再初始化 AOP
    // initReplace()
    // this.baseInfo = initBaseInfo(configs)
    // this.plugins = []
    // this.runtimeContext = new RuntimeContext()
  }

  /**
   * 初始化 AOP 拦截
   * 需要在全局实例设置后调用
   */
  initAOP() {
    initReplace()
  }

  public use(plugin: any, option: any) {
    const instance = new plugin(option);
    nativeTryCatch(() => {
      instance.install(this);
    });
    return this
  }

  public track(type: string, data: any,isImmediate: boolean = true) {
    this.dataSender.sendData(type, data, isImmediate);
  }
}

export function init(configs: InternalConfig) {
  const instance = new HawkTracker(configs)
  setGlobalHawkTracker(instance)
  // 在设置全局实例后初始化 AOP，因为要用到全局实例
  initReplace()
  return getGlobalHawkTracker()
}

// 统一导出
export * from './types';
export * from './utils';
export * from './common';
