#!/usr/bin/env node
/**
 * Link / reference integrity scan for the Suzume Design skill.
 *
 * Every relative markdown link and every file path referenced from a SKILL.md
 * or a reference document must resolve to a file that exists in this
 * repository.
 *
 * Usage: node scripts/check-links.js [rootDir]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET = process.argv[2] ? path.resolve(process.argv[2]) : ROOT;
const SKIP_DIRS = new Set(['.git', 'node_modules']);

// [link target, containing file]
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
// fenced code blocks are stripped before scanning so import specifiers such as
// `@suzume-design/web-react` are not mistaken for links.

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, out);
    } else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function stripCode(text) {
  return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

const problems = [];
const files = walk(TARGET);

for (const file of files) {
  const rel = path.relative(TARGET, file);
  if (base(rel) === 'LICENSE' || base(rel) === 'THIRD_PARTY_NOTICES.md') continue;
  const raw = fs.readFileSync(file, 'utf8');
  const body = stripCode(raw);
  LINK_RE.lastIndex = 0;
  let match;
  while ((match = LINK_RE.exec(body))) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:|#|data:|\/\/)/i.test(target)) continue;
    const clean = target.split('#')[0];
    if (!clean) continue;
    // Bare words such as `trigger#trigger` are heading anchors produced by the
    // documentation generator, not file paths. Only validate targets that look
    // like real paths.
    const looksLikeFile = clean.includes('/') || /\.[a-z0-9]+$/i.test(clean);
    if (!looksLikeFile) continue;
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) {
      problems.push(`${rel} -> ${target}`);
    }
  }
}

function base(p) {
  return path.basename(p);
}

if (problems.length) {
  console.error(`[check-links] FAIL - ${problems.length} broken link(s)`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`[check-links] PASS - ${files.length} markdown file(s) scanned`);
