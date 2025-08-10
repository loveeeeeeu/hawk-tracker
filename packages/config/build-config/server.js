import { createBaseRollupConfig } from './base.js';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';

export function createServerRollupConfig(options) {
  const { input, outputFile, external = [], additionalPlugins = [] } = options;

  // Default server externals - common Node.js modules
  const defaultServerExternals = [
    'fs',
    'path',
    'http',
    'https',
    'url',
    'os',
    'crypto',
    'stream',
    'events',
    'util',
    'querystring',
    'zlib',
    'buffer',
    'net',
    'tls',
    'child_process',
    // Common server dependencies
    'koa',
    'koa-router',
    'express',
    'fastify',
  ];

  const serverExternal = [...defaultServerExternals, ...external];

  const baseConfig = createBaseRollupConfig({
    input,
    outputFile,
    external: serverExternal,
    plugins: [
      json(), // Add JSON plugin for server builds
      ...additionalPlugins,
    ],
  });

  return [
    baseConfig,
    {
      input,
      output: [{ file: outputFile.replace('.js', '.d.ts'), format: 'es' }],
      plugins: [dts()],
      external: serverExternal,
    },
  ];
}
