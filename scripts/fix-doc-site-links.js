#!/usr/bin/env node
/**
 * Rewrites legacy documentation-site routes (`/react/components/...`,
 * `/react/en-US/components/...`) into relative links to the component's own
 * generated README, so component documentation resolves without the upstream
 * documentation website.
 *
 * Usage: node scripts/fix-doc-site-links.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const COMPONENTS = path.join(ROOT, 'components');

const ROUTE_RE = /\]\(\/react\/(en-US\/|zh-CN\/)?components\/([A-Za-z][A-Za-z0-9-]*)(#[^)]*)?\)/g;

function toPascal(slug) {
  return slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && /\.(md|ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(COMPONENTS)) {
  const original = fs.readFileSync(file, 'utf8');
  ROUTE_RE.lastIndex = 0;
  if (!ROUTE_RE.test(original)) continue;
  ROUTE_RE.lastIndex = 0;

  const zh = /\.zh-CN\.md$|\/locale\/zh-CN\//.test(file);
  const next = original.replace(ROUTE_RE, (_m, lang, slug, hash) => {
    const target = toPascal(slug);
    const language = lang ? lang.replace('/', '') : zh ? 'zh-CN' : 'en-US';
    const targetFile = path.join(COMPONENTS, target, `README.${language}.md`);
    if (!fs.existsSync(targetFile)) return `](components/${target})`;
    const rel = path.relative(path.dirname(file), targetFile).split(path.sep).join('/');
    return `](${rel}${hash || ''})`;
  });

  if (next !== original && !DRY) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
console.log(`${DRY ? '[dry] ' : ''}${changed} file(s) updated`);
