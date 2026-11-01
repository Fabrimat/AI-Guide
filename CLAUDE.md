# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**AI-Guide** is a public site (Astro + Starlight) that teaches how to use AI in Italian, from the basics to advanced level. The content is educational Markdown/MDX files. AI integration happens reader-side: every exercise or check-in is a `.txt` file in `public/skills/` (plain text, no markdown) that the reader copies and pastes into their own LLM (Claude, ChatGPT, Gemini, etc.).

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321
npm run build     # build the static site into dist/
npm run preview   # serve dist/ locally
```

No linter/test configured at the moment. The "smoke test" is `npm run build`: if it runs clean, the build is OK.

## Hosting and deploy

**Hosting**: [Netlify](https://netlify.com), free tier. Static site,
server-side build from a Git push. Astro is auto-detected (`npm run build`,
output in `dist/`).

**DNS / domain**: `ai-guide.larosa.work`. The `larosa.work` domain is
managed on Cloudflare DNS. CNAME record `ai-guide` → the project's
Netlify domain, in **proxied (orange cloud)** mode. Cloudflare
acts as a reverse proxy in front of Netlify: it terminates TLS on the
visitor's side with its own certificate and opens a separate one toward
Netlify. For this to work, Cloudflare's SSL mode must be **Full** or **Full
(strict)** (Settings → SSL/TLS), otherwise Netlify refuses the connection
or a redirect loop is created. In this mode Cloudflare sees the visitor's IP,
does caching/CDN/anti-DDoS, and is the layer described in `privacy.mdx` →
"Cloudflare in front of the site".

**Branch strategy**:

- `main`: development. Netlify is **not** hooked up to `main`: pushing
  here triggers no deploy (neither preview nor live). It's only used to
  accumulate commits before shipping them live.
- `production`: production. This is the only branch Netlify deploys, and it
  goes live at `ai-guide.larosa.work`. Fast-forward only from `main`, never
  direct commits.

**Workflow to go live:**

```bash
# You develop on main and push (no deploy starts from here)
git push origin main

