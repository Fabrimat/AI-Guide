# Local in-browser AI assistant — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating chat panel that runs a small LLM entirely in the browser (no server, no API key), grounded in the current lesson, able to search other lessons and run a lesson's check-in exercise interactively, downloading the model only after explicit user consent.

**Architecture:** A Starlight component (`ChatPanel.astro`) rendered on every doc page by the existing `Footer.astro` override. A custom element (`<local-ai>`) driven by `chat-ui.ts` runs a state machine (idle → consent → downloading → ready / fallback). Inference runs in a Web Worker (`chat-worker.ts`) hosting `@mlc-ai/web-llm`'s `WebWorkerMLCEngineHandler`; the UI thread drives it through the `CreateWebWorkerMLCEngine` proxy. Three helper modules supply context: `lesson-context.ts` (current page prose), `search-context.ts` (Pagefind excerpts), `skill-loader.ts` (the lesson's `.txt` check-in). The engine is a module-level singleton so it survives Astro view transitions.

**Tech Stack:** Astro 6 + Starlight 0.38, TypeScript, `@mlc-ai/web-llm` (the only new dependency), Pagefind (already present via Starlight), WebGPU.

## Global Constraints

- New npm dependency limited to `@mlc-ai/web-llm`. No other new deps. (Pagefind ships with Starlight.)
- No backend, no API keys, no env vars. Must work on the static build (`output` is static / default).
- Consent is mandatory: nothing touches the network until the user clicks "Download & enable" on the consent screen.
- Do NOT modify any lesson `.mdx`. Do NOT change the LlmExercise Copy / Download / Open buttons.
- TypeScript throughout; avoid `any` unless truly unavoidable.
- Mobile-friendly at 375px viewport.
- No em dash (—) anywhere in user-facing copy. No AI/buzzword lexicon. Follow `.claude/skills/voice-guide/SKILL.md` for all visible strings (it + en).
- Use only existing CSS tokens (`--sl-color-*`, `--aig-*`). No new tokens, no hardcoded `#ffffff` / `rgba(42,36,71,…)`.
- Commit messages in English, concise body, NO `Co-Authored-By` trailer.
- Model ids (web-llm prebuilt): Light `Qwen2.5-0.5B-Instruct-q4f16_1-MLC`, Better `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`, Best `Qwen2.5-3B-Instruct-q4f16_1-MLC`.
- localStorage key: `aiguide:localai:consent` (value = chosen model id; presence = consented).

### Testing approach (read first)

This project has **no test runner** and the constraints forbid adding one. The smoke test is `npm run build` (must pass clean). Behaviour that needs the browser (WebGPU, streaming, Pagefind) is verified manually against `npm run preview` — note that **Pagefind and the PWA only exist in a built site**, not in `npm run dev`. Where a module has pure logic (token budgeting, text cleaning), the plan includes a throwaway Node check you run from the scratchpad; do not commit those. Optional: the Playwright MCP is available in this environment for automated DOM checks of the launcher/panel.

Each task ends with: `npm run build` green + the stated manual check + a commit.

---

### Task 1: Scaffolding — dependency, i18n strings, panel shell, launcher, Footer wiring, WebGPU fallback

Delivers a floating button on every doc page that opens/closes a themed panel. With WebGPU present it shows a "consent coming" placeholder; without WebGPU it shows the fallback message. No model, no network. Survives view transitions.

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `src/i18n/ui.ts` (add `localAi*` keys to `UIStrings` + both locales)
- Create: `src/components/LocalAI/ChatPanel.astro`
- Create: `src/components/LocalAI/chat-ui.ts`
- Modify: `src/components/Footer.astro` (render `<ChatPanel />`)

**Interfaces:**
- Produces: custom element `<local-ai>` with dataset contract:
  - `data-locale`: `"en" | "it"`
  - `data-privacy-href`: string (e.g. `/en/privacy/`)
  - `data-models`: JSON `Array<{ id: string; tier: 'light'|'better'|'best'; label: string; size: string; vram: string; warn?: string }>`
  - `data-i18n`: JSON object of all `localAi*` strings
- Produces (chat-ui.ts module scope, used by later tasks):
  - `let enginePromise: Promise<MLCEngineInterface> | null`
  - `let activeModelId: string | null`
  - class `LocalAI extends HTMLElement` with methods later tasks extend: `private setView(view: View)`, `private showFallback()`.
  - type `View = 'closed' | 'fallback' | 'consent' | 'downloading' | 'ready' | 'error'`

- [ ] **Step 1: Add the dependency**

Run:
```bash
npm install @mlc-ai/web-llm@^0.2.79
```
Expected: `package.json` `dependencies` gains `"@mlc-ai/web-llm"`. (Use the version npm resolves; `^0.2.79` floor is fine. Do not pin exactly unless install fails.)

- [ ] **Step 2: Add i18n strings**

In `src/i18n/ui.ts`, add these keys to the `UIStrings` interface (after the `// LlmExercise` block, before `// ChatDemo`):

```ts
  // LocalAI (in-browser assistant)
  localAiLauncherLabel: string;
  localAiLauncherAria: string;
  localAiPanelTitle: string;
  localAiClose: string;
  localAiConsentHeading: string;
  localAiConsentBody: string;       // explains local + one-time CDN download
  localAiConsentPrivacy: string;    // short privacy line
  localAiConsentPrivacyLink: string;
  localAiModelLightLabel: string;
  localAiModelBetterLabel: string;
  localAiModelBestLabel: string;
  localAiModelBestWarn: string;     // GPU warning shown under "Best"
  localAiConsentConfirm: string;    // "Download & enable"
  localAiDownloading: string;       // status while weights download
  localAiInputPlaceholder: string;
  localAiSend: string;
  localAiThinking: string;          // status while generating
  localAiStartExercise: string;
  localAiNoWebgpuTitle: string;
  localAiNoWebgpuBody: string;      // points to the buttons below
  localAiErrorTitle: string;
  localAiErrorBody: string;
  localAiRetryLight: string;
  localAiDisclaimer: string;        // "answers are local, can be wrong"
```

In the same file, add the English values inside `STRINGS.en` (place the block in the same position relative to the other groups):

```ts
    localAiLauncherLabel: 'Ask the local AI',
    localAiLauncherAria: 'Open the local AI assistant',
    localAiPanelTitle: 'Local AI assistant',
    localAiClose: 'Close',
    localAiConsentHeading: 'Run a small AI here, on your device',
    localAiConsentBody:
      'This assistant runs in your browser. The first time, it downloads a model file once from an external provider (Hugging Face). After that it works offline and nothing you type leaves your device.',
    localAiConsentPrivacy: 'Your messages stay in this browser. They are never sent to me or to any server.',
    localAiConsentPrivacyLink: 'Read the privacy page',
    localAiModelLightLabel: 'Light · about 0.4 GB · fast, basic answers',
    localAiModelBetterLabel: 'Better · about 1.1 GB · slower to load, better Italian',
    localAiModelBestLabel: 'Best · about 1.9 GB · best answers',
    localAiModelBestWarn: 'Needs a strong graphics card. It will not load on most phones.',
    localAiConsentConfirm: 'Download and enable',
    localAiDownloading: 'Downloading the model, one time only',
    localAiInputPlaceholder: 'Ask about this lesson',
    localAiSend: 'Send',
    localAiThinking: 'Thinking',
    localAiStartExercise: 'Start the exercise',
    localAiNoWebgpuTitle: 'Local AI is not available in this browser',
    localAiNoWebgpuBody:
      'Your browser cannot run AI on the device. Use the buttons in the lesson to open the exercise in Claude, ChatGPT, or Gemini instead.',
    localAiErrorTitle: 'The model could not start',
    localAiErrorBody:
      'Your device may not have enough memory for this model. Try the lightest one, or use the buttons in the lesson to open an external AI.',
    localAiRetryLight: 'Try the Light model',
    localAiDisclaimer: 'Answers are generated here on your device and can be wrong.',
```

