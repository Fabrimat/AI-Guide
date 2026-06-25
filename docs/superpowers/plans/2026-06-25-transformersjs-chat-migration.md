# Migrate chat engine to Transformers.js — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the web-llm chat engine with a Transformers.js text-generation engine (one runtime for chat + embeddings), with three ONNX models including a ≤0.5 GB tier and Gemma 4 E2B, and remove `@mlc-ai/web-llm`.

**Architecture:** A Transformers.js `text-generation` pipeline runs in a Web Worker (`gen-worker.ts`); a thin main-thread wrapper (`chat-engine.ts`) owns the worker and exposes load/generate/dispose + ready/active state. `chat-ui.ts` calls the wrapper instead of web-llm. `model-cache.ts` is re-implemented on the browser Cache API. The redesigned panel UI, RAG, history, consent gating, and stacking fix are unchanged.

**Tech Stack:** Astro 6 + Starlight, TypeScript, `@huggingface/transformers` (already a dependency — used for both chat now and the RAG embedder). `@mlc-ai/web-llm` is removed.

## Global Constraints

- No NEW npm dependency (Transformers.js already present). Remove `@mlc-ai/web-llm`.
- Models (all `onnx-community`, run via Transformers.js / WebGPU):
  - Light: `onnx-community/Qwen2.5-0.5B-Instruct`, dtype `q4`, name `Qwen2.5 0.5B`, ~0.4 GB.
  - Better: `onnx-community/Qwen2.5-1.5B-Instruct`, dtype `q4f16`, name `Qwen2.5 1.5B`, ~1.0 GB.
  - Best: `onnx-community/gemma-4-E2B-it-ONNX`, dtype `q4f16`, name `Gemma 4 E2B`, ~1.5 GB.
- Generation params: `max_new_tokens 360`, `temperature 0.35`, `top_p 0.9`, `repetition_penalty 1.2`, `do_sample: true`.
- Consent gating intact: the worker + any model load happen only in the download/load path (post-consent). WebGPU still required; the no-WebGPU fallback stays.
- Keep working: RAG retrieval, per-lesson history, the model manager (status/switch/delete + delete-active fallback), the redesigned panel UI + the escape-to-body stacking fix, the LlmExercise buttons, the lesson-language-locked system prompt.
- TypeScript; avoid `any` except at the worker `postMessage`/Transformers.js call boundary where types are loose (use typed message interfaces; cast only at the library call). No em dash in user-facing copy (it + en).
- Only Pastello tokens in any CSS. Commit messages English, concise, no `Co-Authored-By`.
- Commits are signed via the 1Password SSH agent (the user keeps it unlocked). Commit normally; if a commit fails with a 1Password / "failed to fill whole buffer" error, STOP and report BLOCKED leaving changes staged (`git add -A`).

### Testing approach (read first)

No test runner exists and none may be added. Smoke test = `npm run build` (exit 0). Runtime behaviour (WebGPU download + generation) is verified manually against `npm run preview` in a WebGPU browser. Each task ends with `npm run build` green + the stated check + a commit. The migration is staged so the build stays green and web-llm keeps working until the swap is wired, then web-llm is removed once nothing imports it.

Branch: `feat/local-ai-assistant` (continue in the existing worktree).

---

### Task 1: Transformers.js generation worker + engine wrapper (new, not yet wired)

Add the new engine layer as NEW files so the existing web-llm chat keeps working and builds stay green. Nothing imports these yet.

**Files:**
- Create: `src/components/LocalAI/gen-worker.ts`
- Create: `src/components/LocalAI/chat-engine.ts`

