# Local AI panel UX redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the in-browser assistant panel to match the approved mockup, with markdown-rendered chat, a richer download experience, per-lesson conversation history in localStorage, and a full model manager (cache status / switch / delete).

**Architecture:** Form-first. Task 1 fixes the styling root cause and ports the approved mockup's look + DOM structure into `ChatPanel.astro` (global, element-prefixed CSS) and `chat-ui.ts` (view builders). Tasks 2–4 layer behavior into that stable structure via three new pure-ish modules (`markdown.ts`, `history.ts`, `model-cache.ts`). Tasks 5–6 update copy/docs and verify.

**Tech Stack:** Astro 6 + Starlight, TypeScript, existing `@mlc-ai/web-llm` (cache helpers `hasModelInCache` / `deleteModelAllInfoInCache`). No new dependencies.

**Visual source of truth:** the committed mockup `docs/superpowers/assets/2026-06-24-localai-redesign-mockup.html` — its CSS values and DOM structure are the target. Port them (adapting to the element-prefixed global CSS and the JS-built DOM).

## Global Constraints

- No new npm dependencies (markdown is hand-rolled).
- Honor the Pastello system: only `--sl-color-*` / `--aig-*` tokens, Outfit, automatic dark mode. No hardcoded colors. Responsive at 375px (bottom sheet). Respect `prefers-reduced-motion`.
- **Styling must be `<style is:global>` with every selector prefixed by `local-ai`** (e.g. `local-ai .lai-bubble { … }`). Astro scoped styles do NOT reach elements created at runtime by `chat-ui.ts`; `Search.astro` uses `is:global` for exactly this reason. This is the fix for the current "unstyled JS views" look.
- Keep RAG retrieval + consent gating intact: the embedder still loads only post-consent inside the send path; nothing AI-related loads before consent.
- Do not change the LlmExercise Copy/Download/Open buttons or the Ctrl+K Pagefind search (`Search.astro`).
- TypeScript on the client; avoid `any`. No em dash in user-facing copy; follow the voice guide (it + en).
- localStorage keys: `aiguide:localai:consent` (active model id, existing) and `aiguide:localai:chat:<path>` (per-lesson history, new).
- Commits are signed via the 1Password SSH agent (unlocked). Commit normally; if a commit fails with a 1Password/agent error, STOP and report rather than passing `-c commit.gpgsign=false`.

### Testing approach (read first)

No test runner exists and none may be added. Smoke test = `npm run build` (exit 0). Visual/behavioral checks are done manually against `npm run preview` (the assistant needs WebGPU + the built site). Pure logic (`renderMarkdown`, history helpers) gets a throwaway Node check from the scratchpad; do not commit it. Each task ends with `npm run build` green + the stated check + a commit.

Branch: `feat/local-ai-assistant` (continue here, in the existing worktree).

---

### Task 1: Redesign — apply real styling (is:global) + port the mockup structure

Fix the root cause (runtime views unstyled) and make the panel match the mockup. Chat bubbles stay plain text here; markdown lands in Task 2. Header gains the new-chat and models (gear) controls and a status dot; a models view scaffold + back nav exist (populated in Task 4); new-chat clears the in-memory conversation only (persistence in Task 3).

**Files:**
- Modify: `src/components/LocalAI/ChatPanel.astro` (convert `<style>` to `<style is:global>`, prefix all selectors with `local-ai`, port the mockup CSS; keep the launcher/panel/header shell markup)
- Modify: `src/components/LocalAI/chat-ui.ts` (rewrite the view builders to the mockup DOM + class names; add header controls + models-view scaffold + back nav; icon SVG constants)

**Interfaces:**
- Produces (used by later tasks): view methods `renderConsent()`, `renderDownloading()`, `renderReady()`, `renderModels()`, `renderFallback()`, `renderError(modelId)`; header control hooks for new-chat (`onNewChat()`) and models (`openModels()` / `closeModels()`); class names matching the global CSS (`lai-*`).