# When you want to go live
git checkout production
git merge --ff-only main
git push origin production     # → deploy live
git checkout main
```

`--ff-only` avoids accidental merge commits. If the merge isn't
a fast-forward, something is off (rebase, divergence): investigate
before forcing it.

So there's no shortcut for "push to generate a preview": either you
go straight to `production` (which is live, not a preview), or you
test locally with `npm run dev` / `npm run preview`.

**Build-time env vars**: none required. The site is completely
static and doesn't read secrets at build time.

**Runtime env vars**: zero, it's static.

**Node version**: 26 (Astro 7 needs >= 22.23.4), pinned in `.nvmrc` at the repo root. Netlify
and local nvm/fnm respect it automatically.

**No Cloudflare Pages**: tried and abandoned due to friction in
their UI during a transition period (Workers Builds + internal tokens that
kept invalidating). Don't try again without a strong reason.

**Cloudflare Worker `sa-proxy`** (`workers/sa-proxy/`): first-party
proxy for Simple Analytics. The SA script loaded from the official
CDN is blocked by many adblockers by domain; serving it from
`ai-guide.larosa.work/sa/proxy.js` makes it invisible to blocklists.
The Worker forwards `/sa/proxy.js`, `/sa/auto-events.js`, `/sa/simple/*`
to the corresponding Simple Analytics endpoints, stripping headers with the
visitor's IP before forwarding. Deploy: `cd workers/sa-proxy && npx
wrangler deploy` (requires `npx wrangler login` the first time). The
Worker is bound to the route `ai-guide.larosa.work/sa/*` on the zone
`larosa.work`; all other traffic keeps going to
Netlify. See `workers/sa-proxy/README.md` for details. If the
analytics provider changes or the script in `Head.astro` is touched,
update this Worker too.

## Content writing rules

Before writing or editing any page in `src/content/docs/`, read
**`.claude/skills/voice-guide/SKILL.md`** in full. It's the project's
voice guide and contains the complete list of patterns to avoid.

Non-negotiable rules (excerpt):

1. **Zero em dash (—).** Never. Use a comma, colon, parentheses, or split the sentence.
2. **Zero Italian AI jargon**: no `panorama`, `scenario`, `cruciale`, `dirompente`, `sinergia`, `ecosistema`, `mindset`, `strategico`, `imprescindibile`, `paradigmatico`.
3. **Zero corporate buzzwords**: no `un vero e proprio`, `a 360 gradi`, `in un'ottica di`, `di fatto`, `a tutti gli effetti`, `di eccellenza`.
4. **Zero impersonal AI passive voice**: no `si ritiene`, `si osserva`, `va notato che`.
5. **Zero bureaucratic formulas**: no `al fine di` (use `per`), `in merito a`, `per quanto concerne`.
6. **Zero bureaucratic verbs**: no `optare`, `usufruire`, `effettuare`, `porre in essere`.
7. **Zero textbook closings**: no `In conclusione`, `In sintesi`, `In definitiva`, `Per concludere`.
8. **Zero hype openings**: no `In un mondo in cui…`, `Nell'era digitale…`, `Oggigiorno…`.

For the full detail (universal patterns, Italian-specific patterns, authenticity checks, checklist), see `.claude/skills/voice-guide/SKILL.md`.

## Lesson frontmatter

Every lesson in `src/content/docs/` (excluding `index.mdx` and meta pages) must have:

```yaml
---
title: Titolo
description: Una frase
livello: principiante | intermedio | avanzato
prerequisiti: [slug-altra-lezione]    # opzionale
---
```

The schema is validated in `src/content.config.ts`.

## Architecture (high level)

- **Astro 6 + Starlight**: static site, MD/MDX content in `src/content/docs/<language>/`.
- **Native Starlight i18n with a uniform prefix**: every language has a prefixed URL (`/en/...`, `/it/...`). The root `/` is not a static redirect: `src/pages/index.astro` reads `navigator.languages` and replaces the URL toward `/en/` or `/it/` client-side. Default and fallback (no-JS or unsupported language): `/en/`. Pages without a translation automatically fall back to English.
- **View transitions enabled** via an override of the `Head` component (`src/components/Head.astro`). They allow SPA-like navigation and language switching without a visual reset.
- **Estimated reading time** under each lesson's H1, computed client-side by `src/components/ReadingTime.astro` (220 words/minute over the text of `.sl-markdown-content`). Injected by the `PageTitle` override (`src/components/PageTitle.astro`) only on pages with `livello` in the frontmatter, so the splash hero doesn't get it.
- **Reusable components in `src/components/`**: see the "Project components" section below.
- **Progress tracker** (`src/scripts/progress.ts`): loaded via `Head.astro` on every page. Records visits/time/scroll/reads/button clicks in `localStorage` (key `aiguide:progress:v1`). **No backend, no cookies, no third-party analytics: everything stays in the user's browser.** The `<Resume>` component (see catalog below) consumes it to show "Resume where you left off".
- **Sidebar auto-scroll** (`src/scripts/sidebar-scroll.ts`): loaded via `Head.astro`. On every navigation it scrolls `#starlight__sidebar` so that the **current module** (the `<details>` ancestor of the `a[aria-current="page"]` link) sits at the top, with 8px of padding. For top-level pages without a module (Start here, Glossary, About) the fallback is the link itself. It intentionally overrides Starlight's own scroll restore.
- **"Preferences" popover in the header** (`src/components/Header.astro` + `src/components/HeaderPreferences.astro`): override of Starlight's Header, a single sliders button that opens a popover with three labeled sections (Assisted reading + description, Theme, Language). The Theme and Language selects are reused unchanged from Starlight via a virtual import (`virtual:starlight/components/ThemeSelect` and `.../LanguageSelect`), so they keep their custom element logic + persistence. `MobileMenuFooter` is overridden to be empty: theme and language live in the popover, which stays visible on mobile too.
- **Assisted reading** (`src/scripts/reading-mode.ts`): on/off toggle inside the "Preferences" popover. The script walks the text nodes inside `main .sl-markdown-content` (it doesn't touch header/sidebar/footer/components with `.not-content`) with a `TreeWalker` and replaces them with `<span data-bionic-wrap>` containing `<b data-bionic>` (1-4 leading characters of the word, tiered by length) + the remaining text; turning it off unwraps and calls `normalize()`. The preference is persisted in `localStorage['aiguide:reading-mode']`, its state mirrored pre-paint in `<html data-reading-mode="on">` by an inline script in `Head.astro`. Re-applied on `astro:page-load` for view transitions.
- **Lesson sharing** (`src/components/ShareLesson.astro`): a row of icons (X, LinkedIn, WhatsApp, email, copy link) auto-injected by the `Footer.astro` override right before the "Next lesson" card. It only appears on pages with `livello` in the frontmatter (= lessons), absent on homepage/about/privacy/glossary/404. Intent URLs only (`twitter.com/intent/tweet`, `linkedin.com/sharing/share-offsite`, `wa.me/?text=`, `mailto:`), no SDK or tracker.
- **Installable PWA and offline lessons** (`src/sw.ts`, `src/components/InstallApp.astro`, the `@vite-pwa/astro` integration in `astro.config.mjs`). The site is installable as a Progressive Web App on Chrome/Edge desktop, Chrome Android, and iOS Safari (via "Add to Home Screen"). Two-tier caching:
  - **Layer 1**: Workbox precaches the "shell" (JS, CSS, fonts, icons, manifest, `/offline/` pages) for anyone visiting the site, even without installing. Atomic, ~200-500 KB.
  - **Layer 2**: a bulk download of the whole manual (IT+EN lesson HTML, `.txt` from `public/skills/<lang>/`, the full Pagefind index) handled manually by the SW. The list lives in `dist/aiguide-bulk-manifest.json`, generated at build time by `scripts/generate-bulk-manifest.mjs`. The SW fetches it on every trigger (`AIGUIDE_BULK_DOWNLOAD` postMessage), idempotently skips files already in cache, downloads the missing ones, and prunes stale entries. Triggers: `appinstalled` event, every `astro:page-load` if in `display-mode: standalone`, `online` event if standalone. Resumes automatically after an interruption.
  - **Update strategy**: `registerType: 'autoUpdate'` with `skipWaiting()` + `clients.claim()`. Silent updates on the next navigation event. Astro's content hashing of assets plus Workbox's revision hashing make updates incremental: only changed files get re-downloaded.
  - **"Install the app" button**: in `HeaderPreferences.astro`, the fourth section of the popover. Chrome/Edge/Android: captures `beforeinstallprompt`. iOS: opens a step-by-step instructions modal. Already installed (`display-mode: standalone` or `navigator.standalone`): the button is hidden, showing an "App installed · ready offline" status + a progress bar during the bulk download.
  - **`/offline/` pages**: `src/content/docs/<lang>/offline.mdx`, shown as a fallback only for navigation requests to a URL not in cache. Localized in IT/EN, chosen by the SW based on the path of the requested document.
  - **PWA icons**: generated at `prebuild` by `scripts/generate-pwa-icons.mjs` (rasterizes `public/favicon.svg` with `sharp` at standard 192/512/180 plus a 512 maskable icon with an Android safe zone). Output in `public/icons/`.
  - **Deploy headers**: `public/_headers` (Netlify) sets `Cache-Control: max-age=0, must-revalidate` for `/sw.js`, `/registerSW.js`, and `/aiguide-bulk-manifest.json`: otherwise Cloudflare/Netlify might serve a stale version of the SW and block updates.
  - `<InstallApp>` is an **internal** component, mounted only inside `HeaderPreferences.astro`. It does NOT go in the "Project components" catalog (that one only catalogs components reusable from `.mdx` lessons).
  - The SW doesn't intercept `/sa/**` (Simple Analytics): that traffic keeps passing through the `sa-proxy` Worker on Cloudflare and reaching SA in real time, even with the PWA active.

## Local AI assistant (in-browser)

`src/components/LocalAI/` adds an assistant that runs entirely
in the browser, mounted on every page by `Footer.astro`. No backend,
no API key: the model downloads once from a third-party CDN
(Hugging Face) **only after explicit consent**, then stays cached
(Cache API) and runs offline. `ChatPanel.astro` renders the launcher + drawer
and passes strings/config via `data-*`; `chat-ui.ts` is the `<local-ai>`
custom element that drives the state machine (consent → download with
progress → ready, or a no-WebGPU fallback / error with retry on the
lightweight model); `lesson-context.ts` extracts the text of the
current lesson (budget ~1500 tokens); `skill-loader.ts` reads the check-in
`.txt` files from the `<LlmExercise>` cards (via `data-file`/`data-variant`)
and runs the exercise interactively. Consent is persisted in
`localStorage['aiguide:localai:consent']` (value = model id).
No conversation is ever saved or sent anywhere. It's an addition: the
Copy/Download/Open buttons of `<LlmExercise>` stay in place.

Engine: the chat runs on `@huggingface/transformers` (Transformers.js, ONNX +
WebGPU), the same runtime as the RAG embedder: no more `@mlc-ai/web-llm`.
`gen-worker.ts` hosts the `text-generation` pipeline in a Web Worker;
`chat-engine.ts` drives it (load/generate/dispose + ready/active state);
`chat-ui.ts` consumes it. Models (ONNX, `onnx-community`): Qwen2.5 0.5B (`q4`,
~0.4 GB), Qwen2.5 1.5B, and Gemma 4 E2B (`q4f16`). `model-cache.ts` inspects the
Cache API (`transformers-cache`) for status/deletion (Transformers.js doesn't
expose `hasModelInCache`). Streaming uses `TextStreamer`.

The `gen-worker-*` chunk and the `@huggingface/transformers` dependencies are
excluded from the PWA precache via `injectManifest.globIgnores`, otherwise Workbox
(injectManifest mode) fails the build on files over 2 MiB. The SW doesn't
intercept either these chunks or the model weights from Hugging Face
(cross-origin): no `registerRoute` matches them. It's an **internal**
component, it does NOT go in the "Project components" catalog.

Cross-lesson search (RAG): `search-context.ts` no longer uses Pagefind but a
static embeddings index. At build time `scripts/generate-embeddings.mjs`
(a `postbuild` step, **non-fatal**: if it fails it doesn't break the build) reads
the MDX lessons, splits them by H2 section, embeds them with `multilingual-e5-small`
via `@huggingface/transformers`, and writes `dist/embeddings/<locale>.json`. At
runtime `embedder.ts` lazy-loads Transformers.js (only inside the chat
flow, after consent; WASM backend) and embeds the question;
`search-context.ts` runs cosine similarity and passes the most relevant
lessons to the prompt. The index is served from our own domain (Cloudflare
cache); the embedder model comes from the Hugging Face CDN, on demand. None of this is in the
PWA precache: the client `transformers` chunk is excluded via `globIgnores`
(like the chat engine chunks) and the index doesn't go into the bulk manifest.
Pagefind remains only for the Ctrl+K search in `Search.astro`.

Panel UI: `ChatPanel.astro` uses `<style is:global>` with `local-ai `-prefixed
selectors (elements created at runtime by `chat-ui.ts` don't get the
scoping `data-astro-cid`, same as `Search.astro`). The AI's
responses are rendered as markdown by `markdown.ts`
(escape-then-format, XSS-safe). History is per-lesson in
`localStorage['aiguide:localai:chat:<path>']` (via `history.ts`, capped at 50
messages), with a "New chat" button that clears it. The model manager
(`model-cache.ts`) shows the status per model (active / cached / not
downloaded) by inspecting the Cache API directly (`transformers-cache`),
allows switching (via `disposeEngine()`: unload + terminate of the
previous worker before loading the new one) and deleting from the cache. All
visible strings live in `src/i18n/ui.ts` (it + en).

## Visual direction: Quaderno & Lavagna

The site is designed for a non-technical, mixed-age audience with preconceptions about AI/technology. The metaphor: **you learn the way you learned at school, without grades**. Light mode is the Italian squared exercise book ("quaderno a quadretti"): cool paper, a faint blue 5mm grid, a pink margin line, blue biro ink, the teacher's red pen, a yellow highlighter. Dark mode is the classroom blackboard ("lavagna"): green slate, chalk text, coloured chalks in place of ink, pen and highlighter. The design is a "friendly exercise book", not "corporate documentation".

**Light palette, quaderno (CSS vars in `src/styles/custom.css`)**:

| Token                       | Value      | Use                                                  |
|-----------------------------|------------|------------------------------------------------------|
| `--sl-color-bg`             | `#F7F8F4`  | page background (paper, cool off-white, not cream); also nav and sidebar |
| `--sl-color-text`           | `#23272E`  | main text (graphite)                                 |
| `--sl-color-white`          | `#16191E`  | "strong text" (Starlight naming): darkest graphite   |
| `--sl-color-black`          | `#FFFFFF`  | "light bg" (Starlight naming): paper-raised          |
| `--sl-color-text-accent`    | `#1E3A8A`  | links in body text (biro)                            |
| `--sl-color-text-invert`    | `#F7F8F4`  | text on biro fills (paper)                           |
| `--sl-color-accent`         | `#1E3A8A`  | accent, primary buttons, focus ring (biro)           |
| `--sl-color-accent-low`     | `#DCE5F7`  | pale ink wash (table headers, badges)                |
| `--sl-color-accent-high`    | `#162C6B`  | deeper ink: text on accent-low, hover                |
| `--sl-color-bg-inline-code` | `#E6ECF2`  | inline code chip                                     |
| `--sl-color-gray-1..7`      | `#16191E` `#23272E` `#5B6470` `#8B939D` `#CBD5E0` `#EDF1F4` `#FFFFFF` | graphite to white; gray-3 = pencil (muted text) |
| `--sl-color-hairline`       | `#CBD5E0`  | borders (`-light` `#DCE4EC` = the grid colour, `-shade` `#AEBBC9` = slip borders) |

**Dark palette, lavagna**:

| Token                       | Value      | Use                                    |
|-----------------------------|------------|----------------------------------------|
| `--sl-color-bg`             | `#1F2B27`  | page background (slate); also nav and sidebar |
| `--sl-color-text`           | `#ECEDE6`  | main text (chalk)                      |
| `--sl-color-white`          | `#FAFAF5`  | strong text (chalk-strong)             |
| `--sl-color-black`          | `#27362F`  | raised slate                           |
| `--sl-color-text-accent`    | `#A9C1F2`  | links in body text (chalk blue)        |
| `--sl-color-text-invert`    | `#1F2B27`  | text on chalk-blue fills (slate)       |
| `--sl-color-accent`         | `#A9C1F2`  | accent, primary buttons, focus ring    |
| `--sl-color-accent-low`     | `#2E3E55`  | deep blue-slate wash                   |
| `--sl-color-accent-high`    | `#D6E2FA`  | lighter chalk: text on accent-low, hover |
| `--sl-color-bg-inline-code` | `#2E3F38`  | inline code chip                       |
| `--sl-color-gray-1..7`      | `#FAFAF5` `#ECEDE6` `#9AA79F` `#6B7A72` `#3B4C45` `#24312C` `#1F2B27` | chalk to slate; gray-3 = chalk dust (muted text) |
| `--sl-color-hairline`       | `#3B4C45`  | borders (`-light` `#33433C`, `-shade` `#4E6158`) |

Measured contrast (WCAG): light body 14.0:1, links 9.7:1, muted 5.6:1 on paper (4.7:1 on a grid line, 6.0:1 on white slips), paper on biro 9.7:1. Dark body 12.4:1, links 8.1:1, muted 5.9:1 (5.1:1 on raised slate), slate on chalk blue 8.1:1.

**Custom `--aig-*` tokens**: used by components instead of hardcoded colours, so both themes work without touching every file. Values are light / dark.

| Token                    | Light / Dark                 | Use                                                |
|--------------------------|------------------------------|----------------------------------------------------|
| `--aig-elevated-bg`      | `#FFFFFF` / `#27362F`        | cards, popovers, modals: "slips of paper" on the grid |
| `--aig-elevated-bg-warm` | `#FCFCFA` / `#26332E`        | `:::note` aside (quieter slip; the name is historical) |
| `--aig-caution-bg/border/text` | `#FBF3B0` `#8A6D00` `#6B5400` / `#33372A` `#C9B654` `#F2E38A` | `:::caution` aside (highlighter) |
| `--aig-danger-bg/border/text`  | `#FCE8EA` `#B3122A` `#B3122A` / `#3A2D2E` `#F29C9C` `#F29C9C` | `:::danger` aside, review/check-in, errors (red pen) |
| `--aig-success-bg/border/text` | `#E4F1E7` `#2D6E45` `#2D6E45` / `#26392E` `#A8D5A2` `#A8D5A2` | custom green variant: wrap a `:::note` in `<div class="aig-success-wrap">…</div>` (Starlight has no native `success` type) |
| `--aig-shadow-color`     | `35, 39, 46` / `0, 0, 0`     | rgb triplet; use it only through `--aig-shadow-hard` |
| `--aig-shadow-hard`      | `3px 3px 0` at .18 / at .4   | the only allowed shadow, for things that float (popovers, dialogs) |
| `--aig-scrim`            | graphite .45 / near-black .7 | backdrop of modal `<dialog>`s                      |
| `--aig-hover-wash`       | highlighter .4 / chalk yellow .12 | hover wash on ghost / minimal buttons         |
| `--aig-on-accent`        | `#F7F8F4` / `#1F2B27`        | text on accent fills (primary buttons, user chat bubble): paper on biro 9.7:1, slate on chalk blue 8.1:1 |
| `--aig-accent-hover`     | `#162C6B` / `#C9D8F7`        | hover background of accent buttons (12.3:1 / 10.2:1 with on-accent) |
| `--aig-switch-track-off` / `--aig-switch-thumb` | `#8B939D` `#FFFFFF` / `#7C8C84` `#ECEDE6` | toggle switch |
| `--aig-code-bg` / `--aig-code-text` | `#1F2B27` `#ECEDE6` / `#16201D` `#ECEDE6` | code inside AI chat bubbles (a small piece of blackboard) |
| `--aig-ink`              | `#1E3A8A` / `#A9C1F2`        | biro / chalk blue: practice variant, primary ink   |
| `--aig-red-pen`          | `#B3122A` / `#F29C9C`        | review, check-in, corrections, errors              |
| `--aig-green-ok`         | `#2D6E45` / `#A8D5A2`        | success, "bravo", ticks                            |
| `--aig-highlighter`      | `#F5E663` / `#F2E38A`        | the signature mark; a background, never a text colour |
| `--aig-highlighter-wash` | highlighter .6 / chalk yellow .14 | link hover                                    |
| `--aig-on-highlighter`   | `#16191E` / `#1F2B27`        | text on the opaque highlighter (selection in light) |
| `--aig-highlight-stroke` | SVG data URI per theme       | the irregular swipe image (opaque yellow in light, translucent chalk in dark) |
| `--aig-heading`          | `#1E3A8A` / `#FAFAF5`        | heading ink                                        |
| `--aig-grid-line`        | `#DCE4EC` / transparent      | the 5mm grid                                       |
| `--aig-margin-line`      | `#EBA9B1` / chalk .16        | the notebook margin rule                           |
| `--aig-font-hand`        | Shantell Sans stack          | handwritten voice only (see Typography)            |
| `--aig-radius` / `--aig-border-width` | `6px` / `1.5px` | shape of inputs, buttons, cards, slips             |

**Biro buttons**: primary = `background: var(--sl-color-accent)`, `color: var(--aig-on-accent)`, hover `background: var(--aig-accent-hover)`. Secondary = transparent with a `var(--aig-border-width)` solid `var(--sl-color-accent)` border, accent text. Ghost = text only, hover `background: var(--aig-hover-wash)`. Radius `var(--aig-radius)`, never pills. Never put graphite/chalk body text on the accent fill: use `--aig-on-accent`.

When adding a component with a "white" background or shadows, use these tokens, don't hardcode `#ffffff` or `rgba(...)`. No soft drop shadows: slips are separated by a `1.5px` border; only floating things get `var(--aig-shadow-hard)`.

**The signature: the highlighter swipe.** A slightly irregular yellow stroke (yellow chalk in dark) marks: the current page in the sidebar (`nav.sidebar a[aria-current='page']`), the lesson H1 (a swipe under its lower part), `<Def>` terms on hover/open, and text `::selection`. It is the one place the design is bold; keep the rest quiet. The one orchestrated motion of the site: on page load the H1 swipe draws left to right once (~600ms, ease-out); under `prefers-reduced-motion: reduce` it is simply there. No other ambient or entrance animations. Reusable utilities in `custom.css`: `.aig-highlight` (swipe under the lower part of inline text), `.aig-highlight--full` (whole line height), `.aig-highlight--draw` (draw once, motion-safe), `.aig-hand` (handwritten font).

**Surfaces**: the page body is squared paper (two repeating gradients at `1.25rem` pitch, light only); dark is flat slate with one faint chalk smudge. Header and sidebar are plain paper/slate without grid. At `>= 50rem` a 2px margin rule (`--aig-margin-line`) runs down the left of the lesson column (`main .content-panel > .sl-container::before`, not on the splash hero).

**Typography**: [Atkinson Hyperlegible Next](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next) via `@fontsource-variable/atkinson-hyperlegible-next` for body, headings and UI (chosen for legibility). Base 17px (`1.0625rem`), line-height 1.6; headings weight ~760, tracking `-0.01em`, ink `--aig-heading`. Scale (ratio ~1.25): h1 `2.6rem`, h2 `1.75rem`, h3 `1.35rem`, h4 `1.1rem`. Annotation voice: [Shantell Sans](https://fonts.google.com/specimen/Shantell+Sans) via `@fontsource-variable/shantell-sans` (`var(--aig-font-hand)`), used ONLY for handwritten moments: the lesson H1 (weight 600), component badges/kicker lines in the pen colour of their variant, the reader's journal notes, ticks. Never for paragraphs, buttons, inputs or navigation. Code stays in the system monospace stack, in code blocks only.

**Constraints**:

- **Two modes, one school.** Light (quaderno) and dark (lavagna). The selector is Starlight's default `ThemeSelect`, persisted in `localStorage['starlight-theme']`. Respects `prefers-color-scheme`.
- **No side TOC.** `PageSidebar.astro` is an empty override. Lessons are short and self-contained.
- **No coral, peach, cream, pure black, "docs" density.** When adding UI: use Starlight's CSS vars and the `--aig-*` tokens, never hardcode colors. All text pairs meet WCAG AA (4.5:1 body, 3:1 large text and UI).
- **No template chrome.** No ALL CAPS labels, no letter-spaced eyebrows, no monospace UI labels, no "→" appended to buttons/links, no middle-dot meta strings.
- **Two typefaces only**: Atkinson Hyperlegible Next is the voice, Shantell Sans the handwriting. Add fonts only with explicit discussion.
- **Mental references**: a school exercise book, a teacher's corrections, a classroom blackboard, illustrated paper guides. NOT: Stripe / Linear / Vercel docs.
- **Custom CSS**: `src/styles/custom.css` (loaded by Starlight via `customCss`).

## Project components

Catalog of the components reusable in the lessons' `.mdx` files. Keep it
in sync: **every new component that can be used on a page must have an
entry here, updated in the same commit that introduces or modifies it.**

**Internal** components (Starlight overrides, layout, helpers not meant for
`.mdx` files) do NOT go in this catalog: they live only in `src/components/`.

To import a component in an `.mdx` lesson, compute the relative depth.
For a standard lesson at `src/content/docs/it/<sezione>/<lezione>.mdx`:

```mdx
import NomeComponente from '../../../../components/NomeComponente.astro';
```

### `<Resume>`

"Resume where you left off" card. To be placed on orientation pages
(homepage, `start-here`). Reads `localStorage`
(`aiguide:progress:v1`, populated by `src/scripts/progress.ts`) and shows
the last readable page the user left in a previous
session.

It hides itself if there's no history (first visit) or if the last
page matches the current one. Includes the privacy line ("saved
only in your browser, never sent elsewhere") and a "Clear
progress" button that empties `localStorage` after confirmation.

No props. Included as `<Resume />`.

```mdx
import Resume from '../../../components/Resume.astro';

<Resume />
```

### `<LessonSummary>`

30-second summary of the lesson. To be placed near the top of the
lesson, right after the imports: skimmers open it, thorough readers
ignore it. Uses a native `<details>` (collapsed by default, works
without JS, accessible).

The summary looks like a notebook tab: a paper slip with a biro outline
and a chevron that rotates on open. The open body is a slip with the same
biro outline, joined to the tab.

The label is localized (`ui.lessonSummaryLabel`: "Riepilogo in 30
secondi" / "30-second summary"). The content is a markdown slot:
typically a list of 3-5 points that summarize the lesson's
takeaways.

Editorial guideline: the bullets shouldn't repeat the section
titles, but give the actionable takeaway of each one.

| Prop    | Type     | Default                   | Notes                                    |
|---------|----------|---------------------------|------------------------------------------|
| `label` | `string` | `ui.lessonSummaryLabel`   | optional, to override the label |

```mdx
import LessonSummary from '../../../../components/LessonSummary.astro';

<LessonSummary>

- Le quattro leve: **risultato**, **contesto**, **formato**, **ruolo**.
- Dì cosa vuoi (verbo + risultato), non l'argomento generico.
- Dosa il contesto: rilevante sì, biografia no.

</LessonSummary>
```

Note: the blank lines above and below the list are necessary because
MDX parses the markdown inside the component.

### `<GlossaryTerm>`

A single glossary entry: term name as a prop, definition
as a slot (you can use `<em>`, `<strong>`, links, etc. inside the
definition). Adds an "Explain it better with your AI" button
that, on click, copies to the clipboard a prompt calibrated on the
specific term, ready to paste into your own AI.

| Prop  | Type     | Default | Notes                                 |
|-------|----------|---------|--------------------------------------|
| `name`| `string` | —       | required, name of the term       |

The element's `id` is generated from the name (slugified), so it's
linkable via anchor.

```mdx
import GlossaryTerm from '../../../components/GlossaryTerm.astro';

<GlossaryTerm name="Allucinazione">
  Quando l'IA produce un testo che suona vero ma non si basa su nessun
  fatto reale.
</GlossaryTerm>
```

Reference page: `src/content/docs/it/glossary.mdx`.

### `<Def>`

Clickable inline term with a short explanation in a popover. Meant
for lessons: when a word that might not be familiar appears in the
text, wrap it in `<Def>` and the reader, on click or mouse hover, sees
the definition without leaving the page.

The word is marked in the text with a dashed biro underline, and gets a
highlighter wash on hover, focus and when open. The popover appears below the
term, max 280px, as a small paper slip (elevated background, biro border,
hard offset shadow). Independent from `<GlossaryTerm>` (which stays
dedicated to the Glossary page where the full list appears with the
"Explain it better with your AI" prompt).

Behavior:
- hover opens the popover only on devices with `@media (hover: hover)`
  (a touch tap never leaves a sticky hover); keyboard focus
  (`:focus-visible`) opens it too.
- click / tap: persistent toggle (stays open until the user clicks
  outside, taps the term again or presses Escape).
- Escape closes the popover even when it was opened by hover or focus
  (`is-dismissed` class, cleared when the pointer leaves or focus moves:
  WCAG 1.4.13).
- On narrow screens the popover is shifted horizontally (`--def-shift`)
  to stay inside the viewport. Ids are per-instance unique.

A11y: the term is a `<button>` (natively focusable), with
`aria-expanded` kept in sync and `aria-describedby` linking to the
popover (`role="tooltip"`).

| Prop          | Type     | Default | Notes                                                                 |
|---------------|----------|---------|----------------------------------------------------------------------|
| `explanation` | `string` | —       | required, plain text. For markup (links, bold) renegotiate the component with a slot. |

The visible term is passed as a child.

```mdx
import Def from '../../../../components/Def.astro';

Un <Def explanation="Il programma matematico dietro all'IA.">modello</Def>
è l'insieme di formule matematiche che fa funzionare una IA
conversazionale.
```

Note on import depth: inside a lesson at
`src/content/docs/it/<sezione>/<slug>.mdx` the path is
`../../../../components/Def.astro` (four levels up).

### `<RecapWithAi>`

Card that turns your AI into a tutor on the lessons you've
actually read. Reads `localStorage` (key
`aiguide:progress:v1`), filters pages with `read: true` inside a
module (e.g. `/it/fundamentals/...` or `/en/fundamentals/...`), and on
click of "Generate review prompt" assembles a prompt containing
the list of completed lessons + instructions for a Socratic review.
Shown in a `<dialog>` with a copy button.

When 0 lessons have been completed the button is disabled and
a status line explains it ("Complete at least one lesson…"). It reacts
to the `aiguide:progress-cleared` event to refresh itself when the user
clears their progress.

The prompt carries, for each read lesson, its title and the bullets of its
`<LessonSummary>`, fetched on click from `/recap/<locale>.json` (built by
`src/pages/recap/[locale].json.ts`, in the PWA bulk manifest, never in the
Workbox precache; if the fetch fails, titles only). One line sets the
difficulty from the lessons' `livello` (no selector), and notes the reader
saved in the journal (`aiguide:journal:v1`) for those lessons are added as
"what I noted while practicing". Prompt-building lives in
`src/scripts/recap-prompt.ts`, shared with `<ReviewToday>`.

Meant for orientation and end-of-module pages. No props, included
as `<RecapWithAi />`.

```mdx
import RecapWithAi from '../../../components/RecapWithAi.astro';

<RecapWithAi />
```

### `<PromptBuilder>`

Interactive widget that walks the reader step-by-step through building a
clear prompt for their real problem. Four fields (what you want,
context, audience, format), live preview on the right, "Copy
the prompt" button to bring the result into your own AI.

Meant as a natural follow-up to the *What's a prompt?* lesson: the
theory gets applied to the reader's own problem. The assembled
prompt is plain text, label-style, ready for Claude/ChatGPT/
Gemini.

No props. Included as `<PromptBuilder />`.

```mdx
import PromptBuilder from '../../../../components/PromptBuilder.astro';

<PromptBuilder />
```

### `<LlmExercise>`

Card that proposes an activity for the reader to do with their own LLM:
shows a title, description, and buttons to copy/download/open a
`.txt` instructions file. The file lives in `public/skills/<name>.txt` for IT and
in `public/skills/en/<name>.txt` for EN (plain text, no markdown). The
component resolves the path automatically based on the current locale: the
`file` prop stays the same across both languages.

Two variants, chosen with `variant`:

- `practice` (default): guided practice, written in biro ink. Badge "🤖 Esercizio
  con la tua IA" / "🤖 Exercise with your AI".
- `review`: end-of-lesson learning check-in, written in red pen.
  Badge "📝 Verifica con la tua IA" / "📝 Check-in with your AI".

The mechanism (downloadable file + copy + open) is identical in both
variants. Convention: review files are named
`review-<slug-lezione>.txt`. Visible labels are in `src/i18n/ui.ts`.

**Practice journal** (`practice` variant only): under the buttons, a
collapsed `<details>` "Una cosa che ho notato" / "One thing I noticed" with a
textarea (max 500 characters), autosaved (debounced) to
`localStorage['aiguide:journal:v1']` (`JOURNAL_KEY`), shape
`Record<lessonPath, Record<exerciseFile, { text, updatedAt }>>` with
`lessonPath` = `location.pathname` with a trailing slash. Empty text deletes
the entry. Restored on load and after view transitions; the note says it
stays only in this browser. The Recap reads this shape, keep it stable.

| Prop          | Type                          | Default      | Notes                                                                              |
|---------------|-------------------------------|--------------|-----------------------------------------------------------------------------------|
| `title`       | `string`                      | —            | required                                                                      |
| `file`        | `string`                      | —            | file name in `public/skills/<locale>/`, e.g. `review-what-is-ai.txt`           |
| `description` | `string`                      | —            | optional, short description under the title                                      |
| `duration`    | `string`                      | —            | optional, format `"X min"` or `"X-Y min"` (e.g. `"5-7 min"`). Shown under the title as "X min di esercizio" or "X min di verifica" depending on the variant. |
| `variant`     | `'practice' \| 'review'`      | `'practice'` | choose the visual framing                                                          |

```mdx
{/* Practice exercise in the body of the lesson */}
<LlmExercise
  title="La tua prima conversazione consapevole"
  file="first-exercise.txt"
  duration="10 min"
  description="Un esercizio guidato in cui l'IA ti aiuta a capire come formulare una richiesta chiara."
