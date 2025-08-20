# @hawk-tracker/plugin-error 开发与接入指南

## 功能目标

- 代码错误：window.onerror、unhandledrejection
- 资源加载错误：img/script/link 等资源加载失败
- HTTP 请求错误：fetch、XMLHttpRequest 状态码>=400/网络异常
- 错误还原：
  - 行为快照：附带最近 N 条用户行为栈
  - 源码定位：错误堆栈、文件名、行列号
  - rrweb 录屏：集成可选的 rrweb 快照（需安装 rrweb 插件）

## 安装

```bash
pnpm add @hawk-tracker/plugin-error
```

可选：rrweb 录屏能力

```bash
pnpm add @hawk-tracker/plugin-rrweb rrweb
```

## 使用

```ts
import { init } from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';
import { RrwebPlugin } from '@hawk-tracker/plugin-rrweb';

const core = init({
  dsn: 'https://example.com/report',
  debug: true,
  behavior: { maxSize: 300, maxAge: 10 * 60 * 1000 },
});

core.use(RrwebPlugin, { maxEvents: 300 }); // 可选：启用录屏
core.use(ErrorPlugin, {
  behaviorStackName: 'user_behavior',
  behaviorSnapshotCount: 50,
  attachRrweb: true,
  rrwebMaxSize: 200,
  appId: 'web-app',
  version: '1.2.3', // 用于 SourceMap 匹配
});
```

## 上报数据结构（示例）

```json
{
  "type": "error",
  "subType": "fetch|xhr|error|unhandledrejection|load",
  "message": "[fetch GET] /api -> 500 Internal Server Error",
  "name": "FetchHttpError",
  "stack": "Error: ...",
  "filename": "/app.js",
  "lineno": 10,
  "colno": 20,
  "pageUrl": "https://app",
  "userAgent": "...",
  "http": {
    "url": "/api",
    "method": "GET",
    "status": 500,
    "statusText": "Internal Server Error",
    "durationMs": 123
  },
  "resource": {
    "tag": "img",
    "url": "https://.../a.png",
    "outerHTML": "<img src=...>"
  },
  "behaviorSnapshot": [
    /* 最近 N 条行为 */
  ],
  "rrwebSnapshot": {
    /* 最近 M 条录屏事件（可选） */
  }
}
```

## 设计说明

- 事件来源：
  - 代码错误：`LISTEN_TYPES.ERROR`（ErrorEvent）、`LISTEN_TYPES.UNHANDLEDREJECTION`
  - 资源错误：`LISTEN_TYPES.ERROR` 中的非 window target
  - HTTP 错误：`LISTEN_TYPES.FETCH`、`LISTEN_TYPES.XHROPEN/XHRSEND`
- 错误还原：
  - 行为快照：从 `core.getBehaviorStack(name)` 读取最近 N 条
  - rrweb：从 `window.$hawkRrweb.getReplay({ maxSize })` 获取最近 M 条
- 性能与体积：
  - 对录屏、快照设置上限
  - 对 headers/body 仅获取必要字段（默认不抓取 request body）

## 自定义配置

- `behaviorStackName`：用于快照的行为栈名称（默认 `user_behavior`）
- `behaviorSnapshotCount`：行为快照条数（默认 50）
- `attachRrweb`：是否附带 rrweb 录屏（默认 true）
- `rrwebMaxSize`：录屏事件条数上限（默认 200）

## 注意事项

- 确保核心 SDK 已初始化并启用 `AOPFactory.initReplace()`（core 已在 init 内调用）。
- 生产环境建议关闭 `debug` 或降低日志级别。
- 涉及隐私数据应脱敏，避免上报敏感内容。
