import { reactRouter } from '@react-router/dev/vite';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  css: {
    postcss: './postcss.config.mjs',
  },
  server: {
    port: 3000,
    host: true,
  },
});
