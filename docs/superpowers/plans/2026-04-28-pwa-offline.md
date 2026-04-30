# PWA + Offline Lessons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `ai-guide.larosa.work` installable as a PWA on all platforms (Chrome/Edge desktop, Chrome Android, iOS Safari) and let installed users read every lesson and use search fully offline, without breaking the privacy-first stance (no backend, no cookies, no third-party telemetry beyond the existing first-party Simple Analytics proxy).

**Architecture:** Two-layer caching service worker. Layer 1 (Workbox precache, atomic, ~200–500 KB) holds the shell — JS, CSS, fonts, icons, manifest, offline page — for everyone from the first visit. Layer 2 (custom bulk cache, idempotent, resumable) holds all lesson HTML, skill `.txt` files, and the full Pagefind index, but only downloads after explicit `appinstalled`. The bulk manifest is a static JSON generated at build time and fetched by the SW each download cycle, so the SW skips files already in cache and resumes after interruption.

**Tech Stack:** Astro 6 + Starlight 0.38, `@vite-pwa/astro` (injectManifest mode), Workbox 7 (`workbox-precaching`, `workbox-routing`, `workbox-strategies`, `workbox-expiration`, `workbox-window`), `sharp` for icon rasterization (already a transitive dependency of Astro), TypeScript for the SW.

**Spec:** `docs/superpowers/specs/2026-04-28-pwa-offline-design.md`.

**Testing note:** the project has no test runner configured. The smoke test for every task is `npm run build` (must complete without errors), plus targeted manual checks in Chrome DevTools (Application tab) and Lighthouse where called out. Don't add Vitest/Playwright/etc. as part of this plan — that's out of scope.

**Branch policy:** all work goes to `main`. Don't merge to `production` as part of any task in this plan; production rollout is a single final step, manual, after the user has tested live.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `scripts/generate-pwa-icons.mjs` | Rasterize PWA icons from `public/favicon.svg` using sharp. Idempotent — skips if PNGs are newer than the SVG. |
| `scripts/generate-bulk-manifest.mjs` | Postbuild script. Walks `dist/` to produce `dist/aiguide-bulk-manifest.json`, the list of URLs the SW downloads after install. |
| `public/icons/pwa-192.png` | PWA icon 192×192, purpose `any`. Output of `generate-pwa-icons.mjs`. |
| `public/icons/pwa-512.png` | PWA icon 512×512, purpose `any`. |
| `public/icons/pwa-512-maskable.png` | PWA icon 512×512, purpose `maskable`, 80% safe-zone. |
| `public/icons/apple-touch-icon.png` | iOS home-screen icon 180×180, no transparency, no rounding. |
| `public/_headers` | Netlify `Cache-Control` rules for `/sw.js`, `/manifest.webmanifest`, `/icons/*`. |
| `src/sw.ts` | Service worker. Precache via Workbox, runtime caching strategies, offline navigation fallback, custom bulk-download handler with resume + prune. |
| `src/components/InstallApp.astro` | Install button + iOS instructions modal + bulk download progress UI. Mounted inside `HeaderPreferences.astro` (internal component, not for `.mdx`). |
| `src/content/docs/en/offline.mdx` | Localized offline fallback page (English). |
| `src/content/docs/it/offline.mdx` | Localized offline fallback page (Italian). |

**Modified:**

| File | What changes |
|---|---|
| `package.json` | Add deps (`@vite-pwa/astro`, `workbox-*`); add scripts `prebuild` (icons) and `postbuild` (bulk manifest). |
| `astro.config.mjs` | Add `AstroPWA` integration (`injectManifest` strategy) with manifest config and glob filters. |
| `src/components/Head.astro` | `<link rel="manifest">`, `<link rel="apple-touch-icon">`, two `<meta name="theme-color">` with `prefers-color-scheme` media queries, and the SW registration via `virtual:pwa-register`. |
| `src/components/HeaderPreferences.astro` | Fourth section "App" mounting `<InstallApp />`. |
| `src/i18n/ui.ts` | New keys for the install button, iOS modal, bulk progress label. |
| `CLAUDE.md` | New "PWA e offline" subsection under "Architettura". Note that `<InstallApp>` is internal (not a `.mdx`-facing component) and lives in `src/components/` only. |

---

## Task 1: Icon generation script

**Files:**
- Create: `scripts/generate-pwa-icons.mjs`
- Modify: `package.json` (add `prebuild` script)

- [ ] **Step 1.1: Write `scripts/generate-pwa-icons.mjs`**

```js
// scripts/generate-pwa-icons.mjs
//
// Rasterize PWA icons from public/favicon.svg.
// Idempotent: skips outputs newer than the source SVG.
//
// Outputs:
//   public/icons/pwa-192.png             (192×192, purpose "any")
//   public/icons/pwa-512.png             (512×512, purpose "any")
//   public/icons/pwa-512-maskable.png    (512×512, purpose "maskable", 80% safe-zone)
//   public/icons/apple-touch-icon.png    (180×180, iOS home screen)

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'public/favicon.svg';
const OUT_DIR = 'public/icons';

const TARGETS = [
  { name: 'pwa-192.png',          size: 192, maskable: false },
  { name: 'pwa-512.png',          size: 512, maskable: false },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'pwa-512-maskable.png', size: 512, maskable: true  },
];

// For maskable PWA icons: launcher crops the canvas into a circle/squircle.
// Content must live in the central 80% (safe-zone). Background fills 100%.
function maskableSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#E07A5F"/>
  <text x="50" y="62" text-anchor="middle"
        font-family="'Outfit', system-ui, sans-serif"
        font-size="38" font-weight="700" fill="#FCEEE3"
        letter-spacing="-1">AI</text>
</svg>`;
}

