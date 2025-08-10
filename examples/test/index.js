// 该文件作用：测试core和plugin-error的打包是否正常

import { init } from '../../packages/core/dist/index.mjs';
import { ErrorPlugin } from '../../packages/plugin-error/dist/index.mjs';

console.log('Initializing Hawk Tracker...');

const hawkTracker = init({
  dsn: 'https://your-dsn.com',
  appName: 'your-app-name',
  appCode: 'your-app-code',
  sampleRate: 1,
  debug: true,
  batchSize: 15,
  sendInterval: 5000,
  maxConcurrentRequests: 3,
  offlineStorageKey: 'sdk_report_queue',
  debug: true,
});

console.log('Using ErrorPlugin...');
hawkTracker.use(ErrorPlugin);
