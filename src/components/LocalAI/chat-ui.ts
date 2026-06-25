/**
 * Client controller for the local AI assistant. Custom element
 * `<local-ai>`; mirrors the Search.astro pattern (idempotent
 * connectedCallback, module-level singletons that survive view
 * transitions). Redesigned in Task 1: is:global CSS + mockup DOM structure.
 */
import type { MLCEngineInterface, InitProgressReport } from '@mlc-ai/web-llm';
import { extractLessonContext } from './lesson-context';
import { searchOtherLessons } from './search-context';
import { findSkillFiles, pickPrimarySkill, loadSkill, type SkillRef } from './skill-loader';
import { renderMarkdown } from './markdown';
import { loadHistory, saveHistory, clearHistory, type ChatMsg } from './history';
import { getStatuses, deleteModel, type CacheStatus } from './model-cache';
import { recommendedTier } from './device';

// Survives Astro view transitions (page swaps don't reload JS).
let enginePromise: Promise<MLCEngineInterface> | null = null;
let activeModelId: string | null = null;
// The worker backing the active engine. Tracked so a model switch can
// terminate it (freeing its WebGPU context) before loading a new model.
let activeWorker: Worker | null = null;

/**
 * Creates (or reuses) the singleton engine. If a different model was
 * requested than the active one, reloads in place. Survives view
 * transitions via the module-level enginePromise.
 *
 * web-llm (~6 MB) is imported dynamically here, not at module top level,
 * so it is never part of the per-page bundle: it loads only once the
 * reader has consented and the download starts.
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
    activeWorker = worker;
    return CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback: onProgress });
  })();
  return enginePromise;
}

/**
 * Tears down the active engine and its worker, freeing the WebGPU context,
 * then resets the module-level singletons. Called before switching models so
 * two engines never hold a GPU context at once.
 */
async function disposeEngine(): Promise<void> {
  try { const eng = await enginePromise; await eng?.unload?.(); } catch { /* ignore */ }
  try { activeWorker?.terminate(); } catch { /* ignore */ }
  activeWorker = null;
  enginePromise = null;
  activeModelId = null;
}

// ---- SVG icon string constants -------------------------------------------
// Inline SVGs with class `lai-ic` so they inherit stroke styling from CSS.
const ICON = {
  spark:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M12 3l2.1 4.9L19 10l-4.9 2.1L12 17l-2.1-4.9L5 10l4.9-2.1z"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  gear:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  back:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  send:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  warn:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
  exercise:
    '<svg viewBox="0 0 24 24" class="lai-ic" aria-hidden="true"><path d="M9 11l3 3 8-8"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
} as const;

// ---- Type definitions -------------------------------------------------------

type View = 'closed' | 'fallback' | 'consent' | 'downloading' | 'ready' | 'models' | 'error';

interface ModelTier {
  id: string;
  tier: 'light' | 'better' | 'best';
  name: string;
  size: string;
  vram: string;
}

interface I18n {
  panelTitle: string; close: string;
  consentHeading: string; consentBody: string; consentPrivacy: string;
  consentPrivacyLink: string; consentConfirm: string; recommended: string;
  downloading: string; inputPlaceholder: string; send: string; thinking: string;
  startExercise: string; noWebgpuTitle: string; noWebgpuBody: string;
  errorTitle: string; errorBody: string; retryLight: string; disclaimer: string;
  modelsTitle: string; newChatAria: string; modelsAria: string; backAria: string;
  oneTime: string;
  use: string; downloadModel: string; deleteModel: string;
  statusActive: string; statusCached: string; statusIdle: string;
  tierLight: string; tierBetter: string; tierBest: string;
  descLight: string; descBetter: string; descBest: string;
  bestWarn: string;
  confirmDelete: string;
}

const CONSENT_KEY = 'aiguide:localai:consent';
const CIRCUMFERENCE = 2 * Math.PI * 52; // ≈ 326.7 — ring radius 52 (viewBox 120)

// ---- Custom element ---------------------------------------------------------

