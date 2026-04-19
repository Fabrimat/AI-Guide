# Pre-launch Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the legal/compliance gap, add the pieces needed before a public deploy (favicon, OG image, custom 404, hreflang check), and polish a few UX/a11y rough edges surfaced by recent changes (MailtoComposer, ObfuscatedEmail, HomeCards with 6 cards).

**Architecture:** Three independent phases (A legal, B pre-deploy, C UX polish), each a cluster of small tasks ending in a build smoke test + commit. No framework changes: keep Astro + Starlight, keep static output, keep the privacy posture (no backend, no tracking).

**Tech Stack:** Astro 6 + Starlight 0.38, TypeScript, MDX, Sharp (for SVG→PNG for OG image). No new runtime dependencies.

---

## File Structure

**Legal/compliance (Phase A)**
- Create `src/content/docs/it/privacy.mdx` — Italian privacy page
- Create `src/content/docs/en/privacy.mdx` — English mirror
- Modify `src/i18n/ui.ts` — add `footerPrivacy` key for IT and EN
- Modify `src/components/Footer.astro` — add Privacy link next to About

**Pre-deploy (Phase B)**
- Create `public/favicon.svg` — brand favicon (Pastello coral square with AI initials)
- Create `src/assets/og-image.svg` — Open Graph social share image source (1200×630)
- Create `public/og-image.png` — generated from the SVG via one-shot Sharp script
- Modify `src/components/Head.astro` — inject `<link rel="icon">` + `<meta property="og:image">` site-wide
- Create `src/pages/404.astro` — bilingual custom 404 page

**UX polish (Phase C)**
- Modify `src/components/MailtoComposer.astro` — explicit `:focus-visible` ring on button
- Modify `src/components/ObfuscatedEmail.astro` — add visible focus state, `cursor: pointer`
- Modify `src/components/HomeCards.astro` — add hover polish (icon scales slightly on clickable cards)
- Verify `src/components/Resume.astro` + `src/components/RecapWithAi.astro` still behave correctly with six modules instead of four (no code change expected, just manual smoke)

Each phase ends with `npm run build` smoke + one commit.

---

## Phase A — Legal/compliance

### Task A1: Write Italian privacy page

**Files:**
- Create: `src/content/docs/it/privacy.mdx`

- [ ] **Step 1: Create the file with the full content**

```mdx
---
title: Privacy
description: Cosa succede ai tuoi dati quando usi AI-Guide. Spoiler, praticamente niente.
---

AI-Guide è un sito gratuito. Questa pagina spiega in modo diretto cosa
succede ai tuoi dati quando lo usi, senza gergo legale superfluo.

## Chi gestisce il sito

Fabrizio La Rosa, partita IVA belga BE1031214819, con sede a Gent,
Belgio. Mi contatti tramite il modulo in fondo alla pagina [Chi sono](/it/about/)
oppure scrivendo a ai-guide@larosa.work.

## Cosa NON raccolgo

- Niente cookie per tracciamento o pubblicità.
- Niente Google Analytics, Meta Pixel, o strumenti analoghi.
- Niente account, niente login.
- Niente newsletter, né liste di contatti.

## Cosa resta sul tuo browser

AI-Guide usa `localStorage` per ricordarsi quali lezioni hai iniziato
o completato, quanto tempo ci hai passato, e la tua ultima posizione
nel manuale. Queste informazioni alimentano le funzioni "Riprendi da
dove hai lasciato" e "Ripasso con la tua IA".

**Non lasciano mai il tuo browser.** Non arrivano a me, né a terze
parti, né a nessun servizio esterno. Vivono in `localStorage` e basta.

Puoi cancellarle in qualsiasi momento col pulsante "Cancella progressi"
in fondo alla card "Riprendi" della homepage.

## Se mi scrivi

Se usi il modulo "Scrivimi" nella pagina Chi sono, o se mandi una email
a ai-guide@larosa.work, il tuo messaggio arriva nel mio client di
posta. L'email resta sul server del mio provider. Non la inoltro, non
la aggiungo a liste, non la uso per cose diverse dalla risposta
diretta.

## Log del server

Il sito è statico. Il server web che lo serve tiene log di accesso
standard (IP, user agent, URL richiesto) per periodi brevi, solo per
ragioni tecniche e di sicurezza. Li uso solo per diagnostica del
server, non per profilazione.

## I tuoi diritti

Tecnicamente non ho un database di utenti da modificare o cancellare.
Se vuoi una verifica o un'azione su eventuali dati nei log del server,
scrivimi a ai-guide@larosa.work.

## Modifiche a questa pagina

Se la politica cambia (ad esempio perché introduco una funzione che
richiede un dato nuovo) aggiorno questa pagina e lo segnalo nel footer
o in home per un periodo ragionevole.

---

Aggiornata al 2026-04-18.
```