Add the Italian values inside `STRINGS.it` (voice-guide compliant, no em dash):

```ts
    localAiLauncherLabel: "Chiedi all'IA locale",
    localAiLauncherAria: "Apri l'assistente IA locale",
    localAiPanelTitle: 'Assistente IA locale',
    localAiClose: 'Chiudi',
    localAiConsentHeading: 'Fai girare una piccola IA qui, sul tuo dispositivo',
    localAiConsentBody:
      "Questo assistente gira nel tuo browser. La prima volta scarica un file del modello, una volta sola, da un fornitore esterno (Hugging Face). Dopo funziona offline e niente di quello che scrivi esce dal tuo dispositivo.",
    localAiConsentPrivacy: 'I tuoi messaggi restano in questo browser. Non vengono mai inviati a me né a un server.',
    localAiConsentPrivacyLink: 'Leggi la pagina sulla privacy',
    localAiModelLightLabel: 'Leggero · circa 0,4 GB · veloce, risposte basilari',
    localAiModelBetterLabel: 'Migliore · circa 1,1 GB · più lento da caricare, italiano migliore',
    localAiModelBestLabel: 'Massimo · circa 1,9 GB · risposte migliori',
    localAiModelBestWarn: 'Richiede una scheda grafica potente. Sulla maggior parte dei telefoni non si carica.',
    localAiConsentConfirm: 'Scarica e attiva',
    localAiDownloading: 'Sto scaricando il modello, solo questa volta',
    localAiInputPlaceholder: 'Chiedi qualcosa su questa lezione',
    localAiSend: 'Invia',
    localAiThinking: 'Sto pensando',
    localAiStartExercise: "Inizia l'esercizio",
    localAiNoWebgpuTitle: "L'IA locale non è disponibile in questo browser",
    localAiNoWebgpuBody:
      "Il tuo browser non può far girare l'IA sul dispositivo. Usa i pulsanti nella lezione per aprire l'esercizio in Claude, ChatGPT o Gemini.",
    localAiErrorTitle: 'Il modello non è partito',
    localAiErrorBody:
      "Il tuo dispositivo potrebbe non avere memoria a sufficienza per questo modello. Prova il più leggero, oppure usa i pulsanti nella lezione per aprire un'IA esterna.",
    localAiRetryLight: 'Prova il modello leggero',
    localAiDisclaimer: "Le risposte sono generate qui sul tuo dispositivo e possono contenere errori.",
```

- [ ] **Step 3: Create the panel component shell**

Create `src/components/LocalAI/ChatPanel.astro`:

```astro
---
/**
 * Local in-browser AI assistant.
 *
 * Floating launcher (bottom-right) + side drawer / bottom sheet. The
 * model runs entirely in the browser via @mlc-ai/web-llm in a Web
 * Worker; nothing is downloaded or sent until the reader consents on
 * the consent screen. Rendered once per page by Footer.astro.
 *
 * All UI strings and config are server-rendered and handed to the
 * client custom element (`<local-ai>`) via data-* attributes, the same
 * pattern as Search.astro / LlmExercise.astro.
 */
import { t, getLocale } from '../../i18n/ui';

const ui = t(Astro.currentLocale);
const locale = getLocale(Astro.currentLocale);
const privacyHref = `/${locale}/privacy/`;

const models = [
  { id: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC', tier: 'light',  label: ui.localAiModelLightLabel,  size: '0.4 GB', vram: '0.95 GB' },
  { id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC', tier: 'better', label: ui.localAiModelBetterLabel, size: '1.1 GB', vram: '1.6 GB'  },
  { id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',   tier: 'best',   label: ui.localAiModelBestLabel,   size: '1.9 GB', vram: '2.5 GB', warn: ui.localAiModelBestWarn },
] as const;

const i18n = {
  panelTitle: ui.localAiPanelTitle,
  close: ui.localAiClose,
  consentHeading: ui.localAiConsentHeading,
  consentBody: ui.localAiConsentBody,
  consentPrivacy: ui.localAiConsentPrivacy,
  consentPrivacyLink: ui.localAiConsentPrivacyLink,
  consentConfirm: ui.localAiConsentConfirm,
  downloading: ui.localAiDownloading,
  inputPlaceholder: ui.localAiInputPlaceholder,
  send: ui.localAiSend,
  thinking: ui.localAiThinking,
  startExercise: ui.localAiStartExercise,
  noWebgpuTitle: ui.localAiNoWebgpuTitle,
  noWebgpuBody: ui.localAiNoWebgpuBody,
  errorTitle: ui.localAiErrorTitle,
  errorBody: ui.localAiErrorBody,
  retryLight: ui.localAiRetryLight,
  disclaimer: ui.localAiDisclaimer,
};
---

<local-ai
  data-locale={locale}
  data-privacy-href={privacyHref}
  data-models={JSON.stringify(models)}
  data-i18n={JSON.stringify(i18n)}
>
  <button type="button" class="lai-launcher" aria-expanded="false" aria-label={ui.localAiLauncherAria}>
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
    <span class="lai-launcher-text">{ui.localAiLauncherLabel}</span>
  </button>

  <section class="lai-panel" role="dialog" aria-label={ui.localAiPanelTitle} aria-modal="false" hidden>
    <header class="lai-head">
      <h2>{ui.localAiPanelTitle}</h2>
      <button type="button" class="lai-close" aria-label={ui.localAiClose} data-close>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </header>
    <div class="lai-body" data-body></div>
  </section>
</local-ai>

<script>
  import './chat-ui.ts';
</script>

<style>
  local-ai { display: contents; }

  .lai-launcher {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 80;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1rem;
    border: 0;
    border-radius: 999px;
    background: var(--sl-color-accent);
    color: var(--sl-color-text-invert);
    font-family: var(--sl-font);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(var(--aig-shadow-color), 0.22);
    transition: background 0.15s ease, transform 0.15s ease;
  }
  .lai-launcher:hover { background: var(--sl-color-accent-high); }
  .lai-launcher:focus-visible { outline: 2px solid var(--sl-color-accent); outline-offset: 2px; }

  .lai-panel {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 81;
    width: 380px;
    max-width: calc(100vw - 2rem);
    height: min(620px, calc(100vh - 2rem));
    display: flex;
    flex-direction: column;
    background: var(--aig-elevated-bg);
    border: 1px solid var(--sl-color-hairline);
    border-radius: 1rem;
    box-shadow: 0 12px 40px rgba(var(--aig-shadow-color), 0.2);
    overflow: hidden;
  }
  .lai-panel[hidden] { display: none; }

  .lai-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--sl-color-hairline);
  }
  .lai-head h2 { margin: 0; font-size: 1.05rem; }
  .lai-close {
    display: inline-flex;
    width: 2rem; height: 2rem;
    align-items: center; justify-content: center;
    border: 0; border-radius: 999px;
    background: transparent; color: var(--sl-color-text);
    cursor: pointer;
  }
  .lai-close:hover { background: var(--aig-hover-wash); }

  .lai-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  /* Mobile: full-width bottom sheet */
  @media (max-width: 30rem) {
    .lai-launcher-text { display: none; }
    .lai-launcher { padding: 0.8rem; }
    .lai-panel {
      right: 0; left: 0; bottom: 0;
      width: 100%;
      max-width: 100%;
      height: 85vh;
      border-radius: 1rem 1rem 0 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lai-launcher { transition: none; }
  }
</style>
```

- [ ] **Step 4: Create the client controller (shell only)**

Create `src/components/LocalAI/chat-ui.ts`:

