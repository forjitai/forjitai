import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath    = join(__dirname, '../public/sw.js');
const ts        = Date.now();

let content = readFileSync(swPath, 'utf8');
content = content.replace('__BUILD_TS__', ts);
writeFileSync(swPath, content);
console.log(`[stamp-sw] Cache version: forjitai-v${ts}`);