/>

{/* End-of-lesson check-in */}
<LlmExercise
  variant="review"
  title="Quattro domande per fissare le idee"
  file="review-what-is-ai.txt"
  duration="5-7 min"
  description="Incolla il testo nella tua IA. Ti farà quattro domande progressive sulla lezione, una alla volta."
/>
```

### `<HomeCards>`

Grid of index-card slips for the landing page. Replaces "docs-style"
bullet lists. Each card is a white slip on the grid (ink border, hard
shadow, tilted a hair) with a biro-line icon above a ruled line, a title
(highlighter swipe on hover) and a description, with an optional link.
Cards that aren't ready yet are flagged with `comingSoon: true`: no
link, dashed border, "Presto" written in red pen (Shantell Sans) in the
top right corner.

| Prop              | Type            | Default   | Notes                                                |
|-------------------|-----------------|-----------|------------------------------------------------------|
| `heading`         | `string`        | —         | optional, section title above the cards           |
| `cards`           | `HomeCard[]`    | —         | required, at least one card                        |
| `comingSoonLabel` | `string`        | `'Presto'`| badge text for `comingSoon` cards             |

`HomeCard`:

| Field         | Type       | Default | Notes                                                                       |
|---------------|------------|---------|----------------------------------------------------------------------------|
| `icon`        | `IconName` | —       | required, id of an icon from the `Icon.astro` set (e.g. `'sprout'`)         |
| `title`       | `string`   | —       | required                                                               |
| `description` | `string`   | —       | required                                                               |
| `href`        | `string`   | —       | optional, URL of the target page                                         |
| `comingSoon`  | `boolean`  | `false` | if true: card not clickable, "Presto" badge                               |

```mdx
<HomeCards
  heading="Da dove parti?"
  cards={[
    {
      icon: 'sprout',
      title: 'Fondamenti',
      description: "Cos'è un'IA, come parlarci, cosa aspettarti.",
      href: '/it/fundamentals/what-is-ai/',
    },
    {
      icon: 'pencil',
      title: 'Uso quotidiano',
      description: 'Scrivere, riassumere, imparare cose nuove.',
      comingSoon: true,
    },
  ]}
