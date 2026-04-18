/**
 * AI-Guide · progress tracker
 *
 * Privacy: tutto vive in `localStorage` del browser. Nessun dato lascia
 * mai il dispositivo dell'utente. Niente backend, niente analytics terze,
 * niente cookie. Per questo il sito non ha banner cookie.
 *
 * Cosa registra per pagina:
 *  - firstVisit / lastVisit (timestamp ISO)
 *  - visits (numero di volte aperta)
 *  - title (snapshot di document.title, serve a `<Resume>` per mostrare
 *    un titolo umano)
 *  - timeSpentMs (tempo cumulato a tab attiva)
 *  - scrolledToEnd (true se l'utente ha scrollato >= 80%)
 *  - read (true se >= 30s + scrolledToEnd, su pagine "leggibili")
 *  - buttons (conteggio click su Copia / Scarica / Apri / Riavvia /
 *    Prossima lezione)
 *
 * Stato globale:
 *  - lastVisitAt
 *  - lastUrl (l'ultima pagina "leggibile" che l'utente ha LASCIATO,
 *    aggiornato in pagehide/before-swap, NON al momento dell'arrivo —
 *    altrimenti `<Resume>` punterebbe sempre alla pagina corrente)
 */

export {};

interface PageRecord {
  firstVisit: string;
  lastVisit: string;
  visits: number;
  title: string;
  timeSpentMs: number;
  scrolledToEnd: boolean;
  read: boolean;
  buttons?: Record<string, number>;
}

interface ProgressState {
  version: 1;
  lastVisitAt: string;
  lastUrl: string | null;
  pages: Record<string, PageRecord>;
}

const STORAGE_KEY = 'aiguide:progress:v1';
const READ_TIME_MS = 15_000;
const READ_SCROLL_RATIO = 0.8;
const TICK_INTERVAL_MS = 5_000;

let pageActiveSince: number | null = null;
let perPageTeardown: (() => void) | null = null;

function defaults(): ProgressState {
  return {
    version: 1,
    lastVisitAt: new Date().toISOString(),
    lastUrl: null,
    pages: {},
  };
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed?.version !== 1) return defaults();
    return parsed as ProgressState;
  } catch {
    return defaults();
  }
}

function save(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage potrebbe essere pieno o disabilitato: procedi senza. */
  }
}

function isReadable(url: string): boolean {
  // Le pagine "leggibili" sono dentro a una locale e hanno almeno un
  // segmento dopo (es. /it/inizia-qui/, /it/fondamenti/cos-e-l-ia/).
  // Esclude la root "/" (che fa redirect) e il 404.
  const parts = url.split('/').filter(Boolean);
  if (parts.length < 2) return false;
  return parts[0] === 'it' || parts[0] === 'en';
}

function blank(now: string, title: string): PageRecord {
  return {
    firstVisit: now,
    lastVisit: now,
    visits: 0,
    title,
    timeSpentMs: 0,
    scrolledToEnd: false,
    read: false,
  };
}

function recordVisit(url: string, title: string) {
  const state = load();
  const now = new Date().toISOString();
  const existing = state.pages[url] ?? blank(now, title);
  existing.lastVisit = now;
  existing.visits += 1;
  existing.title = title || existing.title;
  state.pages[url] = existing;
  state.lastVisitAt = now;
  save(state);
}

function flushTimeAndScroll(url: string) {
  if (pageActiveSince === null) return;
  const now = Date.now();
  const elapsed = now - pageActiveSince;
  pageActiveSince = now;

  const state = load();
  const page = state.pages[url];
  if (!page) return;

  page.timeSpentMs += elapsed;

  const scrollMax =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollMax <= 0) {
    // Pagina più corta del viewport: considera "letta" appena entra.
    page.scrolledToEnd = true;
  } else {
    const ratio = (window.scrollY || 0) / scrollMax;
    if (ratio >= READ_SCROLL_RATIO) page.scrolledToEnd = true;
  }

  const justBecameRead =
    !page.read &&
    isReadable(url) &&
    page.timeSpentMs >= READ_TIME_MS &&
    page.scrolledToEnd;

  if (justBecameRead) {
    page.read = true;
  }

  state.pages[url] = page;
  save(state);

  if (justBecameRead) {
    syncSidebarCompletion();
  }
}

