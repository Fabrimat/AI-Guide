# Local in-browser AI assistant — design

Date: 2026-06-24
Status: approved design, pending implementation plan

## Goal

Add a floating chat panel to ai-guide.larosa.work that runs a small LLM
**entirely in the browser** (no server, no API key, no data leaving the
device after the one-time model download). The assistant:

1. Knows the current lesson (reads the rendered page text as context).
2. Can pull relevant excerpts from other lessons via the existing Pagefind
   search index before answering cross-lesson questions.
3. Can run a lesson's "Check-in" exercise interactively, in-page, from the
   `.txt` skill file, without the reader leaving for an external AI.
4. Adds to — never replaces — the existing Copy / Download / Open buttons.

It is an **additional** option. The external-AI workflow stays fully intact.

## Decisions taken during brainstorming

- **Model: user picks at consent time**, from three tiers. The reader chooses
  based on device and patience. Model IDs are web-llm prebuilt ids:
  | Tier | Model id | First download | GPU memory (VRAM) |
  |------|----------|----------------|-------------------|
  | Light  | `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` | ~0.4 GB | ~0.95 GB |
  | Better | `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` | ~1.1 GB | ~1.6 GB  |
  | Best   | `Qwen2.5-3B-Instruct-q4f16_1-MLC`   | ~1.9 GB | ~2.5 GB  |
  All three are 4096-token context. The consent screen warns that "Best"
  needs a strong GPU and fails on most phones.
- **Weights source: third-party CDN** (web-llm default, HuggingFace/MLC). One
  one-time fetch, then cached in the browser (Cache API) forever. No deploy
  bloat. The single third-party request is disclosed on the consent screen.
- **Consent before any download is mandatory.** Nothing touches the network
  until the user explicitly opts in on the consent screen.
- **Privacy disclosure: privacy.mdx + consent screen.** Add a "Local AI
  assistant" section to `privacy.mdx` (it + en), and show a concise 1–2 line
  disclosure on the consent screen linking to that page.

## Approach decisions (with rationale)

1. **Inject via `Footer.astro`, not `PageFrame`.** `Footer.astro` is already
   the override that injects a per-page component (`ShareLesson`) on every doc
   page. The panel is `position: fixed`, so DOM location is irrelevant. This is
   the lowest-risk, most idiomatic hook; `PageFrame` is large and invasive.
2. **Use web-llm's official Web-Worker helper, not a hand-rolled postMessage
   protocol.** `chat-worker.ts` is a tiny `WebWorkerMLCEngineHandler`;
   `chat-ui.ts` drives it through the `CreateWebWorkerMLCEngine` proxy (which
   postMessages internally). Satisfies "worker owns the engine, UI talks via
   postMessage" with far less bug surface than a custom protocol.
3. **Resolve skill files by scanning the DOM, not guessing from the slug.**
   Every `<LlmExercise>` renders `data-file` + `data-variant`. A lesson can have
   0, 1, or several skill files (`practice-`, `review-`, `deepen-`, `first-`),
   so slug-derivation is wrong. Scanning `.llm-exercise[data-file]` is exact and
   reuses the `/skills/<locale>/<file>` URL the component already builds.

## File layout

```
src/components/LocalAI/
  ChatPanel.astro      # markup + scoped styles; rendered once by Footer.astro
  chat-worker.ts       # WebWorkerMLCEngineHandler (engine off the main thread)
  chat-ui.ts           # controller: state machine, streaming, exercise mode, fallback
  lesson-context.ts    # extract clean prose from main .sl-markdown-content
  search-context.ts    # query Pagefind for top-3 cross-lesson excerpts
  skill-loader.ts      # scan DOM for .llm-exercise[data-file], fetch the .txt
```

Edits to existing files:
- `src/components/Footer.astro` — import and render `<ChatPanel />` once.
- `src/i18n/ui.ts` — add a typed `localAi*` block to `UIStrings`, it + en.
- `src/content/docs/en/privacy.mdx`, `src/content/docs/it/privacy.mdx` — add a
  "Local AI assistant" section.

Not touched: no lesson `.mdx`, no new `--aig-*` tokens, no change to the
LlmExercise Copy / Download / Open buttons.

## Component responsibilities

Each unit has one job, a small interface, and explicit dependencies.

