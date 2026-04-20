# Modulo 2 "Uso quotidiano" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare live il Modulo 2 di AI-Guide ("Uso quotidiano") nella struttura definita in `docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`: 8 lezioni IT, infrastruttura (sidebar, directory, homepage, start-here), e aggiornamento di `CONTENT.md`.

**Architecture:** Un modulo di contenuto (Astro + Starlight + MDX), non un refactor di codice. Una fase A di scaffolding (una tantum), otto fasi B-I di scrittura lezione (una per lezione), una fase J di chiusura modulo (attivazione card homepage/start-here + allineamento CONTENT.md finale). Ogni lezione segue il workflow standard di AI-Guide: draft → `/analyze-lesson` → cura domande → `/integrate-questions` → esercizio di review in `public/skills/it/` → agent `style-checker` → build smoke → commit. Traduzione EN esclusa dallo scope di questo piano: sarà un piano separato quando il modulo IT è chiuso, come già fatto per Fondamenti.

**Tech Stack:** Astro 6 + Starlight 0.38, MDX, TypeScript (per `astro.config.mjs` e `src/content.config.ts`). Nessuna nuova dipendenza.

---

## File Structure

**Scaffolding del modulo (Fase A)**
- Modifica `CONTENT.md` (root) — sostituire elenco provvisorio del Modulo 2 con la struttura validata
- Crea `src/content/docs/it/everyday-use/.gitkeep` — placeholder per la directory IT
- Crea `src/content/docs/en/everyday-use/.gitkeep` — placeholder per la directory EN
- Modifica `astro.config.mjs` — aggiungere voce sidebar `everyday-use` tra `fundamentals` e `glossary`

**Lezioni IT (Fasi B-I, una per lezione)**
- Crea `src/content/docs/it/everyday-use/ask-well.mdx` (Fase B)
- Crea `src/content/docs/it/everyday-use/iterate-the-conversation.mdx` (Fase C)
- Crea `src/content/docs/it/everyday-use/understand-something-complex.mdx` (Fase D)
- Crea `src/content/docs/it/everyday-use/summarize-a-long-document.mdx` (Fase E)
- Crea `src/content/docs/it/everyday-use/learn-something-new.mdx` (Fase F)
- Crea `src/content/docs/it/everyday-use/write-better.mdx` (Fase G)
- Crea `src/content/docs/it/everyday-use/images-and-files.mdx` (Fase H)
- Crea `src/content/docs/it/everyday-use/what-not-to-do.mdx` (Fase I)

**Esercizi di review (uno per lezione, in fase con la lezione)**
- Crea `public/skills/it/review-ask-well.txt` (Fase B)
- Crea `public/skills/it/review-iterate-the-conversation.txt` (Fase C)
- ...e così via, una review per lezione, sempre `public/skills/it/review-<slug>.txt`

**File di analisi intermedi (uno per lezione, temporanei)**
- Crea `analysis/ask-well.questions.md` (Fase B, prodotto da `/analyze-lesson`, curato manualmente, consumato da `/integrate-questions`; il file resta committato come traccia)
- ...uno per lezione, stesso nome dello slug

**Attivazione card homepage e start-here (Fase J)**
- Modifica `src/content/docs/it/index.mdx` — card "Uso quotidiano": togliere `comingSoon: true`, aggiungere `href: '/it/everyday-use/ask-well/'`
- Modifica `src/content/docs/it/start-here.mdx` — card "Uso già ChatGPT, Claude o Gemini": togliere `comingSoon: true`, aggiungere `href: '/it/everyday-use/ask-well/'`
- Modifica `src/content/docs/en/start-here.mdx` — card "I already use ChatGPT, Claude, or Gemini": togliere `comingSoon: true` e aggiungere `href: '/en/everyday-use/ask-well/'` **solo se** esiste la lezione mirror EN. Se no, rimandare alla fase di traduzione EN del modulo (piano separato).

**Nota**: la card in `en/start-here.mdx` è nota condizionale, gestita in Fase J.

**Fuori scope esplicito (piano separato)**
- Traduzione EN delle 8 lezioni sotto `src/content/docs/en/everyday-use/`
- Esercizi di review EN sotto `public/skills/en/review-<slug>.txt`
- Attivazione card EN `i index/start-here`

Ogni fase termina con `npm run build` e un commit.

---

## Per-lesson workflow (riferimento)

Ogni lezione (Fasi B-I) segue lo stesso pattern di 7 passi. Non è un
template riutilizzabile a livello di tooling: è la sequenza da eseguire
a mano per ogni fase, già esplicitata in `CONTENT.md` > "Workflow per
scrivere una lezione". Ogni fase in questo piano ripete esplicitamente
i 7 passi con i path e i comandi giusti per quella lezione specifica.

1. **Aggiorna `CONTENT.md`**: stato della lezione da `🆕` a `✍️` (stessa fase, prima dei passi successivi).
2. **Bozza della lezione**: scrivere `src/content/docs/it/everyday-use/<slug>.mdx` rispettando la `voice-guide` (em dash vietati, lessico AI italiano vietato; vedi `.claude/skills/voice-guide/SKILL.md`).
3. **Genera domande del lettore**: `/analyze-lesson src/content/docs/it/everyday-use/<slug>.mdx` produce `analysis/<slug>.questions.md`. Rileggere le domande e scartare quelle che non convincono, aggiungere le proprie.
4. **Integra le domande**: `/integrate-questions src/content/docs/it/everyday-use/<slug>.mdx` aggiorna l'MDX con risposte inline, callout, esempi o FAQ, dopo conferma del diff.
5. **Crea esercizio di review**: scrivere `public/skills/it/review-<slug>.txt` (plain text, niente markdown) e aggiungere `<LlmExercise variant="review">` nell'MDX prima della card "Prossima lezione".
6. **QA finale con `style-checker`**: invocare l'agent `style-checker` sulla lezione. Applicare i fix suggeriti.
7. **Pubblica**: aggiornare `CONTENT.md` a `✅`, `npm run build`, commit.

