import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';

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
        exportConditions: ['node', 'default'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true,
        declaration: true,
        outputToFilesystem: true,
        compilerOptions: {
          module: 'ESNext',
          moduleResolution: 'bundler',
        },
      }),
      ...plugins,
    ],
    external,
  };
}

/**
 * 通用依赖打包配置 - Development版本
 * 修改：确保正确生成类型声明文件
 */
export function createDependencyBundleConfigDev(pkg, options = {}) {
  const {
    input = 'src/index.ts',
    additionalPlugins = [],
    additionalExternal = [],
    tsconfig = './tsconfig.json',
  } = options;

  const mainConfig = {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
        inlineDynamicImports: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true,
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
          moduleResolution: 'bundler',
        },
      }),
      resolve({
        preferBuiltins: true,
        exportConditions: ['node'],
        extensions: ['.js', '.ts', '.json'],
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

  // 如果有 types 字段，返回数组配置（主配置 + 类型声明配置）
  if (pkg.types) {
    return [
      mainConfig,
      {
        input,
        output: [
          {
            file: pkg.types,
            format: 'esm',
          },
        ],
        plugins: [dts()],
        external: [
          ...Object.keys(pkg.peerDependencies || {}),
          ...additionalExternal,
        ],
      },
    ];
  }

  return mainConfig;
}

/**
 * 通用依赖打包配置 - Production版本
 * 修改：确保正确生成类型声明文件
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
        moduleResolution: 'bundler',
      },
    }),
    ...additionalPlugins,
  ];

  const mainConfig = {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
        inlineDynamicImports: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: false,
        inlineDynamicImports: true,
      },
    ],
    plugins,
    external: [
      ...Object.keys(pkg.peerDependencies || {}),
      ...additionalExternal,
    ],
  };

  // 如果有 types 字段，返回数组配置（主配置 + 类型声明配置）
  if (pkg.types) {
    return [
      mainConfig,
      {
        input,
        output: [
          {
            file: pkg.types,
            format: 'esm',
          },
        ],
        plugins: [dts()],
        external: [
          ...Object.keys(pkg.peerDependencies || {}),
          ...additionalExternal,
        ],
      },
    ];
  }

  return mainConfig;
}

/**
 * 兼容性配置函数 - 自动选择dev/prod版本
 * 修改：确保正确生成类型声明文件
 */
export function createRollupConfig(pkg, options = {}) {
  const isDev =
    process.env.NODE_ENV === 'development' || process.env.ROLLUP_WATCH;

  const baseConfig = isDev
    ? createDependencyBundleConfigDev(pkg, options)
    : createDependencyBundleConfigProd(pkg, options);

  // 确保有类型声明文件的配置
  if (pkg.types && !Array.isArray(baseConfig)) {
    // 如果返回的不是数组，转换为数组并添加类型声明配置
    return [
      baseConfig,
      // 添加专门的类型声明文件构建配置
      {
        input: options.input || 'src/index.ts',
        output: [
          {
            file: pkg.types,
            format: 'esm',
          },
        ],
        plugins: [dts()],
        external: [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
          ...(options.additionalExternal || []),
        ],
      },
    ];
  }

  return baseConfig;
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
      inlineDynamicImports: true, // 内联动态导入
    });
  }

  if (formats.includes('es') && pkg.module) {
    outputs.push({
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true, // 内联动态导入
    });
  }

  if (formats.includes('umd') && pkg.browser) {
    outputs.push({
      file: pkg.browser,
      format: 'umd',
      name: pkg.name.replace(/[@\-]/g, ''),
      sourcemap: true,
      inlineDynamicImports: true, // 内联动态导入
    });
  }

  return [
    {
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
            moduleResolution: 'bundler',
          },
        }),
        ...additionalPlugins,
      ],
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        ...additionalExternal,
      ],
    },
  ];
}
