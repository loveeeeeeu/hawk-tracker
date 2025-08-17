import {
  BasePlugin,
  HawkTrackerCore,
  SEND_TYPES,
  LISTEN_TYPES,
  SEND_SUB_TYPES,
} from '@hawk-tracker/core';
//      ^ 你现在可以在这里从 'core' 添加任何其他需要的功能或类型
//        例如: import { BasePlugin, SdkBase, nativeTryCatch } from '@hawk-tracker/core'

export class ErrorPlugin extends BasePlugin {
  constructor() {
    super(SEND_TYPES.ERROR);
    console.log('ErrorPlugin constructor');
  }
  install({ dataSender, eventCenter }: HawkTrackerCore, options: any) {
    console.log('Error Plugin 111!');
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.ERROR,
      callback: (data: any) => {
        console.log('ErrorPlugin error', data);
        // 要提取一下data信息
        const transformedData = transformData(data);
        // 根据data 来判断是哪种错误类型，替换SEND_SUB_TYPES.ERROR,

        dataSender.sendData(
          SEND_TYPES.ERROR,
          SEND_SUB_TYPES.ERROR,
          transformedData,
          true,
        );
      },
    });
    console.log({ eventCenter });
    console.log('ErrorPlugin core');
  }
  transform(data: any) {
    console.log('ErrorPlugin transform', data);
  }
}

function transformData(data: any) {
  const { message, stack, name, ...rest } = data;
  return {
    message,
    stack,
    name,
    ...rest,
  };
}
