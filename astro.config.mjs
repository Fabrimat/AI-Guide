// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://example.com', // TODO: sostituire con il dominio reale quando sarà pronto
  integrations: [
    starlight({
      title: 'AI-Guide',
      description: "Impara a usare l'IA, dalle basi al livello avanzato.",

      // --- Localizzazione ---
      // - `root` = lingua di default (italiano), servita alla root "/"
      // - `en`   = inglese, servito sotto "/en/"
      // Per tradurre una pagina basta creare un file con lo STESSO percorso
      // all'interno di `src/content/docs/en/`. Le pagine non tradotte
      // ricadono automaticamente sul contenuto in italiano (fallback).
      defaultLocale: 'root',
      locales: {
        root: { label: 'Italiano', lang: 'it' },
        en: { label: 'English', lang: 'en' },
      },

      // Transizioni SPA-like (niente flash quando cambi lingua/pagina)
      components: {
        Head: './src/components/Head.astro',
      },

      sidebar: [
        {
          label: 'Inizia qui',
          translations: { en: 'Start here' },
          link: '/inizia-qui/',
        },
        {
          label: 'Fondamenti',
          translations: { en: 'Fundamentals' },
          autogenerate: { directory: 'fondamenti' },
        },
      ],

      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