/>
```

### `<Icon>`

Curated set of inline SVG icons used by the navigation cards
(`HomeCards`). Single-weight biro-ink line drawings (1.6 stroke, no fill,
no background tile), like doodles in a notebook margin; colour is
`--aig-ink` (biro in light, chalk blue in dark). Stable appearance across
OSes (unlike emoji).

Available icons (`IconName`): `sprout`, `pencil`, `briefcase`,
`graduation-cap`, `users`, `wrench`, `message-circle`. Adding one
means extending the union type and adding the SVG block in
`Icon.astro`.

Generally there's no need to import it directly from `.mdx`: cards
take `icon: IconName` and `HomeCards` mounts it on their own. If in
the future you need a standalone icon outside of cards, import it like this:

```mdx
import Icon from '../../../components/Icon.astro';

<Icon name="graduation-cap" />
```

### `<ChatDemo>`

Animated user/AI conversation (typewriter + "thinking" dots). Replaces
example GIFs. No-JS friendly (shows the final static text). Respects
`prefers-reduced-motion: reduce` (static rendering). Starts only when it
enters the viewport (`IntersectionObserver`).

| Prop            | Type      | Default | Notes                                              |
|-----------------|-----------|---------|---------------------------------------------------|
| `user`          | `string`  | —       | required: the user's message            |
| `ai`            | `string`  | —       | required: the AI's response                 |
| `typingSpeed`   | `number`  | `28`    | ms per character                                  |
| `thinkingTime`  | `number`  | `900`   | ms pause between user send and AI response       |
| `autoPlay`      | `boolean` | `true`  | starts automatically on viewport entry                 |
| `loop`          | `boolean` | `false` | restarts in a loop                                   |
| `loopDelay`     | `number`  | `3500`  | ms pause between one cycle and the next          |
| `userLabel`     | `string`  | `'Tu'`  | label above the user bubble                   |
| `aiLabel`       | `string`  | `'IA'`  | label above the AI bubble                       |
| `showReplay`    | `boolean` | `true`  | shows the "Salta" (during the animation) and "Riavvia" buttons |

```mdx
<ChatDemo
  user="Mi spieghi in due frasi cos'è un buco nero?"
  ai={`Un buco nero è una regione dello spaziotempo dove la gravità è così forte che nulla, nemmeno la luce, può sfuggirle.

Si forma quando una stella molto massiccia, a fine vita, collassa su se stessa.`}
/>
```

Newlines inside the `ai` string (using a backtick template literal) are
preserved and rendered as line breaks thanks to `white-space: pre-wrap`.

**Inline markdown in the AI response.** The `ai` string supports a
subset of inline markdown rendered in SSR: `**grassetto**` /
`__grassetto__`, `*corsivo*` / `_corsivo_`, `` `inline code` ``, and links
`[testo](url)` (only `http(s)` schemes, `mailto:`, internal `/` paths, `#`
anchors; other schemes fall back to `#` for safety). No block elements
(lists, headings, quotes stay plain text). The typewriter walks the
text nodes leaving the tags in place, so bold text in the title of a
response already appears formatted from the first letter typed. The
`user` string stays plain text and isn't parsed.

