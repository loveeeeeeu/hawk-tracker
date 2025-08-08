import { createServerRollupConfig } from '@workspace/build-config/server';

export default createServerRollupConfig({
  input: 'src/index.ts',
  outputFile: 'dist/index.js',
});