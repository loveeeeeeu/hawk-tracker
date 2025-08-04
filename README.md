# Hawk Tracker

> 一个功能完整的前端监控 SDK，提供错误监控、性能监控和用户行为追踪能力。

## 🚀 特性

- **错误监控**: 自动捕获 JavaScript 错误、Promise 异常、资源加载错误
- **性能监控**: 监控页面加载性能、白屏检测、资源加载时间
- **行为监控**: 用户点击事件、页面访问统计、自定义事件上报
- **高可用性**: 离线缓存、失败重试、数据持久化
- **轻量级**: 模块化设计，按需加载
- **TypeScript**: 完整的类型定义支持

## 📦 项目结构

```markdown:hawk-tracker/README.md
hawk-tracker/
├── packages/                 # SDK 核心包
│   ├── core/                # 核心功能包
│   ├── plugin-error/        # 错误监控插件
│   ├── plugin-performance/  # 性能监控插件
│   └── plugin-behaviour/    # 行为监控插件
├── apps/                    # 演示应用
│   └── hawk-tracker-web/    # React 演示应用
├── examples/                # 简单示例
└── docs/                    # 文档
```

## 🛠️ 技术栈

- **开发语言**: TypeScript
- **构建工具**: Rollup + Turborepo
- **包管理**: PNPM Workspace
- **代码规范**: ESLint + Prettier + Husky
- **版本管理**: Changesets

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建所有包

```bash
pnpm build
```

### 开发模式

```bash
# 启动所有包的开发模式
pnpm dev

# 仅启动核心包开发
pnpm dev --filter=@hawk-tracker/core
```

### 运行示例

```bash
cd examples
pnpm dev
```

## 📖 使用方法

```typescript
import hawkTracker from '@hawk-tracker/core'
import { ErrorPlugin } from '@hawk-tracker/plugin-error'
import { PerformancePlugin } from '@hawk-tracker/plugin-performance'

// 初始化 SDK
hawkTracker.init({
  dsn: 'https://your-server.com/api/collect',
  apikey: 'your-api-key',
  debug: true
})

// 注册插件
hawkTracker.use(ErrorPlugin)
hawkTracker.use(PerformancePlugin)
```

## 🧪 开发指南

### 添加新插件

1. 在 `packages/` 下创建新的插件目录
2. 实现 `BasePlugin` 接口
3. 添加到 workspace 配置
4. 编写测试用例

### 代码规范

```bash
# 代码检查
pnpm lint

# 自动修复
pnpm lint:fix

# 代码格式化
pnpm format
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm test --filter=@hawk-tracker/core
```

## 📝 脚本命令

| 命令 | 描述 |
|------|------|
| `pnpm build` | 构建所有包 |
| `pnpm dev` | 开发模式 |
| `pnpm lint` | 代码检查 |
| `pnpm lint:fix` | 自动修复代码问题 |
| `pnpm test` | 运行测试 |
| `pnpm clean` | 清理构建产物 |
| `pnpm release` | 发布新版本 |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

[ISC](LICENSE)

## 🙋‍♂️ 支持

如有问题，请创建 [Issue](../../issues) 或联系开发团队。 