import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/**
 * Base Rollup configuration creator
 */
export function createBaseRollupConfig(options) {
  const { input, outputFile, plugins = [], external = [] } = options;

  return {
    input,
    output: {
      file: outputFile,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
  plugins: [
    resolve({ 
      preferBuiltins: true,
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      exportConditions: ['node', 'default']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      declaration: true,
      outputToFilesystem: true,
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'bundler'
      }
    }),
    ...plugins,
  ],
    external,
  };
}

/**
 * 通用依赖打包配置 - Development版本
 */
export function createDependencyBundleConfigDev(pkg, options = {}) {
  const {
    input = 'src/index.ts',
    additionalPlugins = [],
    additionalExternal = [],
    tsconfig = './tsconfig.json',
  } = options;

  return {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig,
        sourceMap: true,
        declaration: true,
        declarationDir: 'dist',
        outputToFilesystem: true,
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'bundler'
        }
      }),
      resolve({ 
        preferBuiltins: true,
        exportConditions: ['node'],
        extensions: ['.js', '.ts', '.json']
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      ...additionalPlugins,
    ],
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...additionalExternal,
    ],
    watch: {
      clearScreen: false,
    },
  };
}

/**
 * 通用依赖打包配置 - Production版本
 */
export function createDependencyBundleConfigProd(pkg, options = {}) {
  const {
    input = 'src/index.ts',
    additionalPlugins = [],
    additionalExternal = [],
    tsconfig = './tsconfig.json',
    minify = false,
  } = options;

  const plugins = [
    resolve({ 
      preferBuiltins: true,
      exportConditions: ['node'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    typescript({
      tsconfig,
      sourceMap: false,
      declaration: true,
      declarationDir: 'dist',
      outputToFilesystem: true,
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'bundler'
      }
    }),
    ...additionalPlugins,
  ];

  // Note: For minification, pass terser plugin through additionalPlugins
  // Example: import terser from '@rollup/plugin-terser'; 
  // createDependencyBundleConfigProd(pkg, { minify: true, additionalPlugins: [terser()] })

  return {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: false,
      },
    ],
    plugins,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...additionalExternal,
    ],
  };
}

/**
 * 兼容性配置函数 - 自动选择dev/prod版本
 */
export function createRollupConfig(pkg, options = {}) {
  const isDev = process.env.NODE_ENV === 'development' || process.env.ROLLUP_WATCH;
  
  if (isDev) {
    return createDependencyBundleConfigDev(pkg, options);
  } else {
    return createDependencyBundleConfigProd(pkg, options);
  }
}

/**
 * 创建多种格式输出的依赖打包配置
 */
export function createMultiFormatDependencyConfig(pkg, options = {}) {
  const {
    input = 'src/index.ts',
    additionalPlugins = [],
    additionalExternal = [],
    tsconfig = './tsconfig.json',
    formats = ['cjs', 'es'],
  } = options;

  const outputs = [];
  
  if (formats.includes('cjs') && pkg.main) {
    outputs.push({
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    });
  }
  
  if (formats.includes('es') && pkg.module) {
    outputs.push({
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    });
  }
  
  if (formats.includes('umd') && pkg.browser) {
    outputs.push({
      file: pkg.browser,
      format: 'umd',
      name: pkg.name.replace(/[@\-]/g, ''),
      sourcemap: true,
    });
  }

  return {
    input,
    output: outputs,
    plugins: [
      resolve({ 
        preferBuiltins: true,
        browser: formats.includes('umd'),
      }),
      commonjs({
        include: 'node_modules/**',
      }),
      typescript({
        tsconfig,
        sourceMap: true,
        declaration: true,
        declarationDir: 'dist',
        outputToFilesystem: true,
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'bundler'
        }
      }),
      ...additionalPlugins,
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      ...additionalExternal,
    ],
  };
}
