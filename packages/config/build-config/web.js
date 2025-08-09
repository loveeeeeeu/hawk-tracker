import { createBaseRollupConfig } from './base.js';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

/**
 * Web应用Rollup配置创建器
 */
export function createWebRollupConfig(options) {
  const { 
    input, 
    outputDir, 
    outputFile,
    external = [],
    babelPresets = ['@babel/preset-react'],
    postcssConfig,
    generateTypes = true,
    format = 'es',
    sourcemap = true,
  } = options;

  // 确定输出配置
  const output = outputFile ? 
    { file: outputFile, format, sourcemap } :
    { dir: outputDir, format, sourcemap };

  const baseConfig = {
    input,
    output,
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: generateTypes,
        declarationDir: outputDir || outputFile?.replace(/\/[^/]+$/, '') || 'dist',
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'bundler'
        }
      }),
      babel({
        presets: babelPresets,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      postcss(postcssConfig || {
        extract: true,
        modules: false,
        sourceMap: sourcemap,
        minimize: false,
        inject: false,
        use: {
          sass: false,
          stylus: false,
          less: false,
        },
      }),
    ],
    external,
  };

  const configs = [baseConfig];

  // 如果需要生成类型定义
  if (generateTypes) {
    const typesOutput = outputFile ? 
      outputFile.replace(/\.(js|mjs)$/, '.d.ts') : 
      `${outputDir}/index.d.ts`;
    
    configs.push({
      input,
      output: [{ file: typesOutput, format: 'es' }],
      plugins: [dts()],
      external,
    });
  }

  return configs;
}

/**
 * Web App特定配置 - 用于apps/web
 */
export function createWebAppRollupConfig(options = {}) {
  const {
    input = 'app/root.tsx',
    outputDir = 'build/client',
    serverOutputDir = 'build/server',
    generateServerTypes = true,
    external = ['react', 'react-dom', 'react-router', 'react-router-dom'],
    ...restOptions
  } = options;

  const configs = [];

  // Client build configuration
  configs.push({
    input,
    output: {
      dir: outputDir,
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          declarationMap: false,
          composite: false,
          incremental: false
        }
      }),
      babel({
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      postcss({
        extract: true,
        modules: false,
        sourceMap: true,
        minimize: false,
        inject: false,
        use: {
          sass: false,
          stylus: false,
          less: false,
        },
      }),
    ],
    external,
  });

  // Server types configuration
  if (generateServerTypes) {
    configs.push({
      input,
      output: [{ file: `${serverOutputDir}/index.d.ts`, format: 'es' }],
      plugins: [dts()],
      external,
    });
  }

  return configs;
}

/**
 * UI包专用配置
 */
export function createUIRollupConfig(options = {}) {
  return createWebRollupConfig({
    input: 'src/index.ts',
    outputDir: 'dist',
    external: ['react', 'react-dom'],
    generateTypes: true,
    postcssConfig: {
      extract: true,
      modules: false,
      sourceMap: true,
      minimize: false,
      inject: false,
      use: {
        sass: false,
        stylus: false,
        less: false,
      },
    },
    ...options,
  });
}
