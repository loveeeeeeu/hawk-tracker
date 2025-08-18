import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sdkWatcherPlugin } from './vite-plugin-sdk-watcher';

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    sdkWatcherPlugin(), // 添加 SDK 监听插件
  ],
  server: {
    port: 5174,
    host: true,
  },
  // 禁用依赖预构建，每次都重新加载
  optimizeDeps: {
    // 只排除 SDK 包，保留其他依赖的预构建
    exclude: ['@hawk-tracker/core', '@hawk-tracker/plugin-error'],
    // 强制包含 React 相关包
    include: ['react', 'react-dom', 'react-router'],
  },
});
