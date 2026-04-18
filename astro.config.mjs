// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://example.com', // TODO: sostituire con il dominio reale quando sarà pronto

  // Niente redirect statico per `/`. La landing root è in `src/pages/index.astro`
  // e fa detection lato client della lingua del browser, così l'utente atterra
  // direttamente sulla versione coerente con `navigator.language`. Default EN.

  integrations: [
    starlight({
      title: 'AI-Guide',
      description: 'Learn how to use AI, from the basics to advanced.',

      // --- Localizzazione ---
      // Tutte le lingue hanno prefisso URL uniforme: /en/..., /it/..., etc.
      // Inglese è la lingua di default: le pagine senza traduzione ricadono
      // sull'inglese. Per aggiungere una lingua: aggiungere la voce in
      // `locales` e creare i file sotto `src/content/docs/<codice-lingua>/`.
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        it: { label: 'Italiano', lang: 'it' },
      },

      // Override dei componenti di Starlight:
      // - Head:         lock palette su light + view transitions
      // - ThemeSelect:  rimosso (sito ha una sola palette, "Pastello")
      // - PageSidebar:  TOC laterale rimosso (rumore visivo non utile)
      // - Pagination:   "Prossima lezione" come card singola, niente Prev
      // - PageTitle:    aggiunge "X min di lettura" sotto l'H1 sulle lezioni
      components: {
        Head: './src/components/Head.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        PageSidebar: './src/components/PageSidebar.astro',
        Pagination: './src/components/Pagination.astro',
        PageTitle: './src/components/PageTitle.astro',
      },

      // Sidebar: `slug` è locale-aware (si risolve automaticamente al file
      // giusto nella lingua corrente).
      sidebar: [
        {
          label: 'Start here',
          translations: { it: 'Inizia qui' },
          slug: 'start-here',
        },
        {
          label: 'Fundamentals',
          translations: { it: 'Fondamenti' },
          autogenerate: { directory: 'fundamentals' },
        },
        {
          label: 'Glossary',
          translations: { it: 'Glossario' },
          slug: 'glossary',
        },
      ],

      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