**Nota su tooltip `<Def>`**: la skill `/add-defs` è utile sui termini tecnici, ma questo modulo ne ha pochi (il lessico tecnico è stato definito in Fondamenti). Invocarla solo se in lettura emergono termini non definiti nel paragrafo immediato.

---

## Phase A — Module scaffolding

Una tantum. Prepara l'infrastruttura senza pubblicare nessuna lezione. Al termine di questa fase la sidebar IT mostra "Uso quotidiano" vuota (o non la mostra affatto se Starlight nasconde le sezioni vuote); la homepage IT e la pagina start-here restano invariate (le card `comingSoon` si attivano in Fase J, quando la prima lezione è pronta).

### Task A1: Aggiornare CONTENT.md con la struttura validata

**Files:**
- Modifica: `CONTENT.md` (sezione "Modulo 2: Uso quotidiano", righe 110-130 circa; anche la sezione "Prossima sessione" va allineata)

- [ ] **Step 1: Sostituire l'elenco provvisorio del Modulo 2**

Trovare la sezione `## Modulo 2: Uso quotidiano (livello intermedio)` e sostituirla con il testo seguente:

```markdown
## Modulo 2: Uso quotidiano (livello misto `principiante` / `intermedio`)

Target: chi ha usato ChatGPT / Claude / Gemini qualche volta e vuole
portarli nel quotidiano con più consapevolezza. Spec di modulo:
`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`.

Struttura validata 2026-04-20. Otto lezioni, ordine pedagogico =
ordine di scrittura. Livello misto per lezione (5 `principiante`, 3
`intermedio`): il tag riflette la difficoltà reale della singola
lezione, non un'etichetta di modulo.

1. ⏳ **Chiedere bene** (`everyday-use/ask-well`, `principiante`)
   Tecniche per scrivere una richiesta che funziona: chiarezza,
   contesto, formato atteso. Ponte da *Cos'è un prompt?* di Fondamenti.
   Assorbe il caso "IA vs Google" come callout.

2. ⏳ **Iterare la conversazione** (`everyday-use/iterate-the-conversation`, `principiante`)
   Il prompt come dialogo, non comando singolo. "Prompt magici"
   demistificati. Esempio portante: pianificare un weekend in più giri
   (assorbe la voce provvisoria "Pianificare").

3. ⏳ **Capire una cosa complicata** (`everyday-use/understand-something-complex`, `principiante`)
   Tradurre dal burocratese al quotidiano: contratto, referto,
   bolletta, regolamento condominiale.

4. ⏳ **Riassumere un documento lungo** (`everyday-use/summarize-a-long-document`, `principiante`)
   PDF, articoli, libri. Come chiedere un riassunto affidabile e come
   verificarlo.

5. ⏳ **Imparare un argomento nuovo** (`everyday-use/learn-something-new`, `intermedio`)
   L'IA come tutor: spiegazioni a più livelli, interrogazioni di
   ritorno, verifica della qualità.

6. ⏳ **Scrivere meglio** (`everyday-use/write-better`, `intermedio`)
   Email, testi, messaggi. Giudizio "quando sì, quando no":
   riconoscere dove l'IA aiuta e dove appiattisce la voce.

7. ⏳ **Foto, immagini e file** (`everyday-use/images-and-files`, `intermedio`)
   Multimodalità: foto, screenshot, PDF. Differenze su ChatGPT /
   Claude / Gemini.

8. ⏳ **Cose da NON fare** (`everyday-use/what-not-to-do`, `principiante`)
   Sanitari, finanza, legale, decisioni importanti senza verifica.
   Chiusura del modulo, ponte verso *Sul lavoro*.

**Stato attuale**: 0 su 8 pubblicate. Struttura definita, scrittura da
iniziare.
```

- [ ] **Step 2: Allineare la sezione "Prossima sessione"**

In fondo al file, sostituire la sezione `## Prossima sessione` con:

```markdown
## Prossima sessione

**Revisioni pendenti**: nessuna. Modulo Fondamenti chiuso al 100% il
2026-04-19.

**Modulo 2 (Uso quotidiano)**: struttura validata 2026-04-20 in
`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`.
Piano di implementazione in
`docs/superpowers/plans/2026-04-20-uso-quotidiano-module.md`.
Prossima bozza: lezione 1, **Chiedere bene** (`everyday-use/ask-well`).
```

- [ ] **Step 3: Verificare il diff**

Run: `git diff CONTENT.md`

Expected: le due sezioni sostituite; nessun'altra modifica ai moduli 3-6 e alle sezioni "Pagine trasversali" e "Traduzione" e "Workflow per scrivere una lezione".

### Task A2: Creare le directory `everyday-use/`

**Files:**
- Crea: `src/content/docs/it/everyday-use/.gitkeep`
- Crea: `src/content/docs/en/everyday-use/.gitkeep`

- [ ] **Step 1: Creare le directory con placeholder**

```bash
mkdir -p src/content/docs/it/everyday-use src/content/docs/en/everyday-use
touch src/content/docs/it/everyday-use/.gitkeep
touch src/content/docs/en/everyday-use/.gitkeep
```

Motivo del `.gitkeep`: Starlight usa `autogenerate: { directory: 'everyday-use' }`. Senza un file dentro, git non traccia la cartella e `autogenerate` fallirebbe al prossimo build. Il placeholder viene rimosso automaticamente quando viene creato il primo `.mdx` reale (Fase B).

### Task A3: Aggiornare la sidebar in `astro.config.mjs`

**Files:**
- Modifica: `astro.config.mjs`

- [ ] **Step 1: Inserire la nuova voce sidebar**

Trovare il blocco `sidebar: [...]` e, tra `Fundamentals` e `Glossary`, inserire:

```javascript
{
  label: 'Everyday use',
  translations: { it: 'Uso quotidiano' },
  autogenerate: { directory: 'everyday-use' },
},
```

Il risultato finale del blocco `sidebar`:

```javascript
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
    label: 'Everyday use',
    translations: { it: 'Uso quotidiano' },
    autogenerate: { directory: 'everyday-use' },
  },
  {
    label: 'Glossary',
    translations: { it: 'Glossario' },
    slug: 'glossary',
  },
],
```

