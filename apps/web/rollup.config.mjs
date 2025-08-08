import { createWebAppRollupConfig } from '@workspace/build-config/web';

export default createWebAppRollupConfig({
  input: 'app/root.tsx',
  outputDir: 'build/client',
  serverOutputDir: 'build/server',
  generateServerTypes: false, // Disabled due to React Router type resolution issues
  external: ['react', 'react-dom', 'react-router', 'react-router-dom'],
});
