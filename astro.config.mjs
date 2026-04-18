// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://example.com', // TODO: sostituire con il dominio reale quando sarà pronto

  // Redirect della root alla lingua di default (coerente con le altre lingue
  // che hanno prefisso). In un sito statico Astro emette un meta refresh.
  redirects: {
    '/': '/it/',
  },

  integrations: [
    starlight({
      title: 'AI-Guide',
      description: "Impara a usare l'IA, dalle basi al livello avanzato.",

      // --- Localizzazione ---
      // Tutte le lingue hanno prefisso URL uniforme: /it/..., /en/..., etc.
      // Per aggiungere una lingua: aggiungere la voce in `locales` e creare
      // i file sotto `src/content/docs/<codice-lingua>/`.
      // Le pagine non tradotte ricadono automaticamente sulla lingua di default.
      defaultLocale: 'it',
      locales: {
        it: { label: 'Italiano', lang: 'it' },
        en: { label: 'English', lang: 'en' },
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
          label: 'Inizia qui',
          translations: { en: 'Start here' },
          slug: 'inizia-qui',
        },
        {
          label: 'Fondamenti',
          translations: { en: 'Fundamentals' },
          autogenerate: { directory: 'fondamenti' },
        },
        {
          label: 'Glossario',
          translations: { en: 'Glossary' },
          slug: 'glossario',
        },
      ],

      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
