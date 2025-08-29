# Performance Plugin - 性能监控插件

该插件用于采集页面关键性能指标（FP/FCP/LCP/CLS/TTI/TTFB等）与资源加载耗时，支持采样与批量上报。

## 安装

```bash
pnpm add @hawk-tracker/plugin-performance
```

## 快速开始

```ts
import { init } from '@hawk-tracker/core';
import { PerformancePlugin } from '@hawk-tracker/plugin-performance';

const tracker = init({ dsn: '/api/track', debug: true });

tracker.use(PerformancePlugin, {
  sampleRate: 1.0, // 采样率（0-1）
  reportAllResources: false, // 是否上报全部资源明细
  longTaskThreshold: 50, // 长任务阈值（ms）
  batch: true, // 批量上报
});
```

## 能力概览

- Web Vitals：FCP、LCP、CLS、FID/INP、TTFB、TTI
- 资源耗时：根据 PerformanceResourceTiming 统计聚合（可选）
- 长任务：Long Task 统计（阈值可配）
- 自定义指标：通过公开方法手动上报

## 事件类型（建议）

- type: 'performance'
  - subType: 'web-vitals' | 'resource' | 'longtask' | 'custom'

## 上报数据示例

```json
{
  "type": "performance",
  "subType": "web-vitals",
  "data": {
    "FCP": 1234,
    "LCP": 2456,
    "CLS": 0.05,
    "TTFB": 120
  }
}
```

## 配置项

- sampleRate: number = 1
- reportAllResources: boolean = false
- longTaskThreshold: number = 50
- batch: boolean = true

## 最佳实践

- 生产环境建议将 `sampleRate` 调整为 0.1~0.3
- 仅在排障期间开启 `reportAllResources`
- 与错误/行为数据结合分析，定位性能瓶颈
