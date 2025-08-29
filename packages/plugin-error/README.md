# Error Plugin - 错误监控插件

错误监控插件为 Vue 和 React 应用提供完整的错误捕获和上报功能。

## 功能特性

- ✅ **Vue 错误捕获**：自动捕获 Vue 组件错误
- ✅ **React 错误边界**：提供 React 错误边界包装器
- ✅ **全局实例支持**：支持全局单例和传参两种方式
- ✅ **错误上下文**：自动收集组件信息和错误堆栈
- ✅ **容错保护**：错误处理器本身不会抛出异常

## 安装

```bash
npm install @hawk-tracker/plugin-error
# 或
yarn add @hawk-tracker/plugin-error
# 或
pnpm add @hawk-tracker/plugin-error
```

## 快速开始

### 1. 初始化监控核心

```javascript
import { init } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

// 初始化全局监控实例
const core = init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-app',
  version: '1.0.0',
});

// 安装错误插件
core.use(new ErrorPlugin());
```

### 2. Vue 集成

#### 方式一：使用全局实例（推荐）

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import { createVueErrorHandler } from '@hawk-tracker/plugin-error';

// 初始化监控（在应用启动前）
import { init } from '@hawk-tracker/core';
init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-app',
  version: '1.0.0',
});

// 注册错误处理器（不传参，自动使用全局实例）
Vue.config.errorHandler = createVueErrorHandler();

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

#### 方式二：传参方式

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import { createVueErrorHandler } from '@hawk-tracker/plugin-error';

// 初始化监控
const core = init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-app',
  version: '1.0.0',
});

// 注册错误处理器（传入 core 实例）
Vue.config.errorHandler = createVueErrorHandler(core);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

### 3. React 集成

#### 方式一：使用全局实例（推荐）

```javascript
// App.jsx
import React from 'react';
import { withReactErrorBoundary } from '@hawk-tracker/plugin-error';

// 初始化监控（在应用启动前）
import { init } from '@hawk-tracker/core';
init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-app',
  version: '1.0.0',
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

// 包装组件（不传参，自动使用全局实例）
const SafeApp = withReactErrorBoundary()(App);

export default SafeApp;
```

#### 方式二：传参方式

```javascript
// App.jsx
import React from 'react';
import { withReactErrorBoundary } from '@hawk-tracker/plugin-error';

// 初始化监控
const core = init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-app',
  version: '1.0.0',
});

function App() {
  // 组件逻辑...
}

// 包装组件（传入 core 实例）
const SafeApp = withReactErrorBoundary(core)(App);

export default SafeApp;
```

## 高级配置

### 错误插件配置

```javascript
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

const errorPlugin = new ErrorPlugin({
  // 行为栈名称
  behaviorStackName: 'user_behavior',
  // 行为快照数量
  behaviorSnapshotCount: 50,
  // 是否附加录屏数据
  attachRrweb: true,
  // 录屏事件最大数量
  rrwebMaxSize: 200,
  // 应用 ID
  appId: 'my-app',
  // 应用版本
  version: '1.0.0',
});

core.use(errorPlugin);
```

### 环境配置

```javascript
// 根据环境调整配置
const config = {
  dsn:
    process.env.NODE_ENV === 'production'
      ? 'https://prod-server.com/collect'
      : 'https://dev-server.com/collect',
  appId: 'my-app',
  version: process.env.VUE_APP_VERSION || '1.0.0',
  debug: process.env.NODE_ENV === 'development',
};

const core = init(config);
```

## 错误数据格式

### Vue 错误数据

```javascript
{
  "type": "error",
  "subType": "vue",
  "data": {
    "message": "错误消息",
    "name": "VueError",
    "stack": "错误堆栈信息",
    "context": {
      "componentName": "组件名称",
      "propsData": "组件属性数据",
      "info": "错误信息"
    },
    "pageUrl": "页面 URL",
    "userAgent": "用户代理",
    "behaviorSnapshot": "用户行为快照",
    "rrwebSnapshot": "录屏快照"
  }
}
```

### React 错误数据

```javascript
{
  "type": "error",
  "subType": "react",
  "data": {
    "message": "错误消息",
    "name": "ReactError",
    "stack": "错误堆栈信息",
    "context": {
      "componentStack": "组件堆栈信息"
    },
    "pageUrl": "页面 URL",
    "userAgent": "用户代理",
    "behaviorSnapshot": "用户行为快照",
    "rrwebSnapshot": "录屏快照"
  }
}
```

## 测试错误

### Vue 测试

```vue
<template>
  <div>
    <h1>Vue 错误测试</h1>
    <button @click="testSyncError">测试同步错误</button>
    <button @click="testAsyncError">测试异步错误</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorTest',
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
    },
  },
};
</script>
```

### React 测试

```javascript
function ErrorTest() {
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

// 包装组件
const SafeErrorTest = withReactErrorBoundary()(ErrorTest);
```

## 最佳实践

### 1. 初始化时机

```javascript
// ✅ 推荐：在应用启动前初始化
import { init } from '@hawk-tracker/core';

// 在 main.js 或 index.js 的最开始
init({
  dsn: 'https://your-server.com/collect',
  appId: 'my-app',
  version: '1.0.0'
});

// 然后启动应用
new Vue({...}).$mount('#app');
```

### 2. 错误边界粒度

```javascript
// ✅ 推荐：为关键组件单独包装错误边界
const SafeHeader = withReactErrorBoundary()(Header);
const SafeMainContent = withReactErrorBoundary()(MainContent);
const SafeFooter = withReactErrorBoundary()(Footer);

function App() {
  return (
    <div>
      <SafeHeader />
      <SafeMainContent />
      <SafeFooter />
    </div>
  );
}
```

### 3. 环境配置

```javascript
// ✅ 推荐：根据环境调整配置
const config = {
  dsn:
    process.env.NODE_ENV === 'production'
      ? 'https://prod-server.com/collect'
      : 'https://dev-server.com/collect',
  debug: process.env.NODE_ENV === 'development',
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
};
```

## 常见问题

### Q: 错误处理器会影响应用性能吗？

A: 不会。错误处理器采用异步处理，不会阻塞主线程，且只在错误发生时才会执行。

### Q: 如何验证错误监控是否生效？

A: 可以通过以下方式验证：

1. 触发一个测试错误
2. 查看浏览器开发者工具的 Network 标签页
3. 检查是否向配置的服务器发送了请求
4. 查看服务器日志是否收到错误数据

### Q: 支持哪些 Vue 版本？

A: 支持 Vue 2.x 和 Vue 3.x 版本。

### Q: 支持哪些 React 版本？

A: 支持 React 16.3+ 版本（需要错误边界功能）。

### Q: 错误数据会包含敏感信息吗？

A: 默认情况下会收集页面 URL 和用户代理信息。如需保护隐私，可以在配置中禁用相关功能。

## API 参考

### createVueErrorHandler(core?)

创建 Vue 错误处理器。

**参数：**

- `core?` (any): 监控核心实例，可选。如果不传，将使用全局实例。

**返回值：**

- `Function`: Vue 错误处理函数，可直接赋值给 `Vue.config.errorHandler`。

### withReactErrorBoundary(core?)

创建 React 错误边界包装器。

**参数：**

- `core?` (any): 监控核心实例，可选。如果不传，将使用全局实例。

**返回值：**

- `Function`: 高阶组件函数，接收组件作为参数，返回包装后的组件。

## 更新日志

### v1.0.0

- 初始版本发布
- 支持 Vue 错误捕获
- 支持 React 错误边界
- 支持全局实例和传参两种方式
