# Hawk Tracker 前端监控集成指南

## 概述

本文档说明如何在 React 应用中集成 Hawk Tracker 前端监控系统，包括错误监控、性能监控和用户行为监控。

## 已集成功能

### 1. 核心监控功能

- ✅ **错误监控**: 自动捕获 JavaScript 错误、Promise 异常和未处理的错误
- ✅ **性能监控**: 收集页面加载时间、资源加载性能等指标
- ✅ **行为监控**: 记录用户点击、页面访问等行为数据
- ✅ **自定义事件**: 支持业务自定义事件上报

### 2. 技术架构

- **@hawk-tracker/core**: 核心监控引擎
- **@hawk-tracker/plugin-error**: 错误监控插件
- **React Hook**: 提供便捷的监控功能调用接口
- **TypeScript**: 完整的类型支持

## 文件结构

```
app/
├── monitor.ts              # 监控初始化配置
├── hooks/
│   └── useMonitor.ts      # React Hook 监控接口
├── routes/
│   └── monitor-demo.tsx   # 监控功能演示页面
└── root.tsx               # 应用根组件，集成监控初始化
```

## 使用方法

### 1. 基础使用

监控系统会在应用启动时自动初始化，无需额外配置：

```typescript
// 在 root.tsx 中自动初始化
useEffect(() => {
  initMonitor();
}, []);
```

### 2. 在组件中使用监控

```typescript
import { useMonitor } from '../hooks/useMonitor';

function MyComponent() {
  const { trackError, trackEvent, trackPageView, trackClick } = useMonitor();

  // 手动上报错误
  const handleError = () => {
    try {
      // 可能出错的代码
    } catch (error) {
      trackError(error, { context: 'MyComponent' });
    }
  };

  // 上报自定义事件
  const handleCustomEvent = () => {
    trackEvent('button_click', {
      buttonName: '提交按钮',
      userId: 'user123'
    });
  };

  // 记录页面访问
  useEffect(() => {
    trackPageView('我的页面');
  }, []);

  return (
    <button onClick={() => trackClick('submit-button')}>
      提交
    </button>
  );
}
```

### 3. 错误边界集成

应用的 ErrorBoundary 已经集成了错误上报：

```typescript
// 在 ErrorBoundary 中自动上报错误
useEffect(() => {
  if (error instanceof Error) {
    reportError(error, {
      context: 'ErrorBoundary',
      url: window.location.href,
    });
  }
}, [error]);
```

## 配置选项

### 监控配置

在 `monitor.ts` 中可以调整监控配置：

```typescript
const monitorConfig = {
  dsn: 'http://localhost:3001/api/track', // 上报地址
  appName: 'hawk-tracker-web', // 应用名称
  appCode: 'HTW001', // 应用代码
  appVersion: '1.0.0', // 应用版本
  debug: process.env.NODE_ENV === 'development', // 调试模式
  sampleRate: 1.0, // 采样率（0-1）
};
```

### 环境配置

- **开发环境**: 启用调试模式，采样率 100%
- **生产环境**: 关闭调试模式，可调整采样率降低数据量

## API 参考

### useMonitor Hook

| 方法                              | 参数                          | 描述           |
| --------------------------------- | ----------------------------- | -------------- |
| `trackError(error, extra?)`       | error: Error, extra?: any     | 上报错误信息   |
| `trackEvent(name, data)`          | name: string, data: any       | 上报自定义事件 |
| `trackPageView(pageName, extra?)` | pageName: string, extra?: any | 记录页面访问   |
| `trackClick(element, extra?)`     | element: string, extra?: any  | 记录点击行为   |
| `trackPerformance(metrics)`       | metrics: any                  | 上报性能指标   |

### 直接调用方法

```typescript
import { reportError, reportCustomEvent } from './monitor';

// 上报错误
reportError(new Error('Something went wrong'), { context: 'global' });

// 上报自定义事件
reportCustomEvent('user_action', { action: 'login', userId: '123' });
```

## 演示页面

访问 `/monitor-demo` 可以查看监控功能的完整演示，包括：

- 错误监控测试
- 自定义事件上报
- 行为监控记录
- 异步错误处理
- 实时日志显示

## 注意事项

1. **数据上报**: 确保后端服务器能够正确处理监控数据
2. **采样率**: 生产环境建议设置合适的采样率以控制数据量
3. **隐私保护**: 避免在监控数据中包含敏感用户信息
4. **性能影响**: 监控系统设计为轻量级，对应用性能影响最小

## 故障排除

### 常见问题

1. **监控数据未上报**
   - 检查 `dsn` 配置是否正确
   - 确认网络连接正常
   - 查看浏览器控制台是否有错误信息

2. **类型错误**
   - 确保已安装相关依赖包
   - 检查 TypeScript 配置

3. **插件加载失败**
   - 确认插件包已正确安装
   - 检查插件初始化代码

### 调试模式

开发环境下启用调试模式可以在控制台看到详细的监控信息：

```typescript
debug: true; // 在 monitorConfig 中设置
```

## 扩展功能

### 添加新的监控插件

```typescript
import { MyCustomPlugin } from '@hawk-tracker/plugin-custom';

// 在 initMonitor 中添加
hawkTracker.use(MyCustomPlugin, {
  // 插件配置
});
```

### 自定义数据处理

可以在配置中添加钩子函数来自定义数据处理逻辑：

```typescript
const monitorConfig = {
  // ... 其他配置
  beforeSendData: (data) => {
    // 数据发送前处理
    return { ...data, timestamp: Date.now() };
  },
  afterSendData: (result) => {
    // 数据发送后处理
    console.log('数据发送结果:', result);
  },
};
```