- [ ] **Step 2: Build smoke test**

Run: `npm run build`
Expected: `20+1 = 21 page(s) built` (no extra locale variants yet), no errors.

### Task A2: Write English privacy page (mirror)

**Files:**
- Create: `src/content/docs/en/privacy.mdx`

- [ ] **Step 1: Create the file with the English mirror**

```mdx
---
title: Privacy
description: What happens to your data when you use AI-Guide. Spoiler, almost nothing.
---

AI-Guide is a free site. This page explains in plain words what happens
to your data when you use it, no legal filler.

## Who runs this site

Fabrizio La Rosa, Belgian VAT BE1031214819, based in Ghent, Belgium.
You can reach me through the form at the bottom of the
[About](/en/about/) page, or by writing to ai-guide@larosa.work.

## What I do NOT collect

- No tracking or advertising cookies.
- No Google Analytics, Meta Pixel, or similar tools.
- No accounts, no logins.
- No newsletter, no mailing lists.

## What stays on your browser

AI-Guide uses `localStorage` to remember which lessons you've started
or finished, how long you've spent on them, and your last position in
the manual. That data powers the "Pick up where you left off" and
"Recap with your AI" features.

**It never leaves your browser.** It doesn't reach me, or any third
party, or any external service. It lives in `localStorage` and that's
it.

You can clear it at any time with the "Clear progress" button at the
bottom of the "Pick up" card on the homepage.

## If you write to me

If you use the "Write to me" form on the About page, or send an email
to ai-guide@larosa.work, your message lands in my own email client.
The mail sits on my email provider's server. I don't forward it, I
don't add you to any list, I don't use it for anything other than
replying.

## Server logs

The site is static. The web server hosting it keeps standard access
logs (IP, user agent, requested URL) for short periods, only for
technical and security reasons. I use them only for server diagnostics,
never for profiling.

## Your rights

Technically there's no user database for me to modify or delete. If
you want a check or an action on any data in my server logs, write
to ai-guide@larosa.work.

## Changes to this page

If the policy changes (for example because I introduce a feature that
needs some new data) I'll update this page and flag it in the footer
or homepage for a reasonable period.

---

Last updated 2026-04-18.
```

- [ ] **Step 2: Build smoke test**

Run: `npm run build`
Expected: build completes, two new pages (`/it/privacy/` and `/en/privacy/`) appear in the output.

### Task A3: Add `footerPrivacy` i18n string

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add the key to the `UIStrings` interface**

Locate the Footer section of the interface (around `footerAbout`), and add a new field just below `footerAbout`:

```ts
  footerAbout: string;
  footerPrivacy: string;
  footerLinkedinAria: string;
```

- [ ] **Step 2: Add the IT value**

In the `it` const, just after `footerAbout: 'Chi sono',`:

```ts
  footerPrivacy: 'Privacy',
```

- [ ] **Step 3: Add the EN value**

In the `en` const, just after `footerAbout: 'About',`:

```ts
  footerPrivacy: 'Privacy',
```

(The word is the same in both locales; keep two entries for consistency.)

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npm run build`
Expected: build completes. If it fails, TypeScript is complaining about a missing key in one locale.

### Task A4: Add Privacy link to the Footer

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Compute the privacy href next to aboutHref**

Locate the top of the frontmatter (around `const aboutHref = ...`) and add:

```astro
const aboutHref = `/${locale}/about/`;
const privacyHref = `/${locale}/privacy/`;
```

- [ ] **Step 2: Render the Privacy link after the About link**

Locate the `<div class="agf-row">` block and change it from:

```astro
<div class="agf-row">
  <a class="agf-about" href={aboutHref}>{ui.footerAbout}</a>
  <span class="agf-tagline">{ui.footerTagline}</span>
</div>
```

to:

```astro
<div class="agf-row">
  <a class="agf-about" href={aboutHref}>{ui.footerAbout}</a>
  <span class="agf-sep" aria-hidden="true">·</span>
  <a class="agf-about" href={privacyHref}>{ui.footerPrivacy}</a>
  <span class="agf-tagline">{ui.footerTagline}</span>
