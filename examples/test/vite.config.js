import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@hawk-tracker/core': '../packages/core/src/index.ts',
      '@hawk-tracker/plugin-error': '../packages/plugin-error/src/index.ts'
    }
  }
});