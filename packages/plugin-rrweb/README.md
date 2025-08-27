# Rrweb Plugin - 录屏插件

本插件为 SDK 提供 rrweb 录屏能力，默认仅在前端内存中维护环形缓冲区，不做自动上报（由上层错误插件或业务逻辑决定何时取用）。

## 安装
```bash
pnpm add @hawk-tracker/plugin-rrweb
```

## 快速开始
```ts
import { init } from '@hawk-tracker/core';
import { RrwebPlugin } from '@hawk-tracker/plugin-rrweb';

const core = init({ dsn: '/api/track', debug: true });

core.use(RrwebPlugin, {
  preset: 'balanced',        // 'privacy' | 'balanced' | 'quality'
  maxEvents: 300,            // 环形缓冲区最大事件数
  // 也可细化 rrweb 的 sampling/recordOptions
  sampling: { mousemove: 50, scroll: 50, input: 'last' },
  recordOptions: { maskAllInputs: false, recordCanvas: false } as any,
});
```

## 配置项
- preset: 'privacy' | 'balanced' | 'quality'（默认 'balanced'）
  - privacy：更强隐私，输入/媒体采样更低，默认 maskAllInputs = true
  - balanced：通用平衡方案
  - quality：更高质量，事件更密集，可能带来更大体积
- maxEvents: number（默认与 preset 匹配，200/300/600）
- sampling: rrweb sampling 配置（可覆盖 preset 默认）
- recordOptions: rrweb record 配置（可覆盖 preset 默认）

## 取用录屏片段
错误插件会在上报前通过全局调试 API 读取最近片段：
```ts
const api = (window as any).$hawkRrweb;
const recent = api?.getReplay({ maxSize: 300, maxBytes: 64 * 1024 });
```
- maxSize：限制事件条数（默认取插件当前 `maxEvents`）
- maxBytes（新增）：基于 JSON 近似字节的裁剪上限，超过时自动丢弃最早 10%（至少 1 条），优先保留最新事件

## 调试 API
安装后会在浏览器注入两个调试对象：
- `window.__hawk_rrweb`（新）
  - getEvents(): any[]
  - getErrorPoints(): { type, error, timestamp, eventIndex }[]
  - markErrorPoint(info: { type: string; error: any; timestamp?: number })
  - stop(): void
- `window.$hawkRrweb`（兼容旧）
  - getReplay({ maxSize?, maxBytes? }): any[]
  - getErrorContext(): { errorPoint, eventsBeforeError, eventsAfterError, totalEvents, errorCount }
  - markErrorPoint(info)

> 建议：与 `@hawk-tracker/plugin-error` 配合，在错误发生时附带最近录屏片段，用于回放定位。

## 最佳实践
- 生产环境采用 `preset: 'balanced'` 或 `privacy`，并限制 `maxEvents` + `maxBytes`
- 对敏感输入类页面建议开启 `maskAllInputs: true`
- 录屏只在必要时取用并上报，避免流量暴涨
