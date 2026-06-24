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

## Hosting e deploy

**Hosting**: [Netlify](https://netlify.com), free tier. Sito statico,
build server-side da Git push. Astro è auto-rilevato (`npm run build`,
output in `dist/`).

**DNS / dominio**: `ai-guide.larosa.work`. Il dominio `larosa.work` è
gestito su Cloudflare DNS. Record CNAME `ai-guide` → dominio Netlify
del progetto, in modalità **proxied (nuvola arancione)**. Cloudflare
fa da reverse proxy davanti a Netlify: termina TLS lato visitatore
con un suo certificato e ne apre uno separato verso Netlify. Perché
funzioni, l'SSL mode di Cloudflare deve essere **Full** o **Full
(strict)** (Settings → SSL/TLS), sennò Netlify rifiuta la connessione
o si crea un loop di redirect. Cloudflare in questa modalità vede IP,
fa caching/CDN/anti-DDoS, è il layer descritto in `privacy.mdx` →
"Cloudflare davanti al sito".

**Branch strategy**:

- `main` — sviluppo. Netlify **non** è agganciato a `main`: pushare
  qui non genera nessun deploy (né preview né live). Serve solo per
  accumulare i commit prima di mandarli live.
- `production` — produzione. È l'unico branch che Netlify deploya, e
  va su `ai-guide.larosa.work`. Solo fast-forward da `main`, mai
  commit diretti.

**Workflow per andare live:**

```bash
# Sviluppi su main e pushi (nessun deploy parte da qui)
git push origin main

# Quando vuoi mandare live
git checkout production
git merge --ff-only main
git push origin production     # → deploy live
git checkout main
```

`--ff-only` evita merge commit accidentali. Se la merge non è
fast-forward c'è qualcosa che non va (rebase, divergenza), investigare
prima di forzare.

Quindi per "pushare per generare un preview" non c'è scorciatoia: o
si va direttamente su `production` (che è live, non preview), o si
testa in locale con `npm run dev` / `npm run preview`.

**Env var lato build**: nessuna richiesta. Il sito è completamente
statico, non legge segreti a build time.

**Env var lato runtime**: zero, è statico.

**Node version**: 22, pinnata in `.nvmrc` al root del repo. Netlify
e nvm/fnm locali la rispettano automaticamente.

**Niente Cloudflare Pages**: tentato e abbandonato per friction della
loro UI in transizione (Workers Builds + token interni che si
invalidavano). Non riprovarci senza una motivazione forte.

**Cloudflare Worker `sa-proxy`** (`workers/sa-proxy/`): proxy
first-party per Simple Analytics. Lo script di SA caricato dal CDN
ufficiale è bloccato da molti adblocker per dominio; servirlo da
`ai-guide.larosa.work/sa/proxy.js` lo rende invisibile alle blocklist.
Il Worker inoltra `/sa/proxy.js`, `/sa/auto-events.js`, `/sa/simple/*`
ai relativi endpoint di Simple Analytics, strippando header con IP del
visitatore prima del forward. Deploy: `cd workers/sa-proxy && npx
wrangler deploy` (richiede `npx wrangler login` la prima volta). Il
Worker è bound alla route `ai-guide.larosa.work/sa/*` su zone
`larosa.work`; tutto il resto del traffico continua ad andare a
Netlify. Vedi `workers/sa-proxy/README.md` per il dettaglio. Se si
cambia provider analytics o si tocca lo script lato `Head.astro`,
aggiornare anche questo Worker.

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
- **i18n nativo Starlight con prefisso uniforme**: tutte le lingue hanno URL prefissato (`/en/...`, `/it/...`). La root `/` non è un redirect statico: `src/pages/index.astro` legge `navigator.languages` e fa replace verso `/en/` o `/it/` lato client. Default e fallback (no-JS o lingua non supportata): `/en/`. Le pagine senza traduzione ricadono automaticamente sull'inglese.
- **View transitions abilitate** via override del componente `Head` (`src/components/Head.astro`). Permettono navigazione SPA-like e cambio lingua senza reset visivo.
- **Tempo di lettura stimato** sotto l'H1 di ogni lezione, calcolato lato client da `src/components/ReadingTime.astro` (220 parole/minuto sul testo di `.sl-markdown-content`). Iniettato dall'override di `PageTitle` (`src/components/PageTitle.astro`) solo sulle pagine con `livello` nel frontmatter, così la splash hero non lo riceve.
- **Componenti riutilizzabili in `src/components/`**: vedi sezione "Componenti del progetto" più sotto.
- **Tracker dei progressi** (`src/scripts/progress.ts`): caricato via `Head.astro` su ogni pagina. Registra in `localStorage` (chiave `aiguide:progress:v1`) visite/tempo/scroll/letture/click sui pulsanti. **Niente backend, niente cookie, niente analytics terze: tutto resta sul browser dell'utente.** Il componente `<Resume>` (vedi catalogo sotto) lo consuma per mostrare "Riprendi da dove hai lasciato".
- **Sidebar auto-scroll** (`src/scripts/sidebar-scroll.ts`): caricato via `Head.astro`. Su ogni navigazione scrolla `#starlight__sidebar` in modo che il **modulo corrente** (il `<details>` antenato del link `a[aria-current="page"]`) sia in cima, con 8px di padding. Per le pagine top-level senza modulo (Start here, Glossary, About) il fallback è il link stesso. Sovrascrive intenzionalmente il restore di Starlight.
- **Popover "Preferenze" in header** (`src/components/Header.astro` + `src/components/HeaderPreferences.astro`): override del Header di Starlight, un solo bottone sliders che apre un popover con tre sezioni etichettate (Lettura assistita + descrizione, Tema, Lingua). Theme e Language select sono riusati invariati da Starlight via virtual import (`virtual:starlight/components/ThemeSelect` e `.../LanguageSelect`), così conservano la loro logica custom element + persistence. Il `MobileMenuFooter` è overridden a vuoto: theme e lang vivono nel popover, che resta visibile anche su mobile.
- **Lettura assistita** (`src/scripts/reading-mode.ts`): on/off toggle dentro il popover "Preferenze". Lo script cammina i nodi testo dentro `main .sl-markdown-content` (non tocca header/sidebar/footer/componenti con `.not-content`) con `TreeWalker` e li sostituisce con `<span data-bionic-wrap>` contenenti `<b data-bionic>` (1-4 caratteri iniziali della parola, a scaglioni per lunghezza) + testo residuo; disattivare fa unwrap + `normalize()`. Preferenza persistita in `localStorage['aiguide:reading-mode']`, stato rispecchiato pre-paint in `<html data-reading-mode="on">` da uno script inline in `Head.astro`. Re-applicato su `astro:page-load` per view transitions.
- **Condivisione lezione** (`src/components/ShareLesson.astro`): riga di icone (X, LinkedIn, WhatsApp, email, copia link) auto-iniettata dal `Footer.astro` override subito prima della card "Prossima lezione". Appare solo sulle pagine con `livello` nel frontmatter (= lezioni), assente su homepage/about/privacy/glossary/404. Solo intent URL (`twitter.com/intent/tweet`, `linkedin.com/sharing/share-offsite`, `wa.me/?text=`, `mailto:`), niente SDK o tracker.
- **PWA installabile e lezioni offline** (`src/sw.ts`, `src/components/InstallApp.astro`, integration `@vite-pwa/astro` in `astro.config.mjs`). Il sito è installabile come Progressive Web App su Chrome/Edge desktop, Chrome Android, e iOS Safari (via "Aggiungi alla schermata Home"). Caching a due livelli:
  - **Layer 1**: Workbox precachea lo "shell" (JS, CSS, font, icone, manifest, pagine `/offline/`) per chiunque visiti il sito, anche senza installare. Atomico, ~200–500 KB.
  - **Layer 2**: bulk download di tutto il manuale (HTML lezioni IT+EN, `.txt` di `public/skills/<lang>/`, intero index Pagefind) gestito a mano dal SW. La lista vive in `dist/aiguide-bulk-manifest.json`, generata a build time da `scripts/generate-bulk-manifest.mjs`. Il SW la fetcha a ogni trigger (`AIGUIDE_BULK_DOWNLOAD` postMessage), skippa idempotentemente i file già in cache, scarica i mancanti, fa prune delle entry obsolete. Trigger: evento `appinstalled`, ogni `astro:page-load` se in `display-mode: standalone`, evento `online` se standalone. Resume automatico dopo interruzione.
  - **Update strategy**: `registerType: 'autoUpdate'` con `skipWaiting()` + `clients.claim()`. Aggiornamenti silenziosi al prossimo navigation event. Il content hashing degli asset Astro + il revision hashing di Workbox rendono l'update incrementale: solo i file cambiati vengono riscaricati.
  - **Bottone "Installa l'app"**: in `HeaderPreferences.astro`, quarta sezione del popover. Chrome/Edge/Android: cattura `beforeinstallprompt`. iOS: apre un modale di istruzioni passo-passo. Già installato (`display-mode: standalone` o `navigator.standalone`): bottone nascosto, mostra stato "App installata · pronta offline" + progress bar durante il bulk DL.
  - **Pagine `/offline/`**: `src/content/docs/<lang>/offline.mdx`, mostrate come fallback solo per navigation request a URL non in cache. Localizzate in IT/EN, scelte dal SW in base al path del documento richiesto.
  - **Icone PWA**: generate a `prebuild` da `scripts/generate-pwa-icons.mjs` (rasterizza `public/favicon.svg` con `sharp` a 192/512/180 standard + 512 maskable con safe-zone Android). Output in `public/icons/`.
  - **Headers di deploy**: `public/_headers` (Netlify) imposta `Cache-Control: max-age=0, must-revalidate` per `/sw.js`, `/registerSW.js`, e `/aiguide-bulk-manifest.json`: sennò Cloudflare/Netlify potrebbero servire una versione obsoleta del SW e bloccare gli update.
  - `<InstallApp>` è un componente **interno**, montato solo dentro `HeaderPreferences.astro`. NON va nel catalogo "Componenti del progetto" (quello cataloga solo i componenti riusabili dalle lezioni `.mdx`).
  - Il SW non intercetta `/sa/**` (Simple Analytics): quel traffico continua a passare attraverso il Worker `sa-proxy` su Cloudflare e a raggiungere SA in tempo reale, anche con la PWA attiva.

## Assistente IA locale (in-browser)

`src/components/LocalAI/` aggiunge un assistente che gira interamente
nel browser via `@mlc-ai/web-llm` (WebGPU), montato su ogni pagina da
`Footer.astro`. Niente backend, niente API key: il modello (Qwen2.5,
tre tagli scelti dall'utente al consenso: 0.5B / 1.5B / 3B) si scarica
una sola volta da CDN terza (Hugging Face) **solo dopo consenso
esplicito**, poi resta in cache (web-llm, Cache API) e gira offline.
`ChatPanel.astro` rende launcher + drawer e passa stringhe/config via
`data-*`; `chat-ui.ts` è il custom element `<local-ai>` che guida la
macchina a stati (consent → download con progress → ready, oppure
fallback no-WebGPU / errore con retry sul modello leggero);
`chat-worker.ts` ospita l'engine fuori dal main thread;
`lesson-context.ts` estrae il testo della lezione corrente (budget
~1500 token); `search-context.ts` interroga Pagefind per estratti da
altre lezioni; `skill-loader.ts` legge i file `.txt` di check-in dalle
card `<LlmExercise>` (via `data-file`/`data-variant`) ed esegue
l'esercizio in modo interattivo. Consenso persistito in
`localStorage['aiguide:localai:consent']` (valore = id del modello).
Nessuna conversazione viene salvata o inviata. È un'aggiunta: i
pulsanti Copy/Download/Open di `<LlmExercise>` restano.

web-llm è importato **dinamicamente** in `chat-ui.ts` (non a top level)
e ha un chunk con nome stabile `webllm` (via `vite.build.rollupOptions.
output.manualChunks` in `astro.config.mjs`): così non finisce nel bundle
di ogni pagina e si scarica solo dopo il consenso. I chunk `webllm.*` e
`chat-worker-*` (~6 MB l'uno) sono esclusi dal precache PWA via
`injectManifest.globIgnores`, sennò Workbox (modalità injectManifest)
fallisce la build sui file oltre 2 MiB. Il SW non intercetta né questi
chunk né i pesi del modello da Hugging Face (cross-origin): nessuna
`registerRoute` li matcha. È un componente **interno**, NON va nel
catalogo "Componenti del progetto".

Ricerca cross-lezione (RAG): `search-context.ts` non usa più Pagefind ma un
indice di embeddings statico. A build time `scripts/generate-embeddings.mjs`
(step `postbuild`, **non-fatal**: se fallisce non rompe la build) legge le
lezioni MDX, le spezza per sezione H2, le embedda con `multilingual-e5-small`
via `@huggingface/transformers` e scrive `dist/embeddings/<locale>.json`. A
runtime `embedder.ts` carica Transformers.js in modo lazy (solo dentro il
percorso di chat, dopo il consenso; backend WASM) ed embedda la domanda;
`search-context.ts` fa cosine similarity e passa al prompt le lezioni più
pertinenti. Indice servito dal nostro dominio (cache Cloudflare); modello
embedder dalla CDN di Hugging Face, on demand. Niente di tutto questo è nel
precache PWA: il chunk client `transformers` è escluso via `globIgnores`
(come `webllm`) e l'indice non entra nel bulk manifest. Pagefind resta solo
per la ricerca Ctrl+K in `Search.astro`.

## Direzione visiva — Pastello

Il sito usa **una palette warm in due modalità** ("Pastello"), pensata per un pubblico non-tecnico con pregiudizi su IA/tecnologia. Il design è "manuale amichevole", non "documentazione corporate".

**Palette Light (CSS vars in `src/styles/custom.css`)**:

| Token                       | Valore     | Uso                          |
|-----------------------------|------------|------------------------------|
| `--sl-color-bg`             | `#FCEEE3`  | sfondo pagina (pesca)        |
| `--sl-color-text`           | `#2A2447`  | testo principale (indigo)    |
| `--sl-color-text-accent`    | `#C25A3F`  | link nel corpo (coral scuro) |
| `--sl-color-accent`         | `#E07A5F`  | accento, CTA (coral)         |
| `--sl-color-accent-low`     | `#FAD0C2`  | accento soffuso              |
| `--sl-color-accent-high`    | `#B85D44`  | hover su accento             |
| `--sl-color-hairline`       | `#F0DCC9`  | bordi                        |

**Palette Dark (warm dark)**:

| Token                       | Valore     | Uso                             |
|-----------------------------|------------|---------------------------------|
| `--sl-color-bg`             | `#1C130D`  | sfondo pagina (cioccolato)      |
| `--sl-color-text`           | `#F3E5D0`  | testo principale (crema)        |
| `--sl-color-text-accent`    | `#F29A82`  | link nel corpo (coral chiaro)   |
| `--sl-color-accent`         | `#E07A5F`  | accento, CTA (coral invariato)  |
| `--sl-color-accent-low`     | `#5A3025`  | accento soffuso (coral scuro)   |
| `--sl-color-accent-high`    | `#F29A82`  | hover su accento (più chiaro)   |
| `--sl-color-hairline`       | `#3D2D22`  | bordi                           |

Il coral (`--sl-color-accent`) è identico in entrambi i temi: è il tratto di continuità del sito.

**Token custom `--aig-*`**: usati dai componenti per sostituire `#ffffff` e `rgba(42, 36, 71, X)` hardcoded, così il tema scuro funziona senza toccare ogni file.

| Token                    | Uso                                                |
|--------------------------|----------------------------------------------------|
| `--aig-elevated-bg`      | sfondo di card, popover, modali (`#fff` in light)  |
| `--aig-elevated-bg-warm` | aside `:::note`                                    |
| `--aig-caution-*`        | aside `:::caution` e `<LlmExercise variant="review">` |
| `--aig-danger-*`         | aside `:::danger`                                  |
| `--aig-success-*`        | variante verde custom: avvolgi un `:::note` in `<div class="aig-success-wrap">…</div>` (Starlight non ha un tipo `success` nativo) |
| `--aig-shadow-color`     | tripletta rgb usata in `rgba(var(--aig-shadow-color), X)` per le box-shadow |
| `--aig-scrim`            | backdrop dei `<dialog>` modali                     |
| `--aig-hover-wash`       | hover wash su bottoni minimali / ghost             |

Quando aggiungi un componente con fondo "bianco" o ombre, usa questi token, non hardcodare `#ffffff` né `rgba(42, 36, 71, X)`.

**Tipografia**: [Outfit Variable](https://fonts.google.com/specimen/Outfit) via `@fontsource-variable/outfit`. Base 17px, line-height 1.7, heading tracking `-0.005em`.

**Vincoli**:

- **Due modalità, stessa identità.** Light (Pastello) e dark (warm dark cioccolato+crema). Il selettore è lo `ThemeSelect` di default di Starlight, persistito in `localStorage['starlight-theme']`. Rispetta `prefers-color-scheme`.
- **Niente TOC laterale.** `PageSidebar.astro` è override-vuoto. Le lezioni sono brevi e auto-contenute.
- **Niente blu/cyber/neri puri/densità "da docs".** Quando aggiungi UI: usa le CSS vars di Starlight e i token `--aig-*`, mai hardcodare colori.
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
orientamento (homepage, `start-here`). Legge `localStorage`
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

### `<LessonSummary>`

Riepilogo della lezione in 30 secondi. Da posizionare in alto alla
lezione, subito dopo gli import: chi skimma lo apre, chi legge tutto
lo ignora. Usa `<details>` nativo (collassato di default, funziona
senza JS, accessibile).

Il summary ha l'aspetto di un bottone (background coral-soft, testo
coral scuro, chevron che ruota all'apertura). Il body aperto flowa
sotto con una barra coral-soft a sinistra che lo collega visivamente
al summary, senza creare un box chiuso che possa disallineare col
resto della pagina.

L'etichetta è localizzata (`ui.lessonSummaryLabel`: "Riepilogo in 30
secondi" / "30-second summary"). Il contenuto è uno slot markdown:
tipicamente una lista di 3-5 punti che sintetizzano i takeaway della
lezione.

Linea guida editoriale: i bullet non devono ripetere i titoli delle
sezioni, ma dare il takeaway azionabile di ciascuna.

| Prop    | Tipo     | Default                   | Note                                    |
|---------|----------|---------------------------|------------------------------------------|
| `label` | `string` | `ui.lessonSummaryLabel`   | opzionale, per sovrascrivere l'etichetta |

```mdx
import LessonSummary from '../../../../components/LessonSummary.astro';

<LessonSummary>

- Le quattro leve: **risultato**, **contesto**, **formato**, **ruolo**.
- Dì cosa vuoi (verbo + risultato), non l'argomento generico.
- Dosa il contesto: rilevante sì, biografia no.

</LessonSummary>
```

Nota: le righe vuote sopra e sotto la lista sono necessarie perché
MDX parsi il markdown dentro il componente.

### `<GlossaryTerm>`

Voce singola di un glossario: nome del termine come prop, definizione
come slot (puoi usare `<em>`, `<strong>`, link, ecc. dentro la
definizione). Aggiunge un bottone "Spiegamelo meglio con la tua IA"
che, al click, copia nel clipboard un prompt calibrato sul termine
specifico, pronto da incollare nella propria IA.

| Prop  | Tipo     | Default | Note                                 |
|-------|----------|---------|--------------------------------------|
| `name`| `string` | —       | obbligatorio, nome del termine       |

L'`id` dell'elemento viene generato dal nome (slugificato), così è
linkabile via ancora.

```mdx
import GlossaryTerm from '../../../components/GlossaryTerm.astro';

<GlossaryTerm name="Allucinazione">
  Quando l'IA produce un testo che suona vero ma non si basa su nessun
  fatto reale.
</GlossaryTerm>
```

Pagina di riferimento: `src/content/docs/it/glossary.mdx`.

### `<Def>`

Termine inline cliccabile con una breve spiegazione in popover. Pensato
per le lezioni: quando nel testo compare una parola che potrebbe non
essere familiare, la si avvolge in `<Def>` e il lettore al click o al
passaggio del mouse vede la definizione senza lasciare la pagina.

La parola è evidenziata nel testo con sottolineatura tratteggiata
coral (stesso colore dei link nel corpo). Il popover appare sotto al
termine, max 280px, con background bianco e bordo hairline. Coerente
con la palette Pastello, indipendente dal `<GlossaryTerm>` (che resta
dedicato alla pagina Glossary dove compare l'elenco completo con
prompt "Spiegamelo meglio con la tua IA").

Comportamento:
- hover desktop e focus da tastiera: popover aperto via CSS.
- click / tap: toggle persistente (resta aperto finché l'utente clicca
  fuori o preme Escape).

A11y: il termine è un `<button>` (focusable nativo), con
`aria-expanded` sincronizzato e `aria-describedby` che collega al
popover (`role="tooltip"`).

| Prop          | Tipo     | Default | Note                                                                 |
|---------------|----------|---------|----------------------------------------------------------------------|
| `explanation` | `string` | —       | obbligatorio, testo puro. Per markup (link, grassetto) rinegoziare il componente con uno slot. |

Il termine visibile passa come child.

```mdx
import Def from '../../../../components/Def.astro';

Un <Def explanation="Il programma matematico dietro all'IA.">modello</Def>
è l'insieme di formule matematiche che fa funzionare una IA
conversazionale.
```

Nota sulla profondità di import: dentro una lezione a
`src/content/docs/it/<sezione>/<slug>.mdx` il path è
`../../../../components/Def.astro` (quattro livelli di risalita).

### `<RecapWithAi>`

Card che trasforma la tua IA in un tutor delle lezioni che hai
effettivamente letto. Legge `localStorage` (chiave
`aiguide:progress:v1`), filtra le pagine con `read: true` dentro un
modulo (es. `/it/fundamentals/...` o `/en/fundamentals/...`), e al
click di "Genera prompt di ripasso" assembla un prompt che contiene
la lista delle lezioni completate + istruzioni per ripasso socratico.
Mostrato in un `<dialog>` con bottone copia.

Quando 0 lezioni sono state completate il bottone è disabilitato e
una riga di stato lo spiega ("Completa almeno una lezione…"). Reagisce
all'evento `aiguide:progress-cleared` per aggiornarsi quando l'utente
cancella i progressi.

Pensato per pagine di orientamento e fine modulo. Nessun prop, si
include come `<RecapWithAi />`.

```mdx
import RecapWithAi from '../../../components/RecapWithAi.astro';

<RecapWithAi />
```

### `<PromptBuilder>`

Widget interattivo che porta la lettrice step-by-step a costruire un
prompt chiaro per il suo problema reale. Quattro campi (cosa vuoi,
contesto, destinatario, formato), preview live a destra, bottone
"Copia il prompt" per portare il risultato nella propria IA.

Pensato come naturale follow-up della lezione *Cos'è un prompt?*: la
teoria viene applicata sul problema della lettrice. Il prompt
assemblato è plain text, etichetta-style, pronto per Claude/ChatGPT/
Gemini.

Nessun prop. Si include come `<PromptBuilder />`.

```mdx
import PromptBuilder from '../../../../components/PromptBuilder.astro';

<PromptBuilder />
```

### `<LlmExercise>`

Card che propone alla lettrice un'attività da svolgere con il proprio LLM:
mostra titolo, descrizione, e pulsanti per copiare/scaricare/aprire un file
`.txt` di istruzioni. Il file vive in `public/skills/<name>.txt` per IT e
in `public/skills/en/<name>.txt` per EN (plain text, niente markdown). Il
componente risolve il path automaticamente in base al locale corrente: il
prop `file` resta uguale fra le due lingue.

Due varianti, scelte con `variant`:

- `practice` (default): pratica guidata. Accento coral. Badge "🤖 Esercizio
  con la tua IA" / "🤖 Exercise with your AI".
- `review`: verifica dell'apprendimento a fine lezione. Accento ocra.
  Badge "📝 Verifica con la tua IA" / "📝 Check-in with your AI".

Il meccanismo (file scaricabile + copia + apri) è identico nelle due
varianti. Convenzione: i file di review si chiamano
`review-<slug-lezione>.txt`. Le label visibili sono in `src/i18n/ui.ts`.

| Prop          | Tipo                          | Default      | Note                                                                              |
|---------------|-------------------------------|--------------|-----------------------------------------------------------------------------------|
| `title`       | `string`                      | —            | obbligatorio                                                                      |
| `file`        | `string`                      | —            | nome del file in `public/skills/<locale>/`, es. `review-what-is-ai.txt`           |
| `description` | `string`                      | —            | opzionale, breve descrizione sotto il titolo                                      |
| `duration`    | `string`                      | —            | opzionale, formato `"X min"` o `"X-Y min"` (es. `"5-7 min"`). Mostrato sotto il titolo come "X min di esercizio" o "X min di verifica" a seconda del variant. |
| `variant`     | `'practice' \| 'review'`      | `'practice'` | scegli il framing visivo                                                          |

```mdx
{/* Esercizio pratico nel corpo della lezione */}
<LlmExercise
  title="La tua prima conversazione consapevole"
  file="first-exercise.txt"
  duration="10 min"
  description="Un esercizio guidato in cui l'IA ti aiuta a capire come formulare una richiesta chiara."
/>

{/* Verifica a fine lezione */}
<LlmExercise
  variant="review"
  title="Quattro domande per fissare le idee"
  file="review-what-is-ai.txt"
  duration="5-7 min"
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

| Campo         | Tipo       | Default | Note                                                                       |
|---------------|------------|---------|----------------------------------------------------------------------------|
| `icon`        | `IconName` | —       | obbligatorio, id di un'icona del set `Icon.astro` (es. `'sprout'`)         |
| `title`       | `string`   | —       | obbligatorio                                                               |
| `description` | `string`   | —       | obbligatorio                                                               |
| `href`        | `string`   | —       | opzionale, URL della pagina target                                         |
| `comingSoon`  | `boolean`  | `false` | se true: card non cliccabile, badge "Presto"                               |

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

Set curato di icone SVG inline usate dalle card di navigazione
(`HomeCards`). Stile duotone: stroke coral scuro + fill coral chiaro,
wrapper squircle con sfondo `--sl-color-accent-low`. Palette Pastello
rispettata, aspetto stabile tra OS (a differenza delle emoji).

Icone disponibili (`IconName`): `sprout`, `pencil`, `briefcase`,
`graduation-cap`, `users`, `wrench`, `message-circle`. Aggiungerne
una significa estendere l'union type e aggiungere il blocco SVG in
`Icon.astro`.

Generalmente non serve importarlo direttamente dall'`.mdx`: le card
prendono `icon: IconName` e `HomeCards` lo monta da solo. Se in
futuro serve un'icona standalone fuori dalle card, importalo così:

```mdx
import Icon from '../../../components/Icon.astro';

<Icon name="graduation-cap" />
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
| `showReplay`    | `boolean` | `true`  | mostra i pulsanti "Salta" (durante l'animazione) e "Riavvia" |

```mdx
<ChatDemo
  user="Mi spieghi in due frasi cos'è un buco nero?"
  ai={`Un buco nero è una regione dello spaziotempo dove la gravità è così forte che nulla, nemmeno la luce, può sfuggirle.

Si forma quando una stella molto massiccia, a fine vita, collassa su se stessa.`}
/>
```

I newline dentro la stringa `ai` (uso del template literal con backtick) vengono
preservati e renderizzati come a-capo grazie a `white-space: pre-wrap`.

**Markdown inline nella risposta IA.** La stringa `ai` supporta un
sottoinsieme di markdown inline renderizzato in SSR: `**grassetto**` /
`__grassetto__`, `*corsivo*` / `_corsivo_`, `` `inline code` ``, e link
`[testo](url)` (solo schemi `http(s)`, `mailto:`, path interno `/`, ancora
`#`; schemi diversi ricadono su `#` per sicurezza). Niente block element
(liste, heading, citazioni restano testo piano). Il typewriter walka i nodi
di testo lasciando i tag in place, così il grassetto nel titolo di una
risposta appare già formattato dalla prima lettera digitata. La stringa
`user` resta testo piano e non viene parsata.

### `<MailtoComposer>`

Textarea + bottone "Apri email" che lancia un `mailto:` precompilato con
oggetto e corpo. Niente backend, niente fetch: il messaggio parte dal client
di posta dell'utente, coerente con la postura privacy del sito (vedi
`src/scripts/progress.ts`).

La mail passata in `to` viene splittata server-side in user/domain e
scritta come due `data-*` attributes separati (obfuscation contro crawler
spam). Lo script del componente ricompone l'indirizzo solo al click del
bottone "Apri email".

Pensato per pagine "scrivimi" tipo About, raccolta feedback a costo zero. Le
label visibili (badge, titolo, hint, bottone, messaggi di errore) sono in
`src/i18n/ui.ts` sotto le chiavi `composer*`.

| Prop            | Tipo     | Default                        | Note                                                            |
|-----------------|----------|--------------------------------|------------------------------------------------------------------|
| `to`            | `string` | —                              | obbligatorio: indirizzo destinatario (viene splittato e offuscato nel DOM) |
| `subject`       | `string` | `ui.composerSubject`           | oggetto della mail (default localizzato)                        |
| `placeholder`   | `string` | `ui.composerPlaceholder`       | placeholder della textarea                                      |
| `buttonLabel`   | `string` | `ui.composerButton`            | testo del bottone (default "Apri email" / "Open email")         |

```mdx
import MailtoComposer from '../../../components/MailtoComposer.astro';

<MailtoComposer to="ai-guide@larosa.work" />
```

### `<ObfuscatedEmail>`

Link email che si ricompone solo al caricamento JS. Il DOM statico
contiene `user` e `domain` in due `data-*` attributes separati, mai la
stringa unita `user@domain`. I crawler spam che scansionano HTML grezzo
non trovano una mail leggibile.

Se JS è disabilitato (raro), l'utente vede il fallback
`user [at] domain`, leggibile e copiabile senza spiegazioni.

Il wiring client (aggiorna `href` e testo) sta nello `<script>` di
`Footer.astro`, che è incluso in ogni pagina del sito. Quindi basta
usare `<ObfuscatedEmail>` dove serve, senza import di script aggiuntivi.

| Prop     | Tipo     | Default | Note                                        |
|----------|----------|---------|---------------------------------------------|
| `user`   | `string` | —       | obbligatorio: parte prima della chiocciola  |
| `domain` | `string` | —       | obbligatorio: parte dopo la chiocciola      |
| `class`  | `string` | —       | opzionale, classi CSS aggiuntive sul link   |

```mdx
import ObfuscatedEmail from '../../../components/ObfuscatedEmail.astro';

<ObfuscatedEmail user="ai-guide" domain="larosa.work" />
```

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
- **`/add-defs <path>`** — arricchisce una lezione con tooltip `<Def>` sui termini tecnici, lavorando in parallelo su tutte le lingue mirror trovate sotto `src/content/docs/<lang>/`. Mostra un piano (termini scelti + spiegazioni per lingua) prima di toccare i file.
- **Agent `style-checker`** — passa di QA su una pagina. Non modifica, solo segnala.

Workflow tipico per una nuova lezione:

1. Scrivo la bozza in `src/content/docs/it/<sezione>/<slug>.mdx`.
2. Lancio `/analyze-lesson <path>` per vedere cosa un lettore non capirebbe.
3. Curo le domande nel file `analysis/<slug>.questions.md`.
4. Lancio `/integrate-questions <path>` per integrarle.
5. Lancio `/add-defs <path>` per aggiungere i tooltip inline sui termini tecnici.
6. Lancio l'agent `style-checker` per un QA finale.

## Traduzione e i18n

**Slug in inglese ovunque.** Anche le pagine in italiano vivono a path
inglesi (`/it/start-here/`, `/it/fundamentals/what-is-ai/`). Lo slug è un
"code identifier", non testo per il lettore: tenerlo in inglese permette
di riusare la stessa sidebar config e gli stessi sidebar `slug:` per
tutti i locale, senza override e senza redirect.

**Mirror EN sotto `src/content/docs/en/`.** Stesso path file della
controparte IT (es. `en/fundamentals/what-is-ai.mdx`). Le pagine senza
traduzione ricadono automaticamente sulla lingua di default.

**File `.txt` di skill in `public/skills/<locale>/`.** Convenzione:
`public/skills/en/<name>.txt`, `public/skills/it/<name>.txt`. Il
componente `<LlmExercise>` risolve sempre il path con il prefisso
locale, qualunque sia la lingua di default.

**Stringhe UI dei componenti in `src/i18n/ui.ts`.** Dizionario tipato
`UIStrings` per ogni locale. Componenti server: `t(Astro.currentLocale)`.
Script client: ricevono le stringhe via `data-*` attributes pre-renderizzati
server-side. Aggiungere una lingua = aggiungere una voce in `STRINGS` e
in `Locale` (TypeScript forza la copertura completa di tutte le chiavi).

## Preferenze di commit

- **Niente trailer `Co-Authored-By: Claude …`** nei commit.
- Messaggio di commit in inglese, body conciso (cosa + perché, non il diff).
