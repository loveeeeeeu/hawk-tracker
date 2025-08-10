// 配置管理器使用示例
import { ConfigManager } from './src/config/manager';
import { InitOptions } from './src/types/options';

// 创建配置管理器实例
const configManager = new ConfigManager();

// 示例1：基础配置
const basicConfig: InitOptions = {
  dsn: 'https://api.example.com/track',
  appName: 'my-awesome-app',
  appVersion: '1.0.0',
  debug: true,
};

// 初始化配置
if (configManager.initialize(basicConfig)) {
  console.log('✅ 基础配置初始化成功');
  console.log('当前配置:', configManager.getAllConfig());
} else {
  console.error('❌ 基础配置初始化失败');
}

// 示例2：完整配置
const fullConfig: InitOptions = {
  dsn: 'https://api.example.com/track',
  appName: 'my-awesome-app',
  appCode: 'APP001',
  appVersion: '2.0.0',
  userUuid: 'user-12345',
  debug: false,

  // 功能开关 - 布尔值简写形式
  error: true,
  performance: true,
  pv: true,
  event: false,

  // 传输配置
  timeout: 10000,
  cacheMaxLength: 20,
  maxQueueLength: 500,

  // 采样和过滤
  tracesSampleRate: 0.8,
  ignoreErrors: [/Script error/, 'ResizeObserver loop limit exceeded'],
  ignoreRequest: [/localhost/, /127\.0\.0\.1/],

  // 高级配置
  recordScreen: false,
  scopeError: true,
  localization: false,

  // 扩展配置
  ext: {
    userId: '12345',
    environment: 'production',
    version: '2.0.0',
  },

  // 钩子函数
  beforeSendData: (data) => {
    console.log('发送前处理:', data);
    return { ...data, timestamp: Date.now() };
  },
  afterSendData: (result) => {
    console.log('发送后处理:', result);
  },
};

// 重新初始化配置
configManager.resetConfig();
if (configManager.initialize(fullConfig)) {
  console.log('✅ 完整配置初始化成功');

  // 检查功能状态
  console.log('错误监控启用:', configManager.isFeatureEnabled('error'));
  console.log('性能监控启用:', configManager.isFeatureEnabled('performance'));
  console.log('页面访问监控启用:', configManager.isFeatureEnabled('pv'));
  console.log('事件监控启用:', configManager.isFeatureEnabled('event'));

  // 获取特定配置
  console.log('传输配置:', configManager.getTransportConfig());
  console.log('采样配置:', configManager.getSamplingConfig());
  console.log('扩展配置:', configManager.getExtensionsConfig());
} else {
  console.error('❌ 完整配置初始化失败');
}

// 示例3：对象形式的功能配置
const advancedConfig: InitOptions = {
  dsn: 'https://api.example.com/track',
  appName: 'advanced-app',

  // 功能开关 - 对象形式
  error: {
    core: true,
    server: false,
  },
  performance: {
    core: true,
    firstResource: true,
    server: false,
  },
  pv: {
    core: true,
  },
  event: {
    core: false,
  },
};

configManager.resetConfig();
if (configManager.initialize(advancedConfig)) {
  console.log('✅ 高级配置初始化成功');
  console.log('功能配置:', configManager.getConfig('features'));
}

// 示例4：运行时配置更新
configManager.updateConfig('debug', true);
configManager.updateConfig('advanced', {
  ...configManager.getConfig('advanced'),
  recordScreen: true,
});

console.log('更新后的调试模式:', configManager.getConfig('debug'));
console.log('更新后的高级配置:', configManager.getConfig('advanced'));

// 示例5：配置验证失败的情况
const invalidConfig: InitOptions = {
  dsn: '', // 空字符串，验证会失败
  appName: '', // 空字符串，验证会失败
  timeout: -1000, // 负数，验证会失败
  tracesSampleRate: 2, // 超出范围，验证会失败
} as any;

if (!configManager.initialize(invalidConfig)) {
  console.log('✅ 配置验证正确拦截了无效配置');
}

export { configManager };
