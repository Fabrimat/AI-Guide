# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cos'è questo progetto

**AI-Guide** è un sito pubblico (Astro + Starlight) che insegna a usare l'IA in italiano, dai fondamenti al livello avanzato. I contenuti sono file Markdown/MDX didattici. L'integrazione con l'IA avviene lato lettore: ogni esercizio pratico è un file `.md` in `public/skills/` che il lettore copia e incolla nel proprio LLM (Claude, ChatGPT, Gemini, ecc.).

## Comandi

```bash
npm install       # installa le dipendenze
npm run dev       # dev server su http://localhost:4321
npm run build     # genera il sito statico in dist/
npm run preview   # serve dist/ localmente
```

Nessun linter/test configurato al momento. Lo "smoke test" è `npm run build`: se gira pulito, la build è OK.

## Scrittura di contenuti — regole vincolanti

Prima di scrivere o modificare qualunque pagina di `src/content/docs/`, leggi
per intero **`.claude/skills/voice-guide/SKILL.md`**. È la voice guide del
progetto e contiene la lista completa dei pattern da evitare.

Regole non negoziabili (estratto):

1. **Zero em dash (—).** Mai. Usare virgola, due punti, parentesi, o spezzare la frase.
2. **Zero lessico AI italiano**: niente `panorama`, `scenario`, `cruciale`, `dirompente`, `sinergia`, `ecosistema`, `mindset`, `strategico`, `imprescindibile`, `paradigmatico`.
3. **Zero buzzword aziendalese**: niente `un vero e proprio`, `a 360 gradi`, `in un'ottica di`, `di fatto`, `a tutti gli effetti`, `di eccellenza`.
4. **Zero passivi impersonali AI**: niente `si ritiene`, `si osserva`, `va notato che`.
5. **Zero formule burocratiche**: niente `al fine di` (usare `per`), `in merito a`, `per quanto concerne`.
6. **Zero verbi burocratici**: niente `optare`, `usufruire`, `effettuare`, `porre in essere`.
7. **Zero chiusure scolastiche**: niente `In conclusione`, `In sintesi`, `In definitiva`, `Per concludere`.
8. **Zero aperture hype**: niente `In un mondo in cui…`, `Nell'era digitale…`, `Oggigiorno…`.

Per il dettaglio completo (pattern universali, specifici IT, controlli di autenticità, checklist), vedi `.claude/skills/voice-guide/SKILL.md`.

## Frontmatter delle lezioni

Ogni lezione in `src/content/docs/` (esclusi `index.mdx` e pagine meta) deve avere:

```yaml
---
title: Titolo
description: Una frase
livello: principiante | intermedio | avanzato
prerequisiti: [slug-altra-lezione]    # opzionale
---
```

Lo schema è validato in `src/content.config.ts`.

## Architettura (alto livello)

- **Astro 6 + Starlight**: sito statico, contenuti MD/MDX in `src/content/docs/`.
- **i18n nativo Starlight**: italiano alla root (`src/content/docs/...`), inglese sotto `src/content/docs/en/...` (attualmente vuoto: fallback automatico all'italiano). Configurato in `astro.config.mjs`.
- **View transitions abilitate** via override del componente `Head` (`src/components/Head.astro`). Permettono navigazione SPA-like e cambio lingua senza reset visivo.
- **`EsercizioLLM.astro`**: componente usato nelle pagine `.mdx` per esporre un prompt scaricabile/copiabile. Il file `.md` del prompt vive in `public/skills/` ed è servito staticamente.
- **Custom CSS**: `src/styles/custom.css` (caricato da Starlight via `customCss`).

## Skill e agent del progetto

Invocabili da Claude Code:

- **`/voice-guide`** — riferimento di stile (lo leggi, non lo esegui).
- **`/analyze-lesson <path>`** — analizza una pagina simulando un lettore al livello dichiarato e produce una lista di domande del lettore. Output in `analysis/<slug>.questions.md`.
- **`/integrate-questions <path> [questions-file]`** — integra le domande nella pagina come risposte inline, callout, esempi, o FAQ. Chiede conferma prima di applicare.
- **Agent `style-checker`** — passa di QA su una pagina. Non modifica, solo segnala.

Workflow tipico per una nuova lezione:

1. Scrivo la bozza in `src/content/docs/<sezione>/<slug>.mdx`.
2. Lancio `/analyze-lesson <path>` per vedere cosa un lettore non capirebbe.
3. Curo le domande nel file `analysis/<slug>.questions.md`.
4. Lancio `/integrate-questions <path>` per integrarle.
5. Lancio l'agent `style-checker` per un QA finale.

## Traduzione

Mirror dell'albero sotto `src/content/docs/en/`. Stesso slug, stesso percorso. Le pagine senza traduzione ricadono automaticamente sull'italiano (nessun errore di build). Per aggiungere una terza lingua, aggiungere la voce in `astro.config.mjs > locales`.

## Preferenze di commit

- **Niente trailer `Co-Authored-By: Claude …`** nei commit.
- Messaggio di commit in inglese, body conciso (cosa + perché, non il diff).
