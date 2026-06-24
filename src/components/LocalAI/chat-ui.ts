/**
 * Client controller for the local AI assistant. Custom element
 * `<local-ai>`; mirrors the Search.astro pattern (idempotent
 * connectedCallback, module-level singletons that survive view
 * transitions). This task wires open/close, WebGPU detection and the
 * fallback view only. Later tasks add consent, the engine and chat.
 */
import type { MLCEngineInterface, InitProgressReport } from '@mlc-ai/web-llm';
import { extractLessonContext } from './lesson-context';

// Survives Astro view transitions (page swaps don't reload JS).
let enginePromise: Promise<MLCEngineInterface> | null = null;
let activeModelId: string | null = null;

/**
 * Creates (or reuses) the singleton engine. If a different model was
 * requested than the active one, reloads in place. Survives view
 * transitions via the module-level enginePromise.
 *
 * web-llm (~6 MB) is imported dynamically here, not at module top level,
 * so it is never part of the per-page bundle: it loads only once the
 * reader has consented and the download starts. The worker bundle is
 * likewise instantiated lazily here.
 */
function getEngine(
  modelId: string,
  onProgress: (r: InitProgressReport) => void,
): Promise<MLCEngineInterface> {
  if (enginePromise && activeModelId === modelId) return enginePromise;
  activeModelId = modelId;
  enginePromise = (async () => {
    const { CreateWebWorkerMLCEngine } = await import('@mlc-ai/web-llm');
    const worker = new Worker(new URL('./chat-worker.ts', import.meta.url), { type: 'module' });
    return CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback: onProgress });
  })();
  return enginePromise;
}

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
  private engine: MLCEngineInterface | null = null;
  private history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

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
    const consented = this.getConsentedModel();
    if (consented) this.startDownload(consented);
    else this.renderConsent();
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
  }

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
}

function define() {
  if (!customElements.get('local-ai')) customElements.define('local-ai', LocalAI);
}
define();
document.addEventListener('astro:page-load', define);
