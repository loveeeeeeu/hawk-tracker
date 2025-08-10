import { InternalConfig } from '../types/options';
import { setCookie } from '../utils/common';
import { SDK_USER_UUID } from './constant';

const config: InternalConfig = {
  dsn: 'http://127.0.0.1:3000/api/data', // 上报地址
  appName: 'hawk-tracker', // 项目名称
  appCode: 'hawk-tracker', // 项目id
  appVersion: '1.0.0', // 用户id
  userUuid: '123456', // 用户id
  sampleRate: 1, // 采样率
  debug: true, // 是否开启调试模式(控制台会输出sdk动作)
};

export function setConfig(configs: InternalConfig = config) {
  if (!configs.dsn) {
    console.error(
      `RMonitor 缺少配置项：${!configs.dsn ? 'dns(上报地址)' : ''}`,
    );
    return;
  }
  Object.assign(config, configs);
  // setCookie(SDK_USER_UUID, config.userUuid || '', 365)
}

export function getConfig() {
  return config;
}