### `<MailtoComposer>`

Textarea + "Apri email" button that launches a pre-filled `mailto:` with
subject and body. No backend, no fetch: the message leaves from the user's
own mail client, consistent with the site's privacy posture (see
`src/scripts/progress.ts`).

The mail address passed in `to` is split server-side into user/domain and
written as two separate `data-*` attributes (obfuscation against spam
crawlers). The component's script recomposes the address only on click of
the "Apri email" button.

Meant for "write to me" pages like About, zero-cost feedback collection. The
visible labels (badge, title, hint, button, error messages) are in
`src/i18n/ui.ts` under the `composer*` keys.

| Prop            | Type     | Default                        | Notes                                                            |
|-----------------|----------|--------------------------------|------------------------------------------------------------------|
| `to`            | `string` | —                              | required: recipient address (gets split and obfuscated in the DOM) |
| `subject`       | `string` | `ui.composerSubject`           | mail subject (localized default)                        |
| `placeholder`   | `string` | `ui.composerPlaceholder`       | textarea placeholder                                      |
| `buttonLabel`   | `string` | `ui.composerButton`            | button text (default "Apri email" / "Open email")         |

```mdx
import MailtoComposer from '../../../components/MailtoComposer.astro';

<MailtoComposer to="ai-guide@larosa.work" />
```

