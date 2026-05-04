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
