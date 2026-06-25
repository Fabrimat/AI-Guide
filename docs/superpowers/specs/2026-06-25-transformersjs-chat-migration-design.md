# Migrate the chat engine from web-llm to Transformers.js — design

Date: 2026-06-25
Status: approved design, pending implementation plan
Builds on: the local AI assistant + its UX redesign (all on `feat/local-ai-assistant`).

## Goal

Replace the web-llm (MLC) chat engine with a Transformers.js (ONNX / WebGPU)
text-generation engine, so the whole assistant runs on **one runtime**
(Transformers.js already powers the RAG embedder) and `@mlc-ai/web-llm` is
removed. Offer three ONNX models including a ≤0.5 GB tier and Gemma 4 E2B.

## Decisions taken during brainstorming

- **Direction:** option B — migrate chat fully to Transformers.js, drop web-llm.
- **Model lineup (all Transformers.js / ONNX / WebGPU):**
  | Tier | Model id | dtype | ~download | Notes |
  |------|----------|-------|-----------|-------|
  | Light  | `onnx-community/Qwen2.5-0.5B-Instruct` | `q4`    | ~0.4 GB (≤0.5 GB ✓) | multilingual incl. Italian |
  | Better | `onnx-community/Qwen2.5-1.5B-Instruct` | `q4f16` | ~1.0 GB | |
  | Best   | `onnx-community/gemma-4-E2B-it-ONNX`   | `q4f16` | ~1.5 GB | multimodal model used text-only |
- One runtime after this (Transformers.js for both chat and embeddings).

## Architecture

A Transformers.js text-generation pipeline runs in a Web Worker (off the main
thread). The main thread drives it through a thin wrapper. The panel UI, RAG,
history, consent, and model-manager UX are unchanged in shape; only the engine
underneath changes.

### Components

**`chat-worker.ts` (rewrite)** — Transformers.js text-gen worker.
- Holds a singleton `{ pipeline, modelId }`.
- Message protocol (main → worker):
  - `{ type: 'load', modelId, dtype }` → if a different model is loaded,
    dispose it; build `pipeline('text-generation', modelId, { device: 'webgpu', dtype, progress_callback })`.
    Posts `{ type: 'progress', pct }` (aggregated across files: `sum(loaded)/sum(total)`),
    then `{ type: 'ready' }` or `{ type: 'error', message }`.
  - `{ type: 'generate', id, messages, opts }` → runs
    `pipe(messages, { max_new_tokens, temperature, top_p, repetition_penalty, do_sample: true, streamer })`
    where `streamer = new TextStreamer(pipe.tokenizer, { skip_prompt: true, skip_special_tokens: true, callback_function })`.
    Posts `{ type: 'token', id, text }` per chunk, then `{ type: 'done', id, full }` or `{ type: 'error', id, message }`.
  - `{ type: 'dispose' }` → `pipe?.dispose?.()`, drop the reference.
- `messages` is the `{ role: 'user' | 'assistant' | 'system'; content: string }[]`
  array; Transformers.js applies the model's chat template automatically.

**`chat-engine.ts` (new, main thread)** — owns the worker + lifecycle, replacing
the web-llm `getEngine`/`disposeEngine`/`activeModelId`/`readyModelId` block now
living in `chat-ui.ts`.
- Module-level singletons: `worker`, `activeModelId` (loading-or-loaded),
  `readyModelId` (finished loading), `currentGen` (id for cancellation).
- `export async function loadModel(modelId: string, dtype: string, onProgress: (pct: number) => void): Promise<void>`
  — creates the worker if needed, posts `load`, resolves on `ready` (sets
  `readyModelId`), rejects on `error`.
- `export async function generate(messages, opts, onToken: (full: string) => void): Promise<string>`
  — posts `generate` with a fresh id, accumulates tokens, calls `onToken(full)`
  per chunk, resolves with the full text on `done`.
- `export async function disposeEngine(): Promise<void>` — posts `dispose`,
  terminates the worker, resets singletons.
- `export function getReadyModelId(): string | null`, `getActiveModelId()`.

**`model-cache.ts` (rewrite)** — Transformers.js cache inspection.
- `getStatuses(modelIds, activeId)` → opens the Transformers.js browser cache
  (`caches.open('transformers-cache')`), lists keys; a model is `cached` if at
  least one cache entry URL contains its id (and it is not the active one,
  which is `active`); otherwise `idle`. Falls back to `idle` on any error.
- `deleteModel(modelId)` → deletes every cache entry whose URL contains the id.
- No web-llm import.