### `<ObfuscatedEmail>`

Email link that recomposes itself only once JS loads. The static DOM
contains `user` and `domain` in two separate `data-*` attributes, never the
joined `user@domain` string. Spam crawlers scanning raw HTML
don't find a readable address.

If JS is disabled (rare), the user sees the fallback
`user [at] domain`, readable and copyable without explanation.

The client wiring (updates `href` and text) lives in the `<script>` of
`Footer.astro`, which is included on every page of the site. So it's enough
to use `<ObfuscatedEmail>` wherever it's needed, without importing extra scripts.

| Prop     | Type     | Default | Notes                                        |
|----------|----------|---------|---------------------------------------------|
| `user`   | `string` | —       | required: part before the at sign  |
| `domain` | `string` | —       | required: part after the at sign      |
| `class`  | `string` | —       | optional, extra CSS classes on the link   |

```mdx
import ObfuscatedEmail from '../../../components/ObfuscatedEmail.astro';

<ObfuscatedEmail user="ai-guide" domain="larosa.work" />
```

<!-- F1 catalog entries (progress & review) -->
### `<ReviewToday>`

Spaced-review card ("Today, review N lessons"). A read lesson is due again
1 day, then 4 days, then 14 days after its last anchor
(`reviewedAt ?? readAt ?? lastVisit`); the number of reviews already done is
`reviewStep` in the progress record. The card lists the due lessons (with
links) and generates the same Socratic prompt as `<RecapWithAi>`, but only on
those lessons (shared code in `src/scripts/recap-prompt.ts`). When the reader
copies the prompt, the card dispatches `aiguide:mark-reviewed` with the
lesson paths; `progress.ts` (the only writer of the progress key) sets
`reviewedAt` and increments `reviewStep`. Hidden when nothing is due.