- [ ] **Step 1: Convert styles to element-prefixed global CSS and port the mockup**

In `ChatPanel.astro`, change `<style>` to `<style is:global>` and prefix EVERY selector with `local-ai ` (the custom element root), e.g. `local-ai .lai-panel { … }`, `local-ai .lai-bubble.lai-a strong { … }`. Port the visual design from `docs/superpowers/assets/2026-06-24-localai-redesign-mockup.html`: map the mockup classes to `lai-`-prefixed names and translate the mockup's literal hex values to the project tokens where one exists (peach ground → `--sl-color-bg`, coral → `--sl-color-accent`, coral-soft → `--sl-color-accent-low`, hairline → `--sl-color-hairline`, elevated card → `--aig-elevated-bg`, warm → `--aig-elevated-bg-warm`, caution → `--aig-caution-*`, shadow → `rgba(var(--aig-shadow-color), …)`, indigo text → `--sl-color-text`). Keep the two semantic status hues (sage "cached", muted "idle") as literals since the palette has no token for them; add a short comment noting they are intentional status colors. Include: launcher, panel, header (`.lai-head` with spark, title+status, icon buttons), consent cards (`.lai-opt`/`.lai-opt.lai-sel`), the download ring (`.lai-ring` + `.lai-pct`), chat (`.lai-msgs`, `.lai-bubble.lai-u`/`.lai-a` incl. `strong`/`ul`/`li`/`code`/`pre code`, `.lai-typing` dots, `.lai-ex-pill`, `.lai-composer`/`.lai-field`/`.lai-send`, `.lai-footnote`), and models (`.lai-model`, `.lai-pill.active/.cached/.idle`, `.lai-actions`). Respect `prefers-reduced-motion` (disable ring pulse + typing animation). Add the 375px bottom-sheet media query.

Keep the launcher + panel + header shell in the `.astro` template (these get the cid and also have global rules — fine). Everything the JS builds into `.lai-body` is covered by the global rules.

- [ ] **Step 2: Rewrite chat-ui view builders to the mockup DOM**