### Task A4: Build smoke test + commit Fase A

- [ ] **Step 1: Eseguire la build**

Run: `npm run build`

Expected: build completa senza errori. `autogenerate` su `everyday-use` può legittimamente loggare "no pages" o simile: accettabile finché non è un errore bloccante.

Se la build fallisce per `autogenerate` vuoto, accettabile fallback: rimuovere temporaneamente la voce sidebar in `astro.config.mjs` e reinserirla in Fase B (Task B1.a) prima di creare la prima lezione. Documentarlo in commit.

- [ ] **Step 2: Commit della Fase A**

```bash
git add CONTENT.md astro.config.mjs src/content/docs/it/everyday-use/ src/content/docs/en/everyday-use/
git commit -m "Scaffold Module 2 (Uso quotidiano): sidebar, empty dirs, validated content plan"
```

---

## Phase B — Lezione 1: Chiedere bene (`ask-well`)

**Slug**: `ask-well` · **Livello**: `principiante` · **Prerequisiti**: `what-is-a-prompt`

### Brief di lezione

Apertura del modulo. Il lettore ha già la definizione di "prompt" dai Fondamenti: qui impara come rendere una richiesta che funziona davvero, concretamente. La lezione deve:

- Aprire con un riconoscimento ("usi già l'IA, a volte funziona a volte no, la differenza sta nella richiesta").
- Introdurre quattro leve di qualità della richiesta: **chiarezza** (dire cosa vuoi, non solo l'argomento), **contesto** (chi sei, per chi è, cosa sai già), **formato atteso** (lista, paragrafo, tabella, tono), **ruolo** (chiedi all'IA di vestire un ruolo utile, es. "editor" / "insegnante di matematica per un decenne"). Quattro leve, non di più.
- Includere un `<ChatDemo>` con un prima / dopo (richiesta vaga → richiesta strutturata).
- Contenere un **callout** "IA vs Google" (~80-120 parole): due colonne mentali "L'IA vince quando… / Google vince quando…". Posizionamento naturale: verso la fine, dopo aver mostrato il metodo, per aiutare il lettore a ricordare che l'IA non è sempre il tool giusto.
- Chiudere con `<PromptBuilder />` come mini-esercizio: il lettore prova a comporre un prompt con le quattro leve.
- Fornire `<LlmExercise variant="review">` prima della "Prossima lezione".
- Lunghezza target: 800-1100 parole (coerente con la media del modulo Fondamenti).

### Task B1: Aggiornare stato lezione a "in lavorazione" in CONTENT.md

- [ ] **Step 1: Modificare la voce della lezione 1 in CONTENT.md**

Nel Modulo 2 di CONTENT.md, cambiare:

```
1. ⏳ **Chiedere bene** (`everyday-use/ask-well`, `principiante`)
```

in:

```
1. ✍️ **Chiedere bene** (`everyday-use/ask-well`, `principiante`)
```

Commit di questo step non necessario: si può includere nel commit finale della fase B.

### Task B2: Bozza della lezione `ask-well.mdx`

**Files:**
- Crea: `src/content/docs/it/everyday-use/ask-well.mdx`

- [ ] **Step 1: Leggere la voice-guide**

Prima di scrivere, leggere `.claude/skills/voice-guide/SKILL.md` integralmente. Ricordare i divieti duri: zero em dash (—), zero lessico AI italiano, zero passivi impersonali, zero chiusure scolastiche.

- [ ] **Step 2: Scrivere la bozza**

Creare il file con frontmatter:

```yaml
---
title: Chiedere bene
description: Quattro leve che fanno la differenza tra una risposta vaga e una utile.
livello: principiante
prerequisiti: [what-is-a-prompt]
---
```

Import da calcolare correttamente (quattro livelli di risalita dalla posizione `src/content/docs/it/everyday-use/ask-well.mdx`):

```mdx
import ChatDemo from '../../../../components/ChatDemo.astro';
import PromptBuilder from '../../../../components/PromptBuilder.astro';
import LlmExercise from '../../../../components/LlmExercise.astro';
```

Struttura suggerita del corpo:
1. Apertura (100-150 parole): la differenza che fa la differenza.
2. **Le quattro leve** (400-500 parole, un H2 unico con quattro H3): chiarezza, contesto, formato atteso, ruolo. Ogni leva: una frase che la definisce, un micro-esempio.
3. **Prima e dopo** (ChatDemo, ~100 parole di cornice): una richiesta vaga, la stessa rifatta con le quattro leve.
4. **Provalo tu** (~60 parole di cornice, poi `<PromptBuilder />`).
5. **Callout: IA o Google?** (80-120 parole, usando `:::tip[...]` o un paragrafo in evidenza): due colonne mentali, poi una frase di chiusura.
6. Transizione di chiusura (50-80 parole): "la richiesta è solo l'inizio. Le IA migliorano quando continui a parlarci. Ne parliamo nella prossima lezione."
7. `<LlmExercise variant="review">` (aggiunto nel Task B5).

Il contenuto testuale esatto è creativo e viene prodotto in questo step: non è template. Tenere sotto controllo il conto em dash (grep finale) e i pattern AI italiani (voice-guide).

- [ ] **Step 3: Build smoke della bozza (prima di chiamare `analyze-lesson`)**

Run: `npm run build`

Expected: build pulita. Se Starlight si lamenta di frontmatter non valido, leggere il messaggio: lo schema `livello` accetta solo tre valori e `prerequisiti` è `string[]`. Fixare e ribuildar.

### Task B3: Generare domande del lettore con `/analyze-lesson`

**Files:**
- Crea: `analysis/ask-well.questions.md` (output della skill)

- [ ] **Step 1: Eseguire `/analyze-lesson`**

Skill: `/analyze-lesson src/content/docs/it/everyday-use/ask-well.mdx`

L'output è una lista di domande che un lettore `principiante` potrebbe farsi. Il file viene creato in `analysis/<slug>.questions.md`.

