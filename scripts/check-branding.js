#!/usr/bin/env node
/**
 * Suzume Design branding regression scanner.
 *
 * Fails (exit code 1) when a forbidden upstream identifier reappears anywhere
 * in the repository outside of the explicitly allowlisted legal/provenance
 * files.
 *
 * Usage:
 *   node scripts/check-branding.js            # scan this repository
 *   node scripts/check-branding.js <dir>      # scan a directory (e.g. an unpacked npm tarball)
 */
const fs = require('fs');
const path = require('path');

const TARGET = path.resolve(process.argv[2] || path.resolve(__dirname, '..'));
const IS_REPO_ROOT = !process.argv[2];

// ---------------------------------------------------------------------------
// Forbidden upstream identifiers (case sensitive unless noted).
// ---------------------------------------------------------------------------
const FORBIDDEN = [
  /@arco-design\//, // scoped upstream packages
  /arco-design/, // upstream repository / package slug
  /arco_design/,
  /ArcoDesign/i,
  /arcodesign/i,
  /arco\.design/, // upstream website
  /arco\.org/i,
  /(^|[^A-Za-z])Arco([^A-Za-z]|$)/, // standalone brand word "Arco"
  /(^|[^A-Za-z])arco([^A-Za-z]|$)/,
  /(^|[^A-Za-z])ARCO([^A-Za-z]|$)/,
  /arcoblue/i,
  /ArcoBlue/,
  /@arco-plugins/,
  /@arco-themes/,
  /@arco-materials/,
  /arco-scripts/,
  /arco-cli/,
  /arco-doc-site-components/,
  /arco-markdown-loader/,
  /ByteDance/i,
  /byteui/,
  /bytedesign/i,
  /byteimg\.com/,
  /byted-static\.com/,
];

// Explicit, narrow allowlist. Only these paths may contain upstream
// identifiers. Every entry is justified below:
//
//  LICENSE                     - required MIT copyright + permission notice
//  THIRD_PARTY_NOTICES.md      - required attribution / provenance record
//  scripts/check-branding.js   - this scanner necessarily contains the
//                                forbidden patterns as literals
//  scripts/migrate-brand.js    - the rename mapping it applies
//  scripts/pack-check.js       - the tarball auditor asserts the absence of
//                                those same patterns, so it holds them too
//  CHANGELOG.md                - documents the old -> new rename table
//  docs/migration.md           - consumer migration guide; its whole purpose
//                                is to list upstream identifiers and their
//                                Suzume replacements
//  CHANGELOG.md                - documents the old -> new rename table
//  scripts/replace-cdn-assets.js - the upstream-CDN URL remover necessarily
//                                contains the patterns it strips
const FILE_ALLOWLIST = new Set([
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'scripts/check-branding.js',
  'scripts/migrate-brand.js',
  'scripts/pack-check.js',
  'scripts/replace-cdn-assets.js',
  'CHANGELOG.md',
  'docs/migration.md',
]);

// Repositories may extend the allowlist with their own justified entries.
// The file must be an array of repository-relative paths, each accompanied by
// a reason in the accompanying `_comment` field.
try {
  const extra = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'branding-allowlist.json'), 'utf8')
  );
  for (const entry of Object.keys(extra)) {
    if (entry.startsWith('_')) continue;
    FILE_ALLOWLIST.add(entry);
  }
} catch (e) {
  // no repository-specific allowlist
}

// Lines that carry a genuine upstream copyright notice are permitted anywhere.
const COPYRIGHT_LINE = /Copyright\s*(\(c\)|©|\d{4})/i;

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  '.coverage',
  'storybook-static',
]);

const TEXT_EXT = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.txt',
  '.less', '.css', '.scss', '.html', '.htm', '.ejs', '.yml', '.yaml',
  '.sh', '.env', '.map', '.snap', '.svg', '.editorconfig', '.gitignore',
  '.npmrc', '.nvmrc', '.browserslistrc', '.prettierrc', '.eslintrc',
  '.stylelintrc', '.babelrc', '.lock',
]);

const TEXT_BASENAMES = new Set([
  'package.json', 'yarn.lock', 'package-lock.json', 'LICENSE', 'Makefile',
  '.eslintrc', '.stylelintrc', '.prettierrc', '.editorconfig', '.gitignore',
  '.npmignore', '.browserslistrc', '.nvmrc', '.npmrc', 'tsconfig.json',
  'lerna.json', 'netlify.toml',
]);

function isTextFile(filePath) {
  const base = path.basename(filePath);
  if (TEXT_BASENAMES.has(base)) return true;
  if (base.startsWith('.eslintrc') || base.startsWith('.prettierrc')) return true;
  const ext = path.extname(base).toLowerCase();
  if (TEXT_EXT.has(ext)) return true;
  if (ext === '') return true;
  return false;
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const entry of entries) {
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

const violations = [];
const files = walk(TARGET);

for (const file of files) {
  const relRaw = path.relative(TARGET, file).split(path.sep).join('/');
  // Inside an extracted npm tarball everything lives under `package/`.
  const rel = relRaw.replace(/^(\.\/)?package\//, '');
  if (FILE_ALLOWLIST.has(rel)) continue;
  if (!isTextFile(file)) continue;

  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (e) {
    continue;
  }
  if (content.includes('\u0000')) continue;

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (COPYRIGHT_LINE.test(line)) return;
    for (const pattern of FORBIDDEN) {
      if (pattern.test(line)) {
        violations.push({ file: rel, line: index + 1, pattern: String(pattern), text: line.trim().slice(0, 200) });
        break;
      }
    }
  });
}

if (violations.length === 0) {
  console.log(`[check-branding] PASS - ${files.length} files scanned in ${path.relative(process.cwd(), TARGET) || '.'}`);
  process.exit(0);
}

console.error(`[check-branding] FAIL - ${violations.length} forbidden upstream reference(s):\n`);
for (const v of violations.slice(0, 200)) {
  console.error(`  ${v.file}:${v.line}`);
  console.error(`    match: ${v.pattern}`);
  console.error(`    ${v.text}`);
}
if (violations.length > 200) {
  console.error(`  ... and ${violations.length - 200} more`);
}
console.error(
  '\nUpstream identifiers are only permitted in LICENSE / THIRD_PARTY_NOTICES.md ' +
    'and in genuine copyright notices.'
);
process.exit(1);
