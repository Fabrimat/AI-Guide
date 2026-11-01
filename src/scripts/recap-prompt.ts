/**
 * Shared logic for `<RecapWithAi>` and `<ReviewToday>`: find the lessons
 * the reader has read, work out which are due for spaced review, and
 * assemble the Socratic review prompt.
 *
 * Reads (never writes) the progress record and the journal. Lesson
 * summaries come from `/recap/<locale>.json` (same-origin static file,
 * built from the `<LessonSummary>` of each lesson). Everything degrades
 * gracefully: no JSON means titles only, no journal means no notes.
 */
import { PROGRESS_KEY, JOURNAL_KEY } from './storage-keys';

// Mirror di astro.config.mjs > locales e di src/pages/index.astro.
export const LOCALES = ['en', 'it'];
const LOCALE_RE = /^\/([a-z]{2})\//;

export type Livello = 'principiante' | 'intermedio' | 'avanzato';

export interface RecapEntry {
  path: string;
  title: string;
  livello: Livello;
  module: string;
  summary: string[];
}

export interface ReadLesson {
  /** Localized URL (current page locale), used for display and lookup. */
  url: string;
  title: string;
  /** Every progress-record key that maps to this lesson (IT and/or EN). */
  keys: string[];
  /** Latest review anchor among the keys: reviewedAt ?? readAt ?? lastVisit. */
  anchor: number;
  reviewStep: number;
}

export interface PromptStrings {
  intro: string;
  instructions: string;
  unmapped: string;
  levelBeginner: string;
  levelIntermediate: string;
  levelAdvanced: string;
  journalNote: string;
}

/** Days after the previous anchor at which review number 1, 2, 3 is due. */
export const REVIEW_INTERVAL_DAYS = [1, 4, 14];
const DAY_MS = 86_400_000;

export function humanize(title: string): string {
  return title.replace(/\s*\|\s*AI-Guide\s*$/, '').trim();
}

export function detectCurrentLocale(): string | null {
  const m = window.location.pathname.match(LOCALE_RE);
  return m && LOCALES.indexOf(m[1]) !== -1 ? m[1] : null;
}

function rewriteToLocale(url: string, locale: string | null): string {
  if (!locale) return url;
  return url.replace(LOCALE_RE, `/${locale}/`);
}

function loadProgress(): any {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function anchorOf(page: any): number {
  const iso = page?.reviewedAt ?? page?.readAt ?? page?.lastVisit;
  const ms = typeof iso === 'string' ? Date.parse(iso) : NaN;
  return Number.isFinite(ms) ? ms : 0;
}

/**
 * Lessons with `read: true`, re-routed to the locale of the current page
 * and deduplicated (the same lesson read in IT and EN counts once).
 */
export function loadReadLessons(): ReadLesson[] {
  const state = loadProgress();
  if (!state?.pages || typeof state.pages !== 'object') return [];

  const currentLocale = detectCurrentLocale();
  const titleMap = (window as any).__AIGUIDE_TITLES__ as
    | Record<string, string>
    | undefined;
  const byUrl = new Map<string, ReadLesson>();

  for (const url in state.pages) {
    // Only pages inside a module (locale + module + slug). Excludes
    // homepage `/it/` and orientation pages like `/en/start-here/`.
    const parts = url.split('/').filter(Boolean);
    if (parts.length < 3) continue;
    if (LOCALES.indexOf(parts[0]) === -1) continue;
    const page = state.pages[url];
    if (!page?.read || !page.title) continue;

    const targetUrl = rewriteToLocale(url, currentLocale);
    const existing = byUrl.get(targetUrl);
    const anchor = anchorOf(page);
    const step = Number.isFinite(page.reviewStep) ? Number(page.reviewStep) : 0;
    if (existing) {
      existing.keys.push(url);
      if (anchor > existing.anchor) existing.anchor = anchor;
      if (step > existing.reviewStep) existing.reviewStep = step;
      continue;
    }
    // Title preference: build-time map first (always localized), then the
    // title saved for the localized URL, then the title actually read.
    const buildTitle = titleMap?.[targetUrl];
    const localizedTitle = state.pages[targetUrl]?.title;
    byUrl.set(targetUrl, {
      url: targetUrl,
      title: humanize(buildTitle || localizedTitle || page.title),
      keys: [url],
      anchor,
      reviewStep: step,
    });
  }
  return [...byUrl.values()];
}

/** Read lessons whose next review (1, 4, then 14 days) has come. */
export function dueLessons(
  lessons: ReadLesson[],
  now: number = Date.now(),
): ReadLesson[] {
  return lessons.filter((l) => {
    const days = REVIEW_INTERVAL_DAYS[l.reviewStep];
    if (days === undefined || l.anchor <= 0) return false;
    return now - l.anchor >= days * DAY_MS;
  });
}

let recapCache: { locale: string; data: Promise<Map<string, RecapEntry> | null> } | null =
  null;

/** `/recap/<locale>.json` as a path -> entry map, or null if unavailable. */
export function fetchRecapData(locale: string): Promise<Map<string, RecapEntry> | null> {
  if (recapCache && recapCache.locale === locale) return recapCache.data;
  const data = fetch(`/recap/${locale}.json`)
    .then((res) => (res.ok ? res.json() : null))
    .then((list: unknown) => {
      if (!Array.isArray(list)) return null;
      const map = new Map<string, RecapEntry>();
      for (const e of list) {
        if (e && typeof e.path === 'string') map.set(e.path, e as RecapEntry);
      }
      return map;
    })
    .catch(() => null);
  recapCache = { locale, data };
  // Do not cache a failure: retry on the next click.
  data.then((r) => {
    if (r === null && recapCache?.data === data) recapCache = null;
  });
  return data;
}

type Journal = Record<string, Record<string, { text?: string }>>;

function loadJournal(): Journal {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? (parsed as Journal) : {};
  } catch {
    return {};
  }
}