```ts
/**
 * Client controller for the local AI assistant. Custom element
 * `<local-ai>`; mirrors the Search.astro pattern (idempotent
 * connectedCallback, module-level singletons that survive view
 * transitions). This task wires open/close, WebGPU detection and the
 * fallback view only. Later tasks add consent, the engine and chat.
 */
import type { MLCEngineInterface } from '@mlc-ai/web-llm';

// Survives Astro view transitions (page swaps don't reload JS).
let enginePromise: Promise<MLCEngineInterface> | null = null;
let activeModelId: string | null = null;

type View = 'closed' | 'fallback' | 'consent' | 'downloading' | 'ready' | 'error';

interface ModelTier {
  id: string;
  tier: 'light' | 'better' | 'best';
  label: string;
  size: string;
  vram: string;
  warn?: string;
}

interface I18n {
  panelTitle: string; close: string;
  consentHeading: string; consentBody: string; consentPrivacy: string;
  consentPrivacyLink: string; consentConfirm: string; downloading: string;
  inputPlaceholder: string; send: string; thinking: string; startExercise: string;
  noWebgpuTitle: string; noWebgpuBody: string;
  errorTitle: string; errorBody: string; retryLight: string; disclaimer: string;
}

const CONSENT_KEY = 'aiguide:localai:consent';

class LocalAI extends HTMLElement {
  private locale = 'en';
  private privacyHref = '/en/privacy/';
  private models: ModelTier[] = [];
  private i18n!: I18n;

  private launcher!: HTMLButtonElement;
  private panel!: HTMLElement;
  private body!: HTMLElement;

  connectedCallback() {
    if (this.dataset.wired === 'true') return;
    this.dataset.wired = 'true';

    this.locale = this.dataset.locale === 'it' ? 'it' : 'en';
    this.privacyHref = this.dataset.privacyHref || '/en/privacy/';
    try { this.models = JSON.parse(this.dataset.models || '[]'); } catch { this.models = []; }
    try { this.i18n = JSON.parse(this.dataset.i18n || '{}'); } catch { this.i18n = {} as I18n; }

    this.launcher = this.querySelector('.lai-launcher') as HTMLButtonElement;
    this.panel = this.querySelector('.lai-panel') as HTMLElement;
    this.body = this.querySelector('[data-body]') as HTMLElement;

    this.launcher.addEventListener('click', () => this.toggle());
    this.querySelector('[data-close]')?.addEventListener('click', () => this.close());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.panel.hidden) this.close();
    });
  }

  private toggle() {
    if (this.panel.hidden) this.open();
    else this.close();
  }

  private open() {
    this.panel.hidden = false;
    this.launcher.setAttribute('aria-expanded', 'true');
    if (!('gpu' in navigator)) { this.showFallback(); return; }
    // Later tasks: consent / downloading / ready routing goes here.
    this.setView('consent');
  }

  private close() {
    this.panel.hidden = true;
    this.launcher.setAttribute('aria-expanded', 'false');
  }

  private showFallback() {
    this.setView('fallback');
  }

  // Renders the body for a given view. Later tasks fill in each branch.
  private setView(view: View) {
    if (view === 'fallback') {
      this.body.innerHTML = '';
      const h = document.createElement('p');
      h.className = 'lai-msg-title';
      h.textContent = this.i18n.noWebgpuTitle;
      const p = document.createElement('p');
      p.textContent = this.i18n.noWebgpuBody;
      this.body.append(h, p);
      return;
    }
    if (view === 'consent') {
      // Placeholder until Task 3; keeps the panel non-empty.
      this.body.textContent = this.i18n.consentHeading;
      return;
    }
  }
}

function define() {
  if (!customElements.get('local-ai')) customElements.define('local-ai', LocalAI);
}
define();
document.addEventListener('astro:page-load', define);
```

- [ ] **Step 5: Wire the panel into the Footer**

In `src/components/Footer.astro`, add the import after the `ShareLesson` import (line 15):

```astro
import ChatPanel from './LocalAI/ChatPanel.astro';
```

Then render it once, immediately after the closing `</nav>` of the crawler index at the end of the file (it is `position: fixed`, so placement is cosmetic):

```astro
<ChatPanel />
```

- [ ] **Step 6: Build and verify**

Run:
```bash
npm run build
```
Expected: build completes with no errors. `_astro/` contains a chat-ui chunk.

Then:
```bash
npm run preview
```
Manual checks (open `http://localhost:4321/en/fundamentals/what-is-ai/`):
- Floating "Ask the local AI" button appears bottom-right.
- Click opens the panel; header shows the title + close button; Escape and the X close it.
- In DevTools console, run `delete navigator.gpu` is not possible, so to confirm the fallback path: temporarily set a breakpoint or trust the code path — the WebGPU branch is exercised in Task 4. (No blocking check here.)
- Toggle dark mode: panel + launcher recolor via tokens.
- At 375px width (responsive mode), the launcher collapses to the icon and the panel becomes a full-width bottom sheet.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/i18n/ui.ts src/components/LocalAI/ChatPanel.astro src/components/LocalAI/chat-ui.ts src/components/Footer.astro
git commit -m "Add local AI assistant scaffolding: launcher, panel shell, i18n"
```

---

### Task 2: `lesson-context.ts` — extract clean current-lesson prose

Pure DOM module that returns the lesson title and cleaned prose within a token budget, for the system prompt.

**Files:**
- Create: `src/components/LocalAI/lesson-context.ts`

**Interfaces:**
- Produces:
  - `export interface LessonContext { title: string; text: string }`
  - `export function extractLessonContext(budgetTokens?: number): LessonContext` (default budget 1500)
  - `export function estimateTokens(s: string): number`
  - `export function clampToTokenBudget(text: string, budgetTokens: number): string`

- [ ] **Step 1: Write the module**

Create `src/components/LocalAI/lesson-context.ts`:

```ts
/**
 * Extracts the current lesson's prose from the rendered DOM, stripped
 * of UI chrome, for use as the assistant's grounding context. Pure DOM
 * + string logic; no dependencies on other LocalAI modules.
 */
export interface LessonContext {
  title: string;
  text: string;
}

/** Rough token estimate: ~4 characters per token for mixed en/it prose. */
export function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}

/** Trim text to a token budget on a word boundary, no mid-word cut. */
export function clampToTokenBudget(text: string, budgetTokens: number): string {
  const maxChars = budgetTokens * 4;
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd();
}

export function extractLessonContext(budgetTokens = 1500): LessonContext {
  const main = document.querySelector('main .sl-markdown-content');
  const titleEl = document.querySelector('main h1, .sl-markdown-content h1');
  const title = (titleEl?.textContent || document.title || '').trim();

  if (!main) return { title, text: '' };

  // Clone so we can strip chrome without touching the live page.
  const clone = main.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll('.not-content, .llm-exercise, [hidden], script, style, nav, button')
    .forEach((el) => el.remove());

  const raw = clone.textContent || '';
  const text = raw.replace(/\s+/g, ' ').trim();
  return { title, text: clampToTokenBudget(text, budgetTokens) };
}
```

- [ ] **Step 2: Sanity-check the pure helpers (throwaway, not committed)**

Write to the scratchpad and run:
```bash
node --input-type=module -e "
const estimateTokens = (s) => Math.ceil(s.length/4);
const clamp = (t,b)=>{const m=b*4; if(t.length<=m) return t; const s=t.slice(0,m); const i=s.lastIndexOf(' '); return (i>0?s.slice(0,i):s).trimEnd();};
console.assert(estimateTokens('abcd')===1, 'estimate');
console.assert(clamp('one two three', 1)==='one', 'clamp word boundary: '+clamp('one two three',1));
console.assert(clamp('short', 100)==='short', 'no clamp');
console.log('ok');
"
```
Expected: prints `ok` with no assertion errors.

- [ ] **Step 3: Build**

Run:
```bash
npm run build
```
Expected: clean (module is tree-shaken until imported, but must type-check).

- [ ] **Step 4: Commit**

```bash
git add src/components/LocalAI/lesson-context.ts
git commit -m "Add lesson-context extractor for local AI"
```

---

### Task 3: Consent screen + model picker + persistence

Renders the consent screen with the three model tiers, persists the chosen model id, and routes returning (already-consented) visitors past it. Still no engine.

**Files:**
- Modify: `src/components/LocalAI/chat-ui.ts`

**Interfaces:**
- Consumes: `models`, `i18n`, `CONSENT_KEY`, `privacyHref` (Task 1).
- Produces (used by Task 4):
  - `private startDownload(modelId: string): void` — stub here, real impl in Task 4
  - `private getConsentedModel(): string | null`
  - `private renderConsent(): void`

- [ ] **Step 1: Add consent helpers and rendering**

In `chat-ui.ts`, replace the `open()` method and the `consent` branch of `setView()` with the routing + consent rendering below. Add the new methods to the class.

Replace `open()`:
```ts
  private open() {
    this.panel.hidden = false;
    this.launcher.setAttribute('aria-expanded', 'true');
    if (!('gpu' in navigator)) { this.showFallback(); return; }
    const consented = this.getConsentedModel();
    if (consented) this.startDownload(consented);
    else this.renderConsent();
  }