**Interfaces:**
- Produces (consumed by Task 2):
  - `chat-engine.ts`:
    - `export interface GenOpts { max_new_tokens?: number; temperature?: number; top_p?: number; repetition_penalty?: number }`
    - `export function loadModel(modelId: string, dtype: string, onProgress: (pct: number) => void): Promise<void>`
    - `export function generate(messages: ChatMessage[], opts: GenOpts, onToken: (full: string) => void): Promise<string>`
    - `export function disposeEngine(): Promise<void>`
    - `export function getReadyModelId(): string | null`
    - `export function getActiveModelId(): string | null`
    - `export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }`

- [ ] **Step 1: Create the worker**

Create `src/components/LocalAI/gen-worker.ts`:
```ts
/**
 * Web Worker running a Transformers.js text-generation pipeline, so inference
 * never blocks the UI thread. Protocol (main -> worker):
 *   { type:'load', modelId, dtype }         -> 'progress'{pct}... then 'ready' | 'error'{message}
 *   { type:'generate', id, messages, opts }  -> 'token'{id,text}... then 'done'{id,full} | 'error'{id,message}
 *   { type:'dispose' }
 */
import {
  pipeline,
  TextStreamer,
  type TextGenerationPipeline,
  type ProgressInfo,
} from '@huggingface/transformers';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type GenOpts = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  repetition_penalty?: number;
};
type InMessage =
  | { type: 'load'; modelId: string; dtype: string }
  | { type: 'generate'; id: number; messages: ChatMessage[]; opts: GenOpts }
  | { type: 'dispose' };

let pipe: TextGenerationPipeline | null = null;
let pipeModelId: string | null = null;

function post(m: unknown): void {
  (self as unknown as Worker).postMessage(m);
}

async function load(modelId: string, dtype: string): Promise<void> {
  if (pipe && pipeModelId === modelId) {
    post({ type: 'ready' });
    return;
  }
  if (pipe) {
    try { await pipe.dispose(); } catch { /* ignore */ }
    pipe = null;
    pipeModelId = null;
  }
  // Aggregate per-file download progress into one 0..100 number.
  const loaded: Record<string, number> = {};
  const total: Record<string, number> = {};
  pipe = (await pipeline('text-generation', modelId, {
    device: 'webgpu',
    // dtype is a per-model string ('q4' | 'q4f16'); cast at this library boundary.
    dtype: dtype as 'q4' | 'q4f16',
    progress_callback: (p: ProgressInfo) => {
      if (p.status === 'progress' && 'file' in p && p.file) {
        loaded[p.file] = (p as { loaded?: number }).loaded ?? 0;
        total[p.file] = (p as { total?: number }).total ?? 0;
        const l = Object.values(loaded).reduce((a, b) => a + b, 0);
        const t = Object.values(total).reduce((a, b) => a + b, 0);
        if (t > 0) post({ type: 'progress', pct: Math.round((l / t) * 100) });
      }
    },
  })) as TextGenerationPipeline;
  pipeModelId = modelId;
  post({ type: 'ready' });
}

async function generate(id: number, messages: ChatMessage[], opts: GenOpts): Promise<void> {
  if (!pipe) {
    post({ type: 'error', id, message: 'Model not loaded' });
    return;
  }
  let full = '';
  const streamer = new TextStreamer(pipe.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (text: string) => {
      full += text;
      post({ type: 'token', id, text: full });
    },
  });
  try {
    await pipe(messages, {
      max_new_tokens: opts.max_new_tokens ?? 360,
      temperature: opts.temperature ?? 0.35,
      top_p: opts.top_p ?? 0.9,
      repetition_penalty: opts.repetition_penalty ?? 1.2,
      do_sample: true,
      streamer,
    });
    post({ type: 'done', id, full });
  } catch (e) {
    post({ type: 'error', id, message: e instanceof Error ? e.message : String(e) });
  }
}

self.onmessage = (e: MessageEvent<InMessage>) => {
  const d = e.data;
  if (d.type === 'load') {
    load(d.modelId, d.dtype).catch((err) =>
      post({ type: 'error', message: err instanceof Error ? err.message : String(err) }),
    );
  } else if (d.type === 'generate') {
    void generate(d.id, d.messages, d.opts);
  } else if (d.type === 'dispose') {
    if (pipe) { try { void pipe.dispose(); } catch { /* ignore */ } }
    pipe = null;
    pipeModelId = null;
  }
};
```
Note: if the exact `ProgressInfo`/pipeline option types differ in the installed `@huggingface/transformers` version and cause a type error, narrow with a local interface for the progress object rather than reaching for `any`; keep the single `dtype as` cast at the `pipeline(...)` call. If `pipe(messages, {...})` rejects the streamer/options type, cast the options object once (`as Parameters<TextGenerationPipeline>[1]`). Do NOT loosen the message-protocol types.

