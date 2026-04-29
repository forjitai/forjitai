import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath    = join(__dirname, '../public/sw.js');
const ts        = Date.now();

let content = readFileSync(swPath, 'utf8');

// Replace the entire CACHE_VERSION line — works whether placeholder or old timestamp
content = content.replace(
  /const CACHE_VERSION = 'forjitai-v[\w]+';/,
  `const CACHE_VERSION = 'forjitai-v${ts}';`
);

writeFileSync(swPath, content);
console.log(`[stamp-sw] ✅ Cache version updated: forjitai-v${ts}`);
