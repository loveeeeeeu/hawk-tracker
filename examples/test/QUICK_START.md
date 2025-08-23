# Hawk Tracker Core 行为栈系统 - 快速开始指南

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 构建核心包

```bash
pnpm run build
```

### 3. 启动测试环境

```bash
cd examples/test
pnpm dev
```

然后在浏览器中打开 `http://localhost:3000` 查看控制台输出。

## 📖 基本使用

### 初始化 SDK

```typescript
import { init } from '@hawk-tracker/core';

const tracker = init({
  dsn: 'https://your-dsn.com',
  appName: 'MyApp',
  behavior: {
    core: true,
    maxSize: 200,
    maxAge: 5 * 60 * 1000,
    debug: true,
  },
});
```

### 使用行为栈

```typescript
// 获取默认栈
const defaultStack = tracker.getBehaviorStack();

// 创建自定义栈
const customStack = tracker.createBehaviorStack('custom', {
  maxSize: 100,
  maxAge: 10 * 60 * 1000,
});

// 添加事件
defaultStack.addCustomEvent('user_action', {
  action: 'button_click',
  buttonId: 'submit-btn',
});

// 获取快照
const events = defaultStack.getSnapshot({ maxCount: 10 });

// 获取统计信息
const stats = defaultStack.getStats();
```

### 创建插件

```typescript
import {
  BasePlugin,
  LISTEN_TYPES,
  SEND_TYPES,
  getGlobalHawkTracker,
} from '@hawk-tracker/core';

export class MyPlugin extends BasePlugin {
  private behaviorStack: any;

  constructor(options: any = {}) {
    super(SEND_TYPES.BEHAVIOR);

    const globalTracker = getGlobalHawkTracker();
    this.behaviorStack = globalTracker.createBehaviorStack(
      options.stackName || 'my_plugin',
      options,
    );
  }

  install(core: any) {
    core.eventCenter.subscribeEvent({
      type: LISTEN_TYPES.CLICK,
      callback: this.handleClick.bind(this),
    });
  }

  private handleClick(event: any) {
    this.behaviorStack.addEvent({
      type: LISTEN_TYPES.CLICK,
      pageUrl: window.location.href,
      context: {
        element: {
          tagName: event.target.tagName,
          id: event.target.id,
        },
      },
    });
  }
}
```

## 🔧 配置选项

### 全局配置

```typescript
const config = {
  behavior: {
    core: true, // 启用行为栈管理
    maxSize: 200, // 默认最大事件数量
    maxAge: 5 * 60 * 1000, // 默认最大事件年龄（5分钟）
    debug: true, // 开启调试模式
  },
};
```

### 栈级配置

```typescript
const stackConfig = {
  maxSize: 100, // 最大事件数量
  maxAge: 5 * 60 * 1000, // 最大事件年龄（毫秒）
  debug: false, // 调试模式
  name: 'custom_stack', // 栈名称
  filter: (event) => {
    // 自定义过滤器
    return event.type !== 'debug';
  },
};
```

## 📊 监控和调试

### 开启调试模式

```typescript
const config = {
  behavior: {
    debug: true, // 开启调试模式
  },
};
```

### 监控栈状态

```typescript
// 定期检查栈状态
setInterval(() => {
  const stats = stack.getStats();
  console.log('栈状态:', {
    name: stats.name,
    currentEvents: stats.currentEvents,
    totalEvents: stats.totalEvents,
    typeDistribution: stats.typeDistribution,
  });
}, 30000);
```

## 🎯 最佳实践

### 1. 栈命名规范

```typescript
// 使用有意义的名称
const errorStack = tracker.createBehaviorStack('error_tracking');
const userStack = tracker.createBehaviorStack('user_behavior');
const perfStack = tracker.createBehaviorStack('performance_metrics');
```

### 2. 配置优化

```typescript
// 根据用途配置不同的参数
const errorStack = tracker.createBehaviorStack('error_tracking', {
  maxSize: 50, // 错误栈不需要太多事件
  maxAge: 10 * 60 * 1000, // 错误信息保留更长时间
});

const userStack = tracker.createBehaviorStack('user_behavior', {
  maxSize: 500, // 用户行为栈需要更多事件
  maxAge: 5 * 60 * 1000, // 用户行为信息保留较短时间
});
```

### 3. 事件过滤

```typescript
// 使用过滤器减少无用事件
const filteredStack = tracker.createBehaviorStack('filtered_events', {
  filter: (event) => {
    // 过滤掉调试事件
    if (event.type === 'debug') return false;

    // 过滤掉空内容的事件
    if (!event.context || Object.keys(event.context).length === 0) return false;

    return true;
  },
});
```

## 🐛 常见问题

### Q: 如何查看所有栈的状态？

```typescript
const manager = tracker.behaviorStackManager;
console.log('栈数量:', manager.getBehaviorStackCount());
console.log('所有栈名称:', manager.getBehaviorStackNames());
console.log('所有栈统计:', manager.getAllBehaviorStackStats());
```

### Q: 如何清理过期数据？

```typescript
// 行为栈会自动清理过期数据
// 也可以手动清理
stack.clear();
```

### Q: 如何销毁不需要的栈？

```typescript
tracker.behaviorStackManager.destroyBehaviorStack('stack_name');
```

### Q: 如何获取特定类型的事件？

```typescript
const events = stack.getSnapshot({
  includeTypes: ['click', 'load'],
  maxCount: 20,
});
```

## 📚 更多信息

- [完整文档](./packages/core/README.md)
- [API 参考](./packages/core/README.md#核心类详解)
- [插件开发指南](./packages/core/README.md#插件开发指南)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