function journalNotesFor(journal: Journal, url: string): string[] {
  const norm = (u: string) => u.replace(LOCALE_RE, '/');
  const target = norm(url);
  const notes: string[] = [];
  for (const key in journal) {
    if (norm(key) !== target) continue;
    const entries = journal[key];
    if (!entries || typeof entries !== 'object') continue;
    for (const file in entries) {
      const text = entries[file]?.text;
      if (typeof text === 'string' && text.trim()) notes.push(text.trim());
    }
  }
  return notes;
}

function levelLine(levels: Livello[], s: PromptStrings): string {
  if (levels.length === 0) return s.levelBeginner; // no data (fetch failed): keep the old beginner default
  const counts: Record<Livello, number> = {
    principiante: 0,
    intermedio: 0,
    avanzato: 0,
  };
  for (const l of levels) counts[l] += 1;
  // Majority wins; on a tie, the easier level (safer for the reader).
  let best: Livello = 'principiante';
  for (const l of ['intermedio', 'avanzato'] as Livello[]) {
    if (counts[l] > counts[best]) best = l;
  }
  if (best === 'principiante') return s.levelBeginner;
  if (best === 'intermedio') return s.levelIntermediate;
  return s.levelAdvanced;
}

export function buildRecapPrompt(
  s: PromptStrings,
  lessons: Array<{ url: string; title: string }>,
  data: Map<string, RecapEntry> | null,
): string {
  const journal = loadJournal();
  const levels: Livello[] = [];

  const sections = lessons
    .map((l) => {
      const entry = data?.get(l.url);
      if (entry?.livello) levels.push(entry.livello);
      const lines = [`**${l.title}**`];
      if (entry && entry.summary.length > 0) {
        for (const b of entry.summary) lines.push(`  - ${b}`);
      } else {
        lines.push(`  ${s.unmapped}`);
      }
      const notes = journalNotesFor(journal, l.url);
      if (notes.length > 0) {
        lines.push(`  ${s.journalNote}`);
        for (const n of notes) lines.push(`  - ${n.replace(/\s*\n\s*/g, ' ')}`);
      }
      return lines.join('\n');
    })
    .join('\n\n');

  const level = levelLine(levels, s);
  return [s.intro, sections, level, s.instructions]
    .filter((part) => part)
    .join('\n\n');
}

/** Read the prompt strings from the `data-i18n-*` attributes of a card. */
export function readPromptStrings(root: HTMLElement): PromptStrings {
  const d = root.dataset;
  return {
    intro: d.i18nPromptIntro || '',
    instructions: d.i18nPromptInstructions || '',
    unmapped: d.i18nUnmapped || '',
    levelBeginner: d.i18nLevelBeginner || '',
    levelIntermediate: d.i18nLevelIntermediate || '',
    levelAdvanced: d.i18nLevelAdvanced || '',
    journalNote: d.i18nJournalNote || '',
  };
}

/** `data-i18n-*` attributes both cards render, from the `t()` dictionary. */
export function promptAttrs(ui: {
  recapPromptIntro: string;
  recapPromptInstructions: string;
  recapUnmappedConcepts: string;
  recapLevelBeginner: string;
  recapLevelIntermediate: string;
  recapLevelAdvanced: string;
  recapJournalNote: string;
}): Record<string, string> {
  return {
    'data-i18n-prompt-intro': ui.recapPromptIntro,
    'data-i18n-prompt-instructions': ui.recapPromptInstructions,
    'data-i18n-unmapped': ui.recapUnmappedConcepts,
    'data-i18n-level-beginner': ui.recapLevelBeginner,
    'data-i18n-level-intermediate': ui.recapLevelIntermediate,
    'data-i18n-level-advanced': ui.recapLevelAdvanced,
    'data-i18n-journal-note': ui.recapJournalNote,
  };
}