In `chat-ui.ts`, define icon SVG string constants near the top (sparkle, close, plus, gear, back, send, check, trash, warning, send) and a helper:
```ts
const ICON = {
  close: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  plus: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M12 5v14M5 12h14"/></svg>',
  gear: '<svg viewBox="0 0 24 24" class="lai-ic"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8M4.6 9a1.6 1.6 0 0 0-.3-1.8"/></svg>',
  back: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M15 18l-6-6 6-6"/></svg>',
  send: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
  check: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M20 6 9 17l-5-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  warn: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" class="lai-ic"><path d="M12 3l2.1 4.9L19 10l-4.9 2.1L12 17l-2.1-4.9L5 10l4.9-2.1z"/></svg>',
} as const;
```
Rewrite each view builder to emit the mockup's structure using these classes (build with `createElement` or a small `html` template-string + `innerHTML` on a container, your choice; keep it readable). Specifically:
- `renderConsent()`: lead text + three `.lai-opt` cards (first `.lai-sel`, Light gets a `.lai-chip` "Recommended", Best gets a `.lai-warn` from `m.warn`), primary "Download & enable", privacy line + link. Selecting a card toggles `.lai-sel`. Confirm reads the selected model id → `setConsentedModel` + `startDownload`.
- `renderDownloading()`: the ring (`<svg>` with track + bar circle, `data-progress-bar` on the bar via `stroke-dashoffset`, `data-progress-label` for the stage), `.lai-pct` percentage, a meta row (downloaded size + elapsed — optional values from `initProgressCallback` report; show what's available), and the "one time only" reassurance. The progress callback updates the bar's `stroke-dashoffset` (circumference ≈ `2*Math.PI*52 = 326.7`; offset = `326.7 * (1 - progress)`) and the `.lai-pct` text + stage label.
- `renderReady()`: build the chat shell — message list (`.lai-msgs`), composer (`.lai-field` input + `.lai-send` button), footnote, and the exercise pill if a skill exists (via the existing `renderExerciseButton` logic, restyled to `.lai-ex-pill`). The header (in the panel shell) shows new-chat + gear controls + a status dot with the active model label only while in the chat view (toggle a `data-view="chat"` attribute on the panel so CSS shows/hides the right header controls).
- `renderModels()`: scaffold for now — header back button + a container `[data-model-list]` (Task 4 fills it). Wire the gear button to `openModels()` (renders models view) and the back button to return to chat.
- `renderFallback()` / `renderError(modelId)`: restyle to the new classes; keep existing behavior (fallback surfaces the skill button; error offers retry-on-Light).
- Header wiring: add new-chat (`ICON.plus` → `onNewChat()` which for now resets the in-memory `history` array + re-renders an empty `renderReady()`), gear (`ICON.gear` → `openModels()`), close (existing). Show these only in the chat/models views.

- [ ] **Step 3: Build + browser smoke**

Run:
```bash
npm run build
```
Expected: exit 0.

Then `npm run preview`, open a lesson, open the panel, and confirm the panel matches the mockup (consent cards, ring while downloading, chat bubbles + header controls), in BOTH light and dark theme, and as a bottom sheet at 375px. Bubbles are plain text for now (markdown is Task 2). No console errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/LocalAI/ChatPanel.astro src/components/LocalAI/chat-ui.ts
git commit -m "Redesign local AI panel: global styling + mockup structure"
```

---

### Task 2: `markdown.ts` — render assistant replies

**Files:**
- Create: `src/components/LocalAI/markdown.ts`
- Modify: `src/components/LocalAI/chat-ui.ts` (assistant bubbles use `renderMarkdown`)

**Interfaces:**
- Produces: `export function renderMarkdown(src: string): string` (safe HTML).
- Consumes: the `.lai-bubble.lai-a` structure from Task 1.

- [ ] **Step 1: Create the renderer**

Create `src/components/LocalAI/markdown.ts`:
```ts
/**
 * Minimal, XSS-safe markdown renderer for assistant replies. Strategy:
 * escape ALL HTML first, then add only our own safe tags — no raw HTML from
 * the model can survive. Supports fenced + inline code, bold, italic, links
 * (safe schemes only), unordered/ordered lists, h1-h3, paragraphs, <br>.
 * Streaming-safe: call it on the accumulated text each chunk.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SAFE_SCHEME = /^(https?:\/\/|mailto:|\/|#)/i;

function inline(s: string): string {
  // s is already HTML-escaped.
  s = s.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, url) => {
    const href = SAFE_SCHEME.test(url) ? url : '#';
    return `<a href="${href}" target="_blank" rel="noopener nofollow">${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_/g, '$1<em>$2</em>');
  return s;
}

function renderBlocks(text: string): string {
  const lines = text.split('\n');
  let out = '';
  let i = 0;
  let para: string[] = [];
  const flush = () => { if (para.length) { out += `<p>${inline(para.join('<br>'))}</p>`; para = []; } };
  while (i < lines.length) {
    const line = lines[i];
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) { flush(); out += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`; i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      flush(); const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`); i++; }
      out += `<ul>${items.join('')}</ul>`; continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flush(); const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`); i++; }
      out += `<ol>${items.join('')}</ol>`; continue;
    }
    if (line.trim() === '') { flush(); i++; continue; }
    para.push(line); i++;
  }
  flush();
  return out;
}

export function renderMarkdown(src: string): string {
  const escaped = escapeHtml(src);
  const parts = escaped.split(/```/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      // fenced code: drop an optional leading language line, trim outer newlines
      let code = parts[i].replace(/^([^\n]*)\n/, (m, first) => (/^\w*$/.test(first.trim()) ? '' : m));
      code = code.replace(/^\n+/, '').replace(/\n+$/, '');
      html += `<pre><code>${code}</code></pre>`;
    } else {
      html += renderBlocks(parts[i]);
    }
  }
  return html;
}
```

- [ ] **Step 2: Sanity + XSS check (throwaway, not committed)**

Run (mirrors the module logic):
```bash
node --input-type=module -e "
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
console.assert(esc('<img onerror=x>').includes('&lt;img'),'escapes html');
console.assert('**a**'.replace(/\*\*([^*]+)\*\*/g,'<strong>\$1</strong>')==='<strong>a</strong>','bold');
console.log('ok');
"
```
Expected: `ok`. (The real XSS check: in the browser, an assistant reply containing `<script>alert(1)</script>` must render as visible inert text, never execute — verify in Task 6's smoke.)

- [ ] **Step 3: Use it for assistant bubbles**

In `chat-ui.ts`: where an assistant bubble's content is set, use `renderMarkdown`. Import it:
```ts
import { renderMarkdown } from './markdown';
```
In `appendBubble`, render assistant content as markdown, user content as plain text:
```ts
  private appendBubble(role: 'user' | 'assistant', text: string): HTMLElement {
    const list = this.body.querySelector('[data-messages]') as HTMLElement;
    const bubble = document.createElement('div');
    bubble.className = `lai-bubble lai-${role === 'user' ? 'u' : 'a'}`;
    if (role === 'assistant') bubble.innerHTML = renderMarkdown(text);
    else bubble.textContent = text;
    list.appendChild(bubble);
    list.scrollTop = list.scrollHeight;
    return bubble;
  }
