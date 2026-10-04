#!/usr/bin/env node
/**
 * Keeps the local-development copy of `@suzume-design/color` in sync with the
 * publishable dependency range.
 *
 * - `dev` mode (postpack / local checkout): point the dependency at the
 *   sibling `suzume-color` repository so `yarn install` works before the
 *   package is published to the registry.
 * - `publish` mode (prepack): rewrite the dependency to a normal semver range
 *   so the published tarball never contains a `file:` specifier.
 *
 * Usage: node scripts/sync-color-dep.js [dev|publish]
 */
const fs = require('fs');
const path = require('path');

const MODE = (process.argv[2] || 'dev').toLowerCase();
// `prepare` is a development-only hook (husky). It must not run in consumers'
// node_modules, so it is removed from package.json before packing and
// restored afterwards.
const DEV_PREPARE = 'husky install >/dev/null 2>&1 || true';
const PKG_PATH = path.resolve(__dirname, '../package.json');
const COLOR_PKG = path.resolve(__dirname, '../packages/color/package.json');
const LOCAL_SPEC = 'workspace:^';

function readColorVersion() {
  try {
    return JSON.parse(fs.readFileSync(COLOR_PKG, 'utf8')).version;
  } catch (e) {
    return null;
  }
}

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const current = pkg.dependencies && pkg.dependencies['@suzume-design/color'];
if (typeof current !== 'string') {
  console.error('[sync-color-dep] @suzume-design/color is not declared in dependencies');
  process.exit(1);
}

const version = readColorVersion() || '1.0.0';
const range = `^${version}`;
const target = MODE === 'publish' ? range : LOCAL_SPEC;

let dirty = false;

if (current !== target) {
  pkg.dependencies['@suzume-design/color'] = target;
  dirty = true;
  console.error(`[sync-color-dep] @suzume-design/color -> ${target}`);
}

pkg.scripts = pkg.scripts || {};
if (MODE === 'publish') {
  if (pkg.scripts.prepare) {
    delete pkg.scripts.prepare;
    dirty = true;
    console.error('[sync-color-dep] removed development-only `prepare` script');
  }
} else if (!pkg.scripts.prepare) {
  pkg.scripts.prepare = DEV_PREPARE;
  dirty = true;
  console.error('[sync-color-dep] restored `prepare` script');
}

if (dirty) {
  fs.writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`);
}
