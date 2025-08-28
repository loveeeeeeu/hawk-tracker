# Behavior Plugin - 行为监控插件

该插件用于采集用户关键行为（PV、点击、路由变化、在线/离线等），与 core 的行为栈紧密集成，支持快照回放与错误前后上下文关联。

## 安装

```bash
pnpm add @hawk-tracker/plugin-behavior
```

## 快速开始

```ts
import { init } from '@hawk-tracker/core';
import BehaviorPlugin from '@hawk-tracker/plugin-behavior';

const tracker = init({
  dsn: '/api/track',
  debug: true,
  behavior: { core: true },
});

tracker.use(BehaviorPlugin);
```

## 默认采集

- 页面访问（PV）/ Hash 与 History 路由变化
- 点击（CLICK）
- 在线（ONLINE）/ 离线（OFFLINE）
- XHR/FETCH 打开/发送（可作为错误上下文）

## 行为事件模型（建议）

```ts
interface BehaviorEvent {
  type: string; // LISTEN_TYPES 中的标准事件或自定义
  pageUrl?: string;
  context?: Record<string, any>;
  timestamp?: number;
}
```

## 与行为栈配合

```ts
// 获取默认行为栈
const stack = tracker.getBehaviorStack('user_behavior');

// 推入行为（等价于 tracker.pushBehavior）
stack.addEvent({ type: 'CLICK', context: { id: 'submit' } });

// 获取最近快照
const snapshot = stack.getSnapshot({ maxCount: 50 });
```

## 与错误联动

- 错误插件会自动携带最近的 `behaviorSnapshot`，辅助定位
- 建议将行为采样控制在 50~200 条以内

## 最佳实践

- 按页面或模块划分独立行为栈：`createBehaviorStack('checkout')`
- 对高频行为添加过滤函数，减少无效数据
- 对输入类数据做脱敏
