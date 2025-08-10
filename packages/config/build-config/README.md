# Build Config

这个包提供了用于 Hawk Tracker monorepo 的标准化 Rollup 构建配置。

## 功能

### 基础配置 (`base.js`)

- `createBaseRollupConfig` - 基础 Rollup 配置创建器
- `createDependencyBundleConfigDev` - 开发环境依赖打包配置
- `createDependencyBundleConfigProd` - 生产环境依赖打包配置
- `createRollupConfig` - 自动选择 dev/prod 版本的兼容性配置
- `createMultiFormatDependencyConfig` - 多格式输出的依赖打包配置

### Web 配置 (`web.js`)

- `createWebRollupConfig` - Web 应用通用配置
- `createWebAppRollupConfig` - Web App 特定配置（用于 apps/web）
- `createUIRollupConfig` - UI 包专用配置

### Server 配置 (`server.js`)

- `createServerRollupConfig` - Server 应用配置

## 使用方法

### 对于 packages（库依赖打包）

```javascript
// packages/core/rollup.config.mjs
import { createRollupConfig } from '@workspace/build-config/base';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default createRollupConfig(pkg);
```

### 对于 UI 包

```javascript
// packages/ui/rollup.config.mjs
import { createUIRollupConfig } from '@workspace/build-config/web';

export default createUIRollupConfig();
```

### 对于 Web App

```javascript
// apps/web/rollup.config.mjs
import { createWebAppRollupConfig } from '@workspace/build-config/web';

export default createWebAppRollupConfig({
  input: 'app/root.tsx',
  outputDir: 'build/client',
  serverOutputDir: 'build/server',
  generateServerTypes: true,
  external: ['react', 'react-dom', 'react-router', 'react-router-dom'],
});
```

### 对于 Server App

```javascript
// apps/server/rollup.config.mjs
import { createServerRollupConfig } from '@workspace/build-config/server';

export default createServerRollupConfig({
  input: 'src/index.ts',
  outputFile: 'dist/index.js',
});
```

## 开发 vs 生产模式

配置会根据以下环境变量自动选择开发或生产模式：

- `NODE_ENV === 'development'` 或
- `ROLLUP_WATCH` 存在

### 开发模式特性

- 启用 sourcemap
- 更快的构建
- 清晰的控制台输出

### 生产模式特性

- 禁用 sourcemap
- 优化构建体积
- 排除测试文件

## 高级配置选项

### 自定义插件

```javascript
import { createDependencyBundleConfigDev } from '@workspace/build-config/base';
import somePlugin from 'some-rollup-plugin';

export default createDependencyBundleConfigDev(pkg, {
  additionalPlugins: [somePlugin()],
  additionalExternal: ['some-external-dep'],
});
```

### 多格式输出

```javascript
import { createMultiFormatDependencyConfig } from '@workspace/build-config/base';

export default createMultiFormatDependencyConfig(pkg, {
  formats: ['cjs', 'es', 'umd'],
});
```

## 依赖说明

这个包包含了以下 Rollup 插件：

- `@rollup/plugin-typescript` - TypeScript 支持
- `@rollup/plugin-node-resolve` - 模块解析
- `@rollup/plugin-commonjs` - CommonJS 支持
- `@rollup/plugin-babel` - Babel 转换
- `@rollup/plugin-terser` - 代码压缩（可选）
- `rollup-plugin-dts` - TypeScript 声明文件
- `rollup-plugin-postcss` - CSS 处理

所有依赖都已集中管理，无需在各个包中重复安装。
