# Hawk Tracker Core - 行为栈系统

## 概述

Hawk Tracker Core 现在集成了强大的行为栈管理系统，提供统一的行为事件收集、存储和管理功能。行为栈系统位于核心级别，所有插件都可以使用它来记录和管理用户行为数据。

## 架构设计

### 核心组件

1. **BehaviorStack** - 单个行为栈实例
2. **BehaviorStackManager** - 行为栈管理器
3. **HawkTracker** - 核心跟踪器类

### 设计优势

- **统一管理**: 所有行为栈在核心级别统一管理
- **插件自由**: 插件可以自由创建、配置和使用行为栈
- **数据隔离**: 不同插件使用不同的栈，数据完全隔离
- **配置灵活**: 每个栈可以有独立的配置参数
- **扩展性强**: 支持多栈、自定义配置、灵活扩展

## 核心类详解

### BehaviorStack

行为栈的核心类，提供事件存储和管理功能。

```typescript
import { BehaviorStack } from '@hawk-tracker/core';

// 创建行为栈
const stack = new BehaviorStack({
  maxSize: 100, // 最大事件数量
  maxAge: 5 * 60 * 1000, // 最大事件年龄（5分钟）
  debug: true, // 开启调试模式
  name: 'my_stack', // 栈名称
  filter: (event) => event.type !== 'debug', // 自定义过滤器
});
```

#### 主要方法

- `addEvent(event)` - 添加事件
- `addCustomEvent(type, data, context)` - 添加自定义事件
- `getSnapshot(options)` - 获取事件快照
- `getStats()` - 获取统计信息
- `clear()` - 清空栈
- `destroy()` - 销毁栈

### BehaviorStackManager

行为栈管理器，统一管理多个行为栈实例。

```typescript
import { BehaviorStackManager } from '@hawk-tracker/core';

// 创建管理器
const manager = new BehaviorStackManager({
  maxSize: 100,
  maxAge: 5 * 60 * 1000,
  debug: true,
});

// 创建新栈
const errorStack = manager.createBehaviorStack('error_stack', {
  maxSize: 50,
  maxAge: 10 * 60 * 1000,
});

// 获取栈
const stack = manager.getBehaviorStack('error_stack');
```

#### 主要方法

- `createBehaviorStack(name, config)` - 创建新栈
- `getBehaviorStack(name)` - 获取栈
- `getOrCreateBehaviorStack(name, config)` - 获取或创建栈
- `destroyBehaviorStack(name)` - 销毁栈
- `getAllBehaviorStackStats()` - 获取所有栈统计信息

### HawkTracker

核心跟踪器类，集成了行为栈管理器。

```typescript
import { init } from '@hawk-tracker/core';

// 初始化
const tracker = init({
  dsn: 'https://your-dsn.com',
  appName: 'MyApp',
  behavior: {
    core: true,
    maxSize: 200,
    maxAge: 10 * 60 * 1000,
    debug: true,
  },
});

// 使用行为栈
const defaultStack = tracker.getBehaviorStack();
const customStack = tracker.createBehaviorStack('custom', {
  maxSize: 500,
  maxAge: 15 * 60 * 1000,
});
```

## 插件开发指南

### 创建行为监控插件

```typescript
import {
  BasePlugin,
  LISTEN_TYPES,
  SEND_TYPES,
  getGlobalHawkTracker,
} from '@hawk-tracker/core';

export class MyBehaviorPlugin extends BasePlugin {
  private behaviorStack: any;

  constructor(options: any = {}) {
    super(SEND_TYPES.BEHAVIOR);

    // 获取全局跟踪器
    const globalTracker = getGlobalHawkTracker();

    // 创建专用的行为栈
    this.behaviorStack = globalTracker.createBehaviorStack(
      options.stackName || 'my_behavior',
      {
        maxSize: options.maxSize ?? 100,
        maxAge: options.maxAge ?? 5 * 60 * 1000,
        debug: options.debug ?? false,
      },
    );
  }

  install(core: any) {
    // 订阅事件
    core.eventCenter.subscribeEvent({
      type: LISTEN_TYPES.CLICK,
      callback: this.handleClick.bind(this),
    });
  }

  private handleClick(event: any) {
    // 记录事件到行为栈
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

### 使用行为栈数据

```typescript
// 获取事件快照
const events = this.behaviorStack.getSnapshot({
  maxCount: 10,
  includeTypes: [LISTEN_TYPES.CLICK, LISTEN_TYPES.LOAD],
});