```
In the streaming loop in `send()`, replace `replyBubble.textContent = full;` with `replyBubble.innerHTML = renderMarkdown(full);` (keep the "thinking" placeholder as `textContent` until the first token arrives).

- [ ] **Step 4: Build + commit**
```bash
npm run build
git add src/components/LocalAI/markdown.ts src/components/LocalAI/chat-ui.ts
git commit -m "Render assistant replies as markdown (hand-rolled, XSS-safe)"
```
Expected: build exit 0.

---

### Task 3: `history.ts` — per-lesson conversation persistence

**Files:**
- Create: `src/components/LocalAI/history.ts`
- Modify: `src/components/LocalAI/chat-ui.ts` (load on enter, save per turn, new-chat clears)

**Interfaces:**
- Produces:
  - `export type ChatMsg = { role: 'user' | 'assistant'; content: string }`
  - `export function historyKey(pathname: string): string`
  - `export function loadHistory(pathname: string): ChatMsg[]`
  - `export function saveHistory(pathname: string, msgs: ChatMsg[]): void`
  - `export function clearHistory(pathname: string): void`
- Consumes: the `history` array + `appendBubble` from earlier tasks.

- [ ] **Step 1: Create the module**

Create `src/components/LocalAI/history.ts`:
```ts
/**
 * Per-lesson conversation persistence in localStorage. Each lesson path has
 * its own thread, capped to the last 50 messages. All access is guarded so a
 * disabled/full localStorage never breaks the chat.
 */
export type ChatMsg = { role: 'user' | 'assistant'; content: string };

const PREFIX = 'aiguide:localai:chat:';
const MAX = 50;

export function historyKey(pathname: string): string {
  return PREFIX + pathname.replace(/\/+$/, '') + '/';
}

export function loadHistory(pathname: string): ChatMsg[] {
  try {
    const raw = localStorage.getItem(historyKey(pathname));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMsg =>
        m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    );
  } catch {
    return [];
  }
}

export function saveHistory(pathname: string, msgs: ChatMsg[]): void {
  try {
    localStorage.setItem(historyKey(pathname), JSON.stringify(msgs.slice(-MAX)));
  } catch {
    /* quota or unavailable: ignore */
  }
}

