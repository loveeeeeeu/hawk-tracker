import { createRollupConfig } from '@workspace/build-config/base';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default createRollupConfig(pkg);