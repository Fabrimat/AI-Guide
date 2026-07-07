# AI-Guide

A public site (built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)) that teaches how to use AI in Italian, from the basics to advanced topics. Content lives as Markdown/MDX lessons.

AI integration happens reader-side: every exercise or check-in is a plain-text `.txt` file under `public/skills/<locale>/` that the reader copies and pastes into their own LLM (Claude, ChatGPT, Gemini, and so on). There is no backend LLM.

The site also ships an optional in-browser local AI assistant (`src/components/LocalAI/`, built on Transformers.js + WebGPU) that runs entirely client-side, with no backend and no API key: the model downloads once from Hugging Face after explicit consent, then stays cached and works offline.

## Stack

- Astro 6 + Starlight, static output
- Content in Markdown / MDX under `src/content/docs/`
- Native Starlight i18n: Italian and English, both with a uniform URL prefix (`/it/...`, `/en/...`)
- Hosting: [Netlify](https://netlify.com), behind Cloudflare DNS as a reverse proxy

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321
npm run build     # build the static site into dist/
npm run preview   # serve dist/ locally
```

No linter or test suite is configured. The smoke test is `npm run build`: if it runs clean, the build is good.

Node version: 22, pinned in `.nvmrc` at the repo root.

## Content structure

```
src/
├── content/
│   └── docs/
│       ├── it/                     # Italian, served under /it/
│       │   └── fundamentals/
│       │       └── what-is-ai.mdx
│       └── en/                     # English mirror, served under /en/
│           └── fundamentals/
│               └── what-is-ai.mdx
├── components/                     # reusable + internal Astro components
├── styles/custom.css
└── content.config.ts                # frontmatter schema for docs
public/
└── skills/
    ├── it/                          # .txt exercise instructions, Italian
    └── en/                          # .txt exercise instructions, English
```

Slugs are in English everywhere, even for Italian pages (e.g. `/it/fundamentals/what-is-ai/`, `/it/start-here/`): the slug is a code identifier, not reader-facing text, so both locales can share the same sidebar configuration. Pages without a translation automatically fall back to the default locale (English). The root `/` is not a static redirect: it reads the visitor's browser language client-side and sends them to `/en/` or `/it/`, defaulting to `/en/` for no-JS visitors or unsupported languages.

## Adding a lesson

1. Create an `.mdx` file under `src/content/docs/it/<section>/<slug>.mdx` (use `.mdx` to be able to use components).
2. Minimum frontmatter, validated by `src/content.config.ts`:
   ```yaml
   ---
   title: Lesson title
   description: One sentence describing the lesson
   livello: principiante   # or: intermedio | avanzato
   prerequisiti: [other-lesson-slug]   # optional
   ---
   ```
3. If the lesson has a practice exercise or a review check-in, add an instructions file under `public/skills/it/<name>.txt` (plain text, no markdown) and use the `<LlmExercise>` component to expose it. See `CLAUDE.md` for the full component catalog and import depth.
4. Mirror the lesson under `src/content/docs/en/<section>/<slug>.mdx` (same path, English content) to add the translation, along with `public/skills/en/<name>.txt`.

## Notable features

- View transitions for SPA-like navigation and language switching without a visual reset.
- Estimated reading time under each lesson's title.
- A progress tracker that stores visits, reading state, and scroll position in `localStorage`, with no backend, no cookies, and no third-party analytics.
- Installable PWA with offline lessons: the whole manual (HTML, skill `.txt` files, and search index) can be downloaded for offline use.
- The in-browser local AI assistant described above, including a static, embeddings-based cross-lesson search (RAG) generated at build time.

This README stays intentionally short. For the full architecture, hosting/deploy workflow, visual direction, i18n conventions, and the complete component catalog, see `CLAUDE.md`. For the editorial roadmap (modules, lesson status, what's next), see `CONTENT.md`.

## Licensing

The code in this repository is licensed under the MIT License, see `LICENSE`.

The educational content under `src/content/` and `public/skills/` is licensed separately under CC BY 4.0, see `LICENSE-CONTENT`.

## Note for forks

This repository deploys to the author's own infrastructure: Netlify + Cloudflare + Simple Analytics on the `larosa.work` domain. The site footer also contains the author's personal links and VAT details. If you deploy your own copy, replace the hosting, analytics, domain, and social/contact configuration with your own.
