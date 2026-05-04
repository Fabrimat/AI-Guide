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
//
// When a Layer 3 strategy (NetworkFirst, StaleWhileRevalidate) cannot return
// a fresh or runtime-cached response, Workbox routes the request here. We
// first try the BULK_CACHE (filled after PWA install) so an installed user
// gets the actual lesson / skill / Pagefind shard. If nothing is there, we
// return the localized /offline/ page for navigation requests; for non-doc
// requests we return Response.error() so the browser surfaces the failure.
// ---------------------------------------------------------------------------
setCatchHandler(async ({ request }) => {
  const bulkCache = await caches.open(BULK_CACHE);
  const bulkHit = await bulkCache.match(request.url);
  if (bulkHit) return bulkHit;

  if (request.destination !== 'document') return Response.error();
  const url = new URL(request.url);
  const offlinePath = url.pathname.startsWith('/it/')
    ? '/it/offline'
    : '/en/offline';
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

self.addEventListener('message', (event) => {
  if (event.data?.type === 'AIGUIDE_BULK_DOWNLOAD') {
    event.waitUntil(downloadBulk());
  }
});