```

Add these methods to the class:
```ts
  private getConsentedModel(): string | null {
    try {
      const v = localStorage.getItem(CONSENT_KEY);
      return v && this.models.some((m) => m.id === v) ? v : null;
    } catch { return null; }
  }

  private setConsentedModel(id: string) {
    try { localStorage.setItem(CONSENT_KEY, id); } catch { /* ignore */ }
  }

  private renderConsent() {
    this.body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'lai-consent';

    const h = document.createElement('p');
    h.className = 'lai-msg-title';
    h.textContent = this.i18n.consentHeading;

    const body = document.createElement('p');
    body.textContent = this.i18n.consentBody;

    const form = document.createElement('form');
    form.className = 'lai-model-picker';

    this.models.forEach((m, i) => {
      const id = `lai-model-${m.tier}`;
      const row = document.createElement('label');
      row.className = 'lai-model-row';
      row.setAttribute('for', id);

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'lai-model';
      radio.id = id;
      radio.value = m.id;
      if (i === 0) radio.checked = true;

      const text = document.createElement('span');
      text.className = 'lai-model-text';
      const label = document.createElement('span');
      label.className = 'lai-model-label';
      label.textContent = m.label;
      text.appendChild(label);
      if (m.warn) {
        const warn = document.createElement('span');
        warn.className = 'lai-model-warn';
        warn.textContent = m.warn;
        text.appendChild(warn);
      }
      row.append(radio, text);
      form.appendChild(row);
    });

    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.className = 'lai-btn lai-btn-primary';
    confirm.textContent = this.i18n.consentConfirm;
    confirm.addEventListener('click', () => {
      const chosen = form.querySelector<HTMLInputElement>('input[name="lai-model"]:checked');
      const id = chosen?.value || this.models[0]?.id;
      if (!id) return;
      this.setConsentedModel(id);
      this.startDownload(id);
    });

    const privacy = document.createElement('p');
    privacy.className = 'lai-consent-privacy';
    privacy.textContent = this.i18n.consentPrivacy + ' ';
    const link = document.createElement('a');
    link.href = this.privacyHref;
    link.textContent = this.i18n.consentPrivacyLink;
    privacy.appendChild(link);

    wrap.append(h, body, form, confirm, privacy);
    this.body.appendChild(wrap);
  }

  // Real implementation in Task 4.
  private startDownload(modelId: string) {
    this.body.textContent = this.i18n.downloading + ' (' + modelId + ')';
  }
```

Remove the now-dead `consent` branch from `setView()` (leave only the `fallback` branch; `setView` stays for fallback/error use).

- [ ] **Step 2: Add consent + shared button styles**

Append to the `<style>` block in `ChatPanel.astro`:
```css
  .lai-msg-title { margin: 0; font-weight: 600; font-size: 1.05rem; }
  .lai-consent { display: flex; flex-direction: column; gap: 0.75rem; }
  .lai-model-picker { display: flex; flex-direction: column; gap: 0.5rem; }
  .lai-model-row {
    display: flex; gap: 0.6rem; align-items: flex-start;
    padding: 0.7rem 0.8rem;
    border: 1px solid var(--sl-color-hairline);
    border-radius: 0.6rem;
    cursor: pointer;
  }
  .lai-model-row:hover { border-color: var(--sl-color-accent); }
  .lai-model-row input { margin-top: 0.2rem; accent-color: var(--sl-color-accent); }
  .lai-model-text { display: flex; flex-direction: column; gap: 0.15rem; }
  .lai-model-label { font-weight: 500; }
  .lai-model-warn { font-size: 0.8rem; color: var(--aig-caution-text); }
  .lai-consent-privacy { font-size: 0.82rem; color: var(--sl-color-gray-3); margin: 0; }
  .lai-consent-privacy a { color: var(--sl-color-text-accent); }

  .lai-btn {
    align-self: flex-start;
    padding: 0.55rem 1rem;
    border: 1px solid var(--sl-color-hairline);
    border-radius: 0.5rem;
    background: var(--sl-color-bg);
    color: var(--sl-color-text);
    font-family: var(--sl-font); font-weight: 600; font-size: 0.92rem;
    cursor: pointer;
  }
  .lai-btn-primary {
    background: var(--sl-color-accent);
    color: var(--sl-color-text-invert);
    border-color: var(--sl-color-accent);
  }
  .lai-btn-primary:hover { background: var(--sl-color-accent-high); }
  .lai-btn:focus-visible { outline: 2px solid var(--sl-color-accent); outline-offset: 2px; }
```

- [ ] **Step 3: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual checks:
- Open the panel: the consent screen shows three radio rows (Light preselected), the "Best" row shows the GPU warning, the confirm button and the privacy line with a working link to `/en/privacy/`.
- Pick "Better", click "Download and enable": body shows the placeholder downloading text with the Better model id, and `localStorage['aiguide:localai:consent']` is set to the Better id.
- Reload: opening the panel skips consent and goes straight to the (placeholder) download text.
- Clear `localStorage` → consent screen returns.

- [ ] **Step 4: Commit**

```bash
git add src/components/LocalAI/chat-ui.ts src/components/LocalAI/ChatPanel.astro
git commit -m "Add consent screen and model picker to local AI"
```

---

### Task 4: Web Worker + engine download with progress

Adds the real worker + engine creation with a progress bar, transitioning to a "ready" view on success and the error/fallback view on failure.

**Files:**
- Create: `src/components/LocalAI/chat-worker.ts`
- Modify: `src/components/LocalAI/chat-ui.ts`
- Modify: `src/components/LocalAI/ChatPanel.astro` (progress + error styles)

**Interfaces:**
- Consumes: `enginePromise`, `activeModelId` (Task 1), `startDownload` (Task 3).
- Produces (used by Task 5):
  - `private engine: MLCEngineInterface | null`
  - `private renderReady(): void` — stub here (shows ready hint), filled in Task 5
  - module function `getEngine(modelId, onProgress): Promise<MLCEngineInterface>`

- [ ] **Step 1: Create the worker**

Create `src/components/LocalAI/chat-worker.ts`:
```ts
/**
 * Web Worker hosting the web-llm engine, so inference never blocks the
 * UI thread. The handler implements the full engine protocol; the main
 * thread drives it through the CreateWebWorkerMLCEngine proxy.
 */
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg: MessageEvent) => handler.onmessage(msg);
```

- [ ] **Step 2: Add the engine loader (module scope) in chat-ui.ts**

In `chat-ui.ts`, update the import and add the loader below the singletons:
```ts
import {
  CreateWebWorkerMLCEngine,
  type MLCEngineInterface,
  type InitProgressReport,
} from '@mlc-ai/web-llm';
```
```ts
/**
 * Creates (or reuses) the singleton engine. If a different model was
 * requested than the active one, reloads in place. Survives view
 * transitions via the module-level enginePromise.
 */
