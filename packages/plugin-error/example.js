// 错误插件使用示例

// ==================== Vue 使用示例 ====================

// 1. 初始化监控
import { init } from '@hawk-tracker/core';
import { createVueErrorHandler } from '@hawk-tracker/plugin-error';

// 方式一：使用全局实例（推荐）
init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-vue-app',
  version: '1.0.0'
});

// 注册错误处理器（不传参）
Vue.config.errorHandler = createVueErrorHandler();

// 方式二：传参方式
const vueCore = init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-vue-app',
  version: '1.0.0'
});

// 注册错误处理器（传参）
Vue.config.errorHandler = createVueErrorHandler(vueCore);

// ==================== React 使用示例 ====================

import React from 'react';
import { withReactErrorBoundary } from '@hawk-tracker/plugin-error';

// 方式一：使用全局实例（推荐）
init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-react-app',
  version: '1.0.0'
});

// 原始组件
function App() {
  const [count, setCount] = React.useState(0);

  const triggerError = () => {
    throw new Error('这是一个测试错误');
  };

  return (
    <div>
      <h1>React 应用</h1>
      <p>点击次数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={triggerError}>触发错误</button>
    </div>
  );
}

// 包装组件（不传参）
const SafeApp = withReactErrorBoundary()(App);

// 方式二：传参方式
const reactCore = init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-react-app',
  version: '1.0.0'
});

// 包装组件（传参）
const SafeAppWithCore = withReactErrorBoundary(reactCore)(App);

// ==================== 测试错误示例 ====================

// Vue 测试组件
const ErrorTestVue = {
  name: 'ErrorTest',
  template: `
    <div>
      <h1>Vue 错误测试</h1>
      <button @click="testSyncError">测试同步错误</button>
      <button @click="testAsyncError">测试异步错误</button>
    </div>
  `,
  methods: {
    testSyncError() {
      throw new Error('这是一个同步错误测试');
    },
    async testAsyncError() {
      try {
        await fetch('/api/nonexistent');
      } catch (error) {
        throw new Error('异步错误测试: ' + error.message);
      }
    }
  }
};

// React 测试组件
function ErrorTestReact() {
  const testSyncError = () => {
    throw new Error('这是一个同步错误测试');
  };

  const testAsyncError = async () => {
    try {
      await fetch('/api/nonexistent');
    } catch (error) {
      throw new Error('异步错误测试: ' + error.message);
    }
  };

  return (
    <div>
      <h1>React 错误测试</h1>
      <button onClick={testSyncError}>测试同步错误</button>
      <button onClick={testAsyncError}>测试异步错误</button>
    </div>
  );
}

// 包装 React 测试组件
const SafeErrorTestReact = withReactErrorBoundary()(ErrorTestReact);

// ==================== 环境配置示例 ====================

// 根据环境调整配置
const getConfig = () => {
  const baseConfig = {
    appId: 'my-app',
    version: '1.0.0'
  };

  if (process.env.NODE_ENV === 'development') {
    return {
      ...baseConfig,
      dsn: 'https://dev-server.com/collect',
      debug: true,
      sampleRate: 1.0 // 开发环境全量采集
    };
  }

  return {
    ...baseConfig,
    dsn: 'https://prod-server.com/collect',
    debug: false,
    sampleRate: 0.1 // 生产环境采样 10%
  };
};

// 使用环境配置
const config = getConfig();
init(config);

// ==================== 错误边界粒度控制示例 ====================

// React 应用中为不同组件设置错误边界
const SafeHeader = withReactErrorBoundary()(Header);
const SafeMainContent = withReactErrorBoundary()(MainContent);
const SafeFooter = withReactErrorBoundary()(Footer);

function AppWithErrorBoundaries() {
  return (
    <div>
      <SafeHeader />
      <SafeMainContent />
      <SafeFooter />
    </div>
  );
}

// 这样即使某个组件出错，其他组件仍然正常工作 