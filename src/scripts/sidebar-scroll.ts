/**
 * Su ogni navigazione, scrolla la sidebar di Starlight in modo che la
 * pagina corrente appaia in alto, invece di partire dal primo link
 * della sidebar. Sui manuali con tante voci, evita all'utente di
 * dover scrollare ogni volta per ritrovare il proprio segno.
 *
 * Container scrollabile: `#starlight__sidebar` (lo stesso che Starlight
 * usa per il restore via `sessionStorage['sl-sidebar-state']`).
 * Link attivo: `a[aria-current="page"]` dentro il container.
 *
 * Sovrascrive intenzionalmente il restore di Starlight: "pagina corrente
 * in alto" è il comportamento richiesto, anche dopo back/forward.
 *
 * Se la pagina corrente è dentro un `<details>` collassato (l'utente lo
 * ha chiuso esplicitamente, scelta che Starlight persiste in
 * sessionStorage), non forzo l'apertura: niente da scrollare, rispetto
 * la scelta dell'utente.
 *
 * Su mobile la sidebar vive in un overlay non scrollabile finché non
 * viene aperto. Il codice gira comunque: setta `scrollTop` su un
 * elemento non scrollabile è no-op.
 */
const TOP_PADDING_PX = 8;

function scrollSidebarToActiveLink(): void {
  const scroller = document.getElementById('starlight__sidebar');
  if (!scroller) return;

  const active = scroller.querySelector<HTMLAnchorElement>(
    'a[aria-current="page"]',
  );
  if (!active) return;

  // `<details>` chiuso = link non visibile (display:none). `getBoundingClientRect`
  // su un nodo nascosto ritorna zeri e produrrebbe uno scroll a 0 spurio.
  const detailsAncestor = active.closest('details');
  if (detailsAncestor && !detailsAncestor.open) return;

  const scrollerRect = scroller.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const target = activeRect.top - scrollerRect.top + scroller.scrollTop - TOP_PADDING_PX;

  scroller.scrollTop = Math.max(0, target);
}

function run(): void {
  // Un frame di attesa, così lo script inline di Starlight (che
  // ripristina lo scroll da sessionStorage) ha già girato e il layout
  // è stabile. Poi sovrascriviamo con la nostra logica.
  requestAnimationFrame(scrollSidebarToActiveLink);
}

run();
document.addEventListener('astro:page-load', run);
