# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Cos'è questo progetto

**AI-Guide** è un sito pubblico (Astro + Starlight) che insegna a usare l'IA in italiano, dai fondamenti al livello avanzato. I contenuti sono file Markdown/MDX didattici. L'integrazione con l'IA avviene lato lettore: ogni esercizio o verifica è un file `.txt` in `public/skills/` (plain text, niente markdown) che il lettore copia e incolla nel proprio LLM (Claude, ChatGPT, Gemini, ecc.).

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

- **Astro 6 + Starlight**: sito statico, contenuti MD/MDX in `src/content/docs/<lingua>/`.
- **i18n nativo Starlight con prefisso uniforme**: tutte le lingue hanno URL prefissato (`/it/...`, `/en/...`). La root `/` fa redirect a `/it/` (lingua di default, configurata in `astro.config.mjs > redirects`). Le pagine non tradotte ricadono automaticamente sulla lingua di default.
- **View transitions abilitate** via override del componente `Head` (`src/components/Head.astro`). Permettono navigazione SPA-like e cambio lingua senza reset visivo.
- **Componenti riutilizzabili in `src/components/`**: vedi sezione "Componenti del progetto" più sotto.
- **Tracker dei progressi** (`src/scripts/progress.ts`): caricato via `Head.astro` su ogni pagina. Registra in `localStorage` (chiave `aiguide:progress:v1`) visite/tempo/scroll/letture/click sui pulsanti. **Niente backend, niente cookie, niente analytics terze: tutto resta sul browser dell'utente.** Il componente `<Resume>` (vedi catalogo sotto) lo consuma per mostrare "Riprendi da dove hai lasciato".

## Direzione visiva — Pastello

Il sito usa **una sola palette warm** ("Pastello") pensata per un pubblico non-tecnico con pregiudizi su IA/tecnologia. Il design è "manuale amichevole", non "documentazione corporate".

**Palette (CSS vars in `src/styles/custom.css`)**:

| Token                       | Valore     | Uso                          |
|-----------------------------|------------|------------------------------|
| `--sl-color-bg`             | `#FCEEE3`  | sfondo pagina (pesca)        |
| `--sl-color-text`           | `#2A2447`  | testo principale (indigo)    |
| `--sl-color-text-accent`    | `#C25A3F`  | link nel corpo (coral scuro) |
| `--sl-color-accent`         | `#E07A5F`  | accento, CTA (coral)         |
| `--sl-color-accent-low`     | `#FAD0C2`  | accento soffuso              |
| `--sl-color-accent-high`    | `#B85D44`  | hover su accento             |
| `--sl-color-hairline`       | `#F0DCC9`  | bordi                        |

