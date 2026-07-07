# sa-proxy

Cloudflare Worker that acts as a first-party proxy for **Simple Analytics**,
so the script doesn't get blocked by adblockers (which block
`simpleanalyticscdn.com` by domain).

Paths served on `ai-guide.larosa.work/sa/*`:

| Path                  | Forwards to                                            |
|-----------------------|--------------------------------------------------------|
| `/sa/proxy.js`        | `simpleanalyticsexternal.com/proxy.js`                 |
| `/sa/auto-events.js`  | `scripts.simpleanalyticscdn.com/auto-events.js`        |
| `/sa/simple/*`        | `queue.simpleanalyticscdn.com/*`                       |

The rest of the domain's traffic keeps going to Netlify
(which is the origin behind the Cloudflare proxy).

## Deploy

Once, log in to Cloudflare:

```bash
npx wrangler login
```

Then, from this folder (`workers/sa-proxy/`):

```bash
npx wrangler deploy
```

Wrangler reads `wrangler.toml`, deploys the Worker, and creates the route
`ai-guide.larosa.work/sa/*` on the zone `larosa.work`.

To test locally:

```bash
npx wrangler dev
```

Exposes the Worker at `http://localhost:8787` (you can hit
`http://localhost:8787/sa/proxy.js` to verify the forward).

## Post-deploy verification

After deploying, `ai-guide.larosa.work/sa/proxy.js` should respond
with the Simple Analytics script (200 OK, content-type
`application/javascript`). From the browser's DevTools, on the homepage, you should
see:

- `GET /sa/proxy.js` → 200
- on the first event, `POST /sa/simple/...` → 200 / 204

No requests to `simpleanalyticscdn.com` from the browser: everything
passes through our own domain.

## References

- Simple Analytics proxy documentation: https://docs.simpleanalytics.com/proxy
- Cloudflare Workers Routes: https://developers.cloudflare.com/workers/configuration/routing/routes/
