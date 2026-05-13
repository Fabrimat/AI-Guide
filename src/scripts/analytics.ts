/**
 * Thin wrapper around Simple Analytics' `window.sa_event`.
 *
 * SA è caricato async solo in produzione (vedi `Head.astro`). In dev e
 * per chi blocca SA, `window.sa_event` non esiste: `track()` degrada a
 * no-op senza errori. Non lancia mai: un evento di analytics non deve
 * mai rompere un'azione UI dell'utente.
 *
 * Niente PII nei metadata. I valori che arrivano a Simple Analytics sono
 * etichette già pubbliche (nome del file di esercizio, network di
 * condivisione, conteggio lezioni completate, nome del termine del
 * glossario). La lista completa degli eventi tracciati vive in
 * `privacy.mdx` (IT + EN) per trasparenza con il lettore.
 */

type Metadata = Record<string, string | number | boolean>;

type SaWindow = Window & {
  sa_event?: (name: string, metadata?: Metadata) => void;
};

export function track(name: string, metadata?: Metadata): void {
  try {
    if (typeof window === 'undefined') return;
    const fn = (window as SaWindow).sa_event;
    if (typeof fn !== 'function') return;
    fn(name, metadata);
  } catch {
    /* swallow: analytics never breaks UI */
  }
}
