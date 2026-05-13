/**
 * Su ogni navigazione, scrolla la sidebar di Starlight in modo che il
 * modulo della pagina corrente appaia in alto, invece di partire dal
 * primo link della sidebar. Sui manuali con tante voci, evita all'utente
 * di dover scrollare ogni volta per ritrovare il proprio segno.
 *
 * Target dello scroll: il `<details>` antenato del link attivo (il
 * modulo, es. "Fondamenti", "Sul lavoro"). Così il lettore vede prima
 * il nome del modulo, poi le sue lezioni, con la corrente già in vista.
 * Per le pagine top-level senza modulo (Start here, Glossary, About) il
 * fallback è il link stesso.
 *
 * Container scrollabile: `#starlight__sidebar` (lo stesso che Starlight
 * usa per il restore via `sessionStorage['sl-sidebar-state']`).
 * Link attivo: `a[aria-current="page"]` dentro il container.
 *
 * Sovrascrive intenzionalmente il restore di Starlight: "modulo corrente
 * in alto" è il comportamento richiesto, anche dopo back/forward.
 *
 * Su mobile la sidebar vive in un overlay non scrollabile finché non
 * viene aperto. Il codice gira comunque: settare `scrollTop` su un
 * elemento non scrollabile è no-op.
 */
const TOP_PADDING_PX = 8;

function scrollSidebarToCurrentModule(): void {
  const scroller = document.getElementById('starlight__sidebar');
  if (!scroller) return;

  const active = scroller.querySelector<HTMLAnchorElement>(
    'a[aria-current="page"]',
  );
  if (!active) return;

  // Il modulo è il `<details>` antenato. Per le pagine top-level senza
  // modulo (Start here, Glossary, About), il `<details>` non c'è: scroll
  // al link stesso. `<summary>` di un details chiuso resta visibile, quindi
  // non c'è il problema di rect=0 che avremmo avuto puntando al link.
  const target: HTMLElement = active.closest('details') ?? active;

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const scrollTo =
    targetRect.top - scrollerRect.top + scroller.scrollTop - TOP_PADDING_PX;

  scroller.scrollTop = Math.max(0, scrollTo);
}

function run(): void {
  // Un frame di attesa, così lo script inline di Starlight (che
  // ripristina lo scroll da sessionStorage) ha già girato e il layout
  // è stabile. Poi sovrascriviamo con la nostra logica.
  requestAnimationFrame(scrollSidebarToCurrentModule);
}

run();
document.addEventListener('astro:page-load', run);
