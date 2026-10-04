#!/usr/bin/env node
/**
 * Keeps `@byonedot/web-react`'s publishable metadata consistent.
 *
 * The `@byonedot/color` dependency always stays a plain semver range
 * (`^<color version>`) so the published tarball never contains a
 * `workspace:` specifier; pnpm resolves the sibling copy locally via
 * `linkWorkspacePackages`.
 *
 * - `publish` mode (prepack): normalise the range to `^<color version>` and
 *   drop the development-only `prepare` script (husky must not run in
 *   consumers' node_modules).
 * - `dev` mode (postpack / local checkout): restore the `prepare` script.
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

function readColorVersion() {
  try {
    return JSON.parse(fs.readFileSync(COLOR_PKG, 'utf8')).version;
  } catch (e) {
    return null;
  }
}

const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const current = pkg.dependencies && pkg.dependencies['@byonedot/color'];
if (typeof current !== 'string') {
  console.error('[sync-color-dep] @byonedot/color is not declared in dependencies');
  process.exit(1);
}

const version = readColorVersion() || '1.0.0';
const range = `^${version}`;

let dirty = false;

// The dependency is pinned to a plain semver range at all times so the
// published tarball never contains a `workspace:` specifier. pnpm resolves
// the sibling copy locally via `linkWorkspacePackages`.
if (current !== range) {
  pkg.dependencies['@byonedot/color'] = range;
  dirty = true;
  console.error(`[sync-color-dep] @byonedot/color -> ${range}`);
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