- [ ] **Step 2: Curare le domande**

Aprire `analysis/ask-well.questions.md` e:
- Scartare le domande che non convincono (es. troppo meta, o già coperte nel paragrafo immediato).
- Aggiungere le proprie domande emerse rileggendo la bozza.
- Raggruppare le domande "gemelle" in una sola.

Il file curato resta committato: è traccia del ciclo di revisione e utile per eventuali re-run.

### Task B4: Integrare le domande con `/integrate-questions`

- [ ] **Step 1: Eseguire `/integrate-questions`**

Skill: `/integrate-questions src/content/docs/it/everyday-use/ask-well.mdx`

La skill propone un diff per integrare le risposte come inline, callout, esempi, o FAQ. Rivedere il diff e confermare.

- [ ] **Step 2: Verificare il risultato**

Run: `npm run build`

Expected: build pulita. Leggere la pagina in dev server (`npm run dev`) per verificare che le integrazioni non abbiano rotto l'andamento.

### Task B5: Creare l'esercizio di review

**Files:**
- Crea: `public/skills/it/review-ask-well.txt`

- [ ] **Step 1: Scrivere il prompt di review**

File plain text (niente markdown). Deve far fare al lettore un check-in dell'apprendimento: quattro domande progressive, una alla volta, che lo portano a verificare se ha capito le quattro leve.

Struttura suggerita (da scrivere come plain text):

- Ciao: proponiamo di fissare insieme quello che hai letto sulla pagina "Chiedere bene" del manuale AI-Guide. Ti farò quattro domande brevi, una alla volta. Aspetta la mia domanda prima di rispondere. A ogni tua risposta ti darò un feedback onesto (ti dico se una parte è imprecisa) e passiamo alla prossima.
- Domanda 1: quali sono le quattro leve che rendono una richiesta chiara?
- Domanda 2: dai un esempio di una richiesta vaga e riscrivila applicando almeno due delle quattro leve.
- Domanda 3: in che situazione sarebbe meglio fare una ricerca su Google invece di chiedere all'IA?
- Domanda 4: prova a immaginare un tuo problema concreto e scrivi la richiesta che faresti applicando le quattro leve. Ti aiuto a migliorarla insieme.
- Alla fine del giro: ringrazia, e se la persona vuole approfondire un punto che hai identificato come debole, offri un mini approfondimento (max 80 parole).

Il file è copiato come è nel clipboard dal componente `<LlmExercise>`: il tono deve essere quello che parla direttamente all'IA del lettore. Confrontarsi con `public/skills/it/review-what-is-a-prompt.txt` come riferimento di stile.

- [ ] **Step 2: Aggiungere `<LlmExercise variant="review">` all'MDX**

In `ask-well.mdx`, prima della card "Prossima lezione" (che viene generata automaticamente da Starlight Pagination):

```mdx
<LlmExercise
  variant="review"
  title="Fissa le idee con quattro domande"
  file="review-ask-well.txt"
  duration="5-7 min"
  description="Incolla il testo nella tua IA: ti farà quattro domande progressive per vedere cosa resta."
/>
```

### Task B6: QA con agent `style-checker`

- [ ] **Step 1: Lanciare l'agent**

Agent: `style-checker` sulla pagina `src/content/docs/it/everyday-use/ask-well.mdx`.

Expected: l'agent produce una lista di segnalazioni (em dash, pattern AI italiani, frasi hype, strutture burocratiche). L'agent non modifica i file, solo segnala.

- [ ] **Step 2: Applicare i fix**

Rivedere ogni segnalazione e applicarla. Se l'agent segnala qualcosa di legittimo nel contesto (raro), documentare la scelta in un breve commento di commit.

- [ ] **Step 3: Ri-lanciare `style-checker` se i fix sono sostanziali**

Se i fix hanno toccato più di 2-3 paragrafi, rilanciare per sicurezza. Se i fix sono minimi, skip.

### Task B7: Pubblicazione

- [ ] **Step 1: Aggiornare lo stato in CONTENT.md**

Nella voce della lezione 1, cambiare `✍️` → `✅`:

```
1. ✅ **Chiedere bene** (`everyday-use/ask-well`, `principiante`)
```

Aggiornare anche "Stato attuale" in fondo al Modulo 2: da `0 su 8 pubblicate` a `1 su 8 pubblicate`.

Aggiornare la sezione "Prossima sessione": prossima bozza → lezione 2 (`iterate-the-conversation`).

- [ ] **Step 2: Build finale**

Run: `npm run build`

Expected: build pulita, pagina `/it/everyday-use/ask-well/` generata.

- [ ] **Step 3: Smoke test in dev server**

Run: `npm run dev`

