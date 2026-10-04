#!/usr/bin/env node
/**
 * Single-version release helper.
 *
 * `@suzume-design/web-react` depends on `@suzume-design/color` as `^<version>`
 * (rewritten by scripts/sync-color-dep.js at pack time) and scripts/pack-check.js
 * asserts that range matches the library's own version, so both packages are
 * version-locked and released together.
 *
 * Usage: node ./scripts/bump-version.js <semver>
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error('[bump] usage: node ./scripts/bump-version.js <semver>');
  process.exit(1);
}

const targets = [path.join(ROOT, 'package.json'), path.join(ROOT, 'packages/color/package.json')];
const previous = [];

for (const file of targets) {
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  previous.push(pkg.version);
  pkg.version = version;
  fs.writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`[bump] ${pkg.name}: ${previous[previous.length - 1]} -> ${version}`);
}

if (new Set(previous).size !== 1) {
  console.error(`[bump] FAIL - packages were not version-locked before the bump: ${previous.join(', ')}`);
  process.exit(1);
}

// Keep `export const version = '...'` in the library entry point in sync.
const entry = path.join(ROOT, 'components/index.tsx');
const source = fs.readFileSync(entry, 'utf8');
const updated = source.replace(/export const version = '.*';/, `export const version = '${version}';`);
if (updated !== source) {
  fs.writeFileSync(entry, updated);
  console.log('[bump] components/index.tsx version export updated');
}

console.log(`[bump] done - ${version}`);