function getEngine(
  modelId: string,
  onProgress: (r: InitProgressReport) => void,
): Promise<MLCEngineInterface> {
  if (enginePromise && activeModelId === modelId) return enginePromise;
  activeModelId = modelId;
  enginePromise = (async () => {
    const worker = new Worker(new URL('./chat-worker.ts', import.meta.url), { type: 'module' });
    return CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback: onProgress });
  })();
  return enginePromise;
}
```

- [ ] **Step 3: Implement startDownload + ready/error in the class**

Add an `engine` field to the class and replace the placeholder `startDownload` with the real one. Add `renderReady` (stub) and `renderError`.

Add field (near the other private fields):
```ts
  private engine: MLCEngineInterface | null = null;
```

Replace `startDownload`:
```ts
  private async startDownload(modelId: string) {
    this.renderDownloading();
    const bar = this.body.querySelector<HTMLElement>('[data-progress-bar]');
    const label = this.body.querySelector<HTMLElement>('[data-progress-label]');
    try {
      this.engine = await getEngine(modelId, (r) => {
        if (bar) bar.style.width = `${Math.round((r.progress || 0) * 100)}%`;
        if (label) label.textContent = r.text || this.i18n.downloading;
      });
      this.renderReady();
    } catch (err) {
      console.error('[LocalAI] engine load failed', err);
      enginePromise = null;
      activeModelId = null;
      this.renderError(modelId);
    }
  }

  private renderDownloading() {
    this.body.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'lai-loading';
    const label = document.createElement('p');
    label.className = 'lai-progress-label';
    label.setAttribute('data-progress-label', '');
    label.textContent = this.i18n.downloading;
    const track = document.createElement('div');
    track.className = 'lai-progress-track';
    const bar = document.createElement('div');
    bar.className = 'lai-progress-bar';
    bar.setAttribute('data-progress-bar', '');
    track.appendChild(bar);
    wrap.append(label, track);
    this.body.appendChild(wrap);
  }

  private renderError(modelId: string) {
    this.body.innerHTML = '';
    const h = document.createElement('p');
    h.className = 'lai-msg-title';
    h.textContent = this.i18n.errorTitle;
    const p = document.createElement('p');
    p.textContent = this.i18n.errorBody;
    this.body.append(h, p);
    const lightId = this.models.find((m) => m.tier === 'light')?.id;
    if (lightId && modelId !== lightId) {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'lai-btn lai-btn-primary';
      retry.textContent = this.i18n.retryLight;
      retry.addEventListener('click', () => {
        this.setConsentedModel(lightId);
        this.startDownload(lightId);
      });
      this.body.appendChild(retry);
    }
  }

  // Filled in Task 5. For now confirms readiness.
  private renderReady() {
    this.body.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = this.i18n.disclaimer;
    this.body.appendChild(p);
  }
```

- [ ] **Step 4: Progress + error styles**

Append to `ChatPanel.astro` `<style>`:
```css
  .lai-loading { display: flex; flex-direction: column; gap: 0.6rem; }
  .lai-progress-label { margin: 0; font-size: 0.9rem; color: var(--sl-color-gray-2); }
  .lai-progress-track {
    width: 100%; height: 0.5rem;
    background: var(--sl-color-accent-low);
    border-radius: 999px; overflow: hidden;
  }
  .lai-progress-bar {
    width: 0%; height: 100%;
    background: var(--sl-color-accent);
    transition: width 0.2s ease;
  }
```

- [ ] **Step 5: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual checks (a WebGPU browser — recent Chrome/Edge desktop):
- Consent → "Download and enable" → progress bar advances, label updates with web-llm's status text.
- On completion, the body shows the ready disclaimer line. No console errors.
- Confirm in DevTools → Application → Cache Storage that web-llm cached the model (a `webllm/...` cache appears).
- Reload the page: opening the panel reloads the engine from cache quickly (progress jumps near 100% fast).
- If you have a low-memory GPU or pick "Best" on a weak machine and it fails, the error view + "Try the Light model" button appears.

- [ ] **Step 6: Commit**

```bash
git add src/components/LocalAI/chat-worker.ts src/components/LocalAI/chat-ui.ts src/components/LocalAI/ChatPanel.astro
git commit -m "Add web-llm worker, engine download and progress to local AI"
```

---

### Task 5: Free chat with streaming + system prompt (lesson context)

Adds the message list, input, send + streaming reply, and the system prompt assembled with the current lesson's context.

**Files:**
- Modify: `src/components/LocalAI/chat-ui.ts`
- Modify: `src/components/LocalAI/ChatPanel.astro` (chat styles)

**Interfaces:**
- Consumes: `engine` (Task 4), `extractLessonContext` (Task 2).
- Produces (used by Tasks 6, 7):
  - `private history: Array<{ role: 'user' | 'assistant'; content: string }>`
  - `private buildSystemPrompt(opts: { searchBlock?: string; exerciseBlock?: string }): string`
  - `private send(userText: string, opts?: { display?: boolean }): Promise<void>`
  - `private appendBubble(role: 'user' | 'assistant', text: string): HTMLElement`

- [ ] **Step 1: Add the import**

In `chat-ui.ts`:
```ts
import { extractLessonContext } from './lesson-context';
```

- [ ] **Step 2: Add chat state + methods**

Add field:
```ts
  private history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
```

Replace the stub `renderReady` with the full chat UI and add the helper methods:
```ts
  private renderReady() {
    this.body.innerHTML = '';
    this.history = [];

    const list = document.createElement('div');
    list.className = 'lai-messages';
    list.setAttribute('data-messages', '');

    const disclaimer = document.createElement('p');
    disclaimer.className = 'lai-disclaimer';
    disclaimer.textContent = this.i18n.disclaimer;

    const form = document.createElement('form');
    form.className = 'lai-input-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'lai-input';
    input.placeholder = this.i18n.inputPlaceholder;
    input.setAttribute('data-input', '');
    const send = document.createElement('button');
    send.type = 'submit';
    send.className = 'lai-btn lai-btn-primary lai-send';
    send.textContent = this.i18n.send;
    form.append(input, send);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      void this.send(text);
    });

    this.body.append(list, disclaimer, form);
    this.renderExerciseButton(list); // no-op until Task 7 defines it
    input.focus();
  }

  private appendBubble(role: 'user' | 'assistant', text: string): HTMLElement {
    const list = this.body.querySelector('[data-messages]') as HTMLElement;
    const bubble = document.createElement('div');
    bubble.className = `lai-bubble lai-bubble-${role}`;
    bubble.textContent = text;
    list.appendChild(bubble);
    list.scrollTop = list.scrollHeight;
    return bubble;
  }

  private buildSystemPrompt(opts: { searchBlock?: string; exerciseBlock?: string } = {}): string {
    const { title, text } = extractLessonContext();
    const search = opts.searchBlock ? opts.searchBlock : '(none)';
    const exercise = opts.exerciseBlock ? `\n\n${opts.exerciseBlock}` : '';
    return [
      'You are the built-in assistant for AI-Guide, a free manual that teaches people how to use AI. You run entirely in the browser, no data leaves this device.',
      `Current lesson: ${title}`,
      '',
      'Current lesson content:',
      text || '(not available)',
      '',
      'Relevant excerpts from other lessons (if any):',
      search,
      '',
      'Rules:',
      '- Answer questions about the current lesson and the guide in general.',
      '- If the user asks about something not covered in the guide, say so clearly and suggest they ask a full AI like Claude or ChatGPT.',
      '- Be concise. This is a study guide, not a chatbot.',
      "- Match the language of the user's message (the guide is bilingual en/it).",
      '- Never reproduce large blocks of the lesson verbatim. Paraphrase and explain.',
      exercise,
    ].join('\n');
  }

  private async send(userText: string, opts: { display?: boolean; exerciseBlock?: string } = {}) {
    const display = opts.display !== false;
    if (display) this.appendBubble('user', userText);
    this.history.push({ role: 'user', content: userText });

    const replyBubble = this.appendBubble('assistant', this.i18n.thinking + '…');

    // Keep the last 6 turns to stay within the 4096-token window.
    const trimmed = this.history.slice(-6);
    const messages = [
      { role: 'system' as const, content: this.buildSystemPrompt({ exerciseBlock: opts.exerciseBlock }) },
      ...trimmed,
    ];

    try {
      if (!this.engine) throw new Error('engine not ready');
      const stream = await this.engine.chat.completions.create({
        messages,
        stream: true,
        temperature: 0.6,
        max_tokens: 800,
      });
      let full = '';
      for await (const chunk of stream) {
        full += chunk.choices[0]?.delta?.content ?? '';
        replyBubble.textContent = full;
        const list = this.body.querySelector('[data-messages]') as HTMLElement;
        list.scrollTop = list.scrollHeight;
      }
      this.history.push({ role: 'assistant', content: full });
    } catch (err) {
      console.error('[LocalAI] generation failed', err);
      replyBubble.textContent = this.i18n.errorBody;
    }
  }

  // Defined in Task 7; declared here so renderReady can call it safely.
  private renderExerciseButton(_list: HTMLElement) { /* no-op until Task 7 */ }