</div>
```

The `agf-sep` CSS rule already exists from the copyright line.

- [ ] **Step 3: Build + visual smoke test**

Run: `npm run build`
Expected: build completes. Then:

```bash
grep -oE 'href="/it/privacy/"' dist/it/index.html | head -2
grep -oE 'href="/en/privacy/"' dist/en/index.html | head -2
```

Both should return at least one match per locale.

### Task A5: Commit Phase A

- [ ] **Step 1: Review diff**

Run: `git status && git diff --stat`

- [ ] **Step 2: Commit**

```bash
git add src/content/docs/it/privacy.mdx src/content/docs/en/privacy.mdx src/i18n/ui.ts src/components/Footer.astro
git commit -m "Add a privacy page and link it from the footer

Plain-language privacy statement in both locales: no tracking, no
analytics, localStorage only, contact email goes to my own inbox.
Reflects the actual posture of the site (static, backend-free)
rather than boilerplate legalese.

The footer now shows About · Privacy on the first row, sharing the
same styling as the existing copyright separator."
```

---

## Phase B — Pre-deploy

### Task B1: Create the favicon SVG

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Write the SVG**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#E07A5F"/>
  <text x="32" y="43" text-anchor="middle"
        font-family="'Outfit', system-ui, sans-serif"
        font-size="30" font-weight="700" fill="#FCEEE3"
        letter-spacing="-1">AI</text>
</svg>
```

- [ ] **Step 2: Verify it renders**

Open `public/favicon.svg` in a browser (file URL or any preview). Expected: rounded coral square with cream "AI" centered.

### Task B2: Inject favicon link in Head override

**Files:**
- Modify: `src/components/Head.astro`

- [ ] **Step 1: Find the right insertion point**

Read the file (`Read src/components/Head.astro`). Find the block where custom `<link>` or `<meta>` tags are added (near the existing content, after the Default Head inclusion or at the bottom of the template).

- [ ] **Step 2: Insert favicon link**

Add this line inside the component template, near the existing meta/link tags:

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 3: Build + verify**

Run: `npm run build`
Then: `grep -oE '<link rel="icon"[^>]+>' dist/it/index.html | head -1`
Expected: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`

### Task B3: Create the OG image source SVG

**Files:**
- Create: `src/assets/og-image.svg`

- [ ] **Step 1: Write the source SVG (1200×630)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#FCEEE3"/>

  <!-- Decorative sprout icon in top-left -->
  <g transform="translate(90 90) scale(5)" stroke="#B85D44" stroke-width="1.8"
     fill="#FAD0C2" fill-opacity="0.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 20h10" fill="none"/>
    <path d="M10 20c5.5-2.5.8-6.4 3-10" fill="none"/>
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
  </g>

  <!-- Title -->
  <text x="90" y="390" font-family="'Outfit', system-ui, sans-serif"
        font-size="136" font-weight="700" fill="#2A2447" letter-spacing="-2">AI-Guide</text>

  <!-- Tagline -->
  <text x="90" y="470" font-family="'Outfit', system-ui, sans-serif"
        font-size="44" font-weight="400" fill="#6B5C8C">Impara a usare l'IA, passo dopo passo.</text>

  <!-- Author line -->
  <text x="90" y="560" font-family="'Outfit', system-ui, sans-serif"
        font-size="28" font-weight="500" fill="#C25A3F">di Fabrizio La Rosa · ai-guide.larosa.work</text>
</svg>
```

- [ ] **Step 2: Verify visually**