- [ ] **Step 2: Create the engine wrapper**

Create `src/components/LocalAI/chat-engine.ts`:
```ts
/**
 * Main-thread wrapper around the Transformers.js generation worker
 * (`gen-worker.ts`). Owns the worker + model lifecycle and exposes a small
 * promise/callback API. Survives Astro view transitions via module-level
 * singletons (page swaps don't reload JS).
 */
export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export interface GenOpts {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  repetition_penalty?: number;
}

let worker: Worker | null = null;
let activeModelId: string | null = null; // loading-or-loaded (dedupe / dispose decisions)
let readyModelId: string | null = null;  // finished loading (UI "active")
let genCounter = 0;

type LoadWaiter = { resolve: () => void; reject: (e: Error) => void; onProgress: (pct: number) => void };
type GenWaiter = { resolve: (full: string) => void; reject: (e: Error) => void; onToken: (full: string) => void };
let loadWaiter: LoadWaiter | null = null;
const genWaiters = new Map<number, GenWaiter>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./gen-worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent) => {
    const d = e.data as
      | { type: 'progress'; pct: number }
      | { type: 'ready' }
      | { type: 'token'; id: number; text: string }
      | { type: 'done'; id: number; full: string }
      | { type: 'error'; id?: number; message: string };
    if (d.type === 'progress') {
      loadWaiter?.onProgress(d.pct);
    } else if (d.type === 'ready') {
      readyModelId = activeModelId;
      loadWaiter?.resolve();
      loadWaiter = null;
    } else if (d.type === 'token') {
      genWaiters.get(d.id)?.onToken(d.text);
    } else if (d.type === 'done') {
      genWaiters.get(d.id)?.resolve(d.full);
      genWaiters.delete(d.id);
    } else if (d.type === 'error') {
      const err = new Error(d.message);
      if (d.id != null) {
        genWaiters.get(d.id)?.reject(err);
        genWaiters.delete(d.id);
      } else {
        loadWaiter?.reject(err);
        loadWaiter = null;
      }
    }
  };
  return worker;
}

export function loadModel(
  modelId: string,
  dtype: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  // Already loaded this exact model: nothing to do.
  if (readyModelId === modelId) return Promise.resolve();
  const w = ensureWorker();
  activeModelId = modelId;
  readyModelId = null;
  return new Promise<void>((resolve, reject) => {
    loadWaiter = { resolve, reject, onProgress };
    w.postMessage({ type: 'load', modelId, dtype });
  });
}

export function generate(
  messages: ChatMessage[],
  opts: GenOpts,
  onToken: (full: string) => void,
): Promise<string> {
  if (!worker || !readyModelId) return Promise.reject(new Error('No model loaded'));
  const id = ++genCounter;
  return new Promise<string>((resolve, reject) => {
    genWaiters.set(id, { resolve, reject, onToken });
    worker!.postMessage({ type: 'generate', id, messages, opts });
  });
}

export function disposeEngine(): Promise<void> {
  if (worker) {
    try { worker.postMessage({ type: 'dispose' }); } catch { /* ignore */ }
    try { worker.terminate(); } catch { /* ignore */ }
  }
  worker = null;
  activeModelId = null;
  readyModelId = null;
  loadWaiter = null;
  genWaiters.clear();
  return Promise.resolve();
}

export function getReadyModelId(): string | null { return readyModelId; }
export function getActiveModelId(): string | null { return activeModelId; }
```