async function isUpToDate(outputPath, srcMtime) {
  try {
    const stat = await fs.stat(outputPath);
    return stat.mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

async function main() {
  const srcStat = await fs.stat(SRC);
  await fs.mkdir(OUT_DIR, { recursive: true });
  const srcSvg = await fs.readFile(SRC, 'utf8');

  for (const { name, size, maskable } of TARGETS) {
    const out = path.join(OUT_DIR, name);
    if (await isUpToDate(out, srcStat.mtimeMs)) {
      console.log(`[icons] skip (up-to-date): ${name}`);
      continue;
    }
    const input = Buffer.from(maskable ? maskableSvg() : srcSvg);
    await sharp(input).resize(size, size).png().toFile(out);
    console.log(`[icons] wrote ${name} (${size}×${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 1.2: Add `prebuild` script to `package.json`**

Modify `package.json` so the `scripts` block becomes:

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "prebuild": "node scripts/generate-pwa-icons.mjs",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro"
}
```

- [ ] **Step 1.3: Run the script manually**

Run: `node scripts/generate-pwa-icons.mjs`
Expected stdout (first run):
```
[icons] wrote pwa-192.png (192×192)
[icons] wrote pwa-512.png (512×512)
[icons] wrote apple-touch-icon.png (180×180)
[icons] wrote pwa-512-maskable.png (512×512)
```
Expected: four files exist in `public/icons/`.

Run a second time: each line should be `[icons] skip (up-to-date): …`.

- [ ] **Step 1.4: Visually inspect outputs**

Open each PNG in an image viewer:
- `pwa-192.png`, `pwa-512.png`: square coral background with rounded corners and "AI" in peach.
- `apple-touch-icon.png`: same as above but 180×180.
- `pwa-512-maskable.png`: square coral background **without** rounded corners (Android crops), "AI" centered in the inner ~80%.

If the "AI" glyph renders with a fallback font (e.g. Arial) instead of Outfit because Outfit isn't installed system-wide, that's acceptable — the icon is read at home-screen distance, not at typographic precision.

- [ ] **Step 1.5: Commit**

```bash
git add scripts/generate-pwa-icons.mjs package.json public/icons/
git commit -m "Add PWA icon generation script and outputs"
```

---

## Task 2: Install PWA and Workbox dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 2.1: Install dependencies**

Run:
```bash
npm install --save-dev @vite-pwa/astro workbox-window workbox-precaching workbox-routing workbox-strategies workbox-expiration
```

Expected: install finishes without errors. `package.json` `devDependencies` now includes the six packages.

- [ ] **Step 2.2: Verify `package.json` shape**

Read `package.json`. Expected: a `devDependencies` block (created if absent) containing the six entries with concrete version ranges (e.g. `"@vite-pwa/astro": "^0.something"`).

- [ ] **Step 2.3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Install @vite-pwa/astro and Workbox runtime dependencies"
```

---

## Task 3: Configure AstroPWA integration

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 3.1: Add the import and integration block**

In `astro.config.mjs`, add the import below the existing imports:

```js
import AstroPWA from '@vite-pwa/astro';
```

Inside the `integrations: [...]` array, **append** (after the existing `starlight({...})` call, separated by a comma):

```js
AstroPWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  registerType: 'autoUpdate',
  injectRegister: false, // we register manually inside Head.astro
  manifest: {
    name: 'AI-Guide',
    short_name: 'AI-Guide',
    description: "Impara a usare l'IA, dai fondamenti al livello avanzato.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    theme_color: '#E07A5F',
    background_color: '#FCEEE3',
    lang: 'en',
    icons: [
      { src: '/icons/pwa-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  injectManifest: {
    globPatterns: [
      '**/*.{js,css,woff2,svg}',
      '_astro/**/*',
      'icons/*.png',
      'favicon.svg',
      'manifest.webmanifest',
      'offline/index.html',
      'en/offline/index.html',
      'it/offline/index.html',
    ],
    globIgnores: [
      '**/*.map',
      '**/sa/**',
      'sw.js',
      'workbox-*.js',
    ],
  },
  devOptions: {
    enabled: false,
  },
}),
```

`devOptions.enabled: false` keeps the SW out of `npm run dev` so hot module reload behaves normally during development.

- [ ] **Step 3.2: Create a placeholder `src/sw.ts` so the next build doesn't fail**

Create `src/sw.ts` with the bare minimum (it'll be filled in Task 4):

```ts
/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: { url: string; revision: string | null }[];
};

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
```

- [ ] **Step 3.3: Run a build to verify the integration is wired**

Run: `npm run build`
Expected: build completes; final lines from VitePWA mention writing `sw.js` and `manifest.webmanifest` into `dist/`. Check that `dist/sw.js` and `dist/manifest.webmanifest` exist.

- [ ] **Step 3.4: Commit**

```bash
git add astro.config.mjs src/sw.ts
git commit -m "Wire @vite-pwa/astro integration with manifest config"
```

---

## Task 4: Service worker — precache + runtime caching + offline fallback

**Files:**
- Modify: `src/sw.ts`

This task replaces the placeholder from Task 3 with the full Layer 1 (precache) + Layer 3 (runtime) implementation. Layer 2 (bulk download) comes in Task 6 after the manifest pipeline exists.

- [ ] **Step 4.1: Replace `src/sw.ts` content**

Overwrite `src/sw.ts` with:

```ts
/// <reference lib="webworker" />
import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: { url: string; revision: string | null }[];
};

// ---------------------------------------------------------------------------
// Layer 1 — Workbox precache: shell (JS, CSS, fonts, icons, offline pages).
// ---------------------------------------------------------------------------
precacheAndRoute(self.__WB_MANIFEST);

// ---------------------------------------------------------------------------
// Layer 3 — Runtime caching for the casual visitor (no install).
// ---------------------------------------------------------------------------

// Navigation requests: NetworkFirst with a 4s timeout, fall back to cache,
// then to /offline/ via setCatchHandler (registered below).
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'aiguide-pages-v1',
    networkTimeoutSeconds: 4,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
);

// Skill .txt files: small, fine to revalidate in background.
registerRoute(
  ({ url }) => url.pathname.startsWith('/skills/') && url.pathname.endsWith('.txt'),
  new StaleWhileRevalidate({
    cacheName: 'aiguide-skills-v1',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// Pagefind chunks (JS + meta + index + fragment shards).
registerRoute(
  ({ url }) => url.pathname.startsWith('/pagefind/'),
  new StaleWhileRevalidate({
    cacheName: 'aiguide-pagefind-v1',
    plugins: [
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// og-image (rarely touched).
registerRoute(
  ({ url }) => url.pathname === '/og-image.png',
  new CacheFirst({
    cacheName: 'aiguide-og-v1',
    plugins: [
      new ExpirationPlugin({ maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// Simple Analytics (/sa/**) is intentionally NOT intercepted: it must reach
// the network so that the SA Worker proxy and SA backend see real-time hits.
// No registerRoute → no interception.

// ---------------------------------------------------------------------------
// Offline navigation fallback.
// ---------------------------------------------------------------------------
setCatchHandler(async ({ request }) => {
  if (request.destination !== 'document') return Response.error();
  const url = new URL(request.url);
  const offlinePath = url.pathname.startsWith('/it/')
    ? '/it/offline/'
    : '/en/offline/';
  const cached = await matchPrecache(offlinePath);
  return cached || Response.error();
});

// ---------------------------------------------------------------------------
// Lifecycle: take control immediately so updates apply on next navigation.
// ---------------------------------------------------------------------------
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
```

- [ ] **Step 4.2: Build to verify**

Run: `npm run build`
Expected: build succeeds. `dist/sw.js` exists and is larger than the placeholder (contains Workbox runtime). No TypeScript errors.

- [ ] **Step 4.3: Commit**

```bash
git add src/sw.ts
git commit -m "Implement SW layer 1 (precache) and runtime caching strategies"
```

---

## Task 5: Localized offline pages

**Files:**
- Create: `src/content/docs/en/offline.mdx`
- Create: `src/content/docs/it/offline.mdx`

These are precached by Workbox via the `globPatterns` set in Task 3.

- [ ] **Step 5.1: Create `src/content/docs/en/offline.mdx`**

```mdx
---
title: You're offline
description: The page you wanted isn't available offline.
---

You're offline, and this page isn't saved on your device yet.

The lessons you've already opened stay available: head back to the home
and pick a lesson from there.

[Back to the home](/en/)
```

- [ ] **Step 5.2: Create `src/content/docs/it/offline.mdx`**

```mdx
---
title: Sei offline
description: La pagina che cerchi non è disponibile offline.
---

Sei senza connessione e questa pagina non è ancora salvata sul tuo
dispositivo.

Le lezioni che hai già letto restano disponibili: torna alla home e
scegline una da lì.

[Torna alla home](/it/)
```

Note: no `livello` in the frontmatter, so `PageTitle` doesn't add the reading-time line and `Footer` doesn't add `ShareLesson`.

- [ ] **Step 5.3: Build and visit the pages**

Run: `npm run build && npm run preview`
Open `http://localhost:4321/en/offline/` and `http://localhost:4321/it/offline/`. Both should render with the rest of the site chrome (header, footer) and the message body.

- [ ] **Step 5.4: Commit**

```bash
git add src/content/docs/en/offline.mdx src/content/docs/it/offline.mdx
git commit -m "Add localized offline fallback pages"
```

---

## Task 6: Bulk manifest postbuild script

**Files:**
- Create: `scripts/generate-bulk-manifest.mjs`
- Modify: `package.json` (add `postbuild` script)

- [ ] **Step 6.1: Write the script**

Create `scripts/generate-bulk-manifest.mjs`:

```js
// scripts/generate-bulk-manifest.mjs
//
// Postbuild: walk dist/ and emit dist/aiguide-bulk-manifest.json.
// The list contains every URL the SW must download after the user
// installs the PWA: every lesson HTML, every skill .txt, all of
// /pagefind/. Excludes the offline pages (already in the Workbox
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

function isPagefindFile(absPath) {
  return absPath.replace(/\\/g, '/').includes('/dist/pagefind/')
      || absPath.replace(/\\/g, '/').startsWith('dist/pagefind/');
}

async function main() {
  const all = await walk(DIST);
  const urls = new Set();
  for (const f of all) {
    if (isLessonHtml(f) || isSkillFile(f) || isPagefindFile(f)) {
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
```

- [ ] **Step 6.2: Add `postbuild` to `package.json`**

The `scripts` block becomes:

```json
"scripts": {
  "dev": "astro dev",
  "start": "astro dev",
  "prebuild": "node scripts/generate-pwa-icons.mjs",
  "build": "astro build",
  "postbuild": "node scripts/generate-bulk-manifest.mjs",
  "preview": "astro preview",
  "astro": "astro"
}
```

- [ ] **Step 6.3: Run the build and verify the manifest**

Run: `npm run build`
Expected last line of build output (or near it): `[bulk-manifest] wrote N entries to dist/aiguide-bulk-manifest.json`, with N matching the number of lessons in IT + EN + skill files + pagefind files (probably 100–300).

Open `dist/aiguide-bulk-manifest.json` and spot-check:
- includes `/it/fundamentals/what-is-ai/` and `/en/fundamentals/what-is-ai/`;
- includes `/skills/it/<some-file>.txt`;
- includes `/pagefind/pagefind.js` and several `/pagefind/index/*.pf_index`;
- does NOT include `/`, `/en/`, `/it/`, `/en/offline/`, `/it/offline/`, or any `*.map`.

- [ ] **Step 6.4: Commit**

```bash
git add scripts/generate-bulk-manifest.mjs package.json
git commit -m "Generate bulk download manifest at postbuild"
```

---

## Task 7: SW — bulk download handler with resume

**Files:**
- Modify: `src/sw.ts`

- [ ] **Step 7.1: Append the bulk download logic to `src/sw.ts`**

Add at the **bottom** of `src/sw.ts` (after the existing lifecycle handlers from Task 4):

```ts
// ---------------------------------------------------------------------------
// Layer 2 — Bulk download (gated behind PWA install).
//
// Fetches /aiguide-bulk-manifest.json (generated at build time) and walks
// the entries. Each fetch is atomic via cache.put, so an interruption only
// loses the in-flight file. The next trigger resumes by skipping anything
// already in the BULK cache.
// ---------------------------------------------------------------------------
const BULK_CACHE = 'aiguide-bulk-v1';
let bulkRunning = false;

interface BulkEntry { url: string; }
interface BulkPayload { version: string; entries: BulkEntry[]; }

async function broadcastProgress(done: number, total: number) {
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const c of clients) {
    c.postMessage({ type: 'AIGUIDE_BULK_PROGRESS', done, total });
  }
}

async function pruneStaleBulk(entries: BulkEntry[]) {
  const cache = await caches.open(BULK_CACHE);
  const validUrls = new Set(entries.map((e) => e.url));
  for (const req of await cache.keys()) {
    const pathname = new URL(req.url).pathname;
    if (!validUrls.has(pathname)) {
      await cache.delete(req);
    }
  }
}

async function downloadBulk() {
  if (bulkRunning) return;
  bulkRunning = true;
  try {
    const manifestResp = await fetch('/aiguide-bulk-manifest.json', { cache: 'no-store' });
    if (!manifestResp.ok) return;
    const { entries } = (await manifestResp.json()) as BulkPayload;
    const cache = await caches.open(BULK_CACHE);
    const total = entries.length;
    let done = 0;
    for (const entry of entries) {
      const hit = await cache.match(entry.url);
      if (hit) {
        done++;
        await broadcastProgress(done, total);
        continue;
      }
      try {
        const resp = await fetch(entry.url, { cache: 'no-store' });
        if (resp.ok) {
          await cache.put(entry.url, resp.clone());
        }
        done++;
        await broadcastProgress(done, total);
      } catch {
        // Offline mid-loop: stop here. The next trigger resumes.
        return;
      }
    }
    if (done === total) {
      await pruneStaleBulk(entries);
    }
  } finally {
    bulkRunning = false;
  }
}

// Serve cached bulk entries when the network is unavailable for navigation
// or skill/pagefind requests. The runtime strategies in Layer 3 are
// network-first, so the bulk cache is consulted only on network failure.
// We hook a fallback at the catch handler level (already declared above):
// we extend it to also try BULK_CACHE before giving up.
// (Implemented inline by augmenting the existing setCatchHandler is fragile,
// so instead we add a route that consults the bulk cache as the last
// fallback, matching only when navigator is offline.)
registerRoute(
  ({ url, request }) =>
    (request.mode === 'navigate' ||
      url.pathname.startsWith('/skills/') ||
      url.pathname.startsWith('/pagefind/')) &&
    !navigator.onLine,
  async ({ request }) => {
    const cache = await caches.open(BULK_CACHE);
    const hit = await cache.match(request.url);
    if (hit) return hit;
    return Response.error();
  }
);

self.addEventListener('message', (event) => {
  if (event.data?.type === 'AIGUIDE_BULK_DOWNLOAD') {
    event.waitUntil(downloadBulk());
  }
});
```

`registerRoute` is already imported from `workbox-routing` in Task 4, so no new import is needed.

- [ ] **Step 7.2: Build to verify**

Run: `npm run build`
Expected: build succeeds without TS errors. `dist/sw.js` is now bigger.

- [ ] **Step 7.3: Manual SW dev-tools check**

Run: `npm run preview`
Open `http://localhost:4321/en/`, then DevTools → Application → Service Workers. The new SW should be `activated and is running`. Application → Cache Storage should show at minimum `workbox-precache-v2-...` after a couple seconds.

In DevTools Console, send a message to trigger the bulk:
```js
navigator.serviceWorker.controller.postMessage({ type: 'AIGUIDE_BULK_DOWNLOAD' });
```

Watch Network tab: requests to `/aiguide-bulk-manifest.json` first, then a stream of fetches to lessons / skills / pagefind. Application → Cache Storage → `aiguide-bulk-v1` should populate.

- [ ] **Step 7.4: Manual interrupt-and-resume check**

While the bulk is still downloading, in DevTools → Application → Service Workers click "Stop". Re-trigger:
```js
navigator.serviceWorker.controller.postMessage({ type: 'AIGUIDE_BULK_DOWNLOAD' });
```
The Network tab should show fetches **only** for files not yet in `aiguide-bulk-v1`. The previously cached entries are skipped instantly.

- [ ] **Step 7.5: Commit**

```bash
git add src/sw.ts
git commit -m "Implement SW layer 2 (bulk download with resume and prune)"
```

---

## Task 8: i18n strings for install UI

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 8.1: Add the new keys to the `UIStrings` interface**

In `src/i18n/ui.ts`, **append** the following block inside the `UIStrings` interface, after the `// HeaderPreferences popover` block (so the new section sits with related popover keys):

```typescript
  // InstallApp (PWA install + bulk download progress)
  prefsSectionApp: string;
  installButtonLabel: string;
  installInProgress: string;
  installAlreadyInstalled: string;
  installAlreadyInstalledReady: string;
  installBulkProgress: string; // "Scarico per offline · {done}/{total}"
  installIosTitle: string;
  installIosStep1: string;
  installIosStep2: string;
  installIosStep3: string;
  installIosClose: string;
```

- [ ] **Step 8.2: Add Italian values**

In the `it` object, **append** (anywhere after the `prefsSectionLanguage` line, but for readability, immediately after the popover block):

```typescript
  prefsSectionApp: 'App',
  installButtonLabel: "Installa l'app",
  installInProgress: 'Installazione…',
  installAlreadyInstalled: 'App installata',
  installAlreadyInstalledReady: 'App installata · pronta offline',
  installBulkProgress: 'Scarico per offline · {done}/{total}',
  installIosTitle: 'Installa AI-Guide su iPhone/iPad',
  installIosStep1: 'Tocca il pulsante Condividi qui sotto.',
  installIosStep2: "Scorri e scegli «Aggiungi alla schermata Home».",
  installIosStep3: 'Conferma con «Aggiungi» in alto a destra.',
  installIosClose: 'Chiudi',
```

- [ ] **Step 8.3: Add English values**

In the `en` object, in the matching position:

```typescript
  prefsSectionApp: 'App',
  installButtonLabel: 'Install the app',
  installInProgress: 'Installing…',
  installAlreadyInstalled: 'App installed',
  installAlreadyInstalledReady: 'App installed · offline ready',
  installBulkProgress: 'Downloading for offline · {done}/{total}',
  installIosTitle: 'Install AI-Guide on iPhone/iPad',
  installIosStep1: 'Tap the Share button below.',
  installIosStep2: 'Scroll and pick "Add to Home Screen".',
  installIosStep3: 'Confirm with "Add" in the top right.',
  installIosClose: 'Close',
```

- [ ] **Step 8.4: Build to verify**

Run: `npm run build`
Expected: succeeds. TypeScript would shout if any key were missing from a locale (the dictionary is strictly typed via `Record<Locale, UIStrings>`).

- [ ] **Step 8.5: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "Add i18n strings for PWA install UI"
```

---

## Task 9: InstallApp component

**Files:**
- Create: `src/components/InstallApp.astro`

This component renders the install button, the bulk download progress, and the iOS instructions modal. It's mounted by `HeaderPreferences.astro` (Task 10).

- [ ] **Step 9.1: Create the file**

Create `src/components/InstallApp.astro`:

```astro
---
/**
 * InstallApp: install button + bulk download progress + iOS modal.
 *
 * Internal component, not meant to be imported from `.mdx` lessons.
 * Mounted as the fourth section of `HeaderPreferences.astro`.
 *
 * State machine:
 *   installable                → button "Install the app" active
 *   ios-installable            → button opens an instructions modal
 *   installing                 → button disabled, label "Installing…"
 *   installed-online           → static label "App installed" + progress row
 *   installed-offline-complete → static label "App installed · offline ready"
 *
 * The component triggers `AIGUIDE_BULK_DOWNLOAD` via postMessage when:
 *   - `appinstalled` fires;
 *   - the page loads in `display-mode: standalone` (resume after restart);
 *   - the browser regains connectivity (`online` event) while standalone.
 */
import { t } from '../i18n/ui';
const ui = t(Astro.currentLocale);

const translations = {
  installButtonLabel: ui.installButtonLabel,
  installInProgress: ui.installInProgress,
  installAlreadyInstalled: ui.installAlreadyInstalled,
  installAlreadyInstalledReady: ui.installAlreadyInstalledReady,
  installBulkProgress: ui.installBulkProgress,
  installIosTitle: ui.installIosTitle,
  installIosStep1: ui.installIosStep1,
  installIosStep2: ui.installIosStep2,
  installIosStep3: ui.installIosStep3,
  installIosClose: ui.installIosClose,
};
---

<install-app
  class="install-app"
  data-translations={JSON.stringify(translations)}
>
  <div class="install-row">
    <button type="button" class="install-btn" data-install-btn hidden>
      {ui.installButtonLabel}
    </button>
    <span class="install-status" data-install-status hidden></span>
  </div>

  <div class="install-progress" data-install-progress hidden>
    <div class="install-progress-bar">
      <span class="install-progress-fill" data-install-progress-fill></span>
    </div>
    <span class="install-progress-label" data-install-progress-label></span>
  </div>

  <dialog class="install-ios-modal" data-install-ios-modal>
    <h3>{ui.installIosTitle}</h3>
    <ol>
      <li>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 16V4M8 8l4-4 4 4M4 14v6h16v-6"/>
        </svg>
        <span>{ui.installIosStep1}</span>
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="3"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span>{ui.installIosStep2}</span>
      </li>
      <li>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{ui.installIosStep3}</span>
      </li>
    </ol>
    <button type="button" class="install-ios-close" data-install-ios-close>
      {ui.installIosClose}
    </button>
  </dialog>
</install-app>

<script>
  type Translations = {
    installButtonLabel: string;
    installInProgress: string;
    installAlreadyInstalled: string;
    installAlreadyInstalledReady: string;
    installBulkProgress: string;
    installIosTitle: string;
    installIosStep1: string;
    installIosStep2: string;
    installIosStep3: string;
    installIosClose: string;
  };

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  function isIos(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  function isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      (navigator as unknown as { standalone?: boolean }).standalone === true
    );
  }

  class InstallApp extends HTMLElement {
    private deferredPrompt: BeforeInstallPromptEvent | null = null;
    private translations!: Translations;
    private btn!: HTMLButtonElement;
    private status!: HTMLElement;
    private progress!: HTMLElement;
    private progressFill!: HTMLElement;
    private progressLabel!: HTMLElement;
    private modal!: HTMLDialogElement;
    private modalClose!: HTMLButtonElement;

    connectedCallback() {
      if (this.dataset.wired === 'true') return;
      this.dataset.wired = 'true';

      this.translations = JSON.parse(this.dataset.translations || '{}');
      this.btn = this.querySelector<HTMLButtonElement>('[data-install-btn]')!;
      this.status = this.querySelector<HTMLElement>('[data-install-status]')!;
      this.progress = this.querySelector<HTMLElement>('[data-install-progress]')!;
      this.progressFill = this.querySelector<HTMLElement>('[data-install-progress-fill]')!;
      this.progressLabel = this.querySelector<HTMLElement>('[data-install-progress-label]')!;
      this.modal = this.querySelector<HTMLDialogElement>('[data-install-ios-modal]')!;
      this.modalClose = this.querySelector<HTMLButtonElement>('[data-install-ios-close]')!;

      this.wireEvents();
      this.refresh();

      if (isStandalone()) {
        this.requestBulkDownload();
      }
    }

    private wireEvents() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.refresh();
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.refresh();
        this.requestBulkDownload();
      });

      window.addEventListener('online', () => {
        if (isStandalone()) this.requestBulkDownload();
      });

      this.btn.addEventListener('click', async () => {
        if (isIos() && !isStandalone()) {
          this.modal.showModal();
          return;
        }
        if (!this.deferredPrompt) return;
        this.btn.disabled = true;
        this.btn.textContent = this.translations.installInProgress;
        try {
          await this.deferredPrompt.prompt();
          await this.deferredPrompt.userChoice;
        } finally {
          this.deferredPrompt = null;
          this.refresh();
        }
      });

      this.modalClose.addEventListener('click', () => this.modal.close());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.modal.close();
      });

      navigator.serviceWorker?.addEventListener('message', (event) => {
        if (event.data?.type !== 'AIGUIDE_BULK_PROGRESS') return;
        this.updateProgress(event.data.done, event.data.total);
      });
    }

    private refresh() {
      const installed = isStandalone();
      const iosCanInstall = isIos() && !installed;

      if (installed) {
        // Static "installed" label; progress is shown only while DL active.
        this.btn.hidden = true;
        this.status.hidden = false;
        this.status.textContent = this.translations.installAlreadyInstalled;
        return;
      }

      if (this.deferredPrompt || iosCanInstall) {
        this.btn.hidden = false;
        this.btn.disabled = false;
        this.btn.textContent = this.translations.installButtonLabel;
        this.status.hidden = true;
        return;
      }

      // Browser doesn't support install (or hasn't fired the prompt yet).
      this.btn.hidden = true;
      this.status.hidden = true;
    }

    private requestBulkDownload() {
      navigator.serviceWorker?.controller?.postMessage({
        type: 'AIGUIDE_BULK_DOWNLOAD',
      });
    }

    private updateProgress(done: number, total: number) {
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      this.progressFill.style.width = `${pct}%`;
      this.progressLabel.textContent = this.translations.installBulkProgress
        .replace('{done}', String(done))
        .replace('{total}', String(total));

      if (done >= total) {
        this.progress.hidden = true;
        this.status.textContent = this.translations.installAlreadyInstalledReady;
        this.status.hidden = false;
      } else {
        this.progress.hidden = false;
      }
    }
  }

  if (!customElements.get('install-app')) {
    customElements.define('install-app', InstallApp);
  }
</script>

<style is:global>
  install-app {
    display: block;
  }

  install-app .install-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  install-app .install-btn {
    appearance: none;
    border: 1px solid var(--sl-color-accent);
    background: var(--sl-color-accent);
    color: var(--sl-color-text-invert);
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 120ms ease;
  }
  install-app .install-btn:hover {
    background: var(--sl-color-accent-high);
    border-color: var(--sl-color-accent-high);
  }
  install-app .install-btn[hidden] { display: none; }

  install-app .install-status {
    font-size: 0.85rem;
    color: var(--sl-color-gray-3);
  }
  install-app .install-status[hidden] { display: none; }

  install-app .install-progress {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  install-app .install-progress[hidden] { display: none; }

  install-app .install-progress-bar {
    flex: 1;
    height: 4px;
    background: var(--sl-color-accent-low);
    border-radius: 999px;
    overflow: hidden;
  }
  install-app .install-progress-fill {
    display: block;
    height: 100%;
    background: var(--sl-color-accent);
    width: 0%;
    transition: width 200ms ease;
  }
  install-app .install-progress-label {
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
    white-space: nowrap;
  }

  install-app .install-ios-modal {
    border: 1px solid var(--sl-color-hairline);
    border-radius: 0.9rem;
    padding: 1.2rem 1.4rem;
    background: var(--aig-elevated-bg);
    color: var(--sl-color-text);
    max-width: 22rem;
    box-shadow:
      0 4px 12px rgba(var(--aig-shadow-color), 0.06),
      0 14px 36px rgba(var(--aig-shadow-color), 0.12);
  }
  install-app .install-ios-modal::backdrop {
    background: var(--aig-scrim);
  }
  install-app .install-ios-modal h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
  }
  install-app .install-ios-modal ol {
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.6rem;
  }
  install-app .install-ios-modal li {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  install-app .install-ios-modal li svg {
    color: var(--sl-color-accent);
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
  install-app .install-ios-close {
    appearance: none;
    border: 1px solid var(--sl-color-hairline);
    background: transparent;
    color: var(--sl-color-text);
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
    font-size: 0.85rem;
    cursor: pointer;
  }
  install-app .install-ios-close:hover {
    background: var(--aig-hover-wash);
  }
</style>
```

- [ ] **Step 9.2: Build to verify**

Run: `npm run build`
Expected: succeeds. The component compiles even though it's not yet mounted anywhere.

- [ ] **Step 9.3: Commit**

```bash
git add src/components/InstallApp.astro
git commit -m "Add InstallApp component (button, iOS modal, bulk progress)"
```

---

## Task 10: Mount InstallApp in HeaderPreferences

**Files:**
- Modify: `src/components/HeaderPreferences.astro`

- [ ] **Step 10.1: Import InstallApp at the top of the frontmatter**

In `src/components/HeaderPreferences.astro`, in the frontmatter (`---` block at the top), add the import below the existing imports:

```astro
import InstallApp from './InstallApp.astro';
```

- [ ] **Step 10.2: Add the new section in the popover panel**

Inside the `<div id={panelId} class="hp-panel" ...>` block, **after** the existing Language `<section>` (which is the third section), append a fourth section:

```astro
    <section class="hp-section">
      <span class="hp-section-title">{ui.prefsSectionApp}</span>
      <div class="hp-install">
        <InstallApp />
      </div>
    </section>
```

- [ ] **Step 10.3: Add the wrapper style at the end of the `<style>` block**

In the `<style>` block of `HeaderPreferences.astro`, **append** (right before the closing `</style>`):

```css
  .hp-install {
    margin-top: 0.4rem;
  }
```

- [ ] **Step 10.4: Build and check the popover renders**

Run: `npm run build && npm run preview`
Open `http://localhost:4321/en/`. Click the preferences icon in the header. The popover should now show four sections, the last one labeled "App". The install button may or may not appear depending on the browser (Chrome desktop typically waits for engagement before firing `beforeinstallprompt`; iOS will detect itself and show the button).

- [ ] **Step 10.5: Commit**

```bash
git add src/components/HeaderPreferences.astro
git commit -m "Mount InstallApp as fourth section of preferences popover"
```

---

## Task 11: Head.astro — manifest, theme-color, SW registration

**Files:**
- Modify: `src/components/Head.astro`

- [ ] **Step 11.1: Add the manifest, apple-touch-icon, and theme-color metas**

In `src/components/Head.astro`, after the existing OG/Twitter image metas (`<meta name="twitter:image" ...>`) and **before** the `{import.meta.env.PROD && (...)}` block, add:

```astro
<link rel="manifest" href="/manifest.webmanifest" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<meta name="theme-color" content="#FCEEE3" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#1C130D" media="(prefers-color-scheme: dark)" />
```

- [ ] **Step 11.2: Register the service worker**

At the bottom of the file, **after** the existing `<script>import '../scripts/progress.ts';</script>` block, add a new script block:

```astro
<script>
  import { registerSW } from 'virtual:pwa-register';

  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    registerSW({ immediate: true });
  }
</script>
```

- [ ] **Step 11.3: Build and verify**

Run: `npm run build && npm run preview`
Open `http://localhost:4321/en/` in a fresh incognito window. DevTools → Application:
- Manifest tab: shows the AI-Guide manifest with the four icons.
- Service Workers: a worker registered at scope `/`, status "activated and is running".
- Network tab on first reload: requests to `/sw.js`, `/manifest.webmanifest`, `/registerSW.js` (or similar virtual file).

- [ ] **Step 11.4: Commit**

```bash
git add src/components/Head.astro
git commit -m "Wire manifest link, apple-touch-icon, theme-color, SW registration"
```

---

## Task 12: Netlify Cache-Control headers

**Files:**
- Create: `public/_headers`

- [ ] **Step 12.1: Create `public/_headers`**

```
/sw.js
  Cache-Control: public, max-age=0, must-revalidate

/manifest.webmanifest
  Cache-Control: public, max-age=3600

/icons/*
  Cache-Control: public, max-age=31536000, immutable

/aiguide-bulk-manifest.json
  Cache-Control: public, max-age=0, must-revalidate
```

We do NOT add a rule for `/registerSW.js`: with `injectRegister: false` in `astro.config.mjs` (Task 3) and the `virtual:pwa-register` import (Task 11), VitePWA inlines the registration into the bundled JS and does not emit a standalone `registerSW.js` file.

The `aiguide-bulk-manifest.json` rule mirrors the SW: that endpoint must always reflect the current build. The icons are content-addressed only by filename here (no hash), so 1-year `immutable` is acceptable because they only change in code (script `prebuild`) and a filename change would force a fetch anyway — but the more conservative reader can soften this to a 30-day cache later if needed; not in this plan.

- [ ] **Step 12.2: Build and check the headers file lands in dist**

Run: `npm run build`
Expected: `dist/_headers` exists and matches the file above (Astro copies anything under `public/` verbatim).

- [ ] **Step 12.3: Commit**

```bash
git add public/_headers
git commit -m "Add Cache-Control headers for SW, manifest, and icons"
```

---

## Task 13: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 13.1: Add the new architecture subsection**

In `CLAUDE.md`, find the `## Architettura (alto livello)` section. **Append** at the end of that section (before the `## Direzione visiva — Pastello` heading) the following block:

```markdown
- **PWA installabile e lezioni offline** (`src/sw.ts`, `src/components/InstallApp.astro`, integration `@vite-pwa/astro` in `astro.config.mjs`). Il sito è installabile come Progressive Web App su Chrome/Edge desktop, Chrome Android, e iOS Safari (via "Aggiungi alla schermata Home"). Caching a due livelli:
  - **Layer 1**: Workbox precachea lo "shell" (JS, CSS, font, icone, manifest, pagine `/offline/`) per chiunque visiti il sito, anche senza installare. Atomico, ~200–500 KB.
  - **Layer 2**: bulk download di tutto il manuale (HTML lezioni IT+EN, `.txt` di `public/skills/<lang>/`, intero index Pagefind) gestito a mano dal SW. La lista vive in `dist/aiguide-bulk-manifest.json`, generata a build time da `scripts/generate-bulk-manifest.mjs`. Il SW la fetcha a ogni trigger (`AIGUIDE_BULK_DOWNLOAD` postMessage), skippa idempotentemente i file già in cache, scarica i mancanti, fa prune delle entry obsolete. Trigger: evento `appinstalled`, ogni `astro:page-load` se in `display-mode: standalone`, evento `online` se standalone. Resume automatico dopo interruzione.
  - **Update strategy**: `registerType: 'autoUpdate'` con `skipWaiting()` + `clients.claim()`. Aggiornamenti silenziosi al prossimo navigation event. Il content hashing degli asset Astro + il revision hashing di Workbox rendono l'update incrementale: solo i file cambiati vengono riscaricati.
  - **Bottone "Installa l'app"**: in `HeaderPreferences.astro`, quarta sezione del popover. Chrome/Edge/Android: cattura `beforeinstallprompt`. iOS: apre un modale di istruzioni passo-passo. Già installato (`display-mode: standalone` o `navigator.standalone`): bottone nascosto, mostra stato "App installata · pronta offline" + progress bar durante il bulk DL.
  - **Pagine `/offline/`**: `src/content/docs/<lang>/offline.mdx`, mostrate come fallback solo per navigation request a URL non in cache. Localizzate in IT/EN, scelte dal SW in base al path del documento richiesto.
  - **Icone PWA**: generate a `prebuild` da `scripts/generate-pwa-icons.mjs` (rasterizza `public/favicon.svg` con `sharp` a 192/512/180 standard + 512 maskable con safe-zone Android). Output in `public/icons/`.
  - **Headers di deploy**: `public/_headers` (Netlify) imposta `Cache-Control: max-age=0, must-revalidate` per `/sw.js`, `/registerSW.js`, e `/aiguide-bulk-manifest.json` — sennò Cloudflare/Netlify potrebbero servire una versione obsoleta del SW e bloccare gli update.
  - `<InstallApp>` è un componente **interno**, montato solo dentro `HeaderPreferences.astro`. NON va nel catalogo "Componenti del progetto" (quello cataloga solo i componenti riusabili dalle lezioni `.mdx`).
  - Il SW non intercetta `/sa/**` (Simple Analytics): quel traffico continua a passare attraverso il Worker `sa-proxy` su Cloudflare e a raggiungere SA in tempo reale, anche con la PWA attiva.
```

- [ ] **Step 13.2: Commit**

```bash
git add CLAUDE.md
git commit -m "Document PWA architecture in CLAUDE.md"
```

---

## Task 14: Final verification

This task does not produce code changes. It verifies the system end-to-end and is the gate before the user reviews live.

- [ ] **Step 14.1: Clean build**

Run:
```bash
rm -rf dist node_modules/.vite
npm run build
```

Expected: build completes. Stdout includes the icon generation lines (or skip lines if already up-to-date) and the bulk-manifest line.

- [ ] **Step 14.2: Inspect build outputs**

Verify each of these exists in `dist/`:
- `manifest.webmanifest`
- `sw.js` (and any Workbox runtime file matching `workbox-*.js`)
- `_headers`
- `aiguide-bulk-manifest.json` (open it: should have ≥ 50 entries)
- `icons/pwa-192.png`, `icons/pwa-512.png`, `icons/pwa-512-maskable.png`, `icons/apple-touch-icon.png`
- `en/offline/index.html`, `it/offline/index.html`

- [ ] **Step 14.3: Preview and DevTools sanity**

Run: `npm run preview`
Open `http://localhost:4321/en/` in a fresh **Incognito** Chrome window. DevTools → Application:
1. **Manifest**: no errors, all four icons listed, theme color `#E07A5F`.
2. **Service Workers**: status "activated and is running", scope `/`.
3. **Cache Storage**: `workbox-precache-v2-...` populated.
4. Send `navigator.serviceWorker.controller.postMessage({type:'AIGUIDE_BULK_DOWNLOAD'})` in the Console. Watch Network tab: bulk fetches start. Cache Storage gets `aiguide-bulk-v1`.

- [ ] **Step 14.4: Offline mode**

DevTools → Network → check "Offline". Reload `/en/fundamentals/what-is-ai/`: lesson should render.
Open the search modal (Ctrl/⌘+K) and type a few characters: results should appear (Pagefind index served from `aiguide-bulk-v1`).
Visit a URL that does NOT exist (e.g. `/en/this-page-does-not-exist/`): the offline page should render, not the browser's default "no internet" screen.

- [ ] **Step 14.5: Lighthouse PWA audit**

DevTools → Lighthouse → check "Progressive Web App" (and clear other categories) → run on `/en/`.
Target: PWA score ≥ 90. Failures (if any) on these keys are blockers and must be fixed before declaring done:
- "Web app manifest meets the installability requirements"
- "Registers a service worker that controls page and start_url"
- "Provides a valid apple-touch-icon"

- [ ] **Step 14.6: Update flow check**

Stop the preview server. Make a no-op edit to a lesson `.mdx` (any IT lesson, add a single space and remove it, or edit one paragraph). Run `npm run build && npm run preview`. Reload the previous incognito tab (without closing it). Application → Service Workers should show the new SW activating; the lesson HTML in `aiguide-bulk-v1` for the edited file should update on next bulk-download trigger.

- [ ] **Step 14.7: Real install (Chrome desktop)**

In Chrome on `localhost:4321/en/`, click the install icon in the URL bar (or DevTools → Application → Manifest → "Install"). The app opens in a standalone window. The install button in Preferences is now hidden, replaced by "App installata · pronta offline" once the bulk download completes.

- [ ] **Step 14.8: Uninstall and clean (cleanup of local state)**

After verification, uninstall the test PWA (chrome://apps → right-click → remove) and clear site storage (DevTools → Application → Clear storage → "Clear site data") so subsequent dev work isn't polluted.

- [ ] **Step 14.9: No commit needed for this task**

Task 14 is verification only. If any step fails, file a bug, fix in a new commit referencing the relevant task above, and rerun from Step 14.1.

---

## Out of scope (do NOT do as part of this plan)

- Push notifications, background sync, share-target, file-handlers, web-share-target. Spec says no.
- Any test framework introduction (Vitest, Playwright). Spec says no.
- Production deploy (`git checkout production && git merge --ff-only main && git push`). User triggers this manually after live testing on the dev branch.
- Worker `sa-proxy` changes. The PWA SW does not intercept `/sa/**`, so the SA flow is unaffected.
- Touching the Pagefind component (`src/components/Search.astro`). The SW already covers `/pagefind/**` via runtime caching strategy and bulk download. No code change in the Search component is required.

---

## Self-review checklist (run before handoff)

- [x] Every spec section has a corresponding task or note.
- [x] No "TBD"/"TODO"/"implement later"/"add validation".
- [x] Function signatures and property names are consistent across tasks (e.g. `downloadBulk()`, `pruneStaleBulk(entries)`, `BULK_CACHE`, `AIGUIDE_BULK_DOWNLOAD`, `AIGUIDE_BULK_PROGRESS`).
- [x] Each task ends with a commit step.
- [x] Smoke test (`npm run build`) is invoked at every code-changing task.
- [x] Manual DevTools checks are spelled out where build-time verification can't catch the failure mode.
