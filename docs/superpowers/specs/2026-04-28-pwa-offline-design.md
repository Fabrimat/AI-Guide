# Spec — PWA installabile e lezioni offline

Data: 2026-04-28
Stato: design approvato, in attesa di implementation plan.

## Obiettivo

Rendere `ai-guide.larosa.work` installabile come Progressive Web App
su tutti i device (Chrome/Edge desktop, Chrome Android, iOS Safari) e
permettere all'utente che ha installato l'app di leggere tutte le
lezioni e cercare nel manuale anche offline.

## Vincoli e principi

- **Privacy invariata**: niente backend, niente dati che lasciano il
  browser. La cache offline vive in Cache Storage del browser
  (origine `ai-guide.larosa.work`), come `localStorage` per il
  progress tracker. Nessun cookie introdotto, nessun analytics
  aggiuntivo.
- **Footprint minimo per il visitatore casuale.** Chi apre il sito
  una volta da una scheda di browser non deve scaricare l'intero
  manuale né l'index Pagefind. Il bulk download offline parte solo
  dopo install esplicito.
- **Resilienza all'interruzione.** L'utente che chiude il browser a
  metà del download della "biblioteca offline" deve ritrovare i file
  già scaricati e ripartire dal primo file mancante, non da zero.
- **Aggiornamenti differenziali a costo zero**, sfruttando il content
  hashing degli asset Astro + il revision hashing di Workbox.
- **Coerenza estetica.** Tutta la UI (bottone install, modale iOS,
  pagina offline, progress bar) usa la palette Pastello e i token
  `--aig-*` esistenti.

## Architettura

Integrazione `@vite-pwa/astro` in modalità `injectManifest` (SW custom
in TypeScript), perché ci servono comportamenti distinti per due
livelli di asset.

