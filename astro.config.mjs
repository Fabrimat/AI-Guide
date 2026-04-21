// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://ai-guide.larosa.work',

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
      // - Head:              view transitions + progress tracker + SA
      // - Header:             un singolo bottone "Preferenze" al posto
      //                       di ThemeSelect/LanguageSelect/SocialIcons
      // - MobileMenuFooter:  vuoto (theme+lang stanno nel popover header)
      // - PageSidebar:       TOC laterale rimosso (rumore visivo non utile)
      // - Pagination:        "Prossima lezione" come card singola
      // - PageTitle:         "X min di lettura" sotto l'H1 sulle lezioni
      // - Footer:            wrappa il default + link About + social
      // Theme e Language select di default di Starlight vengono reusati
      // dentro `HeaderPreferences` (import da virtual module), così la
      // loro logica custom element + persistence resta intatta.
      components: {
        Head: './src/components/Head.astro',
        Header: './src/components/Header.astro',
        Search: './src/components/Search.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        PageSidebar: './src/components/PageSidebar.astro',
        Pagination: './src/components/Pagination.astro',
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
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
          // Lista manuale (non `autogenerate`) per poter mostrare le
          // lezioni previste ma non ancora scritte come voci disabilitate
          // con badge "Presto" / "Soon". Quando una lezione viene
          // pubblicata, sostituire la sua voce placeholder con `{ slug: '...' }`.
          label: 'Everyday use',
          translations: { it: 'Uso quotidiano' },
          items: [
            { slug: 'everyday-use/ask-well' },
            { slug: 'everyday-use/iterate-the-conversation' },
            {
              label: 'Understand something complex',
              translations: { it: 'Capire una cosa complicata' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Summarize a long document',
              translations: { it: 'Riassumere un documento lungo' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Learn something new',
              translations: { it: 'Imparare un argomento nuovo' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Write better',
              translations: { it: 'Scrivere meglio' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Images and files',
              translations: { it: 'Foto, immagini e file' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'What not to do',
              translations: { it: 'Cose da NON fare' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
          ],
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