// 获取统计信息
const stats = this.behaviorStack.getStats();
console.log('事件总数:', stats.totalEvents);
console.log('当前栈大小:', stats.currentEvents);
console.log('类型分布:', stats.typeDistribution);

// 添加自定义事件
this.behaviorStack.addCustomEvent('user_action', {
  action: 'button_click',
  buttonId: 'submit-btn',
});
```

## 配置选项

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

### 快照选项

```typescript
const snapshotOptions = {
  maxCount: 50, // 最大事件数量
  startTime: Date.now() - 60000, // 开始时间（1分钟前）
  endTime: Date.now(), // 结束时间（现在）
  includeTypes: ['click', 'load'], // 包含的事件类型
  excludeTypes: ['debug'], // 排除的事件类型
};
```

## 事件类型

### 内置事件类型

- `CLICK` - 点击事件
- `LOAD` - 页面加载
- `BEFOREUNLOAD` - 页面卸载
- `HASHCHANGE` - Hash变化
- `HISTORYPUSHSTATE` - History pushState
- `HISTORYREPLACESTATE` - History replaceState
- `POPSTATE` - History popstate
- `XHROPEN` - XHR请求
- `FETCH` - Fetch请求
- `ONLINE` - 网络在线
- `OFFLINE` - 网络离线

### 自定义事件类型

插件可以定义自己的事件类型：

```typescript
// 添加自定义事件
this.behaviorStack.addCustomEvent('user_login', {
  userId: '12345',
  loginMethod: 'password',
});

// 添加业务事件
this.behaviorStack.addCustomEvent('order_submit', {
  orderId: 'ORD-001',
  amount: 99.99,
  items: ['item1', 'item2'],
});
```

## 最佳实践

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

### 4. 数据清理

```typescript
// 定期清理过期数据
setInterval(() => {
  const stats = stack.getStats();
  if (stats.currentEvents > stats.totalEvents * 0.8) {
    console.log('行为栈使用率较高，考虑清理');
  }
}, 60000);
```

## 性能考虑

### 1. 内存管理

- 设置合理的 `maxSize` 和 `maxAge`
- 使用过滤器减少无用事件
- 定期清理过期数据

### 2. 事件频率控制

```typescript
// 使用节流控制高频事件
import { throttle } from '@hawk-tracker/core';

const throttledHandler = throttle((event) => {
  this.behaviorStack.addEvent(event);
}, 100); // 100ms内只处理一次
```

### 3. 批量处理

```typescript
// 批量获取和处理事件
const events = this.behaviorStack.getSnapshot({ maxCount: 100 });
if (events.length > 0) {
  // 批量处理事件
  this.processEvents(events);
}
```

## 调试和监控

### 1. 开启调试模式

```typescript
const config = {
  behavior: {
    debug: true, // 开启调试模式
  },
};
```

### 2. 监控栈状态

```typescript
// 定期检查栈状态
setInterval(() => {
  const stats = this.behaviorStack.getStats();
  console.log('栈状态:', {
    name: stats.name,
    currentEvents: stats.currentEvents,
    totalEvents: stats.totalEvents,
    typeDistribution: stats.typeDistribution,
  });
}, 30000);
```

### 3. 错误处理

```typescript
try {
  this.behaviorStack.addEvent(event);
} catch (error) {
  console.error('添加事件失败:', error);
  // 降级处理或上报错误
}
```

## 总结

Hawk Tracker Core 的行为栈系统提供了一个强大、灵活、易用的用户行为数据管理解决方案。通过核心级别的统一管理，插件可以获得最大的自由度，同时保持系统的稳定性和可维护性。

关键特性：

- ✅ 核心级别统一管理
- ✅ 插件完全自由
- ✅ 数据完全隔离
- ✅ 配置高度灵活
- ✅ 扩展性极强
- ✅ 性能优化
- ✅ 调试友好

这个设计既满足了当前的需求，又为未来的扩展留下了充足的空间。