export function clearHistory(pathname: string): void {
  try {
    localStorage.removeItem(historyKey(pathname));
  } catch {
    /* ignore */
  }
}
```

- [ ] **Step 2: Wire persistence into chat-ui.ts**

Import:
```ts
import { loadHistory, saveHistory, clearHistory, type ChatMsg } from './history';
```
Make the in-memory history use `ChatMsg` (it already is `{role,content}` — align the type). In `renderReady()`, after building the message list, load and replay the lesson's thread:
```ts
    // Restore this lesson's saved conversation.
    this.history = loadHistory(location.pathname);
    for (const m of this.history) this.appendBubble(m.role, m.content);
```
In `send()`, after pushing the user message AND after pushing the assistant reply, persist:
```ts
    // (after this.history.push for the user message)
    saveHistory(location.pathname, this.history);
    // (after this.history.push for the assistant reply, at the end of streaming)
    saveHistory(location.pathname, this.history);
```
Wire `onNewChat()` (the header new-chat button from Task 1) to clear both memory and storage:
```ts
  private onNewChat() {
    clearHistory(location.pathname);
    this.history = [];
    this.renderReady();
  }
```
(Exercise mode: when an exercise is running, its silent trigger turn is `display:false` but still pushed to history — acceptable; the saved thread resumes mid-exercise. Keep `activeExerciseBlock` in memory only, not persisted.)

- [ ] **Step 3: Build + verify + commit**
```bash
npm run build
```
Manual check (preview): chat on a lesson, reload → the conversation is restored; "New chat" empties it; a different lesson shows its own (empty or separate) thread; `localStorage['aiguide:localai:chat:/en/fundamentals/what-is-ai/']` holds the messages.
```bash
git add src/components/LocalAI/history.ts src/components/LocalAI/chat-ui.ts
git commit -m "Persist per-lesson chat history in localStorage"
```

---

### Task 4: `model-cache.ts` — model manager (status / switch / delete)

**Files:**
- Create: `src/components/LocalAI/model-cache.ts`
- Modify: `src/components/LocalAI/chat-ui.ts` (populate models view; switch + dispose; delete)

**Interfaces:**
- Produces:
  - `export type CacheStatus = 'active' | 'cached' | 'idle'`
  - `export async function getStatuses(modelIds: string[], activeId: string | null): Promise<Record<string, CacheStatus>>`
  - `export async function deleteModel(modelId: string): Promise<void>`
- Consumes: the models-view scaffold + `getEngine`/engine singleton from earlier tasks.

- [ ] **Step 1: Create the module**

Create `src/components/LocalAI/model-cache.ts`:
```ts
/**
 * Per-model cache status + deletion, lazily importing web-llm's cache helpers
 * so nothing AI-related loads before consent. Status: active (the loaded
 * model), cached (downloaded, in browser cache), idle (not downloaded).
 */
export type CacheStatus = 'active' | 'cached' | 'idle';

export async function getStatuses(
  modelIds: string[],
  activeId: string | null,
): Promise<Record<string, CacheStatus>> {
  const result: Record<string, CacheStatus> = {};
  let has: ((id: string) => Promise<boolean>) | null = null;
  try {
    const mod = await import('@mlc-ai/web-llm');
    has = mod.hasModelInCache as (id: string) => Promise<boolean>;
  } catch {
    has = null;
  }
  await Promise.all(
    modelIds.map(async (id) => {
      if (id === activeId) { result[id] = 'active'; return; }
      if (!has) { result[id] = 'idle'; return; }
      try { result[id] = (await has(id)) ? 'cached' : 'idle'; }
      catch { result[id] = 'idle'; }
    }),
  );
  return result;
}

