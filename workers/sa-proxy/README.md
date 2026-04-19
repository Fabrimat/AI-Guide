# sa-proxy

Cloudflare Worker che fa da proxy first-party per **Simple Analytics**,
così lo script non viene bloccato dagli adblocker (che bloccano
`simpleanalyticscdn.com` per dominio).

Path serviti su `ai-guide.larosa.work/sa/*`:

| Path                  | Forward a                                              |
|-----------------------|--------------------------------------------------------|
| `/sa/proxy.js`        | `simpleanalyticsexternal.com/proxy.js`                 |
| `/sa/auto-events.js`  | `scripts.simpleanalyticscdn.com/auto-events.js`        |
| `/sa/simple/*`        | `queue.simpleanalyticscdn.com/*`                       |

Il resto del traffico del dominio continua ad andare a Netlify
(che è l'origin dietro al proxy Cloudflare).

## Deploy

Una volta sola, login a Cloudflare:

```bash
npx wrangler login
```

Poi, da questa cartella (`workers/sa-proxy/`):

```bash
npx wrangler deploy
```

Wrangler legge `wrangler.toml`, deploya il Worker e crea la route
`ai-guide.larosa.work/sa/*` sulla zone `larosa.work`.

Per testare in locale:

```bash
npx wrangler dev
```

Espone il Worker su `http://localhost:8787` (puoi colpire
`http://localhost:8787/sa/proxy.js` per verificare il forward).

## Verifica post-deploy

Dopo il deploy, su `ai-guide.larosa.work/sa/proxy.js` deve rispondere
lo script di Simple Analytics (200 OK, content-type
`application/javascript`). Da DevTools del browser, sulla home, devi
vedere:

- `GET /sa/proxy.js` → 200
- al primo evento, `POST /sa/simple/...` → 200 / 204

Nessuna richiesta verso `simpleanalyticscdn.com` dal browser: tutto
passa via dominio nostro.

## Riferimenti

- Documentazione Simple Analytics proxy: https://docs.simpleanalytics.com/proxy
- Cloudflare Workers Routes: https://developers.cloudflare.com/workers/configuration/routing/routes/