### `ChatPanel.astro`
- **Does:** renders the launcher button (fixed bottom-right), the drawer/sheet
  shell, the consent screen, model picker, progress bar, message list, input,
  "Start exercise" button, and the no-WebGPU fallback view. Server-renders all
  UI strings (`t(Astro.currentLocale)`) and emits config as `data-*` attributes
  (locale, the three model ids + sizes, privacy-page href). Imports `chat-ui.ts`
  via a client `<script>`.
- **Interface:** no props. Rendered as `<ChatPanel />` by Footer.
- **Depends on:** `src/i18n/ui.ts`, `chat-ui.ts`.

### `chat-worker.ts`
- **Does:** `import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm'`,
  instantiate a handler, route `onmessage`. Nothing else. Keeps inference off
  the UI thread.
- **Interface:** Web Worker (module type). Created from `chat-ui.ts` with
  `new Worker(new URL('./chat-worker.ts', import.meta.url), { type: 'module' })`.
- **Depends on:** `@mlc-ai/web-llm`.

### `chat-ui.ts`
- **Does:** the controller. Binds to the panel DOM, runs the state machine,
  detects WebGPU, shows the consent screen, creates the worker + engine on
  consent with `CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback })`,
  streams chat completions, assembles the system prompt, runs exercise mode,
  handles all fallbacks, persists consent. Module-level singleton for the engine
  so it survives view transitions; re-binds to new DOM and refreshes lesson
  context on every `astro:page-load`.
- **Interface:** side-effecting module imported by ChatPanel's `<script>`.
- **Depends on:** `@mlc-ai/web-llm`, `chat-worker.ts`, `lesson-context.ts`,
  `search-context.ts`, `skill-loader.ts`, strings from `data-*`.

### `lesson-context.ts`
- **Does:** `extractLessonContext(): { title: string; text: string }`. Reads
  `main .sl-markdown-content`, removes `.not-content` subtrees (exercise cards,
  components, crawler index), collapses whitespace, returns clean prose
  truncated to a ~1500-token budget. Title from the page `<h1>`.
- **Depends on:** DOM only.

### `search-context.ts`
- **Does:** `searchOtherLessons(query, locale): Promise<Excerpt[]>` — loads
  Pagefind from `/pagefind/pagefind.js` (same loader pattern as `Search.astro`),
  runs the query, returns the top-3 `{ title, url, excerpt }` (excerpt stripped
  of `<mark>`), within a ~600-token budget. Fails soft to `[]` when Pagefind is
  absent (dev) or errors.
- **Depends on:** Pagefind core API (production build only).

### `skill-loader.ts`
- **Does:** `findSkillFiles(): SkillRef[]` scans `.llm-exercise[data-file]`,
  reading `data-file`, `data-variant`, and the card `<h3>` title, resolving the
  same `/skills/<locale>/<file>` URL. `loadSkill(ref): Promise<string>` fetches
  the `.txt`. The panel offers the relevant skill (prefer a `review`/`practice`
  card on the page) for "Start exercise".
- **Depends on:** DOM + `fetch`.

## State machine (chat-ui)

```
idle
 └─(open panel)─> check WebGPU (navigator.gpu)
      ├─ undefined ──────────────> FALLBACK: friendly message + surface this
      │                            lesson's skill buttons (external AI). No network.
      ├─ present, no consent ────> CONSENT: model picker (Light/Better/Best) +
      │                            1–2 line privacy disclosure + privacy link.
      │                            Nothing downloads.
      │     └─(pick + "Download & enable")─> persist consent ─> DOWNLOADING
      ├─ present, consent stored ─> DOWNLOADING (weights likely cached → fast)
      │
 DOWNLOADING (initProgressCallback → progress bar)
      ├─ success ─> READY
      └─ failure (e.g. OOM) ─> ERROR: message + fallback buttons + retry-on-Light
 READY
      ├─ free chat: send → build system prompt → stream reply
      └─ if page has a skill file: "Start exercise" → exercise mode
```

Persistence: `localStorage['aiguide:localai:consent'] = <modelId>` (presence =
consented; value = chosen tier). No transcripts persisted.

## System prompt assembly (per message)

Filled at send time from the approved template:

```
You are the built-in assistant for AI-Guide ... no data leaves this device.
Current lesson: {lesson_title}
Current lesson content:
{lesson_text}                # lesson-context, ~1500-token budget
Relevant excerpts from other lessons (if any):
{search_results}            # search-context top-3, ~600-token budget
Rules:
- Answer questions about the current lesson and the guide in general.
- If asked about something not in the guide, say so and suggest a full AI
  like Claude or ChatGPT.
- Be concise. This is a study guide, not a chatbot.
- Match the language of the user's message (guide is bilingual en/it).
- Never reproduce large blocks of the lesson verbatim. Paraphrase and explain.
```

