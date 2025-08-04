// 该文件作用：测试core和plugin-error的打包是否正常

import hawkTracker from '@hawk-tracker/core';
import { ErrorPlugin } from '@hawk-tracker/plugin-error';

console.log('Initializing Hawk Tracker...');

hawkTracker.init({
    dsn: 'https://your-dsn.com',
    apikey: 'your-api-key'
});

console.log('Using ErrorPlugin...');
hawkTracker.use(ErrorPlugin);

console.log('Hawk Tracker setup complete!');