**Tipografia**: [Outfit Variable](https://fonts.google.com/specimen/Outfit) via `@fontsource-variable/outfit`. Base 17px, line-height 1.7, heading tracking `-0.005em`.

**Vincoli**:

- **Niente dark mode.** `ThemeSelect.astro` è override-vuoto, `Head.astro` blocca `data-theme="light"` prima del rendering. Non rimuovere queste cose senza decisione esplicita.
- **Niente TOC laterale.** `PageSidebar.astro` è override-vuoto. Le lezioni sono brevi e auto-contenute.
- **Niente blu/cyber/neri puri/densità "da docs".** Quando aggiungi UI: usa le CSS vars di Starlight già sovrascritte, non hardcodare colori.
- **Outfit è la voce dominante.** Aggiungere font solo con discussione esplicita.
- **Riferimenti mentali**: NYT Cooking, Brain Pickings, guide illustrate di carta. NON: Stripe / Linear / Vercel docs.
- **Custom CSS**: `src/styles/custom.css` (caricato da Starlight via `customCss`).

## Componenti del progetto

Catalogo dei componenti riutilizzabili nei file `.mdx` delle lezioni. Mantenere
sincronizzato: **ogni nuovo componente che può essere usato in una pagina deve
avere una voce qui, aggiornata nello stesso commit che lo introduce o lo modifica.**

I componenti **interni** (override di Starlight, layout, helper non destinati ai
file `.mdx`) NON vanno catalogati qui: vivono solo in `src/components/`.

Per importare un componente in una lezione `.mdx`, calcolare la profondità relativa.
Per una lezione standard a `src/content/docs/it/<sezione>/<lezione>.mdx`:

```mdx
import NomeComponente from '../../../../components/NomeComponente.astro';
```

### `<Resume>`

Card "Riprendi da dove hai lasciato". Da posizionare su pagine di
orientamento (homepage, `inizia-qui`). Legge `localStorage`
(`aiguide:progress:v1`, popolata da `src/scripts/progress.ts`) e mostra
l'ultima pagina leggibile che l'utente ha lasciato in una sessione
precedente.

Si nasconde da sola se non c'è cronologia (prima visita) o se l'ultima
pagina coincide con quella corrente. Include la riga di privacy ("salvati
solo sul tuo browser, mai inviati altrove") e un pulsante "Cancella
progressi" che svuota `localStorage` con conferma.

Nessun prop. Si include come `<Resume />`.

```mdx
import Resume from '../../../components/Resume.astro';

<Resume />
```

### `<LlmExercise>`

Card che propone alla lettrice un'attività da svolgere con il proprio LLM:
mostra titolo, descrizione, e pulsanti per copiare/scaricare/aprire un file
`.txt` di istruzioni. Il file vive in `public/skills/<nome>.txt` (plain
text, niente markdown) ed è servito staticamente.

Due varianti, scelte con `variant`:

- `practice` (default): pratica guidata. Accento coral. Badge "🤖 Esercizio
  con la tua IA".
- `review`: verifica dell'apprendimento a fine lezione. Accento ocra.
  Badge "📝 Verifica con la tua IA".

Il meccanismo (file scaricabile + copia + apri) è identico nelle due
varianti. Convenzione: i file di review si chiamano
`verifica-<slug-lezione>.txt`.

| Prop          | Tipo                          | Default      | Note                                              |
|---------------|-------------------------------|--------------|---------------------------------------------------|
| `title`       | `string`                      | —            | obbligatorio                                      |
| `file`        | `string`                      | —            | nome del file in `public/skills/`, es. `mio.txt`  |
| `description` | `string`                      | —            | opzionale, breve descrizione sotto il titolo      |
| `variant`     | `'practice' \| 'review'`      | `'practice'` | scegli il framing visivo                          |

```mdx
{/* Esercizio pratico nel corpo della lezione */}
<LlmExercise
  title="La tua prima conversazione consapevole"
  file="primo-esercizio.txt"
  description="Un esercizio guidato in cui l'IA ti aiuta a capire come formulare una richiesta chiara."
/>

{/* Verifica a fine lezione */}
<LlmExercise
  variant="review"
  title="Quattro domande per fissare le idee"
  file="verifica-cos-e-l-ia.txt"
  description="Incolla il testo nella tua IA. Ti farà quattro domande progressive sulla lezione, una alla volta."
/>
```

### `<HomeCards>`

Griglia di card visive per la landing. Sostituisce le liste a punti
"da docs". Ogni card ha icona, titolo, descrizione, e link opzionale.
Le card non ancora pronte si segnalano con `comingSoon: true`: niente
link, badge "Presto" in alto a destra.

| Prop              | Tipo            | Default   | Note                                                |
|-------------------|-----------------|-----------|------------------------------------------------------|
| `heading`         | `string`        | —         | opzionale, titolo di sezione sopra le card           |
| `cards`           | `HomeCard[]`    | —         | obbligatorio, almeno una card                        |
| `comingSoonLabel` | `string`        | `'Presto'`| testo del badge per le card `comingSoon`             |

`HomeCard`:

| Campo         | Tipo       | Default | Note                                          |
|---------------|------------|---------|------------------------------------------------|
| `icon`        | `string`   | —       | obbligatorio, tipicamente un emoji            |
| `title`       | `string`   | —       | obbligatorio                                  |
| `description` | `string`   | —       | obbligatorio                                  |
| `href`        | `string`   | —       | opzionale, URL della pagina target            |
| `comingSoon`  | `boolean`  | `false` | se true: card non cliccabile, badge "Presto"  |

```mdx
<HomeCards
  heading="Da dove parti?"
  cards={[
    {
      icon: '🌱',
      title: 'Fondamenti',
      description: "Cos'è un'IA, come parlarci, cosa aspettarti.",
      href: '/it/fondamenti/cos-e-l-ia/',
    },
    {
      icon: '✍️',
      title: 'Uso quotidiano',
      description: 'Scrivere, riassumere, imparare cose nuove.',
      comingSoon: true,
    },
  ]}
/>
```

### `<ChatDemo>`

Conversazione utente/IA animata (typewriter + dots di "thinking"). Sostituisce
le GIF di esempio. No-JS friendly (mostra il testo finale statico). Rispetta
`prefers-reduced-motion: reduce` (rendering statico). Parte solo quando entra
in viewport (`IntersectionObserver`).

| Prop            | Tipo      | Default | Note                                              |
|-----------------|-----------|---------|---------------------------------------------------|
| `user`          | `string`  | —       | obbligatorio: il messaggio dell'utente            |
| `ai`            | `string`  | —       | obbligatorio: la risposta dell'IA                 |
| `typingSpeed`   | `number`  | `28`    | ms per carattere                                  |
| `thinkingTime`  | `number`  | `900`   | ms di pausa fra invio utente e risposta IA       |
| `autoPlay`      | `boolean` | `true`  | parte automaticamente al viewport                 |
| `loop`          | `boolean` | `false` | riavvia in loop                                   |
| `loopDelay`     | `number`  | `3500`  | ms di pausa tra un ciclo e il successivo          |
| `userLabel`     | `string`  | `'Tu'`  | etichetta sopra la bolla utente                   |
| `aiLabel`       | `string`  | `'IA'`  | etichetta sopra la bolla IA                       |
| `showReplay`    | `boolean` | `true`  | mostra il pulsante "Riavvia"                      |

```mdx
<ChatDemo
  user="Mi spieghi in due frasi cos'è un buco nero?"
  ai={`Un buco nero è una regione dello spaziotempo dove la gravità è così forte che nulla, nemmeno la luce, può sfuggirle.

Si forma quando una stella molto massiccia, a fine vita, collassa su se stessa.`}
/>
```

I newline dentro la stringa `ai` (uso del template literal con backtick) vengono
preservati e renderizzati come a-capo grazie a `white-space: pre-wrap`.

## Piano dei contenuti

La roadmap editoriale vive in **`CONTENT.md`** al root: moduli previsti, stato
di ogni lezione, lezioni in arrivo, workflow per scriverne una nuova.
Aggiornare `CONTENT.md` **nello stesso commit** in cui una lezione viene
scritta, rinominata, o eliminata.

## Skill e agent del progetto

Invocabili da Claude Code:

- **`/voice-guide`** — riferimento di stile (lo leggi, non lo esegui).
- **`/analyze-lesson <path>`** — analizza una pagina simulando un lettore al livello dichiarato e produce una lista di domande del lettore. Output in `analysis/<slug>.questions.md`.
- **`/integrate-questions <path> [questions-file]`** — integra le domande nella pagina come risposte inline, callout, esempi, o FAQ. Chiede conferma prima di applicare.
- **Agent `style-checker`** — passa di QA su una pagina. Non modifica, solo segnala.

Workflow tipico per una nuova lezione:

1. Scrivo la bozza in `src/content/docs/it/<sezione>/<slug>.mdx`.
2. Lancio `/analyze-lesson <path>` per vedere cosa un lettore non capirebbe.
3. Curo le domande nel file `analysis/<slug>.questions.md`.
4. Lancio `/integrate-questions <path>` per integrarle.
5. Lancio l'agent `style-checker` per un QA finale.

## Traduzione

Mirror dell'albero sotto `src/content/docs/en/`. Stesso slug, stesso percorso. Le pagine senza traduzione ricadono automaticamente sulla lingua di default (nessun errore di build). Per aggiungere una terza lingua, aggiungere la voce in `astro.config.mjs > locales`.

## Preferenze di commit

- **Niente trailer `Co-Authored-By: Claude …`** nei commit.
- Messaggio di commit in inglese, body conciso (cosa + perché, non il diff).