```

- [ ] **Step 3: Add chat styles**

Append to `ChatPanel.astro` `<style>`:
```css
  .lai-messages { display: flex; flex-direction: column; gap: 0.6rem; flex: 1; min-height: 0; }
  .lai-bubble {
    max-width: 90%;
    padding: 0.6rem 0.8rem;
    border-radius: 0.8rem;
    font-size: 0.92rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .lai-bubble-user {
    align-self: flex-end;
    background: var(--sl-color-accent);
    color: var(--sl-color-text-invert);
    border-bottom-right-radius: 0.2rem;
  }
  .lai-bubble-assistant {
    align-self: flex-start;
    background: var(--aig-elevated-bg-warm);
    border: 1px solid var(--sl-color-hairline);
    border-bottom-left-radius: 0.2rem;
  }
  .lai-disclaimer { margin: 0; font-size: 0.74rem; color: var(--sl-color-gray-4); }
  .lai-input-row { display: flex; gap: 0.5rem; }
  .lai-input {
    flex: 1;
    height: 2.6rem;
    padding: 0 0.8rem;
    border: 2px solid var(--sl-color-hairline-shade);
    border-radius: 0.6rem;
    background: var(--sl-color-bg);
    color: var(--sl-color-text);
    font-family: var(--sl-font); font-size: 0.95rem;
  }
  .lai-input:focus-visible { outline: none; border-color: var(--sl-color-accent); }
  .lai-send { align-self: stretch; }
```

- [ ] **Step 4: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual checks (WebGPU browser, after the model loads):
- Type "What is this lesson about?" → a user bubble appears, then an assistant bubble streams a coherent answer grounded in the current lesson.
- Ask in Italian on an `/it/` page → the reply is in Italian.
- Ask something off-topic ("what's the capital of France?") → the model says it's outside the guide and suggests a full AI (behaviour depends on model tier; Light may be imperfect, acceptable).
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/LocalAI/chat-ui.ts src/components/LocalAI/ChatPanel.astro
git commit -m "Add free chat with streaming and lesson-grounded system prompt"
```

---

### Task 6: `search-context.ts` — cross-lesson excerpts via Pagefind

Queries Pagefind for the top excerpts from other lessons and folds them into the system prompt.

**Files:**
- Create: `src/components/LocalAI/search-context.ts`
- Modify: `src/components/LocalAI/chat-ui.ts`

**Interfaces:**
- Produces:
  - `export interface LessonExcerpt { title: string; url: string; excerpt: string }`
  - `export async function searchOtherLessons(query: string, locale: string, opts?: { limit?: number; currentPath?: string }): Promise<LessonExcerpt[]>`
- Consumes: `send`/`buildSystemPrompt` (Task 5).

- [ ] **Step 1: Create the search module**

Create `src/components/LocalAI/search-context.ts`:
```ts
/**
 * Pulls relevant excerpts from OTHER lessons via the Pagefind index
 * (same index Starlight search uses). Pagefind only exists in a built
 * site; in dev or on error this fails soft to an empty list.
 */
export interface LessonExcerpt {
  title: string;
  url: string;
  excerpt: string;
}

interface PagefindSubResult { url: string; title: string; excerpt: string }
interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results?: PagefindSubResult[];
}
interface PagefindResult { id: string; data: () => Promise<PagefindResultData> }
interface PagefindModule {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
  options?: (o: Record<string, unknown>) => void;
  init?: () => Promise<void>;
}

let pagefindPromise: Promise<PagefindModule | null> | null = null;

function loadPagefind(): Promise<PagefindModule | null> {
  if (pagefindPromise) return pagefindPromise;
  pagefindPromise = (async () => {
    try {
      const base = (import.meta.env.BASE_URL as string).replace(/\/$/, '');
      const url = `${base}/pagefind/pagefind.js`;
      const mod = (await import(/* @vite-ignore */ url)) as PagefindModule;
      mod.options?.({ baseUrl: base + '/' });
      await mod.init?.();
      return mod;
    } catch {
      return null; // dev or missing index
    }
  })();
  return pagefindPromise;
}

function stripMarks(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export async function searchOtherLessons(
  query: string,
  _locale: string,
  opts: { limit?: number; currentPath?: string } = {},
): Promise<LessonExcerpt[]> {
  const limit = opts.limit ?? 3;
  const mod = await loadPagefind();
  if (!mod) return [];
  try {
    const { results } = await mod.search(query);
    const top = results.slice(0, limit + 2);
    const data = await Promise.all(top.map((r) => r.data()));
    return data
      .filter((d) => !opts.currentPath || !d.url.startsWith(opts.currentPath))
      .slice(0, limit)
      .map((d) => ({
        title: d.meta?.title || d.url,
        url: d.url,
        excerpt: stripMarks(d.excerpt),
      }));
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Fold search results into send()**

In `chat-ui.ts`, import:
```ts
import { searchOtherLessons } from './search-context';
```
In `send()`, before building `messages`, fetch excerpts and pass a `searchBlock` to `buildSystemPrompt`. Replace the `messages` assembly with:
```ts
    let searchBlock = '';
    try {
      const excerpts = await searchOtherLessons(userText, this.locale, {
        currentPath: location.pathname,
      });
      if (excerpts.length) {
        searchBlock = excerpts
          .map((e) => `- ${e.title}: ${e.excerpt}`)
          .join('\n');
      }
    } catch { /* fail soft */ }

    const trimmed = this.history.slice(-6);
    const messages = [
      {
        role: 'system' as const,
        content: this.buildSystemPrompt({ searchBlock, exerciseBlock: opts.exerciseBlock }),
      },
      ...trimmed,
    ];
```
(Keep the existing streaming code below unchanged.)

- [ ] **Step 3: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual checks (built site, so Pagefind exists):
- On the "What is AI?" lesson, ask a question whose answer lives in another lesson (e.g. "what is a prompt?"). The answer should reflect content from the prompt lesson. To confirm retrieval ran, add a temporary `console.log` of `searchBlock` (remove before commit), reload, and verify excerpts are non-empty.
- In `npm run dev` (no Pagefind), the assistant still answers from lesson context with no errors (search fails soft).

- [ ] **Step 4: Commit**

```bash
git add src/components/LocalAI/search-context.ts src/components/LocalAI/chat-ui.ts
git commit -m "Add cross-lesson Pagefind retrieval to local AI system prompt"
```

---

### Task 7: `skill-loader.ts` + interactive exercise mode

Adds the "Start the exercise" button (only when the page has a check-in skill file) and runs the exercise interactively from the `.txt`.

**Files:**
- Create: `src/components/LocalAI/skill-loader.ts`
- Modify: `src/components/LocalAI/chat-ui.ts`
- Modify: `src/components/LocalAI/ChatPanel.astro` (exercise button style)

**Interfaces:**
- Produces:
  - `export interface SkillRef { file: string; variant: string; title: string; url: string }`
  - `export function findSkillFiles(): SkillRef[]`
  - `export async function loadSkill(ref: SkillRef): Promise<string>`
- Consumes: `renderExerciseButton` placeholder, `send`, `buildSystemPrompt` (Task 5).

- [ ] **Step 1: Create the skill loader**

Create `src/components/LocalAI/skill-loader.ts`:
```ts
/**
 * Finds the check-in skill files for the current lesson by scanning the
 * rendered LlmExercise cards (each carries data-file + data-variant and
 * a title). Far more robust than deriving a filename from the slug:
 * lessons can have several skill files (practice-, review-, deepen-).
 */
export interface SkillRef {
  file: string;
  variant: string;
  title: string;
  url: string;
}

export function findSkillFiles(): SkillRef[] {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('.llm-exercise[data-file]'),
  );
  const refs: SkillRef[] = [];
  cards.forEach((card) => {
    const file = card.dataset.file;
    if (!file) return;
    const variant = card.dataset.variant || 'practice';
    const title = card.querySelector('h3')?.textContent?.trim() || file;
    // Resolve the same URL LlmExercise builds: the copy button's data-copy-src.
    const url = card.querySelector<HTMLElement>('[data-copy-src]')?.getAttribute('data-copy-src') || '';
    if (url) refs.push({ file, variant, title, url });
  });
  return refs;
}