function commitLastUrl(url: string) {
  // Marca la pagina come "ultima lasciata" SOLO quando l'utente la
  // abbandona, e solo se è una pagina leggibile. Così `<Resume>` non
  // punta mai alla pagina corrente, e il redirect alla root non
  // sovrascrive lastUrl.
  if (!isReadable(url)) return;
  const state = load();
  state.lastUrl = url;
  save(state);
}

function buttonKey(target: HTMLElement): string | null {
  // LlmExercise "Copia il testo"
  if (target.closest('button[data-copy-src]')) return 'copy';
  // LlmExercise "Scarica"
  if (target.closest('a[download]')) return 'download';
  // LlmExercise "Apri"
  if (target.closest('a.btn-ghost[target="_blank"]')) return 'open';
  // ChatDemo "Riavvia"
  if (target.closest('[data-action="replay"]')) return 'replay';
  // Pagination "Prossima lezione"
  if (target.closest('a.next-lesson')) return 'next-lesson';
  // Resume widget "Continua"
  if (target.closest('a[data-resume-link]')) return 'resume-continue';
  return null;
}

function recordButtonClick(url: string, key: string) {
  const state = load();
  const page = state.pages[url];
  if (!page) return;
  page.buttons = page.buttons ?? {};
  page.buttons[key] = (page.buttons[key] ?? 0) + 1;
  state.pages[url] = page;
  save(state);
}

/**
 * Aggiunge la classe `lesson-completed` ai link del sidebar che puntano a
 * pagine marcate come `read` in localStorage. Il CSS in custom.css aggiunge
 * un checkmark verde dopo il titolo. Chiamata su page-load, dopo flush
 * (quando una pagina diventa "letta" mentre la stai leggendo), e quando
 * l'utente clicca "Cancella progressi" (via custom event).
 */
function syncSidebarCompletion() {
  const state = load();
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'nav.sidebar a[href]',
  );
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const page = state.pages[href];
    if (page?.read) {
      link.classList.add('lesson-completed');
    } else {
      link.classList.remove('lesson-completed');
    }
  });
}

function setupForCurrentPage() {
  if (perPageTeardown) {
    perPageTeardown();
    perPageTeardown = null;
  }

  if (typeof window === 'undefined') return;
  try {
    if (typeof localStorage === 'undefined') return;
  } catch {
    return;
  }

  const url = window.location.pathname;
  const title = document.title;
  recordVisit(url, title);
  syncSidebarCompletion();

  pageActiveSince =
    document.visibilityState === 'visible' ? Date.now() : null;

  function onVisibility() {
    if (document.visibilityState === 'visible') {
      pageActiveSince = Date.now();
    } else {
      flushTimeAndScroll(url);
      commitLastUrl(url);
      pageActiveSince = null;
    }
  }

  function onScroll() {
    flushTimeAndScroll(url);
  }

  function onPageHide() {
    flushTimeAndScroll(url);
    commitLastUrl(url);
  }

  function onClick(event: Event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const key = buttonKey(target);
    if (key) recordButtonClick(url, key);
  }

  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pagehide', onPageHide);
  document.addEventListener('click', onClick);

  const intervalId = window.setInterval(() => {
    if (document.visibilityState === 'visible') flushTimeAndScroll(url);
  }, TICK_INTERVAL_MS);

  perPageTeardown = () => {
    flushTimeAndScroll(url);
    commitLastUrl(url);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pagehide', onPageHide);
    document.removeEventListener('click', onClick);
    window.clearInterval(intervalId);
    pageActiveSince = null;
  };
}

setupForCurrentPage();
document.addEventListener('astro:page-load', setupForCurrentPage);
document.addEventListener('astro:before-swap', () => {
  // Persist e cleanup prima dello swap della view transition.
  if (perPageTeardown) {
    perPageTeardown();
    perPageTeardown = null;
  }
});

// Quando l'utente clicca "Cancella progressi" nel widget Resume, lo stato
// torna a zero: aggiorna il sidebar di conseguenza.
window.addEventListener('aiguide:progress-cleared', syncSidebarCompletion);
