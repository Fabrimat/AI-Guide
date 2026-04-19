/**
 * Assisted reading (bionic-style): bolds the first few characters of
 * each word inside lesson content so readers can scan faster.
 *
 * Why: the target audience includes people who get fatigued reading on
 * screen. Bolded word-starts help the eye find word boundaries without
 * reading every letter. This is a display preference, not a reading
 * comprehension claim: research support is mixed, so we offer it as an
 * optional tool, off by default.
 *
 * Algorithm (chars bolded per word):
 *  1-3 chars: 1, 4-5: 2, 6-9: 3, 10+: 4.
 *
 * State:
 *  - `localStorage['aiguide:reading-mode']` = 'on' (or absent)
 *  - `<html>` gets `data-reading-mode="on"` when enabled.
 * The data-attribute is set pre-paint by an inline script in `Head.astro`
 * so the button can mirror the correct state without a FOUC.
 *
 * Scope: only text nodes inside `main .sl-markdown-content` that are
 * NOT inside `.not-content` subtrees, scripts, styles, code, pre, kbd,
 * samp, noscript, or existing bionic wraps. Header, sidebar, footer,
 * and custom components (`<LlmExercise>`, `<PromptBuilder>`, ...) are
 * untouched.
 *
 * DOM: each processed text node is replaced by a
 * `<span data-bionic-wrap>` that alternates `<b data-bionic>prefix</b>`
 * and `#text` tail for each word. Makes "reset" a trivial unwrap +
 * `normalize()`.
 *
 * Re-entrance: handles initial load and Astro view transitions via
 * `astro:page-load`. Idempotent: `collectTextNodes` rejects nodes
 * whose parent sits inside a `[data-bionic-wrap]`, so applying twice
 * to the same page is a no-op.
 */

const STORAGE_KEY = 'aiguide:reading-mode';
const WRAP_ATTR = 'data-bionic-wrap';
const BOLD_ATTR = 'data-bionic';
const EVENT_NAME = 'aiguide:reading-mode';
// `<html data-reading-mode="on">` → `dataset.readingMode`.
// `dataset` accepts only camelCase keys at runtime, so kebab-case would
// throw `Failed to set a named property … is not a valid property name`.

const EXCLUDED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'CODE',
  'PRE',
  'KBD',
  'SAMP',
  'NOSCRIPT',
  'TEXTAREA',
]);

// Word = letter/digit, possibly followed by letters/digits/internal
// apostrophes/hyphens. Uses Unicode property escapes so Italian
// accents (àèéìòù) and similar are recognised as letters.
const WORD_RE = /^[\p{L}\p{N}][\p{L}\p{N}'’\-]*$/u;
const SPLIT_RE = /(\s+|[^\p{L}\p{N}'’\-]+)/u;

function boldCount(len: number): number {
  if (len <= 3) return 1;
  if (len <= 5) return 2;
  if (len <= 9) return 3;
  return 4;
}

function acceptNode(node: Node): number {
  const parent = node.parentElement;
  if (!parent) return NodeFilter.FILTER_REJECT;
  if (EXCLUDED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
  if (parent.closest('.not-content')) return NodeFilter.FILTER_REJECT;
  if (parent.closest(`[${WRAP_ATTR}]`)) return NodeFilter.FILTER_REJECT;
  const text = node.nodeValue;
  if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
}

function getRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('main .sl-markdown-content');
}

function collectTextNodes(root: Element): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode,
  });
  const out: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

function bionifyNode(node: Text): void {
  const text = node.nodeValue ?? '';
  const parts = text.split(SPLIT_RE).filter((p) => p.length > 0);
  const wrap = document.createElement('span');
  wrap.setAttribute(WRAP_ATTR, '');
  for (const part of parts) {
    if (WORD_RE.test(part)) {
      const n = boldCount(part.length);
      const b = document.createElement('b');
      b.setAttribute(BOLD_ATTR, '');
      b.textContent = part.slice(0, n);
      wrap.appendChild(b);
      if (part.length > n) {
        wrap.appendChild(document.createTextNode(part.slice(n)));
      }
    } else {
      wrap.appendChild(document.createTextNode(part));
    }
  }
  node.parentNode?.replaceChild(wrap, node);
}

function apply(): void {
  const root = getRoot();
  if (!root) return;
  collectTextNodes(root).forEach(bionifyNode);
}

function reset(): void {
  const root = getRoot();
  if (!root) return;
  root
    .querySelectorAll<HTMLSpanElement>(`span[${WRAP_ATTR}]`)
    .forEach((span) => {
      const parent = span.parentNode;
      if (!parent) return;
      parent.replaceChild(
        document.createTextNode(span.textContent ?? ''),
        span,
      );
    });
  // After replaceChild, adjacent text nodes aren't merged. `normalize()`
  // merges them so the bionify path sees single text nodes on the next
  // enable, and the DOM stays tidy for screen readers.
  root.normalize();
}

export function isOn(): boolean {
  return document.documentElement.dataset.readingMode === 'on';
}

export function setState(on: boolean): void {
  if (on) {
    document.documentElement.dataset.readingMode = 'on';
    try {
      localStorage.setItem(STORAGE_KEY, 'on');
    } catch {
      /* localStorage disabled: state survives only the current page. */
    }
    apply();
  } else {
    delete document.documentElement.dataset.readingMode;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    reset();
  }
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: { on } }),
  );
}

export function toggle(): boolean {
  const next = !isOn();
  setState(next);
  return next;
}

export function applyIfEnabled(): void {
  if (isOn()) apply();
}
