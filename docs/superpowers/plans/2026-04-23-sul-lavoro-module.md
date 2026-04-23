# Modulo 3 "Sul lavoro" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare live il Modulo 3 di AI-Guide ("Sul lavoro") nella struttura definita in `docs/superpowers/specs/2026-04-23-sul-lavoro-module-design.md`: 9 lezioni IT + 9 mirror EN, infrastruttura (sidebar, directory, homepage, start-here IT+EN), aggiornamento di `CONTENT.md`, traduzione EN in parallelo con l'IT (scelta del progetto dopo il Modulo 2).

**Architecture:** Un modulo di contenuto (Astro + Starlight + MDX), non un refactor di codice. Una fase A di scaffolding (una tantum: CONTENT.md + directory + consolidamento sidebar da 10 a 9 placeholder), nove fasi B-J di scrittura lezione (una per lezione, IT e EN insieme), una fase K di chiusura modulo (attivazione card homepage e start-here, IT e EN). Ogni lezione segue il workflow standard di AI-Guide: draft IT → `/analyze-lesson` → cura domande → `/integrate-questions` → esercizio di review in `public/skills/it/` → agent `style-checker` → commit IT → traduzione EN mirror → esercizio di review EN → `style-checker` EN → commit EN → sblocco placeholder in sidebar → aggiornamento CONTENT.md a ✅.

**Tech Stack:** Astro 6 + Starlight 0.38, MDX, TypeScript (per `astro.config.mjs` e `src/content.config.ts`). Nessuna nuova dipendenza.

---

## File Structure

**Scaffolding del modulo (Fase A)**
- Modifica `CONTENT.md` (root) — sostituire elenco provvisorio di 10 voci del Modulo 3 con la struttura validata a 9
- Crea `src/content/docs/it/at-work/.gitkeep` — placeholder per la directory IT
- Crea `src/content/docs/en/at-work/.gitkeep` — placeholder per la directory EN
- Modifica `astro.config.mjs` — consolidare i 10 placeholder del Modulo 3 a 9 (fondere "Emails that work" + "Difficult communications" in "Hard emails") e riordinare nella sequenza pedagogica del modulo

**Lezioni IT + EN (Fasi B-J, una per lezione)**
- Crea `src/content/docs/it/at-work/hard-emails.mdx` + `src/content/docs/en/at-work/hard-emails.mdx` (Fase B)
- Crea `src/content/docs/it/at-work/draft-professional-documents.mdx` + mirror EN (Fase C)
- Crea `src/content/docs/it/at-work/prepare-a-meeting.mdx` + mirror EN (Fase D)
- Crea `src/content/docs/it/at-work/slides-and-presentations.mdx` + mirror EN (Fase E)
- Crea `src/content/docs/it/at-work/data-and-tables.mdx` + mirror EN (Fase F)
- Crea `src/content/docs/it/at-work/research-for-work.mdx` + mirror EN (Fase G)
- Crea `src/content/docs/it/at-work/ai-as-thinking-partner.mdx` + mirror EN (Fase H)
- Crea `src/content/docs/it/at-work/reuse-context-with-projects.mdx` + mirror EN (Fase I)
- Crea `src/content/docs/it/at-work/company-data-and-privacy.mdx` + mirror EN (Fase J)

**Esercizi di review (una coppia IT/EN per lezione, in fase con la lezione)**
- Crea `public/skills/it/review-<slug>.txt` + `public/skills/en/review-<slug>.txt` per ognuna delle 9 lezioni

**File di analisi intermedi (uno per lezione, temporanei ma committati come traccia)**
- Crea `analysis/<slug>.questions.md` per ognuna delle 9 lezioni

**Sblocco placeholder in sidebar (un commit dedicato per lezione)**
- Modifica `astro.config.mjs` — sostituire la voce placeholder disabilitata della lezione con `{ slug: 'at-work/<slug>' }`. Pattern già stabilito con i commit "Unlock Module 2 lesson N in sidebar".

**Attivazione card homepage e start-here (Fase K)**
- Modifica `src/content/docs/it/index.mdx` — card "Al lavoro…": togliere `comingSoon: true`, aggiungere `href: '/it/at-work/hard-emails/'`
- Modifica `src/content/docs/en/index.mdx` — card equivalente EN: togliere `comingSoon: true`, aggiungere `href: '/en/at-work/hard-emails/'`
- Modifica `src/content/docs/it/start-here.mdx` — card equivalente: stesso pattern
- Modifica `src/content/docs/en/start-here.mdx` — card equivalente: stesso pattern

Ogni fase B-J termina con tre commit (IT, EN, sblocco sidebar) e un `npm run build` di verifica intermedia. La Fase A e la Fase K hanno un singolo commit ciascuna.

---

## Per-lesson workflow (riferimento)

Ogni lezione (Fasi B-J) segue la stessa sequenza a 13 passi, esplicitata fase per fase con i path specifici della lezione. Non è un template riutilizzabile a livello di tooling: è la sequenza da eseguire a mano per ciascuna lezione. Riprodurre `CONTENT.md` > "Workflow per scrivere una lezione" estendendolo con i passi EN e sblocco sidebar.

1. **CONTENT.md → `✍️`**: stato della lezione da `🆕` a `✍️` (questa fase, prima dei passi successivi).
2. **Bozza IT**: scrivere `src/content/docs/it/at-work/<slug>.mdx` rispettando la `voice-guide` (em dash vietati, lessico AI italiano vietato; vedi `.claude/skills/voice-guide/SKILL.md`).
3. **Genera domande del lettore**: `/analyze-lesson src/content/docs/it/at-work/<slug>.mdx` produce `analysis/<slug>.questions.md`. Rileggere le domande, scartare quelle che non convincono, aggiungere le proprie.
4. **Integra le domande**: `/integrate-questions src/content/docs/it/at-work/<slug>.mdx` aggiorna l'MDX con risposte inline, callout, esempi o FAQ, dopo conferma del diff.
5. **Esercizio di review IT**: scrivere `public/skills/it/review-<slug>.txt` (plain text, niente markdown) e aggiungere `<LlmExercise variant="review">` nell'MDX prima della card "Prossima lezione".
6. **QA IT con `style-checker`**: invocare l'agent sulla lezione. Applicare i fix.
7. **Commit IT**: `git add` dei file IT + analysis + review-IT, commit con messaggio `Module 3 lesson N: <titolo IT> + review exercise`.
8. **Traduzione EN mirror**: scrivere `src/content/docs/en/at-work/<slug>.mdx`. Frontmatter in inglese (`title`, `description`, `livello`, `prerequisiti`). Corpo tradotto fedelmente, con adattamenti culturali dove serve (es. esempi italiani su bolletta luce → esempi internazionali su utility bills generici). Cross-link interni aggiornati a `/en/...`.
9. **Esercizio di review EN**: scrivere `public/skills/en/review-<slug>.txt` come traduzione del corrispondente IT. `<LlmExercise variant="review">` nell'MDX EN punta allo stesso `file` del componente IT (il componente risolve il path per locale).
10. **QA EN con `style-checker`**: l'agent in inglese segnala em dash, AI buzzwords in inglese, e chiusure tipo "In conclusion". Applicare i fix.
11. **Commit EN**: `git add` dei file EN, commit con messaggio `Module 3 lesson N EN: <titolo EN> + review exercise`.
12. **Sblocco placeholder in sidebar**: modificare `astro.config.mjs` sostituendo la voce placeholder disabilitata della lezione con `{ slug: 'at-work/<slug>' }`. Commit dedicato: `Unlock Module 3 lesson N in sidebar`.
13. **CONTENT.md → `✅`**: aggiornare stato lezione, contatore "Stato attuale", e sezione "Prossima sessione". Build smoke, commit nel prossimo ciclo (oppure emendato se micro-fix, mai se sostanziale).

**Nota su `<Def>`**: la skill `/add-defs` è utile sui termini tecnici non già spiegati dal paragrafo immediato. Per le lezioni di questo modulo, i termini tecnici (Exec summary, KPI, OKR, scadenzario, NDA, ecc.) sono più aziendalese che "gergo IA". Invocare `/add-defs` solo se in lettura emergono termini potenzialmente oscuri al lettore target.

**Nota su `<ChatDemo>`**: Module 2 ha fatto un uso denso di `<ChatDemo>` (specialmente in `iterate-the-conversation` e `learn-something-new`). Per Modulo 3 valutare lezione per lezione: se l'esempio è un dialogo prompt/risposta, `<ChatDemo>` è il formato giusto; se è un pattern statico (scaletta di slide, tabella dati), usare code fence o tabella.

---

## Phase A — Module scaffolding