Placed on `start-here`, right after `<Resume />`. No props.

```mdx
import ReviewToday from '../../../components/ReviewToday.astro';

<ReviewToday />
```

### `<ProgressOverview>`

Body of the "Your progress" page (`/it/progress/`, `/en/progress/`, no
`livello`, so it does not count as a lesson). Per module (order and labels from
`src/i18n/modules.mjs`, the single source of truth also used by `llms.txt` and
the Head section labels): lessons read out of total, with links, and for each
lesson the bullets of its `<LessonSummary>`. Lessons, titles and summaries come
from `src/lib/lesson-data.ts` at build time (the same data as
`dist/recap/<locale>.json`); the client script only adds the read state from
`localStorage` and a "Print or save as PDF" button (`window.print()`). The
`@media print` CSS hides header, sidebar, footer and the local AI launcher.
No props.

```mdx
import ProgressOverview from '../../../components/ProgressOverview.astro';

<ProgressOverview />
```

<!-- end F1 -->

<!-- F2 catalog entries (lesson widgets) -->

### `<SelfCheck>`

One single-choice question for the reader to test themselves. Clicking an
option shows correct/incorrect plus the `why` of that option (in an
`aria-live` region); the reader can retry or ask for the correct answer.
The result is stored in `localStorage` under `SELFCHECK_KEY`
(`aiguide:selfcheck:v1`, `Record<id, { correct, at, path }>`, cleared by
`clearReaderData()`); on the next visit a discreet line shows "you answered
this on ...". Options stay active, so answering again is the retry. Several
per page work. Without JS: question and options as a list, answers in a
native `<details>`. Use at most two widgets per lesson.

| Prop          | Type                                              | Default | Notes                                                        |
|---------------|---------------------------------------------------|---------|--------------------------------------------------------------|
| `id`          | `string`                                          | —       | required, stable and unique per page (storage key)           |
| `question`    | `string`                                          | —       | required                                                     |
| `options`     | `{ text: string; correct?: boolean; why: string }[]` | —    | required, at least one `correct: true` (build fails otherwise) |
| `explanation` | `string`                                          | —       | optional, shown after the reader answers                     |

```mdx
import SelfCheck from '../../../../components/SelfCheck.astro';

<SelfCheck
  id="what-is-ai-q1"
  question="Cosa fa un modello linguistico quando risponde?"
  options={[
    { text: "Cerca in un archivio di fatti.", why: "Non consulta un archivio: genera testo." },
    { text: "Prevede il testo plausibile.", correct: true, why: "Esatto." },
  ]}
  explanation="Per questo va controllato quando i fatti contano."
/>
```

### `<SpotTheError>`

An AI answer split into sentences. The reader toggles the sentences they
suspect (buttons with `aria-pressed`), presses "Check" and sees which wrong
sentences they found (with the `why`), which they missed, and which were
false alarms, plus a summary line. Nothing is stored. Without JS: the answer
as a list, the solution in a `<details>`.

| Prop        | Type                                              | Default                | Notes                                  |
|-------------|---------------------------------------------------|------------------------|----------------------------------------|
| `sentences` | `{ text: string; wrong?: boolean; why?: string }[]` | —                    | required, in reading order             |
| `prompt`    | `string`                                          | —                      | optional, the user question shown above |
| `title`     | `string`                                          | `ui.spotDefaultTitle`  | optional                               |

```mdx
import SpotTheError from '../../../../components/SpotTheError.astro';

<SpotTheError
  prompt="In che anno è caduto il Muro di Berlino?"
  sentences={[
    { text: "Il Muro è caduto il 9 novembre 1989." },
    { text: "Lo abbatté l'esercito francese.", wrong: true, why: "Cadde per la pressione popolare." },
  ]}
/>
```

### `<PredictThenReveal>`

