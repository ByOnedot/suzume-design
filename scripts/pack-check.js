#!/usr/bin/env node
/**
 * npm publication gate for `@suzume-design/web-react`.
 *
 * 1. `npm pack`
 * 2. extract the tarball into a temporary directory
 * 3. run the branding regression scanner over the extracted contents
 * 4. assert the public entry points exist and no upstream package is
 *    referenced anywhere in the published metadata
 *
 * Usage: node scripts/pack-check.js
 */
const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}

// ---------------------------------------------------------------------------
// 1. pack
// ---------------------------------------------------------------------------
console.log('[pack-check] npm pack ...');
const packOutput = run('npm pack --json');
const meta = JSON.parse(packOutput);
const tarball = path.join(ROOT, meta[0].filename);
console.log(`[pack-check]   ${meta[0].filename} - ${meta[0].entryCount} files, ${meta[0].size} bytes`);

// ---------------------------------------------------------------------------
// 2. extract
// ---------------------------------------------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'suzume-pack-'));
execFileSync('tar', ['-xzf', tarball, '-C', tmp]);
const extracted = path.join(tmp, 'package');

// ---------------------------------------------------------------------------
// 3. branding scan over what users actually receive
// ---------------------------------------------------------------------------
console.log('[pack-check] scanning extracted package ...');
try {
  run(`node ${JSON.stringify(path.join(ROOT, 'scripts', 'check-branding.js'))} ${JSON.stringify(extracted)}`);
} catch (e) {
  console.error('[pack-check] FAIL - upstream branding found inside the tarball');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 4. structural assertions
// ---------------------------------------------------------------------------
const problems = [];
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const published = readJson(path.join(extracted, 'package.json'));

const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'CHANGELOG.md',
  'es/index.js',
  'es/index.d.ts',
  'lib/index.js',
  'lib/index.d.ts',
  'dist/suzume.min.js',
  'dist/suzume.development.js',
  'dist/suzume-icon.min.js',
  'dist/css/suzume.css',
  'dist/css/suzume.min.css',
  'dist/css/index.less',
  'icon/index.js',
  'icon/index.es.js',
  'icon/index.d.ts',
  'icon/icons.json',
  'icon/package.json',
  'hooks/es/index.js',
  'hooks/lib/index.js',
  'hooks/package.json',
  'docs/nextjs.md',
];
for (const f of requiredFiles) {
  if (!fs.existsSync(path.join(extracted, f))) problems.push(`missing file: ${f}`);
}

if (published.name !== '@suzume-design/web-react') problems.push(`unexpected name ${published.name}`);
if (published.version !== pkg.version) problems.push('version mismatch with source package.json');
if (published.license !== 'MIT') problems.push(`unexpected license ${published.license}`);
if (published.dependencies && published.dependencies['@suzume-design/color'] !== `^${pkg.version}`) {
  problems.push(`@suzume-design/color must be a semver range, got ${published.dependencies['@suzume-design/color']}`);
}
for (const key of Object.keys(published.dependencies || {})) {
  if (key.startsWith('@arco-design/') || key.startsWith('@arco-plugins/') || key.startsWith('@arco-themes/')) {
    problems.push(`upstream runtime dependency: ${key}`);
  }
  if (/^(file|link|portal|workspace):/.test(published.dependencies[key])) {
    problems.push(`non-publishable dependency specifier: ${key}@${published.dependencies[key]}`);
  }
}
if (!published.scripts || !published.scripts.prepack) problems.push('prepack script missing');

// every entry point must resolve
const entryChecks = [published.main, published.module, published.types, published.unpkg];
for (const entry of entryChecks) {
  if (entry && !fs.existsSync(path.join(extracted, entry))) problems.push(`entry point missing: ${entry}`);
}

// no upstream branding in the JS/CSS/LESS/d.ts output
const forbidden = /@arco-design|arco-design|ArcoDesign|arcodesign|arco\.design|arcoblue|@arco-plugins|@arco-themes|byteui|bytedesign/i;
function scanOutput(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanOutput(full);
    } else if (/\.(js|mjs|cjs|css|less|json|d\.ts|map)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        if (/Copyright\s*(\(c\)|©|\d{4})/i.test(line)) return;
        if (forbidden.test(line)) {
          problems.push(`${path.relative(extracted, full)}:${i + 1} contains upstream branding`);
        }
      });
    }
  }
}
scanOutput(extracted);

if (problems.length) {
  console.error('\n[pack-check] FAIL');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}

console.log(`[pack-check] PASS - ${meta[0].filename} is ready for publication`);
console.log(`[pack-check] temp dir: ${tmp}`);