Una tantum. Prepara l'infrastruttura senza pubblicare nessuna lezione. Al termine di questa fase la sidebar del Modulo 3 mostra 9 placeholder (non più 10) ordinati nella sequenza pedagogica del modulo; la homepage IT ed EN e le pagine start-here restano invariate (le card `comingSoon: true` si attivano in Fase K, quando la prima lezione è pronta).

### Task A1: Aggiornare CONTENT.md con la struttura validata a 9 voci

**Files:**
- Modifica: `CONTENT.md` (sezione "Modulo 3: Sul lavoro", righe 256-282 circa; anche la sezione "Prossima sessione" va allineata)

- [ ] **Step 1: Sostituire l'elenco del Modulo 3**

Trovare la sezione `## Modulo 3: Sul lavoro (livello intermedio)` e sostituire il blocco delle 10 voci con:

```markdown
## Modulo 3: Sul lavoro (livello `intermedio`)

Target: knowledge worker non developer (project manager, marketing,
HR, consulenza, sales, didattica, design, comunicazione) che sanno già
usare l'IA per cose personali e vogliono portarla nel proprio lavoro.
Taglio trasversale per attività (non per professione). Spec di
modulo: `docs/superpowers/specs/2026-04-23-sul-lavoro-module-design.md`.

Struttura validata 2026-04-23. Nove lezioni, ordine pedagogico = ordine
di scrittura. Livello uniforme `intermedio`: il pubblico ci arriva
dopo Fondamenti + Uso quotidiano o con esperienza equivalente.

1. 🆕 **Email difficili** (`at-work/hard-emails`)
   Dire di no, negoziare, cliente irritato, feedback delicato. Taglio
   specifico "parola sbagliata costa caro". Assorbe le due voci
   provvisorie "Email che funzionano" e "Riformulare comunicazioni
   difficili".

2. 🆕 **Bozze di documenti professionali** (`at-work/draft-professional-documents`)
   Proposte, brief, report. Struttura (exec summary, audience, sezioni),
   non solo scrittura.

3. 🆕 **Preparare una riunione** (`at-work/prepare-a-meeting`)
   Ordine del giorno, brief di preparazione, riassunto, follow-up.

4. 🆕 **Slide e presentazioni** (`at-work/slides-and-presentations`)
   Contenuto, non design: scaletta, bullet asciugati, speaker notes.

5. 🆕 **Lavorare con dati e tabelle** (`at-work/data-and-tables`)
   CSV, formule Excel/Sheets, pulizia, piccole analisi. Privacy al
   centro.

6. 🆕 **Ricerca per il lavoro** (`at-work/research-for-work`)
   Sintesi multi-fonte per un deliverable.

7. 🆕 **L'IA come collega che ti aiuta a pensare** (`at-work/ai-as-thinking-partner`)
   Challenge, devil's advocate, brainstorming. Riconoscere "penso
   meglio" vs "mi faccio rassicurare".

8. 🆕 **Riusare contesto con i progetti** (`at-work/reuse-context-with-projects`)
   Claude Projects, ChatGPT Custom GPT, Gemini Gems.

9. 🆕 **Privacy e dati aziendali** (`at-work/company-data-and-privacy`)
   Cosa NON dare in pasto a un'IA pubblica. Piani Enterprise/Team.
   Ponte verso i moduli successivi.

**Stato attuale**: 0 su 9 pubblicate. Struttura definita, scrittura da
iniziare.
```

- [ ] **Step 2: Allineare la sezione "Prossima sessione"**

In fondo al file, sostituire la sezione `## Prossima sessione` con:

```markdown
## Prossima sessione

**Revisioni pendenti**: nessuna. Modulo Fondamenti chiuso al 100% il
2026-04-19. Modulo Uso quotidiano chiuso al 100% il 2026-04-23.

**Modulo 3 (Sul lavoro)**: struttura validata 2026-04-23 in
`docs/superpowers/specs/2026-04-23-sul-lavoro-module-design.md`.
Piano di implementazione in
`docs/superpowers/plans/2026-04-23-sul-lavoro-module.md`. Prossima
bozza: lezione 1, **Email difficili** (`at-work/hard-emails`).

**Sblocco placeholder in sidebar**: per ogni lezione del Modulo 3 che
atterra, sostituire la voce placeholder disabilitata in
`astro.config.mjs` con `{ slug: 'at-work/<slug>' }` in un commit
dedicato (pattern già stabilito con i commit "Unlock Module 2 lesson N
in sidebar").
```

- [ ] **Step 3: Verificare il diff**

Run: `git diff CONTENT.md`

Expected: le due sezioni sostituite; nessun'altra modifica ai Moduli 1, 2, 4, 5, 6 e alle sezioni "Pagine trasversali", "Traduzione", "Workflow per scrivere una lezione", "Audit moduli 3-6".

### Task A2: Creare le directory `at-work/`

**Files:**
- Crea: `src/content/docs/it/at-work/.gitkeep`
- Crea: `src/content/docs/en/at-work/.gitkeep`

- [ ] **Step 1: Creare le directory con placeholder**

```bash
mkdir -p src/content/docs/it/at-work src/content/docs/en/at-work
touch src/content/docs/it/at-work/.gitkeep
touch src/content/docs/en/at-work/.gitkeep
```

I `.gitkeep` vengono eliminati automaticamente dal commit della prima lezione in ciascuna lingua (Fase B), perché a quel punto la directory contiene già file `.mdx` reali.

### Task A3: Consolidare i placeholder del Modulo 3 in `astro.config.mjs`

**Files:**
- Modifica: `astro.config.mjs` (righe 81-158 circa, blocco `label: 'At work'`)

Il blocco attuale ha 10 voci. Serve:
1. Fondere "Emails that work" + "Difficult communications" in una sola voce **"Hard emails"** con titolo IT "Email difficili".
2. Riordinare le 9 voci rimanenti nella sequenza pedagogica dello spec (produrre → elaborare → pensare/scalare → custodire e chiudere).

- [ ] **Step 1: Sostituire il blocco `items` del Modulo 3**

Sostituire l'intero array `items` del blocco `label: 'At work'` con il seguente:

```javascript
items: [
  {
    label: 'Hard emails',
    translations: { it: 'Email difficili' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Draft professional documents',
    translations: { it: 'Bozze di documenti professionali' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Prepare a meeting',
    translations: { it: 'Preparare una riunione' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Slides and presentations',
    translations: { it: 'Slide e presentazioni' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Data and tables',
    translations: { it: 'Lavorare con dati e tabelle' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Research for work',
    translations: { it: 'Ricerca per il lavoro' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'AI as a thinking partner',
    translations: { it: "L'IA come collega che ti aiuta a pensare" },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Reuse context with projects',
    translations: { it: 'Riusare contesto con i progetti' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Company data and privacy',
    translations: { it: 'Privacy e dati aziendali' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
],
```

- [ ] **Step 2: Verificare il diff**

Run: `git diff astro.config.mjs`

Expected: solo il blocco `items` del Modulo 3 modificato. Conteggio voci: 10 → 9 (confermare con `git diff --stat astro.config.mjs` e ispezione visiva). Nessuna modifica ai blocchi di Start here, Fundamentals, Everyday use, Glossary, o ai Moduli 4, 5, 6.

### Task A4: Build smoke test + commit Fase A

- [ ] **Step 1: Eseguire la build**

Run: `npm run build`

Expected: build completa senza errori. Starlight accetta voci `link: '#'` disabilitate (già testato con la configurazione precedente a 10 placeholder).

- [ ] **Step 2: Commit della Fase A**

```bash
git add CONTENT.md astro.config.mjs src/content/docs/it/at-work/ src/content/docs/en/at-work/
git commit -m "Scaffold Module 3 (Sul lavoro): 9-lesson plan, consolidated sidebar, empty dirs"
```

---

## Phase B — Lezione 1: Email difficili (`hard-emails`)

