import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const webRoot = resolve(import.meta.dirname, '..');
const repoRoot = resolve(webRoot, '..');
const version = JSON.parse(readFileSync(resolve(webRoot, 'package.json'), 'utf8')).version;
const files = [
  { path: 'README.md', re: /Estado actual \(v(\d+\.\d+\.\d+)\):/g },
  { path: 'CHANGELOG.md', re: /^## (\d+\.\d+\.\d+)\s*$/gm },
  { path: 'documentacion/ROADMAP.md', re: /^- v(\d+\.\d+\.\d+):/gm }
];
const errors = [];

for (const {path, re} of files) {
  const body = readFileSync(resolve(repoRoot, path), 'utf8');
  const matches = [...body.matchAll(re)];
  // The first occurrence is the active version; older history is deliberately retained.
  const latest = matches[0]?.[1];
  if (latest !== version) {
    errors.push(`${path}: expected active v${version}, found ${latest ?? 'no version marker'}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Release documents aligned with v${version}`);
}
