# @hawk-tracker/plugin-rrweb 使用教程

本插件基于 rrweb，实现前端页面“事件级回放”。默认只在“错误发生时”取最近一段事件，带宽友好，便于复现场景与定位问题。

## 0. 前置条件
- 已在页面中初始化 `@hawk-tracker/core`
- Node 包已安装（pnpm/yarn/npm 任一均可）

```bash
pnpm add @hawk-tracker/plugin-rrweb
```

## 1. 快速开始（两步）
1) 先启用录屏插件（建议放在错误插件之前）：
```ts
import { init } from '@hawk-tracker/core';
import { RrwebPlugin } from '@hawk-tracker/plugin-rrweb';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

const tracker = init({ dsn: 'https://your-endpoint', debug: false });

// 步骤1：先启动录屏
tracker.use(RrwebPlugin, {
  // 不写 preset 默认 'balanced'
  // 也可选 'privacy' | 'quality'
  preset: 'balanced'
});

// 步骤2：再启动错误监控（会自动附带 rrweb 片段）
tracker.use(ErrorPlugin, {
  attachRrweb: true,
  rrwebMaxSize: 200 // 错误发生时抓取最近 200 条事件
});
```

2) 错误发生时，平台/服务端即可拿到 `rrwebSnapshot`，用于回放。

## 2. 三套预设（开箱即用）
- privacy（高隐私）
  - 采样：`mousemove: 80, scroll: 80, input: 'last', media: 80`
  - 录制：`maskAllInputs: true, recordCanvas: false`
  - 缓冲：`maxEvents: 200`
- balanced（均衡，默认）
  - 采样：`mousemove: 50, scroll: 50, input: 'last', media: 50`
  - 录制：`maskAllInputs: false, recordCanvas: false`
  - 缓冲：`maxEvents: 300`
- quality（高质量/排障期）
  - 采样：`mousemove: 20, scroll: 20, input: 'all', media: 20`
  - 录制：`maskAllInputs: false, recordCanvas: true`
  - 缓冲：`maxEvents: 600`

用法：
```ts
tracker.use(RrwebPlugin, { preset: 'privacy' });
```

## 3. 精细化配置（覆盖预设）
你可以覆盖任意预设项：
- `sampling`：高频事件采样（越小越细，体积越大）
- `recordOptions`：直接透传 rrweb record 的原生配置
- `maxEvents`：内存缓冲上限（只保留最近 N 条）

示例：
```ts
tracker.use(RrwebPlugin, {
  preset: 'privacy',
  sampling: {
    mouseInteraction: true, // 开启鼠标交互子类
    canvas: 'all'           // 捕获全部 Canvas
  },
  maxEvents: 400,
  recordOptions: {
    blockClass: 'rr-block',            // 该 class 的元素不录制
    maskAllInputs: true,               // 输入统一脱敏
    maskTextSelector: '[data-privacy=text]',
    recordCanvas: false,
    inlineStylesheet: true             // 将样式内联，便于离线回放
  }
});
```

常用 `sampling` 字段（部分）：
- `mousemove: number|boolean`（默认见预设；单位 ms，false 关）
- `scroll: number|boolean`
- `media: number`
- `input: 'last'|'all'`
- `canvas: number|'all'`
- `mouseInteraction: boolean|Record<string, boolean>`
- `mousemoveCallback: number`

常用 `recordOptions` 字段（部分）：
- 隐私/过滤：`blockClass`、`blockSelector`、`ignoreClass`、`maskAllInputs`、`maskTextClass`、`maskTextSelector`、`maskInputOptions`、`maskTextFn`、`maskInputFn`
- 录制能力：`recordCanvas`、`inlineStylesheet`、`collectFonts`、`plugins`
- 高级：`slimDOMOptions`、`inlineShadowDom`、`packFn/unpackFn` 等

## 4. 与错误插件联动（如何附带片段）
- `ErrorPlugin` 默认 `attachRrweb: true`
- 发生错误时，会从 `window.$hawkRrweb.getReplay({ maxSize })` 读取最近事件，放在错误 payload 的 `rrwebSnapshot` 字段
- 注意初始化顺序：先 `RrwebPlugin` 后 `ErrorPlugin`

```ts
tracker.use(RrwebPlugin, { preset: 'balanced' });
tracker.use(ErrorPlugin, { attachRrweb: true, rrwebMaxSize: 200 });
```

## 5. 运行期 API
- 全局对象：`window.$hawkRrweb`
  - `getReplay({ maxSize })`：获取最近 `maxSize` 条 rrweb 事件（不传默认 `maxEvents`）
  - `stop()`：停止录制；再次 `install()` 可重启

## 6. 常见问题（FAQ）
- 为什么“感觉看不到 DOM 变化”？
  - 我们默认只在错误发生时附带“最近片段”。日常不报错时不上传，带宽友好。你可以在平台端接入 `rrweb-player` 展示回放。
- 体积/性能如何控制？
  - 提高采样间隔、关闭不必要的录制（如 `recordCanvas: false`）、降低 `maxEvents`、开启 `mask*` 与 `slimDOMOptions`。
- 隐私怎么保障？
  - 指定 `blockClass`/`blockSelector` 屏蔽敏感区域；使用 `maskAllInputs`、`maskText*` 系列对输入/文本脱敏；必要时自定义 `mask*Fn`。
- SSR/Node 环境安全吗？
  - 插件内部在 `install()` 中做了 `typeof window` 检查，非浏览器环境不会启动。
 