**Slug**: `hard-emails` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`

### Brief di lezione

Apertura del modulo. La lezione non è "come scrivi un'email": è come gestire con l'IA le email **dove il costo di una parola sbagliata è alto**. Cliente irritato, collega che ha fatto un errore grave, rifiuto a un capo, feedback delicato a un pari. La distinzione editoriale cardine è "l'IA ti aiuta a pensare al tono, non scrive al posto tuo".

- Apertura (120-150 parole): le email facili l'IA le scrive già bene. Quelle difficili sono dove ti giochi relazioni, reputazione, o un budget. Qui l'IA cambia ruolo: da ghostwriter a consulente sul tono.
- **Tre tipi di email difficili** (400-500 parole):
  1. **Dire di no senza bruciare ponti**: rifiuto a una richiesta non urgente, a un cliente che chiede uno sconto, a un invito. L'IA ti propone versioni; tu scegli quella che suona come te (richiamo a *Scrivere meglio*).
  2. **Gestire un cliente/collega che ha sbagliato**: tono fermo senza punire. Esempio chiave: qualcuno ti ha mancato di rispetto in copia a 15 persone, devi rispondere pubblicamente senza escalation.
  3. **Dare feedback delicato**: collaboratrice il cui lavoro non è all'altezza, pari che ha creato un problema, capo che ti sta gestendo male. Focus sul dire il fatto senza giudicare la persona.
- **Il pattern in tre passi** (200-300 parole):
  1. **Racconta all'IA la situazione completa**: storia, relazione, posta in gioco.
  2. **Chiedi 2-3 versioni con registri diversi**: più diretta, più conciliante, più asciutta. Non una versione perfetta.
  3. **Tu scegli la base e la riscrivi**: l'ultima mano è sempre tua. Callout richiamo a *Scrivere meglio* pattern "bozza mia, critica dell'IA".
- **ChatDemo**: situazione concreta. Preferenza per un esempio interno (feedback delicato a un collaboratore che ha mancato una scadenza importante) o cliente (scontista insistente). Una `<ChatDemo>` con prompt + risposta strutturata (tre versioni).
- **Callout "tono per il tuo capo"** (~100 parole, `:::tip`): registro aziendale e distanza gerarchica. Chiarire che "stesso tono per tutti" non funziona; l'IA sa calibrare se glielo dici.
- **Cosa NON fare con email difficili** (150-200 parole): non delegare completamente (richiamo a *Cose da NON fare*), non mandare la prima versione (rileggi a voce alta), non incollare contenuto riservato o dati di terzi senza anonimizzare (richiamo a *Quello che condividi quando usi l'IA*).
- Transizione: "le email difficili sono un caso specifico di scrittura dove la posta è alta. Ora passiamo ai documenti che costruisci con più cura: proposte, brief, report".
- `<LlmExercise variant="review">`.
- Lunghezza target: 1000-1200 parole.

### Task B1: Aggiornare stato lezione a "in lavorazione" in CONTENT.md

- [ ] **Step 1: Cambiare `🆕` → `✍️` nella voce della lezione 1**

Nel Modulo 3 di `CONTENT.md`, cambiare:

```
1. 🆕 **Email difficili** (`at-work/hard-emails`) — ...
```

in:

```
1. ✍️ **Email difficili** (`at-work/hard-emails`) — ...
```

Questo step non ha commit proprio: è assorbito dal commit finale di Task B6 (IT).

### Task B2: Bozza della lezione IT `hard-emails.mdx`

**Files:**
- Crea: `src/content/docs/it/at-work/hard-emails.mdx`

- [ ] **Step 1: Leggere la voice-guide**

Leggere `.claude/skills/voice-guide/SKILL.md` integralmente. Ricordare i divieti duri: zero em dash, zero lessico AI italiano, zero passivi impersonali, zero chiusure scolastiche.

- [ ] **Step 2: Scrivere la bozza**

Creare il file con frontmatter:

```yaml
---
title: Email difficili
description: Dire di no, gestire un cliente irritato, dare feedback delicato. Dove la parola sbagliata costa caro.
livello: intermedio
prerequisiti: [ask-well, write-better]
---
```

Import da calcolare (quattro livelli di risalita da `src/content/docs/it/at-work/hard-emails.mdx`):

```mdx
import ChatDemo from '../../../../components/ChatDemo.astro';
import LlmExercise from '../../../../components/LlmExercise.astro';
```

Struttura del corpo secondo il brief di lezione sopra. Il contenuto testuale è creativo e si produce in questo step.

- [ ] **Step 3: Build smoke della bozza**

Run: `npm run build`

Expected: build pulita. Se Starlight si lamenta di frontmatter non valido (`livello` o `prerequisiti`), fixare e ribuildar.

### Task B3: Generare domande del lettore con `/analyze-lesson`

**Files:**
- Crea: `analysis/hard-emails.questions.md`

- [ ] **Step 1: Eseguire `/analyze-lesson`**

Skill: `/analyze-lesson src/content/docs/it/at-work/hard-emails.mdx`

Il lettore simulato è `intermedio`: aspettarsi domande sullo stile ("ma se copio la versione dell'IA parola per parola?"), sulla situazione ("e se la persona è un amico stretto, non un collega?"), sui limiti ("quando NON usare l'IA per queste email?").

- [ ] **Step 2: Curare le domande**

Aprire `analysis/hard-emails.questions.md` e: scartare le domande già coperte nel paragrafo immediato; aggiungere le proprie; raggruppare le "gemelle". Il file curato resta committato come traccia.

### Task B4: Integrare le domande con `/integrate-questions`

- [ ] **Step 1: Eseguire `/integrate-questions`**

Skill: `/integrate-questions src/content/docs/it/at-work/hard-emails.mdx`

La skill propone un diff. Rivederlo e confermare.

- [ ] **Step 2: Verificare il risultato**

Run: `npm run build` e `npm run dev`. Aprire `http://localhost:4321/it/at-work/hard-emails/` e verificare che l'andamento della lezione non si sia rotto.

### Task B5: Creare l'esercizio di review IT

**Files:**
- Crea: `public/skills/it/review-hard-emails.txt`

- [ ] **Step 1: Scrivere il prompt di review**

File plain text. Quattro domande progressive che fanno ripetere al lettore: i tre tipi di email difficili, il pattern in tre passi, cosa non delegare, e un'applicazione concreta (propone una situazione, il lettore imposta la richiesta). Confrontarsi con `public/skills/it/review-write-better.txt` per stile.

Struttura suggerita (plain text):

```
Ciao! Proponiamo di fissare insieme quello che hai letto sulla pagina "Email difficili" del manuale AI-Guide. Ti farò quattro domande brevi, una alla volta. Aspetta la mia domanda prima di rispondere. A ogni tua risposta ti darò un feedback onesto (ti dico se una parte è imprecisa) e passiamo alla prossima.

Domanda 1: quali sono i tre tipi di email difficili che abbiamo visto e perché le trattiamo insieme?

Domanda 2: descrivi il pattern in tre passi per usare l'IA su un'email difficile. Cosa fai tu, cosa chiede l'IA?

Domanda 3: perché NON incollare testo con dati personali di terzi o informazioni riservate? Cosa faresti prima di incollare?

Domanda 4: pensa a un'email difficile che potresti dover scrivere tu nelle prossime due settimane. Prova a raccontarmela come la racconteresti all'IA, seguendo il pattern. Ti aiuto a migliorare la richiesta.

Alla fine del giro: ringrazia. Se la persona vuole approfondire un punto che hai identificato come debole, offri un mini approfondimento (max 80 parole).
```

- [ ] **Step 2: Aggiungere `<LlmExercise variant="review">` all'MDX**

In `hard-emails.mdx`, prima della transizione "Prossima lezione" (Starlight Pagination la genera automaticamente):

```mdx
<LlmExercise
  variant="review"
  title="Fissa le idee con quattro domande"
  file="review-hard-emails.txt"
  duration="5-7 min"
  description="Incolla il testo nella tua IA: ti farà quattro domande progressive per vedere cosa resta."
/>
```

### Task B6: QA con agent `style-checker` e commit IT

- [ ] **Step 1: Lanciare l'agent**

Agent: `style-checker` sulla pagina `src/content/docs/it/at-work/hard-emails.mdx`.

- [ ] **Step 2: Applicare i fix**

Rivedere ogni segnalazione e applicarla. Se l'agent segnala qualcosa di legittimo nel contesto, documentare la scelta nel commit.

- [ ] **Step 3: Commit IT**

```bash
git add CONTENT.md src/content/docs/it/at-work/hard-emails.mdx public/skills/it/review-hard-emails.txt analysis/hard-emails.questions.md
git commit -m "Module 3 lesson 1: Email difficili (hard-emails) + review exercise"
```

### Task B7: Traduzione EN mirror

**Files:**
- Crea: `src/content/docs/en/at-work/hard-emails.mdx`
- Crea: `public/skills/en/review-hard-emails.txt`

- [ ] **Step 1: Scrivere il mirror EN**

Creare il file con frontmatter EN:

```yaml
---
title: Hard emails
description: Saying no, handling an irritated client, giving delicate feedback. Where the wrong word costs.
livello: intermedio
prerequisiti: [ask-well, write-better]
---
```

(Nota: il campo `livello` resta in italiano nello schema — è un code identifier, non user-facing. Idem per i valori `principiante | intermedio | avanzato`. Vedi `src/content.config.ts`.)