class LocalAI extends HTMLElement {
  private locale = 'en';
  private privacyHref = '/en/privacy/';
  private models: ModelTier[] = [];
  private i18n!: I18n;

  private launcher!: HTMLButtonElement;
  private panel!: HTMLElement;
  private body!: HTMLElement;
  private statusSub!: HTMLElement;
  private engine: MLCEngineInterface | null = null;
  private history: ChatMsg[] = [];
  private activeExerciseBlock: string | null = null;
  private switching = false;
  private genId = 0;

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
    this.statusSub = this.querySelector('[data-status-sub]') as HTMLElement;

    this.launcher.addEventListener('click', () => this.toggle());
    this.querySelector('[data-close]')?.addEventListener('click', () => this.close());
    this.querySelector('[data-new-chat]')?.addEventListener('click', () => this.onNewChat());
    this.querySelector('[data-open-models]')?.addEventListener('click', () => this.openModels());
    this.querySelector('[data-back-chat]')?.addEventListener('click', () => this.closeModels());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.panel.hidden) this.close();
    });
  }

  // ---- Open / close ----------------------------------------------------------

  private toggle() {
    if (this.panel.hidden) this.open();
    else this.close();
  }

  private open() {
    this.panel.hidden = false;
    this.launcher.setAttribute('aria-expanded', 'true');
    if (!('gpu' in navigator)) { this.renderFallback(); return; }
    const consented = this.getConsentedModel();
    if (consented) this.startDownload(consented);
    else this.renderConsent();
  }

  private close() {
    this.panel.hidden = true;
    this.launcher.setAttribute('aria-expanded', 'false');
  }

  // ---- View helpers ----------------------------------------------------------

  /** Set data-view on the panel so CSS shows/hides the right header controls. */
  private setViewAttr(view: string) {
    if (view === 'chat' || view === 'models') {
      this.panel.dataset.view = view;
    } else {
      delete this.panel.dataset.view;
    }
  }

  /** Update the subtitle text next to the spark icon. */
  private setSubtitle(html: string) {
    this.statusSub.innerHTML = html;
  }

  /** Fix 3: update the panel header title text. */
  private setPanelTitle(text: string) {
    const titleEl = this.panel.querySelector<HTMLElement>('[data-panel-title]');
    if (titleEl) titleEl.textContent = text;
  }

  // ---- Consent ---------------------------------------------------------------

  private renderConsent() {
    this.setViewAttr('consent');
    this.setSubtitle('');
    this.body.innerHTML = '';

    const recommended = recommendedTier();

    const wrap = document.createElement('div');
    wrap.className = 'lai-consent-wrap';

    // Lead text
    const lead = document.createElement('div');
    lead.className = 'lai-lead';
    const h3 = document.createElement('h3');
    h3.textContent = this.i18n.consentHeading;
    const p = document.createElement('p');
    p.textContent = this.i18n.consentBody;
    lead.append(h3, p);
    wrap.appendChild(lead);

    this.models.forEach((m) => {
      const isRecommended = m.tier === recommended;
      const card = document.createElement('div');
      card.className = 'lai-opt' + (isRecommended ? ' lai-sel' : '');
      card.dataset.modelId = m.id;

      const { name: tierName, desc } = this.tierI18n(m.tier);

      const radio = document.createElement('span');
      radio.className = 'lai-radio';

      const info = document.createElement('div');

      // Row 1: tier name + size + optional Recommended chip
      const tierRow = document.createElement('div');
      tierRow.className = 'lai-opt-tier';
      tierRow.textContent = `${tierName} (${m.size})`;

      if (isRecommended) {
        const chip = document.createElement('span');
        chip.className = 'lai-chip';
        chip.textContent = this.i18n.recommended;
        tierRow.appendChild(chip);
      }

      // Row 2: model name (muted, smaller)
      const modelNameEl = document.createElement('div');
      modelNameEl.className = 'lai-opt-model-name';
      modelNameEl.textContent = m.name;

      // Row 3: description
      const descEl = document.createElement('div');
      descEl.className = 'lai-opt-desc';
      descEl.textContent = desc;

      info.append(tierRow, modelNameEl, descEl);

      // Warning (Best tier)
      if (m.tier === 'best') {
        const warnDiv = document.createElement('div');
        warnDiv.className = 'lai-warn';
        warnDiv.innerHTML = ICON.warn + this.i18n.bestWarn;
        info.appendChild(warnDiv);
      }

      card.append(radio, info);

      card.addEventListener('click', () => {
        wrap.querySelectorAll<HTMLElement>('.lai-opt').forEach((el) => el.classList.remove('lai-sel'));
        card.classList.add('lai-sel');
      });

      wrap.appendChild(card);
    });

    // CTA
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'lai-consent-cta';
    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.className = 'lai-btn lai-primary lai-block';
    confirm.textContent = this.i18n.consentConfirm;
    confirm.addEventListener('click', () => {
      const sel = wrap.querySelector<HTMLElement>('.lai-opt.lai-sel');
      const id = sel?.dataset.modelId || this.models[0]?.id;
      if (!id) return;
      this.setConsentedModel(id);
      this.startDownload(id);
    });
    ctaWrap.appendChild(confirm);
    wrap.appendChild(ctaWrap);

    // Privacy line
    const privacy = document.createElement('p');
    privacy.className = 'lai-privacy';
    privacy.textContent = this.i18n.consentPrivacy + ' ';
    const link = document.createElement('a');
    link.href = this.privacyHref;
    link.textContent = this.i18n.consentPrivacyLink;
    privacy.appendChild(link);
    wrap.appendChild(privacy);

    this.body.appendChild(wrap);
  }

  // ---- Downloading -----------------------------------------------------------

  private renderDownloading(modelId?: string) {
    this.setViewAttr('downloading');

    const m = this.models.find((x) => x.id === modelId);
    const tierName = m ? this.tierI18n(m.tier).name : '';
    this.setSubtitle(this.i18n.downloading);

    this.body.innerHTML = '';
    const dl = document.createElement('div');
    dl.className = 'lai-dl';

    // Progress ring — tier name below %, model name as title below ring
    const ring = document.createElement('div');
    ring.className = 'lai-ring';
    ring.innerHTML = `
      <svg viewBox="0 0 120 120">
        <circle class="lai-track" cx="60" cy="60" r="52" fill="none" stroke-width="10"></circle>
        <circle class="lai-bar" cx="60" cy="60" r="52" fill="none" stroke-width="10"
          stroke-dasharray="${CIRCUMFERENCE.toFixed(1)}"
          stroke-dashoffset="${CIRCUMFERENCE.toFixed(1)}"
          data-progress-bar></circle>
      </svg>
      <div class="lai-pct-wrap">
        <div class="lai-pct" data-progress-pct>0%<small>${tierName}</small></div>
      </div>
    `;
    dl.appendChild(ring);

    const dlTitle = document.createElement('h3');
    dlTitle.className = 'lai-dl-title';
    dlTitle.textContent = m ? m.name : this.i18n.downloading;

    const stage = document.createElement('p');
    stage.className = 'lai-stage lai-live';
    stage.setAttribute('data-progress-label', '');

    const elapsed = document.createElement('p');
    elapsed.className = 'lai-stage lai-elapsed';
    elapsed.setAttribute('data-progress-elapsed', '');

    const reassure = document.createElement('p');
    reassure.className = 'lai-reassure';
    reassure.innerHTML = ICON.check + this.i18n.oneTime;

    dl.append(dlTitle, stage, elapsed, reassure);
    this.body.appendChild(dl);
  }

  // ---- Chat (ready) ----------------------------------------------------------

  private renderReady() {
    this.genId++;          // Fix 1: invalidate any in-flight generation
    this.setViewAttr('chat');
    this.setPanelTitle(this.i18n.panelTitle); // Fix 3: restore panel title

    // Find active model name for status dot
    const m = this.models.find((x) => x.id === activeModelId);
    const tierName = m ? this.tierI18n(m.tier).name : '';
    this.setSubtitle(`<span class="lai-dot"></span>${tierName}`);

    this.body.innerHTML = '';
    this.history = [];
    this.activeExerciseBlock = null;

    // Exercise pill (above msgs)
    this.renderExerciseButton();

    // Message list
    const msgs = document.createElement('div');
    msgs.className = 'lai-msgs';
    msgs.setAttribute('data-messages', '');
    this.body.appendChild(msgs);

    // Restore this lesson's saved conversation.
    this.history = loadHistory(location.pathname);
    for (const m of this.history) this.appendBubble(m.role, m.content);

    // Composer
    const composer = document.createElement('div');
    composer.className = 'lai-composer';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'lai-field';
    input.placeholder = this.i18n.inputPlaceholder;
    input.setAttribute('data-input', '');
    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'lai-send';
    sendBtn.setAttribute('aria-label', this.i18n.send);
    sendBtn.innerHTML = ICON.send;
    composer.append(input, sendBtn);

    // Footnote
    const footnote = document.createElement('p');
    footnote.className = 'lai-footnote';
    footnote.textContent = this.i18n.disclaimer;

    this.body.append(composer, footnote);

    // Submit handlers
    const doSend = () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      void this.send(text);
    };
    sendBtn.addEventListener('click', doSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
    });

    input.focus();
  }

  // ---- Models view -----------------------------------------------------------

  private renderModels() {
    this.setViewAttr('models');
    this.setSubtitle('');

    this.body.innerHTML = '';

    const container = document.createElement('div');
    container.setAttribute('data-model-list', '');
    this.body.appendChild(container);

    // Render rows immediately in a loading state (no actions yet), then
    // resolve real cache statuses asynchronously and re-render the rows.
    for (const m of this.models) {
      container.appendChild(this.buildModelRow(m, null));
    }

    void getStatuses(this.models.map((m) => m.id), activeModelId).then((statuses) => {
      // Bail if the view was swapped away while statuses resolved.
      const list = this.body.querySelector('[data-model-list]') as HTMLElement | null;
      if (!list) return;
      list.innerHTML = '';
      for (const m of this.models) {
        list.appendChild(this.buildModelRow(m, statuses[m.id] ?? 'idle'));
      }
    });
  }

  /**
   * One row of the models view. `status === null` means the cache status is
   * still resolving: show no destructive/switch actions yet.
   */
  private buildModelRow(m: ModelTier, status: CacheStatus | null): HTMLElement {
    const row = document.createElement('div');
    row.className = 'lai-model';
    row.dataset.modelRowId = m.id;

    const { name: tierName } = this.tierI18n(m.tier);

    const idCol = document.createElement('div');
    idCol.className = 'lai-model-id';
    const b = document.createElement('b');
    b.textContent = tierName;
    const modelNameSpan = document.createElement('span');
    modelNameSpan.className = 'lai-model-desc';
    modelNameSpan.textContent = m.name;
    const sizeSpan = document.createElement('span');
    sizeSpan.className = 'lai-model-desc';
    sizeSpan.textContent = m.size;
    idCol.append(b, modelNameSpan, sizeSpan);

    // Right: status dot + label + actions.
    const actions = document.createElement('div');
    actions.className = 'lai-model-actions';

    if (status === 'active') {
      actions.appendChild(this.buildStatusDot('active', this.i18n.statusActive));
    } else if (status === 'cached') {
      actions.appendChild(this.buildStatusDot('cached', this.i18n.statusCached));
      const use = this.buildModelButton(this.i18n.use, false);
      use.addEventListener('click', () => void this.downloadInModels(m.id));
      const del = this.buildModelButton(this.i18n.deleteModel, true);
      this.wireDeleteConfirm(del, () => void this.removeModel(m.id));
      actions.append(use, del);
    } else if (status === 'idle') {
      actions.appendChild(this.buildStatusDot('idle', this.i18n.statusIdle));
      const dl = this.buildModelButton(this.i18n.downloadModel, false);
      dl.addEventListener('click', () => void this.downloadInModels(m.id));
      actions.appendChild(dl);
    } else {
      // Loading: show whichever status we already know (active) or idle, no
      // actions until the real status resolves.
      const loadingStatus: CacheStatus = m.id === activeModelId ? 'active' : 'idle';
      const loadingLabel = loadingStatus === 'active' ? this.i18n.statusActive : this.i18n.statusIdle;
      actions.appendChild(this.buildStatusDot(loadingStatus, loadingLabel));
    }

    row.append(idCol, actions);
    return row;
  }

  private buildStatusDot(kind: CacheStatus, label: string): HTMLElement {
    const wrap = document.createElement('span');
    wrap.className = 'lai-status-label';
    const dot = document.createElement('span');
    dot.className = `lai-status-dot ${kind}`;
    const text = document.createElement('span');
    text.textContent = label;
    wrap.append(dot, text);
    return wrap;
  }

  private buildModelButton(label: string, danger: boolean): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lai-btn lai-sm' + (danger ? ' lai-danger' : '');
    btn.textContent = label;
    return btn;
  }

  private wireDeleteConfirm(btn: HTMLButtonElement, action: () => void): void {
    let confirming = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    btn.addEventListener('click', () => {
      if (confirming) {
        if (timer) clearTimeout(timer);
        action();
        return;
      }
      confirming = true;
      const original = btn.textContent;
      btn.textContent = this.i18n.confirmDelete;
      btn.classList.add('lai-danger');
      timer = setTimeout(() => {
        confirming = false;
        btn.textContent = original;
      }, 3000);
    });
  }

  private async downloadInModels(modelId: string): Promise<void> {
    if (this.switching) return;
    this.switching = true;

    // Find the row DOM element for this model
    const list = this.body.querySelector('[data-model-list]') as HTMLElement | null;
    const row = list?.querySelector<HTMLElement>(`[data-model-row-id="${modelId}"]`);

    // Update the row actions area to show inline progress
    const actions = row?.querySelector('.lai-model-actions') as HTMLElement | null;
    let barFill: HTMLElement | null = null;
    let pctText: HTMLElement | null = null;

    if (actions) {
      actions.innerHTML = '';
      const inlineProgress = document.createElement('div');
      inlineProgress.className = 'lai-inline-progress';
      const barWrap = document.createElement('div');
      barWrap.className = 'lai-progress-bar-wrap';
      barFill = document.createElement('div');
      barFill.className = 'lai-progress-bar-fill';
      barWrap.appendChild(barFill);
      pctText = document.createElement('span');
      pctText.textContent = '0%';
      inlineProgress.append(barWrap, pctText);
      actions.appendChild(inlineProgress);
    }

    try {
      this.setConsentedModel(modelId);
      if (activeModelId && activeModelId !== modelId) {
        await disposeEngine();
      }
      this.engine = await getEngine(modelId, (r) => {
        const pct = Math.round((r.progress ?? 0) * 100);
        if (barFill) barFill.style.width = `${pct}%`;
        if (pctText) pctText.textContent = `${pct}%`;
      });
      // Done — refresh the whole list to reflect new active status
      this.renderModels();
    } catch (err) {
      console.error('[LocalAI] inline download failed', err);
      enginePromise = null;
      activeModelId = null;
      // Show error inline if possible
      if (actions) {
        actions.innerHTML = '';
        const errSpan = document.createElement('span');
        errSpan.className = 'lai-status-label';
        errSpan.style.color = 'var(--aig-danger-text)';
        errSpan.textContent = this.i18n.errorBody;
        actions.appendChild(errSpan);
      }
    } finally {
      this.switching = false;
    }
  }

  /** Delete a cached model (including active model). */
  private async removeModel(modelId: string) {
    if (modelId === activeModelId) {
      // Deleting active model = turn off the assistant
      await disposeEngine();
      try { await deleteModel(modelId); } catch (e) { console.error('[LocalAI] delete failed', e); }
      try { localStorage.removeItem(CONSENT_KEY); } catch { /* ignore */ }
      this.engine = null;
      this.renderConsent();
      return;
    }
    try { await deleteModel(modelId); } catch (e) { console.error('[LocalAI] delete failed', e); }
    this.renderModels();
  }

  private tierI18n(tier: 'light' | 'better' | 'best'): { name: string; desc: string } {
    const cap = (tier.charAt(0).toUpperCase() + tier.slice(1)) as 'Light' | 'Better' | 'Best';
    return {
      name: this.i18n[`tier${cap}` as keyof I18n] as string,
      desc: this.i18n[`desc${cap}` as keyof I18n] as string,
    };
  }

  /** Open the models view (gear button). */
  private openModels() {
    this.setPanelTitle(this.i18n.modelsTitle); // Fix 3: show models title
    this.renderModels();
  }

  /** Return to chat from models view (back button). */
  private closeModels() {
    this.renderReady(); // renderReady already calls setPanelTitle(panelTitle)
  }

  // ---- Fallback (no WebGPU) --------------------------------------------------

  private renderFallback() {
    this.setViewAttr('fallback');
    this.setSubtitle('');
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
      link.className = 'lai-btn lai-primary';
      link.textContent = this.i18n.startExercise;
      link.addEventListener('click', () => {
        this.close();
        const card = document.querySelector('.llm-exercise');
        card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      this.body.appendChild(link);
    }
  }

  // ---- Error -----------------------------------------------------------------

  private renderError(modelId: string) {
    this.setViewAttr('error');
    this.setSubtitle('');
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
      retry.className = 'lai-btn lai-primary';
      retry.textContent = this.i18n.retryLight;
      retry.addEventListener('click', () => {
        this.setConsentedModel(lightId);
        this.startDownload(lightId);
      });
      this.body.appendChild(retry);
    }
  }

  // ---- New chat (header button) ----------------------------------------------

  private onNewChat() {
    clearHistory(location.pathname);
    this.history = [];
    this.renderReady();
  }

  // ---- Download + engine load ------------------------------------------------

  private async startDownload(modelId: string) {
    this.renderDownloading(modelId);
    const bar = this.body.querySelector<SVGCircleElement>('[data-progress-bar]');
    const pct = this.body.querySelector<HTMLElement>('[data-progress-pct]');
    const label = this.body.querySelector<HTMLElement>('[data-progress-label]');
    const elapsedEl = this.body.querySelector<HTMLElement>('[data-progress-elapsed]');
    try {
      this.engine = await getEngine(modelId, (r: InitProgressReport) => {
        const progress = r.progress ?? 0;
        if (bar) {
          bar.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
        }
        const pctInt = Math.round(progress * 100);
        if (pct) {
          // Preserve the <small> tag inside .lai-pct
          const small = pct.querySelector('small');
          pct.textContent = `${pctInt}%`;
          if (small) pct.appendChild(small);
        }
        if (label) label.textContent = r.text || this.i18n.downloading;
        // Fix 4: show elapsed time as m:ss
        if (elapsedEl && r.timeElapsed != null && r.timeElapsed > 0) {
          const secs = Math.round(r.timeElapsed);
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          elapsedEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
        }
      });
      this.renderReady();
    } catch (err) {
      console.error('[LocalAI] engine load failed', err);
      enginePromise = null;
      activeModelId = null;
      this.renderError(modelId);
    }
  }

  // ---- Sending messages ------------------------------------------------------

  private appendBubble(role: 'user' | 'assistant', text: string): HTMLElement {
    const list = this.body.querySelector('[data-messages]') as HTMLElement | null;
    const bubble = document.createElement('div');
    bubble.className = `lai-bubble lai-${role === 'user' ? 'u' : 'a'}`;
    if (role === 'assistant') bubble.innerHTML = renderMarkdown(text);
    else bubble.textContent = text;
    // Guard: the message list should always exist when this runs, but stay
    // resilient if the view was swapped (e.g. across a view transition).
    if (list) {
      list.appendChild(bubble);
      list.scrollTop = list.scrollHeight;
    }
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
    // Fix 1: capture generation id at the start; changes on renderReady/newChat/switchModel
    const gen = this.genId;

    const display = opts.display !== false;
    if (display) this.appendBubble('user', userText);
    this.history.push({ role: 'user', content: userText });
    saveHistory(location.pathname, this.history);

    // Fix 2: show typing indicator instead of a placeholder text bubble
    const typingEl = document.createElement('div');
    typingEl.className = 'lai-typing';
    typingEl.innerHTML = '<i></i><i></i><i></i>';
    const msgList = this.body.querySelector('[data-messages]') as HTMLElement | null;
    if (msgList) {
      msgList.appendChild(typingEl);
      msgList.scrollTop = msgList.scrollHeight;
    }

    let searchBlock = '';
    try {
      const excerpts = await searchOtherLessons(userText, this.locale, {
        currentPath: location.pathname,
      });
      if (excerpts.length) {
        searchBlock = excerpts.map((e) => `- ${e.title}: ${e.excerpt}`).join('\n');
      }
    } catch { /* fail soft */ }

    // Keep the last 6 turns to stay within the 4096-token window.
    const trimmed = this.history.slice(-6);
    const messages = [
      {
        role: 'system' as const,
        content: this.buildSystemPrompt({
          searchBlock,
          exerciseBlock: opts.exerciseBlock ?? this.activeExerciseBlock ?? undefined,
        }),
      },
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
      let replyBubble: HTMLElement | null = null;
      for await (const chunk of stream) {
        // Fix 1: stop writing if the generation was superseded
        if (gen !== this.genId) break;
        const token = chunk.choices[0]?.delta?.content ?? '';
        if (!token) continue;
        full += token;
        if (!replyBubble) {
          // Fix 2: first token — swap typing indicator for the real bubble
          typingEl.remove();
          replyBubble = this.appendBubble('assistant', '');
        }
        replyBubble.innerHTML = renderMarkdown(full);
        const msgs = this.body.querySelector('[data-messages]') as HTMLElement | null;
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }
      // Fix 1: only persist if still the current generation
      if (gen === this.genId) {
        if (full) {
          this.history.push({ role: 'assistant', content: full });
          saveHistory(location.pathname, this.history);
        } else if (!replyBubble) {
          // Stream ended with no tokens and we are still current: clear indicator
          typingEl.remove();
        }
      } else {
        // Cancelled: remove typing indicator if it's still in the DOM
        typingEl.remove();
      }
    } catch (err) {
      console.error('[LocalAI] generation failed', err);
      // Fix 2: replace typing indicator with error bubble
      typingEl.remove();
      if (gen === this.genId) {
        const errBubble = this.appendBubble('assistant', '');
        errBubble.textContent = this.i18n.errorBody;
      }
    }
  }

  // ---- Exercise button -------------------------------------------------------

  private renderExerciseButton() {
    const skill = pickPrimarySkill(findSkillFiles());
    if (!skill) return;

    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'lai-ex-pill';
    pill.innerHTML =
      ICON.exercise +
      this.i18n.startExercise +
      '<span class="lai-ex-go" aria-hidden="true">→</span>';

    pill.addEventListener('click', () => {
      pill.disabled = true;
      void this.startExercise(skill);
    });

    this.body.appendChild(pill);
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
    this.activeExerciseBlock = exerciseBlock;

    // Silent trigger: not shown as a user bubble.
    const trigger =
      this.locale === 'it' ? "Inizia l'esercizio adesso." : 'Start the exercise now.';
    await this.send(trigger, { display: false, exerciseBlock });
  }

  // ---- Consent helpers -------------------------------------------------------

  private getConsentedModel(): string | null {
    try {
      const v = localStorage.getItem(CONSENT_KEY);
      return v && this.models.some((m) => m.id === v) ? v : null;
    } catch { return null; }
  }

  private setConsentedModel(id: string) {
    try { localStorage.setItem(CONSENT_KEY, id); } catch { /* ignore */ }
  }
}

function define() {
  if (!customElements.get('local-ai')) customElements.define('local-ai', LocalAI);
}
define();
document.addEventListener('astro:page-load', define);