- [ ] **Step 3: Build**

Run:
```bash
npm run build
```
Expected: exit 0. The new files compile but are unused (web-llm chat still active). If TypeScript complains about Transformers.js types in the worker, narrow with local interfaces per the Step 1 note (no `any`).

- [ ] **Step 4: Commit**
```bash
git add src/components/LocalAI/gen-worker.ts src/components/LocalAI/chat-engine.ts
git commit -m "Add Transformers.js generation worker + engine wrapper"
```

---

### Task 2: Wire chat-ui to the new engine; update models; remove web-llm chat path

Switch the chat over to Transformers.js and delete the web-llm worker. After this, chat runs on Transformers.js. (`model-cache.ts` still imports web-llm — fixed in Task 3 — so model-manager statuses may be wrong until then, but the build and chat work.)

**Files:**
- Modify: `src/components/LocalAI/ChatPanel.astro` (models array + `ModelTier`-shaped data)
- Modify: `src/components/LocalAI/chat-ui.ts` (use `chat-engine`; new params; remove web-llm engine block)
- Delete: `src/components/LocalAI/chat-worker.ts` (the web-llm worker)

**Interfaces:**
- Consumes: `chat-engine.ts` (Task 1).

- [ ] **Step 1: Update the models array (ChatPanel.astro)**

In `src/components/LocalAI/ChatPanel.astro`, replace the `models` array with the ONNX models + per-model `dtype`, and drop `vram`:
```js
const models = [
  { id: 'onnx-community/Qwen2.5-0.5B-Instruct', tier: 'light',  name: 'Qwen2.5 0.5B', size: '0.4 GB', dtype: 'q4' },
  { id: 'onnx-community/Qwen2.5-1.5B-Instruct', tier: 'better', name: 'Qwen2.5 1.5B', size: '1.0 GB', dtype: 'q4f16' },
  { id: 'onnx-community/gemma-4-E2B-it-ONNX',   tier: 'best',   name: 'Gemma 4 E2B',  size: '1.5 GB', dtype: 'q4f16' },
];
```

- [ ] **Step 2: Update the `ModelTier` type in chat-ui.ts**

In `src/components/LocalAI/chat-ui.ts`, change the `ModelTier` interface to:
```ts
interface ModelTier {
  id: string;
  tier: 'light' | 'better' | 'best';
  name: string;
  size: string;
  dtype: string;
}
```
(Removes `vram`/`label`/`warn` if still present; adds `dtype`. If the `bestWarn` caution still references a model field, source it from i18n instead — it already is `this.i18n.bestWarn`/`warn`; keep using the i18n value, not a model field.)

- [ ] **Step 3: Replace the web-llm engine block with chat-engine imports**

In `src/components/LocalAI/chat-ui.ts`:
- Remove the top-of-file web-llm imports (`CreateWebWorkerMLCEngine` / `type MLCEngineInterface` / `type InitProgressReport`) and the module-level engine block: `enginePromise`, `activeModelId`, `readyModelId`, `activeWorker`, `getEngine`, `disposeEngine`, and the `progressPct` helper.
- Add at the top:
```ts
import {
  loadModel,
  generate,
  disposeEngine,
  getReadyModelId,
  getActiveModelId,
  type ChatMessage,
} from './chat-engine';
```
- Remove the `private engine` field from the class (the engine lives in `chat-engine` now).
- Replace every read of the old module variable `activeModelId` with `getActiveModelId()` and every read of `readyModelId` with `getReadyModelId()`. (These appear in `renderReady`, `refreshModelStatuses`, `applyRowState`, `removeModel`, `downloadInModels`.) Where code previously set `activeModelId = null` / `readyModelId = null` in `catch` blocks, replace those resets with `await disposeEngine();` (or remove them — `loadModel` rejection already left state clean; calling `disposeEngine()` on error is safest).

