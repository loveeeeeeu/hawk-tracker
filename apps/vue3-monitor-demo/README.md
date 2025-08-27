# Vue3 监控系统集成演示

这个项目演示了如何在Vue3应用中集成 `@hawk-tracker/core` 和 `@hawk-tracker/plugin-error` 进行前端监控。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 在项目根目录下安装依赖
pnpm install
```

### 2. 启动开发服务器

```bash
# 启动Vue3演示应用
cd apps/vue3-monitor-demo
pnpm dev
```

## 📦 集成方式

### 方式一：源码引用（Monorepo 工作空间）

在 monorepo 工作空间中，可以直接引用 workspace 包：

#### package.json 配置

```json
{
  "dependencies": {
    "@hawk-tracker/core": "workspace:*",
    "@hawk-tracker/plugin-error": "workspace:*"
  }
}
```

#### 代码中使用

```typescript
// main.ts
import { init as initHawkTracker } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

// 初始化监控系统
const hawkTracker = initHawkTracker({
  dsn: 'https://your-api-endpoint.com/track',
  appName: 'vue3-monitor-demo',
  appVersion: '1.0.0',
  debug: true,
  sampleRate: 1.0,
});

// 安装错误监控插件
hawkTracker.use(ErrorPlugin, {
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
});
```

### 方式二：非源码引用（NPM 包）

如果包已发布到 npm，可以这样引用：

#### package.json 配置

```json
{
  "dependencies": {
    "@hawk-tracker/core": "^1.0.0",
    "@hawk-tracker/plugin-error": "^1.0.0"
  }
}
```

#### 代码中使用

```typescript
// main.ts
import { init as initHawkTracker } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

// 使用方式完全相同
const hawkTracker = initHawkTracker({
  dsn: 'https://your-api-endpoint.com/track',
  appName: 'your-app-name',
  appVersion: '1.0.0',
  debug: false, // 生产环境建议关闭
  sampleRate: 0.1, // 生产环境建议降低采样率
});

hawkTracker.use(ErrorPlugin, {
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
});
```

## 🔧 详细配置

### 核心配置选项

```typescript
const hawkTracker = initHawkTracker({
  // 必需配置
  dsn: 'https://your-api-endpoint.com/track', // 数据上报地址
  appName: 'your-app-name', // 应用名称
  appVersion: '1.0.0', // 应用版本

  // 可选配置
  debug: true, // 调试模式
  sampleRate: 1.0, // 采样率 (0-1)
  timeout: 5000, // 请求超时时间
  maxQueueLength: 100, // 最大队列长度

  // 高级配置
  beforeSendData: (data) => {
    // 数据发送前的处理
    console.log('发送数据:', data);
    return data;
  },
  afterSendData: (result) => {
    // 数据发送后的处理
    console.log('发送结果:', result);
  },
});
```

### 错误插件配置

```typescript
hawkTracker.use(ErrorPlugin, {
  captureUnhandledRejections: true, // 捕获未处理的Promise拒绝
  captureConsoleErrors: true, // 捕获console.error
  maxStackTraceLength: 50, // 最大堆栈跟踪长度
  filterErrors: (error) => {
    // 错误过滤器
    // 返回 false 表示不上报该错误
    return !error.message.includes('Script error');
  },
});
```

## 🎯 功能演示

### 1. 错误监控

访问 `/error-demo` 页面可以测试各种类型的错误监控：

- **JavaScript 错误**：引用错误、类型错误、语法错误、范围错误
- **Promise 错误**：未处理的Promise拒绝、异步函数错误
- **Vue 组件错误**：组件渲染错误、生命周期错误
- **网络错误**：Fetch 错误、XHR 错误
- **资源加载错误**：图片加载错误、脚本加载错误

### 2. 手动上报

```typescript
// 在组件中手动上报自定义事件
const testManualTracking = () => {
  hawkTracker.track('custom', {
    event: 'user_action',
    data: {
      action: 'button_click',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    },
  });
};
```

### 3. Vue 错误处理

```typescript
// 全局错误处理器
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info);

  // 手动上报错误到监控系统
  hawkTracker.track('error', {
    message: err.message,
    stack: err.stack,
    info,
    type: 'vue-error',
  });
};
```

## 📁 项目结构

```
vue3-monitor-demo/
├── src/
│   ├── main.ts           # 应用入口，监控系统初始化
│   ├── App.vue           # 根组件
│   └── views/
│       ├── Home.vue      # 首页，展示集成方式
│       ├── ErrorDemo.vue # 错误监控演示
│       └── PerformanceDemo.vue # 性能监控演示
├── package.json          # 依赖配置
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 说明文档
```

## 🔍 监控数据格式

### 错误数据格式

```typescript
{
  type: 'error',
  subType: 'javascript-error',
  data: {
    message: '错误消息',
    stack: '错误堆栈',
    filename: '文件名',
    lineno: 行号,
    colno: 列号,
    timestamp: 时间戳,
    userAgent: '用户代理',
    url: '当前页面URL'
  }
}
```

### 自定义事件数据格式

```typescript
{
  type: 'custom',
  subType: 'user-defined',
  data: {
    event: '事件名称',
    // 自定义数据...
  }
}
```

## 🚀 部署说明

### 开发环境

```bash
# 启动开发服务器
pnpm dev
```

### 生产环境

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 环境变量配置

```bash
# .env.production
VITE_MONITOR_DSN=https://your-production-api.com/track
VITE_APP_NAME=your-app-name
VITE_APP_VERSION=1.0.0
```

## 📝 注意事项

1. **采样率设置**：生产环境建议设置较低的采样率（如 0.1）以减少服务器压力
2. **错误过滤**：建议过滤掉一些无用的错误信息，如跨域脚本错误
3. **数据脱敏**：上报数据前注意脱敏处理，避免泄露敏感信息
4. **性能影响**：监控系统应该尽量减少对应用性能的影响
5. **错误处理**：监控系统本身的错误不应该影响主应用的正常运行

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个演示项目。

## �� 许可证

MIT License