Token budgets keep the system prompt + history within the 4096-token window.

### Exercise mode

On "Start exercise": `skill-loader` fetches the `.txt`; chat-ui injects it as a
**separate system block** plus: "You are now running this exercise. Ask the
first question. Wait for the user to answer before proceeding. Give feedback
after each answer. Do not ask multiple questions at once." Then it sends a
**silent trigger** (not shown as a user bubble) so the model asks question 1
without the user typing.

## Cross-cutting behavior

- **View transitions (ClientRouter):** engine/worker is a module-level
  singleton (mirrors `Search.astro`'s `pagefindLoadPromise`) so SPA navigation
  never re-downloads. chat-ui re-binds to the freshly rendered panel and
  refreshes lesson context on `astro:page-load`.
- **Theming/responsive:** scoped styles using existing `--sl-color-*` /
  `--aig-*` tokens only. Desktop: right-side drawer, max ~380px. ≤375px:
  full-width bottom sheet. Auto dark/light. Honors `prefers-reduced-motion`.
- **Non-interference:** does not bind Ctrl+K (search keeps it). Search's
  `<dialog>` uses the top layer, so it always renders above the panel. Progress
  tracker untouched. Launcher is a single button; ESC closes only the panel
  when it has focus.
- **PWA/build:** the web-llm worker bundles into `_astro/` and is precached by
  the existing `_astro/**/*` injectManifest glob (shell). Model weights are NOT
  precached — they come from the CDN and are cached by web-llm itself. The SW is
  same-origin-only, so it does not intercept the CDN fetches (verify during
  implementation).
- **i18n:** all visible strings via `t(locale)` server-side, handed to the
  client through `data-*`. Adding strings means extending `UIStrings` (TS
  enforces both locales).

## Graceful degradation

- **No WebGPU** (`navigator.gpu === undefined`): fallback message +
  surfaced skill buttons. Never touches the network.
- **Engine load failure** (weak GPU / OOM): caught; error + fallback buttons +
  offer retry on the Light model.
- **Pagefind absent** (dev): `search-context` returns `[]`; free chat still
  works on lesson context.
- **No JS:** launcher does not render (it is JS-driven); the server-rendered
  LlmExercise buttons remain fully functional.
- The page never crashes or blocks in any case.

## New i18n strings (`localAi*` in `UIStrings`)

Launcher label/aria; panel title; consent heading + body + privacy line +
privacy link text; three model tier labels + size hints + the "Best" GPU
warning; "Download & enable"; downloading/progress label; ready label; input
placeholder; send label; "Start exercise"; no-WebGPU fallback text; load-error
text + retry label; disclaimer footer ("answers generated locally, may be
wrong"). Exact copy authored per the voice guide during implementation, it+en.

## privacy.mdx changes (en + it)

A short "Local AI assistant" section: the assistant is optional and off by
default; the model downloads once from a third-party CDN (HuggingFace/MLC) only
after explicit consent; after that it runs fully in the browser with no data
leaving the device; conversations are not stored or sent anywhere. Written in
the project voice.

## Constraints (recap)

- No new npm deps beyond `@mlc-ai/web-llm` (Pagefind already present).
- No backend, no API keys, no env vars. Works on the static build.
- Do not modify lesson `.mdx`. Do not change the Copy/Download/Open buttons.
- TypeScript throughout; avoid `any`.
- Mobile-friendly at 375px.

## Definition of done

- `npm run build` completes without errors.
- On a lesson page the floating button appears; clicking opens the panel.
- After consent, the model downloads (progress shown) and the user gets a
  coherent answer about the lesson.
- On a lesson with a skill file, "Start exercise" runs the interactive check-in.
- The existing Copy / Download / Open buttons still work.
- WebGPU-unsupported browsers see the fallback message.
- No console errors on either locale.

## Risks / verification points

- Confirm the SW (`src/sw.ts`) does not intercept cross-origin CDN requests for
  weights (expected: same-origin-only handler).
- Confirm Vite bundles the module worker + web-llm cleanly for `output: static`
  with no SSR evaluation of browser-only code.
- web-llm bundle size: verify the precached shell stays reasonable; the engine
  glue is small, weights are not precached.
- Validate Italian output quality across tiers is acceptable enough to ship the
  feature as "additional" (Light may be rough — acceptable since it is opt-in
  and the external-AI path remains).