- [ ] **Step 4: Update `startDownload` (consent first download)**

Replace the body that called `getEngine(modelId, cb)` with `loadModel`. The progress callback now receives a numeric `pct` directly (no `report.text` parsing). Concretely, the `getEngine(modelId, (r) => {...})` call becomes:
```ts
    const m = this.models.find((x) => x.id === modelId);
    try {
      await loadModel(modelId, m?.dtype ?? 'q4', (pctInt) => {
        if (bar) bar.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - pctInt / 100));
        if (pct) {
          const small = pct.querySelector('small');
          pct.textContent = `${pctInt}%`;
          if (small) pct.appendChild(small);
        }
        if (label) label.textContent = this.i18n.downloading;
      });
      this.renderReady();
    } catch (err) {
      console.error('[LocalAI] model load failed', err);
      await disposeEngine();
      this.renderError(modelId);
    }
```
(The elapsed-time line that read `r.timeElapsed` is removed — Transformers.js progress is a plain percentage. Drop the `[data-progress-elapsed]` element from `renderDownloading` too, or leave it empty.)

- [ ] **Step 5: Update `send()` to stream via `generate`**

Replace the `this.engine.chat.completions.create({...})` + `for await` streaming block with a single `generate` call. The messages array is already `{role,content}[]`; type it as `ChatMessage[]`. Concretely:
```ts
    try {
      let replyBubble: HTMLElement | null = null;
      const full = await generate(
        messages as ChatMessage[],
        { max_new_tokens: 360, temperature: 0.35, top_p: 0.9, repetition_penalty: 1.2 },
        (running) => {
          if (!replyBubble) {
            typingEl?.remove();
            replyBubble = this.appendBubble('assistant', '');
          }
          if (gen !== this.genId) return;
          replyBubble.innerHTML = renderMarkdown(running);
          const list = this.body.querySelector('[data-messages]') as HTMLElement | null;
          if (list) list.scrollTop = list.scrollHeight;
        },
      );
      if (gen === this.genId) {
        this.history.push({ role: 'assistant', content: full });
        saveHistory(location.pathname, this.history);
      }
    } catch (err) {
      console.error('[LocalAI] generation failed', err);
      typingEl?.remove();
      this.appendBubble('assistant', this.i18n.errorBody);
    }
```
Keep the existing typing-indicator element (`typingEl`) created before the call, the `gen`/`this.genId` cancellation guard, the searchBlock/system-prompt assembly, and the user-message push + save that happen before generation. Remove the old `if (!this.engine) throw` check (readiness is enforced by `generate` rejecting when no model is loaded).

- [ ] **Step 6: Update `downloadInModels` (models-view inline download)**

Replace its `getEngine(modelId, cb)` with `loadModel`, and the dispose-before-switch with `disposeEngine`:
```ts
      this.setConsentedModel(modelId);
      if (getActiveModelId() && getActiveModelId() !== modelId) {
        await disposeEngine();
      }
      await loadModel(modelId, m?.dtype ?? 'q4', (pct) => {
        if (barFill) barFill.style.width = `${pct}%`;
        if (pctText) pctText.textContent = `${pct}%`;
      });
```
where `const m = this.models.find((x) => x.id === modelId);` is computed at the top of the method. On success keep `delete row.dataset.busy; await this.refreshModelStatuses();`. In the catch, replace `enginePromise = null; activeModelId = null; readyModelId = null;` with `await disposeEngine();`.

- [ ] **Step 7: Update `removeModel` / `renderReady` engine references**

- `removeModel`: it already calls `disposeEngine()` (now the imported one) for the active-delete path; replace any `this.engine = null;` with nothing (no such field now), and replace the `modelId === readyModelId` check with `modelId === getReadyModelId()`.
- `renderReady`: the active model name lookup uses `getReadyModelId()`.

