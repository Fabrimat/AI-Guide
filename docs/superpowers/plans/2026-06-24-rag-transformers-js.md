# Static RAG with Transformers.js — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the assistant's Pagefind cross-lesson retrieval with semantic RAG: a build-time static embeddings index over the lessons, queried in-browser with Transformers.js (`multilingual-e5-small`).

**Architecture:** A non-fatal `postbuild` Node script embeds each lesson's H2-section chunks and writes `dist/embeddings/<locale>.json`. At query time, `search-context.ts` embeds the user's question in the browser (lazy Transformers.js), cosine-ranks the chunks, and returns the top distinct lessons — keeping its exact public signature so `chat-ui.ts` is unchanged. Everything loads on demand, gated behind the existing AI-model consent; the core site never depends on it.

**Tech Stack:** Astro 6 + Starlight, TypeScript, `@huggingface/transformers` (new dep, used in Node at build and in the browser at query time), `Xenova/multilingual-e5-small`.

## Global Constraints

- One new npm dependency: `@huggingface/transformers` (Node + client). No others.
- Embedding model id: `Xenova/multilingual-e5-small` (384-dim). e5 needs `query: ` / `passage: ` prefixes.
- Replace Pagefind ONLY in `search-context.ts` (the assistant's retrieval). Do NOT touch `Search.astro` / the Ctrl+K Pagefind search.
- Everything on demand: do NOT precache or add to the PWA bulk manifest the embeddings index, the embedder model, or the Transformers.js chunk.
- Single AI-model consent covers everything. Nothing Transformers.js-related may load before consent or on non-assistant interactions (the embedder lazy-loads only inside the chat-send path).
- Hard independence: the core site must build and work whether or not RAG works. `scripts/generate-embeddings.mjs` MUST be non-fatal (log a warning, `process.exit(0)` on any error).
- Embedder served from the HF CDN directly (web-llm posture). Index served from our domain.
- TypeScript on the client; avoid `any`. No em dash in user-facing copy; follow the voice guide for it+en wording.
- Commit messages in English, concise, NO `Co-Authored-By` trailer.

### Testing approach (read first)

No test runner exists in this project and none may be added. The smoke test is
`npm run build` (must exit 0). Behaviour needing a browser (the embedder
download, semantic ranking) is verified manually against `npm run preview`
(the index and embedder only exist/work in a built site, not `npm run dev`).
Pure logic (`cosineSim`) gets a throwaway Node check from the scratchpad; do
not commit it. Each task ends with `npm run build` green + the stated check + a
commit.

Branch: `feat/local-ai-assistant` (work continues here, in the existing worktree).

---

### Task 1: Build-time embeddings index

Add the dependency and a non-fatal `postbuild` script that writes
`dist/embeddings/<locale>.json` from the lesson MDX sources.

**Files:**
- Modify: `package.json` (add dep; extend `postbuild`)
- Create: `scripts/generate-embeddings.mjs`

**Interfaces:**
- Produces: `dist/embeddings/en.json`, `dist/embeddings/it.json`, each shaped
  `{ model: string, dim: number, chunks: Array<{ url: string; title: string; heading: string; text: string; vector: number[] }> }`. Later tasks (search-context.ts) consume this shape.

- [ ] **Step 1: Add the dependency**

Run:
```bash
npm install @huggingface/transformers@^4.0.0
```
Expected: `package.json` `dependencies` gains `"@huggingface/transformers"` (use whatever 4.x npm resolves).

- [ ] **Step 2: Create the generator script**

Create `scripts/generate-embeddings.mjs`:

```js
// Build-time RAG index generator. Reads lesson MDX sources, chunks by H2,
// embeds each chunk with multilingual-e5-small, and writes a static index
// per locale to dist/embeddings/<locale>.json.
//
// NON-FATAL BY CONTRACT: any failure logs a warning and exits 0, so the
// site build and deploy always succeed even if RAG can't be generated.
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(root, 'src', 'content', 'docs');
const OUT_DIR = join(root, 'dist', 'embeddings');
const LOCALES = ['en', 'it'];
const MODEL_ID = 'Xenova/multilingual-e5-small';
const EMBED_CHARS = 2000; // cap text sent to the model (~512 token budget)
const EXCERPT_CHARS = 500; // cap text stored for the prompt

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(mdx|md)$/.test(e.name)) out.push(p);
  }
  return out;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: raw };
  const fm = m[1];
  const title = fm.match(/^title:\s*(.+)$/m);
  const livello = fm.match(/^livello:\s*(.+)$/m);
  return {
    data: {
      title: title ? title[1].trim().replace(/^["']|["']$/g, '') : '',
      livello: livello ? livello[1].trim() : '',
    },
    body: raw.slice(m[0].length),
  };
}

function stripInline(s) {
  return s
    .replace(/<[^>]+>/g, ' ')               // JSX / HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links -> text
    .replace(/[`*_>#]/g, '')                 // emphasis / code / heading marks
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkLesson(title, body) {
  const cleaned = body
    .replace(/^import\s.+$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const parts = cleaned.split(/^##\s+/m);
  const chunks = [];
  const intro = stripInline(parts[0]);
  if (intro) chunks.push({ heading: title, text: intro });
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const nl = seg.indexOf('\n');
    const heading = stripInline(nl >= 0 ? seg.slice(0, nl) : seg);
    const text = stripInline(nl >= 0 ? seg.slice(nl + 1) : '');
    if (text) chunks.push({ heading, text });
  }
  return chunks;
}

function urlFor(file) {
  const rel = relative(DOCS, file).replace(/\\/g, '/').replace(/\.(mdx|md)$/, '');
  return '/' + rel + '/';
}

async function main() {
  const { pipeline, env } = await import('@huggingface/transformers');
  env.allowLocalModels = false; // load straight from the HF hub
  const extractor = await pipeline('feature-extraction', MODEL_ID);

  mkdirSync(OUT_DIR, { recursive: true });

  for (const locale of LOCALES) {
    const dir = join(DOCS, locale);
    const files = walk(dir);
    const chunks = [];
    for (const file of files) {
      const raw = readFileSync(file, 'utf8');
      const { data, body } = parseFrontmatter(raw);
      if (!data.livello) continue; // lessons only
      const url = urlFor(file);
      for (const c of chunkLesson(data.title, body)) {
        const embedText = `passage: ${data.title}. ${c.heading}. ${c.text}`.slice(0, EMBED_CHARS);
        const out = await extractor(embedText, { pooling: 'mean', normalize: true });
        const vector = Array.from(out.data, (v) => Math.round(v * 1e5) / 1e5);
        chunks.push({
          url,
          title: data.title,
          heading: c.heading,
          text: c.text.slice(0, EXCERPT_CHARS),
          vector,
        });
      }
    }
    const dim = chunks[0]?.vector.length ?? 0;
    const outFile = join(OUT_DIR, `${locale}.json`);
    writeFileSync(outFile, JSON.stringify({ model: MODEL_ID, dim, chunks }));
    console.log(`[embeddings] ${locale}: ${chunks.length} chunks -> ${outFile}`);
  }
}

main().catch((err) => {
  console.warn('[embeddings] skipped (non-fatal):', err?.message || err);
  process.exit(0); // never fail the build
});
```

- [ ] **Step 3: Wire it into postbuild (LAST, after the bulk manifest)**

In `package.json`, change the `postbuild` script. Current:
```json
"postbuild": "node scripts/generate-bulk-manifest.mjs && node scripts/generate-llms-txt.mjs",
```
to:
```json
"postbuild": "node scripts/generate-bulk-manifest.mjs && node scripts/generate-llms-txt.mjs && node scripts/generate-embeddings.mjs",
```
Running it last guarantees the index does not exist when the bulk manifest is built, so it cannot be swept into the offline bulk download.

- [ ] **Step 4: Build and verify the index**

Run:
```bash
npm run build
```
Expected: exit 0. Build log shows `[embeddings] en: N chunks` and `[embeddings] it: N chunks` (N > 0).

Then verify shape and that it is NOT in the bulk manifest:
```bash
node -e "const j=require('./dist/embeddings/en.json'); console.log('chunks',j.chunks.length,'dim',j.dim,'first',JSON.stringify(j.chunks[0].url), j.chunks[0].vector.length)"
grep -c "embeddings/" dist/aiguide-bulk-manifest.json || echo "embeddings NOT in bulk manifest - correct"
```
Expected: chunks > 0, dim 384, a real lesson url, vector length 384; and the bulk manifest grep prints `0` or the "NOT in bulk manifest" line.

- [ ] **Step 5: Verify non-fatal behaviour**

Temporarily break the model id (edit `MODEL_ID` to `'does-not-exist'`), run `npm run build`, and confirm it still exits 0 with a `[embeddings] skipped (non-fatal)` warning and no `dist/embeddings/*.json` (or stale ones). Then revert `MODEL_ID`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/generate-embeddings.mjs
git commit -m "Add build-time RAG embeddings index (non-fatal postbuild step)"
```

---

### Task 2: Client embedder module + PWA chunk exclusion

Add the lazy Transformers.js pipeline wrapper and make the build exclude the
(large, lazy) Transformers.js client chunk from the PWA precache.

**Files:**
- Create: `src/components/LocalAI/embedder.ts`
- Modify: `astro.config.mjs` (manualChunks + globIgnores)

**Interfaces:**
- Produces:
  - `export const EMBED_MODEL_ID = 'Xenova/multilingual-e5-small'`
  - `export async function embedQuery(text: string): Promise<Float32Array>`
  - `export function cosineSim(a: Float32Array, b: Float32Array | number[]): number`
- Consumed by Task 3 (`search-context.ts`).

- [ ] **Step 1: Create the embedder**

Create `src/components/LocalAI/embedder.ts`:

```ts
/**
 * Lazy in-browser text embedder (Transformers.js, multilingual-e5-small).
 * The library + model load only when embedQuery is first called, which only
 * happens inside the assistant's chat-send path (post-consent). Runs on the
 * default WASM backend so it does not contend with web-llm's WebGPU use.
 */
import type { FeatureExtractionPipeline } from '@huggingface/transformers';

export const EMBED_MODEL_ID = 'Xenova/multilingual-e5-small';

let pipePromise: Promise<FeatureExtractionPipeline> | null = null;

function getPipe(): Promise<FeatureExtractionPipeline> {
  if (pipePromise) return pipePromise;
  pipePromise = (async () => {
    const { pipeline } = await import('@huggingface/transformers');
    return pipeline('feature-extraction', EMBED_MODEL_ID);
  })();
  return pipePromise;
}

/** Embed a query with the e5 `query: ` prefix; returns a normalized vector. */
export async function embedQuery(text: string): Promise<Float32Array> {
  const pipe = await getPipe();
  const output = await pipe('query: ' + text, { pooling: 'mean', normalize: true });
  return output.data as Float32Array;
}

/** Cosine similarity. Inputs are L2-normalized, so this is the dot product. */
export function cosineSim(a: Float32Array, b: Float32Array | number[]): number {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * (b[i] as number);
  return dot;
}
```

- [ ] **Step 2: Name + exclude the Transformers.js chunk**

In `astro.config.mjs`, extend `manualChunks` (next to the web-llm line):
```js
          manualChunks(id) {
            if (id.includes('@mlc-ai/web-llm')) return 'webllm';
            if (id.includes('@huggingface/transformers')) return 'transformers';
          },
```
And extend `injectManifest.globIgnores` (after the web-llm entries):
```js
          '_astro/transformers-*.js',
          '_astro/transformers.*.js',
```

- [ ] **Step 3: Sanity-check cosineSim (throwaway, not committed)**

Run:
```bash
node --input-type=module -e "
const cos=(a,b)=>{let d=0;const n=Math.min(a.length,b.length);for(let i=0;i<n;i++)d+=a[i]*b[i];return d;};
console.assert(Math.abs(cos([1,0],[1,0])-1)<1e-9,'identical');
console.assert(Math.abs(cos([1,0],[0,1]))<1e-9,'orthogonal');
console.log('ok');
"
```
Expected: prints `ok`.

- [ ] **Step 4: Build**

Run:
```bash
npm run build
```
Expected: exit 0. (`embedder.ts` is not imported by any client entry yet, so the `transformers` chunk is not emitted; the config is in place for Task 3.)

- [ ] **Step 5: Commit**

```bash
git add src/components/LocalAI/embedder.ts astro.config.mjs
git commit -m "Add lazy Transformers.js embedder and exclude its chunk from PWA precache"
```

---

### Task 3: Rewrite search-context.ts to semantic RAG

Replace the Pagefind retrieval with embeddings-based retrieval over the static
index. Keep the exact public signature so `chat-ui.ts` is untouched.

**Files:**
- Modify (full rewrite): `src/components/LocalAI/search-context.ts`

**Interfaces:**
- Consumes: `embedQuery`, `cosineSim` (Task 2); `dist/embeddings/<locale>.json` (Task 1).
- Produces (unchanged from before):
  - `export interface LessonExcerpt { title: string; url: string; excerpt: string }`
  - `export async function searchOtherLessons(query: string, locale: string, opts?: { limit?: number; currentPath?: string }): Promise<LessonExcerpt[]>`

- [ ] **Step 1: Rewrite the module**

Replace the entire contents of `src/components/LocalAI/search-context.ts` with:

```ts
/**
 * Semantic cross-lesson retrieval for the assistant. Loads the static
 * embeddings index (built at postbuild) for the current locale, embeds the
 * query in the browser, and returns the top distinct lessons by cosine
 * similarity. Fails soft to [] when the index is missing (dev) or the
 * embedder cannot load, so the assistant simply answers from lesson context.
 *
 * Note: Pagefind is no longer used here; it still powers the Ctrl+K site
 * search in Search.astro.
 */
import { embedQuery, cosineSim } from './embedder';

export interface LessonExcerpt {
  title: string;
  url: string;
  excerpt: string;
}

interface IndexChunk {
  url: string;
  title: string;
  heading: string;
  text: string;
  vector: number[];
}
interface EmbeddingIndex {
  model: string;
  dim: number;
  chunks: IndexChunk[];
}

const indexCache = new Map<string, Promise<EmbeddingIndex | null>>();

function loadIndex(locale: string): Promise<EmbeddingIndex | null> {
  const cached = indexCache.get(locale);
  if (cached) return cached;
  const p = (async () => {
    try {
      const base = (import.meta.env.BASE_URL as string).replace(/\/$/, '');
      const res = await fetch(`${base}/embeddings/${locale}.json`);
      if (!res.ok) return null;
      return (await res.json()) as EmbeddingIndex;
    } catch {
      return null; // dev (no index) or fetch error
    }
  })();
  indexCache.set(locale, p);
  return p;
}

export async function searchOtherLessons(
  query: string,
  locale: string,
  opts: { limit?: number; currentPath?: string } = {},
): Promise<LessonExcerpt[]> {
  const limit = opts.limit ?? 3;
  try {
    const index = await loadIndex(locale);
    if (!index || !index.chunks.length) return [];
    const qvec = await embedQuery(query);
    const ranked = index.chunks
      .filter((c) => !opts.currentPath || !c.url.startsWith(opts.currentPath))
      .map((c) => ({ c, score: cosineSim(qvec, c.vector) }))
      .sort((a, b) => b.score - a.score);

    // One excerpt per distinct lesson, best chunk first.
    const seen = new Set<string>();
    const out: LessonExcerpt[] = [];
    for (const { c } of ranked) {
      if (seen.has(c.url)) continue;
      seen.add(c.url);
      out.push({ title: c.title, url: c.url, excerpt: c.text });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return []; // embedder failed to load, etc. — assistant falls back
  }
}
```

- [ ] **Step 2: Build and verify the transformers chunk is excluded**

Run:
```bash
npm run build
```
Expected: exit 0 (the `transformers` chunk now exists because search-context imports embedder, but globIgnores keeps it out of precache, so injectManifest does not throw).

Verify:
```bash
ls -la dist/_astro/transformers*.js | awk '{print $5,$9}'
grep -oE "transformers\.[A-Za-z0-9_-]+\.js" dist/sw.js && echo "IN PRECACHE (bad)" || echo "not precached - correct"
```
Expected: a `transformers.*.js` chunk exists in `_astro/`; it is NOT found in `dist/sw.js`.

- [ ] **Step 3: Browser smoke (preview)**

Run `npm run preview`, open `http://localhost:4321/en/fundamentals/what-is-ai/`, consent + load a model, then ask a question whose answer lives in another lesson (e.g. "how do I write a good prompt?"). Confirm the answer reflects another lesson. To confirm retrieval ran, temporarily `console.log` the `searchBlock` in `chat-ui.ts` `send()` (remove before commit), reload, verify it is non-empty. In `npm run dev` (no index), confirm chat still answers with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/LocalAI/search-context.ts
git commit -m "Replace Pagefind with semantic RAG retrieval in the assistant"
```

---

### Task 4: Update consent + privacy copy for the second model

The assistant now downloads two model files (chat model + search model). Update
the one-line wording in the consent body and both privacy pages.

**Files:**
- Modify: `src/i18n/ui.ts` (`localAiConsentBody`, both locales)
- Modify: `src/content/docs/en/privacy.mdx`, `src/content/docs/it/privacy.mdx`

- [ ] **Step 1: Update the consent body strings**

In `src/i18n/ui.ts`, replace the English `localAiConsentBody` value:
```ts
    localAiConsentBody:
      'This assistant runs in your browser. The first time, it downloads its model files once from an external provider (Hugging Face): the chat model and a small search model. After that it works offline and nothing you type leaves your device.',
```
and the Italian one:
```ts
    localAiConsentBody:
      "Questo assistente gira nel tuo browser. La prima volta scarica i suoi file di modello una volta sola da un fornitore esterno (Hugging Face): il modello di chat e un piccolo modello di ricerca. Dopo funziona offline e niente di quello che scrivi esce dal tuo dispositivo.",
```

- [ ] **Step 2: Update the English privacy section**

In `src/content/docs/en/privacy.mdx`, in the "The local AI assistant" section, replace the paragraph that begins "The first time you turn it on" with:
```mdx
The first time you turn it on, your browser downloads its model files once
from an external provider (Hugging Face): the chat model and a small model
used to find relevant lessons. That download is the only moment anything
leaves your device. After it, the models are saved in your browser and the
assistant works offline.
```

- [ ] **Step 3: Update the Italian privacy section**

In `src/content/docs/it/privacy.mdx`, in the "L'assistente IA locale" section, replace the paragraph that begins "La prima volta che lo attivi" with:
```mdx
La prima volta che lo attivi, il browser scarica una volta sola i suoi file
di modello da un fornitore esterno (Hugging Face): il modello di chat e un
piccolo modello che serve a trovare le lezioni pertinenti. Quel download è
l'unico momento in cui qualcosa esce dal tuo dispositivo. Dopo, i modelli
restano salvati nel browser e l'assistente funziona offline.
```

- [ ] **Step 4: Build, em-dash check, commit**

Run:
```bash
grep -n "—" src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx && echo "EM DASH FOUND (fix)" || echo "no em dash - clean"
npm run build
```
Expected: no em dash; build exit 0.

```bash
git add src/i18n/ui.ts src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx
git commit -m "Note the RAG search model in consent and privacy copy (en + it)"
```

---

### Task 5: Document the RAG pipeline + final verification

**Files:**
- Modify: `CLAUDE.md` (extend the LocalAI section)

- [ ] **Step 1: Extend the CLAUDE.md LocalAI note**

In `CLAUDE.md`, inside the "Assistente IA locale (in-browser)" section, append this paragraph at the end of the section (before the next `##` heading):

```markdown
Ricerca cross-lezione (RAG): `search-context.ts` non usa più Pagefind ma un
indice di embeddings statico. A build time `scripts/generate-embeddings.mjs`
(step `postbuild`, **non-fatal**: se fallisce non rompe la build) legge le
lezioni MDX, le spezza per sezione H2, le embedda con `multilingual-e5-small`
via `@huggingface/transformers` e scrive `dist/embeddings/<locale>.json`. A
runtime `embedder.ts` carica Transformers.js in modo lazy (solo dentro il
percorso di chat, dopo il consenso; backend WASM) ed embedda la domanda;
`search-context.ts` fa cosine similarity e passa al prompt le lezioni più
pertinenti. Indice servito dal nostro dominio (cache Cloudflare); modello
embedder dalla CDN di Hugging Face, on demand. Niente di tutto questo è nel
precache PWA: il chunk client `transformers` è escluso via `globIgnores`
(come `webllm`) e l'indice non entra nel bulk manifest. Pagefind resta solo
per la ricerca Ctrl+K in `Search.astro`.
```

- [ ] **Step 2: Full verification pass**

Run a clean build and confirm the definition of done:
```bash
rm -rf dist .astro && npm run build > /tmp/ragbuild.log 2>&1; echo "EXIT $?"; tail -3 /tmp/ragbuild.log
node -e "for(const l of ['en','it']){const j=require('./dist/embeddings/'+l+'.json');console.log(l,j.chunks.length,'chunks, dim',j.dim)}"
grep -oE "transformers\.[A-Za-z0-9_-]+\.js|webllm\.[A-Za-z0-9_-]+\.js" dist/sw.js && echo "PRECACHED (bad)" || echo "AI chunks not precached - correct"
grep -c "embeddings/" dist/aiguide-bulk-manifest.json
```
Expected: EXIT 0; both locales report chunks > 0 and dim 384; no AI chunks in `dist/sw.js`; bulk-manifest grep prints `0`.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Document the RAG cross-lesson search in CLAUDE.md"
```

---

## Self-review

**Spec coverage:**
- Build-time static index from lesson MDX, chunked by H2 → Task 1. ✓
- Non-fatal build step → Task 1 (step 5 verifies). ✓
- `multilingual-e5-small`, `query:`/`passage:` prefixes → Task 1 (passage) + Task 2 (query). ✓
- Client embedder, lazy, WASM, post-consent only → Task 2 + (consumed in) Task 3; lazy import keeps it out of per-page bundle; called only in chat-send path. ✓
- Replace Pagefind in search-context, keep signature, Pagefind stays in Search.astro → Task 3. ✓
- On demand, not precached, not in bulk manifest → Task 1 (postbuild order), Task 2 (globIgnores), verified Task 3 + Task 5. ✓
- Index served from our domain → `dist/embeddings/` (Task 1). ✓
- Consent + privacy copy for the second model → Task 4. ✓
- CLAUDE.md → Task 5. ✓
- Independence / fail-soft → non-fatal script (Task 1), fail-soft client (Task 3 returns [] on any error). ✓

**Placeholder scan:** No TBD/TODO. The one intentional temporary action (the `console.log` of `searchBlock` in Task 3 step 3) is explicitly "remove before commit" and not part of any committed code.

**Type consistency:** `IndexChunk`/`EmbeddingIndex` in Task 3 match the JSON shape written in Task 1 (`url, title, heading, text, vector`). `embedQuery: Promise<Float32Array>`, `cosineSim(Float32Array, Float32Array|number[])`, `EMBED_MODEL_ID` defined in Task 2 and used in Task 3. `searchOtherLessons` signature is identical to the version `chat-ui.ts` already calls (no change to `chat-ui.ts`). `MODEL_ID` (build) and `EMBED_MODEL_ID` (client) are the same string `Xenova/multilingual-e5-small`.
