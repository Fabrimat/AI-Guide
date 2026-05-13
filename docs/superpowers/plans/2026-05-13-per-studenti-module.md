# Modulo 4 "Per studenti" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare live il Modulo 4 di AI-Guide ("Per studenti") nella struttura definita in `docs/superpowers/specs/2026-05-13-per-studenti-module-design.md`: 8 lezioni IT + 8 mirror EN, infrastruttura (sidebar riordinata, directory, card homepage e start-here IT+EN), aggiornamento di `CONTENT.md`, traduzione EN in parallelo con l'IT (pattern consolidato dopo Modulo 2 e 3).

**Architecture:** Un modulo di contenuto (Astro + Starlight + MDX), non un refactor di codice. Una Fase A di scaffolding (una tantum: `CONTENT.md` + directory + riordino degli 8 placeholder esistenti in sidebar per allinearli all'ordine pedagogico), otto Fasi B-I di scrittura lezione (una per lezione, IT e EN in pari passo), una Fase J di chiusura modulo (attivazione card homepage e start-here, IT e EN). Ogni lezione segue il workflow standard di AI-Guide: draft IT → `/analyze-lesson` → cura domande → `/integrate-questions` → esercizio di review in `public/skills/it/` → agent `style-checker` → commit IT → traduzione EN mirror → esercizio di review EN → `style-checker` EN → commit EN → sblocco placeholder in sidebar → aggiornamento `CONTENT.md` a ✅.

**Tech Stack:** Astro 6 + Starlight 0.38, MDX, TypeScript (per `astro.config.mjs` e `src/content.config.ts`). Nessuna nuova dipendenza.

---

## File Structure

**Scaffolding del modulo (Fase A)**
- Modifica `CONTENT.md` (root) — sostituire elenco provvisorio di 8 voci 🆕 del Modulo 4 con la struttura validata; allineare la sezione "Prossima sessione".
- Crea `src/content/docs/it/for-students/.gitkeep` — placeholder per la directory IT.
- Crea `src/content/docs/en/for-students/.gitkeep` — placeholder per la directory EN.
- Modifica `astro.config.mjs` (righe ~125-186, blocco `label: 'For students'`) — riordinare gli 8 placeholder esistenti nella sequenza pedagogica dello spec (l'ordine attuale ha *Revise before an exam* in posizione 2, *Notes from lectures* in 4, *Sources and citations* in 6, *Translate and compare texts* in 5: tutti da spostare).

**Lezioni IT + EN (Fasi B-I, una per lezione)**
- Crea `src/content/docs/it/for-students/study-a-new-topic.mdx` + `src/content/docs/en/for-students/study-a-new-topic.mdx` (Fase B)
- Crea `src/content/docs/it/for-students/notes-from-lectures.mdx` + mirror EN (Fase C)
- Crea `src/content/docs/it/for-students/revise-before-an-exam.mdx` + mirror EN (Fase D)
- Crea `src/content/docs/it/for-students/write-a-thesis.mdx` + mirror EN (Fase E)
- Crea `src/content/docs/it/for-students/sources-and-citations.mdx` + mirror EN (Fase F)
- Crea `src/content/docs/it/for-students/translate-and-compare.mdx` + mirror EN (Fase G)
- Crea `src/content/docs/it/for-students/when-ai-tricks-you.mdx` + mirror EN (Fase H)
- Crea `src/content/docs/it/for-students/ethics-of-studying.mdx` + mirror EN (Fase I)

**Esercizi di review (una coppia IT/EN per lezione, in fase con la lezione)**
- Crea `public/skills/it/review-<slug>.txt` + `public/skills/en/review-<slug>.txt` per ognuna delle 8 lezioni.

**File di analisi intermedi (uno per lezione, committati come traccia)**
- Crea `analysis/<slug>.questions.md` per ognuna delle 8 lezioni.

**Sblocco placeholder in sidebar (un commit dedicato per lezione)**
- Modifica `astro.config.mjs` — sostituire la voce placeholder disabilitata della lezione con `{ slug: 'for-students/<slug>' }`. Pattern già stabilito con i commit `Unlock Module N lesson M in sidebar`.

**Attivazione card homepage e start-here (Fase J)**
- Modifica `src/content/docs/it/index.mdx` (riga ~46, card *Per studenti*) — togliere `comingSoon: true`, aggiungere `href: '/it/for-students/study-a-new-topic/'`.
- Modifica `src/content/docs/en/index.mdx` (riga ~46, card *For students*) — togliere `comingSoon: true`, aggiungere `href: '/en/for-students/study-a-new-topic/'`.
- Modifica `src/content/docs/it/start-here.mdx` (riga ~38, card *Sono uno studente*) — stesso pattern.
- Modifica `src/content/docs/en/start-here.mdx` (card equivalente *I'm a student* o simile) — stesso pattern.

Ogni fase B-I termina con tre commit (IT, EN, sblocco sidebar + aggiornamento `CONTENT.md`) e un `npm run build` di verifica intermedia. La Fase A e la Fase J hanno un singolo commit ciascuna.

---

## Per-lesson workflow (riferimento)

Ogni lezione (Fasi B-I) segue la stessa sequenza a 13 passi, esplicitata fase per fase con i path specifici della lezione. Non è un template riutilizzabile a livello di tooling: è la sequenza da eseguire a mano per ciascuna lezione. Riproduce `CONTENT.md` > "Workflow per scrivere una lezione" estendendolo con i passi EN e sblocco sidebar.

1. **`CONTENT.md` → `✍️`**: stato della lezione da `🆕` a `✍️` (prima dei passi successivi, assorbito dal commit IT).
2. **Bozza IT**: scrivere `src/content/docs/it/for-students/<slug>.mdx` rispettando la `voice-guide` (em dash vietati, lessico AI italiano vietato; vedi `.claude/skills/voice-guide/SKILL.md`).
3. **Genera domande del lettore**: `/analyze-lesson src/content/docs/it/for-students/<slug>.mdx` produce `analysis/<slug>.questions.md`. Rileggere le domande, scartare quelle già coperte, aggiungere le proprie.
4. **Integra le domande**: `/integrate-questions src/content/docs/it/for-students/<slug>.mdx` aggiorna l'MDX con risposte inline, callout, esempi o FAQ, dopo conferma del diff.
5. **Esercizio di review IT**: scrivere `public/skills/it/review-<slug>.txt` (plain text, niente markdown) e aggiungere `<LlmExercise variant="review">` nell'MDX prima della card "Prossima lezione".
6. **QA IT con `style-checker`**: invocare l'agent sulla lezione. Applicare i fix.
7. **Commit IT**: `git add` dei file IT + analysis + review-IT, commit con messaggio `Module 4 lesson N: <titolo IT> + review exercise`.
8. **Traduzione EN mirror**: scrivere `src/content/docs/en/for-students/<slug>.mdx`. Frontmatter con `title` e `description` in inglese; `livello` e `prerequisiti` restano in italiano (sono code identifier — vedi `src/content.config.ts`). Corpo tradotto fedelmente, con adattamenti culturali dove serve (es. politiche d'istituto IT → esempi di università EN o atenei generici). Cross-link interni aggiornati a `/en/...`.
9. **Esercizio di review EN**: scrivere `public/skills/en/review-<slug>.txt` come traduzione del corrispondente IT. `<LlmExercise variant="review">` nell'MDX EN punta allo stesso `file` del componente IT (il componente risolve il path per locale).
10. **QA EN con `style-checker`**: l'agent in inglese segnala em dash, AI buzzwords in inglese, chiusure tipo "In conclusion", calchi IT→EN (specialmente terminologia accademica: tesi/thesis vs dissertation, laurea triennale/Bachelor's, magistrale/Master's, relatore/supervisor, esame orale/oral exam). Applicare i fix.
11. **Commit EN**: `git add` dei file EN, commit con messaggio `Module 4 lesson N EN: <titolo EN> + review exercise`.
12. **Sblocco placeholder in sidebar**: modificare `astro.config.mjs` sostituendo la voce placeholder disabilitata della lezione con `{ slug: 'for-students/<slug>' }`. Commit dedicato: `Unlock Module 4 lesson N in sidebar`.
13. **`CONTENT.md` → `✅`**: aggiornare stato lezione, contatore "Stato attuale", e sezione "Prossima sessione". Build smoke, commit nello stesso del passo 12 oppure separato.

**Nota su `<Def>`**: la skill `/add-defs` è utile sui termini tecnici non già spiegati dal paragrafo immediato. Per Modulo 4 i termini candidati sono prevalentemente accademici (DOI, peer review, ISO 690, viva, NotebookLM, Whisper, OCR). Invocare `/add-defs` solo se in lettura emergono termini potenzialmente oscuri al lettore target.

**Nota su `<ChatDemo>`**: usare quando l'esempio è un dialogo prompt/risposta dove la forma del dialogo aggiunge informazione (es. orale simulato, IA come secondo lettore di un paragrafo). Se l'esempio è un pattern statico (lista di flashcard, stile bibliografico), usare code fence o tabella.

**Anti-plagio meta**: le lezioni di Modulo 4 toccano direttamente il confine etico tra studio e copiato. Curare di non dare al lettore istruzioni operative su "come far passare un testo IA-generato come tuo". Lo spec è chiaro: niente how-to anti-detection. In dubbio, omettere il dettaglio.

---

## Phase A — Module scaffolding

Una tantum. Prepara l'infrastruttura senza pubblicare nessuna lezione. Al termine di questa fase la sidebar del Modulo 4 mostra 8 placeholder riordinati nella sequenza pedagogica del modulo; la homepage IT ed EN e le pagine start-here restano invariate (le card `comingSoon: true` si attivano in Fase J, quando la prima lezione è pronta).

### Task A1: Aggiornare `CONTENT.md` con la struttura validata a 8 voci

**Files:**
- Modifica: `CONTENT.md` (sezione "Modulo 4: Per studenti", righe ~548-568; anche la sezione "Prossima sessione" a fine file va allineata)

- [ ] **Step 1: Sostituire l'elenco del Modulo 4**

Trovare la sezione `## Modulo 4: Per studenti (livello intermedio)` e sostituire il blocco delle 8 voci `🆕` con:

```markdown
## Modulo 4: Per studenti (livello `intermedio`)

Target: studenti dalle superiori all'università (più adulti in
riqualificazione), che vogliono usare l'IA come supporto allo studio
senza cadere nel "fammi i compiti". Tono pratico, attento al rischio
plagio e al confine fra studio e sostituzione. Spec di modulo:
`docs/superpowers/specs/2026-05-13-per-studenti-module-design.md`.

Struttura validata 2026-05-13. Otto lezioni, ordine pedagogico = ordine
di scrittura. Livello uniforme `intermedio`: il pubblico ci arriva
dopo Fondamenti + Uso quotidiano (o con esperienza equivalente).

1. 🆕 **Studiare un argomento nuovo** (`for-students/study-a-new-topic`)
   Studio formale contro un programma fissato. Apre il modulo col
   contratto "non è il manuale del fammi i compiti".

2. 🆕 **Appunti da lezioni e testi lunghi** (`for-students/notes-from-lectures`)
   Materiale grezzo (audio, dispense, slide) portato a forma studiabile.

3. 🆕 **Ripassare prima di un esame** (`for-students/revise-before-an-exam`)
   Interrogazioni simulate, mappe, flashcards, strategia per il docente.

4. 🆕 **Scrivere una tesi** (`for-students/write-a-thesis`)
   Outline + riempimento, l'IA come secondo lettore, calibrazione sul
   relatore. Triennale vs magistrale vs dottorato.

5. 🆕 **Fonti e citazioni** (`for-students/sources-and-citations`)
   Bibliografia accademica, stili, DOI, citazioni inventate, NotebookLM.

6. 🆕 **Tradurre e confrontare testi** (`for-students/translate-and-compare`)
   Lingue straniere, classici, varianti, glosse, registri.

7. 🆕 **Quando l'IA ti imbroglia** (`for-students/when-ai-tricks-you`)
   Errori tipici in contesto studio, tre test rapidi.

8. 🆕 **Etica dello studio** (`for-students/ethics-of-studying`)
   Chiusura. Aiuto vs copiato, dichiarazione dell'uso, politiche
   d'istituto, callout `:::caution` su esami proctored e AI detector.

**Stato attuale**: 0 su 8 pubblicate. Struttura definita, scrittura da
iniziare.
```

- [ ] **Step 2: Allineare la sezione "Prossima sessione"**

In fondo al file, sostituire la sezione `## Prossima sessione` con:

```markdown
## Prossima sessione

**Revisioni pendenti**: nessuna. Modulo Fondamenti chiuso al 100% il
2026-04-19. Modulo Uso quotidiano chiuso al 100% il 2026-04-23.
Modulo Sul lavoro chiuso al 100% il 2026-04-25.

**Modulo 4 (Per studenti)**: struttura validata 2026-05-13 in
`docs/superpowers/specs/2026-05-13-per-studenti-module-design.md`.
Piano di implementazione in
`docs/superpowers/plans/2026-05-13-per-studenti-module.md`. Prossima
bozza: lezione 1, **Studiare un argomento nuovo**
(`for-students/study-a-new-topic`).

**Sblocco placeholder in sidebar**: per ogni lezione del Modulo 4 che
atterra, sostituire la voce placeholder disabilitata in
`astro.config.mjs` con `{ slug: 'for-students/<slug>' }` in un commit
dedicato (pattern già stabilito con i commit "Unlock Module N lesson M
in sidebar").
```

- [ ] **Step 3: Verificare il diff**

Run: `git diff CONTENT.md`

Expected: le due sezioni sostituite; nessun'altra modifica ai Moduli 1, 2, 3, 5, 6 e alle sezioni "Pagine trasversali", "Traduzione", "Workflow per scrivere una lezione", "Audit moduli 3-6".

### Task A2: Creare le directory `for-students/`

**Files:**
- Crea: `src/content/docs/it/for-students/.gitkeep`
- Crea: `src/content/docs/en/for-students/.gitkeep`

- [ ] **Step 1: Creare le directory con placeholder**

```bash
mkdir -p src/content/docs/it/for-students src/content/docs/en/for-students
touch src/content/docs/it/for-students/.gitkeep
touch src/content/docs/en/for-students/.gitkeep
```

I `.gitkeep` vengono eliminati automaticamente dal commit della prima lezione in ciascuna lingua (Fase B), perché a quel punto la directory contiene già file `.mdx` reali. Non serve `git rm` esplicito.

### Task A3: Riordinare i placeholder del Modulo 4 in `astro.config.mjs`

**Files:**
- Modifica: `astro.config.mjs` (blocco `label: 'For students'`, righe ~125-186)

L'attuale ordine in sidebar non corrisponde all'ordine pedagogico dello spec. Va riordinato:

| Pos. attuale | Slug | Pos. corretta |
|---|---|---|
| 1 | study-a-new-topic | 1 |
| 2 | revise-before-an-exam | 3 |
| 3 | write-a-thesis | 4 |
| 4 | notes-from-lectures | 2 |
| 5 | translate-and-compare-texts | 6 |
| 6 | sources-and-citations | 5 |
| 7 | when-ai-tricks-you | 7 |
| 8 | ethics-of-studying | 8 |

- [ ] **Step 1: Sostituire il blocco `items` del Modulo 4**

Trovare il blocco con commento `// Modulo 4 (Per studenti)` e sostituire l'intero array `items` con:

```javascript
items: [
  {
    label: 'Study a new topic',
    translations: { it: 'Studiare un argomento nuovo' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Notes from lectures',
    translations: { it: 'Appunti da lezioni e testi lunghi' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Revise before an exam',
    translations: { it: 'Ripassare prima di un esame' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Write a thesis',
    translations: { it: 'Scrivere una tesi' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Sources and citations',
    translations: { it: 'Fonti e citazioni' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Translate and compare texts',
    translations: { it: 'Tradurre e confrontare testi' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'When AI tricks you',
    translations: { it: "Quando l'IA ti imbroglia" },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Ethics of studying',
    translations: { it: 'Etica dello studio' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
],
```

- [ ] **Step 2: Build smoke**

Run: `npm run build`

Expected: build pulita. Se Starlight si lamenta della sidebar, controllare che il blocco abbia un solo `items:` ben formattato.

### Task A4: Commit della Fase A

- [ ] **Step 1: Commit unico per lo scaffolding**

```bash
git add CONTENT.md astro.config.mjs src/content/docs/it/for-students/ src/content/docs/en/for-students/
git commit -m "Scaffold Module 4 (Per studenti): 8-lesson plan, sidebar reordered, empty dirs"
```

---

## Phase B — Lezione 1: Studiare un argomento nuovo (`study-a-new-topic`)

**Slug**: `study-a-new-topic` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `learn-something-new`, `when-to-trust-it`

### Brief di lezione

Apertura del modulo. La lezione fa due cose insieme: fissa il **contratto del modulo** (in 4-6 righe di apertura) e mostra cosa significa usare l'IA per **studio formale**, contro un programma fissato — diverso dalla curiosità personale già coperta in M2L5 (*Imparare un argomento nuovo*).

- **Apertura/contratto del modulo** (~120-150 parole). Paragrafo non chiamato "Etica", non chiamato "Avvertenza": è una distinzione operativa. Forma suggerita:

  > Questo modulo non è il manuale del "fammi i compiti". È il manuale del "studia meglio". Sono due cose diverse non perché una sia morale e l'altra no, ma perché il primo non ti fa imparare niente e si vede al primo confronto orale. L'IA è uno strumento di studio quando ti spiega, ti interroga, ti aiuta a ripassare; è un problema quando produce al posto tuo il testo che tu dovresti consegnare. Questo modulo ti dà tecniche per il primo uso; l'ultima lezione (*Etica dello studio*) torna esplicitamente sul confine.

- **Da curiosità a studio formale** (~150-200 parole). Cosa cambia rispetto a M2L5: c'è un manuale di riferimento; c'è un docente che decide cosa è "giusto"; c'è una verifica in fondo (interrogazione, scritto, paper). L'IA non sa queste tre cose. Va ancorata.

- **Tre tecniche** (400-500 parole):
  1. **Ancorare al manuale**. Incollare nel chat il paragrafo del libro (o l'estratto delle slide), poi chiedere "spiegami questo, restando dentro questa cornice". Distinguere "spiegamelo in generale" (l'IA pesca da fonti diverse, anche anglosassoni, e la definizione può shiftare leggermente dal manuale) da "spiegamelo come dice questo paragrafo, in altre parole".
  2. **Chiedere domande del programma**. "Sulla base di questo capitolo, fammi tre domande di tipo orale e tre di tipo scritto, con il livello di precisione che si aspetta un esame di [materia, livello]". Poi rispondere, e farsi correggere.
  3. **Calibrazione sul docente**. Se hai appunti delle lezioni precedenti, slide del prof, o anche solo lo stile di domanda del corso, incollalo come "stile del docente". L'IA simula meglio l'interrogazione che ti aspetta.

- **ChatDemo portante** (~150-200 parole di setup intorno). Caso: studente di diritto costituzionale + manuale di Bin/Pitruzzella + un paragrafo sui poteri del Presidente della Repubblica. Mostrare la differenza fra spiegazione "in generale" (l'IA cita Wikipedia, mescola con la Costituzione USA) e spiegazione "dentro la cornice del paragrafo".

- **Distinzione "ho capito" vs "so quello che il prof si aspetta"** (~100-150 parole). Il rischio dell'IA come tutor è che ti senti bravo perché tieni il dialogo. Il prof però non ti chiede di tenere un dialogo, ti chiede una risposta precisa che usa le parole del manuale. Check rapido a fine sessione: spiega l'argomento parlando ad alta voce, *senza* tenere il chat aperto.

- **Callout `:::caution` privacy**: se carichi PDF di dispense del prof, può essere materiale coperto da copyright didattico. Cautela su chat pubbliche (vedi *Quello che condividi quando usi l'IA*, M1L6).

- **Cosa NON fare** (~100 parole): chiedere "spiegamelo facile" e fermarsi (l'IA semplifica troppo per l'esame); usare la voce dell'IA al posto della propria sull'orale (suona innaturale).

- Transizione: "Una volta capito un argomento, serve trasformare il materiale che hai in qualcosa di studiabile. La prossima lezione parla di questo: appunti, audio di lezione, slide, e come metterli insieme."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1000-1200 parole.

### Task B1: Aggiornare stato lezione a "in lavorazione" in `CONTENT.md`

- [ ] **Step 1: Cambiare `🆕` → `✍️` nella voce della lezione 1**

Nel Modulo 4 di `CONTENT.md`, cambiare:

```
1. 🆕 **Studiare un argomento nuovo** (`for-students/study-a-new-topic`)
```

in:

```
1. ✍️ **Studiare un argomento nuovo** (`for-students/study-a-new-topic`)
```

Questo step non ha commit proprio: è assorbito dal commit finale di Task B6 (IT).

### Task B2: Bozza della lezione IT `study-a-new-topic.mdx`

**Files:**
- Crea: `src/content/docs/it/for-students/study-a-new-topic.mdx`

- [ ] **Step 1: Leggere la voice-guide**

Leggere `.claude/skills/voice-guide/SKILL.md` integralmente. Ricordare i divieti duri: zero em dash, zero lessico AI italiano, zero passivi impersonali, zero chiusure scolastiche.

- [ ] **Step 2: Scrivere la bozza**

Creare il file con frontmatter:

```yaml
---
title: Studiare un argomento nuovo
description: Studio formale su un programma fissato. L'IA come tutor che resta dentro la cornice del tuo manuale, non sparisce a divagare.
livello: intermedio
prerequisiti: [ask-well, learn-something-new, when-to-trust-it]
---
```

Import da calcolare (quattro livelli di risalita da `src/content/docs/it/for-students/study-a-new-topic.mdx`):

```mdx
import ChatDemo from '../../../../components/ChatDemo.astro';
import LlmExercise from '../../../../components/LlmExercise.astro';
import LessonSummary from '../../../../components/LessonSummary.astro';
```

Struttura del corpo secondo il brief di lezione sopra. Aggiungere un `<LessonSummary>` in apertura, subito dopo gli import, con 3-5 bullet di takeaway.

- [ ] **Step 3: Build smoke della bozza**

Run: `npm run build`

Expected: build pulita. Se Starlight si lamenta di frontmatter non valido (`livello` o `prerequisiti`), fixare e ribuildare.

### Task B3: Generare domande del lettore con `/analyze-lesson`

**Files:**
- Crea: `analysis/study-a-new-topic.questions.md`

- [ ] **Step 1: Eseguire `/analyze-lesson`**

Skill: `/analyze-lesson src/content/docs/it/for-students/study-a-new-topic.mdx`

Il lettore simulato è `intermedio`. Aspettarsi domande del tipo: "ma il mio manuale è di 700 pagine, non posso incollarlo tutto"; "e se il prof a lezione dice cose che il manuale non dice?"; "questa tecnica vale anche per matematica/programmazione dove non c'è un 'paragrafo' da incollare?"; "come faccio a sapere se ho capito o se sto solo ripetendo a pappagallo l'IA?".

- [ ] **Step 2: Curare le domande**

Aprire `analysis/study-a-new-topic.questions.md` e: scartare le domande già coperte nel paragrafo immediato; aggiungere le proprie; raggruppare le "gemelle". Il file curato resta committato come traccia.

### Task B4: Integrare le domande con `/integrate-questions`

- [ ] **Step 1: Eseguire `/integrate-questions`**

Skill: `/integrate-questions src/content/docs/it/for-students/study-a-new-topic.mdx`

La skill propone un diff. Rivederlo e confermare.

- [ ] **Step 2: Verificare il risultato**

Run: `npm run build && npm run dev`. Aprire `http://localhost:4321/it/for-students/study-a-new-topic/` e verificare che l'andamento della lezione non si sia rotto.

### Task B5: Creare l'esercizio di review IT

**Files:**
- Crea: `public/skills/it/review-study-a-new-topic.txt`

- [ ] **Step 1: Scrivere il prompt di review**

File plain text, niente markdown. Quattro domande progressive che fanno ripetere al lettore: la differenza fra studio formale e curiosità personale, le tre tecniche, il check "ho capito vs so quello che il prof si aspetta", e un'applicazione concreta. Confrontarsi con `public/skills/it/review-learn-something-new.txt` per stile (la lezione gemella in M2).

Struttura suggerita (plain text):

```
Ciao! Facciamo insieme un giro veloce su quello che hai letto sulla pagina "Studiare un argomento nuovo" del manuale AI-Guide. Ti faccio quattro domande brevi, una alla volta. Aspetta la mia domanda prima di rispondere. A ogni tua risposta ti do un feedback onesto (ti dico se una parte e' imprecisa) e passiamo alla prossima.

Domanda 1: la differenza fra "imparare un argomento per curiosita'" e "studiare per un esame" non e' di interesse, e' di metodo. Quali sono le tre cose che cambiano e che l'IA non sa per conto suo?

Domanda 2: una delle tecniche e' "ancorare al manuale". Come la metti in pratica? Cosa cambia rispetto a chiedere "spiegamelo in generale"?

Domanda 3: alla fine di una sessione di studio con l'IA puoi sentirti bravo perche' tieni il dialogo. C'e' un check rapido per capire se hai davvero imparato o se stai solo ripetendo l'ultima cosa che ti ha detto l'IA. Quale?

Domanda 4: pensa a un argomento del tuo prossimo esame (o di un esame che hai gia' fatto) e prova a impostare la richiesta che faresti all'IA per ripassarlo, usando una delle tre tecniche. Te ne suggerisco un miglioramento.

Alla fine del giro: ringrazia. Se la persona vuole approfondire un punto che hai identificato come debole, offri un mini approfondimento (max 80 parole).
```

(Apostrofi sostituiti con apici dritti per evitare problemi di encoding in plain text.)

- [ ] **Step 2: Aggiungere `<LlmExercise variant="review">` all'MDX**

In `study-a-new-topic.mdx`, prima della transizione "Prossima lezione" (Starlight Pagination la genera automaticamente):

```mdx
<LlmExercise
  variant="review"
  title="Quattro domande per fissare il metodo"
  file="review-study-a-new-topic.txt"
  duration="5-7 min"
  description="Incolla il testo nella tua IA: ti farà quattro domande progressive sul metodo, una alla volta."
/>
```

### Task B6: QA con agent `style-checker` e commit IT

- [ ] **Step 1: Lanciare l'agent**

Agent: `style-checker` sulla pagina `src/content/docs/it/for-students/study-a-new-topic.mdx`.

- [ ] **Step 2: Applicare i fix**

Rivedere ogni segnalazione e applicarla. Se l'agent segnala qualcosa di legittimo nel contesto, documentare la scelta nel commit.

- [ ] **Step 3: Commit IT**

```bash
git add CONTENT.md src/content/docs/it/for-students/study-a-new-topic.mdx public/skills/it/review-study-a-new-topic.txt analysis/study-a-new-topic.questions.md
git commit -m "Module 4 lesson 1: Studiare un argomento nuovo + review exercise"
```

### Task B7: Traduzione EN mirror

**Files:**
- Crea: `src/content/docs/en/for-students/study-a-new-topic.mdx`
- Crea: `public/skills/en/review-study-a-new-topic.txt`

- [ ] **Step 1: Scrivere il mirror EN**

Creare il file con frontmatter EN:

```yaml
---
title: Study a new topic
description: Formal study against a fixed syllabus. AI as a tutor that stays within your textbook's frame, not one that drifts off.
livello: intermedio
prerequisiti: [ask-well, learn-something-new, when-to-trust-it]
---
```

(Nota: i campi `livello` e `prerequisiti` restano in italiano nello schema. Sono code identifier, non user-facing. Vedi `src/content.config.ts`.)

Tradurre fedelmente il corpo dell'MDX IT risultante post-integrazione. Adattamenti culturali dove servono:

- L'apertura del contratto del modulo va tradotta mantenendo il taglio "operativo, non morale".
- Esempio del manuale di diritto costituzionale Bin/Pitruzzella → mantenere l'esempio italiano e glossarlo, oppure adattare a un manuale di Constitutional Law inglese/americano (es. *Tribe's American Constitutional Law*). Decidere lezione per lezione cosa è più universale.
- "Manuale" → *textbook* (non *manual*).
- "Programma" (di un corso) → *syllabus*.
- "Interrogazione" → *oral exam* (non *interrogation* e non *viva* — quest'ultimo è UK-specific per la difesa di tesi).

Cross-link interni tradotti: `/it/fundamentals/...` → `/en/fundamentals/...`, `/it/everyday-use/...` → `/en/everyday-use/...`.

- [ ] **Step 2: Scrivere `public/skills/en/review-study-a-new-topic.txt`**

Traduzione fedele dell'IT. Tono: l'LLM si rivolge al lettore in inglese naturale, non burocratico.

- [ ] **Step 3: Aggiungere `<LlmExercise variant="review">` al mirror EN**

Stesso markup dell'IT, stesso `file="review-study-a-new-topic.txt"` (il componente risolve il path per locale).

### Task B8: QA con agent `style-checker` EN e commit EN

- [ ] **Step 1: Lanciare l'agent in EN**

Agent: `style-checker` sulla pagina `src/content/docs/en/for-students/study-a-new-topic.mdx`. L'agent rileverà em dash, AI buzzwords inglesi (*paradigm*, *robust*, *seamless*, *leverage*, *delve into*, *navigate the landscape*), chiusure scolastiche tipo *In conclusion*, e calchi IT→EN (es. *It happens that...* come calco di "succede che", verbo "to optate" come calco di "optare").

- [ ] **Step 2: Applicare i fix**

Rivedere ogni segnalazione e applicarla.

- [ ] **Step 3: Commit EN**

```bash
git add src/content/docs/en/for-students/study-a-new-topic.mdx public/skills/en/review-study-a-new-topic.txt
git commit -m "Module 4 lesson 1 EN: Study a new topic + review exercise"
```

### Task B9: Sblocco placeholder in sidebar + aggiornamento `CONTENT.md` a ✅

**Files:**
- Modifica: `astro.config.mjs` (riga del placeholder *Study a new topic*)
- Modifica: `CONTENT.md` (Modulo 4, voce 1 → ✅; sezione "Stato attuale" → "1 su 8 pubblicate"; sezione "Prossima sessione")

- [ ] **Step 1: Sbloccare il placeholder in sidebar**

In `astro.config.mjs`, sostituire la voce:

```javascript
{
  label: 'Study a new topic',
  translations: { it: 'Studiare un argomento nuovo' },
  link: '#',
  badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
  attrs: { 'aria-disabled': 'true', tabindex: -1 },
},
```

con:

```javascript
{ slug: 'for-students/study-a-new-topic' },
```

- [ ] **Step 2: Aggiornare `CONTENT.md`**

- Cambiare `1. ✍️` in `1. ✅` per la lezione 1 nel Modulo 4.
- Aggiungere sotto la voce un riassunto delle integrazioni effettive (questo si compila a posteriori, replicando il pattern di Modulo 2 e 3: "Ciclo di revisione completo (`analyze-lesson` + `integrate-questions` + `style-checker` IT e EN, [data]). Integrazioni principali: [riassunto]").
- In **"Stato attuale"** del Modulo 4: passare da "0 su 8 pubblicate" a "1 su 8 pubblicate".
- In **"Prossima sessione"** a fine file: aggiornare la "prossima bozza" alla lezione 2.

- [ ] **Step 3: Build smoke**

Run: `npm run build`

Expected: build pulita, la sidebar mostra *Studiare un argomento nuovo* come voce cliccabile (nessun badge "Presto").

- [ ] **Step 4: Commit**

```bash
git add astro.config.mjs CONTENT.md
git commit -m "Unlock Module 4 lesson 1 in sidebar"
```

---

## Phase C — Lezione 2: Appunti da lezioni e testi lunghi (`notes-from-lectures`)

**Slug**: `notes-from-lectures` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `summarize-a-long-document`, `images-and-files`

### Brief di lezione

Lezione "input": come portare materiale grezzo a forma studiabile. Differenza chiara da M2L4 (*Riassumere un documento lungo*): qui non c'è un singolo PDF, c'è un insieme di artefatti dello stesso corso (audio della lezione + slide del prof + capitolo del manuale + appunti propri). L'output non è un riassunto, è una **mappa di studio** che tenga insieme i pezzi.

- **Apertura** (~120 parole): il problema dello studente "ho il materiale, ma è ovunque". Tre fonti tipiche: la voce del prof a lezione, le slide, il manuale. Non sono interscambiabili: il prof in classe enfatizza cose che le slide tagliano e che il manuale espande. La sfida non è riassumere ciascuna, è comporle.

- **Caso d'uso 1, registrazione audio della lezione** (~250-300 parole). Whisper (OpenAI, gratis con app desktop o tramite ChatGPT Plus); integrazioni di tool di call (Otter, Tactiq, Read.ai per Zoom/Meet/Teams se la lezione è online); Apple Voice Memos su iPhone recenti che ora trascrive nativamente + condivisione su ChatGPT/Claude. **Callout `:::caution`** sul consenso: registrare il prof è giuridicamente delicato in molti paesi (Italia: registrazione per uso personale è generalmente lecita se sei parte della conversazione, ma diffondere o caricare in chat pubbliche è altro). Buona pratica: chiedere al prof, almeno una volta a inizio corso.

- **Caso d'uso 2, mettere insieme più fonti** (~250-300 parole). Tre input tipici (slide + appunti propri + capitolo del manuale) → un documento unico di studio. Prompt portante: "Ti carico tre cose: le slide della lezione 7 di Storia contemporanea, i miei appunti scritti a mano (foto), e il capitolo 12 del manuale di Sabbatucci/Vidotto. Voglio una mappa di studio che tenga insieme i tre, evidenziando dove il prof in classe ha enfatizzato cose che il manuale tratta diversamente o non tratta." Output atteso: una scaletta gerarchica con sezioni e sotto-sezioni, citando da dove viene cosa.

- **Caso d'uso 3, organizzare un corso intero** (~150-200 parole). Più documenti dello stesso corso accumulati nel tempo (10 set di slide, 10 set di appunti). Strumento giusto: Claude Project, ChatGPT Custom GPT, Gemini Gem (richiamo a M3L8 *Riusare contesto con i progetti*). Carichi una volta il materiale del corso come knowledge; ogni chat aperta nel progetto può fare ricerca e collegamenti senza dover ricaricare ogni volta.

- **ChatDemo portante** (~150 parole di setup). Caso: studentessa di Storia contemporanea, lezione su "Italia 1943-1946". Tre input: trascrizione audio di 45 minuti, slide del prof (10 pagine), capitolo del manuale (40 pagine). Mostrare il prompt e la mappa di studio risultante (4-5 voci con sotto-voci, con tag `[Prof]`, `[Manuale]`, `[Slide]` per tracciare la fonte).

- **Callout `:::tip` "trascrizione audio: cosa funziona, cosa no"**: Whisper trascrive bene italiano standard; soffre con dialetti, accenti forti, audio rumoroso. Per un'aula con 30 studenti che parlano, la qualità cala. Se il prof parla a microfono, è ottima.

- **Cosa NON fare** (~80-100 parole): trasformare gli appunti in qualcosa che non riconosci più (la mappa di studio deve aiutarti a ricordare, non sostituire la tua scrittura); usare la trascrizione audio come fonte primaria se hai accesso al manuale (la voce del prof è bassa fedeltà, il manuale è alta fedeltà).

- Transizione: "Ora il materiale è organizzato. Quando arriva la settimana dell'esame serve trasformarlo in qualcosa di interrogabile. La prossima lezione: come ripassare."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1000-1200 parole.

### Tasks C1–C9

Stessa sequenza di B1-B9, con:
- **Slug**: `notes-from-lectures`
- **Frontmatter title IT**: "Appunti da lezioni e testi lunghi"
- **Frontmatter title EN**: "Notes from lectures and long texts"
- **Prerequisiti**: `ask-well`, `summarize-a-long-document`, `images-and-files`
- **Title del review EN**: traduzione del titolo IT (es. "Four questions to fix the method" → adattare; vedere convenzione M3 EN)
- **File review**: `review-notes-from-lectures.txt`
- **Commit IT**: `Module 4 lesson 2: Appunti da lezioni e testi lunghi + review exercise`
- **Commit EN**: `Module 4 lesson 2 EN: Notes from lectures + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 2 in sidebar`

In sidebar, sostituire la voce *Notes from lectures* con `{ slug: 'for-students/notes-from-lectures' }`.

In `CONTENT.md` → "Stato attuale": "2 su 8 pubblicate".

---

## Phase D — Lezione 3: Ripassare prima di un esame (`revise-before-an-exam`)

**Slug**: `revise-before-an-exam` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `learn-something-new`

### Brief di lezione

Lezione "output". Una volta che il materiale è studiato e organizzato (lezioni 1 e 2), come usi l'IA negli ultimi giorni/settimane prima della verifica. La differenza chiave da *Studiare un argomento nuovo* è che qui sai già le cose, devi solo fissarle e provare a richiamarle sotto pressione.

- **Apertura** (~100-120 parole): la differenza fra studiare e ripassare. Studiare = capire la prima volta. Ripassare = simulare la condizione dell'esame finché la risposta non viene fluida. L'IA serve a generare la pressione realistica della verifica, che il manuale da solo non genera.

- **Tre tecniche** (500-600 parole):

  1. **Interrogazione orale simulata** (~200 parole). Prompt portante: "Fai finta di essere il mio prof di [materia] all'esame orale. Hai il programma del corso ([incolla l'indice del manuale o lista di argomenti]). Fammi una domanda alla volta, non passare alla seguente finché non ti rispondo. Dopo la risposta dammi un giudizio onesto (preciso/impreciso/mancante), e se è imprecisa, dimmi cosa avresti voluto sentire. Non passare al voto finale finché non te lo chiedo io." Lo standout di questa tecnica è il **non passare oltre**: l'IA di default vuole compiacere e accetta risposte vaghe.

  2. **Interrogazione scritta con correzione** (~150 parole). Tema generico, traccia tipica del prof, oppure problema (matematica/fisica). Stesso pattern: prompt + risposta + valutazione + correzione del passaggio in cui hai sbagliato.

  3. **Mappe mentali e flashcards** (~200 parole). Mappa mentale = schema gerarchico dell'argomento (utile prima dell'orale per "vedere" la struttura). Flashcards = domande brevi per ripasso a spaced repetition.

    - **Callout `:::tip` "Flashcards e Anki/Quizlet"** (~100 parole dentro il bullet): l'IA genera flashcards in formato CSV/TSV o markdown da incollare in Anki o Quizlet. Format tipico: `Domanda;Risposta` o `Termine;Definizione`. Per Anki, il formato base è `front,back`. Limite: l'IA tende a fare domande troppo facili o troppo aperte; controlla le prime 10 e rimanda l'IA con un esempio di domanda buona vs cattiva.

- **Strategia per il docente** (~150-200 parole). Due profili tipici di prof:
  - **Prevedibile**: ogni anno chiede gli stessi argomenti chiave, con un tipo di domanda riconoscibile. Se hai accesso ai questionari degli esami precedenti (forum studenti, gruppi WhatsApp del corso), incollali all'IA come "stile del prof".
  - **Imprevedibile**: il prof fa domande di ragionamento e collegamento, non di memoria. Qui l'IA è utile per generare domande **trasversali**: "dammi tre domande che colleghino l'argomento del capitolo 4 con quello del capitolo 7".

- **ChatDemo portante** (~150-200 parole). Caso: orale di filosofia teoretica su Heidegger. Prompt impostato come tecnica 1. L'IA fa la prima domanda, lo studente risponde, l'IA dà un giudizio onesto ("preciso su 1) e 2), impreciso su 3) — ti aspettavi di sentire l'aletheia come 'svelamento', non 'verità intesa come idea'"), e propone la seconda domanda solo dopo la richiesta dello studente.

- **Callout `:::caution` "L'IA che ti conferma è il rischio"**: di default l'IA tende a dirti che hai fatto bene anche se hai detto qualcosa di vago. Il prompt deve essere esplicito ("dammi un giudizio onesto, anche severo") e tu devi controllare le risposte chiave su una fonte (manuale, slide). Richiamo a M1L5 *Quando fidarsi e quando no*.

- **Cosa NON fare** (~80-100 parole): ripassare solo sulle risposte dell'IA invece che sul manuale (l'IA conferma anche un errore se gli dai sicurezza); usare flashcards mai testate (le prime 10 vanno controllate); affidarsi al "voto" dell'IA come predittivo (non lo è).

- Transizione: "Ripasso fissato. La prossima lezione cambia registro: la tesi, dove la posta in gioco non è un esame da 20 minuti ma un lavoro lungo mesi."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Tasks D1–D9

Stessa sequenza di B1-B9, con:
- **Slug**: `revise-before-an-exam`
- **Frontmatter title IT**: "Ripassare prima di un esame"
- **Frontmatter title EN**: "Revise before an exam"
- **Prerequisiti**: `ask-well`, `learn-something-new`
- **File review**: `review-revise-before-an-exam.txt`
- **Commit IT**: `Module 4 lesson 3: Ripassare prima di un esame + review exercise`
- **Commit EN**: `Module 4 lesson 3 EN: Revise before an exam + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 3 in sidebar`

In sidebar, sostituire la voce *Revise before an exam* con `{ slug: 'for-students/revise-before-an-exam' }`.

In `CONTENT.md` → "Stato attuale": "3 su 8 pubblicate".

---

## Phase E — Lezione 4: Scrivere una tesi (`write-a-thesis`)

**Slug**: `write-a-thesis` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`, `draft-professional-documents`

### Brief di lezione

Lezione più impegnativa del modulo. La tesi è il lavoro di studio più lungo (mesi), con stakeholder esplicito (il relatore), pubblico ristretto (commissione), e un confine etico più sottile del solito (chi scrive deve essere chiaro che è lo studente). La tesi ha la promessa di "ghostwriting facile" più forte del modulo: questa lezione è dove smontarla.

- **Apertura** (~120-150 parole): la tesi non è una versione lunga di un tema. Differenza: c'è un lavoro di costruzione (mesi), un metodo (capitoli che si collegano), un dialogo con un relatore. L'IA può aiutare in ogni passaggio, ma se scrive lei la tesi, il primo a perderci sei tu (alla discussione il relatore te ne accorge, e ti diranno cose che non puoi difendere). La tesi non si delega: si costruisce con l'IA come **secondo lettore**, non come autore.

- **Pattern outline + riempimento** (~250 parole, richiamando M3L2). Stessa meccanica del *Bozze di documenti professionali* di Modulo 3: l'IA non riempie un foglio bianco, riempie una scaletta che hai costruito tu insieme al relatore. Differenza specifica per la tesi:
  - La scaletta nasce dal dialogo con il relatore (è lui che valida che la struttura tenga il discorso accademico), non solo dall'IA.
  - Ogni capitolo è un dialogo separato: la tesi è troppo lunga per stare in un singolo contesto, e ogni capitolo ha bibliografia e argomento suoi. Apri una chat per capitolo, riapri quella del capitolo 2 quando torni a lavorarci.

- **L'IA come secondo lettore** (~250-300 parole). Pattern: scrivi tu un paragrafo, lo incolli all'IA con una domanda specifica: "questo paragrafo difende la tesi che voglio sostenere (cioè X)? Dove è debole? Quali obiezioni mi farebbe un commissario rigoroso?". L'IA non aggiunge contenuto, sottolinea buchi e debolezze. Cosa chiedere e cosa NON chiedere:
  - **Sì**: "rendi questa frase più chiara senza cambiarne il senso"; "questa transizione fra paragrafo A e paragrafo B funziona?"; "questa argomentazione regge? quali sono i tre buchi più grossi?"; "dammi tre obiezioni che potrebbe fare un critico".
  - **No**: "scrivi il prossimo paragrafo"; "espandi questo paragrafo a 500 parole"; "scrivi la conclusione del capitolo".

- **Calibrazione sul relatore** (~150-200 parole). Il relatore ha aspettative non scritte: stile di citazione, taglio (storico-comparato vs analitico vs sperimentale), severità sulle ipotesi. Prima di partire chiedi: "che tipo di tesi ti aspetti? Più sintetica o più estesa? Quale taglio?". Quando hai una bozza di capitolo, **prima** di andare in correzione: usa l'IA come simulatore del relatore. Prompt: "fai finta di essere il mio relatore, che è un professore di [materia] di taglio [taglio]. Ti consegno il capitolo 2. Cosa mi chiederesti di rivedere?". Non sostituisce la consegna vera, ma riduce le iterazioni di correzione.

- **Callout `:::tip` "Triennale vs magistrale vs dottorato"** (~120 parole):
  - **Triennale (~40-60 pagine)**: tesi compilativa, organizza bibliografia esistente. L'IA aiuta molto sull'organizzazione, meno sul contributo originale (che è minimo).
  - **Magistrale (~80-150 pagine)**: tesi con qualche contributo originale (analisi, dataset, caso studio). L'IA aiuta organizzazione + dialogo critico; il contributo originale va difeso a voce.
  - **Dottorato (~150-300+ pagine)**: contributo originale al campo. L'IA aiuta sulla scrittura e sulla revisione, ma il contenuto è inevitabilmente tuo. Confine etico più stretto: pubblicazioni dichiarano l'uso di LLM.

- **ChatDemo portante** (~150-200 parole). Caso: studente magistrale di Storia dell'arte, paragrafo della tesi sul "ruolo della committenza medicea nella nascita del Manierismo". Prompt: "questo paragrafo difende la mia tesi (che la committenza medicea non è la sola causa)? Dove è debole? Tre obiezioni di un commissario severo." Output: tre obiezioni con suggerimenti di rinforzo (es. "manca il confronto con la committenza romana parallela, che è il principale argomento contro la tua tesi").

- **Callout `:::caution` "Dichiarazione dell'uso"**: molte università richiedono ora una breve dichiarazione su come l'IA è stata usata nella tesi. Una formula tipo: "ChatGPT/Claude è stato usato come secondo lettore per revisione di stile, simulazione del relatore, e brainstorming sulle obiezioni; non è stato usato per generare paragrafi finiti né per produrre la bibliografia." Verificare la policy del proprio ateneo: vedi lezione 8.

- **Cosa NON fare** (~100 parole): far scrivere il paragrafo all'IA e poi "rifrasarlo" (il commissario sente la differenza); usare l'IA per generare bibliografia (rinvio a lezione 5); accumulare 8 capitoli senza farne leggere uno al relatore (l'IA non sa cosa il relatore vuole davvero finché non glielo chiedi).

- Transizione: "Il lavoro di scrittura è uno; il lavoro di bibliografia è un altro. La prossima lezione: come gestire le fonti senza farsene inventare di false."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1200-1400 parole (la lezione più lunga del modulo).

### Tasks E1–E9

Stessa sequenza di B1-B9, con:
- **Slug**: `write-a-thesis`
- **Frontmatter title IT**: "Scrivere una tesi"
- **Frontmatter title EN**: "Writing a thesis"
- **Prerequisiti**: `ask-well`, `write-better`, `draft-professional-documents`
- **File review**: `review-write-a-thesis.txt`
- **Commit IT**: `Module 4 lesson 4: Scrivere una tesi + review exercise`
- **Commit EN**: `Module 4 lesson 4 EN: Writing a thesis + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 4 in sidebar`

In sidebar, sostituire la voce *Write a thesis* con `{ slug: 'for-students/write-a-thesis' }`.

In `CONTENT.md` → "Stato attuale": "4 su 8 pubblicate".

**Nota di traduzione EN per questa lezione**:
- "Tesi" → in inglese accademico si usa *thesis* per triennale/magistrale (più diffuso in US/UK undergraduate/master) e *dissertation* per PhD (più tipico UK). Per coerenza editoriale: usare *thesis* in tutta la lezione, glossando *dissertation* nel callout sul dottorato.
- "Relatore" → *supervisor* (UK/US comune; *advisor* è più US).
- "Discussione" / "difesa" → *defense* (US) o *viva* (UK, solo per PhD). Usare *defense*.
- "Triennale" / "magistrale" → *Bachelor's thesis* / *Master's thesis*. Lasciare i termini italiani come glossa fra parentesi nel callout.

---

## Phase F — Lezione 5: Fonti e citazioni (`sources-and-citations`)

**Slug**: `sources-and-citations` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `research-for-work`, `when-to-trust-it`

### Brief di lezione

Lezione tecnica sul tema più rischioso del modulo: bibliografia. È dove l'IA fa più danno in contesto accademico (citazioni inventate che il relatore ti smaschera in 30 secondi). Eredita la meccanica della verifica multi-fonte da M3L6 (*Ricerca per il lavoro*) e la traduce al contesto accademico, dove gli standard sono più rigidi.

- **Apertura** (~120 parole): la bibliografia accademica è dove l'IA fa più danno perché ha imparato a "suonare bibliografia" senza necessariamente farne una vera. Riconoscere una citazione inventata da una vera è una skill da imparare: questa lezione la insegna.

- **Anatomia della citazione inventata** (~200 parole). L'IA inventa citazioni con la stessa struttura di quelle vere: autore plausibile (cognome che esiste, magari accademico noto della disciplina) + journal plausibile (esistente o quasi) + anno plausibile (di solito recente) + pagine plausibili. La differenza: la combinazione specifica non esiste, oppure il DOI non risolve, oppure l'articolo esiste ma dice qualcosa di diverso da quello che la citazione gli attribuisce. Esempi di pattern di invenzione:
  - Autore reale + paper reale + anno sbagliato (citato 2018, in realtà 2014).
  - Autore reale + paper inesistente di quell'autore.
  - Journal reale + numero/anno inesistente.
  - Citazione perfettamente strutturata ma 100% inventata.

- **DOI come gate di verifica** (~150-200 parole). Ogni articolo serio dopo il ~2000 ha un DOI (Digital Object Identifier), tipo `10.1086/675329`. È la firma univoca dell'articolo. Verifica: incolla il DOI su `doi.org/<DOI>` → se risolve a un paper la cui informazione corrisponde, OK. Se non risolve, la citazione è quasi certamente inventata. Se risolve ma il paper non parla dell'argomento che ti aspettavi, l'IA ha attribuito un contenuto sbagliato.

- **Quattro stili bibliografici principali** (~200-250 parole). Non un'enciclopedia, una breve mappa:
  - **APA** (American Psychological Association): scienze sociali e umane. (Autore, anno).
  - **MLA** (Modern Language Association): umanistica, letterature, lingue. (Autore, pagina).
  - **Chicago** (note + bibliografia): storia, alcune umanistiche. Note a piè di pagina con citazione completa.
  - **ISO 690** (in pratica le varianti europee): tipica per scienze tecniche e per tesi in italiano. Numerate `[1], [2], ...` con bibliografia in fondo.

  Per uno dei quattro, l'IA è un buon "formattatore": dai i dati grezzi (autore, titolo, anno, pagine), chiedi "formatta in stile Chicago". Per controllare se la formattazione è corretta, usa la guida ufficiale dello stile o un tool come Zotero.

- **Distinguere fonte accademica reale da blog mascherato** (~150 parole). Quando chiedi all'IA "trova fonti su X", il rischio non è solo che inventi: è anche che cita siti che hanno apparenza accademica senza esserlo (medium.com con tono dotto, blog universitari di dottorandi privi di peer review, articoli su SSRN non ancora pubblicati e quindi non peer-reviewed). Tre filtri:
  1. **DOI risolvibile**.
  2. **Journal indicizzato** in Scopus o Web of Science (controllabile su Scopus.com cercando il titolo del journal).
  3. **Editore noto** (Springer, Elsevier, Cambridge UP, Oxford UP, JSTOR, le università principali). Se è un sito che non hai mai sentito + non risolve un DOI, sospetto.

- **NotebookLM (callout `:::tip`)** (~120 parole). Strumento Google specifico per bibliografia: carichi i PDF dei paper che hai già (o le pagine dei libri), e l'IA risponde **solo** sulla base di quei documenti. Niente world knowledge, niente citazioni inventate. È il modo più sicuro di lavorare quando la bibliografia è chiusa (es. tesi su un autore specifico). Limite: devi avere già i paper, non li scopre per te.

- **ChatDemo portante** (~150 parole). Caso: studente di Economia che chiede all'IA "trova tre paper recenti su 'effetto della tassazione sui consumi alimentari'". L'IA risponde con tre citazioni perfette in stile APA. Mostrare il dialogo successivo:
  1. Studente: "dimmi il DOI di ognuno".
  2. IA: dà tre DOI plausibili.
  3. Studente: verifica su `doi.org` → uno risolve a un paper su tutt'altro tema, uno non risolve, uno risolve correttamente.
  4. Studente all'IA: "ho verificato i DOI: questi due sono inventati. Lavoriamo solo sul terzo".

- **Cosa NON fare** (~80-100 parole): consegnare la bibliografia generata dall'IA senza aver verificato ogni DOI (il relatore in 30 secondi prende uno a caso e ti smaschera); usare "trova paper recenti" come fonte primaria (per ricerche reali, parti da Google Scholar o dal database della tua università, non dall'IA).

- Transizione: "Bibliografia gestita. La prossima lezione è laterale ma utile a molti: tradurre e confrontare testi, per chi fa lingue o classici."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Tasks F1–F9

Stessa sequenza di B1-B9, con:
- **Slug**: `sources-and-citations`
- **Frontmatter title IT**: "Fonti e citazioni"
- **Frontmatter title EN**: "Sources and citations"
- **Prerequisiti**: `ask-well`, `research-for-work`, `when-to-trust-it`
- **File review**: `review-sources-and-citations.txt`
- **Commit IT**: `Module 4 lesson 5: Fonti e citazioni + review exercise`
- **Commit EN**: `Module 4 lesson 5 EN: Sources and citations + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 5 in sidebar`

In sidebar, sostituire la voce *Sources and citations* con `{ slug: 'for-students/sources-and-citations' }`.

In `CONTENT.md` → "Stato attuale": "5 su 8 pubblicate".

**Nota di traduzione EN per questa lezione**:
- ISO 690 ha varianti europee/italiane; nella versione EN, sostituire il riferimento "tipica per tesi in italiano" con "common in technical and European theses". Lasciare i quattro stili (APA, MLA, Chicago, ISO 690) invariati: sono nomi propri.
- "Peer review" non tradurre (è inglese in entrambe le lingue).
- "Articolo indicizzato" → *indexed article*.
- "Editore" (in contesto bibliografico) → *publisher*.

---

## Phase G — Lezione 6: Tradurre e confrontare testi (`translate-and-compare`)

**Slug**: `translate-and-compare` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `images-and-files`

### Brief di lezione

Lezione laterale ma utile a un sottoinsieme dello studente: lingue (moderne e antiche), letterature comparate, classici, filologia. Mostra come usare l'IA per traduzione come strumento di apprendimento, non come traduttore-ciecamente-da-incollare.

- **Apertura** (~100 parole): la traduzione è una di quelle cose dove l'IA "sembra perfetta" e invece può essere subdola. Una traduzione errata di un verso di Catullo o di un articolo di Le Monde non si vede a colpo d'occhio: si vede solo se la confronti con altre traduzioni o con la fonte. Questa lezione mostra come usare l'IA come *aiuto* alla traduzione, non come sostituto.

- **Pattern "tre versioni"** (~200 parole). Mai chiedere "traduci questo": chiedere sempre tre versioni con tagli diversi. Esempio per una frase di prosa francese:
  1. **Letterale**: più aderente al testo, anche a costo di suonare innaturale.
  2. **Idiomatica**: italiano scorrevole, con piccole libertà sintattiche.
  3. **Libera**: l'idea passa, ma il fraseggio cambia.

  La differenza fra le tre ti mostra cosa "perdi" nella traduzione, ed è il vero apprendimento. Per chi traduce: non scegliere la migliore, ricomporne una propria.

- **Glosse e note storiche** (~150-200 parole). Per testi che richiedono comprensione storica (latino, greco, italiano antico, francese antico), una traduzione moderna non basta. Chiedere all'IA di affiancare la traduzione con **glosse**: parole o concetti che il lettore moderno non conosce. Esempio: tradurre un verso di Catullo + glossa su "patroni" del *clientelismo* romano. Cautela: le glosse storiche sono uno dei punti dove l'IA inventa (date sbagliate, attribuzioni sbagliate). Verifica una glossa su due con una fonte enciclopedica.

- **Confronto fra edizioni** (~150-200 parole). Per uno studente di letteratura inglese o di classici, leggere due traduzioni dello stesso testo dice spesso più del testo originale. Pattern: chiedere all'IA "qui c'è la versione di Pavese e qui quella di Rosa Calzecchi Onesti dell'*Iliade*, libro VI, scena di Ettore e Andromaca. Quali sono le tre differenze più importanti, e cosa rivelano sul taglio di ogni traduttore?". L'IA non sostituisce la lettura ma accelera la mappa delle differenze.

- **Registri (formale/informale)** (~100-150 parole). Per studenti di lingue moderne (inglese, francese, spagnolo, tedesco): la stessa frase in due registri. Esempio: l'IA traduce in inglese una mail al professore in due versioni, una *formal* e una *informal*. Lo studente vede dove il registro cambia (saluto, scelte di vocabolario, sintassi).

- **Trabocchetti linguistici (callout `:::caution`)** (~100-120 parole). Tre tipi:
  1. **Falsi amici** (italiano *attualmente* ≠ inglese *actually*; tedesco *Gift* = veleno, non regalo).
  2. **Registri storici** (un'espressione del XV secolo non significa quello che la stessa espressione significa oggi).
  3. **Dialetti e varianti regionali** (spagnolo iberico vs latinoamericano; portoghese europeo vs brasiliano). Sempre dire all'IA su quale variante stai lavorando.

- **ChatDemo portante** (~150 parole). Caso: studente di Lettere classiche, verso latino di Catullo (*Vivamus, mea Lesbia, atque amemus*). Prompt: "Traducimi questo verso in italiano in tre versioni (letterale, idiomatica, libera), poi affiancalo con due glosse storiche sui termini *vivamus* e *amemus* nel contesto di Catullo." Output: tre traduzioni che mostrano scelte diverse + due glosse (con una nota di cautela su una glossa che potrebbe essere imprecisa).

- **Callout `:::caution` "L'IA in una verifica di traduzione è plagio"**: dichiarazione esplicita per togliere ambiguità. In un esame o compito di traduzione, l'IA non è uno strumento, è un sostituto vietato. Vale per latino, greco, lingue moderne, esami di interpretariato. Vedi lezione 8.

- **Cosa NON fare** (~80-100 parole): consegnare traduzione dell'IA in una verifica di traduzione (plagio); usare una sola versione di traduzione per uno studio di testi (la lezione è proprio sul confronto); fidarsi delle glosse storiche senza una verifica enciclopedica.

- Transizione: "Sulle traduzioni come su tutto il resto, vale il problema del fondo: l'IA può essere convincente anche quando sbaglia. La prossima lezione zooma su questo, in contesto studio: come accorgersene quando NON sai già la risposta giusta."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1000-1200 parole.

### Tasks G1–G9

Stessa sequenza di B1-B9, con:
- **Slug**: `translate-and-compare`
- **Frontmatter title IT**: "Tradurre e confrontare testi"
- **Frontmatter title EN**: "Translating and comparing texts"
- **Prerequisiti**: `ask-well`, `images-and-files`
- **File review**: `review-translate-and-compare.txt`
- **Commit IT**: `Module 4 lesson 6: Tradurre e confrontare testi + review exercise`
- **Commit EN**: `Module 4 lesson 6 EN: Translating and comparing texts + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 6 in sidebar`

In sidebar, sostituire la voce *Translate and compare texts* con `{ slug: 'for-students/translate-and-compare' }`.

In `CONTENT.md` → "Stato attuale": "6 su 8 pubblicate".

**Nota di traduzione EN per questa lezione**: gli esempi italiani (Pavese/Rosa Calzecchi Onesti dell'*Iliade*) restano riconoscibili in inglese o vanno sostituiti con due traduzioni inglesi note (es. Lattimore vs Fagles dell'*Iliad*). Decidere in fase di traduzione: probabilmente sostituire Pavese/Rosa Calzecchi Onesti con Lattimore vs Fagles, mantenendo il punto editoriale.

---

## Phase H — Lezione 7: Quando l'IA ti imbroglia (`when-ai-tricks-you`)

**Slug**: `when-ai-tricks-you` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `when-to-trust-it`

### Brief di lezione

Lezione di critica della risposta, calibrata sul contesto studio. È la versione "studente" di M1L5 (*Quando fidarsi e quando no*) e di M3L6 (*Ricerca per il lavoro*): stessa idea (l'IA è convincente anche quando sbaglia), ma con esempi e test specifici per uno studente che NON è in posizione di accorgersi dell'errore, perché sta cercando di imparare proprio quella cosa.

- **Apertura** (~120-150 parole): chi studia un argomento per la prima volta ha un problema strutturale: non può accorgersi che l'IA sbaglia, perché se sapesse riconoscere l'errore avrebbe già imparato. Questo è il caso peggiore (richiamo a M2L8 *Cose da NON fare*, regola madre). Questa lezione dà strumenti per limitare il danno: riconoscere gli errori tipici dell'IA in contesto studio, e tre test rapidi che funzionano anche senza sapere già la risposta.

- **Cinque errori tipici in contesto studio** (~400-500 parole):

  1. **Definizioni shift dal manuale** (~80 parole). L'IA pesca da fonti diverse: Wikipedia, libri di testo anglosassoni in traduzione, articoli divulgativi. La definizione che ti dà può essere "vicina" a quella del tuo manuale ma con sfumature diverse, che all'esame contano. Esempio: l'IA definisce "anomia" alla Durkheim ma con un taglio mertoniano (sociologo americano), il tuo manuale di sociologia italiana segue rigorosamente Durkheim.

  2. **Date confuse** (~80 parole). Anno corretto, mese sbagliato. Decennio corretto, anno sbagliato. È il tipo di errore più sottile: si vede solo in confronto con una cronologia precisa. Esempio: "la conferenza di Yalta si tenne nel marzo 1945" (in realtà febbraio).

  3. **Biografie miste** (~80 parole). Eventi del padre attribuiti al figlio, opere di un autore attribuite a un altro della stessa scuola, fatti di un Pio X attribuiti a Pio IX. Tipico per personaggi storici con omonimi o per scuole filosofiche con molti rappresentanti.

  4. **Formule giuste nella forma ma con segno sbagliato** (~80 parole). Caso più frequente in matematica e fisica: l'IA produce una formula che "sembra" quella standard ma con uno sbaglio di segno, di esponente, o di costante. Il rischio è che la formula passi la verifica visiva ("ah sì, è la formula del moto"), ma se ci fai un esercizio porta a un risultato sbagliato. Punto chiave: l'IA è meno affidabile in matematica e fisica che in storia o filosofia (richiamo a M2L5).

  5. **Opere fantasma** (~80 parole). Riferimenti a libri, paper, articoli che non esistono. Vicino al caso delle citazioni inventate della lezione 5, ma qui inteso nel corpo del testo (es. l'IA scrive "come dice Foucault in *Le tecniche del sapere normativo*", e quel libro non esiste). Verifica: se non lo trovi su un database (Google Scholar, biblioteca della tua università), molto probabilmente è inventato.

- **Tre test rapidi quando NON sai la risposta** (~250-300 parole):

  1. **Test del manuale**: chiedi all'IA di formulare la risposta restando dentro il paragrafo del manuale che hai incollato. Se quello che dice diverge dal manuale, prendi il manuale.

  2. **Test della fonte**: "Indicami la fonte primaria di questa affermazione". Se l'IA cita una fonte verificabile, controllala. Se dice "questa è conoscenza comune" senza specificare, ricalibra: la conoscenza comune in contesto studio è troppo bassa per andare in un esame.

  3. **Test del secondo prompt**: in una chat nuova (senza il contesto di prima), rifai la stessa domanda con una formulazione leggermente diversa. Se l'IA dà una risposta diversa, è un segnale che la prima non era ben fondata.

- **ChatDemo portante** (~150-200 parole). Caso: studente di Storia che chiede "in che anno si tenne la conferenza di Yalta?". L'IA risponde "marzo 1945". Lo studente fa il **test della fonte** chiedendo "indicami la fonte primaria": l'IA cita un documento che non specifica il mese. Lo studente fa il **test del secondo prompt** in una chat nuova: "quando si tenne Yalta?". L'IA stavolta risponde "4-11 febbraio 1945". Conclusione: l'IA prima ha sbagliato, la seconda volta ha dato la risposta corretta.

- **Callout `:::tip` "Materie più rischiose"** (~100 parole). Le aree dove l'IA sbaglia più spesso in contesto studio:
  - **Matematica e fisica**: formule, dimostrazioni, segni.
  - **Medicina e biomedicina**: dosaggi, meccanismi cellulari specifici.
  - **Diritto specifico**: articoli di codice esatti, sentenze, riferimenti normativi.
  - **Date e cronologie precise**: in storia.

  Su materie meno rischiose (filosofia, sociologia, letteratura) la frequenza dell'errore è minore ma non zero, e l'errore è più sfumato (la "scuola di pensiero" giusta ma con un dettaglio sbagliato).

- **Cosa NON fare** (~80-100 parole): fidarsi del fatto che la risposta "suona giusta" (è il punto: tutte le risposte dell'IA suonano giuste); ricordare un'informazione solo dalla chat (le chat sparite, le informazioni anche; rimetti in un appunto verificato); usare l'IA come unica fonte su materie ad alto rischio sopra elencate.

- Transizione: "Riconoscere gli errori è la difesa tecnica. La difesa **etica** è un'altra cosa: dove finisce l'aiuto e inizia il copiato? L'ultima lezione del modulo chiude su questo."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Tasks H1–H9

Stessa sequenza di B1-B9, con:
- **Slug**: `when-ai-tricks-you`
- **Frontmatter title IT**: "Quando l'IA ti imbroglia"
- **Frontmatter title EN**: "When AI tricks you"
- **Prerequisiti**: `ask-well`, `when-to-trust-it`
- **File review**: `review-when-ai-tricks-you.txt`
- **Commit IT**: `Module 4 lesson 7: Quando l'IA ti imbroglia + review exercise`
- **Commit EN**: `Module 4 lesson 7 EN: When AI tricks you + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 7 in sidebar`

In sidebar, sostituire la voce *When AI tricks you* con `{ slug: 'for-students/when-ai-tricks-you' }`.

In `CONTENT.md` → "Stato attuale": "7 su 8 pubblicate".

**Nota di traduzione EN per questa lezione**: l'esempio Yalta funziona in entrambe le lingue. La "scuola di Durkheim/Merton" idem. Le materie più rischiose vanno tradotte con i nomi anglosassoni delle discipline.

---

## Phase I — Lezione 8: Etica dello studio (`ethics-of-studying`)

**Slug**: `ethics-of-studying` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `privacy-basics`, `what-not-to-do`

### Brief di lezione

Chiusura del modulo. La lezione finale è dove il modulo torna esplicitamente sull'etica, dopo aver dato al lettore 7 lezioni di valore operativo (ha guadagnato l'autorità per parlare del tema). Eredita la regola "chi firma" da M2L8 e la applica al contesto valutazione formale.

- **Apertura** (~120 parole): torna al contratto fissato nella lezione 1. Per sette lezioni il modulo ha trattato l'IA come strumento. Quello che resta è la domanda: dove finisce l'aiuto e inizia il copiato? La risposta non è uno schema, è un metodo di giudizio. Richiamo a M2L8 e alla regola "chi firma".

- **Quattro livelli di uso** (~400-450 parole). Non un cubicolo, una scala. Ogni livello ha esempi concreti e una regola di dichiarazione.

  1. **Spiegazione / tutor** (~80 parole). Capire un argomento, fare domande, farsi correggere. **Sempre OK**. Non richiede dichiarazione, è equivalente a chiedere a un compagno di corso o a usare un libro di testo aggiuntivo. Pattern coperto dalle lezioni 1 (Studiare) e 3 (Ripassare).

  2. **Organizzazione e struttura** (~100 parole). Mappa di studio dei tuoi appunti, scaletta della tesi, indice di un paper. **Di solito OK**, ma dichiararlo in tesi/paper. La struttura dell'argomento è tua, l'IA aiuta a metterla in forma. Pattern coperto dalle lezioni 2 (Appunti) e 4 (Tesi).

  3. **Generazione di porzioni di testo** (~120 parole). Un paragrafo, una transizione, una conclusione. **Dipende dal contesto** e va dichiarato:
      - Tesi: in molte università ora è esplicitamente vietato, in altre va dichiarato analiticamente. Vedi callout politiche.
      - Paper accademico: di norma il paper deve essere tuo nelle parole; l'IA come revisore di stile è OK, come autore di paragrafi no.
      - Tema / saggio in valutazione: è plagio. Punto.
      - Lavori non valutati (post, brief interni, comunicazione): regola del lavoro, non dello studio. Vedi M3.

  4. **Generazione completa** (~80-100 parole). L'IA scrive il testo, tu lo correggi. **In valutazione formale è copiato**, indipendentemente da quanto "riformuli" dopo. Il "filo" lo riconosce un commissario competente, e ti smaschera all'orale. Non è una questione di rischio (i detector sono inaffidabili), è una questione di sostanza: non hai imparato quello che il prof voleva che imparassi.

- **Dichiarazione dell'uso, come si fa** (~200 parole). Sempre più atenei richiedono una breve nota a inizio o fine tesi/paper. Formula tipo, mutuabile:

  > Nella stesura di questo lavoro, ChatGPT (versione [...], modello [...]) e Claude (versione [...], modello [...]) sono stati usati come:
  > 1. supporto allo studio (spiegazioni, interrogazioni simulate, ripasso);
  > 2. secondo lettore per revisione di stile, suggerimenti di chiarezza, simulazione di obiezioni del relatore;
  > 3. formattazione di citazioni bibliografiche (verificate manualmente attraverso il DOI).
  >
  > Le IA generative NON sono state usate per:
  > 1. generare paragrafi finiti né conclusioni;
  > 2. produrre la bibliografia (le fonti sono state cercate e verificate a partire da Scopus/JSTOR/Google Scholar);
  > 3. tradurre o riformulare passaggi senza intervento dell'autore.

  Verificare le indicazioni del proprio ateneo per la formula esatta richiesta.

- **Politiche d'istituto (callout `:::note`)** (~150 parole). Tre esempi italiani (verificare al momento della scrittura che le linee guida siano ancora attive e citabili):
  - **Politecnico di Milano**: linee guida sull'uso dell'IA negli elaborati di laurea (verificare URL al momento della scrittura).
  - **Università Bocconi**: codice d'onore aggiornato (verificare).
  - **Sapienza Università di Roma**: regolamento di ateneo aggiornato (verificare).

  Le politiche cambiano: prima di scrivere la tesi controlla la pagina ufficiale del tuo ateneo. Se non c'è una policy esplicita, vale la regola generale: usa l'IA come strumento di studio, dichiara, non far scrivere all'IA quello che firmi.

- **Callout `:::caution` "Esami proctored e AI detector"** (~150-180 parole). Tre punti:
  1. **Durante un esame supervisionato l'IA è vietata**, anche se l'esame è at-home con webcam (proctoring) e anche se l'università non blocca tecnicamente l'accesso. Vale sia per esami orali simulati che scritti.
  2. **AI detector** (Turnitin AI, GPTZero, Copyleaks): esistono ma sono inaffidabili. Turnitin stessa lo dichiara in disclaimer ufficiale (genericamente "should not be the sole basis for an academic integrity decision"). Possono dare falsi positivi su testi umani con stile "regolare" e falsi negativi su testi IA pesantemente riscritti.
  3. **Regola di chiusura** (richiamo a M2L8): l'asticella non è "cosa riesco a non far vedere", è "quale lavoro è mio". Se questo è il filtro, gli AI detector e le strategie di occultamento sono irrilevanti: la domanda è interna, non procedurale.

- **Regola "chi firma"** (~100 parole): adattamento da M2L8. In contesto studio, "chi firma" si traduce in:
  - L'orale lo sostieni tu. Se l'IA ha fatto il lavoro al posto tuo, ti scopri al primo confronto.
  - La tesi la difendi tu. Se l'IA ha scritto al posto tuo, alla discussione il relatore te ne accorge.
  - L'esame lo passi tu. Se hai imparato un'IA semplificata, ti dai una preparazione che il prof boccia.

- **Cosa NON fare** (~80-100 parole): far scrivere all'IA quello che firmerai (esame, tesi, paper); usare detector per "ottimizzare" il testo dell'IA in modo che passi il detector (è un uso anti-etico e instabile: ogni aggiornamento del detector può smascherarlo); pensare che "tanto nessuno saprà": chi corregge spesso lo sa, e sempre lo sospetta.

- **Chiusura del modulo** (~120-150 parole): l'IA è uno strumento di studio reale, quando usata bene; è una scorciatoia distruttiva, quando usata male. Le otto lezioni del modulo hanno mostrato il primo. Ponte ai moduli successivi: per chi insegna, il **Modulo 5** (Per docenti) ha le contropartite. Per chi vuole capire come l'IA fa quello che fa fino al livello tecnico, il **Modulo 6** (Per chi vuole di più) parte da qui.

- `<LlmExercise variant="review">`.

- Lunghezza target: 1300-1500 parole (la lezione più impegnativa del modulo, è una chiusura).

### Tasks I1–I9

Stessa sequenza di B1-B9, con:
- **Slug**: `ethics-of-studying`
- **Frontmatter title IT**: "Etica dello studio"
- **Frontmatter title EN**: "Ethics of studying"
- **Prerequisiti**: `ask-well`, `privacy-basics`, `what-not-to-do`
- **File review**: `review-ethics-of-studying.txt`
- **Commit IT**: `Module 4 lesson 8: Etica dello studio + review exercise`
- **Commit EN**: `Module 4 lesson 8 EN: Ethics of studying + review exercise`
- **Commit sblocco**: `Unlock Module 4 lesson 8 in sidebar`

In sidebar, sostituire la voce *Ethics of studying* con `{ slug: 'for-students/ethics-of-studying' }`.

In `CONTENT.md` → "Stato attuale": "8 su 8 pubblicate, **modulo Per studenti completo al 100%**".

**Nota di traduzione EN per questa lezione**:
- Le politiche d'istituto italiane (Polimi, Bocconi, Sapienza) nella versione EN vanno mantenute con glossa (sono comunque l'esempio italiano) o sostituite con esempi internazionali (es. linee guida MIT, Oxford, Stanford). Decidere in fase di traduzione: probabilmente lasciare un mix (un esempio italiano + uno internazionale) per non perdere il pubblico EN.
- "Esame proctored" → *proctored exam*.
- "AI detector" non tradurre.
- "Tesi/paper" già discusso in lezione 4.

---

## Phase J — Module closure

A modulo completo, attivare le card di ingresso al modulo su homepage e start-here, IT e EN. Una sola fase con un singolo commit (le quattro modifiche sono di tre righe ciascuna).

### Task J1: Attivare card *Per studenti* in homepage IT

**Files:**
- Modifica: `src/content/docs/it/index.mdx` (riga ~44-49, card *Per studenti*)

- [ ] **Step 1: Sostituire `comingSoon: true` con `href:`**

Trovare:

```mdx
{
  icon: 'graduation-cap',
  title: 'Per studenti',
  description: "Studiare argomenti difficili, preparare esami, scrivere tesi. L'IA come ripetitore che ti spiega finché non ci sei, senza copiare.",
  comingSoon: true,
},
```

Sostituire con:

```mdx
{
  icon: 'graduation-cap',
  title: 'Per studenti',
  description: "Studiare argomenti difficili, preparare esami, scrivere tesi. L'IA come ripetitore che ti spiega finché non ci sei, senza copiare.",
  href: '/it/for-students/study-a-new-topic/',
},
```

### Task J2: Attivare card *For students* in homepage EN

**Files:**
- Modifica: `src/content/docs/en/index.mdx` (riga ~44-49, card *For students*)

- [ ] **Step 1: Sostituire `comingSoon: true` con `href:`**

Trovare:

```mdx
{
  icon: 'graduation-cap',
  title: 'For students',
  description: "Studying hard topics, exam prep, writing essays. AI as a tutor that explains until it clicks, without doing the work for you.",
  comingSoon: true,
},
```

Sostituire con:

```mdx
{
  icon: 'graduation-cap',
  title: 'For students',
  description: "Studying hard topics, exam prep, writing essays. AI as a tutor that explains until it clicks, without doing the work for you.",
  href: '/en/for-students/study-a-new-topic/',
},
```

### Task J3: Attivare card *Sono uno studente* in start-here IT

**Files:**
- Modifica: `src/content/docs/it/start-here.mdx` (riga ~37-42)

- [ ] **Step 1: Sostituire `comingSoon: true` con `href:`**

Trovare:

```mdx
{
  icon: 'graduation-cap',
  title: 'Sono uno studente',
  description: "Usare l'IA per studiare, preparare esami, scrivere tesi. Senza imbrogliare e senza farti sostituire dalla macchina.",
  comingSoon: true,
},
```

Sostituire con:

```mdx
{
  icon: 'graduation-cap',
  title: 'Sono uno studente',
  description: "Usare l'IA per studiare, preparare esami, scrivere tesi. Senza imbrogliare e senza farti sostituire dalla macchina.",
  href: '/it/for-students/study-a-new-topic/',
},
```

### Task J4: Attivare card equivalente in start-here EN

**Files:**
- Modifica: `src/content/docs/en/start-here.mdx` (cercare la card con `icon: 'graduation-cap'`)

- [ ] **Step 1: Trovare la card e sostituire `comingSoon: true` con `href:`**

Run: `grep -n "graduation-cap" src/content/docs/en/start-here.mdx`

Aprire la riga corrispondente e applicare la stessa sostituzione del Task J3, con `href: '/en/for-students/study-a-new-topic/'` e descrizione EN.

### Task J5: Build smoke e commit

- [ ] **Step 1: Build**

Run: `npm run build`

Expected: build pulita.

- [ ] **Step 2: Verifica visiva**

Run: `npm run dev`

Aprire `http://localhost:4321/it/`, `http://localhost:4321/en/`, `http://localhost:4321/it/start-here/`, `http://localhost:4321/en/start-here/`. Le card "Per studenti" / "For students" / "Sono uno studente" non devono più mostrare il badge "Presto" e devono linkare alla lezione 1.

- [ ] **Step 3: Commit**

```bash
git add src/content/docs/it/index.mdx src/content/docs/en/index.mdx src/content/docs/it/start-here.mdx src/content/docs/en/start-here.mdx
git commit -m "Module 4 closure: enable For students cards on homepage and start-here"
```

### Task J6: Aggiornamento finale di `CONTENT.md`

**Files:**
- Modifica: `CONTENT.md` (sezione "Modulo 4: Per studenti" → "Stato attuale"; sezione "Prossima sessione")

- [ ] **Step 1: Aggiornare "Stato attuale" del Modulo 4**

Sostituire con:

```markdown
**Stato attuale**: **8 su 8 pubblicate, modulo Per studenti
completo al 100%** ([data di chiusura, da inserire al momento]).
Tutte le lezioni live (IT + EN) con verifica dell'apprendimento
attiva (sezione `<LlmExercise variant="review">` prima di "Cosa
viene dopo", con prompt dedicato in
`public/skills/<locale>/review-<slug>.txt`); sidebar Modulo 4 con
tutte e 8 le lezioni attive, nessun placeholder disabilitato; card
"Per studenti" / "For students" in homepage e start-here attive,
puntano alla lezione 1.
```

- [ ] **Step 2: Aggiornare "Prossima sessione"**

Sostituire con:

```markdown
## Prossima sessione

**Revisioni pendenti**: nessuna. Modulo Fondamenti chiuso al 100%
il 2026-04-19. Modulo Uso quotidiano chiuso al 100% il
2026-04-23. Modulo Sul lavoro chiuso al 100% il 2026-04-25.
**Modulo Per studenti chiuso al 100% il [data].**

**Prossimo blocco di lavoro**: scelta fra Modulo 5 (*Per
docenti*), Modulo 6 (*Per chi vuole di più*), oppure pagine
trasversali ancora pendenti (FAQ, Cronologia). Decisioni da
prendere prima di iniziare un nuovo modulo:

- **Modulo 5 (Per docenti)**: taglio (generalista vs per
  disciplina), peso della parte "riconoscere l'uso dell'IA da
  parte degli studenti", relazione con il modulo 4 (riferimenti
  reciproci vs autonomia). Nove lezioni pianificate, tutte 🆕.
- **Modulo 6 (Per chi vuole di più)**: stack degli esempi (Node?
  Python? Entrambi?), profondità dei pattern (RAG: spiegazione
  concettuale o tutorial con codice?). Tredici lezioni pianificate,
  tutte 🆕.
- **FAQ** trasversale: privacy, costi, quale IA scegliere, cosa
  succede se l'IA sbaglia, AI Act in pillole. Pagina singola, non
  modulo.
```

- [ ] **Step 3: Commit**

```bash
git add CONTENT.md
git commit -m "Module 4 closure: update CONTENT.md to 8/8 published"
```

---

## Production order

Le otto lezioni vanno scritte nell'ordine pedagogico:

1. `study-a-new-topic` (Fase B)
2. `notes-from-lectures` (Fase C)
3. `revise-before-an-exam` (Fase D)
4. `write-a-thesis` (Fase E)
5. `sources-and-citations` (Fase F)
6. `translate-and-compare` (Fase G)
7. `when-ai-tricks-you` (Fase H)
8. `ethics-of-studying` (Fase I)

Motivi:
- L'ordine pedagogico è anche l'ordine in cui il modulo "ha senso" per il lettore, quindi pubblicare in quest'ordine permette di pubblicare incrementalmente senza che la sidebar mostri lezioni avanzate prima di quelle base.
- La lezione 1 va per prima perché contiene il **contratto del modulo** (l'apertura "non è il modulo del fammi i compiti"): è un'ancora che le altre lezioni richiamano.
- Le lezioni 4 e 5 (Tesi + Fonti) sono strettamente legate: scriverle in successione tiene coerenti gli esempi e i richiami incrociati.
- La lezione 8 (Etica) chiude e richiama tutte le altre: deve essere ultima.

Le Fasi A e J si eseguono prima della prima lezione e dopo l'ultima, rispettivamente. Le card homepage e start-here si attivano solo a modulo completo (Fase J): durante la scrittura del modulo restano `comingSoon: true`, per non promettere al lettore quello che ancora non c'è.

---

## Smoke test finale

Quando tutto il modulo è completo (post Fase J), eseguire un giro finale:

- [ ] `npm run build` pulito.
- [ ] Navigare `/it/for-students/` e `/en/for-students/`: tutte e 8 le lezioni in sidebar, cliccabili, senza badge "Presto".
- [ ] Ogni lezione carica correttamente con `<LessonSummary>`, `<LlmExercise variant="review">`, eventuali `<ChatDemo>`.
- [ ] Cross-link da `/it/everyday-use/learn-something-new/` (M2L5) verso `/it/for-students/study-a-new-topic/` (M4L1) funzionante.
- [ ] Cross-link inverso da `/it/for-students/sources-and-citations/` (M4L5) verso `/it/at-work/research-for-work/` (M3L6) funzionante.
- [ ] Pagefind indicizza le 8 nuove lezioni IT + 8 EN (verificabile cercando "tesi" / "thesis" nella search del sito).
- [ ] PWA: la build genera `dist/aiguide-bulk-manifest.json` con i nuovi `for-students/<slug>` per IT e EN, e i `public/skills/<locale>/review-<slug>.txt`. Verificare apertura di `dist/aiguide-bulk-manifest.json` e presenza di tutte le 16 lezioni + 16 review.

---

## Self-Review

**Spec coverage:** Lo spec definisce 8 lezioni con slug, livello, prerequisiti, disambiguazioni, esami proctored, apertura della lezione 1 con paragrafo "contratto del modulo", politiche d'istituto in lezione 8, ordine di scrittura uguale all'ordine pedagogico. Tutti questi punti sono coperti da almeno una task del piano:

- Slug e prerequisiti: presenti nel `Brief di lezione` di ogni Fase.
- Disambiguazioni dai moduli 1-3: già incorporate nei brief delle lezioni 1, 2, 5, 7.
- Esami proctored: callout esplicito nel brief della lezione 8.
- Apertura della lezione 1: paragrafo "contratto del modulo" è la prima sottosezione del brief di Fase B.
- Politiche d'istituto in lezione 8: callout nel brief della Fase I.
- Ordine di scrittura = ordine pedagogico: sezione "Production order" sopra.
- Disabilitati dalla sidebar: gestiti in Fase A (riordino + placeholder) e sbloccati in Task X9 di ogni fase.
- Card homepage/start-here: Fase J.

**Placeholder scan:** Nessun "TBD" tecnico nel piano. Le note "(data di chiusura, da inserire al momento)" e "(verificare URL al momento della scrittura)" sono **rinvio esplicito** a dati che si concretizzano in fase di esecuzione (data di chiusura del modulo, URL delle politiche che possono cambiare), non placeholder da chiarire ora.

**Type consistency:** Slug e nomi di file sono consistenti fra spec, sidebar, brief di lezione, e task di sblocco. Il prerequisito `learn-something-new` (lezioni 1 e 3) è scritto consistente. Il file `review-<slug>.txt` segue il pattern di Modulo 2 e 3.