Aprire `http://localhost:4321/it/everyday-use/ask-well/` e verificare:
- Titolo, tempo di lettura, frontmatter OK
- `<ChatDemo>` parte in viewport
- `<PromptBuilder>` genera un prompt nel clipboard
- Callout IA vs Google si legge bene
- `<LlmExercise variant="review">` copia il prompt dal `.txt`
- La sidebar mostra `Uso quotidiano` aperto con la lezione evidenziata
- La card "Prossima lezione" in fondo è vuota (non c'è ancora lezione 2) o punta correttamente alla prossima quando sarà pubblicata.

- [ ] **Step 4: Commit della Fase B**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/ask-well.mdx public/skills/it/review-ask-well.txt analysis/ask-well.questions.md
git commit -m "Module 2 lesson 1: Chiedere bene (ask-well) + review exercise"
```

---

## Phase C — Lezione 2: Iterare la conversazione (`iterate-the-conversation`)

**Slug**: `iterate-the-conversation` · **Livello**: `principiante` · **Prerequisiti**: `what-is-a-prompt`

### Brief di lezione

Seconda lezione delle meta-skill. Smonta il mito del "prompt magico" e introduce l'idea che la conversazione è il vero strumento. Assorbe il caso "Pianificare un weekend" come esempio portante che attraversa la lezione.

- Apertura (100-150 parole): "hai scritto il prompt migliore del mondo, la risposta non ti basta, e ora?" Il pattern non è riscrivere da zero, è continuare.
- **Il ciclo dell'iterazione** (300-400 parole): prima richiesta → leggi → chiedi aggiustamenti → raffina. Tre tipi di richieste di follow-up: *aggiungere un vincolo*, *chiedere un taglio diverso*, *approfondire un pezzo*.
- **L'esempio portante: pianificare un weekend** (400-500 parole): un `<ChatDemo>` o tre `<ChatDemo>` consecutivi mostrano l'evoluzione. Prima richiesta ("weekend di due giorni a Firenze"), poi aggiunta vincoli (budget 200€ a testa, niente auto, viaggiamo in treno), poi dettagli (orari apertura musei, quanto camminare). Fil rouge della lezione.
- **Errori comuni**: ripartire da zero invece di continuare la chat, dare troppo in una richiesta sola, dimenticare che la chat ha memoria (richiamo a *Come fa l'IA a "capire"?*).
- Transizione: "ora che sai chiedere bene e iterare, entriamo nei casi d'uso che userai di più".
- `<LlmExercise variant="review">`.
- Lunghezza: 900-1200 parole.

### Task C1-C7: Workflow standard

Seguire esattamente i 7 passi del workflow di lezione, con i path specifici di questa lezione. Ripeto la sequenza per completezza (non è duplicazione ridondante: ogni path è diverso).

- [ ] **Step C1: Aggiornare CONTENT.md voce lezione 2 da `⏳` a `✍️`**
- [ ] **Step C2: Scrivere la bozza** in `src/content/docs/it/everyday-use/iterate-the-conversation.mdx` (frontmatter con `livello: principiante` e `prerequisiti: [what-is-a-prompt]`). Import `ChatDemo` e `LlmExercise`. Voice-guide.
- [ ] **Step C3: `/analyze-lesson src/content/docs/it/everyday-use/iterate-the-conversation.mdx`**, curare `analysis/iterate-the-conversation.questions.md`.
- [ ] **Step C4: `/integrate-questions src/content/docs/it/everyday-use/iterate-the-conversation.mdx`**.
- [ ] **Step C5: Scrivere `public/skills/it/review-iterate-the-conversation.txt`** (quattro domande progressive sull'iterazione; esempio atteso: domanda 3 "dammi un esempio dei tre tipi di follow-up: aggiungere vincolo, cambiare taglio, approfondire"). Aggiungere `<LlmExercise variant="review">` in fondo all'MDX.
- [ ] **Step C6: Agent `style-checker`** sulla pagina, applicare i fix.
- [ ] **Step C7: CONTENT.md `✍️` → `✅` (e `Stato attuale: 2 su 8`). `npm run build`. `npm run dev` smoke. Commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/iterate-the-conversation.mdx public/skills/it/review-iterate-the-conversation.txt analysis/iterate-the-conversation.questions.md
git commit -m "Module 2 lesson 2: Iterare la conversazione (iterate-the-conversation) + review exercise"
```

---

## Phase D — Lezione 3: Capire una cosa complicata (`understand-something-complex`)

**Slug**: `understand-something-complex` · **Livello**: `principiante` · **Prerequisiti**: `what-is-a-prompt`

### Brief di lezione

Prima lezione "use case". Alto valore immediato per il pubblico italiano non tecnico: contratti, bollette, referti medici, regolamenti.

- Apertura (100-150 parole): il burocratese come muro. L'IA è brava a demolirlo.
- **Tre tecniche principali** (500-600 parole):
  1. **Spiegamelo come se avessi 10 anni**: riscrittura del testo complicato in parole semplici.
  2. **Estrai solo quello che mi interessa**: "quanto pago al mese?", "quali sono le scadenze?", "cosa succede se voglio disdire?". L'IA estrae le informazioni dal documento invece di spiegarlo tutto.
  3. **Dimmi cosa devo guardare**: chiedere all'IA di segnalare clausole a rischio, ambiguità, penali nascoste. Utile prima di firmare.
- **Un esempio concreto** (ChatDemo): bolletta luce con importo, voci in bolletta, tecnicismi. L'IA che spiega.
- **Cosa verificare sempre**: i numeri. Richiamo a *Quando fidarsi e quando no*. Inserire un `:::caution` con la regola "incolla, chiedi, verifica i numeri".
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task D1-D7: Workflow standard

- [ ] **Step D1: CONTENT.md lezione 3 `⏳` → `✍️`.**
- [ ] **Step D2: Scrivere `src/content/docs/it/everyday-use/understand-something-complex.mdx`**. Frontmatter: `livello: principiante`, `prerequisiti: [what-is-a-prompt]`. Import `ChatDemo` e `LlmExercise`. La lezione può cross-linkare *Quando fidarsi e quando no* senza doverla dichiarare prerequisito (richiamo, non dipendenza).
- [ ] **Step D3: `/analyze-lesson src/content/docs/it/everyday-use/understand-something-complex.mdx`**, curare.
- [ ] **Step D4: `/integrate-questions src/content/docs/it/everyday-use/understand-something-complex.mdx`**.
- [ ] **Step D5: Scrivere `public/skills/it/review-understand-something-complex.txt`** (4 domande: tre tecniche, quali cose verificare sempre, come chiederesti l'estrazione di una scadenza). Aggiungere `<LlmExercise variant="review">` all'MDX.
- [ ] **Step D6: `style-checker`, applicare fix.**
- [ ] **Step D7: CONTENT.md `✍️` → `✅` (Stato: 3 su 8). Build, dev smoke, commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/understand-something-complex.mdx public/skills/it/review-understand-something-complex.txt analysis/understand-something-complex.questions.md
git commit -m "Module 2 lesson 3: Capire una cosa complicata (understand-something-complex) + review exercise"
```

---

## Phase E — Lezione 4: Riassumere un documento lungo (`summarize-a-long-document`)

**Slug**: `summarize-a-long-document` · **Livello**: `principiante` · **Prerequisiti**: `what-is-a-prompt`

### Brief di lezione

Secondo "use case" ad alto ritorno: riassumere PDF, articoli, libri.

- Apertura (100-150 parole): il tempo non basta. Un riassunto fatto bene è il 90% del valore per un decimo dello sforzo. Se fatto male, ti fa pensare di sapere cose che non sai.
- **Come chiedere un riassunto affidabile** (400-500 parole):
  - **Specifica lunghezza**: "riassumi in 5 bullet" vs "in un paragrafo di 100 parole" vs "in 3 righe".
  - **Specifica il pubblico**: riassunto tecnico (per un esperto), riassunto divulgativo (per chi non sa nulla), riassunto decisionale ("dimmi solo le 3 cose che contano per decidere").
  - **Chiedi le citazioni**: "quando dici X, riporta la frase esatta dal testo". Riduce le hallucination.
- **Cosa NON fare** (150-200 parole): non chiedere un riassunto per evitare di leggere. Se il testo conta davvero (contratto, sentenza), il riassunto ti orienta, non ti esonera.
- **Verifica incrociata**: dopo il riassunto, fai domande specifiche sul testo per vedere se l'IA ne capisce davvero il senso. Richiamo a *Quando fidarsi e quando no*.
- `<LlmExercise variant="review">`.
- Lunghezza: 900-1100 parole.

### Task E1-E7: Workflow standard

- [ ] **Step E1: CONTENT.md lezione 4 `⏳` → `✍️`.**
- [ ] **Step E2: Scrivere `src/content/docs/it/everyday-use/summarize-a-long-document.mdx`**. Frontmatter `livello: principiante`, `prerequisiti: [what-is-a-prompt]`. La lezione richiama *Quando fidarsi e quando no* come cross-link, non come prerequisito formale.
- [ ] **Step E3: `/analyze-lesson`, curare `analysis/summarize-a-long-document.questions.md`.**
- [ ] **Step E4: `/integrate-questions`.**
- [ ] **Step E5: `public/skills/it/review-summarize-a-long-document.txt`** (4 domande: come specifichi lunghezza e pubblico, perché chiedere le citazioni, come verifichi, quando NON delegare). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step E6: `style-checker`, fix.**
- [ ] **Step E7: CONTENT.md `✅` (4 su 8). Build, dev smoke, commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/summarize-a-long-document.mdx public/skills/it/review-summarize-a-long-document.txt analysis/summarize-a-long-document.questions.md
git commit -m "Module 2 lesson 4: Riassumere un documento lungo (summarize-a-long-document) + review exercise"
```

---

## Phase F — Lezione 5: Imparare un argomento nuovo (`learn-something-new`)

**Slug**: `learn-something-new` · **Livello**: `intermedio` · **Prerequisiti**: `what-is-a-prompt`, `when-to-trust-it`

### Brief di lezione

Prima lezione `intermedio`. Il lettore deve già aver interiorizzato che l'IA può sbagliare (prerequisito `when-to-trust-it` esplicito).

- Apertura (100-150 parole): l'IA come tutor che non si stanca. Ma un tutor bravo ti fa lavorare, non ti fa solo ascoltare.
- **La tecnica Feynman con l'IA** (300-400 parole): chiedi spiegazione → prova a rispiegare tu → fai correggere le tue imprecisioni. Esempio concreto con un concetto di fisica o di economia.
- **Calibrare il livello** (200-300 parole): "spiegalo come a un liceale" vs "come a uno studente di ingegneria" vs "come a un esperto che conosce già il campo adiacente". Se la spiegazione è troppo facile, sali di livello; se è troppo astratta, scendi.
- **Interrogazioni simulate** (200-300 parole): "fammi 5 domande per vedere se ho capito, poi correggimi". Utile per esami, lavoro, lettura attiva.
- **Limiti e verifiche** (200 parole): la spiegazione può essere sbagliata. L'IA inventa riferimenti. Controlla fonti, chiedi pagine e titoli precisi, e sii scettico soprattutto sui numeri e le date. Richiamo a *Quando fidarsi e quando no* + tip pratico sulle citazioni inventate.
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task F1-F7: Workflow standard

- [ ] **Step F1: CONTENT.md lezione 5 `⏳` → `✍️`.**
- [ ] **Step F2: Scrivere `src/content/docs/it/everyday-use/learn-something-new.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [what-is-a-prompt, when-to-trust-it]`.
- [ ] **Step F3: `/analyze-lesson`**. Simula un lettore `intermedio` (più critico sulla qualità della spiegazione): aspettarsi domande sul "quando fidarsi di una spiegazione che sembra perfetta".
- [ ] **Step F4: `/integrate-questions`.**
- [ ] **Step F5: `public/skills/it/review-learn-something-new.txt`** (4 domande: Feynman inversa, calibrare il livello, interrogazioni, come riconosci una spiegazione sospetta).
- [ ] **Step F6: `style-checker`, fix.**
- [ ] **Step F7: CONTENT.md `✅` (5 su 8). Build, dev smoke, commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/learn-something-new.mdx public/skills/it/review-learn-something-new.txt analysis/learn-something-new.questions.md
git commit -m "Module 2 lesson 5: Imparare un argomento nuovo (learn-something-new) + review exercise"
```

---

## Phase G — Lezione 6: Scrivere meglio (`write-better`)

**Slug**: `write-better` · **Livello**: `intermedio` · **Prerequisiti**: `what-is-a-prompt`, `when-to-trust-it`

### Brief di lezione

Lezione `intermedio` di judgment. Il taglio è "aiutami a scrivere meglio", non "scrivi per me". La distinzione è il cuore didattico.

- Apertura (100-150 parole): la differenza tra "scrivi la mia email" e "aiutami a scrivere la mia email". La prima spegne la tua voce. La seconda la affina.
- **Tre pattern che funzionano** (500-600 parole):
  1. **Bozza mia, critica dell'IA**: scrivi tu (anche male), chiedi "cosa non funziona?", "dove sono ambiguo?", poi riscrivi tenendo ciò che è tuo.
  2. **Più versioni, scegli la tua**: chiedi "tre versioni, una più diretta, una più diplomatica, una più formale". Vedi quale si avvicina alla tua voce e parti da lì.
  3. **Temperatura emotiva**: "è troppo freddo?", "sembra arrabbiato anche se non voglio sembrarlo?". Particolarmente utile in email delicate (rimborso, negoziazione, no).
- **La trappola della voce media** (200-300 parole): se non rileggi, la voce dell'IA (generica, levigata) diventa la tua. Esempio prima/dopo: un'email autentica vs un'email "AI polish".
- **Quando sì, quando no** (150-200 parole): email brevi di lavoro sì; messaggio personale a un amico no; testi dove esprimi una posizione tua (recensioni, lettere aperte) con cautela.
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task G1-G7: Workflow standard

- [ ] **Step G1: CONTENT.md lezione 6 `⏳` → `✍️`.**
- [ ] **Step G2: Scrivere `src/content/docs/it/everyday-use/write-better.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [what-is-a-prompt, when-to-trust-it]`.
- [ ] **Step G3: `/analyze-lesson`, curare.**
- [ ] **Step G4: `/integrate-questions`.**
- [ ] **Step G5: `public/skills/it/review-write-better.txt`** (4 domande: i tre pattern, trappola della voce media, quando sì quando no, una mini-pratica "ho un'email difficile, come uso l'IA senza perdere la voce").
- [ ] **Step G6: `style-checker`, fix.**
- [ ] **Step G7: CONTENT.md `✅` (6 su 8). Build, dev smoke, commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/write-better.mdx public/skills/it/review-write-better.txt analysis/write-better.questions.md
git commit -m "Module 2 lesson 6: Scrivere meglio (write-better) + review exercise"
```

---

## Phase H — Lezione 7: Foto, immagini e file (`images-and-files`)

**Slug**: `images-and-files` · **Livello**: `intermedio` · **Prerequisiti**: `what-is-a-prompt`

### Brief di lezione

Multimodalità. Di tutte le lezioni del modulo è la più "tecnica" (`intermedio` per questo). Prerequisito aggiunto `privacy-basics` perché i file caricati sono un caso di privacy delle conversazioni.

- Apertura (100-150 parole): le IA moderne vedono. Una foto di una bolletta, uno screenshot di un errore, un PDF di 40 pagine: si possono caricare.
- **Tre casi d'uso canonici** (400-500 parole):
  1. **Foto di un documento fisico**: bolletta cartacea, ricetta medica, istruzioni di un elettrodomestico. L'IA legge il testo, il diagramma, la tabella.
  2. **Screenshot**: messaggio di errore di un software, pagina web confusa, grafico di un articolo. L'IA interpreta.
  3. **PDF, presentazioni, excel**: documento lungo. L'IA risponde a domande specifiche sul contenuto.
- **Come funziona su ChatGPT, Claude, Gemini** (200-300 parole): piattaforme diverse, feature diverse. Tabella di confronto minima (che tipo di file accetta ciascuna, dimensione massima, formati supportati). Per i dettagli esatti linkare alle pagine ufficiali (non elencarle nel testo se cambiano spesso).
- **Cosa va bene, cosa va male** (200-300 parole): leggibilità delle foto (luce, messa a fuoco), qualità degli screenshot, limiti dei PDF molto lunghi (può perdere pezzi in mezzo). Richiamo a *Riassumere un documento lungo* per le tecniche di verifica.
- **Privacy** (150-200 parole): caricare una foto con dati sensibili di altri = condividere dati con l'IA. Richiamo a *Quello che condividi quando usi l'IA* (privacy-basics). Tip pratico: anonimizzare/cancellare prima di caricare.
- `<LlmExercise variant="review">`.
- Lunghezza: 1100-1300 parole.

### Task H1-H7: Workflow standard

- [ ] **Step H1: CONTENT.md lezione 7 `⏳` → `✍️`.**
- [ ] **Step H2: Scrivere `src/content/docs/it/everyday-use/images-and-files.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [what-is-a-prompt]`. La sezione "Privacy" della lezione cross-linka *Quello che condividi quando usi l'IA*, non la dichiara prerequisito.
- [ ] **Step H3: `/analyze-lesson`, curare. Il lettore `intermedio` probabilmente chiederà "ma la mia foto finisce nell'allenamento?". Prepararsi.**
- [ ] **Step H4: `/integrate-questions`.**
- [ ] **Step H5: `public/skills/it/review-images-and-files.txt`** (4 domande: tre casi d'uso, come confronto le piattaforme, cosa va male con una foto, cosa verifico in un PDF lungo; privacy come trasversale).
- [ ] **Step H6: `style-checker`, fix.**
- [ ] **Step H7: CONTENT.md `✅` (7 su 8). Build, dev smoke, commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/images-and-files.mdx public/skills/it/review-images-and-files.txt analysis/images-and-files.questions.md
git commit -m "Module 2 lesson 7: Foto, immagini e file (images-and-files) + review exercise"
```

---

## Phase I — Lezione 8: Cose da NON fare (`what-not-to-do`)

**Slug**: `what-not-to-do` · **Livello**: `principiante` · **Prerequisiti**: `what-is-a-prompt`

### Brief di lezione

Chiusura del modulo. Consapevolezza dei limiti. Pubblico `principiante` perché il lettore più vulnerabile è chi ha appena iniziato a usare l'IA e la usa per decisioni importanti.

- Apertura (100-150 parole): dopo aver visto tutte le cose utili che l'IA sa fare, le cose che non dovresti mai delegarle. Non per paura, per consapevolezza.
- **Cinque "no" espliciti** (500-600 parole):
  1. **Consigli medici presi come vangelo**: l'IA può aiutarti a capire un referto, non a decidere una cura.
  2. **Consigli finanziari o di investimento**: l'IA non sa cosa succede domani, e può sbagliare numeri banali.
  3. **Consigli legali senza verifica**: la legge è contesto-specifica, varia per paese e per caso. L'IA dà una mappa, non una sentenza.
  4. **Decisioni importanti delegate**: scelte di carriera, relazionali, educative. L'IA può farti pensare meglio, non pensare al posto tuo.
  5. **Dati sensibili tuoi e di altri**: richiamo a *Quello che condividi*. Non caricare documenti con dati di altri senza il loro consenso.
- **Un sesto "attenzione"**: i bias dei modelli. L'IA riflette i dati di training. Su argomenti sensibili (genere, razza, politica, cultura) può riprodurre stereotipi. Non è malafede, è statistica dei testi passati.
- **Mental model di chiusura** (150-200 parole): "aiuto per pensare, non sostituto del pensare". L'IA è un assistente brillante ma che non ha il tuo contesto di vita, i tuoi valori, la responsabilità delle tue scelte.
- **Ponte verso il Modulo 3** (80-120 parole): nel prossimo modulo l'IA entra sul lavoro, dove la posta in gioco sale. Alcune di queste cautele si amplificano.
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task I1-I7: Workflow standard

- [ ] **Step I1: CONTENT.md lezione 8 `⏳` → `✍️`.**
- [ ] **Step I2: Scrivere `src/content/docs/it/everyday-use/what-not-to-do.mdx`**. Frontmatter `livello: principiante`, `prerequisiti: [what-is-a-prompt]`. Usare `:::danger` o `:::caution` per i "no" più gravi (medici, finanziari, legali) per coerenza con gli aside del progetto. La lezione cross-linka *Quando fidarsi e quando no* e *Quello che condividi quando usi l'IA* come richiami nei passaggi rilevanti, senza dichiararli prerequisiti formali.
- [ ] **Step I3: `/analyze-lesson`**. Il lettore `principiante` può chiedere "ma se l'IA mi dà un consiglio medico giusto 9 volte su 10?". Preparare risposta.
- [ ] **Step I4: `/integrate-questions`.**
- [ ] **Step I5: `public/skills/it/review-what-not-to-do.txt`** (4 domande: i cinque "no", cosa significa "aiuto per pensare", un esempio reale di decisione che NON delegheresti, come tratteresti un consiglio medico dell'IA).
- [ ] **Step I6: `style-checker`, fix.**
- [ ] **Step I7: CONTENT.md `✅` (8 su 8, **Modulo 2 completo al 100%**). Aggiornare "Stato attuale" del Modulo 2 e la sezione "Prossima sessione" (prossima bozza → nessuna per Modulo 2; aprire Modulo 3 oppure traduzione EN). Build, dev smoke, commit:**

```bash
git add CONTENT.md src/content/docs/it/everyday-use/what-not-to-do.mdx public/skills/it/review-what-not-to-do.txt analysis/what-not-to-do.questions.md
git commit -m "Module 2 lesson 8: Cose da NON fare (what-not-to-do) + review exercise, IT module complete"
```

---

## Phase J — Module completion (attivazione card)

Una tantum al termine della Fase I. Attiva le card della homepage IT e della pagina start-here IT che finora puntavano a `comingSoon: true`. La start-here EN resta non-toccata (la sua card dipende dalla traduzione EN del modulo, fuori scope).

### Task J1: Attivare la card "Uso quotidiano" in homepage IT

**Files:**
- Modifica: `src/content/docs/it/index.mdx`

- [ ] **Step 1: Togliere `comingSoon: true` e aggiungere `href`**

In `src/content/docs/it/index.mdx`, trovare la card `'Uso quotidiano'` e cambiare:

```mdx
{
  icon: 'pencil',
  title: 'Uso quotidiano',
  description: 'Scrivere meglio, riassumere documenti, organizzare informazioni, imparare cose nuove.',
  comingSoon: true,
},
```

in:

```mdx
{
  icon: 'pencil',
  title: 'Uso quotidiano',
  description: 'Scrivere meglio, riassumere documenti, organizzare informazioni, imparare cose nuove.',
  href: '/it/everyday-use/ask-well/',
},
```

### Task J2: Attivare la card in start-here IT

**Files:**
- Modifica: `src/content/docs/it/start-here.mdx`

- [ ] **Step 1: Togliere `comingSoon: true` e aggiungere `href`**

Trovare la card `'Uso già ChatGPT, Claude o Gemini'` e sostituire `comingSoon: true` con `href: '/it/everyday-use/ask-well/'`.

### Task J3: Build finale + commit Fase J

- [ ] **Step 1: Build**

Run: `npm run build`

Expected: build pulita, tutti i link risolvono.

- [ ] **Step 2: Dev server smoke test**

Run: `npm run dev`

Verificare:
- Homepage IT: card "Uso quotidiano" cliccabile, porta a `/it/everyday-use/ask-well/`.
- Start-here IT: card "Uso già ChatGPT" cliccabile, stessa destinazione.
- Sidebar IT: "Uso quotidiano" è una sezione espansa con le 8 lezioni elencate.
- Start-here EN: la card "I already use ChatGPT…" resta con `comingSoon: true` (corretto, fino alla traduzione).

- [ ] **Step 3: Commit della Fase J**

```bash
git add src/content/docs/it/index.mdx src/content/docs/it/start-here.mdx
git commit -m "Activate Module 2 cards on homepage and start-here (IT)"
```

---

## Decisioni aperte (non bloccanti)

- **Traduzione EN del modulo**: rimandata a un piano separato. Verrà aperta quando il modulo IT è completo e stabile (per evitare di tradurre contenuti che potrebbero cambiare in `/integrate-questions` / `style-checker`).
- **Tooltip `<Def>` inline**: invocare `/add-defs` solo se emergono termini tecnici non già definiti nel paragrafo immediato. Probabilmente non necessario in questo modulo: il lessico tecnico è stato definito nel Modulo 1 Fondamenti.
- **Ordine di scrittura**: pedagogico = scrittura. Non cambiare senza motivo (scrivere "fuori ordine" rende più difficile calibrare i rimandi tra lezioni).
- **Eventuale accorpamento in corso d'opera**: se durante la scrittura un assorbimento (IA vs Google in lezione 1, Pianificare in lezione 2) non regge, promuovere la voce a lezione autonoma. Aggiornare spec (`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`) e `CONTENT.md` nello stesso commit.