- [ ] **Step 8: Delete the web-llm worker**
```bash
git rm src/components/LocalAI/chat-worker.ts
```

- [ ] **Step 9: Build + browser smoke**

Run:
```bash
npm run build
```
Expected: exit 0 (no remaining import of `./chat-worker`; `chat-ui` imports `./chat-engine`). Then `npm run preview`, open a lesson, consent + pick Light, confirm it downloads (ring progress) and a coherent answer streams in, in the lesson's language. (Model-manager statuses may be wrong until Task 3 — that's expected.)

- [ ] **Step 10: Commit**
```bash
git add src/components/LocalAI/ChatPanel.astro src/components/LocalAI/chat-ui.ts
git commit -m "Wire chat to Transformers.js engine; ONNX models; remove web-llm chat path"
```

---

### Task 3: Re-implement `model-cache.ts` on the Transformers.js cache

**Files:**
- Modify (full rewrite): `src/components/LocalAI/model-cache.ts`

**Interfaces:**
- Produces (unchanged signatures so `chat-ui.ts` is untouched):
  - `export type CacheStatus = 'active' | 'cached' | 'idle'`
  - `export async function getStatuses(modelIds: string[], activeId: string | null): Promise<Record<string, CacheStatus>>`
  - `export async function deleteModel(modelId: string): Promise<void>`

- [ ] **Step 1: Rewrite the module**

Replace the entire contents of `src/components/LocalAI/model-cache.ts` with:
```ts
/**
 * Per-model cache status + deletion for Transformers.js models. Transformers.js
 * stores downloaded model files in the browser Cache API (cache name
 * 'transformers-cache'); there is no hasModelInCache helper, so we inspect that
 * cache: a model is "cached" if at least one entry's URL contains its id.
 */
export type CacheStatus = 'active' | 'cached' | 'idle';

const CACHE_NAME = 'transformers-cache';

async function cachedIds(modelIds: string[]): Promise<Set<string>> {
  const present = new Set<string>();
  try {
    if (!('caches' in self)) return present;
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const urls = keys.map((r) => r.url);
    for (const id of modelIds) {
      if (urls.some((u) => u.includes(id))) present.add(id);
    }
  } catch {
    /* cache unavailable: treat all as not cached */
  }
  return present;
}

export async function getStatuses(
  modelIds: string[],
  activeId: string | null,
): Promise<Record<string, CacheStatus>> {
  const present = await cachedIds(modelIds);
  const result: Record<string, CacheStatus> = {};
  for (const id of modelIds) {
    result[id] = id === activeId ? 'active' : present.has(id) ? 'cached' : 'idle';
  }
  return result;
}

export async function deleteModel(modelId: string): Promise<void> {
  try {
    if (!('caches' in self)) return;
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    await Promise.all(
      keys.filter((r) => r.url.includes(modelId)).map((r) => cache.delete(r)),
    );
  } catch {
    /* ignore */
  }
}
```

- [ ] **Step 2: Build + verify the cache name**

Run `npm run build` (exit 0). Then `npm run preview`, download a model, open the models view, and confirm the downloaded model shows **Cached/Active** and the others **Not downloaded**; delete one and confirm it flips to **Not downloaded**. If statuses are always idle, the Transformers.js cache name differs in this version — inspect `caches.keys()` in DevTools and update `CACHE_NAME`, then rebuild. Record the confirmed cache name in the commit message.

- [ ] **Step 3: Commit**
```bash
git add src/components/LocalAI/model-cache.ts
git commit -m "Re-implement model-cache on the Transformers.js browser cache"
```

---

### Task 4: Remove web-llm (dependency + build config)

**Files:**
- Modify: `package.json` (remove dependency)
- Modify: `astro.config.mjs` (drop webllm chunk + globIgnores)