/** Picks the most relevant skill: prefer review, then practice, then first. */
export function pickPrimarySkill(refs: SkillRef[]): SkillRef | null {
  if (!refs.length) return null;
  return (
    refs.find((r) => r.variant === 'review') ||
    refs.find((r) => r.variant === 'practice') ||
    refs[0]
  );
}

export async function loadSkill(ref: SkillRef): Promise<string> {
  const res = await fetch(ref.url);
  if (!res.ok) throw new Error(`skill fetch failed: ${res.status}`);
  return res.text();
}
```

- [ ] **Step 2: Wire exercise mode in chat-ui.ts**

Import:
```ts
import { findSkillFiles, pickPrimarySkill, loadSkill, type SkillRef } from './skill-loader';
```
Replace the no-op `renderExerciseButton` with the real one:
```ts
  private renderExerciseButton(list: HTMLElement) {
    const skill = pickPrimarySkill(findSkillFiles());
    if (!skill) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lai-btn lai-btn-primary lai-exercise-btn';
    btn.textContent = this.i18n.startExercise;
    btn.addEventListener('click', () => {
      btn.disabled = true;
      void this.startExercise(skill);
    });
    // Insert above the message list so it is the first thing in the body.
    list.parentElement?.insertBefore(btn, list);
  }

  private async startExercise(skill: SkillRef) {
    let skillText = '';
    try {
      skillText = await loadSkill(skill);
    } catch (err) {
      console.error('[LocalAI] skill load failed', err);
      this.appendBubble('assistant', this.i18n.errorBody);
      return;
    }
    const exerciseBlock = [
      'You are now running this exercise with the reader. Follow it exactly.',
      'Ask the first question. Wait for the reader to answer before continuing.',
      'Give short feedback after each answer. Do not ask more than one question at a time.',
      '',
      'EXERCISE INSTRUCTIONS:',
      skillText,
    ].join('\n');

    // Silent trigger: not shown as a user bubble.
    const trigger = this.locale === 'it'
      ? "Inizia l'esercizio adesso."
      : 'Start the exercise now.';
    await this.send(trigger, { display: false, exerciseBlock });
  }
```

Note: `send()` already accepts `opts.exerciseBlock` and `opts.display` (Task 5). When `exerciseBlock` is present it must be passed through to `buildSystemPrompt` for **every** subsequent turn of the exercise, so the model keeps the instructions. Add an instance field and use it as a fallback:

Add field:
```ts
  private activeExerciseBlock: string | null = null;
```
In `startExercise`, before calling `send`, set `this.activeExerciseBlock = exerciseBlock;`.
In `send()`, change the `buildSystemPrompt` call to:
```ts
        content: this.buildSystemPrompt({
          searchBlock,
          exerciseBlock: opts.exerciseBlock ?? this.activeExerciseBlock ?? undefined,
        }),
```
And reset it when a fresh `renderReady()` runs: set `this.activeExerciseBlock = null;` at the top of `renderReady()`.

- [ ] **Step 3: Exercise button style**

Append to `ChatPanel.astro` `<style>`:
```css
  .lai-exercise-btn { align-self: stretch; margin-bottom: 0.4rem; }
  .lai-exercise-btn:disabled { opacity: 0.5; cursor: default; }
```

- [ ] **Step 4: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual checks:
- On a lesson with a check-in (e.g. `/en/fundamentals/what-is-ai/`, which renders a `review-what-is-ai.txt` card), the panel shows "Start the exercise" above the messages.
- Click it: the assistant asks the first question only (not all at once), waits, and gives feedback after your answer, following the `.txt`.
- On a lesson without any LlmExercise card, the button does not appear.
- The lesson's existing Copy / Download / Open buttons still work unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/components/LocalAI/skill-loader.ts src/components/LocalAI/chat-ui.ts src/components/LocalAI/ChatPanel.astro
git commit -m "Add interactive exercise mode driven by lesson skill files"
```

---

### Task 8: Surface skill buttons in the no-WebGPU fallback

The fallback must point to the lesson's actual external-AI buttons. This refines Task 1's fallback to deep-link / scroll to the exercise card when present.

**Files:**
- Modify: `src/components/LocalAI/chat-ui.ts`

**Interfaces:**
- Consumes: `findSkillFiles` (Task 7), `setView`/`showFallback` (Task 1).

- [ ] **Step 1: Enrich the fallback view**

In `chat-ui.ts`, import is already present from Task 7. Replace the `fallback` branch of `setView()` with:
```ts
    if (view === 'fallback') {
      this.body.innerHTML = '';
      const h = document.createElement('p');
      h.className = 'lai-msg-title';
      h.textContent = this.i18n.noWebgpuTitle;
      const p = document.createElement('p');
      p.textContent = this.i18n.noWebgpuBody;
      this.body.append(h, p);

      const skills = findSkillFiles();
      if (skills.length) {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'lai-btn lai-btn-primary';
        link.textContent = this.i18n.startExercise;
        link.addEventListener('click', () => {
          this.close();
          const card = document.querySelector('.llm-exercise');
          card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        this.body.appendChild(link);
      }
      return;
    }
```

- [ ] **Step 2: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual check: in a browser without WebGPU (or temporarily force the branch by editing `open()` to call `this.showFallback()` unconditionally, then revert), the fallback shows the message and, on a lesson with a check-in, a button that closes the panel and scrolls to the exercise card. The external Copy/Download/Open buttons remain the real path.

- [ ] **Step 3: Commit**

```bash
git add src/components/LocalAI/chat-ui.ts
git commit -m "Surface lesson exercise buttons in no-WebGPU fallback"
```

---

### Task 9: Privacy page section (en + it)

Document the feature on the privacy page per the chosen disclosure approach.

**Files:**
- Modify: `src/content/docs/en/privacy.mdx`
- Modify: `src/content/docs/it/privacy.mdx`

- [ ] **Step 1: Add the English section**

In `src/content/docs/en/privacy.mdx`, insert this new section immediately **after** the "What stays on your browser" section (after its last paragraph, before "## If you write to me"):