Tradurre fedelmente il corpo dell'MDX IT risultante post-integrazione. Adattamenti culturali dove servono: esempi italiani (scontista, bolletta) → equivalenti internazionali se l'esempio specifico non funziona in EN. Cross-link interni tradotti: `/it/fundamentals/...` → `/en/fundamentals/...`, `/it/everyday-use/...` → `/en/everyday-use/...`.

- [ ] **Step 2: Scrivere `public/skills/en/review-hard-emails.txt`**

Traduzione fedele dell'IT. Tono: l'LLM si rivolge al lettore in inglese naturale, non burocratico.

- [ ] **Step 3: Aggiungere `<LlmExercise variant="review">` al mirror EN**

Stesso markup dell'IT, stesso `file="review-hard-emails.txt"` (il componente risolve il path per locale, vedi `src/components/LlmExercise.astro`).

### Task B8: QA EN con `style-checker` e commit EN

- [ ] **Step 1: Lanciare l'agent in EN**

Agent: `style-checker` sulla pagina `src/content/docs/en/at-work/hard-emails.mdx`. L'agent segnala em dash, buzzword in inglese (`leverage`, `synergy`, `cutting-edge`, `paradigm`), chiusure tipo "In conclusion", passivi impersonali.

- [ ] **Step 2: Applicare i fix**

- [ ] **Step 3: Build smoke**

Run: `npm run build`

Expected: build pulita, pagina `/en/at-work/hard-emails/` generata.

- [ ] **Step 4: Commit EN**

```bash
git add src/content/docs/en/at-work/hard-emails.mdx public/skills/en/review-hard-emails.txt
git commit -m "Module 3 lesson 1 EN: Hard emails + review exercise"
```

### Task B9: Sbloccare il placeholder in sidebar

**Files:**
- Modifica: `astro.config.mjs` (voce 1 del blocco `label: 'At work'`)

- [ ] **Step 1: Sostituire la voce placeholder con il slug reale**

Sostituire:

```javascript
{
  label: 'Hard emails',
  translations: { it: 'Email difficili' },
  link: '#',
  badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
  attrs: { 'aria-disabled': 'true', tabindex: -1 },
},
```

con:

```javascript
{ slug: 'at-work/hard-emails' },
```

- [ ] **Step 2: Build smoke**

Run: `npm run build`

Expected: build pulita, sidebar mostra "Email difficili" come voce attiva (niente badge "Presto").

- [ ] **Step 3: Commit dello sblocco**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 1 in sidebar"
```

### Task B10: CONTENT.md → `✅` e smoke test finale

- [ ] **Step 1: Aggiornare lo stato in CONTENT.md**

Nel Modulo 3:
- Voce 1: `✍️` → `✅`.
- "Stato attuale": da `0 su 9 pubblicate` a `1 su 9 pubblicate`.
- Sezione "Prossima sessione": prossima bozza → lezione 2 (`draft-professional-documents`).

- [ ] **Step 2: Dev server smoke test**

Run: `npm run dev`

Aprire `http://localhost:4321/it/at-work/hard-emails/` e verificare:
- Titolo, tempo di lettura, frontmatter OK.
- `<ChatDemo>` parte in viewport.
- `<LlmExercise variant="review">` copia il prompt dal `.txt`.
- Sidebar IT mostra "Sul lavoro" aperto con "Email difficili" attiva, le altre 8 voci come placeholder disabilitati.
- Aprire `/en/at-work/hard-emails/` e ripetere i controlli in EN.

- [ ] **Step 3: Commit del CONTENT.md update**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 1 published"
```

---

## Phase C — Lezione 2: Bozze di documenti professionali (`draft-professional-documents`)

**Slug**: `draft-professional-documents` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`

### Brief di lezione

Proposte, brief, report. Il taglio della lezione è la **struttura prima del testo**: l'IA come prima bozza strutturata (exec summary, sections, appendice), non come ghostwriter che scrive tutto. Distinzione dalla lezione 1 (email difficili): lì era tono di un messaggio corto; qui è architettura di un documento lungo.

- Apertura (100-150 parole): la pagina bianca del documento professionale è peggio di quella dell'email. L'IA non scrive il documento per te, ma ti risolve l'80% del problema "da dove inizio".
- **Tre documenti canonici** (400-500 parole):
  1. **Proposta commerciale o progettuale**: sezioni standard (problema, soluzione, approccio, timeline, costi, team). L'IA propone un outline che tu adatti al contesto.
  2. **Brief interno**: per un collega che deve continuare il lavoro, per un team che riceve un handoff, per un capo che decide. Focus sulle informazioni essenziali, non la narrazione.
  3. **Report o revisione**: update di stato, analisi post-mortem, review trimestrale. Struttura: dati → interpretazione → next steps.
