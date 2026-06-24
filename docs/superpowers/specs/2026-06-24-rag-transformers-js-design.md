# Static RAG with Transformers.js for cross-lesson search — design

Date: 2026-06-24
Status: approved design, pending implementation plan
Builds on: `2026-06-24-local-ai-assistant-design.md` (the in-browser assistant).

## Goal

Replace the assistant's cross-lesson retrieval (currently Pagefind keyword
search in `search-context.ts`) with **semantic RAG**: a build-time static
embeddings index over the lessons, queried in the browser with
Transformers.js. The query is embedded client-side, compared by cosine
similarity against the precomputed chunk vectors, and the top chunks are fed
into the assistant's system prompt. Better grounding for natural-language
questions; everything still static, no backend.

## Decisions taken during brainstorming

- **Embedding model: `Xenova/multilingual-e5-small`** (384-dim, multilingual,
  strong it + en). e5 requires `query: ` / `passage: ` prefixes.
- **Replace Pagefind in the assistant's retrieval.** `search-context.ts` uses
  embeddings only. **Pagefind still powers the Ctrl+K site search**
  (`Search.astro`), untouched.
- **Everything on demand.** Neither the embeddings index nor the embedder
  model is precached or added to the PWA bulk manifest. No offline semantic
  search. Both are fetched on first use and cached by the browser /
  Transformers.js afterward.
- **Consent: the single AI-model consent covers everything.** Nothing
  Transformers.js-related (library, ORT wasm runtime, or embedder model)
  loads before consent. The embedder lazy-loads only inside the chat-send
  path, which runs only after the engine is ready (post-consent,
  post-download).
- **Embedder model served from the HF CDN directly** (browser-cached),
  consistent with web-llm. The static index is served from our own domain
  (Cloudflare edge-caches it automatically).
- **Hard separation / independence.** The core site (navigation, lessons,
  Ctrl+K search, PWA offline shell, progress) has zero hard dependency on
  LocalAI/RAG. The RAG build step is **non-fatal**: if it fails the site
  still builds and deploys; RAG just has no index.

## Architecture

### Build time (Node, in `postbuild`)
`scripts/generate-embeddings.mjs`:
1. For each locale (`en`, `it`): read the lesson MDX sources under
   `src/content/docs/<locale>/**/*.{mdx,md}`, keep only pages with `livello`
   in frontmatter (= lessons).
2. Strip frontmatter, `import` lines, and JSX/MDX tags to plain prose; split
   into chunks by `## ` (H2) headings (heading + following prose), clamped to
   a ~512-token budget. Lessons with no H2 become a single chunk.
3. Embed each chunk with `multilingual-e5-small` (`passage: ` prefix,
   mean-pooled, normalized) using `@huggingface/transformers` in Node.
4. Write `dist/embeddings/<locale>.json`:
   `{ model, dim, chunks: [{ url, title, heading, text, vector }] }`
   (vectors are normalized float32, rounded to keep the file small).
5. Wrapped in try/catch: on any error, `console.warn` and `process.exit(0)` —
   never fails the build.

Runs **last** in the `postbuild` chain (after `generate-bulk-manifest.mjs`),
so the index file does not exist when the bulk manifest is built and therefore
cannot be swept into it.

### Query time (browser)
When `chat-ui.ts` assembles a prompt it calls `searchOtherLessons(query,
locale)` exactly as today. That now:
1. Lazily fetches `<base>/embeddings/<locale>.json` (singleton per locale).
2. Lazily loads Transformers.js + the embedder and embeds `query: ${query}`.
3. Cosine-similarity ranks chunks, drops the current page, returns the top 3
   as `LessonExcerpt[]`.
All steps fail soft to `[]` (dev has no index; model load can fail).

## Components

### `scripts/generate-embeddings.mjs` (new, Node)
- **Does:** build the per-locale static embeddings index from lesson MDX.
- **Depends on:** `@huggingface/transformers` (Node), the filesystem.
- **Non-fatal** by contract.

### `src/components/LocalAI/embedder.ts` (new, client)
- **Does:** owns the Transformers.js feature-extraction pipeline as a lazy
  module-level singleton; `embedQuery(text): Promise<Float32Array>` (applies
  the `query: ` prefix, mean pooling, normalization); `cosineSim(a, b):
  number` (dot product, vectors are normalized).
- **Interface:** `export async function embedQuery(text: string):
  Promise<Float32Array>`, `export function cosineSim(a: Float32Array, b:
  Float32Array | number[]): number`, `export const EMBED_MODEL_ID =
  'Xenova/multilingual-e5-small'`.