**`chat-ui.ts` (update)** — swap the engine calls:
- Replace `getEngine`/`disposeEngine`/`CreateWebWorkerMLCEngine` usage with
  `chat-engine` calls. `startDownload`/`downloadInModels` call `loadModel`
  (progress → ring / inline bar). The send streaming loop becomes
  `await generate(messages, opts, (full) => { replyBubble.innerHTML = renderMarkdown(full); })`.
- `readyModelId`/`activeModelId` reads come from `chat-engine` getters.
- Generation params: `temperature 0.35`, `top_p 0.9`, `repetition_penalty 1.2`
  (Transformers.js's repetition control, replacing OpenAI-style
  frequency/presence penalties), `max_new_tokens 360`, `do_sample: true`.
- `buildSystemPrompt` unchanged (same messages array; lesson-language lock +
  summary stay).
- `progressPct(report.text)` helper is removed; Transformers.js gives a numeric
  aggregated percentage directly from the worker.

**`ChatPanel.astro`** — new `models` array: the three ONNX ids, friendly names
(`Qwen2.5 0.5B`, `Qwen2.5 1.5B`, `Gemma 4 E2B`), sizes, and a per-model `dtype`.
Drop the `vram` field (not exposed by Transformers.js).

**`astro.config.mjs`** — remove the `webllm` manualChunk + its globIgnores;
keep `transformers` manualChunk, `_astro/transformers*.js`,
`_astro/chat-worker-*.js`, and `_astro/**/*.wasm` precache exclusions (the
worker now bundles Transformers.js + ORT wasm, still large).

**`package.json`** — remove `@mlc-ai/web-llm`.

**Copy** — consent body / `privacy.mdx` (en + it): model names update; the
"downloads model files once from Hugging Face, then offline" story is
unchanged. `CLAUDE.md`: engine is now Transformers.js, web-llm removed.

### Unchanged
`embedder.ts` (already Transformers.js, main-thread, lazy), RAG retrieval
(`search-context.ts`), history (`history.ts`), markdown, the redesigned panel
UI/CSS, consent gating (worker + models still load only after consent), the
escape-to-body stacking fix.

## Generation parameter mapping (web-llm → Transformers.js)

| web-llm (OpenAI-style) | Transformers.js `generate` |
|------------------------|----------------------------|
| `temperature: 0.35`    | `temperature: 0.35`, `do_sample: true` |
| `top_p: 0.9`           | `top_p: 0.9` |
| `frequency_penalty` / `presence_penalty` | `repetition_penalty: 1.2` |
| `max_tokens: 360`      | `max_new_tokens: 360` |

## Constraints

- No NEW npm dependency (Transformers.js is already present). `@mlc-ai/web-llm`
  is removed.
- No backend, no API keys. Static build; `npm run build` must pass.
- Consent gating intact: nothing loads before the reader consents; the worker +
  models are created only in the download/load path.
- WebGPU required (same as today); the no-WebGPU fallback stays.
- Keep RAG, history, the model manager (status/switch/delete), the redesigned
  UI, and the LlmExercise buttons working.
- TypeScript; avoid `any`. No em dash in user-facing copy (it + en).

## Definition of done

- `npm run build` passes; `@mlc-ai/web-llm` no longer in `package.json` or the
  bundle.
- On a built site: consent → pick a tier → it downloads (progress shown) → a
  coherent answer streams in, in the lesson's language.
- All three models load and generate (Light ≤0.5 GB verified).
- Model manager shows correct status (active / cached / idle) from the
  Transformers.js cache, switch loads inline with live progress, delete frees
  the cache; deleting the active model falls back to a cached one or off.
- RAG cross-lesson retrieval, history, exercises, and the no-WebGPU fallback
  still work.
- No console errors attributable to the assistant on either locale.

## Risks / verification points

- **Gemma 4 E2B is multimodal (~1.5 GB).** Verify it loads and generates as a
  text-generation pipeline in Transformers.js; if the vision/audio encoders are
  unavoidably pulled, confirm the size/behavior is acceptable (it is the top
  tier). If it cannot run text-only at a reasonable size, fall back to a
  text-only top model (e.g. Llama-3.2-3B ONNX) and flag it.
- **Speed:** Transformers.js/ONNX generation may be slower per token than MLC.
  Accepted trade-off; verify it is usable on the Light tier especially.
- **Cache detection is heuristic** (Cache API inspection), not an exact API;
  verify "cached" flips correctly after a download and after a delete.
- Confirm the Transformers.js browser cache name (`transformers-cache`) in the
  installed version; adjust `model-cache.ts` if it differs.
- Confirm `dtype: 'q4'` works for Qwen2.5-0.5B on WebGPU (fallback `q4f16`).
- Verify the worker bundles Transformers.js cleanly for `output: static` and
  stays excluded from the PWA precache.