```mdx
## The local AI assistant

The site has an optional assistant that runs a small AI model **inside
your browser**. It is off by default and starts only when you open it
and agree.

The first time you turn it on, your browser downloads a model file once
from an external provider (Hugging Face). That single download is the
only moment anything leaves your device. After it, the model is saved in
your browser and the assistant works offline.

When you chat with it, **nothing you type is sent anywhere**. The whole
conversation happens on your device. I don't see it, store it, or
receive it, and neither does any server. Your messages are not saved
between visits.

If your browser can't run AI on the device, the assistant stays off and
points you to the buttons that open the exercise in an external AI
instead.
```

Then update the "What stays on your browser" list reference if needed (no change required) and bump the last line:
```mdx
Last updated 2026-06-24.
```

- [ ] **Step 2: Add the Italian section**

In `src/content/docs/it/privacy.mdx`, insert the mirrored section in the same position (after the localStorage section, before the "write to me" section). Use voice-guide compliant Italian, no em dash:

```mdx
## L'assistente IA locale

Il sito ha un assistente opzionale che fa girare un piccolo modello di
IA **dentro il tuo browser**. È spento di default e parte solo quando lo
apri e dai il consenso.

La prima volta che lo attivi, il browser scarica una volta sola un file
del modello da un fornitore esterno (Hugging Face). Quel singolo
download è l'unico momento in cui qualcosa esce dal tuo dispositivo.
Dopo, il modello resta salvato nel browser e l'assistente funziona
offline.

Quando ci parli, **niente di quello che scrivi viene inviato altrove**.
Tutta la conversazione avviene sul tuo dispositivo. Non la vedo, non la
conservo, non la ricevo, e non lo fa nessun server. I tuoi messaggi non
vengono salvati tra una visita e l'altra.

Se il tuo browser non può far girare l'IA sul dispositivo, l'assistente
resta spento e ti indirizza ai pulsanti che aprono l'esercizio in
un'IA esterna.
```

Bump the Italian "Ultimo aggiornamento" line to `2026-06-24` (match the file's existing wording).

- [ ] **Step 3: Build and verify**

Run:
```bash
npm run build && npm run preview
```
Manual check: `/en/privacy/` and `/it/privacy/` show the new section in the right place, links and formatting intact.

- [ ] **Step 4: Commit**

```bash
git add src/content/docs/en/privacy.mdx src/content/docs/it/privacy.mdx
git commit -m "Document the local AI assistant on the privacy page (en + it)"
```

---

### Task 10: Final integration pass — verification, SW/PWA, docs

Verifies the whole feature against the Definition of Done, confirms PWA/SW behaviour, and updates project docs.

**Files:**
- Modify: `CLAUDE.md` (add `<ChatPanel>` / LocalAI to the internal-components note)
- Verify only: `src/sw.ts`, `astro.config.mjs`

- [ ] **Step 1: Confirm the SW does not intercept CDN weight fetches**

Read `src/sw.ts`. Confirm the fetch/runtime-caching rules are same-origin only and do not match `huggingface.co` / the web-llm CDN host. If a catch-all runtime handler exists, confirm it excludes cross-origin requests (web-llm fetches must reach the network/its own cache untouched). Document the finding in the commit message. No code change expected; if one is needed, add a cross-origin bypass and note it.

- [ ] **Step 2: Confirm the worker bundles for static output**

Confirm `npm run build` emitted a worker chunk under `dist/_astro/` for `chat-worker`, and that `dist/` contains no SSR errors referencing `@mlc-ai/web-llm`. The injectManifest glob `_astro/**/*` precaches the glue (shell); the model weights are not in `dist/` (correct — they come from the CDN at runtime).

- [ ] **Step 3: Full Definition-of-Done walkthrough**

Run `npm run build && npm run preview`. On both `/en/...` and `/it/...` lessons, confirm:
- Floating button appears; panel opens.
- Consent → model download (progress) → coherent lesson answer.
- "Start the exercise" runs the interactive check-in on a lesson that has one.
- Existing Copy / Download / Open buttons still work.
- WebGPU-unsupported path shows the fallback (test in a browser without WebGPU, or via the temporary force from Task 8 then revert).
- No console errors on either locale.
- Ctrl/Cmd+K still opens Starlight search; the panel does not interfere.
- Progress tracker still records reads (open `localStorage['aiguide:progress:v1']`).

- [ ] **Step 4: Update CLAUDE.md**

In `CLAUDE.md`, add a short note documenting the LocalAI subsystem. Place it after the PWA bullet block (the section ending with the SW/`/sa/**` note), as a new paragraph:

```markdown
## Assistente IA locale (in-browser)

`src/components/LocalAI/` aggiunge un assistente che gira interamente
nel browser via `@mlc-ai/web-llm` (WebGPU), montato su ogni pagina da
`Footer.astro`. Niente backend, niente API key: il modello (Qwen2.5,
tre tagli scelti dall'utente: 0.5B / 1.5B / 3B) si scarica una sola
volta da CDN terza solo dopo consenso esplicito, poi resta in cache e
gira offline. `ChatPanel.astro` rende launcher + drawer; `chat-ui.ts`
guida la macchina a stati (consent → download → ready / fallback);
`chat-worker.ts` ospita l'engine fuori dal main thread; `lesson-context.ts`
estrae il testo della lezione corrente; `search-context.ts` interroga
Pagefind per estratti da altre lezioni; `skill-loader.ts` legge i file
`.txt` di check-in dalle card `<LlmExercise>` (via `data-file`) e li
esegue in modalità esercizio interattivo. Consenso persistito in
`localStorage['aiguide:localai:consent']`. Nessuna conversazione viene
salvata o inviata. È un'aggiunta: i pulsanti Copy/Download/Open restano.
È un componente interno, non va nel catalogo dei componenti `.mdx`.
```

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "Document local AI assistant subsystem in CLAUDE.md"
```

---

## Self-review

**Spec coverage:**
- Knows current lesson → Task 2 + Task 5 (system prompt). ✓
- Search other lessons (Pagefind) → Task 6. ✓
- Interactive exercise from skill `.txt` → Task 7. ✓
- Does not replace external AI (buttons intact) → constraint + Task 7 step 4 + Task 8. ✓
- web-llm worker + engine, progress, cache → Task 4. ✓
- Consent before download → Task 3 + Task 4. ✓
- Three model tiers, user-selectable → Task 3. ✓
- Third-party CDN weights → Task 4 (default web-llm behaviour). ✓
- Privacy disclosure (privacy.mdx + consent) → Task 3 (consent line) + Task 9 (privacy.mdx). ✓
- Inject on every page via Footer → Task 1. ✓
- Theme/responsive/no-interference → Task 1 styles + Task 10 verification. ✓
- WebGPU fallback → Task 1 + Task 8. ✓
- Graceful degradation (load failure, Pagefind absent, no JS) → Task 4 (error), Task 6 (fail-soft), Task 1 (JS-driven launcher). ✓
- View-transition survival → Task 1 (module singleton + astro:page-load define). ✓
- DoD / build green → every task + Task 10. ✓

**Placeholder scan:** No "TBD/TODO". The intentional cross-task stubs (`startDownload`, `renderReady`, `renderExerciseButton`) are explicitly defined as stubs with the task that fills them named, and each has complete code at both stub and final stages.

**Type consistency:** `MLCEngineInterface`, `InitProgressReport` from web-llm used consistently. `View` type, `ModelTier`, `I18n`, `LessonContext`, `LessonExcerpt`, `SkillRef` defined once and reused. `send(userText, opts)` signature is stable across Tasks 5–8 (`opts.display`, `opts.exerciseBlock`). `buildSystemPrompt({ searchBlock?, exerciseBlock? })` stable across Tasks 5–7. `findSkillFiles()` / `pickPrimarySkill()` / `loadSkill()` consistent in Tasks 7–8.
