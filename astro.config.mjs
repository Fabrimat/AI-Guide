// @ts-check
import { execSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import AstroPWA from '@vite-pwa/astro';

// Build identity, iniettato in build come globali Vite. Servono al
// Footer per mostrare "v <sha> · <build-time>". Su Netlify il clone è
// poco profondo ma `git rev-parse HEAD` funziona comunque; in tarball
// senza .git ricadiamo su `dev` e timestamp del run.
const BUILD_SHA = (() => {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
})();
const BUILD_TIME = `${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`;

export default defineConfig({
  site: 'https://ai-guide.larosa.work',

  vite: {
    define: {
      __AIGUIDE_BUILD_SHA__: JSON.stringify(BUILD_SHA),
      __AIGUIDE_BUILD_TIME__: JSON.stringify(BUILD_TIME),
    },
  },

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
          // Lista manuale (non `autogenerate`) perché le lezioni non
          // hanno `sidebar.order` nel frontmatter e l'ordinamento
          // alfabetico non corrisponde all'ordine pedagogico.
          label: 'Everyday use',
          translations: { it: 'Uso quotidiano' },
          items: [
            { slug: 'everyday-use/ask-well' },
            { slug: 'everyday-use/iterate-the-conversation' },
            { slug: 'everyday-use/understand-something-complex' },
            { slug: 'everyday-use/summarize-a-long-document' },
            { slug: 'everyday-use/learn-something-new' },
            { slug: 'everyday-use/write-better' },
            { slug: 'everyday-use/images-and-files' },
            { slug: 'everyday-use/what-not-to-do' },
          ],
        },
        {
          // Modulo 3 (Sul lavoro) — non ancora scritto. Tutti placeholder
          // disabilitati con badge "Soon" / "Presto". Quando una lezione
          // viene pubblicata, sostituire la sua voce con `{ slug: 'at-work/<slug>' }`.
          label: 'At work',
          translations: { it: 'Sul lavoro' },
          items: [
            { slug: 'at-work/hard-emails' },
            { slug: 'at-work/draft-professional-documents' },
            { slug: 'at-work/prepare-a-meeting' },
            { slug: 'at-work/slides-and-presentations' },
            { slug: 'at-work/data-and-tables' },
            { slug: 'at-work/research-for-work' },
            { slug: 'at-work/ai-as-thinking-partner' },
            { slug: 'at-work/reuse-context-with-projects' },
            { slug: 'at-work/company-data-and-privacy' },
          ],
        },
        {
          label: 'For students',
          translations: { it: 'Per studenti' },
          items: [
            { slug: 'for-students/study-a-new-topic' },
            { slug: 'for-students/notes-from-lectures' },
            { slug: 'for-students/revise-before-an-exam' },
            { slug: 'for-students/write-a-thesis' },
            { slug: 'for-students/sources-and-citations' },
            { slug: 'for-students/translate-and-compare' },
            { slug: 'for-students/when-ai-tricks-you' },
            { slug: 'for-students/ethics-of-studying' },
          ],
        },
        {
          // Modulo 5 (Per docenti) — non ancora scritto.
          label: 'For teachers',
          translations: { it: 'Per docenti' },
          items: [
            {
              label: 'Design a lesson',
              translations: { it: 'Progettare una lezione' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Explain in five different ways',
              translations: { it: 'Spiegare in cinque modi diversi' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Differentiated materials',
              translations: { it: 'Materiali differenziati' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Inclusive materials (SEN)',
              translations: { it: 'Inclusività (BES e DSA)' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Generate assessment questions',
              translations: { it: 'Domande per verifiche' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Grading with criteria',
              translations: { it: 'Correggere con criterio' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Emails to families',
              translations: { it: 'Comunicare con le famiglie' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'When students use AI',
              translations: { it: "Quando lo studente usa l'IA" },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Ethics of teaching',
              translations: { it: 'Etica del docente' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
          ],
        },
        {
          // Modulo 6 (Per chi vuole di più) — non ancora scritto. Pubblico
          // tecnico. Lasciato come unico blocco da 13 voci per ora; se il
          // modulo crescerà, valutare lo split in "Core APIs" + "Beyond APIs".
          label: 'Going deeper',
          translations: { it: 'Per chi vuole di più' },
          items: [
            {
              label: 'From chats to APIs',
              translations: { it: 'Dalle chat alle API' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Choose the model',
              translations: { it: 'Scegliere il modello' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Context and tokens',
              translations: { it: 'Il contesto in token' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'System prompts and roles',
              translations: { it: 'System prompt e ruoli' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Tool use and structured output',
              translations: { it: 'Tool use, function calling, structured output' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'RAG: your own documents',
              translations: { it: "RAG: dare all'IA i tuoi documenti" },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Agents',
              translations: { it: 'Agenti' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'MCP and integrations',
              translations: { it: 'MCP e integrazioni' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Prompt injection and safety',
              translations: { it: 'Prompt injection e sicurezza' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Evals',
              translations: { it: 'Evals' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Costs and prompt caching',
              translations: { it: 'Costi e prompt caching' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'Privacy in APIs',
              translations: { it: 'Privacy e dati nelle API' },
              link: '#',
              badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
              attrs: { 'aria-disabled': 'true', tabindex: -1 },
            },
            {
              label: 'A mini end-to-end project',
              translations: { it: 'Mini progetto end-to-end' },
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
        {
          label: 'About',
          translations: { it: 'Chi sono' },
          slug: 'about',
        },
      ],

      customCss: ['./src/styles/custom.css'],
    }),
    AstroPWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false, // we register manually inside Head.astro
      manifest: {
        name: 'AI-Guide',
        short_name: 'AI-Guide',
        description: "Impara a usare l'IA, dai fondamenti al livello avanzato.",
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#E07A5F',
        background_color: '#FCEEE3',
        lang: 'en',
        icons: [
          { src: '/icons/pwa-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        globPatterns: [
          '**/*.{js,css,woff2,svg}',
          '_astro/**/*',
          'icons/*.png',
          'favicon.svg',
          'manifest.webmanifest',
          'en/offline/index.html',
          'it/offline/index.html',
        ],
        globIgnores: [
          '**/*.map',
          '**/sa/**',
          'sw.js',
          'workbox-*.js',
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
