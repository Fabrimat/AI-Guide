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
