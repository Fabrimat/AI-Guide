# Local AI panel — UX redesign + model manager + history — design

Date: 2026-06-24
Status: approved design, pending implementation plan
Builds on: `2026-06-24-local-ai-assistant-design.md`, `2026-06-24-rag-transformers-js-design.md`.
Approved mockup: the four panel states (Consent · Downloading · Chat · Models) in the Pastello system.

## Goal

Overhaul the in-browser assistant panel so it looks and works like a real product instead of a basic prototype:

1. Redesign the panel layout/formatting (Pastello system, the approved mockup).
2. A richer download experience (progress ring with stage, size, elapsed).
3. A proper chat UI: markdown-rendered replies, real bubbles, typing indicator, header controls.
4. A model manager: per-tier cache status, switch model, delete a cached model.
5. Persist conversation history per lesson in `localStorage`.

## Decisions taken during brainstorming

- **Markdown: hand-rolled, no new dependencies.** A small renderer covering bold, italic, inline code, fenced code blocks, ordered/unordered lists, links (safe schemes only), headings, paragraphs, line breaks. XSS-safe by construction (escape all HTML first, then add only our own tags). Re-rendered from accumulated text during streaming.
- **History: per-lesson threads in `localStorage`.** Each lesson keeps its own conversation, keyed by its path. Opening the panel on a lesson resumes that lesson's thread. A "New chat" control clears the current lesson's thread. The system prompt always matches the open lesson (no cross-lesson mixing).
- **Model manager: full.** A models view (gear in the header) lists the three tiers with status Active / Downloaded (cached) / Not downloaded, lets you switch (download + activate), and delete a cached, non-active model to free space. Uses web-llm's `hasModelInCache` and `deleteModelAllInfoInCache`.
- **Honor the Pastello system.** Existing `--sl-color-*` / `--aig-*` tokens, Outfit, automatic dark mode. No new design tokens, no hardcoded colors.

## Architecture

Refactor the panel into focused units. `chat-ui.ts` stays the controller (custom element `<local-ai>`) but delegates pure logic to small modules so it stays readable.

```
src/components/LocalAI/
  ChatPanel.astro    # markup shell + redesigned scoped CSS; server-renders data-* (models, i18n, locale, privacy href)
  chat-ui.ts         # controller: state machine, engine lifecycle (load/switch/dispose), view rendering
  markdown.ts        # NEW: renderMarkdown(src) -> safe HTML string
  history.ts         # NEW: per-lesson thread persistence in localStorage
  model-cache.ts     # NEW: per-model cache status + delete (lazy web-llm cache helpers)
  (unchanged) chat-worker.ts, lesson-context.ts, search-context.ts, embedder.ts, skill-loader.ts
```

### Views (state machine in chat-ui.ts)
`closed → open →`
- no WebGPU → **fallback** (unchanged behavior, restyled).
- not consented → **consent** (redesigned model cards).
- consented → **downloading** (progress ring) → **chat**.
- from chat header: **models** view (gear) and **new chat** (clears thread).
- load failure → **error** (restyled; retry on Light).

## Component responsibilities

### `markdown.ts`
- **Does:** `renderMarkdown(src: string): string` — returns sanitized HTML. Algorithm: (1) HTML-escape the entire input; (2) extract fenced code blocks ```` ``` ```` into `<pre><code>` (content already escaped); (3) on the rest, line-group into paragraphs/lists, then apply inline rules to each line: `**bold**`/`__bold__`, `*italic*`/`_italic_`, `` `code` ``, `[text](url)` (only `http(s)`, `mailto:`, `/`, `#` schemes; others drop to `#`), `#`..`###` headings; preserve single newlines as `<br>` within paragraphs. No raw HTML from the model can survive (everything was escaped first).
- **Interface:** `export function renderMarkdown(src: string): string`.
- **Depends on:** nothing.

### `history.ts`
- **Does:** per-lesson conversation persistence.
  - `export type ChatMsg = { role: 'user' | 'assistant'; content: string }`
  - `export function historyKey(pathname: string): string` → `aiguide:localai:chat:<normalized-path>`
  - `export function loadHistory(pathname: string): ChatMsg[]` (returns `[]` on miss/parse error)
  - `export function saveHistory(pathname: string, msgs: ChatMsg[]): void` (caps to the last 50 messages; ignores quota errors)
  - `export function clearHistory(pathname: string): void`
- **Depends on:** `localStorage` (guarded in try/catch).

