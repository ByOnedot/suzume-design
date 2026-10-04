#!/usr/bin/env node
/**
 * Suzume Design brand migration script.
 *
 * Applies the canonical Arco -> Suzume brand mapping across the repository.
 * Legal/license files are excluded (see LEGAL_ALLOWLIST).
 *
 * Usage: node scripts/migrate-brand.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');

// Files that must never be rewritten (upstream copyright / license notices).
const LEGAL_ALLOWLIST = new Set([
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
]);

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'es',
  'lib',
  'dist',
  'css',
  'coverage',
  '.next',
  'react-icon',
  'react-icon-cjs',
]);

// Ordered, case-sensitive brand mapping (most specific first).
const RULES = [
  ['@arco-design/', '@suzume-design/'],
  ['arco.design', 'byonedot.in'],
  ['arco-design', 'suzume-design'],
  ['ArcoDesign', 'SuzumeDesign'],
  ['arcodesign', 'suzumedesign'],
  ['Arco Design', 'Suzume Design'],
  ['arco design', 'suzume design'],
  ['ArcoBlue', 'SuzumeBlue'],
  ['arcoblue', 'suzumeblue'],
  ['Beijing ByteDance Technology Co., Ltd.', 'Example Technology Co., Ltd.'],
  ['Beijing Bytedance Technology Co., Ltd.', 'Example Technology Co., Ltd.'],
  ["['Bytedance', 'Bytedesign', 'Bytenumner']", "['Example', 'Sample', 'Demo']"],
  ['Bytedance Technology Co., Ltd.', 'Example Technology Co., Ltd.'],
  ['Bytedesign', 'SuzumeDesign'],
  ['Bytenumner', 'ExampleCorp'],
  ['ByteDance', 'Example'],
  ['Bytedance', 'Example'],
  ['bytedance', 'example'],
  ['byteui', 'suzumeui'],
  ['bytedesign', 'suzumedesign'],
  ['ARCO', 'SUZUME'],
  ['Arco', 'Suzume'],
  ['arco', 'suzume'],
];

function isText(buf) {
  const len = Math.min(buf.length, 8000);
  for (let i = 0; i < len; i++) {
    if (buf[i] === 0) return false;
  }
  return true;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

let changedFiles = 0;
let changedBytes = 0;

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const base = path.basename(file);
  if (LEGAL_ALLOWLIST.has(base)) continue;
  if (base === 'migrate-brand.js') continue;
  if (base === 'yarn.lock' || base === 'package-lock.json') continue;

  const buf = fs.readFileSync(file);
  if (!isText(buf)) continue;
  const original = buf.toString('utf8');
  let next = original;
  for (const [from, to] of RULES) {
    if (next.includes(from)) next = next.split(from).join(to);
  }
  if (next !== original) {
    changedFiles++;
    changedBytes += Buffer.byteLength(next) - buf.length;
    if (!DRY) fs.writeFileSync(file, next);
  }
}

console.log(`${DRY ? '[dry] ' : ''}brand migration: ${changedFiles} files updated`);
