// scripts/generate-bulk-manifest.mjs
//
// Postbuild: walk dist/ and emit dist/aiguide-bulk-manifest.json.
// The list contains every URL the SW must download after the user
// installs the PWA: every lesson HTML, every skill .txt, all of
// /pagefind/, and /recap/<locale>.json (lesson summaries for the Recap).
// Excludes the offline pages (already in the Workbox
// precache), the home and 404, sourcemaps, and SA proxy assets.

import fs from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const OUT = path.join(DIST, 'aiguide-bulk-manifest.json');

async function walk(dir, acc = []) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) await walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function toUrl(absPath) {
  // dist/it/start-here/index.html → /it/start-here/
  // dist/skills/it/foo.txt        → /skills/it/foo.txt
  let p = absPath.replace(/\\/g, '/').replace(/^dist/, '');
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  return p;
}

function isLessonHtml(absPath) {
  if (!absPath.endsWith('index.html')) return false;
  const url = toUrl(absPath);
  if (url === '/') return false;          // home (redirect-only) — skip
  if (url === '/en/' || url === '/it/') return false; // locale homes — skip
  if (url === '/404/') return false;
  if (url.endsWith('/offline/')) return false; // already in precache
  return /^\/(en|it)\//.test(url);
}

function isSkillFile(absPath) {
  return absPath.replace(/\\/g, '/').match(/\/dist\/skills\/(en|it)\/.+\.txt$/) !== null
      || absPath.replace(/\\/g, '/').match(/^dist\/skills\/(en|it)\/.+\.txt$/) !== null;
}

function isRecapData(absPath) {
  return /(^|\/)dist\/recap\/(en|it)\.json$/.test(absPath.replace(/\\/g, '/'));
}

function isPagefindFile(absPath) {
  return absPath.replace(/\\/g, '/').includes('/dist/pagefind/')
      || absPath.replace(/\\/g, '/').startsWith('dist/pagefind/');
}

async function main() {
  const all = await walk(DIST);
  const urls = new Set();
  for (const f of all) {
    if (isLessonHtml(f) || isSkillFile(f) || isRecapData(f) || isPagefindFile(f)) {
      urls.add(toUrl(f));
    }
  }
  const entries = [...urls].sort().map((url) => ({ url }));
  const payload = {
    version: new Date().toISOString(),
    entries,
  };
  await fs.writeFile(OUT, JSON.stringify(payload, null, 2));
  console.log(`[bulk-manifest] wrote ${entries.length} entries to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