Open in browser. Expected: peach bg, sprout icon top-left, big indigo title "AI-Guide", coral-dark subtitle line. No broken fonts (system fallback is fine if Outfit isn't installed locally).

### Task B4: Convert OG SVG to PNG via Sharp

**Files:**
- Create: `public/og-image.png`

- [ ] **Step 1: Run Sharp one-shot conversion**

```bash
node -e "const sharp=require('sharp'); sharp('src/assets/og-image.svg').resize(1200,630).png().toFile('public/og-image.png').then(i=>console.log('OK',i.size,'bytes')).catch(e=>{console.error(e.message);process.exit(1)})"
```

Expected output: `OK <some-bytes> bytes`, typically ~20-60 KB. PNG file appears at `public/og-image.png`.

- [ ] **Step 2: Inspect dimensions**

```bash
file public/og-image.png
```

Expected: `PNG image data, 1200 x 630, ...`

### Task B5: Inject OG meta tags in Head

**Files:**
- Modify: `src/components/Head.astro`

- [ ] **Step 1: Add Open Graph and Twitter card meta tags**

Near the favicon link from Task B2, add:

```astro
<meta property="og:image" content="https://ai-guide.larosa.work/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://ai-guide.larosa.work/og-image.png" />
```

Absolute URL is required: Open Graph consumers (LinkedIn, Slack, Telegram) reject relative paths.

- [ ] **Step 2: Build + verify**

Run: `npm run build`
Then: `grep 'og:image' dist/it/index.html | head -3`
Expected: three lines with og:image, og:image:width, og:image:height.

### Task B6: Create custom 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Write a bilingual 404 page**

```astro
---
import '../styles/custom.css';
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>404 · AI-Guide</title>
  </head>
  <body>
    <main class="nf-main">
      <p class="nf-code">404</p>
      <h1 class="nf-title">Questa pagina non esiste</h1>
      <p class="nf-title-en">This page doesn't exist</p>
      <p class="nf-body">
        Forse il link era sbagliato, o la pagina è stata spostata. /
        Maybe the link was wrong, or the page has moved.
      </p>
      <p class="nf-actions">
        <a href="/it/">Torna alla home (IT)</a>
        <span aria-hidden="true">·</span>
        <a href="/en/">Back to home (EN)</a>
      </p>
    </main>
    <style>
      body {
        font-family: var(--sl-font);
        background: var(--sl-color-bg);
        color: var(--sl-color-text);
        margin: 0;
      }
      .nf-main {
        max-width: 560px;
        margin: 0 auto;
        padding: 6rem 1.5rem 4rem;
        text-align: center;
      }
      .nf-code {
        font-size: 5rem;
        font-weight: 700;
        color: var(--sl-color-accent);
        margin: 0;
        letter-spacing: -0.02em;
      }
      .nf-title {
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0.5rem 0 0.25rem;
      }
      .nf-title-en {
        margin: 0;
        color: var(--sl-color-gray-3);
        font-size: 1.15rem;
      }
      .nf-body {
        margin: 1.5rem 0 2rem;
        color: var(--sl-color-gray-3);
        line-height: 1.6;
      }
      .nf-actions {
        display: flex;
        justify-content: center;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .nf-actions a {
        color: var(--sl-color-text-accent);
        text-decoration: none;
        font-weight: 600;
      }
      .nf-actions a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .nf-actions span {
        color: var(--sl-color-gray-4);
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Build + verify 404 is emitted**

Run: `npm run build`
Expected: log shows `/404.html` in the generated routes. Then:

```bash
grep -oE '<title>[^<]*</title>' dist/404.html
```

Expected: `<title>404 · AI-Guide</title>`.

### Task B7: hreflang sanity check

**Files:** none, read-only verification.

- [ ] **Step 1: Inspect existing hreflang tags in generated HTML**

Run: `grep -oE '<link rel="alternate"[^>]+>' dist/it/fundamentals/what-is-ai/index.html | head -5`

Expected: at least one `<link rel="alternate" hreflang="en" ...>` and one `hreflang="it"`. Starlight emits these by default when both locales have the matching slug.

- [ ] **Step 2: If missing, flag but don't fix here**

If hreflang tags are absent, the fix (typically adjusting `astro.config.mjs` locales or calling `<StarlightHeadLinks />`) is out of scope for this task. Note the finding and stop. Do not improvise a fix; raise it with the user.

### Task B8: Commit Phase B

- [ ] **Step 1: Review diff and new files**

Run: `git status`
Expected new files: `public/favicon.svg`, `public/og-image.png`, `src/assets/og-image.svg`, `src/pages/404.astro`. Modified: `src/components/Head.astro`.

- [ ] **Step 2: Commit**

```bash
git add public/favicon.svg public/og-image.png src/assets/og-image.svg src/components/Head.astro src/pages/404.astro
git commit -m "Favicon, OG image, and custom 404 page for the public launch

Brand favicon (rounded coral square with cream AI initials) and an
Open Graph image pre-rendered to 1200x630 PNG so share previews on
LinkedIn/Slack/Telegram aren't a grey box. The PNG is built once
from src/assets/og-image.svg via a Sharp one-shot script — small
enough to check into the repo and skip per-build rendering.

The 404 page lives at src/pages/404.astro, noindex, bilingual: IT
headline + EN subtitle, plus links back to either locale's home.
Uses the site's CSS variables so it stays in palette."
```

---

## Phase C — UX polish

### Task C1: Focus-visible ring on MailtoComposer button

**Files:**
- Modify: `src/components/MailtoComposer.astro`

- [ ] **Step 1: Locate the `.mc-btn` style block**

Read the file, find the style section containing `.mc-btn { ... }` and the `:hover` rule.

- [ ] **Step 2: Add a `:focus-visible` rule**

Insert just after the `.mc-btn:hover` block:

```css
  .mc-btn:focus-visible {
    outline: 3px solid var(--sl-color-accent-high);
    outline-offset: 2px;
  }
```

- [ ] **Step 3: Build + keyboard smoke**

Run: `npm run build`
Expected: build completes.

Manual check via `npm run dev`: open `/it/about/`, Tab through the composer until the button is focused. Expected: visible coral-dark ring with 2px offset around the pill button.

### Task C2: Focus state for ObfuscatedEmail link

**Files:**
- Modify: `src/components/ObfuscatedEmail.astro`

- [ ] **Step 1: Add focus styles + pointer cursor**

Append a `<style>` block at the end of the file:

```astro
<style>
  a.obfuscated-email {
    cursor: pointer;
    border-radius: 0.25rem;
  }
  a.obfuscated-email:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }
</style>
```

- [ ] **Step 2: Build + smoke**

Run: `npm run build`
Manual check via `npm run dev`: navigate to `/it/about/`, Tab through until the obfuscated email link in the contact list is focused. Expected: coral outline with 2px offset, pointer cursor on hover.

### Task C3: Icon hover polish on clickable HomeCards

**Files:**
- Modify: `src/components/HomeCards.astro`

- [ ] **Step 1: Add a hover rule that scales the icon slightly on clickable cards only**

Append inside the existing `<style>` block, just after the `a.home-card:hover` rule:

```css
  .home-card-icon {
    transition: transform 180ms ease;
  }
  a.home-card:hover .home-card-icon {
    transform: scale(1.08);
  }
```

- [ ] **Step 2: Build + visual smoke**

Run: `npm run build`
Manual check via `npm run dev`: open `/it/`, hover over the "Fondamenti" card (clickable). Expected: card rises slightly (existing effect) AND icon scales up 8% on top of that. Hovering over "Uso quotidiano" (comingSoon) should do neither.

### Task C4: Verify Resume + RecapWithAi with six modules

**Files:** none, observation task.

- [ ] **Step 1: Read both components to confirm they don't enumerate modules by name**

Run:
```bash
grep -n 'fundamentals\|everyday\|work\|students\|teachers\|advanced' src/components/Resume.astro src/components/RecapWithAi.astro
```

Expected: matches only in `RecapWithAi.astro` within a hardcoded filter for `/fundamentals/` URLs (that is intentional: recap only covers published lessons, and right now only Fondamenti is published).

- [ ] **Step 2: Manual dev check**

Run `npm run dev`. In the browser:
1. Visit `/it/fundamentals/what-is-ai/` and stay at least 15 seconds, scroll to 80% to register a `read: true`.
2. Go back to `/it/`. Expected: the `<Resume>` card shows the last-read lesson with the correct title.
3. Go to `/it/start-here/`. Expected: the `<RecapWithAi>` card shows "1 lezione completata finora" and the Genera button is active.

If both behave correctly, the components are safe with six modules. If either glitches, flag it — do not attempt a fix here, raise with user.

### Task C5: Commit Phase C

- [ ] **Step 1: Stop the dev server if running**

- [ ] **Step 2: Review diff**

Run: `git status && git diff --stat`
Expected: three modified files (MailtoComposer, ObfuscatedEmail, HomeCards). No new files.

- [ ] **Step 3: Commit**

```bash
git add src/components/MailtoComposer.astro src/components/ObfuscatedEmail.astro src/components/HomeCards.astro
git commit -m "UX polish: focus rings and hover micro-interaction on cards

Explicit :focus-visible outlines on the MailtoComposer button and
the ObfuscatedEmail link so keyboard users see where they are — the
browser default was inconsistent against the coral palette.

Clickable HomeCards now gently scale their icon on hover (1.08x,
180ms ease) on top of the existing lift + shadow. Coming-soon cards
don't react, matching their non-clickable nature. Keeps the grid
lively without being twitchy."
```

---

## Out of scope (intentional)

- **Choosing and configuring the host** (Netlify / Vercel / Cloudflare Pages) and wiring the DNS CNAME on `larosa.work`: requires the user's hosting credentials and a live deploy; not a code task.
- **AI disclaimer page or global callout**: the user did not confirm wanting this yet; the Fondamenti module lesson 5 already covers trust, so this is deferrable.
- **FAQ page** (listed as 🆕 in CONTENT.md): real content work, better paired with the Module 2 writing effort.
- **README.md / LICENSE / GitHub Actions**: only matter when the repo goes public; defer until the user decides on repo visibility.