- [ ] **Step 1: Confirm nothing imports web-llm**
```bash
grep -rn "@mlc-ai/web-llm" src/ scripts/ || echo "no web-llm imports remain"
```
Expected: "no web-llm imports remain". If anything prints, fix it before continuing.

- [ ] **Step 2: Remove the dependency**
```bash
npm uninstall @mlc-ai/web-llm
```
Expected: `@mlc-ai/web-llm` removed from `package.json` `dependencies` (and `package-lock.json`).

- [ ] **Step 3: Drop the webllm build config**

In `astro.config.mjs`:
- In `vite.build.rollupOptions.output.manualChunks`, remove the `if (id.includes('@mlc-ai/web-llm')) return 'webllm';` line. Keep the `@huggingface/transformers` → `'transformers'` line.
- In `injectManifest.globIgnores`, remove `'_astro/webllm-*.js'` and `'_astro/webllm.*.js'`. KEEP `'_astro/transformers-*.js'`, `'_astro/transformers.*.js'`, `'_astro/chat-worker-*.js'` AND ADD `'_astro/gen-worker-*.js'` (the new worker bundles Transformers.js + ORT wasm and is large). Keep `'_astro/**/*.wasm'`.

- [ ] **Step 4: Build + verify exclusions**

Run:
```bash
npm run build
```
Expected: exit 0. Then verify the large chunks are excluded from precache and web-llm is gone:
```bash
grep -oE "gen-worker[.-][A-Za-z0-9_-]+\.js|transformers\.[A-Za-z0-9_-]+\.js" dist/sw.js && echo "PRECACHED (bad)" || echo "worker/transformers not precached - correct"
grep -c "mlc-ai" package.json
```
Expected: the AI chunks are NOT in `dist/sw.js`; the `package.json` grep prints `0`.

- [ ] **Step 5: Commit**
```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "Remove @mlc-ai/web-llm; drop its chunk + precache config"
```

---

### Task 5: Update copy (consent + privacy) and CLAUDE.md

**Files:**
- Modify: `src/i18n/ui.ts` (consent body model wording, if it names specific models)
- Modify: `src/content/docs/en/privacy.mdx`, `src/content/docs/it/privacy.mdx`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Consent / privacy wording**

The consent + privacy copy says the assistant downloads model files from Hugging Face and then runs offline — still accurate. The only change needed is if any copy names the engine or specific models. Check:
```bash
grep -rni "web-llm\|webllm\|mlc\|qwen\|gemma" src/i18n/ui.ts src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx || echo "no engine/model names in copy"
```
If a match references web-llm/MLC, reword to not name the engine (the copy should stay engine-agnostic: "a small AI model", "model files"). Do not introduce model names. If nothing matches, no copy change is needed — note that and skip to Step 2.

- [ ] **Step 2: Update CLAUDE.md**

In `CLAUDE.md`, in the "Assistente IA locale (in-browser)" section, update the engine description: replace mentions of `@mlc-ai/web-llm` / web-llm with Transformers.js. Add (or adjust the existing note) to read, in the section's existing style:
```markdown
Motore: la chat gira su `@huggingface/transformers` (Transformers.js, ONNX +
WebGPU), lo stesso runtime dell'embedder RAG: niente più `@mlc-ai/web-llm`.
`gen-worker.ts` ospita la pipeline `text-generation` in un Web Worker;
`chat-engine.ts` lo pilota (load/generate/dispose + stato ready/active);
`chat-ui.ts` lo consuma. Modelli (ONNX, `onnx-community`): Qwen2.5 0.5B (`q4`,
~0.4 GB), Qwen2.5 1.5B e Gemma 4 E2B (`q4f16`). `model-cache.ts` ispeziona la
Cache API (`transformers-cache`) per stato/eliminazione (Transformers.js non
espone `hasModelInCache`). Lo streaming usa `TextStreamer`.
```
Adjust/replace any now-stale web-llm sentence in that section so it doesn't contradict this.