export async function deleteModel(modelId: string): Promise<void> {
  const mod = await import('@mlc-ai/web-llm');
  const del = mod.deleteModelAllInfoInCache as (id: string) => Promise<void>;
  await del(modelId);
}
```

- [ ] **Step 2: Add engine disposal for switching**

In `chat-ui.ts`, track the worker and add a disposer at module scope:
```ts
let activeWorker: Worker | null = null;
```
In `getEngine`, capture the worker so it can be terminated later:
```ts
  enginePromise = (async () => {
    const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
    const worker = new Worker(new URL('./chat-worker.ts', import.meta.url), { type: 'module' });
    activeWorker = worker;
    return CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback: onProgress });
  })();
```
Add:
```ts
async function disposeEngine(): Promise<void> {
  try { const eng = await enginePromise; await eng?.unload?.(); } catch { /* ignore */ }
  try { activeWorker?.terminate(); } catch { /* ignore */ }
  activeWorker = null;
  enginePromise = null;
  activeModelId = null;
}
```

- [ ] **Step 3: Populate the models view + switch + delete**

Import:
```ts
import { getStatuses, deleteModel, type CacheStatus } from './model-cache';
```
Implement `renderModels()` (replacing the Task 1 scaffold body): render one `.lai-model` row per `this.models`, with a status pill from `getStatuses(this.models.map(m=>m.id), activeModelId)`, and actions:
- active → `Active` pill, no buttons.
- cached, not active → `Use` button (switch) + `Delete` button.
- idle → `Download` button (switch).
Switch handler:
```ts
  private async switchModel(modelId: string) {
    this.setConsentedModel(modelId);
    await disposeEngine();
    this.startDownload(modelId); // shows the ring; back to chat on ready
  }
```
Delete handler (only for cached, non-active):
```ts
  private async removeModel(modelId: string) {
    try { await deleteModel(modelId); } catch (e) { console.error('[LocalAI] delete failed', e); }
    this.renderModels(); // refresh statuses
  }