### `model-cache.ts`
- **Does:** model cache status + deletion, lazily importing web-llm's helpers so nothing loads pre-consent.
  - `export type CacheStatus = 'active' | 'cached' | 'idle'`
  - `export async function getStatuses(modelIds: string[], activeId: string | null): Promise<Record<string, CacheStatus>>` (uses `hasModelInCache`; the active id wins).
  - `export async function deleteModel(modelId: string): Promise<void>` (uses `deleteModelAllInfoInCache`).
- **Depends on:** dynamic `import('@mlc-ai/web-llm')`.

### `chat-ui.ts` (controller, extended)
- Adds: chat history load/save per lesson; "new chat"; markdown rendering of assistant bubbles (re-render accumulated text per stream chunk); the models view (render statuses, switch, delete); engine **dispose** (`engine.unload()` + `worker.terminate()`) before switching models; header controls (new-chat, models/gear) shown only in the chat view. Reuses `extractLessonContext`, `searchOtherLessons`, `skill-loader`, `embedder` as today.
- The module-level engine singleton gains a `disposeEngine()` and tracks the worker so a model switch frees the old one.

### `ChatPanel.astro`
- Redesigned scoped CSS implementing the mockup (consent cards, ring, bubbles, typing dots, header, models rows), all via Pastello tokens; responsive (≤375px bottom sheet); `prefers-reduced-motion` respected (ring/typing/pulse animations disabled). Inline SVG icons live as small string constants in `chat-ui.ts` (sparkle, close, plus, gear, back, send, check, trash, warning) for the JS-built views.

## Data flow / persistence

- `localStorage` keys:
  - `aiguide:localai:consent` = active model id (unchanged; updated on model switch).
  - `aiguide:localai:chat:<path>` = JSON `ChatMsg[]` for that lesson (new).
- On entering the chat view: `loadHistory(location.pathname)` → render existing bubbles; if empty, start fresh. After each completed turn: `saveHistory`. "New chat": `clearHistory` + reset in-memory `history` + clear the message list.
- Model switch: set consent to new id → `disposeEngine()` → `startDownload(newId)` (shows the ring; instant-ish if cached) → back to chat (history for the lesson preserved; it is per-lesson, not per-model).

## Markdown during streaming

The assistant bubble holds the accumulated raw text; on each chunk, set `bubble.innerHTML = renderMarkdown(full)`. Cost is negligible for short replies. Auto-scroll stays pinned to bottom while streaming.

## Privacy copy update

The privacy "local AI assistant" section currently says messages are *not* saved between visits. That is no longer true: conversations are now saved **in your browser's `localStorage`, per lesson, never sent anywhere, and clearable** (the "New chat" button, and the existing "Clear progress" does not touch these — note a separate clear). Update both `privacy.mdx` (en + it) and, if needed, the consent line, in the project voice (no em dash).

## Constraints

- No new npm dependencies (markdown is hand-rolled).
- No backend, no API keys. Static build; `npm run build` must pass.
- Do not change the LlmExercise Copy/Download/Open buttons or the Ctrl+K Pagefind search.
- Keep RAG retrieval and consent gating intact (embedder still loads only post-consent, inside the send path).
- Honor Pastello tokens only; no hardcoded colors; Outfit; dark mode via tokens; responsive at 375px.
- TypeScript; avoid `any`. No em dash in user-facing copy; follow the voice guide (it + en).

## Definition of done

- `npm run build` passes.
- The panel matches the approved mockup across Consent / Downloading / Chat / Models, in light and dark.
- Assistant replies render markdown (bold, lists, inline + fenced code, links); no raw HTML/markup injection is possible from model output.
- Reopening the panel on a lesson restores that lesson's conversation; "New chat" clears it; a different lesson has its own thread.
- The models view shows correct per-tier status (active/cached/idle), switching downloads+activates and frees the old engine, and deleting a cached non-active model updates its status.
- Consent gating unchanged; RAG still works; existing exercise flow still works.
- No console errors attributable to the panel on either locale; responsive at 375px; reduced-motion respected.

## Risks / verification points

- Confirm `engine.unload()` + `worker.terminate()` actually frees GPU memory on switch (verify no leak across two switches).
- Confirm `hasModelInCache` / `deleteModelAllInfoInCache` signatures in the installed web-llm (0.2.84) and that delete clears enough that status flips to idle.
- Markdown renderer must be XSS-safe: a model reply containing `<script>` or `<img onerror>` must render as inert text. Include a manual check.
- Streaming re-render of markdown must not flicker or break partial code fences mid-stream (acceptable: partial fence renders as text until closed).
- localStorage growth: history capped at 50 messages/lesson; verify cap.