- [ ] **Step 3: Build, em-dash check, commit**
```bash
grep -n "—" src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx && echo "EM DASH (fix)" || echo "clean"
npm run build
git add -A
git commit -m "Docs/copy: chat engine is now Transformers.js"
```
Expected: no em dash; build exit 0.

---

### Task 6: Final verification

**Files:** verify only.

- [ ] **Step 1: Clean build**
```bash
rm -rf dist .astro && npm run build > /tmp/migbuild.log 2>&1; echo "EXIT $?"; tail -4 /tmp/migbuild.log
grep -c "mlc-ai" package.json
```
Expected: EXIT 0; `package.json` mlc-ai count `0`.

- [ ] **Step 2: Manual smoke (preview, WebGPU browser) — Definition of Done**

`npm run preview`, then on a lesson (light + dark, 375px):
- Consent → pick **Light (Qwen2.5 0.5B)** → it downloads with progress → a coherent answer streams in, **in the lesson's language** (test an `/it/` page → Italian).
- Open the models view → switch to **Better**, then **Best (Gemma 4 E2B)**; each downloads inline with live progress and becomes Active. (If Gemma 4 E2B fails to load or is far larger than ~1.5 GB, note it — the spec's fallback is a text-only top model like Llama-3.2-3B ONNX; flag for a follow-up decision.)
- Model manager statuses correct (Active / Cached / Not downloaded); delete a cached model → flips to Not downloaded; delete the active model with another cached → falls back to it (stays on).
- RAG: ask a cross-lesson question → answer reflects another lesson.
- History persists per lesson; "New chat" clears; exercise launcher runs.
- No-WebGPU fallback still shows; no console errors attributable to the assistant (the `/sa/proxy.js` 404 is the known environment-only exception).

---

## Self-review

**Spec coverage:**
- Transformers.js text-gen worker + wrapper → Task 1. ✓
- Wire chat-ui, new ONNX models, params, remove web-llm chat path → Task 2. ✓
- Model lineup (Qwen 0.5B `q4` ≤0.5 GB / Qwen 1.5B / Gemma 4 E2B) → Task 2 (ChatPanel models). ✓
- model-cache on Cache API → Task 3. ✓
- Remove `@mlc-ai/web-llm` + build config → Task 4. ✓
- Param mapping (max_new_tokens/temperature/top_p/repetition_penalty) → Task 1 (worker defaults) + Task 2 (send). ✓
- Copy + CLAUDE.md → Task 5. ✓
- Consent gating intact (worker/models load only in download path) → preserved (loadModel called only from startDownload/downloadInModels). ✓
- RAG/history/UI/stacking unchanged → not touched. ✓
- DoD / risks (Gemma 4 size, speed, cache-name) → Task 6 + Task 3 Step 2. ✓

**Placeholder scan:** No TBD/TODO. The "narrow types if the version differs" notes in Task 1 are concrete fallbacks (use a local interface; cast at the library call), not placeholders. Task 5 Step 1 is conditional (reword only if a name is found) with an explicit "skip if no match".

**Type consistency:** `ChatMessage`/`GenOpts` defined in `chat-engine.ts` (Task 1) and consumed in `chat-ui.ts` (Task 2). `loadModel(modelId, dtype, onProgress)` / `generate(messages, opts, onToken)` / `disposeEngine()` / `getReadyModelId()` / `getActiveModelId()` signatures are identical across Task 1 (definition) and Task 2 (use). `ModelTier` gains `dtype` (Task 2) matching the ChatPanel `models` array (Task 2 Step 1). `CacheStatus`/`getStatuses`/`deleteModel` keep the same shape (Task 3) so `chat-ui.ts` model-manager code is unchanged. The new worker chunk is `gen-worker-*.js`, excluded in Task 4 (consistent with the `new URL('./gen-worker.ts', import.meta.url)` in `chat-engine.ts`).