- **Il pattern "outline + riempimento"** (200-300 parole): prima l'IA propone una scaletta, tu la critichi (cambi sezioni, aggiungi vincoli di lunghezza, indichi pubblico); poi sezione per sezione l'IA scrive una prima bozza che tu sistemi. Non "IA scrive tutto, tu correggi": è più lento, perché rileggi 2000 parole e ne cambi 800.
- **Calibrare su pubblico e audience** (~150 parole): "questo documento va al CEO" vs "a un cliente tecnico" vs "al team di nuovi assunti". L'IA cambia linguaggio e livello di dettaglio se glielo dici.
- **Un esempio concreto**: un `<ChatDemo>` o un code fence con una scaletta di proposta commerciale (prima versione vs versione dopo che il lettore l'ha criticata). Non serve il testo completo del documento.
- **Cosa NON delegare** (150 parole): strategia (il pensiero è tuo), dati specifici (l'IA non sa i tuoi numeri), decisioni contestuali (cosa scegliere tra A e B). Richiamo a *Cose da NON fare* sul non delegare la decisione.
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task C1-C10: Workflow standard

Ripetere i 13 passi del workflow (vedi "Per-lesson workflow") con i path specifici di questa lezione.

- [ ] **Step C1: CONTENT.md lezione 2 `🆕` → `✍️`.**
- [ ] **Step C2: Scrivere `src/content/docs/it/at-work/draft-professional-documents.mdx`**. Frontmatter con `livello: intermedio` e `prerequisiti: [ask-well, write-better]`. Import `ChatDemo` e `LlmExercise`. Voice-guide.
- [ ] **Step C3: `/analyze-lesson src/content/docs/it/at-work/draft-professional-documents.mdx`**. Curare `analysis/draft-professional-documents.questions.md`.
- [ ] **Step C4: `/integrate-questions src/content/docs/it/at-work/draft-professional-documents.mdx`**.
- [ ] **Step C5: Scrivere `public/skills/it/review-draft-professional-documents.txt`** (quattro domande: tre documenti canonici, pattern "outline + riempimento", come calibrare su pubblico, cosa NON delegare). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step C6: Agent `style-checker` sulla lezione IT. Applicare fix. Commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/draft-professional-documents.mdx public/skills/it/review-draft-professional-documents.txt analysis/draft-professional-documents.questions.md
git commit -m "Module 3 lesson 2: Bozze di documenti professionali (draft-professional-documents) + review exercise"
```

- [ ] **Step C7: Tradurre `src/content/docs/en/at-work/draft-professional-documents.mdx`** (titolo EN: "Drafting professional documents"). Scrivere `public/skills/en/review-draft-professional-documents.txt` (traduzione fedele).
- [ ] **Step C8: `style-checker` EN. Applicare fix. Build smoke. Commit EN:**

```bash
git add src/content/docs/en/at-work/draft-professional-documents.mdx public/skills/en/review-draft-professional-documents.txt
git commit -m "Module 3 lesson 2 EN: Drafting professional documents + review exercise"
```

- [ ] **Step C9: Sblocco placeholder in sidebar.** In `astro.config.mjs`, sostituire la voce placeholder della lezione 2 con `{ slug: 'at-work/draft-professional-documents' }`. Build smoke. Commit:

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 2 in sidebar"
```

- [ ] **Step C10: CONTENT.md `✍️` → `✅` (Stato: 2 su 9). Aggiornare "Prossima sessione" → lezione 3. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 2 published"
```

---

## Phase D — Lezione 3: Preparare una riunione (`prepare-a-meeting`)

**Slug**: `prepare-a-meeting` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `iterate-the-conversation`

### Brief di lezione

Ciclo pre/durante/post: l'IA non è in riunione con te, ma prepara e sintetizza. Il taglio è "la riunione è il momento umano; tutto quello che viene prima e dopo può essere più veloce".

- Apertura (100-150 parole): una riunione mal preparata ruba 30 minuti a 8 persone = 4 ore di lavoro aziendale. Preparare bene con l'IA è 10 minuti. Ritorno alto.
- **Prima della riunione** (300-400 parole):
  - **Ordine del giorno strutturato**: obiettivo, punti, tempo per punto, decisione attesa.
  - **Brief di preparazione per i partecipanti**: cosa leggere prima, cosa portare, cosa aspettarsi.
  - **Anticipare obiezioni**: "sto presentando X al team: quali domande è probabile che mi facciano?". L'IA come devil's advocate (anticipa il pattern di lezione 7, *thinking partner*, ma qui applicato a un caso specifico).
- **Durante** (100-150 parole): nota breve. L'IA non è lì. Se registri (con consenso), sì che serve in post. Alternativa: prendere appunti a mano o con app trascrizione.
- **Dopo la riunione** (300-400 parole):
  - **Riassunto azionabile**: "da questa trascrizione/note, estrai decisioni prese, action item con owner e scadenza, domande aperte". Non "riassumi la riunione" generico.
  - **Email di follow-up**: prima bozza da integrare con dettagli personali.
  - **Aggiornamento stakeholder non presenti**: "per chi non era in call, 4-5 bullet di cosa è successo e cosa cambia".
- **Privacy** (100 parole, callout): trascrizioni di riunioni contengono dati di persone che non hanno consentito all'IA. Richiamo a *Quello che condividi quando usi l'IA*. Anonimizzare prima di incollare se la meeting riguarda temi sensibili (HR, clienti, compliance).
- **ChatDemo**: prompt "da questa trascrizione estrai decisioni, action item, domande aperte" su un esempio breve (5-6 righe di trascrizione), risposta strutturata in tre blocchi.
- Transizione: "una riunione produce spesso slide o report. Nelle prossime lezioni, come l'IA aiuta con quelli".
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task D1-D10: Workflow standard

- [ ] **Step D1: CONTENT.md lezione 3 `🆕` → `✍️`.**
- [ ] **Step D2: Scrivere `src/content/docs/it/at-work/prepare-a-meeting.mdx`**. Frontmatter: `livello: intermedio`, `prerequisiti: [ask-well, iterate-the-conversation]`. Import `ChatDemo` e `LlmExercise`. La sezione "Privacy" cross-linka *Quello che condividi quando usi l'IA* senza dichiararla prerequisito.
- [ ] **Step D3: `/analyze-lesson`, curare `analysis/prepare-a-meeting.questions.md`.**
- [ ] **Step D4: `/integrate-questions`.**
- [ ] **Step D5: `public/skills/it/review-prepare-a-meeting.txt`** (quattro domande: prima/durante/dopo, anticipare obiezioni, riassunto azionabile vs "riassumi", privacy delle trascrizioni). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step D6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/prepare-a-meeting.mdx public/skills/it/review-prepare-a-meeting.txt analysis/prepare-a-meeting.questions.md
git commit -m "Module 3 lesson 3: Preparare una riunione (prepare-a-meeting) + review exercise"
```

- [ ] **Step D7: Tradurre `src/content/docs/en/at-work/prepare-a-meeting.mdx`** (titolo EN: "Preparing a meeting"). Scrivere `public/skills/en/review-prepare-a-meeting.txt`.
- [ ] **Step D8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/prepare-a-meeting.mdx public/skills/en/review-prepare-a-meeting.txt
git commit -m "Module 3 lesson 3 EN: Preparing a meeting + review exercise"
```

- [ ] **Step D9: Sblocco placeholder in sidebar.** In `astro.config.mjs`, sostituire la voce placeholder della lezione 3 con `{ slug: 'at-work/prepare-a-meeting' }`. Build smoke. Commit:

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 3 in sidebar"
```

- [ ] **Step D10: CONTENT.md `✅` (3 su 9). Aggiornare "Prossima sessione" → lezione 4. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 3 published"
```

---

## Phase E — Lezione 4: Slide e presentazioni (`slides-and-presentations`)

**Slug**: `slides-and-presentations` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`

### Brief di lezione

Contenuto, non design. L'IA aiuta sulla scaletta, sui bullet asciugati, sulle speaker notes — non sui colori, i font, i template. Pitfall dominante: l'IA di default produce slide piene di testo, che è l'opposto di come si presenta bene.

- Apertura (100-150 parole): una buona presentazione non è un documento proiettato. L'IA di default scrive le slide come se fossero paragrafi. Con l'istruzione giusta diventa un aiuto prezioso; senza, produce slide piene di parole che nessuno legge.
- **Dal documento alla scaletta** (300-400 parole): se hai un report da presentare, non incollarlo nelle slide. Chiedi: "estrai dal testo il filo narrativo in 10 slide, una idea per slide, massimo 30 parole a slide". Istruzione rigida, risultato usabile.
- **Bullet asciugati** (200-300 parole): "riscrivi queste frasi come 4-6 bullet di massimo 10 parole ciascuno, senza verbi alla terza persona". L'IA tende all'inflazione verbale; tu chiedi il taglio.
- **Speaker notes** (200-300 parole): le parole che dirai mentre la slide è proiettata. L'IA scrive un drafting di speaker notes dato il contenuto della slide. Lo usi per prepararti, non per leggerlo.
- **Un esempio**: una slide "Risultati Q2" con tre bullet generati male (tutti verbi attivi, lunghi) e tre bullet generati bene (5-8 parole, sintetici). Mostrato come due code fence o una tabella di confronto.
- **Cosa NON chiedere** (100-150 parole): design grafico, scelta colori, animazioni. L'IA ne parla, ma non è brava e non ha il tuo template. Per il design, il tool dedicato (PowerPoint, Keynote, Google Slides) o un designer.
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task E1-E10: Workflow standard

- [ ] **Step E1: CONTENT.md lezione 4 `🆕` → `✍️`.**
- [ ] **Step E2: Scrivere `src/content/docs/it/at-work/slides-and-presentations.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [ask-well, write-better]`.
- [ ] **Step E3: `/analyze-lesson`, curare.**
- [ ] **Step E4: `/integrate-questions`.**
- [ ] **Step E5: `public/skills/it/review-slides-and-presentations.txt`** (quattro domande: dal documento alla scaletta, pattern "30 parole a slide", speaker notes, cosa NON chiedere). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step E6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/slides-and-presentations.mdx public/skills/it/review-slides-and-presentations.txt analysis/slides-and-presentations.questions.md
git commit -m "Module 3 lesson 4: Slide e presentazioni (slides-and-presentations) + review exercise"
```

- [ ] **Step E7: Tradurre `src/content/docs/en/at-work/slides-and-presentations.mdx`** (titolo EN: "Slides and presentations"). `public/skills/en/review-slides-and-presentations.txt`.
- [ ] **Step E8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/slides-and-presentations.mdx public/skills/en/review-slides-and-presentations.txt
git commit -m "Module 3 lesson 4 EN: Slides and presentations + review exercise"
```

- [ ] **Step E9: Sblocco placeholder:**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 4 in sidebar"
```

- [ ] **Step E10: CONTENT.md `✅` (4 su 9). Aggiornare "Prossima sessione" → lezione 5. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 4 published"
```

---

## Phase F — Lezione 5: Lavorare con dati e tabelle (`data-and-tables`)

**Slug**: `data-and-tables` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `images-and-files`

### Brief di lezione

CSV, formule Excel/Sheets, pulizia dati, piccole analisi. Lezione "tecnica" del modulo ma senza pretesa di trasformare il lettore in programmatore. Privacy centrale: i dati aziendali finiscono in chat con un provider esterno.

- Apertura (100-150 parole): una tabella in Excel con colonne sbagliate, dati sporchi, formule che non tornano. Senza IA ci metti un'ora; con l'IA, 10 minuti. Ma attenzione a cosa carichi, da chi, come.
- **Casi d'uso canonici** (400-500 parole):
  1. **Pulizia dati**: nomi scritti in modo incoerente ("Rossi M.", "M. Rossi", "rossi m"), date in formati misti, duplicati. L'IA suggerisce formule o fa il lavoro su un estratto incollato.
  2. **Formule che non sai a memoria**: "come conto quante volte compare un valore in una colonna?", "come sommo solo le righe di gennaio?". L'IA dà la formula per Excel o Google Sheets con spiegazione breve.
  3. **Piccole analisi**: "su questi 50 ordini, qual è il valore medio per cliente? Quanti clienti spendono sopra la media?". L'IA fa il conto e spiega. Verifica a campione.
- **Privacy e dati aziendali** (200-300 parole): un CSV con nomi clienti, importi, indirizzi è un documento aziendale. Prima di caricarlo in ChatGPT o Claude pubblico: anonimizzare (sostituire con ID), estrarre solo le colonne necessarie, chiedere al reparto IT/legale se esiste una policy. Richiamo esplicito a *Privacy e dati aziendali* (lezione 9) + cross-link a *Foto, immagini e file* per la parte upload.
- **Callout "IA vs BI/gestionale"** (~100 parole): per l'analisi ricorrente (dashboard mensile, reporting trimestrale) usa il tool dedicato. L'IA è per l'ad-hoc, il "non ho tempo per Power BI su questa sola cosa".
- **ChatDemo o code fence**: un esempio di pulizia dati. CSV di 5 righe con nomi incoerenti → prompt "uniforma i nomi nel formato Nome Cognome" → output pulito.
- **Cosa NON fare** (150-200 parole): non fidarsi dei numeri senza verifica (richiamo a *Quando fidarsi e quando no*), non caricare dataset interi di dati sensibili, non usare l'IA come sostituto di un analista per decisioni business importanti (richiamo a *Cose da NON fare*).
- `<LlmExercise variant="review">`.
- Lunghezza: 1100-1300 parole.

### Task F1-F10: Workflow standard

- [ ] **Step F1: CONTENT.md lezione 5 `🆕` → `✍️`.**
- [ ] **Step F2: Scrivere `src/content/docs/it/at-work/data-and-tables.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [ask-well, images-and-files]`.
- [ ] **Step F3: `/analyze-lesson`, curare. Il lettore intermedio probabilmente chiede "ma le mie formule l'IA le interpreta giuste per il mio locale (it-IT, virgole vs punti)?". Preparare.**
- [ ] **Step F4: `/integrate-questions`.**
- [ ] **Step F5: `public/skills/it/review-data-and-tables.txt`** (quattro domande: tre casi d'uso, privacy prima di caricare, IA vs BI, cosa non delegare). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step F6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/data-and-tables.mdx public/skills/it/review-data-and-tables.txt analysis/data-and-tables.questions.md
git commit -m "Module 3 lesson 5: Lavorare con dati e tabelle (data-and-tables) + review exercise"
```

- [ ] **Step F7: Tradurre `src/content/docs/en/at-work/data-and-tables.mdx`** (titolo EN: "Working with data and tables"). `public/skills/en/review-data-and-tables.txt`.
- [ ] **Step F8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/data-and-tables.mdx public/skills/en/review-data-and-tables.txt
git commit -m "Module 3 lesson 5 EN: Working with data and tables + review exercise"
```

- [ ] **Step F9: Sblocco placeholder:**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 5 in sidebar"
```

- [ ] **Step F10: CONTENT.md `✅` (5 su 9). Aggiornare "Prossima sessione" → lezione 6. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 5 published"
```

---

## Phase G — Lezione 6: Ricerca per il lavoro (`research-for-work`)

**Slug**: `research-for-work` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `when-to-trust-it`, `summarize-a-long-document`

### Brief di lezione

Sintesi multi-fonte per un deliverable professionale. Differenza dalla lezione Modulo 2 *Imparare un argomento nuovo* (lì impari per te stesso, il ritorno è la tua comprensione) e da *Riassumere un documento lungo* (lì la fonte è una sola). Qui: più fonti + obiettivo d'uso ("devo produrre un brief di 2 pagine per il team entro venerdì").

- Apertura (100-150 parole): la ricerca di lavoro non è capire un argomento per cultura tua. È arrivare a una sintesi che ti serve per un deliverable. L'IA accelera, ma è il punto dove allucina di più, e in contesto professionale le invenzioni costano.
- **Il pattern a tre fasi** (400-500 parole):
  1. **Perimetro**: "cosa sto cercando esattamente? per chi? entro quando? in che forma?". Senza questo, l'IA dà tutto e niente.
  2. **Raccolta orientata**: chiedi all'IA di proporti **tipi di fonte** e **keyword** per cercare tu. Non di darti fonti direttamente (allucina URL e citazioni).
  3. **Sintesi con citazioni**: hai raccolto 5-10 fonti, le incolli (o carichi), chiedi una sintesi con citazioni esatte del tipo "da [fonte X]: frase esatta". L'IA non inventa citazioni se le chiedi così.
- **Cross-checking e allucinazioni** (300-400 parole): l'IA inventa citazioni, studi, statistiche. In ricerca professionale è catastrofico. Tre regole:
  1. **URL e link = verificali sempre**.
  2. **Numeri precisi = vai alla fonte**.
  3. **Citazioni con virgolette = cerca la frase letterale nel documento originale**.
  Richiamo esplicito a *Quando fidarsi e quando no*.
- **Più fonti insieme** (200-300 parole): "ho questi 3 report, dimmi cosa hanno in comune e dove divergono". Caso in cui l'IA è davvero forte. Accuratezza: controllare che non stia inventando una fonte che non le hai dato.
- **Cosa NON delegare** (150-200 parole): la domanda di ricerca (la fai tu sapendo cosa ti serve), la selezione delle fonti (l'IA non sa chi è autorevole nel tuo settore), la conclusione (se il brief dice "l'azienda dovrebbe fare X", quella è tu). Richiamo a *Cose da NON fare*.
- `<LlmExercise variant="review">`.
- Lunghezza: 1100-1300 parole.

### Task G1-G10: Workflow standard

- [ ] **Step G1: CONTENT.md lezione 6 `🆕` → `✍️`.**
- [ ] **Step G2: Scrivere `src/content/docs/it/at-work/research-for-work.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [ask-well, when-to-trust-it, summarize-a-long-document]`.
- [ ] **Step G3: `/analyze-lesson`, curare.**
- [ ] **Step G4: `/integrate-questions`.**
- [ ] **Step G5: `public/skills/it/review-research-for-work.txt`** (quattro domande: pattern a tre fasi, tre regole per cross-checking, più fonti insieme, cosa NON delegare). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step G6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/research-for-work.mdx public/skills/it/review-research-for-work.txt analysis/research-for-work.questions.md
git commit -m "Module 3 lesson 6: Ricerca per il lavoro (research-for-work) + review exercise"
```

- [ ] **Step G7: Tradurre `src/content/docs/en/at-work/research-for-work.mdx`** (titolo EN: "Research for work"). `public/skills/en/review-research-for-work.txt`.
- [ ] **Step G8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/research-for-work.mdx public/skills/en/review-research-for-work.txt
git commit -m "Module 3 lesson 6 EN: Research for work + review exercise"
```

- [ ] **Step G9: Sblocco placeholder:**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 6 in sidebar"
```

- [ ] **Step G10: CONTENT.md `✅` (6 su 9). Aggiornare "Prossima sessione" → lezione 7. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 6 published"
```

---

## Phase H — Lezione 7: L'IA come collega che ti aiuta a pensare (`ai-as-thinking-partner`)

**Slug**: `ai-as-thinking-partner` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `when-to-trust-it`

### Brief di lezione

Uso meta dell'IA. Il taglio didattico cardine è distinguere "la uso per pensare meglio" da "la uso per farmi rassicurare". Lezione più concettuale del modulo; richiede un lettore che abbia già confidenza con l'iterazione (coperta in Modulo 2).

- Apertura (120-150 parole): usare l'IA come collega che non si stanca, non giudica, ha letto molto. Molto utile. Anche pericoloso: un collega che ti dà sempre ragione non è un collega, è uno specchio.
- **I tre pattern del buon thinking partner** (400-500 parole):
  1. **Devil's advocate**: "sto pensando di fare X. Dammi i tre argomenti più forti contro". Obbliga a confrontarsi con l'opposizione prima di agire.
  2. **Stress test di un'idea**: "ho questa proposta. Che cosa potrebbe andare storto? Chi si potrebbe sentire minacciato? Quali assunzioni sto facendo senza dirle?".
  3. **Riformulazione del problema**: "sto lavorando su X perché vogliamo ottenere Y. C'è un modo diverso di definire il problema che renderebbe la soluzione ovvia?". Aumenta il tasso di intuizioni vs soluzioni forzate.
- **Quando stai cercando rassicurazione (male)** (300-400 parole): sintomo: stai facendo la stessa domanda riformulata finché l'IA non dice quello che volevi sentire. L'IA, di default, è accondiscendente. Con istruzione "mostrami dove sto sbagliando", meno. Ma il bias di conferma è tuo, non dell'IA. Richiamo a *Quando fidarsi e quando no*: l'IA convincente non è l'IA giusta.
- **Quando stai usando l'IA per non pensare (male)** (150-200 parole): chiedere una decisione invece di chiedere aiuto a pensare a una decisione. Richiamo a *Cose da NON fare*.
- **ChatDemo**: un prompt "sto per proporre X al team. Fai il devil's advocate" con risposta strutturata. Breve, mostra il pattern, non è una tabella completa.
- **Limite di fondo** (100-150 parole): un thinking partner umano ha il contesto (il team, la storia, la cultura), sa leggere la stanza, può dirti "ma tu ci credi davvero?". L'IA no. Usa l'IA per ampliare la superficie, non per chiudere la decisione.
- `<LlmExercise variant="review">`.
- Lunghezza: 1000-1200 parole.

### Task H1-H10: Workflow standard

- [ ] **Step H1: CONTENT.md lezione 7 `🆕` → `✍️`.**
- [ ] **Step H2: Scrivere `src/content/docs/it/at-work/ai-as-thinking-partner.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [ask-well, when-to-trust-it]`.
- [ ] **Step H3: `/analyze-lesson`. Il lettore intermedio probabilmente chiede "come distinguo in tempo reale se sto cercando feedback o rassicurazione?". Preparare.**
- [ ] **Step H4: `/integrate-questions`.**
- [ ] **Step H5: `public/skills/it/review-ai-as-thinking-partner.txt`** (quattro domande: tre pattern, segnale "sto cercando rassicurazione", il limite di fondo, uso meta di un prompt devil's advocate su una decisione reale). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step H6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/ai-as-thinking-partner.mdx public/skills/it/review-ai-as-thinking-partner.txt analysis/ai-as-thinking-partner.questions.md
git commit -m "Module 3 lesson 7: L'IA come collega che ti aiuta a pensare (ai-as-thinking-partner) + review exercise"
```

- [ ] **Step H7: Tradurre `src/content/docs/en/at-work/ai-as-thinking-partner.mdx`** (titolo EN: "AI as a thinking partner"). `public/skills/en/review-ai-as-thinking-partner.txt`.
- [ ] **Step H8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/ai-as-thinking-partner.mdx public/skills/en/review-ai-as-thinking-partner.txt
git commit -m "Module 3 lesson 7 EN: AI as a thinking partner + review exercise"
```

- [ ] **Step H9: Sblocco placeholder:**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 7 in sidebar"
```

- [ ] **Step H10: CONTENT.md `✅` (7 su 9). Aggiornare "Prossima sessione" → lezione 8. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 7 published"
```

---

## Phase I — Lezione 8: Riusare contesto con i progetti (`reuse-context-with-projects`)

**Slug**: `reuse-context-with-projects` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `iterate-the-conversation`

### Brief di lezione

Claude Projects, ChatGPT Custom GPT, Gemini Gems. Stesso pattern su tutte le piattaforme: carichi conoscenza ricorrente (brand voice, dati aziendali sintetici, istruzioni tipiche) una volta, e non la ripeti in ogni chat. Assorbe la spiegazione tecnica di custom instructions / system prompt come callout.

- Apertura (100-150 parole): se ogni volta che apri una chat incolli gli stessi 300 caratteri di contesto ("sono una project manager in una società di consulenza, parlo con clienti enterprise, tono professionale ma non freddo"), c'è un modo per farlo una volta sola.
- **I tre nomi, lo stesso pattern** (200-300 parole): Claude Projects, ChatGPT Custom GPT, Gemini Gems. Tutti: uno spazio dove carichi istruzioni persistenti + file/documenti di riferimento. Ogni chat dentro il progetto eredita quella base.
- **Quattro casi d'uso canonici** (400-500 parole):
  1. **Brand voice aziendale**: caricare guide di stile, esempi di testi buoni/cattivi, palette di registri. Ogni email o post social parte con la voce giusta.
  2. **Documenti ricorrenti di progetto**: brief cliente, specifiche tecniche, storico delle decisioni. Ogni domanda sul progetto X eredita il contesto.
  3. **Flussi ripetitivi**: "scrivi sempre un summary di 3 bullet + next steps in stile X". Invece di ripeterlo ogni chat, lo imposti una volta.
  4. **Personaggio/assistente specializzato**: "sei un editor severo sulla chiarezza; ogni testo che ti mando, taglia almeno il 20%". Diventa una Custom GPT/Gemini Gem/Project dedicata.
- **Callout meccanico** (~120 parole, `:::note`): "custom instructions" di ChatGPT (disponibile anche fuori dai Custom GPT), "system prompt" di Claude Projects, "instruction text" di Gemini Gems. Sono la stessa cosa con tre nomi. Link a pagine ufficiali (non testo che cambia).
- **Privacy dei file caricati** (150-200 parole): quando metti un documento aziendale in un Project, rimane nel Project. Ma il provider lo può vedere, usare per migliorare il servizio (a seconda del piano). Richiamo a *Privacy e dati aziendali* (lezione 9) + *Foto, immagini e file* di Modulo 2.
- **ChatDemo**: mini prompt di configurazione di una Custom GPT + mini interazione (la Custom GPT risponde già "in stile", senza che il lettore abbia dovuto specificare tono).
- **Cosa NON mettere in un Project pubblico** (100-150 parole): dati sensibili non anonimizzati, credenziali, contratti riservati. Per quelli: piano Team/Enterprise con garanzie o ambiente on-prem.
- `<LlmExercise variant="review">`.
- Lunghezza: 1100-1300 parole.

### Task I1-I10: Workflow standard

- [ ] **Step I1: CONTENT.md lezione 8 `🆕` → `✍️`.**
- [ ] **Step I2: Scrivere `src/content/docs/it/at-work/reuse-context-with-projects.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [ask-well, iterate-the-conversation]`.
- [ ] **Step I3: `/analyze-lesson`, curare. Il lettore intermedio probabilmente chiede "come passo da una chat a un Project: devo rifare tutto?". Preparare.**
- [ ] **Step I4: `/integrate-questions`.**
- [ ] **Step I5: `public/skills/it/review-reuse-context-with-projects.txt`** (quattro domande: tre nomi stesso pattern, quattro casi d'uso canonici, nomi tecnici equivalenti delle tre piattaforme, privacy dei file caricati). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step I6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/reuse-context-with-projects.mdx public/skills/it/review-reuse-context-with-projects.txt analysis/reuse-context-with-projects.questions.md
git commit -m "Module 3 lesson 8: Riusare contesto con i progetti (reuse-context-with-projects) + review exercise"
```

- [ ] **Step I7: Tradurre `src/content/docs/en/at-work/reuse-context-with-projects.mdx`** (titolo EN: "Reusing context with projects"). `public/skills/en/review-reuse-context-with-projects.txt`.
- [ ] **Step I8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/reuse-context-with-projects.mdx public/skills/en/review-reuse-context-with-projects.txt
git commit -m "Module 3 lesson 8 EN: Reusing context with projects + review exercise"
```

- [ ] **Step I9: Sblocco placeholder:**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 8 in sidebar"
```

- [ ] **Step I10: CONTENT.md `✅` (8 su 9). Aggiornare "Prossima sessione" → lezione 9. Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 8 published"
```

---

## Phase J — Lezione 9: Privacy e dati aziendali (`company-data-and-privacy`)

**Slug**: `company-data-and-privacy` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `privacy-basics`

### Brief di lezione

Chiusura del modulo. Scala il modello di privacy personale (Fondamenti 6) al contesto aziendale. Il taglio cardine: "cosa NON dare in pasto a un'IA pubblica" e "cosa cambia con piani Enterprise/Team". Ponte verso i moduli successivi (4, 5, 6).

- Apertura (120-150 parole): privacy delle proprie conversazioni con l'IA è una cosa (già vista in Fondamenti). Privacy dei dati aziendali è un'altra: non sei solo tu, c'è il tuo datore di lavoro, ci sono clienti, ci sono NDA firmati.
- **Tre livelli di rischio** (300-400 parole):
  1. **Rosso — non incollare mai**: dati personali di terzi non anonimizzati (clienti, colleghi, candidati), credenziali (password, API key), contratti sotto NDA, dati finanziari non pubblici, piani strategici confidenziali.
  2. **Giallo — anonimizza prima**: email interne con nomi, CV di candidati, note di riunione con nomi, dati HR aggregati.
  3. **Verde — OK con senso comune**: testi pubblici (siti, documentazione), dati tuoi personali di lavoro non riservati (la tua agenda del giorno, un commento pubblico da riscrivere).
- **Piani Enterprise, Team, e cosa cambia** (300-400 parole): Team di ChatGPT, Enterprise di Anthropic, Workspace di Google Gemini. Garanzie tipiche: no training sui tuoi dati, isolamento dei workspace, admin control. Per i dettagli **non elencare feature specifiche**: cambiano di mese in mese. Indicare il criterio ("cerca 'data retention' e 'training opt-out' nel piano del tuo fornitore"), non il feature. Callout: non è "un piano a pagamento è sempre sicuro". Un Team può ancora avere clausole di training su prompts pubblici.
- **NDA, contratti, compliance** (200-300 parole): se hai firmato un NDA con un cliente, incollare suoi dati in un'IA pubblica può essere una violazione di contratto. GDPR e AI Act aggiungono obblighi su dati personali. Non sei l'ufficio legale, ma sei il primo filtro. Quando in dubbio: non incollare o anonimizza, chiedi al reparto compliance.
- **Policy aziendale: esiste? se no, chiedila** (100-150 parole): molte aziende non hanno ancora una AI policy chiara. Se lavori con dati sensibili e la policy non esiste, mettere la domanda sul tavolo (al capo, all'IT, al legale) è parte del tuo lavoro.
- **Chiusura del modulo + ponte** (100-150 parole): hai visto 9 modi di usare l'IA sul lavoro. La leva che cambia tutto resta il giudizio su cosa delegare, come, con che cautele. Nei moduli successivi passiamo a contesti più specifici: studenti, docenti, e chi vuole integrare l'IA in strumenti propri.
- `<LlmExercise variant="review">`.
- Lunghezza: 1100-1300 parole.

### Task J1-J10: Workflow standard

- [ ] **Step J1: CONTENT.md lezione 9 `🆕` → `✍️`.**
- [ ] **Step J2: Scrivere `src/content/docs/it/at-work/company-data-and-privacy.mdx`**. Frontmatter `livello: intermedio`, `prerequisiti: [ask-well, privacy-basics]`. Usare `:::danger` per "rosso — non incollare mai" e `:::caution` per "giallo — anonimizza prima".
- [ ] **Step J3: `/analyze-lesson`. Il lettore intermedio probabilmente chiede "ma come anonimizzo praticamente? Trova-e-sostituisci con ID finti?". Preparare risposta concreta.**
- [ ] **Step J4: `/integrate-questions`.**
- [ ] **Step J5: `public/skills/it/review-company-data-and-privacy.txt`** (quattro domande: tre livelli di rischio, cosa cambia con Enterprise/Team, primo filtro NDA, policy aziendale come farla emergere). Aggiungere `<LlmExercise variant="review">`.
- [ ] **Step J6: `style-checker` IT, fix, commit IT:**

```bash
git add CONTENT.md src/content/docs/it/at-work/company-data-and-privacy.mdx public/skills/it/review-company-data-and-privacy.txt analysis/company-data-and-privacy.questions.md
git commit -m "Module 3 lesson 9: Privacy e dati aziendali (company-data-and-privacy) + review exercise, module complete"
```

- [ ] **Step J7: Tradurre `src/content/docs/en/at-work/company-data-and-privacy.mdx`** (titolo EN: "Company data and privacy"). `public/skills/en/review-company-data-and-privacy.txt`.
- [ ] **Step J8: `style-checker` EN, fix, build smoke, commit EN:**

```bash
git add src/content/docs/en/at-work/company-data-and-privacy.mdx public/skills/en/review-company-data-and-privacy.txt
git commit -m "Module 3 lesson 9 EN: Company data and privacy + review exercise"
```

- [ ] **Step J9: Sblocco placeholder:**

```bash
git add astro.config.mjs
git commit -m "Unlock Module 3 lesson 9 in sidebar"
```

- [ ] **Step J10: CONTENT.md `✅` (9 su 9, **Modulo 3 completo al 100%**). Aggiornare "Stato attuale" del Modulo 3 e la sezione "Prossima sessione" (prossima bozza → Modulo 4 oppure pagine trasversali). Dev smoke. Commit:**

```bash
git add CONTENT.md
git commit -m "Update CONTENT.md: Module 3 lesson 9 published, module complete"
```

---

## Phase K — Module completion (attivazione card)

Una tantum, eseguita **alla pubblicazione della Fase B** (prima lezione), non a fine modulo. Motivazione: la card "Al lavoro…" in homepage e start-here va attivata appena c'è una destinazione linkabile, anche se il modulo è ancora in produzione. Pattern già seguito per Modulo 2 con la card "Uso quotidiano" attivata sulla pubblicazione di *ask-well* (commit `b64e411`).

**Nota di ordine**: se questa Fase K viene eseguita al termine di Fase B, si tratta di un commit extra dopo i 4 commit già della fase (IT, EN, sblocco sidebar, CONTENT.md). Se si sceglie di rimandare a fine modulo, seguire le stesse istruzioni ma a valle della Fase J.

### Task K1: Attivare la card "Al lavoro…" in homepage IT

**Files:**
- Modifica: `src/content/docs/it/index.mdx`

- [ ] **Step 1: Togliere `comingSoon: true` e aggiungere `href`**

Nel file, trovare la card `'Al lavoro'` o equivalente (cercare il titolo IT presente) e cambiare:

```mdx
{
  icon: 'briefcase',
  title: 'Al lavoro',
  description: '...',
  comingSoon: true,
},
```

in:

```mdx
{
  icon: 'briefcase',
  title: 'Al lavoro',
  description: '...',
  href: '/it/at-work/hard-emails/',
},
```

(Verificare il titolo e la description esatta nel file: potrebbe essere "Sul lavoro" o variante. Non cambiare il titolo in questo step: solo `comingSoon` → `href`.)

### Task K2: Attivare la card in start-here IT

**Files:**
- Modifica: `src/content/docs/it/start-here.mdx`

- [ ] **Step 1: Togliere `comingSoon: true` e aggiungere `href`**

Trovare la card corrispondente al Modulo 3 e sostituire `comingSoon: true` con `href: '/it/at-work/hard-emails/'`.

### Task K3: Attivare le card EN

**Files:**
- Modifica: `src/content/docs/en/index.mdx`
- Modifica: `src/content/docs/en/start-here.mdx`

- [ ] **Step 1: Attivare card homepage EN**

In `src/content/docs/en/index.mdx`, trovare la card EN equivalente (titolo inglese: "At work" o simile) e sostituire `comingSoon: true` con `href: '/en/at-work/hard-emails/'`.

- [ ] **Step 2: Attivare card start-here EN**

In `src/content/docs/en/start-here.mdx`, stesso pattern.

### Task K4: Build finale + commit Fase K

- [ ] **Step 1: Build**

Run: `npm run build`

Expected: build pulita, tutti i link risolvono.

- [ ] **Step 2: Dev server smoke test**

Run: `npm run dev`

Verificare:
- Homepage IT: card "Al lavoro" cliccabile, porta a `/it/at-work/hard-emails/`.
- Start-here IT: stesso link.
- Homepage EN: card "At work" (o equivalente) cliccabile, porta a `/en/at-work/hard-emails/`.
- Start-here EN: stesso link.
- Sidebar IT/EN: "Sul lavoro" / "At work" con "Email difficili" attiva e le altre voci come placeholder disabilitati (a meno che altre Fasi C-J siano già completate).

- [ ] **Step 3: Commit della Fase K**

```bash
git add src/content/docs/it/index.mdx src/content/docs/it/start-here.mdx src/content/docs/en/index.mdx src/content/docs/en/start-here.mdx
git commit -m "Activate Module 3 cards on homepage and start-here (IT + EN)"
```

---

## Decisioni aperte (non bloccanti)

- **Ordine di scrittura**: pedagogico = scrittura. Non cambiare senza motivo (scrivere "fuori ordine" rende più difficile calibrare i rimandi tra lezioni e gli aggiornamenti sequenziali a CONTENT.md).
- **Esempio portante a livello modulo**: se durante la scrittura emerge un caso aziendale cross-lezione utile (es. stesso progetto che appare in preparare una riunione + bozze + slide + report), lo si consolida come filo conduttore. Nessuna decisione anticipata.
- **Tooltip `<Def>` inline**: invocare `/add-defs` solo se in lettura emergono termini non definiti dal paragrafo immediato. Probabilmente non necessario: il lessico tecnico IA è stato definito in Fondamenti; il lessico aziendale (KPI, OKR, exec summary, NDA) verrà definito inline nella lezione che lo introduce.
- **Fase K attivazione card**: sceglibile se eseguirla in coda a Fase B (appena c'è la prima lezione linkabile) o a fine modulo (tutte le lezioni pronte). Preferenza: in coda a Fase B, per allineamento con il pattern di Modulo 2 (card attivata con *ask-well*).
- **Eventuale promozione di un callout assorbito a lezione autonoma**: se in scrittura un callout previsto (IA vs CRM in lezione 5, custom instructions in lezione 8, tono per il capo in lezione 1) diventa troppo grande per stare inline, promuoverlo a lezione autonoma aggiornando spec e CONTENT.md.