"Predict first, then look". Shows the user message and a textarea ("what do
you expect the AI to answer?", never stored). "Reveal the answer" unhides a
`<ChatDemo>` with the same `user`/`ai` (it starts by itself when it becomes
visible, via its `IntersectionObserver`) and shows a "Compare: what did you
get right, what surprised you?" line. Revealing works without typing. The
`ai` string supports the same inline markdown as `<ChatDemo>`. Without JS the
conversation is shown already revealed.

| Prop     | Type     | Default            | Notes                                                |
|----------|----------|--------------------|------------------------------------------------------|
| `user`   | `string` | —                  | required: the user's message                         |
| `ai`     | `string` | —                  | required: the AI's response                          |
| `prompt` | `string` | `ui.predictLabel`  | optional, replaces the question above the textarea   |

```mdx
import PredictThenReveal from '../../../../components/PredictThenReveal.astro';

<PredictThenReveal
  user="Spiegami cos'è un buco nero in due frasi."
  ai="Un buco nero è una regione dello spaziotempo dove la gravità è così forte che nulla può sfuggire."
/>
```

### `<PromptCompare>`

A weak prompt and its rebuilt version side by side (stacked on mobile) as
plain text blocks, each with a "Copy" button (Clipboard API with a
fallback, `aria-live` "Copied"). An optional note explains the difference,
either through the `note` prop or as a markdown slot (blank lines around
the inner markdown, as in `<LessonSummary>`). Several per page work.

| Prop          | Type     | Default                    | Notes                                    |
|---------------|----------|----------------------------|------------------------------------------|
| `weak`        | `string` | —                          | required                                 |
| `strong`      | `string` | —                          | required (use a template literal for multiple lines) |
| `weakLabel`   | `string` | `ui.compareWeakLabel`      | optional                                 |
| `strongLabel` | `string` | `ui.compareStrongLabel`    | optional                                 |
| `note`        | `string` | —                          | optional, plain text; the slot also works |

```mdx
import PromptCompare from '../../../../components/PromptCompare.astro';

<PromptCompare
  weak="Scrivi una mail."
  strong={`Scrivi una mail di 5 righe a un cliente che ha ricevuto la merce in ritardo.
Tono cordiale e diretto, una sola scusa, proponi il 10% di sconto.`}
  note="Il secondo dice a chi scrivi, quanto e cosa proporre."
/>
```

### `<Anonymizer>`

A local tool to strip personal data before pasting text into an AI. The
reader pastes text; it automatically replaces emails, phone numbers
(Italian and international), IBANs, Italian codice fiscale, card-like digit
sequences and, optionally (checkbox), every other number. A "words to
replace" field (comma separated names, companies, places) turns each word
into `[NOME 1]`, `[NOME 2]`..., consistently. Output field, copy button and a
count per type. A caution note, always visible, lists what it does NOT catch
(names not listed, addresses, indirect details, images/attachments) and
states that nothing leaves the browser. Nothing is stored. Placeholders are
localized (`ui.anonPh*`). Logic in `src/scripts/anonymize.ts`.

No props. Included as `<Anonymizer />`.

```mdx
import Anonymizer from '../../../../components/Anonymizer.astro';

<Anonymizer />
```

### `<Collapsible>`

Thin wrapper over native `<details>`/`<summary>` to shorten a lesson in
place (long examples, side notes). Collapsed by default, works without JS.
Quieter than `<LessonSummary>`: no colored fill, just a chevron line and a
thin rule on the left of the body. The body is a markdown slot: keep blank
lines around the inner markdown.

| Prop    | Type      | Default | Notes                    |
|---------|-----------|---------|--------------------------|
| `title` | `string`  | —       | required, the summary line |
| `open`  | `boolean` | `false` | optional, start expanded |

```mdx
import Collapsible from '../../../../components/Collapsible.astro';

<Collapsible title="L'esempio completo">

Testo, liste, **grassetto**.

</Collapsible>
```

<!-- end F2 -->

<!-- F3 catalog entries (journal, plan prompt) -->
### `<StudyPlanPrompt>`

Card for orientation pages (placed once at the end of `start-here`). The
reader picks a path (Fondamenti, Uso quotidiano, Sul lavoro, Per studenti, Per
docenti, Per chi vuole di più), a pace (one lesson a day / three a week /
weekends only) and optionally minutes per session; the card assembles a
plain-text prompt (live preview + copy button) asking their own AI to build a
study calendar with lesson titles and links, then check in with them. No
backend, nothing stored. Without JS the card stays hidden.

Lesson lists: ordered slugs live in the `PATHS` constant inside the
component (the sidebar order in `astro.config.mjs` is not readable at
runtime); titles come from the content collection in the page's locale and
links are absolute (`https://ai-guide.larosa.work/<locale>/...`). When a
lesson is added to a module, add its slug to `PATHS` too.

No props. Included as `<StudyPlanPrompt />`.

```mdx
import StudyPlanPrompt from '../../../components/StudyPlanPrompt.astro';

<StudyPlanPrompt />
```

<!-- end F3 -->

## Content plan

The editorial roadmap lives in **`CONTENT.md`** at the root: planned modules, status
of each lesson, upcoming lessons, workflow for writing a new one.
Update `CONTENT.md` **in the same commit** where a lesson gets
written, renamed, or deleted.

## Project skills and agents

Invokable from Claude Code:

- **`/voice-guide`**: style reference (you read it, you don't run it).
- **`/analyze-lesson <path>`**: analyzes a page simulating a reader at the declared level and produces a list of reader questions. Output in `analysis/<slug>.questions.md`.
- **`/integrate-questions <path> [questions-file]`**: integrates the questions into the page as inline answers, callouts, examples, or FAQ. Asks for confirmation before applying.
- **`/add-defs <path>`**: enriches a lesson with `<Def>` tooltips on technical terms, working in parallel on all mirror languages found under `src/content/docs/<lang>/`. Shows a plan (chosen terms + explanations per language) before touching the files.
- **Agent `style-checker`**: QA pass on a page. Doesn't modify, only flags issues.

Typical workflow for a new lesson:

1. Write the draft in `src/content/docs/it/<sezione>/<slug>.mdx`.
2. Run `/analyze-lesson <path>` to see what a reader wouldn't understand.
3. Curate the questions in the `analysis/<slug>.questions.md` file.
4. Run `/integrate-questions <path>` to integrate them.
5. Run `/add-defs <path>` to add inline tooltips on technical terms.
6. Run the `style-checker` agent for a final QA pass.

## Translation and i18n

**English slugs everywhere.** Even Italian pages live at English
paths (`/it/start-here/`, `/it/fundamentals/what-is-ai/`). The slug is a
"code identifier", not reader-facing text: keeping it in English lets you
reuse the same sidebar config and the same sidebar `slug:` for
every locale, without overrides and without redirects.

**EN mirror under `src/content/docs/en/`.** Same file path as
the IT counterpart (e.g. `en/fundamentals/what-is-ai.mdx`). Pages without a
translation automatically fall back to the default language.

**Skill `.txt` files in `public/skills/<locale>/`.** Convention:
`public/skills/en/<name>.txt`, `public/skills/it/<name>.txt`. The
`<LlmExercise>` component always resolves the path with the locale
prefix, whatever the default language is.

**Component UI strings in `src/i18n/ui.ts`.** A typed `UIStrings`
dictionary for each locale. Server components: `t(Astro.currentLocale)`.
Client scripts: receive the strings via `data-*` attributes pre-rendered
server-side. Adding a language = adding an entry in `STRINGS` and
in `Locale` (TypeScript enforces full coverage of all keys).

## Commit preferences

- **No `Co-Authored-By: Claude …` trailer** in commits.
- Commit message in English, concise body (what + why, not the diff).