- **Depends on:** `@huggingface/transformers` (dynamic import). Runs on the
  default WASM backend (not WebGPU) to avoid contending with the LLM.

### `src/components/LocalAI/search-context.ts` (rewrite)
- **Does:** semantic cross-lesson retrieval. Same public surface as today so
  `chat-ui.ts` is unchanged:
  `export interface LessonExcerpt { title: string; url: string; excerpt: string }`
  `export async function searchOtherLessons(query, locale, opts?: { limit?: number; currentPath?: string }): Promise<LessonExcerpt[]>`
- **Does NOT** reference Pagefind anymore. Pagefind stays only in
  `Search.astro`.
- **Depends on:** `embedder.ts`, the static index, `fetch`.

### Index format (`dist/embeddings/<locale>.json`)
```json
{
  "model": "Xenova/multilingual-e5-small",
  "dim": 384,
  "chunks": [
    { "url": "/en/fundamentals/what-is-ai/", "title": "But what is AI?",
      "heading": "What a model is", "text": "…", "vector": [0.012, -0.034, …] }
  ]
}
```

## Edits to existing files

- `package.json`: add dependency `@huggingface/transformers`; append
  `&& node scripts/generate-embeddings.mjs` to the `postbuild` script.
- `astro.config.mjs`:
  - `vite.build.rollupOptions.output.manualChunks`: also return
    `'transformers'` for ids containing `@huggingface/transformers`.
  - `injectManifest.globIgnores`: add `_astro/transformers-*.js` and
    `_astro/transformers.*.js` (lazy + large; keep out of the offline shell).
- `src/content/docs/{en,it}/privacy.mdx`: the assistant section now says it
  downloads **model files** (the chat model plus a small search model) once
  from an external provider. One-line wording change; same CDN, same consent.
- The consent copy (`localAiConsentBody` in `src/i18n/ui.ts`): same wording
  tweak ("a model file" → "model files").
- `CLAUDE.md`: extend the LocalAI note with the RAG pipeline.

## Independence / fail-soft (hard rule)

- All RAG code lives in `src/components/LocalAI/` + `scripts/generate-embeddings.mjs`.
- `generate-embeddings.mjs` never fails the build.
- Client RAG is lazy and fail-soft: a missing index, a failed model load, or a
  fetch error returns `[]`, and the assistant answers from lesson context
  alone. The rest of the site is wholly unaffected whether RAG works or not.
- Nothing Transformers.js-related loads before consent or on non-assistant
  interactions.

## Build considerations

- Netlify downloads the e5 model (~30–40 MB) once per build for index
  generation (Transformers.js model cache is not persisted across Netlify
  builds). Adds a few seconds. Non-fatal if it fails.
- Embedding all lesson chunks at build is a few hundred short CPU forward
  passes (~10–60 s added to the build).
- In `npm run dev` the index does not exist (generated in `postbuild`), so RAG
  returns `[]` — same prod-only constraint Pagefind already has.

## Constraints (recap)

- One new npm dependency: `@huggingface/transformers` (Node + client).
- No backend, no API keys, no env vars. Static build.
- Do not modify lesson `.mdx`. Do not change the LlmExercise buttons or the
  Ctrl+K Pagefind search.
- TypeScript on the client; avoid `any`.
- No em dash in user-facing copy; follow the voice guide for the privacy/
  consent wording (it + en).

## Definition of done

- `npm run build` completes; `dist/embeddings/en.json` and
  `dist/embeddings/it.json` exist with non-empty `chunks`.
- Forcing `generate-embeddings.mjs` to throw still lets `npm run build`
  succeed (no index produced).
- On a built site, asking the assistant a question whose answer lives in
  another lesson pulls a relevant chunk from that lesson into context (the
  embedder downloads on first chat, after consent).
- Pagefind Ctrl+K search still works unchanged.
- No console errors attributable to RAG on either locale.
- The embedder + Transformers.js chunks are excluded from the PWA precache;
  the build does not throw on file size.

## Risks / verification points

- Confirm `Xenova/multilingual-e5-small` loads in Node (build) and the browser
  via Transformers.js v3 (`@huggingface/transformers`).
- Confirm the embeddings index is NOT in `dist/aiguide-bulk-manifest.json`.
- Confirm Transformers.js ORT wasm (loaded on demand, possibly from a CDN) is
  fetched only post-consent and never blocks the core site.
- Confirm the client `transformers` chunk is excluded from precache and the
  build does not exceed the 2 MiB injectManifest limit.
