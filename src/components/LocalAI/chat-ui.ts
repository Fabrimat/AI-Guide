/**
 * Client controller for the local AI assistant. Custom element
 * `<local-ai>`; mirrors the Search.astro pattern (idempotent
 * connectedCallback, module-level singletons that survive view
 * transitions). This task wires open/close, WebGPU detection and the
 * fallback view only. Later tasks add consent, the engine and chat.
 */
import type { MLCEngineInterface, InitProgressReport } from '@mlc-ai/web-llm';

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

  // Filled in Task 5. For now confirms readiness.
  private renderReady() {
    this.body.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = this.i18n.disclaimer;
    this.body.appendChild(p);
  }
}

function define() {
  if (!customElements.get('local-ai')) customElements.define('local-ai', LocalAI);
}
define();
document.addEventListener('astro:page-load', define);
