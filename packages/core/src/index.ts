import { InitOptions } from './types/options';
import { subscribeEvent } from './lib/eventCenter';
import { dataSender } from './lib/dataSender';
import { nativeTryCatch } from './utils/exceptions';

function init(options: InitOptions) {
  if (!options.dsn || !options.apikey) {
    return console.error(
      `RMonitor 缺少配置项：${!options.dsn ? 'dns(上报地址)' : ''} ${!options.apikey ? 'id(项目id)' : ''}`,
    );
  }
  //关闭监控
  if (options.disable) return;

  // handleOptions(options)
  // setupReplace();
}

/**
 * 支持自定义插件
 * @param plugin
 * @param option
 * @returns
 */
function use(plugin: any, option: any) {
  const instance = new plugin(option);
  if (
    !subscribeEvent({
      callback: (data) => {
        instance.transform(data);
      },
      type: instance.type,
    })
  )
    return;

  nativeTryCatch(() => {
    instance.core({ dataSender, option, subscribeEvent });
  });
}

export { init, use };
// 统一导出
export * from './types';
export * from './utils';
export * from './common';
