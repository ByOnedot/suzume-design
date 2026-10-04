#!/usr/bin/env node
/**
 * Replaces demo/test image URLs hosted on the upstream CDN with compact,
 * self-contained SVG data URIs.
 *
 * Why: demos and their snapshots referenced a third-party image CDN that is
 * part of the upstream product's infrastructure. Shipping those URLs would
 * make a Suzume Design installation contact upstream servers and would keep
 * upstream branding inside published demo sources and snapshots.
 *
 * Usage: node scripts/replace-cdn-assets.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'es', 'lib', 'dist', '.coverage', 'tools', 'docs',
]);

// Matches `//host/...`, `http://host/...` and `https://host/...` for the
// upstream CDN family, stopping before quotes, backticks and whitespace so
// template-literal suffixes such as `?timestamp=${x}` are preserved.
const URL_RE = /(?:https?:)?\/\/[a-z0-9.-]*(?:byteimg|byted-static)\.com\/[^'"`\s)]+|[a-z0-9.-]*byteimg\.com\/[^'"`\s)]+/gi;

const PALETTE = ['#165DFF', '#00B42A', '#F77234', '#722ED1', '#14C9C9', '#F5319D', '#F7BA1E', '#86909C'];

function hashIndex(seed, modulo) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % modulo;
}

function svgUri(seed, wide) {
  const c = encodeURIComponent(PALETTE[hashIndex(seed, PALETTE.length)]).replace(/'/g, '%27');
  const body = wide
    ? `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><rect width='640' height='360' fill='${decodeURIComponent(c)}'/><rect width='640' height='140' y='220' fill='%2300000022'/></svg>`
    : `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='160' height='160' fill='${decodeURIComponent(c)}'/><circle cx='80' cy='62' r='30' fill='%23ffffffdd'/><path d='M36 160a44 44 0 0188 0z' fill='%23ffffffdd'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(body).replace(/'/g, '%27').replace(/%2523/g, '%23')}`;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, out);
    } else if (e.isFile()) out.push(p);
  }
  return out;
}

let files = 0;
let urls = 0;
for (const file of walk(ROOT)) {
  if (!/\.(ts|tsx|js|jsx|json|md|html)$/.test(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  URL_RE.lastIndex = 0;
  if (!URL_RE.test(original)) continue;
  URL_RE.lastIndex = 0;
  const next = original.replace(URL_RE, (match) => {
    urls++;
    const wide = /banner|carousel|timeline|list|image|monitor|workplace|studio|\.jpg/i.test(match) === false;
    return svgUri(match, !wide);
  });
  if (next !== original) {
    fs.writeFileSync(file, next);
    files++;
  }
}
console.log(`${urls} URL(s) replaced in ${files} file(s)`);
