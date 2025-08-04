import { createRollupConfig } from '../../rollup.config.mjs';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default createRollupConfig(pkg); 