```
Render statuses asynchronously: render rows in a loading state, then update once `getStatuses` resolves (re-render the list). Keep the back button → returns to `renderReady()` (history intact).

Note: after a successful switch, `renderReady()` runs and reloads the lesson history (history is per-lesson, not per-model), so the conversation is preserved across a model switch.

- [ ] **Step 4: Build + verify + commit**
```bash
npm run build
```
Manual check (preview, with at least one model downloaded): open the gear → models view shows Active/Cached/Not-downloaded correctly; "Use" on another tier downloads+activates and frees the previous (verify no second WebGPU context lingers across two switches); "Delete" on a cached non-active model flips it to Not-downloaded.
```bash
git add src/components/LocalAI/model-cache.ts src/components/LocalAI/chat-ui.ts
git commit -m "Add model manager: cache status, switch, delete"
```

---

### Task 5: Update consent + privacy copy for persisted history

History now persists locally; the privacy page currently says messages are not saved between visits. Fix it (en + it).

**Files:**
- Modify: `src/content/docs/en/privacy.mdx`, `src/content/docs/it/privacy.mdx`

- [ ] **Step 1: English**

In `src/content/docs/en/privacy.mdx`, in "The local AI assistant" section, replace the sentence "Your messages are not saved between visits." (in the paragraph beginning "When you chat with it") with:
```mdx
Your conversations are saved on your device, in this browser's storage, one
thread per lesson, so you can pick a chat back up. They are never sent
anywhere, and you can wipe a lesson's chat any time with the "New chat"
button in the assistant.
```

- [ ] **Step 2: Italian**

In `src/content/docs/it/privacy.mdx`, in "L'assistente IA locale" section, replace "I tuoi messaggi non vengono salvati tra una visita e l'altra." with:
```mdx
Le tue conversazioni sono salvate sul tuo dispositivo, nella memoria di
questo browser, una per lezione, così puoi riprendere una chat. Non vengono
mai inviate altrove, e puoi cancellare la chat di una lezione quando vuoi
col pulsante "Nuova chat" nell'assistente.
```

- [ ] **Step 3: Em-dash check, build, commit**
```bash
grep -n "—" src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx && echo "EM DASH (fix)" || echo "clean"
npm run build
git add src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx
git commit -m "Privacy: note that chat history is saved locally per lesson"
```
Expected: no em dash; build exit 0.

---

### Task 6: CLAUDE.md + final verification

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update the LocalAI note**

In `CLAUDE.md`, in the "Assistente IA locale (in-browser)" section, append:
```markdown
UI del pannello: `ChatPanel.astro` usa `<style is:global>` con selettori
prefissati `local-ai ` (gli elementi creati a runtime da `chat-ui.ts` non
ricevono il `data-astro-cid` dello scoping, come per `Search.astro`). Le
risposte sono renderizzate in markdown da `markdown.ts` (escape-then-format,
XSS-safe). Lo storico è per-lezione in `localStorage['aiguide:localai:chat:<path>']`
(via `history.ts`, cap 50 messaggi), col pulsante "Nuova chat" che lo svuota.
Il gestore modelli (`model-cache.ts`) mostra stato per modello
(attivo/in cache/non scaricato) via `hasModelInCache`, permette switch
(con dispose del worker precedente) e delete dalla cache via
`deleteModelAllInfoInCache`.
```

- [ ] **Step 2: Full verification (clean build) + commit**
```bash
rm -rf dist .astro && npm run build > /tmp/uxbuild.log 2>&1; echo "EXIT $?"; tail -3 /tmp/uxbuild.log
git add CLAUDE.md
git commit -m "Document the local AI panel redesign in CLAUDE.md"
```
Expected: EXIT 0.

- [ ] **Step 3: Manual smoke (preview) — Definition of Done**

`npm run preview`, then on a lesson (light + dark, and 375px):
- Panel matches the mockup across Consent / Downloading / Chat / Models.
- Assistant replies render markdown; a reply containing `<script>alert(1)</script>` shows as inert text (no execution) — paste-test by asking the model to "reply with literally: `<script>alert(1)</script>`".
- Reopen on a lesson → conversation restored; "New chat" clears it; another lesson has its own thread.
- Models view: correct statuses; switch downloads+activates+frees old; delete flips a cached non-active model to not-downloaded.
- Consent gating unchanged; RAG cross-lesson answer still works; exercise still runs.
- No console errors (the `/sa/proxy.js` 404 is the known, environment-only exception).

---

## Self-review

**Spec coverage:**
- Redesign layout/formatting → Task 1 (incl. the is:global root-cause fix). ✓
- Richer download experience (ring) → Task 1. ✓
- Markdown chat → Task 2. ✓
- Per-lesson history in localStorage + new-chat → Task 3. ✓
- Model manager (status/switch/delete) + engine dispose → Task 4. ✓
- Privacy copy update → Task 5. ✓
- Honor Pastello/dark/responsive/reduced-motion → Task 1 constraints + Task 6 smoke. ✓
- Consent gating + RAG intact → constraint + Task 6 smoke. ✓
- CLAUDE.md → Task 6. ✓

**Placeholder scan:** No TBD/TODO. Task 1 references the committed mockup for exact CSS values (a complete, committed artifact) rather than re-transcribing it — deliberate for a visual port, not a placeholder. The throwaway Node check in Task 2 is marked not-committed.

**Type consistency:** `ChatMsg {role,content}` (Task 3) matches the existing in-memory `history` shape used by `appendBubble`/`send` and by `saveHistory`/`loadHistory`. `renderMarkdown(src:string):string` (Task 2) used in `appendBubble` + streaming. `CacheStatus`/`getStatuses`/`deleteModel` (Task 4) used by `renderModels`. `disposeEngine()` + `activeWorker` (Task 4) consistent with the existing `enginePromise`/`activeModelId`/`getEngine`. Class names (`lai-bubble lai-a/lai-u`, `lai-opt`, `lai-ring`, `lai-model`, `lai-pill`) consistent between the Task 1 CSS and the Task 2–4 DOM builders.
