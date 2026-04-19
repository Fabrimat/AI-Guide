/**
 * Cloudflare Worker: proxy first-party per Simple Analytics.
 *
 * Perché esiste: lo script di Simple Analytics caricato dal CDN
 * `simpleanalyticscdn.com` viene bloccato da molti adblocker per
 * dominio. Servirlo da un path del nostro stesso dominio
 * (`ai-guide.larosa.work/sa/...`) lo rende first-party e invisibile
 * alle blocklist generiche.
 *
 * Path mappati (vedi https://docs.simpleanalytics.com/proxy):
 *   /sa/proxy.js        -> simpleanalyticsexternal.com/proxy.js
 *                          (script entry, parametrizzato con hostname
 *                          del sito tracciato e path dove il client
 *                          POSTerà gli eventi).
 *   /sa/auto-events.js  -> scripts.simpleanalyticscdn.com/auto-events.js
 *                          (estensione opzionale per data-sa-event).
 *   /sa/simple/*        -> queue.simpleanalyticscdn.com/*
 *                          (endpoint di ingest degli eventi).
 *
 * Headers: Simple Analytics raccomanda di non passare l'IP del
 * visitatore al loro backend (vedi il loro esempio Caddy:
 * `header_up -X-Forwarded-For`). Stripiamo gli header `cf-*` e
 * gli equivalenti X-Forwarded-For / X-Real-IP prima del forward.
 * Il backend SA vedrà la richiesta come proveniente da un edge
 * Cloudflare anonimo. Nessun tracking lato visitatore.
 */
const HOSTNAME = 'ai-guide.larosa.work';
const EVENT_PATH = '/sa/simple';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    let target;
    if (url.pathname === '/sa/proxy.js') {
      target = `https://simpleanalyticsexternal.com/proxy.js?hostname=${HOSTNAME}&path=${EVENT_PATH}`;
    } else if (url.pathname === '/sa/auto-events.js') {
      target = 'https://scripts.simpleanalyticscdn.com/auto-events.js';
    } else if (url.pathname.startsWith('/sa/simple/')) {
      const rest = url.pathname.slice('/sa/simple'.length);
      target = `https://queue.simpleanalyticscdn.com${rest}${url.search}`;
    } else {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers(request.headers);
    for (const name of [...headers.keys()]) {
      if (name.startsWith('cf-') || name === 'x-forwarded-for' || name === 'x-real-ip') {
        headers.delete(name);
      }
    }

    return fetch(target, {
      method: request.method,
      headers,
      body: request.body,
    });
  },
};
