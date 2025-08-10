import { BasePlugin, HawkTrackerCore, SEND_TYPES, LISTEN_TYPES } from '@hawk-tracker/core';
//      ^ 你现在可以在这里从 'core' 添加任何其他需要的功能或类型
//        例如: import { BasePlugin, SdkBase, nativeTryCatch } from '@hawk-tracker/core'

export class ErrorPlugin extends BasePlugin {
  constructor() {
    super(SEND_TYPES.ERROR);
    console.log('ErrorPlugin constructor');
  }
  install({ dataSender,eventCenter }: HawkTrackerCore, options: any) {
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.ERROR,
      callback: (data: any) => {
        console.log('ErrorPlugin error', data);
        
        dataSender.sendData(
          SEND_TYPES.ERROR,
          data,
          false
        );
      }
    });
    console.log({eventCenter})
    console.log('ErrorPlugin core');
  }
  transform(data: any) {
    console.log('ErrorPlugin transform', data);
  }
}
