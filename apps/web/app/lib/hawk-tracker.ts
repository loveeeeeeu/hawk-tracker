// Hawk Tracker 初始化和配置
import { init } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

console.log('🦅 Hawk Tracker: 开始初始化...');

// 检查是否在客户端环境
const isClient = typeof window !== 'undefined';

let hawkTracker: any;

if (isClient) {
  // 只在客户端初始化
  console.log('🦅 Hawk Tracker: 客户端环境，开始初始化...');

  // 初始化 Hawk Tracker
  hawkTracker = init({
    dsn: 'https://your-dsn.com', // 上报地址
    appName: 'hawk-tracker-web', // 应用名称
    appCode: 'web-app', // 应用代码
    appVersion: '1.0.0', // 应用版本
    userUuid: 'web-user-001', // 用户ID
    sampleRate: 1, // 采样率100%
    debug: true, // 开启调试模式
  });

  console.log('🦅 Hawk Tracker: 核心初始化完成');

  // 加载错误插件
  hawkTracker.use(ErrorPlugin);

  console.log('🦅 Hawk Tracker: ErrorPlugin 加载完成');

  // 开发环境下的调试信息
  if (import.meta.env.DEV) {
    console.log('�� Hawk Tracker: 开发模式 - 错误监控已启用');
    console.log('�� Hawk Tracker: 配置信息:', {
      dsn: 'https://your-dsn.com',
      appName: 'hawk-tracker-web',
      appCode: 'web-app',
      appVersion: '1.0.0',
      userUuid: 'web-user-001',
      debug: true,
      sampleRate: 1,
    });
  }
} else {
  console.log('🦅 Hawk Tracker: 服务端环境，跳过初始化');
  // 创建一个空的hawkTracker对象
  hawkTracker = {
    use: () => {},
    track: () => {},
  };
}
