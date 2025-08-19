# Vue3 监控系统集成指南

本文档详细说明如何在Vue3应用中集成 `@hawk-tracker/core` 和 `@hawk-tracker/plugin-error` 监控系统。

## 📋 目录

1. [集成方式对比](#集成方式对比)
2. [源码引用集成](#源码引用集成)
3. [非源码引用集成](#非源码引用集成)
4. [配置详解](#配置详解)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)

## 🔄 集成方式对比

| 特性         | 源码引用             | 非源码引用          |
| ------------ | -------------------- | ------------------- |
| **使用场景** | Monorepo工作空间开发 | 独立项目或生产环境  |
| **依赖管理** | `workspace:*`        | 具体版本号 `^1.0.0` |
| **调试能力** | 可直接调试源码       | 需要source map      |
| **构建速度** | 需要编译依赖包       | 使用预构建包        |
| **版本控制** | 自动同步             | 手动更新            |
| **发布要求** | 无需发布             | 需要发布到npm       |

## 🔧 源码引用集成

### 1. 项目结构要求

确保你的项目在monorepo工作空间中：

```
hawk-tracker/
├── packages/
│   ├── core/           # @hawk-tracker/core
│   └── plugin-error/   # @hawk-tracker/plugin-error
├── apps/
│   └── your-vue-app/   # 你的Vue3应用
└── pnpm-workspace.yaml
```

### 2. 配置依赖

**package.json:**

```json
{
  "name": "your-vue-app",
  "dependencies": {
    "vue": "^3.4.0",
    "@hawk-tracker/core": "workspace:*",
    "@hawk-tracker/plugin-error": "workspace:*"
  }
}
```

### 3. 初始化监控

**src/main.ts:**

```typescript
import { createApp } from 'vue';
import { init as initHawkTracker } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

// 初始化监控系统
const hawkTracker = initHawkTracker({
  dsn: 'https://your-api-endpoint.com/track',
  appName: 'your-vue-app',
  appVersion: '1.0.0',
  debug: true,
  sampleRate: 1.0,
});

// 安装错误监控插件
hawkTracker.use(ErrorPlugin, {
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
});

const app = createApp(App);
app.mount('#app');
```

### 4. 构建和运行

```bash
# 安装依赖
pnpm install

# 构建依赖包
pnpm run build --filter @hawk-tracker/core
pnpm run build --filter @hawk-tracker/plugin-error

# 启动Vue应用
pnpm run dev
```

## 📦 非源码引用集成

### 1. 安装npm包

```bash
# 使用npm
npm install @hawk-tracker/core @hawk-tracker/plugin-error

# 使用yarn
yarn add @hawk-tracker/core @hawk-tracker/plugin-error

# 使用pnpm
pnpm add @hawk-tracker/core @hawk-tracker/plugin-error
```

### 2. 配置依赖

**package.json:**

```json
{
  "name": "your-vue-app",
  "dependencies": {
    "vue": "^3.4.0",
    "@hawk-tracker/core": "^1.0.0",
    "@hawk-tracker/plugin-error": "^1.0.0"
  }
}
```

### 3. 初始化监控

代码与源码引用方式完全相同：

**src/main.ts:**

```typescript
import { createApp } from 'vue';
import { init as initHawkTracker } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

const hawkTracker = initHawkTracker({
  dsn: 'https://your-api-endpoint.com/track',
  appName: 'your-vue-app',
  appVersion: '1.0.0',
  debug: false, // 生产环境建议关闭
  sampleRate: 0.1, // 生产环境建议降低采样率
});

hawkTracker.use(ErrorPlugin, {
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
});
```

## ⚙️ 配置详解

### 核心配置选项

```typescript
interface MonitorConfig {
  // 必需配置
  dsn: string; // 数据上报地址
  appName: string; // 应用名称
  appVersion: string; // 应用版本

  // 基础配置
  debug?: boolean; // 调试模式，默认false
  sampleRate?: number; // 采样率 0-1，默认1.0
  timeout?: number; // 请求超时时间，默认5000ms
  maxQueueLength?: number; // 最大队列长度，默认100

  // 高级配置
  beforeSendData?: (data: any) => any; // 数据发送前处理
  afterSendData?: (result: any) => void; // 数据发送后处理
}
```

### 错误插件配置

```typescript
interface ErrorPluginConfig {
  captureUnhandledRejections?: boolean; // 捕获未处理的Promise拒绝
  captureConsoleErrors?: boolean; // 捕获console.error
  maxStackTraceLength?: number; // 最大堆栈跟踪长度
  filterErrors?: (error: Error) => boolean; // 错误过滤器
}
```

### 环境变量配置

创建 `.env.local` 文件：

```bash
# 开发环境
VITE_MONITOR_DSN=https://dev-api.your-domain.com/track
VITE_APP_NAME=your-vue-app
VITE_APP_VERSION=1.0.0-dev
VITE_DEBUG_MODE=true
VITE_SAMPLE_RATE=1.0
```

创建 `.env.production` 文件：

```bash
# 生产环境
VITE_MONITOR_DSN=https://api.your-domain.com/track
VITE_APP_NAME=your-vue-app
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=false
VITE_SAMPLE_RATE=0.1
```

### 动态配置加载

**src/monitor-config.ts:**

```typescript
export const getMonitorConfig = () => {
  return {
    dsn: import.meta.env.VITE_MONITOR_DSN || 'https://default-api.com/track',
    appName: import.meta.env.VITE_APP_NAME || 'unknown-app',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    debug: import.meta.env.VITE_DEBUG_MODE === 'true',
    sampleRate: parseFloat(import.meta.env.VITE_SAMPLE_RATE || '1.0'),
  };
};
```

## 🎯 Vue集成最佳实践

### 1. 全局错误处理

```typescript
// main.ts
const app = createApp(App);

// Vue组件错误处理
app.config.errorHandler = (err: any, instance: any, info: string) => {
  console.error('Vue Error:', err, info);

  hawkTracker.track('error', {
    message: err.message,
    stack: err.stack,
    componentInfo: info,
    type: 'vue-component-error',
    timestamp: Date.now(),
  });
};

// 全局警告处理（开发环境）
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg: string, instance: any, trace: string) => {
    console.warn('Vue Warning:', msg, trace);
  };
}
```

### 2. 路由监控

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [...],
});

// 路由变化监控
router.beforeEach((to, from, next) => {
  hawkTracker.track('navigation', {
    from: from.fullPath,
    to: to.fullPath,
    timestamp: Date.now(),
  });
  next();
});

// 路由错误监控
router.onError((error) => {
  hawkTracker.track('error', {
    message: error.message,
    stack: error.stack,
    type: 'router-error',
    timestamp: Date.now(),
  });
});
```

### 3. 组件级监控

```vue
<!-- ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong</h2>
    <button @click="retry">Retry</button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);

onErrorCaptured((error: Error, instance: any, info: string) => {
  hasError.value = true;

  // 上报错误
  hawkTracker.track('error', {
    message: error.message,
    stack: error.stack,
    componentInfo: info,
    type: 'component-boundary-error',
    timestamp: Date.now(),
  });

  return false; // 阻止错误继续传播
});

const retry = () => {
  hasError.value = false;
};
</script>
```

### 4. 性能监控

```typescript
// composables/usePerformance.ts
import { onMounted } from 'vue';

export function usePerformance(componentName: string) {
  onMounted(() => {
    // 组件挂载性能监控
    const mountTime = performance.now();

    hawkTracker.track('performance', {
      type: 'component-mount',
      componentName,
      mountTime,
      timestamp: Date.now(),
    });
  });
}
```

## 🚀 部署配置

### 开发环境

```bash
# 启动开发服务器
npm run dev

# 构建开发版本
npm run build:dev
```

### 生产环境

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### Docker部署

**Dockerfile:**

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ❓ 常见问题

### Q1: 如何在TypeScript中获得完整的类型支持？

A: 确保安装了类型定义：

```typescript
// 如果使用源码引用，类型会自动包含
// 如果使用npm包，确保包含了.d.ts文件

// 全局类型声明
declare global {
  interface Window {
    __HAWK_TRACKER__: any;
  }
}
```

### Q2: 如何处理监控系统自身的错误？

A: 使用try-catch包装监控代码：

```typescript
try {
  hawkTracker.track('error', errorData);
} catch (monitorError) {
  console.error('Monitor system error:', monitorError);
  // 不要再次上报监控系统的错误，避免循环
}
```

### Q3: 如何在Vite构建中优化包大小？

A: 使用动态导入和tree-shaking：

```typescript
// 动态导入插件
const loadErrorPlugin = async () => {
  const { ErrorPlugin } = await import('@hawk-tracker/plugin-error');
  return ErrorPlugin;
};

// 条件加载
if (import.meta.env.PROD) {
  const ErrorPlugin = await loadErrorPlugin();
  hawkTracker.use(ErrorPlugin, config);
}
```

### Q4: 如何测试监控系统是否正常工作？

A: 创建测试页面：

```vue
<template>
  <div>
    <button @click="triggerError">测试错误</button>
    <button @click="triggerCustomEvent">测试自定义事件</button>
  </div>
</template>

<script setup lang="ts">
const triggerError = () => {
  throw new Error('测试错误');
};

const triggerCustomEvent = () => {
  hawkTracker.track('test', {
    message: '测试自定义事件',
    timestamp: Date.now(),
  });
};
</script>
```

## 📞 技术支持

如果在集成过程中遇到问题，请：

1. 检查控制台是否有错误信息
2. 确认网络请求是否正常发送
3. 验证配置参数是否正确
4. 查看本项目的示例代码
5. 提交Issue到项目仓库