```
┌────────────────────────────────────────────────────────────────┐
│  Browser                                                       │
│                                                                │
│  ┌─────────────┐    postMessage     ┌──────────────────────┐  │
│  │ Page (DOM)  │ ◀────────────────▶ │ Service Worker       │  │
│  │             │                    │  ┌────────────────┐  │  │
│  │  InstallApp │                    │  │ Precache       │  │  │
│  │  component  │                    │  │ (Workbox)      │  │  │
│  └─────────────┘                    │  │  - shell JS/CSS│  │  │
│                                     │  │  - icons       │  │  │
│                                     │  │  - /offline/   │  │  │
│                                     │  └────────────────┘  │  │
│                                     │  ┌────────────────┐  │  │
│                                     │  │ Bulk cache     │  │  │
│                                     │  │ (custom)       │  │  │
│                                     │  │  - HTML lezioni│  │  │
│                                     │  │  - .txt skills │  │  │
│                                     │  │  - Pagefind    │  │  │
│                                     │  └────────────────┘  │  │
│                                     │  ┌────────────────┐  │  │
│                                     │  │ Runtime cache  │  │  │
│                                     │  │  (StaleWR/NF)  │  │  │
│                                     │  └────────────────┘  │  │
│                                     └──────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Manifest

`public/manifest.webmanifest` (generato dal plugin):

```jsonc
{
  "name": "AI-Guide",
  "short_name": "AI-Guide",
  "description": "Impara a usare l'IA, dai fondamenti al livello avanzato.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#E07A5F",
  "background_color": "#FCEEE3",
  "lang": "en",
  "icons": [
    { "src": "/icons/pwa-192.png",          "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/pwa-512.png",          "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/pwa-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Il `start_url: "/"` mantiene il redirect lato client esistente (la
root `index.astro` legge `navigator.languages` e va a `/en/` o
`/it/`). Lo `scope: "/"` consente al SW di intercettare tutte le
richieste interne al dominio.

`Head.astro` aggiunge anche:
- `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`
- `<meta name="theme-color" content="#FCEEE3" media="(prefers-color-scheme: light)">`
- `<meta name="theme-color" content="#1C130D" media="(prefers-color-scheme: dark)">`

Il manifest accetta un solo `theme_color`. Il browser legge le meta
runtime per decidere quale mostrare nella status bar in dark mode.

## Strategie di caching

Tre layer in cascata, ordinati dal più atomico al più ampio.

### Layer 1 — Precache "shell" (Workbox)

Per **tutti**, dalla prima visita. Atomico via `cache.addAll()`
gestito da `precacheAndRoute(self.__WB_MANIFEST)`.

Cosa contiene:
- JS, CSS, font Outfit (`*.woff2`), icone, manifest, e la pagina
  `/offline/` precachata come HTML.
- Esclusi: HTML delle lezioni, `.txt` skill files, `/pagefind/**`,
  `og-image.png`, sourcemap `.map`, lo script Simple Analytics
  `/sa/proxy.js`, il SW stesso.

Stima: 200–500 KB. Piccolo abbastanza che un'interruzione costa poco
e ricomincia da zero al prossimo avvio del SW.

Configurazione VitePWA in `astro.config.mjs`:

```js
AstroPWA({
  strategies: 'injectManifest',
  srcDir: 'src',
  filename: 'sw.ts',
  registerType: 'autoUpdate',
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
})
```

### Layer 2 — Bulk cache (custom, gated, idempotente)

Per **chi ha installato la PWA**. Tutto il manuale leggibile offline.

Lista degli URL da scaricare in un file JSON statico
`/aiguide-bulk-manifest.json`, generato a build time da un hook
inline in `astro.config.mjs` (Vite plugin con `closeBundle`, oppure
un piccolo postbuild script lanciato da `package.json`). Contiene:
- tutti gli HTML in `dist/<lang>/**/index.html` (esclusi 404 e
  offline);
- tutti i file in `dist/skills/<lang>/*.txt`;
- tutto il contenuto di `dist/pagefind/**` (entry point, meta, index
  shards, fragment shards).

Formato:

```json
{
  "version": "<commit-hash o build timestamp>",
  "entries": [
    { "url": "/it/start-here/" },
    { "url": "/it/fundamentals/what-is-ai/" },
    { "url": "/skills/it/review-what-is-ai.txt" },
    { "url": "/pagefind/pagefind-entry.json" },
    "..."
  ]
}
```

Il file vive in `dist/` come asset statico; viene servito sotto
`/aiguide-bulk-manifest.json`. Il SW lo fetcha a ogni invocazione di
`downloadBulk()` con `cache: 'no-store'` (bypassa la cache HTTP del
browser), così legge sempre la lista aggiornata della versione di
sito al momento del download. Evita il bisogno di re-iniettare la
lista nel codice del SW post-VitePWA.

Implementazione (in `src/sw.ts`):

```ts
const BULK_CACHE = 'aiguide-bulk-v1';
let bulkRunning = false;

async function downloadBulk() {
  if (bulkRunning) return;
  bulkRunning = true;
  try {
    const manifestResp = await fetch('/aiguide-bulk-manifest.json', { cache: 'no-store' });
    if (!manifestResp.ok) return;
    const { entries } = await manifestResp.json() as { entries: { url: string }[] };
    const cache = await caches.open(BULK_CACHE);
    const total = entries.length;
    let done = 0;
    for (const entry of entries) {
      const hit = await cache.match(entry.url);
      if (hit) { done++; broadcastProgress(done, total); continue; }
      try {
        const resp = await fetch(entry.url, { cache: 'no-store' });
        if (resp.ok) await cache.put(entry.url, resp.clone());
        done++;
        broadcastProgress(done, total);
      } catch {
        // Offline mid-loop: il prossimo trigger riprenderà.
        break;
      }
    }
    if (done === total) await pruneStaleBulk(entries);
  } finally {
    bulkRunning = false;
  }
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'AIGUIDE_BULK_DOWNLOAD') {
    event.waitUntil(downloadBulk());
  }
});
```

`broadcastProgress` invia `postMessage` a tutti i client con
`{type:'AIGUIDE_BULK_PROGRESS', done, total}`.

#### Trigger del bulk

Il client invia `AIGUIDE_BULK_DOWNLOAD` al SW in tre momenti:
1. all'evento `appinstalled` (subito dopo install);
2. ad ogni `astro:page-load` se la pagina gira in
   `display-mode: standalone` (= PWA installata);
3. all'evento `online` se siamo in standalone (riprende dopo perdita
   di connettività).

Il SW skippa idempotentemente i file già in `BULK_CACHE`, scaricando
solo i mancanti. La flag `bulkRunning` evita doppi loop concorrenti
se il client manda triggers ravvicinati.

#### Aggiornamenti del manifest bulk

A ogni nuova build, `__AIGUIDE_BULK_MANIFEST` può cambiare (lezione
nuova, lezione editata che cambia hash, file Pagefind ricostruiti).
Il SW nuovo, attivato in skipWaiting, vede il nuovo manifest e
all'apertura successiva fa partire `downloadBulk()`. La cache
`aiguide-bulk-v1` è la stessa, le entry esistenti restano, solo le
URL nuove o cambiate triggerano un fetch.

Per **invalidare** entry obsolete (es. una lezione rinominata, vecchia
URL ancora in cache), un cleanup pass dopo il bulk:

```ts
async function pruneStaleBulk(entries: { url: string }[]) {
  const cache = await caches.open(BULK_CACHE);
  const validUrls = new Set(entries.map(e => e.url));
  for (const req of await cache.keys()) {
    if (!validUrls.has(new URL(req.url).pathname)) {
      await cache.delete(req);
    }
  }
}
```

Chiamato in coda a `downloadBulk()` quando `done === total`.

### Layer 3 — Runtime cache (per il visitatore non installato)

Per chi naviga senza installare, vogliamo comunque evitare di
ribattere il network ogni click (e dare un fallback offline minimo).

| Pattern URL | Strategia | Note |
|---|---|---|
| Navigation HTML | `NetworkFirst`, fallback `/offline/` localizzato | exp 7 giorni, max 50 entry |
| `/skills/**/*.txt` | `StaleWhileRevalidate` | piccoli, OK avere stale |
| `/pagefind/**` | `StaleWhileRevalidate` | exp 30 giorni, max 200 entry |
| `/sa/**` | non intercettato | passa a network |
| `og-image.png` | `CacheFirst` | exp 30 giorni |

Il fallback `/offline/` viene scelto in base al locale del documento
chiamante (path che inizia con `/it/` → `/it/offline/`, default
`/en/offline/`).

## Resilienza all'interruzione

| Scenario | Comportamento |
|---|---|
| Browser chiuso a metà del precache shell (Layer 1) | `cache.addAll` fallisce → SW non si attiva → al prossimo avvio riparte da zero. Costo basso (200–500 KB). |
| Browser chiuso a metà del bulk download (Layer 2) | I file già scaricati restano in `aiguide-bulk-v1`. Al prossimo avvio in standalone, `downloadBulk()` riparte e skippa i file presenti. |
| Connessione che si interrompe a metà del bulk | Il `fetch` fallisce, il loop esce con `break`. All'evento `online` (o al prossimo `astro:page-load`), il SW riprende dal primo file mancante. |
| Tab in background per ore durante il bulk | Il SW può essere terminato dal browser. Al prossimo evento (anche un fetch innocuo), si riavvia, riceve di nuovo il messaggio dal client al `astro:page-load`, e riprende. |

Il pattern "skip se già in cache, fetch altrimenti" rende l'intero
flusso idempotente. `bulkRunning` evita la concorrenza fra triggers
multipli ravvicinati nello stesso "vita" del SW.

## Strategia di update del SW

`registerType: 'autoUpdate'` in VitePWA, con `skipWaiting()` +
`clients.claim()` nel SW. Aggiornamento silenzioso: quando l'utente
ricarica una pagina, prende il SW nuovo senza interazione.

Per il bulk cache, il versioning è dato dal nome cache
(`aiguide-bulk-v1`). Un cambio breaking di formato (improbabile, ma
es. cambio di shape di Pagefind) richiederebbe bump a v2 e cleanup
delle vecchie versioni in `activate`:

```ts
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith('aiguide-bulk-') && k !== BULK_CACHE)
        .map(k => caches.delete(k))
    );
  })());
});
```

Per gli aggiornamenti normali (nuova lezione, edit) la stessa cache
v1 viene aggiornata file per file dal loop di `downloadBulk()`.

## Icone

Pipeline a build time in `scripts/generate-pwa-icons.mjs`:

| File | Px | Purpose | Note |
|---|---|---|---|
| `public/icons/pwa-192.png` | 192 | `any` | sfondo coral pieno + "AI" peach |
| `public/icons/pwa-512.png` | 512 | `any` | idem alta risoluzione |
| `public/icons/pwa-512-maskable.png` | 512 | `maskable` | "AI" ridotto al ~60% per safe-zone Android |
| `public/icons/apple-touch-icon.png` | 180 | iOS | nessuna trasparenza, no maskable, no rounding (lo fa iOS) |

Lo script:
1. legge `public/favicon.svg`;
2. usa `sharp` (già dep transitiva di Astro) per rasterizzare alle 4
   risoluzioni;
3. la `maskable` aggiunge un padding interno di ~20% (la versione
   "any" ha già un radius del rect a 14 su viewBox 64, ma per
   maskable serve un quadrato pieno con safe-zone);
4. salva in `public/icons/`.

Triggerato come `prebuild` in `package.json`. È idempotente: se i
PNG esistono e sono più recenti del SVG, salta. Sennò rigenera.

## Bottone "Installa l'app" e modale iOS

Nuovo componente `src/components/InstallApp.astro`, montato come
quarta sezione di `HeaderPreferences.astro`:

```
┌─ Preferenze ────────────────────────┐
│ Lettura assistita        [ on ]     │
│ Tema     [Auto ▾]                    │
│ Lingua   [Italiano ▾]                │
├─ App                                 │
│ Installa l'app           [ Installa ]│
│ ╌╌╌╌╌╌╌╌╌╌╌  47/200    (durante DL) │
└──────────────────────────────────────┘
```

### Stati

| Stato | Condizione | UI |
|---|---|---|
| `installable` | `beforeinstallprompt` ricevuto | Bottone "Installa l'app" attivo |
| `ios-installable` | iOS Safari, no `beforeinstallprompt`, non standalone | Bottone "Installa l'app" che apre il modale di istruzioni |
| `installing` | `prompt()` in corso | Bottone disabled "Installazione…" |
| `installed-online` | `appinstalled` ricevuto **o** `display-mode: standalone` **o** `navigator.standalone` | Riga "App installata" + sotto progress row "Scarico per offline · {done}/{total}" se done < total |
| `installed-offline-complete` | come sopra, done === total | Riga "App installata · pronta offline" |

### Detection iOS standalone

```ts
const isIosStandalone = (navigator as any).standalone === true;
const isStandardStandalone = matchMedia('(display-mode: standalone)').matches;
const isInstalled = isIosStandalone || isStandardStandalone;
```

### Modale iOS

`<dialog>` con backdrop coral-soft, contenuto:
- titolo "Installa AI-Guide su iPhone/iPad";
- 3 step illustrati (icona Condividi, voce di menu "Aggiungi alla
  schermata Home", bottone "Aggiungi");
- bottone "Chiudi".

Le icone degli step sono SVG inline (non caratteri Unicode, che su
Android renderizzano diverso).

### Wiring

```ts
// In InstallApp.astro <script>:
let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  setState('installable');
});

installButton.addEventListener('click', async () => {
  if (isIosStandalone === false && isUserAgentIos()) {
    openIosModal();
    return;
  }
  if (!deferredPrompt) return;
  setState('installing');
  await deferredPrompt.prompt();
  // Il navigatore emetterà `appinstalled` se l'utente accetta.
  deferredPrompt = null;
});

window.addEventListener('appinstalled', () => {
  setState('installed-online');
  triggerBulkDownload();
});

navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data?.type === 'AIGUIDE_BULK_PROGRESS') {
    updateProgress(event.data.done, event.data.total);
    if (event.data.done === event.data.total) {
      setState('installed-offline-complete');
    }
  }
});
```

### Trigger del bulk download (lato client)

Pseudocodice della logica trigger, vive in `Head.astro` o dentro
`InstallApp.astro` (preferibile: vicino al componente che mostra il
progress, per coesione):

```ts
function triggerBulkDownload() {
  navigator.serviceWorker.controller?.postMessage({
    type: 'AIGUIDE_BULK_DOWNLOAD',
  });
}

if (isInstalled()) {
  triggerBulkDownload();
}

window.addEventListener('appinstalled', triggerBulkDownload);
window.addEventListener('online', () => {
  if (isInstalled()) triggerBulkDownload();
});
document.addEventListener('astro:page-load', () => {
  if (isInstalled()) triggerBulkDownload();
});
```

## Pagina /offline/ (MDX, localizzata)

Due file mirror, sotto Starlight come tutte le altre pagine:
- `src/content/docs/en/offline.mdx`
- `src/content/docs/it/offline.mdx`

Contenuto IT:

```markdown
---
title: Sei offline
description: La pagina che cerchi non è disponibile offline.
---

Sei senza connessione, e questa pagina non è ancora salvata sul tuo
dispositivo.

Le lezioni che hai già letto restano disponibili: torna alla home e
prova a navigare da lì.

[Torna alla home](/it/)
```

EN equivalente. Niente `livello` nel frontmatter, così il
componente `PageTitle` non aggiunge "X min di lettura" e il footer
non aggiunge `ShareLesson`.

## Headers di deploy

`public/_headers` (Netlify, Cloudflare lascia passare):

```
/sw.js
  Cache-Control: public, max-age=0, must-revalidate
/registerSW.js
  Cache-Control: public, max-age=0, must-revalidate
/manifest.webmanifest
  Cache-Control: public, max-age=3600
/icons/*
  Cache-Control: public, max-age=31536000, immutable
```

Il SW deve avere `max-age=0`: senza, Cloudflare/Netlify possono
servire una versione cachata del SW vecchio per ore, e gli update
non arrivano mai.

Verifica che il Worker `sa-proxy` su Cloudflare non intercetti
nessuno di questi path: oggi è bound solo a `/sa/*`, tutto OK. Da
non dimenticare in eventuali aggiornamenti futuri del Worker.

## Stringhe i18n nuove

In `src/i18n/ui.ts` (sia `it` che `en`):

```typescript
prefsSectionApp: 'App',
installButtonLabel: "Installa l'app",      // EN: "Install the app"
installInProgress: 'Installazione…',       // EN: "Installing…"
installAlreadyInstalled: 'App installata', // EN: "App installed"
installAlreadyInstalledReady: 'App installata · pronta offline',
                                            // EN: "App installed · offline ready"
installBulkProgress: 'Scarico per offline · {done}/{total}',
                                            // EN: "Downloading for offline · {done}/{total}"
installIosTitle: 'Installa AI-Guide su iPhone/iPad',
                                            // EN: "Install AI-Guide on iPhone/iPad"
installIosStep1: 'Tocca il pulsante Condividi qui sotto.',
                                            // EN: "Tap the Share button below."
installIosStep2: "Scorri e scegli «Aggiungi alla schermata Home».",
                                            // EN: 'Scroll and pick "Add to Home Screen".'
installIosStep3: 'Conferma con «Aggiungi» in alto a destra.',
                                            // EN: 'Confirm with "Add" in the top right.'
installIosClose: 'Chiudi',                  // EN: "Close"
```

## Verifica e test

Lista di controlli da eseguire dopo l'implementazione (fatti
manualmente, niente test automatizzati esistono):

1. `npm run build && npm run preview`
2. Apri Chrome DevTools → Application → Manifest: nessun errore,
   icone caricate, theme color visibile.
3. Application → Service Workers: SW registrato, scope `/`, status
   "activated and is running".
4. Application → Cache Storage: `workbox-precache-v2-...` presente
   con shell + offline page.
5. Trigger install (DevTools → Application → Manifest → "Install"
   o icona barra URL).
6. Subito dopo install: il bottone "Installa" diventa "App
   installata" + comparsa progress row.
7. Application → Cache Storage: `aiguide-bulk-v1` si riempie.
8. A bulk completato, Network → Offline mode → naviga: tutte le
   lezioni IT+EN funzionano, ricerca Pagefind funziona, click su
   esercizi LLM apre il `.txt` localmente.
9. URL ipotetica non in cache offline → `/offline/` mostrata, non
   l'errore "no internet" del browser.
10. Riapri Chrome con bulk a metà: progress riprende dal file dove
    si era fermato.
11. Lighthouse PWA score: target ≥ 90 (manifest valido, SW
    registrato, icone, theme color, viewport, content over HTTPS,
    service worker controlla la pagina di start).
12. iOS Safari: il bottone apre il modale di istruzioni; dopo
    "Aggiungi alla Home", aprendo l'app dalla home l'app gira
    standalone, `navigator.standalone === true`, e il bulk parte.

## File modificati / creati

**Creati:**
- `public/_headers`
- `public/icons/pwa-192.png`
- `public/icons/pwa-512.png`
- `public/icons/pwa-512-maskable.png`
- `public/icons/apple-touch-icon.png`
- `scripts/generate-pwa-icons.mjs`
- `src/sw.ts`
- `src/components/InstallApp.astro`
- `scripts/generate-bulk-manifest.mjs` (script postbuild lanciato da
  `package.json`, scansiona `dist/` e produce
  `dist/aiguide-bulk-manifest.json`)
- `src/content/docs/en/offline.mdx`
- `src/content/docs/it/offline.mdx`

**Modificati:**
- `package.json` (deps: `@vite-pwa/astro`, `workbox-window`,
  `workbox-precaching`, `workbox-routing`, `workbox-strategies`,
  `workbox-expiration`; scripts `prebuild` per le icone, `postbuild`
  per il bulk manifest)
- `astro.config.mjs` (integration AstroPWA)
- `src/components/Head.astro` (link manifest, theme-color con media
  query, registrazione SW via `virtual:pwa-register`)
- `src/components/HeaderPreferences.astro` (sezione "App" con
  `<InstallApp />`)
- `src/i18n/ui.ts` (chiavi nuove)
- `CLAUDE.md` (nuova sezione "PWA e offline" sotto "Architettura").
  `<InstallApp>` è un componente interno, montato dentro
  `HeaderPreferences.astro`, non destinato all'uso in `.mdx` di
  lezione: NON va nel catalogo "Componenti del progetto". Lo noto
  esplicitamente nella nuova sezione architettura.

## Open questions risolte durante il brainstorm

| Domanda | Risposta scelta |
|---|---|
| Strategia di caching iniziale | A — gating totale dopo install esplicito |
| Strategia di update | A — silenzioso, skipWaiting + claim |
| Pagefind incluso nel bulk? | Sì (a1) |
| `.txt` skill files inclusi? | Sì (b) |
| Esperienza di install | B — bottone in Preferenze, modale iOS |
| Generazione icone | A — `sharp` da `favicon.svg` |
| Plugin vs hand-roll | A — `@vite-pwa/astro` + injectManifest |
| Visibilità progress UI | ii — sempre dentro popover, anche da browser |
| Resilienza interruzione | Layer 2 custom, idempotente, resume on every standalone load + online event |

## Non in scope

- **Push notifications.** Il sito è un manuale, non ha eventi push
  da inviare. Il manifest non chiede `gcm_sender_id`.
- **Background sync.** Non ci sono dati utente da sincronizzare con
  un backend (non c'è backend). Tutto il progress sta in localStorage.
- **Sharing target / file handling.** Niente integrazione "apri
  file con AI-Guide", non ha senso per un manuale.
- **Web Share Target.** Idem.
- **Page transitions per la navigazione standalone.** Le View
  Transitions di Astro funzionano già in standalone senza ulteriori
  modifiche.
