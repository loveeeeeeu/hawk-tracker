import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';

// 定义一个通用的构建函数
export function createRollupConfig(packageJson) {
  const name = packageJson.name.replace('@hawk-tracker/', '');
  
  // 对于插件包，我们需要将 @hawk-tracker/core 作为外部依赖
  const external = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
  ];

  return [
    // --- 主构建 (CJS, ESM) ---
    {
      input: 'src/index.ts',
      output: [
        {
          file: packageJson.main,
          format: 'cjs',
          sourcemap: true,
          exports: 'auto',
        },
        {
          file: packageJson.module,
          format: 'esm',
          sourcemap: true,
        },
      ],
      plugins: [
        nodeResolve({
          preferBuiltins: false,
        }),
        commonjs(),
        typescript({
          tsconfig: './tsconfig.json',
          sourceMap: true,
          declaration: false,
        }),
      ],
      external,
    },
    // --- 类型声明文件构建 (.d.ts) ---
    {
      input: 'src/index.ts',
      output: [{ file: packageJson.types, format: 'esm' }],
      plugins: [dts()],
      external,
    },
  ];
}