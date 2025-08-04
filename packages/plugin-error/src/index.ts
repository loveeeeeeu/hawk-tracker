import { BasePlugin, EVENTTYPES, SdkBase } from '@hawk-tracker/core';
//      ^ 你现在可以在这里从 'core' 添加任何其他需要的功能或类型
//        例如: import { BasePlugin, SdkBase, nativeTryCatch } from '@hawk-tracker/core'

export class ErrorPlugin extends BasePlugin {
  constructor() {
    super(EVENTTYPES.ERROR);
    console.log('ErrorPlugin constructor');
  }
  bindOptions(options: any) {
    console.log('ErrorPlugin bindOptions', options);
  }
  core({ dataSender }: SdkBase) {
    dataSender.send('error  ');
    console.log('ErrorPlugin core');
  }
  transform(data: any) {
    console.log('ErrorPlugin transform', data);
  }
}
