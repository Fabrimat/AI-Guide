# Modulo 5 "Per docenti" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare live il Modulo 5 di AI-Guide ("Per docenti") nella struttura definita in `docs/superpowers/specs/2026-05-16-per-docenti-module-design.md`: 9 lezioni IT + 9 mirror EN, infrastruttura (sidebar riordinata, directory, card homepage e start-here IT+EN), aggiornamento di `CONTENT.md`, traduzione EN in parallelo con l'IT (pattern consolidato dopo Moduli 2, 3, 4).

**Architecture:** Un modulo di contenuto (Astro + Starlight + MDX), non un refactor di codice. Una Fase A di scaffolding (una tantum: `CONTENT.md` + directory + riordino dei 9 placeholder esistenti in sidebar per allinearli all'ordine pedagogico, con un nudge ai titoli inglesi laddove necessario), nove Fasi B-J di scrittura lezione (una per lezione, IT e EN in pari passo), una Fase K di chiusura modulo (attivazione card homepage e start-here, IT e EN). Ogni lezione segue il workflow standard di AI-Guide, esteso per il Modulo 5 con la sezione "Approfondisci per la tua disciplina" (file `deepen-<slug>.txt` esposto via `<LlmExercise variant="practice">`) presente nelle lezioni 1-7 e assente nelle lezioni 8-9.

**Tech Stack:** Astro 6 + Starlight 0.38, MDX, TypeScript (per `astro.config.mjs` e `src/content.config.ts`). Nessuna nuova dipendenza.

---

## File Structure

**Scaffolding del modulo (Fase A)**
- Modifica `CONTENT.md` (root) — sostituire elenco provvisorio di 9 voci 🆕 del Modulo 5 con la struttura validata; allineare la sezione "Prossima sessione".
- Crea `src/content/docs/it/for-teachers/.gitkeep` — placeholder per la directory IT.
- Crea `src/content/docs/en/for-teachers/.gitkeep` — placeholder per la directory EN.
- Modifica `astro.config.mjs` (blocco `label: 'For teachers'`) — riordinare i 9 placeholder esistenti nella sequenza pedagogica dello spec (l'ordine attuale ha *Differentiated materials* in posizione 2, *Explain it five different ways* in 6: vanno scambiati, più altri spostamenti minori). Correggere anche il refuso del titolo "Explain it five different ways" → "Explain in five different ways" (più i 9 titoli aggiornati al wording definitivo dove differisce).

**Lezioni IT + EN (Fasi B-J, una per lezione)**
- Crea `src/content/docs/it/for-teachers/design-a-lesson.mdx` + `src/content/docs/en/for-teachers/design-a-lesson.mdx` (Fase B)
- Crea `src/content/docs/it/for-teachers/explain-in-five-ways.mdx` + mirror EN (Fase C)
- Crea `src/content/docs/it/for-teachers/differentiated-materials.mdx` + mirror EN (Fase D)
- Crea `src/content/docs/it/for-teachers/inclusive-materials.mdx` + mirror EN (Fase E)
- Crea `src/content/docs/it/for-teachers/generate-assessment-questions.mdx` + mirror EN (Fase F)
- Crea `src/content/docs/it/for-teachers/grading-with-criteria.mdx` + mirror EN (Fase G)
- Crea `src/content/docs/it/for-teachers/emails-to-families.mdx` + mirror EN (Fase H)
- Crea `src/content/docs/it/for-teachers/when-students-use-ai.mdx` + mirror EN (Fase I)
- Crea `src/content/docs/it/for-teachers/ethics-of-teaching.mdx` + mirror EN (Fase J)

**Esercizi di review (una coppia IT/EN per lezione, in fase con la lezione)**
- Crea `public/skills/it/review-<slug>.txt` + `public/skills/en/review-<slug>.txt` per ognuna delle 9 lezioni.

**Esercizi di approfondimento per disciplina (una coppia IT/EN per lezione 1-7, in fase con la lezione)**
- Crea `public/skills/it/deepen-<slug>.txt` + `public/skills/en/deepen-<slug>.txt` per le lezioni 1-7. **Non per 8-9** (vedi spec, sezione "Cosa il pattern NON è").

**File di analisi intermedi (uno per lezione, committati come traccia)**
- Crea `analysis/<slug>.questions.md` per ognuna delle 9 lezioni.

**Sblocco placeholder in sidebar (un commit dedicato per lezione)**
- Modifica `astro.config.mjs` — sostituire la voce placeholder disabilitata della lezione con `{ slug: 'for-teachers/<slug>' }`. Pattern già stabilito con i commit `Unlock Module N lesson M in sidebar`.

**Attivazione card homepage e start-here (Fase K)**
- Modifica `src/content/docs/it/index.mdx` (riga ~52, card *Per docenti*) — togliere `comingSoon: true`, aggiungere `href: '/it/for-teachers/design-a-lesson/'`.
- Modifica `src/content/docs/en/index.mdx` (riga ~52, card *For teachers*) — togliere `comingSoon: true`, aggiungere `href: '/en/for-teachers/design-a-lesson/'`.
- Modifica `src/content/docs/it/start-here.mdx` (riga ~46, card *Insegno*) — stesso pattern.
- Modifica `src/content/docs/en/start-here.mdx` (riga ~45, card *I teach*) — stesso pattern.

Ogni fase B-J termina con tre commit (IT, EN, sblocco sidebar + aggiornamento `CONTENT.md`) e un `npm run build` di verifica intermedia. La Fase A e la Fase K hanno un singolo commit ciascuna.

---

## Per-lesson workflow (riferimento)

Ogni lezione (Fasi B-J) segue la stessa sequenza di 14 passi, esplicitata fase per fase con i path specifici della lezione. Non è un template riutilizzabile a livello di tooling: è la sequenza da eseguire a mano per ciascuna lezione. Estende il workflow di `CONTENT.md` con i passi specifici del Modulo 5 (file `deepen-*.txt` per le lezioni 1-7).

1. **`CONTENT.md` → `✍️`**: stato della lezione da `🆕` a `✍️` (prima dei passi successivi, assorbito dal commit IT).
2. **Bozza IT**: scrivere `src/content/docs/it/for-teachers/<slug>.mdx` rispettando la `voice-guide` (em dash vietati, lessico AI italiano vietato; vedi `.claude/skills/voice-guide/SKILL.md`).
3. **Genera domande del lettore**: `/analyze-lesson src/content/docs/it/for-teachers/<slug>.mdx` produce `analysis/<slug>.questions.md`. Rileggere le domande, scartare quelle già coperte, aggiungere le proprie.
4. **Integra le domande**: `/integrate-questions src/content/docs/it/for-teachers/<slug>.mdx` aggiorna l'MDX con risposte inline, callout, esempi o FAQ, dopo conferma del diff.
5. **Approfondimento per disciplina IT** (solo lezioni 1-7): scrivere `public/skills/it/deepen-<slug>.txt`. Il prompt comunica all'IA il contesto della lezione, le fa intervistare il docente su disciplina/livello/classe/esempio concreto, poi le fa generare un'applicazione operativa calata sul caso del lettore. Aggiungere nell'MDX una sezione "Approfondisci per la tua disciplina" con `<LlmExercise variant="practice">` che punta al file, **subito prima** della verifica di fine lezione.
6. **Esercizio di review IT**: scrivere `public/skills/it/review-<slug>.txt` (plain text, niente markdown) e aggiungere `<LlmExercise variant="review">` nell'MDX dopo l'approfondimento (o, per le lezioni 8-9, prima della card "Prossima lezione" senza approfondimento sopra).
7. **QA IT con `style-checker`**: invocare l'agent sulla lezione. Applicare i fix.
8. **Commit IT**: `git add` dei file IT + analysis + review-IT + deepen-IT (se presente), commit con messaggio `Module 5 lesson N: <titolo IT> + review exercise` (e, se applicabile, `+ deepen exercise`).
9. **Traduzione EN mirror**: scrivere `src/content/docs/en/for-teachers/<slug>.mdx`. Frontmatter con `title` e `description` in inglese; `livello` e `prerequisiti` restano in italiano (sono code identifier — vedi `src/content.config.ts`). Corpo tradotto fedelmente, con adattamenti culturali dove serve (es. politiche d'istituto IT → esempi anglosassoni nelle lezioni 8 e 9 come stabilito nello spec). Cross-link interni aggiornati a `/en/...`.
10. **Approfondimento per disciplina EN** (solo lezioni 1-7): scrivere `public/skills/en/deepen-<slug>.txt` come traduzione del corrispondente IT, con accomodamento del sistema scolastico anglosassone (K-12, undergraduate, graduate) lasciando libero il docente di specificare il proprio contesto. Il componente `<LlmExercise>` nel mirror EN punta allo stesso `file` del componente IT (la risoluzione del path per locale è automatica).
11. **Esercizio di review EN**: scrivere `public/skills/en/review-<slug>.txt` come traduzione del corrispondente IT. Stesso pattern di risoluzione locale.
12. **QA EN con `style-checker`**: l'agent in inglese segnala em dash, AI buzzwords in inglese, chiusure tipo "In conclusion", calchi IT→EN (specialmente terminologia scolastica: registro, scrutinio, BES/DSA/PEI/PDP, maturità, classe vs sezione — vedi sezione "Traduzione EN" dello spec per la lista canonica). Applicare i fix.
13. **Commit EN**: `git add` dei file EN, commit con messaggio `Module 5 lesson N EN: <titolo EN> + review exercise` (e, se applicabile, `+ deepen exercise`).
14. **Sblocco placeholder in sidebar + `CONTENT.md` → `✅`**: modificare `astro.config.mjs` sostituendo la voce placeholder disabilitata della lezione con `{ slug: 'for-teachers/<slug>' }`. Aggiornare in `CONTENT.md` stato lezione, contatore "Stato attuale", e sezione "Prossima sessione". Build smoke. Commit dedicato: `Unlock Module 5 lesson N in sidebar`.

**Nota su `<Def>`**: la skill `/add-defs` è utile sui termini tecnici non già spiegati dal paragrafo immediato. Per Modulo 5 i termini candidati sono prevalentemente didattici (BES, DSA, PEI, PDP, tassonomia di Bloom, rubrica, scaffolding didattico, formativa vs sommativa, NotebookLM se compare). Invocare `/add-defs` solo se in lettura emergono termini potenzialmente oscuri al lettore target.

**Nota su `<ChatDemo>`**: usare quando l'esempio è un dialogo prompt/risposta dove la forma del dialogo aggiunge informazione (es. IA che propone tre versioni di una spiegazione, IA che corregge un elaborato fittizio mostrando la rubrica applicata). Se l'esempio è un pattern statico (lista di domande di verifica, tabella di rubrica), usare code fence o tabella.

**Pattern dell'approfondimento per disciplina (lezioni 1-7)**: il file `deepen-<slug>.txt` segue una struttura standard, da curare al momento della scrittura di ciascun file e da uniformare progressivamente. Schema di riferimento (plain text, niente markdown):

```
Ho appena letto una lezione sul tema X. La tecnica proposta è Y.
Voglio applicarla al mio contesto di insegnamento.

Prima di rispondere, fammi queste domande UNA ALLA VOLTA, aspettando
la mia risposta prima di passare alla successiva:

1. Quale disciplina o materia insegni?
2. A che livello scolastico (primaria, secondaria di primo grado,
   secondaria di secondo grado, università, formazione adulti) e in
   quale classe specifica?
3. Su quale argomento del programma stai lavorando in questi giorni?
4. Hai un esempio concreto su cui vuoi applicare la tecnica
   (una lezione da progettare, un materiale da differenziare, una
   verifica da costruire, eccetera)?

Dopo che ti ho risposto a tutte e quattro le domande, applica la
tecnica Y al mio caso specifico, mostrando passo per passo come la
useresti. Sii concreto: niente template generici, niente "questo
dipende dal tuo contesto", niente liste di possibilità. Mostrami una
sola applicazione, calata sui dati che ti ho appena dato.

Se in qualche passaggio ti servono informazioni che non ti ho dato,
chiedimele invece di inventare.
```

Il filler "X / Y" va sostituito con il tema e la tecnica della lezione specifica al momento della scrittura. Le quattro domande sono uguali per tutte le lezioni 1-7 (variano marginalmente: la domanda 4 si adatta al caso d'uso della lezione: progettare, materiali, verifica, eccetera). Lo `<LlmExercise variant="practice">` referenzia il file con `title` = "Approfondisci per la tua disciplina" (IT) / "Take it deeper for your subject" (EN), `duration` indicativo "10-15 min".

**Anti-cheating meta**: come da spec, il modulo non insegna a "scoprire chi bara con l'IA". L8 (`when-students-use-ai`) propone indicatori manuali come ipotesi, ridisegno delle consegne come strategia primaria, conversazione (non condanna) come gestione del sospetto. Curare il tono: niente how-to detection, niente vendetta morale, niente "i bari di oggi". La lezione è costruttiva.

---

## Phase A — Module scaffolding

Una tantum. Prepara l'infrastruttura senza pubblicare nessuna lezione. Al termine di questa fase la sidebar del Modulo 5 mostra 9 placeholder riordinati nella sequenza pedagogica del modulo; la homepage IT ed EN e le pagine start-here restano invariate (le card `comingSoon: true` si attivano in Fase K, quando la prima lezione è pronta).

### Task A1: Aggiornare `CONTENT.md` con la struttura validata a 9 voci

**Files:**
- Modifica: `CONTENT.md` (sezione "Modulo 5: Per docenti", righe ~740-756; anche la sezione "Prossima sessione" a fine file va allineata)

- [ ] **Step 1: Sostituire l'elenco del Modulo 5**

Trovare la sezione `## Modulo 5: Per docenti (livello intermedio)` e sostituire il blocco delle 9 voci `🆕` con:

```markdown
## Modulo 5: Per docenti (livello `intermedio`)

Target: insegnanti di scuola primaria, secondaria e università, più
formatori aziendali e divulgatori. Pubblico non tecnico ma con
competenza didattica propria. Tono pratico, casi d'uso da classe.
Spec di modulo:
`docs/superpowers/specs/2026-05-16-per-docenti-module-design.md`.

Struttura validata 2026-05-16. Nove lezioni, ordine pedagogico = ordine
di scrittura. Livello uniforme `intermedio`: il pubblico ci arriva
dopo Fondamenti + Uso quotidiano (o con esperienza equivalente).

Pattern editoriale specifico del modulo: ogni lezione operativa (1-7)
chiude con una sezione "Approfondisci per la tua disciplina" che
espone via `<LlmExercise variant="practice">` un file
`deepen-<slug>.txt` di prompt. Il prompt fa intervistare il docente
dall'IA su disciplina/livello/classe/caso concreto e genera
un'applicazione mirata della tecnica della lezione. Pattern assente
nelle lezioni 8-9 (critica + chiusura, non operative).

Filo rosso "riconoscere l'uso dell'IA da parte degli studenti":
callout breve in L5 e L6 con rimando esplicito alla lezione dedicata
L8 (*Quando lo studente usa l'IA*).

Autonomia totale dal Modulo 4 (Per studenti): nessun cross-link, nessuna
disambiguazione esplicita verso le lezioni di studente, anche dove i
temi sono specchio.

1. 🆕 **Progettare una lezione** (`for-teachers/design-a-lesson`)
   Apertura del modulo. Dal piano alla pratica: scaletta della singola
   lezione, gradazione degli obiettivi, attività agganciate. Contratto
   del modulo (IA in preparazione, non in classe).
2. 🆕 **Spiegare in cinque modi diversi** (`for-teachers/explain-in-five-ways`)
   Stessa nozione raccontata a pubblici diversi (per stile, non per
   livello). Cerniera fra preparazione e classe.
3. 🆕 **Materiali differenziati per livello** (`for-teachers/differentiated-materials`)
   Stesso argomento, livelli verticali di difficoltà. Pattern *un solo
   testo base, tre derivati*.
4. 🆕 **Inclusività: BES e DSA** (`for-teachers/inclusive-materials`)
   Adattare materiali per Bisogni Educativi Speciali e Disturbi
   Specifici dell'Apprendimento. PEI, PDP, accessibilità.
5. 🆕 **Domande per verifiche** (`for-teachers/generate-assessment-questions`)
   Aperte, multiple, V/F, problem-solving. Distrattori sensati,
   tassonomia di Bloom. Callout filo rosso anti-cheating.
6. 🆕 **Correggere con criterio** (`for-teachers/grading-with-criteria`)
   Rubrica esplicita, prima passata IA, verifica a campione, decisione
   docente. Callout filo rosso su indicatori manuali.
7. 🆕 **Comunicare con le famiglie** (`for-teachers/emails-to-families`)
   Email delicate ai genitori. Tre registri (primaria, secondaria,
   università). Privacy rinforzata su dati di minori.
8. 🆕 **Quando lo studente usa l'IA** (`for-teachers/when-students-use-ai`)
   Riconoscere senza demonizzare. AI detector inaffidabili, indicatori
   manuali come ipotesi, ridisegno consegne, conversazione (non
   condanna).
9. 🆕 **Etica del docente** (`for-teachers/ethics-of-teaching`)
   Chiusura. Onestà verso studenti/famiglie, privacy dei minori,
   valutazione che resta del docente. Politiche d'istituto italiane ed
   estere. Ponte al Modulo 6.

**Stato attuale**: 0 su 9 pubblicate. Struttura definita, scrittura da
iniziare.
```

- [ ] **Step 2: Allineare la sezione "Prossima sessione"**

In fondo al file, sostituire la sezione `## Prossima sessione` con:

```markdown
## Prossima sessione

**Revisioni pendenti**: nessuna. Modulo Fondamenti chiuso al 100% il
2026-04-19. Modulo Uso quotidiano chiuso al 100% il 2026-04-23.
Modulo Sul lavoro chiuso al 100% il 2026-04-25. Modulo Per studenti
chiuso al 100% il 2026-05-13.

**Modulo 5 (Per docenti)**: struttura validata 2026-05-16 in
`docs/superpowers/specs/2026-05-16-per-docenti-module-design.md`.
Piano di implementazione in
`docs/superpowers/plans/2026-05-16-per-docenti-module.md`. Prossima
bozza: lezione 1, **Progettare una lezione**
(`for-teachers/design-a-lesson`).

**Sblocco placeholder in sidebar**: per ogni lezione del Modulo 5 che
atterra, sostituire la voce placeholder disabilitata in
`astro.config.mjs` con `{ slug: 'for-teachers/<slug>' }` in un commit
dedicato (pattern già stabilito con i commit "Unlock Module N lesson M
in sidebar").

**Audit moduli 4-6 (storico)**: gap identificati e coperti nei moduli
4 (chiuso) e 5 (in scrittura). Per Modulo 6 vedi piano provvisorio in
`CONTENT.md`.
```

- [ ] **Step 3: Verificare il diff**

Run: `git diff CONTENT.md`

Expected: le due sezioni sostituite; nessun'altra modifica ai Moduli 1-4, 6, e alle sezioni "Pagine trasversali", "Traduzione", "Workflow per scrivere una lezione".

### Task A2: Creare le directory `for-teachers/`

**Files:**
- Crea: `src/content/docs/it/for-teachers/.gitkeep`
- Crea: `src/content/docs/en/for-teachers/.gitkeep`

- [ ] **Step 1: Creare le directory con placeholder**

```bash
mkdir -p src/content/docs/it/for-teachers src/content/docs/en/for-teachers
touch src/content/docs/it/for-teachers/.gitkeep
touch src/content/docs/en/for-teachers/.gitkeep
```

I `.gitkeep` vengono eliminati automaticamente dal commit della prima lezione in ciascuna lingua (Fase B), perché a quel punto la directory contiene già file `.mdx` reali. Non serve `git rm` esplicito.

### Task A3: Riordinare i placeholder del Modulo 5 in `astro.config.mjs`

**Files:**
- Modifica: `astro.config.mjs` (blocco `label: 'For teachers'`, righe ~138-208)

L'attuale ordine in sidebar non corrisponde all'ordine pedagogico dello spec. Mappa di transizione:

| Pos. attuale | Slug | Titolo EN attuale | Pos. corretta | Titolo EN finale |
|---|---|---|---|---|
| 1 | design-a-lesson | Design a lesson | 1 | Design a lesson |
| 2 | differentiated-materials | Differentiated materials | 3 | Differentiated materials |
| 3 | inclusive-materials | Inclusive materials (SEN) | 4 | Inclusive materials (SEN) |
| 4 | generate-assessment-questions | Generate assessment questions | 5 | Generate assessment questions |
| 5 | grading-with-criteria | Grading with criteria | 6 | Grading with criteria |
| 6 | explain-in-five-ways | Explain it five different ways *(refuso)* | 2 | Explain in five different ways |
| 7 | emails-to-families | Emails to families | 7 | Emails to families |
| 8 | when-students-use-ai | When students use AI | 8 | When students use AI |
| 9 | ethics-of-teaching | Ethics of teaching | 9 | Ethics of teaching |

Lo spec usa lo slug `explain-in-five-ways` (canonico). Conferma: lo slug attuale in sidebar è `explain-in-five-ways` (il refuso è solo nel `label`, non nello slug). Quindi basta riordinare e correggere un singolo `label`.

- [ ] **Step 1: Sostituire il blocco `items` del Modulo 5**

Trovare il blocco con commento `// Modulo 5 (Per docenti)` e sostituire l'intero array `items` con:

```javascript
items: [
  {
    label: 'Design a lesson',
    translations: { it: 'Progettare una lezione' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Explain in five different ways',
    translations: { it: 'Spiegare in cinque modi diversi' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Differentiated materials',
    translations: { it: 'Materiali differenziati' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Inclusive materials (SEN)',
    translations: { it: 'Inclusività (BES e DSA)' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Generate assessment questions',
    translations: { it: 'Domande per verifiche' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Grading with criteria',
    translations: { it: 'Correggere con criterio' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Emails to families',
    translations: { it: 'Comunicare con le famiglie' },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'When students use AI',
    translations: { it: "Quando lo studente usa l'IA" },
    link: '#',
    badge: { text: { en: 'Soon', it: 'Presto' }, variant: 'default' },
    attrs: { 'aria-disabled': 'true', tabindex: -1 },
  },
  {
    label: 'Ethics of teaching',
    translations: { it: 'Etica del docente' },
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
git add CONTENT.md astro.config.mjs src/content/docs/it/for-teachers/ src/content/docs/en/for-teachers/
git commit -m "Scaffold Module 5 (Per docenti): 9-lesson plan, sidebar reordered, empty dirs"
```

---

## Phase B — Lezione 1: Progettare una lezione (`design-a-lesson`)

**Slug**: `design-a-lesson` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `iterate-the-conversation`, `draft-professional-documents`

### Brief di lezione

Apertura del modulo. La lezione fissa il **contratto del modulo** (in 4-6 righe di apertura: IA come collega di preparazione, non sostituto in classe) e mostra come usare l'IA per progettare la singola lezione di 50-90 minuti.

- **Apertura/contratto del modulo** (~120-150 parole). Forma suggerita:

  > Questo modulo non è il manuale dell'"IA che fa lezione al posto tuo". L'IA non sa cosa succede nella tua aula: chi è la classe, come reagisce a una domanda, quando un'attività di gruppo funziona e quando si sfilaccia. Quello lo sai tu. Il modulo ti aiuta a usare l'IA come collega di preparazione (scaletta, materiali, domande di verifica, comunicazioni delicate) e di critica (un secondo paio d'occhi su quello che hai già scritto). In classe ci entri tu.

- **Tre tecniche** (450-550 parole):
  1. **Scaletta in tre passaggi**: obiettivo di apprendimento (uno per lezione, scritto in verbi attivi tipo Bloom: descrivere, applicare, confrontare), poi gradazione degli stimoli (apertura attivante, fase di scoperta o spiegazione, applicazione, sintesi), poi tempi realistici per ogni segmento. Pattern *outline + riempimento* ereditato da M3L2 ma calibrato sul docente.
  2. **Critica della scaletta**. Una volta scritta la scaletta, rimandare l'IA con un prompt di critica: "questa scaletta ha senso per una classe di [livello] di [materia]? Cosa manca? Cosa è troppo? Dove la classe potrebbe distrarsi o perdere il filo?". Lavoro vero: spesso la prima scaletta è troppo densa, l'IA è brava a vederlo.
  3. **Materiali agganciati**. Dopo la scaletta, generare il materiale concreto (esercizio di apertura, slide di sintesi, scheda di applicazione) chiedendo all'IA di restare coerente con la scaletta validata. Stop-rule esplicito: se la scaletta cambia, i materiali vanno rifatti, non patchati.

- **ChatDemo portante** (~150-200 parole di setup). Caso: docente di scienze, seconda media, lezione introduttiva sul ciclo dell'acqua, 60 minuti. ChatDemo prima/dopo: prima la scaletta "media densità" che l'IA tira fuori senza vincoli, poi la critica del docente che porta a una versione più aderente alla classe (esercizio di apertura cambiato per agganciare la pioggia del giorno prima, attività di gruppo dimezzata perché la classe è grande, sintesi finale alla lavagna invece che in scheda perché la fotocopiatrice è guasta).

- **Distinzione critica**: progettare ≠ ghostwriting di lezione. La voce del docente in aula deve restare la sua, non quella dell'IA. Se la scaletta è "incollabile" (suona come un piano didattico standard), va riscritta a mano in punti dove conta il dettaglio (gancio iniziale, esempio, battuta in classe).

- **Callout `:::tip` "Tempi realistici"**: l'IA tende a sovrastimare quante cose entrano in 50 minuti. Regola operativa: somma i minuti che l'IA propone, poi togline il 25-30% per gestione classe, transizioni, domande non previste.

- **Callout `:::note` "Lezioni in più giorni"**: il pattern scala da una singola lezione a un'unità didattica di 4-6 lezioni se chiedi all'IA di trattare la scaletta come "lezione 1 di N", poi iterare. Decisione architetturale: il modulo NON ha una lezione separata sull'unità didattica multi-sessione; vive come callout qui.

- **Approfondisci per la tua disciplina**: `deepen-design-a-lesson.txt`. Schema standard del modulo: l'IA chiede al docente disciplina, livello, classe, lezione specifica da progettare; poi produce la scaletta in tre passaggi calata sul caso.

- **Cosa NON fare** (~100 parole): chiedere "fammi la lezione" senza scaletta (l'IA produce un blob denso e incollabile); incollare nel chat dati personali degli studenti (vedi M5L9); usare la voce dell'IA al posto della propria per leggere la lezione in aula.

- Transizione: "Una buona scaletta presuppone di poter spiegare la stessa cosa in più modi diversi, quando un solo modo non basta. La prossima lezione parla di questo."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task B1-B7

Vedi sequenza standard a 14 passi in "Per-lesson workflow". Adattamenti specifici:
- Step 5 (`deepen-design-a-lesson.txt`): le quattro domande del template terminano con "Hai una lezione specifica da progettare in questi giorni (titolo, durata, classe)?"
- Step 14 (sblocco sidebar): la voce 1 del Modulo 5 nel blocco `items:` di `astro.config.mjs` diventa `{ slug: 'for-teachers/design-a-lesson' }` (rimuovere `label`, `translations`, `link`, `badge`, `attrs`).

---

## Phase C — Lezione 2: Spiegare in cinque modi diversi (`explain-in-five-ways`)

**Slug**: `explain-in-five-ways` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `iterate-the-conversation`, `learn-something-new`

### Brief di lezione

Cerniera fra preparazione e classe. Stessa nozione raccontata a pubblici diversi, **per stile** (laterale) e non per livello (verticale: quella è L3). Il caso d'uso include sia la preparazione (avere cinque spiegazioni pronte prima di entrare in aula) sia l'aula stessa (uno studente non capisce: chiedi all'IA on-the-fly un'angolazione diversa che puoi usare alla lavagna).

- **Apertura** (~120 parole). Una buona spiegazione non è "la spiegazione giusta": è quella che intercetta la mente di chi ascolta. Il problema è che in classe ce ne sono venti, di menti diverse. Cinque versioni della stessa nozione coprono il 90% dei modi in cui i ragazzi imparano.

- **Le cinque versioni**:
  1. **Analogia quotidiana**: collegare il concetto a un oggetto/situazione che tutti conoscono (es. corrente elettrica → acqua in un tubo).
  2. **Registro tecnico**: definizione formale, terminologia corretta, struttura logica. Per chi capisce meglio dalle parole esatte.
  3. **Modalità visiva**: schema, diagramma, mappa concettuale. Per chi capisce meglio dalle immagini.
  4. **Narrazione storica**: come è stata scoperta la cosa, chi l'ha capita per primo, perché era importante. Per chi ricorda meglio dalle storie.
  5. **Gioco/manipolazione**: un piccolo esperimento, una simulazione, un quiz interattivo. Per chi capisce meglio facendo.

- **Pattern**: chiedere all'IA tutte e cinque insieme, sullo stesso concetto, in un unico turno. Poi scegliere a freddo le 2-3 che funzionano meglio per la propria classe.

- **ChatDemo portante** (~200 parole). Caso: docente di matematica, terza superiore, concetto delle funzioni inverse. ChatDemo mostra le cinque versioni che l'IA produce (analogia col tasto "annulla" del telefono, definizione formale come *f(g(x)) = x*, schema di due funzioni che si specchiano sulla retta *y=x*, storia di come Newton e Leibniz pensavano alle inverse delle derivate, mini esercizio "indovina chi è l'inversa di...").

- **On the fly in classe**: come usare lo stesso prompt sul cellulare/tablet quando uno studente non capisce dopo la spiegazione standard. Pattern operativo: ti accorgi che lo sguardo si è spento → chiedi all'IA un'angolazione diversa → la rielabori tu in voce → torni alla lavagna.

- **Distinguere da "Materiali differenziati"** (L3, prossima lezione). Qui è **laterale**: stessa difficoltà, modi diversi di intercettare lo stile cognitivo. La prossima è **verticale**: stesso argomento, livelli diversi di difficoltà. Le due tecniche si combinano: prima ti chiedi "che livello?" (L3), poi "che stile?" (L2).

- **Callout `:::tip` "Modalità visiva senza skill di disegno"**: se la modalità visiva richiede un diagramma e non hai tempo di farlo, l'IA può produrre l'ASCII di base o suggerire uno schema da ricopiare in 30 secondi alla lavagna. Niente generazione di immagini complicate: la lavagna del docente è meglio.

- **Cosa NON fare** (~100 parole): proporre tutti e cinque i modi alla stessa classe nella stessa lezione (è confusione, non differenziazione); usare il modo "narrazione storica" se il dato storico è incerto senza verificarlo (rischio di mito didattico tramandato).

- **Approfondisci per la tua disciplina**: `deepen-explain-in-five-ways.txt`. Schema standard.

- Transizione: "Diversi modi di spiegare la stessa cosa coprono lo stile cognitivo della classe. Ma la classe non è omogenea anche per livello: c'è chi è avanti e chi è indietro sullo stesso argomento. La prossima lezione parla di questo."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task C1-C7

Vedi sequenza standard. Adattamenti:
- Step 5 (`deepen-explain-in-five-ways.txt`): la domanda 4 diventa "Quale concetto specifico vuoi spiegare in cinque modi (titolo, livello della classe, dove i ragazzi tipicamente si bloccano)?".

---

## Phase D — Lezione 3: Materiali differenziati per livello (`differentiated-materials`)

**Slug**: `differentiated-materials` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`, `draft-professional-documents`

### Brief di lezione

Stesso argomento, livelli verticali di difficoltà: scheda di consolidamento, scheda standard, scheda di approfondimento. Pattern *un solo testo base, tre derivati* per evitare il drift di contenuto.

- **Apertura** (~100 parole). Distinzione netta da L2 (per stile, laterale): qui è verticale, per livello. Caso d'uso tipico: classe disomogenea, recupero in classe parallelo al gruppo principale, unità didattica che dura più giorni e devi tenere agganciati sia i veloci sia i lenti.

- **Pattern *un solo testo base, tre derivati***: il docente scrive (o assembla dal manuale) UN testo di riferimento, allo standard di classe. Poi chiede all'IA di derivarne due varianti: una "di consolidamento" (lessico più semplice, frasi più corte, esempi più concreti, esercizi che chiedono di applicare, non di analizzare) e una "di approfondimento" (lessico più ricco, esempi più astratti, esercizi che chiedono di confrontare o argomentare). Il testo base resta uguale; le varianti sono adattamenti, non rielaborazioni indipendenti. Evita il drift di contenuto fra i tre livelli.

- **Tre regole operative**:
  1. **Stesse risposte alle domande di verifica**. Una scheda di consolidamento e una di approfondimento, se ben fatte, devono ammettere risposte corrette compatibili sulla stessa domanda di base. Variano profondità e lessico, non i fatti.
  2. **Stesso tempo di lavoro**. Le tre schede devono richiedere lo stesso tempo nominale (tipico errore: la scheda di approfondimento ha il doppio degli esercizi della consolidamento). Chiedere esplicitamente all'IA il vincolo di tempo.
  3. **Glossario comune**. I termini chiave del testo base appaiono in tutte e tre le varianti (gli studenti devono poterli usare al confronto orale o nella verifica successiva). Cambia il *come* sono spiegati, non *quali*.

- **ChatDemo portante** (~200 parole). Caso: storia, classe di prima superiore, tema "le riforme di Costantino". Testo base di una pagina. ChatDemo mostra le tre varianti, evidenziando dove la consolidamento semplifica senza eliminare termini chiave (Editto di Milano, *capitatio*, sede a Costantinopoli) e dove l'approfondimento aggiunge confronto (perché Roma non bastava più? cosa cambia con la divisione dell'impero?).

- **Callout `:::tip` "Per scuola primaria"**: schema diverso. Le tre varianti tendono a non funzionare con bambini fra 6-10 anni (i livelli sono troppo vicini per essere percepiti). Pattern alternativo: testo base + scheda di consolidamento (immagini, frasi più corte, esercizio motorio o manipolativo) come unica variante. L'approfondimento per bambini avanzati prende altre forme (compito di realtà, ruolo di tutor del compagno).

- **Callout `:::note` "Combinare per stile e per livello"**: il vero pattern docente è L2 × L3. Per la stessa unità didattica: livello (consolidamento/standard/approfondimento) × stile (analogia/tecnico/visivo/storico/gioco). Non serve produrre 15 varianti; basta scegliere 3-4 combinazioni utili alla classe specifica.

- **Cosa NON fare** (~100 parole): far generare le tre varianti SENZA il testo base (l'IA reinventa il contenuto e perdi controllo); etichettare le schede in classe come "facile/medio/difficile" (gli studenti se ne accorgono, vergogna sulla scheda "facile"). Etichette neutre: A/B/C, oppure colori.

- **Approfondisci per la tua disciplina**: `deepen-differentiated-materials.txt`. Schema standard.

- Transizione: "Differenziare per livello copre le classi disomogenee per preparazione. Ma alcuni studenti hanno bisogni specifici che non sono questione di livello: dislessia, ADHD, disturbi dell'attenzione, sostegno. La prossima lezione parla di questo."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task D1-D7

Vedi sequenza standard. Adattamenti:
- Step 5 (`deepen-differentiated-materials.txt`): la domanda 4 diventa "Hai un testo base (paragrafo del manuale, scheda standard) su cui costruire le varianti? Quanti livelli ti servono?".

---

## Phase E — Lezione 4: Inclusività (BES e DSA) (`inclusive-materials`)

**Slug**: `inclusive-materials` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`, `images-and-files`

### Brief di lezione

Adattare materiali per Bisogni Educativi Speciali (BES) e Disturbi Specifici dell'Apprendimento (DSA). Non è "scheda più facile": è accessibilità. Tono di rispetto: il docente di sostegno o il referente DSA conoscono lo studente, l'IA è un acceleratore di lavoro su materiali, mai un sostituto del lavoro psico-pedagogico.

- **Apertura** (~120 parole). Distinguere subito: differenziazione per livello (L3) ≠ inclusività. Uno studente DSA può essere ad alto rendimento cognitivo e avere bisogno solo di accessibilità (font, layout, schemi). Glossa inline di BES, DSA, PEI, PDP.

- **Tre assi di adattamento**:
  1. **Accessibilità grafica**: font ad alta leggibilità (es. Easy Reading, OpenDyslexic, Atkinson Hyperlegible), interlinea ampia, spaziatura fra le parole, righe più corte, niente giustificato (la giustificazione crea "fiumi" di spazi che destabilizzano la lettura dislessica). L'IA può guidarti nella riscrittura del testo per ridurre densità senza ridurre contenuto.
  2. **Sintesi visiva**: mappe concettuali, schemi a blocchi, timeline. L'IA propone strutture; il docente le valida. Per dislessia, ADHD, alcune forme di disturbo dell'attenzione le mappe sono spesso più efficaci del paragrafo lineare.
  3. **Semplificazione sintattica che preserva il contenuto**: frasi corte, subordinate ridotte, lessico controllato MA terminologia chiave preservata. Il rischio dell'"IA fa la versione facile" è perdere termini chiave e mettere lo studente in svantaggio alla verifica.

- **ChatDemo portante** (~200 parole). Caso: docente di italiano, secondo anno superiori, capitolo su Petrarca (*Canzoniere*). Studente con DSA dislessia. ChatDemo mostra la versione standard del paragrafo del manuale (lessico denso, frasi lunghe, riferimenti culturali impliciti) e la versione adattata (stesso contenuto, frasi più corte, glosse inline dei termini classici, schema visivo dei temi del Canzoniere).

- **Callout `:::caution` "L'IA non sostituisce il referente DSA"**: i materiali generati con l'IA vanno SEMPRE validati dal docente di sostegno o dal referente DSA dell'istituto, perché conoscono lo specifico studente, il PDP, le strategie già concordate con la famiglia. L'IA è un acceleratore di tempo, non un consulente psico-pedagogico.

- **Callout `:::tip` "Materiali esistenti da adattare"**: spesso il docente parte da una scheda standard già pronta e deve adattarla in fretta. Pattern: foto/scan della scheda → upload nell'IA (prerequisito M2L7 *Foto, immagini e file*) → "riscrivi questa scheda mantenendo gli stessi obiettivi e gli stessi termini chiave, con [vincoli di accessibilità specifici]". Più rapido che riscriverla da capo.

- **Callout `:::caution` "Privacy dello studente"**: niente nome dello studente, niente dettagli della diagnosi, niente dettagli familiari nella chat. Il prompt parla di "uno studente DSA dislessia" non di "Marco di seconda B". Privacy dei minori rinforzata, vedi M5L9.

- **Cosa NON fare** (~100 parole): chiedere all'IA di "valutare il livello di gravità della dislessia" o cose simili (non è uno strumento diagnostico); ignorare il PDP esistente per generare un materiale "su misura" che contraddice strategie già decise; stigmatizzare con etichette ("scheda DSA") sul materiale che riceve lo studente.

- **Approfondisci per la tua disciplina**: `deepen-inclusive-materials.txt`. Schema standard, domanda 4 adattata: "Quale specifico bisogno educativo speciale vuoi affrontare (DSA dislessia/disgrafia/discalculia, ADHD, BES non DSA, sostegno) e su quale materiale stai lavorando in questi giorni?".

- Transizione: "Una volta che le lezioni sono progettate e i materiali differenziati e inclusivi, il momento successivo del ciclo didattico è valutare. La prossima lezione parla di come l'IA aiuta a costruire le domande di verifica."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task E1-E7

Vedi sequenza standard. Adattamenti specifici già nel brief.

---

## Phase F — Lezione 5: Domande per verifiche (`generate-assessment-questions`)

**Slug**: `generate-assessment-questions` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `when-to-trust-it`

### Brief di lezione

Costruire batterie di domande di verifica: aperte, multiple, vero/falso, problem-solving. Distrattori sensati, taratura sulla tassonomia di Bloom. **Filo rosso anti-cheating**: callout breve.

- **Apertura** (~100 parole). L'IA è veloce a generare 20 domande; il problema è che 15 sono banali e 3 sono ambigue. Il valore del docente sta nella scelta e nella taratura, non nella produzione in volume.

- **Quattro formati di domanda + criteri di costruzione**:
  1. **Aperte**: per misurare comprensione e capacità di costruire un discorso. Prompt: "tre domande aperte sul capitolo X, livello [livello di Bloom], rispondibili in 5-10 righe". Verificare che le domande chiedano UNA cosa precisa, non un saggio implicito.
  2. **Multiple choice**: per misurare riconoscimento e applicazione. Quattro alternative, una corretta, tre distrattori plausibili (errori tipici degli studenti, non assurdità). Prompt: "per ogni distrattore, dimmi *perché* uno studente potrebbe sceglierlo". Se l'IA non sa rispondere, il distrattore non è plausibile.
  3. **Vero/falso**: utile solo per fatti netti, raro nelle materie complesse. Prompt: "evita V/F su questioni interpretabili". L'IA tende a produrre V/F su affermazioni sfumate, dove la risposta dipende dal contesto.
  4. **Problem-solving** (per matematica, fisica, chimica, economia, programmazione): casi, esercizi, problemi con dati. Prompt: "tre problemi di livello [Bloom], con la soluzione passo-passo separata; varia il livello di difficoltà fra i tre".

- **Tassonomia di Bloom come griglia** (callout `:::note` o sezione breve): ricordare → comprendere → applicare → analizzare → valutare → creare. Una verifica equilibrata copre 3-4 livelli, non si concentra solo sul ricordare (test sterile) né solo sul creare (rischio sterilità inversa di "che ne pensi tu di X").

- **ChatDemo portante** (~200 parole). Caso: storia, terza superiore, capitolo sulla prima guerra mondiale. ChatDemo mostra la generazione di una batteria di 6 domande di formati misti (2 aperte, 3 multiple, 1 problem-solving su un caso storico). Per le multiple, l'IA spiega il "perché" di ogni distrattore. Per la problem-solving, propone un caso ("se Italia fosse stata neutrale, quali conseguenze avrebbe avuto sul fronte italo-austriaco?").

- **Callout filo rosso `:::tip` "Domande che reggono allo studio con IA"**: gli studenti hanno l'IA per ripassare. Una verifica significativa non è "fai domande che l'IA non può rispondere" (impossibile), è "fai domande che lo *studente* non può rispondere solo memorizzando le risposte dell'IA". Formati che reggono meglio: applicazione su casi nuovi della classe (es. un articolo di giornale visto ieri), collegamento con un esempio fatto dal docente in un'altra lezione, vincolo formale stretto (in 5 righe esattamente, con almeno due termini del glossario di unità). Rimando esplicito a L8 (*Quando lo studente usa l'IA*) per il quadro complessivo del problema.

- **Callout `:::tip` "Anki / Quizlet / quiz online"**: l'IA può produrre il formato CSV per Anki, JSON per Quizlet, o set di domande per Kahoot / Mentimeter / Wooclap. Glossato brevemente.

- **Callout `:::caution` "Verifica delle domande prima dell'esame"**: una domanda generata dall'IA può essere ambigua, fattualmente sbagliata, o presupporre contenuti non visti in classe. Sempre due passate: leggi tutto, poi prova a rispondere tu come se fossi uno studente medio.

- **Cosa NON fare** (~100 parole): far generare la verifica completa senza riscrivere niente (uniforme nello stile, sospetta); affidarsi all'IA per la correttezza tecnica delle domande (matematica, formule chimiche, date storiche → verificare sempre); fare domande "trabocchetto" su trafiletti di nota che la classe non ha mai visto.

- **Approfondisci per la tua disciplina**: `deepen-generate-assessment-questions.txt`. Schema standard, domanda 4: "Su quale argomento del programma vuoi costruire la verifica e che formato di domande prevedi (aperte, multiple, problem-solving, mix)?".

- Transizione: "Domande pronte significa verifiche somministrabili. Ma poi va corretto. La prossima lezione parla di come l'IA aiuta a correggere senza diventare lei il giudice."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task F1-F7

Vedi sequenza standard.

---

## Phase G — Lezione 6: Correggere con criterio (`grading-with-criteria`)

**Slug**: `grading-with-criteria` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `when-to-trust-it`, `data-and-tables`

### Brief di lezione

L'IA come assistente di correzione, non giudice. Rubrica esplicita, prima passata IA su un campione, verifica a campione del docente, decisione finale del docente. **Filo rosso anti-cheating**: callout su indicatori manuali di sospetta IA negli elaborati.

- **Apertura** (~120 parole). Tre principi non negoziabili da fissare subito:
  1. La rubrica viene PRIMA dell'IA, non dall'IA. La scrivi tu (eventualmente con l'aiuto dell'IA per metterla in forma), non l'IA da sola.
  2. La decisione finale è tua. L'IA non emette voti che vanno sul registro.
  3. Gli elaborati vanno anonimizzati prima di caricarli in chat (vedi privacy in fondo).

- **Workflow in 5 passi**:
  1. **Scrivere la rubrica esplicita**: criteri (es. comprensione del testo, argomentazione, lessico, forma), livelli (gravemente insufficiente → eccellente), descrittori operativi per ogni livello. L'IA può aiutarti a renderla coerente e a riempire i descrittori che ti vengono asciutti.
  2. **Prima passata IA su un campione (3-5 elaborati)**. Carichi gli elaborati anonimizzati + la rubrica, chiedi all'IA di applicare la rubrica esplicitamente (per ogni elaborato, per ogni criterio, il livello + una riga di motivazione).
  3. **Verifica a campione**. Tu correggi gli stessi 3-5 elaborati indipendentemente. Confronta con quello che ha fatto l'IA. Dove non concordate, la regola è "ha ragione il docente": ma capire *perché* l'IA ha sbagliato ti dice se la rubrica è ambigua (rischio bias).
  4. **Estensione al resto della classe**. Se la prima passata regge, fai applicare la rubrica all'IA sull'intero set, poi rilegge il docente solo per scorrere e firmare. Se non regge, riscrivi la rubrica.
  5. **Restituzione individuale**. Il commento allo studente lo scrivi tu, usando la rubrica come scheletro. L'IA può proporti una bozza di feedback, MA il commento va letto a freddo e rifirmato a mano dal docente.

- **ChatDemo portante** (~200 parole). Caso: italiano, quinta superiore, tema di analisi del testo su un sonetto di Foscolo. Rubrica con quattro criteri (comprensione, analisi formale, contestualizzazione, lessico). ChatDemo mostra l'applicazione dell'IA su un elaborato fittizio: per ogni criterio, livello + motivazione di una riga. Mostra anche un caso di disaccordo: l'IA dà "buono" su contestualizzazione, il docente dà "sufficiente" perché lo studente confonde Foscolo con Leopardi in un passaggio chiave. La rubrica viene aggiustata per renderla più discriminante.

- **Callout filo rosso `:::tip` "Indicatori manuali di sospetta IA"**: nell'elaborato che stai correggendo, segnali che fanno alzare un sopracciglio (ipotesi, non prove): uniformità di registro inappropriata per il livello, citazioni "perfette" ma inverificabili, struttura troppo geometrica per uno studente medio, scomparsa dei tipici errori personali (lo studente che fa sempre confusione fra "perché" e "perchè" all'improvviso scrive perfetto), uso di parole rare mai sentite in classe. Sono indizi, non prove. Cosa farci → L8 (*Quando lo studente usa l'IA*). Rimando esplicito.

- **Callout `:::caution` "Privacy: anonimizzare prima di caricare"**: niente nomi sugli elaborati prima di caricare in chat (ChatGPT/Claude/Gemini consumer). Rinominare PDF "elaborato-01.pdf, elaborato-02.pdf", cancellare intestazione nome-classe-data, oppure usare strumenti che oscurano i nomi automaticamente. Per istituti con piano Team/Enterprise, regole diverse (vedi M5L9). Per elaborati con dati personali oltre il nome (es. tema autobiografico) considerare se vale la pena caricare o se la correzione resta tutta a mano.

- **Callout `:::note` "Tabella di valutazione"**: prerequisito M3L5 (*Lavorare con dati e tabelle*) per chi vuole esportare i livelli applicati in foglio Excel/Sheets per il registro. L'IA può produrre la tabella direttamente; verificare cella per cella prima di copiare.

- **Cosa NON fare** (~100 parole): caricare i nomi reali degli studenti; usare l'IA come "secondo correttore alla pari" senza la passata di verifica del docente; trascrivere il voto numerico dell'IA sul registro senza rilettura.

- **Approfondisci per la tua disciplina**: `deepen-grading-with-criteria.txt`. Schema standard, domanda 4: "Hai una rubrica già scritta o devi costruirla? Su che tipo di elaborato (tema, esercizio, problem-solving, presentazione, esposizione orale)?".

- Transizione: "Hai progettato, differenziato, valutato. C'è un'ultima dimensione del lavoro del docente che l'IA può aiutare: comunicare con le famiglie. La prossima lezione parla di questo."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task G1-G7

Vedi sequenza standard.

---

## Phase H — Lezione 7: Comunicare con le famiglie (`emails-to-families`)

**Slug**: `emails-to-families` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `write-better`, `hard-emails`

### Brief di lezione

Email delicate ai genitori: voti bassi, segnalazioni comportamentali, convocazioni a colloquio. Pattern dei tre passi ereditato da M3L1, calibrato su tre registri (primaria, secondaria, università). Privacy rinforzata su dati di minori.

- **Apertura** (~120 parole). La parola sbagliata nella mail al genitore può costare un colloquio non risolutivo, una scalata in segreteria/dirigenza, in casi estremi un cambio di sezione o un ricorso. Il problema non è di tono (lo sai gestire), è di TEMPO: tre mail così alla settimana mangiano due ore. L'IA serve a comprimere il tempo, non a sostituire la sensibilità.

- **Tre registri**:
  1. **Primaria (classi 1-5)**: tono familiare-cordiale, formule di vicinanza affettiva, attenzione esplicita al fatto che il bambino ha 6-10 anni e gli errori sono di crescita. Esempio: "Caro/a [genitore], volevo aggiornarLa su una situazione che ho notato in classe…".
  2. **Secondaria** (medie + superiori, classi 6-13): tono istituzionale ma vicino. Il ragazzo è co-destinatario implicito (la mail viene letta in famiglia). Esempio: "Gentile [genitore], Le scrivo per condividere un'osservazione su [nome]…".
  3. **Università**: tono formale. Spesso lo studente è maggiorenne; la comunicazione al genitore può essere inappropriata o vietata (privacy dello studente adulto). Se la comunicazione va comunque a famiglia, deve essere autorizzata dallo studente. Tono burocratico-istituzionale.

- **Pattern in 3 passi** (ereditato da M3L1, riformulato in autonomia senza riferimento):
  1. **Racconta la situazione completa** all'IA. Vincoli: niente nomi (usa "lo studente", "il bambino", "la famiglia"); niente dettagli sanitari; niente prima persona del minore. Cosa è successo, cosa hai osservato, cosa vuoi comunicare, qual è l'obiettivo della mail (informare? convocare? chiedere collaborazione? segnalare a sostegno?).
  2. **Chiedi tre versioni con registri diversi**. Una più asciutta, una più calda, una più formale. Non scegli la "giusta": componi la tua da pezzi.
  3. **Componi la tua da pezzi**, rileggi a freddo, prima di inviare. Il "a freddo" è importante: per email delicate, scrivile la sera e inviale la mattina dopo.

- **ChatDemo portante** (~200 parole). Caso: secondaria di primo grado, segnalazione a famiglia di un calo improvviso del rendimento (era ottimo, ora insufficiente). Mail anonima. ChatDemo mostra il prompt completo (situazione anonimizzata + obiettivo + tre vincoli), poi le tre versioni dell'IA (asciutta, calda, formale), poi la versione ricomposta dal docente che pesca un'apertura calda + il corpo asciutto + una chiusura formale aperta al colloquio.

- **Casi sensibili** (sezione breve, ~150 parole):
  - **Voto basso/insufficienza**: niente parole emotive ("preoccupante", "grave"), descrizione fattuale + apertura al colloquio.
  - **Comportamento**: niente etichette di tratto ("è aggressivo", "è pigro"), solo descrizione di episodi specifici.
  - **Sospetta segnalazione DSA/BES**: NON è la mail giusta per dirlo. Mai diagnosticare in mail. Mail apre solo a colloquio in presenza dove il referente DSA sarà presente.
  - **Convocazione urgente**: niente "subito" o "appena possibile" senza data e ora concrete proposte. Tre date, formula breve, ricevuta di lettura solo se prassi istituto.

- **Callout `:::caution` "Privacy dei minori"**: rinforzata rispetto a M3L1. Niente nome del bambino nella chat. Niente nomi di altri compagni coinvolti ("ha discusso con [nome]"  → "ha discusso con un compagno"). Niente dettagli sanitari ("è asmatico", "prende il farmaco X"). Niente dettagli familiari ("la madre è separata", "il padre lavora fuori"). Glossa: anche se tu sai tutto, la chat non lo deve sapere.

- **Callout `:::tip` "Quando NON scrivere la mail"**: se il fatto è grave (violenza, atto sessuale, sospetto di violenza familiare, autolesionismo), la mail non è lo strumento: c'è una procedura interna che coinvolge la dirigenza, il referente bullismo, eventualmente i servizi sociali. L'IA è per le mail di routine, non per quelle gravi. Mantieni il principio "fammi consulenza se sono incerto, ma su questo no, segui la procedura".

- **Cosa NON fare** (~100 parole): mandare la mail senza rileggerla a freddo; lasciare i nomi nella chat anche solo per "fartela scrivere meglio"; usare il "ChatGPT mi ha detto che…" come fonte di autorità in una comunicazione (è una sciocchezza istituzionale).

- **Approfondisci per la tua disciplina**: `deepen-emails-to-families.txt`. Schema standard, domanda 4: "Che tipo di mail vuoi preparare (calo di rendimento, comportamento, convocazione, segnalazione, comunicazione di routine) e in che ordine di scuola?".

- Transizione: "Hai i materiali, le verifiche, le comunicazioni. Resta una dimensione del lavoro del docente che l'IA non aiuta ad accelerare, ma a riconoscere: quando l'IA è in classe non dalla tua parte. La prossima lezione parla di questo."

- `<LlmExercise variant="review">`.

- Lunghezza target: 1100-1300 parole.

### Task H1-H7

Vedi sequenza standard.

---

## Phase I — Lezione 8: Quando lo studente usa l'IA (`when-students-use-ai`)

**Slug**: `when-students-use-ai` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `when-to-trust-it`

**Pattern note**: lezione **senza** sezione "Approfondisci per la tua disciplina". Solo `<LlmExercise variant="review">` di chiusura.

### Brief di lezione

Riconoscere senza demonizzare. AI detector inaffidabili, indicatori manuali come ipotesi, ridisegno consegne come strategia primaria, conversazione con lo studente sul sospetto.

- **Apertura** (~120 parole). L'IA non si scopre, si **vede**. Si vede in tre punti: nel testo (uniformità sospetta), nel processo (lo studente non sa difendere oralmente quello che ha scritto), nella consegna (il compito è formulato in un modo che l'IA risolve facilmente). Il modulo non insegna a giocare al gatto e al topo, insegna a progettare didattica robusta.

- **AI detector inaffidabili** (~150 parole). Turnitin AI, GPTZero, Copyleaks: tutti ammettono nei loro disclaimer ufficiali di non poter essere usati come prova unica. Falsi positivi documentati (testi umani classificati come IA al 90%+), falsi negativi documentati (testi IA leggermente modificati che passano sotto soglia). Citazione del disclaimer Turnitin: l'output va usato solo per "aprire una conversazione", non per "comprovare un illecito". Il modulo non istruisce su come configurare un AI detector: non ne vale la pena.

- **Tre approcci che funzionano**:

  1. **Indicatori manuali come ipotesi** (richiamo a L6, niente cross-link a M4): cinque segnali tipici:
     - Uniformità di registro inappropriata per il livello.
     - Citazioni "perfette" ma inverificabili (autore + opera + pagina che non esiste).
     - Struttura troppo geometrica per uno studente medio (introduzione → tre punti perfettamente paralleli → conclusione).
     - Scomparsa dei tipici errori personali (lo studente che fa sempre confusione su X all'improvviso non li fa più).
     - Uso di parole rare mai sentite in classe (lessico AI italiano: "panorama", "cruciale", "dirompente", "ecosistema") che la classe non usa.
     Sono **indizi, non prove**.

  2. **Ridisegnare le consegne** (~250 parole, è il cuore della lezione):
     - **Aggancio con un'esperienza di classe condivisa**: "Confronta quello che hai letto con l'esperimento che abbiamo fatto martedì". L'IA non è stata martedì in classe.
     - **Vincolo formale stretto**: "In 5 righe esatte, usando almeno due dei termini del glossario di unità che abbiamo costruito insieme". I vincoli specifici al corso filtrano.
     - **Dato locale specifico**: "Spiega l'inflazione usando il prezzo del caffè al bar di fronte alla scuola, che abbiamo discusso giovedì". L'IA non sa.
     - **Riferimento a un esempio del docente**: "Usa la metafora del bilanciere che ho fatto a febbraio per spiegare gli equilibri chimici". Idem.
     - **Compito a strati**: "Fase 1 in classe a mano (15 min, fotografata e consegnata), fase 2 a casa di approfondimento". Lo strato in classe è la firma.
     - **Riflessione meta**: "Scrivi due paragrafi su come hai costruito questa risposta, quali fonti hai usato, dove ti sei bloccato". L'IA non sa raccontare il processo dello studente.

  3. **Conversazione (non condanna)**:
     - **Caso del falso positivo**: studente onesto che ha scritto bene. Non accusare. Chiedere oralmente: "Sono curioso di sapere come hai costruito questo passaggio". Se sa difenderlo, è suo. Se non sa, era IA, o era memoria di una fonte mal digerita: in entrambi i casi va sistemato, ma con apprendimento, non con punizione.
     - **Caso ammesso**: lo studente ammette. Cosa fare: niente vendetta. Apri sul "perché", spesso è ansia da prestazione, sovraccarico, sensazione di non essere in grado. Pattern educativo: la consegna va rifatta a mano in tempo concordato (recupero), non zero punito a morte.
     - **Caso negato ma indizi forti**: senza prova oggettiva non si può sanzionare. Ma si può **ridisegnare la prossima consegna** in modo che il fenomeno non si ripeta (vedi sopra).

- **ChatDemo portante** (~150 parole). Caso non frontale: invece di mostrare un dialogo di scoperta, ChatDemo mostra una consegna PRIMA e DOPO il ridisegno. Caso: tema di italiano "Parla del rapporto fra Leopardi e la natura". Prima: IA risolve perfettamente. Dopo: "Confronta il rapporto Leopardi-natura con la lettura della *Ginestra* che abbiamo fatto martedì in classe. Cita almeno due passaggi del testo che abbiamo analizzato insieme e spiega in 5 righe perché ti hanno colpito o lasciato perplesso. L'osservazione personale deve essere coerente con quello che abbiamo annotato a margine".

- **Callout `:::caution` "Esami proctored e AI detector come strumento istituzionale"**: alcune università usano Turnitin AI in modo sistematico. Il docente non sceglie sempre. Indicazione: prendere l'output come uno degli elementi, mai come l'unico. Disclaimer Turnitin ufficiale citato.

- **Callout `:::note` "Il modulo non insegna anti-detection"**: dichiarazione esplicita. Curare il principio che il modulo serve a far progettare didattica robusta, non a giocare il ruolo del cacciatore.

- **Cosa NON fare** (~100 parole): basare un voto sul risultato di un AI detector; accusare uno studente senza colloquio orale prima; punire collettivamente la classe perché "qualcuno" usa l'IA; demonizzare l'uso dell'IA per studiare (era L2-L3-L5 del Modulo 4, ma il modulo qui non ci linka: lo si afferma come principio autonomo: l'IA come supporto allo studio è OK, l'IA che scrive al posto dello studente è dove tracci la linea).

- Transizione: "L'ultima lezione del modulo affronta la responsabilità del docente come ruolo professionale. Tre assi: onestà verso studenti e famiglie, privacy dei minori, valutazione che resta tua."

- `<LlmExercise variant="review">`.

- **Niente sezione "Approfondisci per la tua disciplina"** (vedi spec, è critica trasversale, non operativa).

- Lunghezza target: 1300-1500 parole (la più lunga del modulo, lo merita per densità del tema).

### Task I1-I7

Vedi sequenza standard, **omettendo lo Step 5** (deepen) sia in IT sia in EN.

---

## Phase J — Lezione 9: Etica del docente (`ethics-of-teaching`)

**Slug**: `ethics-of-teaching` · **Livello**: `intermedio` · **Prerequisiti**: `ask-well`, `privacy-basics`, `what-not-to-do`, `company-data-and-privacy`

**Pattern note**: lezione **senza** sezione "Approfondisci per la tua disciplina". Solo `<LlmExercise variant="review">` di chiusura. Lezione concettuale, pattern simile a M2L8 (*Cose da NON fare*).

### Brief di lezione

Chiusura del modulo. Tre assi di responsabilità specifica del docente: onestà verso studenti e famiglie, privacy dei minori, valutazione (la firma resta del docente). Esempi concreti di politiche d'istituto italiane ed estere (per EN). Ponte al Modulo 6.

- **Apertura** (~150 parole). Il docente è in una posizione asimmetrica: ha autorità sulla classe, vede dati personali dei minori, decide voti che pesano sulla loro vita. L'IA non cambia queste responsabilità, le moltiplica. Tre assi.

- **Asse 1: Onestà verso studenti e famiglie** (~250 parole). Se hai usato l'IA per preparare il materiale, **dillo** (proporzionalmente). Non c'è obbligo formale come per gli studenti universitari, ma c'è un principio educativo: chiedere onestà sull'uso dell'IA agli studenti senza dirgliela tu stesso è incoerente. Forme proporzionate:
  - Materiale standard (esercizi, schemi, definizioni): non serve dichiarare turno per turno, ma vale la pena dire "uso anch'io l'IA per preparare materiale" in apertura d'anno.
  - Comunicazioni a famiglie: la mail la firmi tu, scrivila tu, eventuale aiuto dell'IA non è significativo (è come usare un correttore ortografico).
  - Materiale che lo studente potrebbe interpretare come "ricerca originale del prof" (storie di vita del personaggio storico, aneddoti, racconti): qui sì, attenzione. Se l'IA ha inventato o approssimato, va verificato, e se resta dubbio meglio non usarlo.

- **Asse 2: Privacy dei minori** (~300 parole, è il blocco denso):
  - **Mai dati identificativi nelle chat consumer**: niente nome, cognome, classe specifica con nome scuola, dettagli sanitari, dettagli familiari, foto del bambino.
  - **Anche dati apparentemente innocui combinabili**: "alunno di 8 anni di seconda elementare di [nome scuola] che ha difficoltà a leggere" può identificarlo per chi conosce la scuola.
  - **Registro elettronico e IA**: il registro contiene dati sensibili. Se la piattaforma del registro integra IA (alcune piattaforme italiane lo stanno facendo: ARGO, Spaggiari, Mastercom), leggere le policy specifiche prima di usare la feature. Se non sai cosa fa l'integrazione, non usarla.
  - **Foto e video di classe**: mai caricati in chat IA per "fammi una didascalia" o simili. Le foto di minori sono dato particolarmente sensibile e regolato dal GDPR (categorie particolari).
  - **Cosa puoi fare**: anonimizzare alla fonte. "Uno studente di scuola media inferiore con segnalazione DSA dislessia" è un caso astratto utilizzabile. "Marco di seconda B della Don Bosco di Pisa" non lo è mai.
  - **Piano Team/Enterprise se istituto**: alcune scuole/università hanno contratti enterprise con ChatGPT (ChatGPT Edu, lanciato per università), Microsoft Copilot for Education, Google Workspace for Education con Gemini integrato. Queste hanno data retention e training opt-out più stringenti dei piani consumer, MA continuano ad applicarsi le regole GDPR sui minori. Il piano non è una licenza per buttarci dentro tutto.

- **Asse 3: Valutazione che resta del docente** (~200 parole). L'IA non emette voti. Mai. Anche se la rubrica è automatica, il voto sul registro va deciso dal docente. Il rischio è di slittare progressivamente: prima la rubrica, poi il voto suggerito, poi il voto applicato, poi… il docente si trova a ratificare. La linea: l'IA assiste la correzione, il docente firma. La firma sul registro non è solo una formalità: è la responsabilità professionale.

- **Politiche d'istituto** (~200 parole, callout `:::note` o sezione breve). Esempi di documenti pubblicati al 2026:
  - **Italia**: linee guida del Ministero dell'Istruzione e del Merito (controllare versione corrente; al 2026 esiste una bozza di indicazioni). Università: Polimi (linee guida sull'uso di IA generativa, 2024+), Bocconi (policy didattica IA), Sapienza (gruppo di lavoro permanente).
  - **Estero (per mirror EN)**: Common Core USA (linee guida statali variano per Stato; California e New York hanno linee guida AI), Department for Education UK (statement 2023, aggiornato 2024-2025), International Baccalaureate (policy aggiornata 2023+).
  Il principio non sono i dettagli, sono i punti chiave: trasparenza dell'uso, divieto sui dati di minori in chat pubbliche, mantenimento della valutazione umana, formazione del docente. Le politiche evolvono velocemente: alla scrittura della lezione, verificare quali documenti sono pubblicati e citabili.

- **La regola "chi firma"** (~150 parole). Eredità da M2L8, riformulata per il docente. Tre casi pratici:
  - **Voto sul registro**: firma il docente. L'IA non firma.
  - **Mail al genitore**: firma il docente. La sensibilità del messaggio è sua.
  - **Materiale didattico**: firma il docente nella misura in cui lo presenta come suo. Se il materiale è IA-generato senza revisione, firmarlo come proprio è disonesto verso la classe.

- **Cosa NON fare** (~100 parole, sezione di chiusura): mettere voti dell'IA sul registro; caricare foto degli studenti per qualsiasi motivo in chat consumer; bypassare la procedura interna di gestione di situazioni gravi delegandone l'analisi all'IA; fingere di non usare l'IA mentre chiedi ai tuoi studenti onestà sull'uso che ne fanno.

- **Ponte al Modulo 6** (~80 parole). Per chi vuole capire cosa c'è dietro al funzionamento dell'IA, integrarla in strumenti propri, sviluppare app educative o configurare i propri "agenti didattici", il Modulo 6 (*Per chi vuole di più*) è il prossimo passo. È più tecnico (developer / utenti tecnici); non è obbligatorio per nessun docente.

- `<LlmExercise variant="review">`.

- **Niente ChatDemo** (lezione concettuale, come M2L8 e M4L8). Tutti gli esempi in linea o in box.

- **Niente sezione "Approfondisci per la tua disciplina"**.

- Lunghezza target: 1400-1600 parole (lezione di chiusura, leggermente più ampia per coprire i tre assi).

### Task J1-J7

Vedi sequenza standard, **omettendo lo Step 5** (deepen) sia in IT sia in EN.

---

## Phase K — Module closure

Una tantum. Pubblica le card della homepage e della start-here (IT + EN), portandole da `comingSoon: true` a link reali verso la prima lezione del modulo (`design-a-lesson`).

### Task K1: Attivare la card Modulo 5 in homepage IT

**Files:**
- Modifica: `src/content/docs/it/index.mdx` (riga ~52, card *Per docenti*)

- [ ] **Step 1: Togliere `comingSoon: true`, aggiungere `href`**

```mdx
{
  icon: 'users',
  title: 'Per docenti',
  description: "Progettare lezioni, personalizzare materiali, correggere compiti. L'IA come assistente in classe, non come sostituto.",
  href: '/it/for-teachers/design-a-lesson/',
},
```

### Task K2: Attivare la card Modulo 5 in homepage EN

**Files:**
- Modifica: `src/content/docs/en/index.mdx` (riga ~52, card *For teachers*)

- [ ] **Step 1: Togliere `comingSoon: true`, aggiungere `href`**

```mdx
{
  icon: 'users',
  title: 'For teachers',
  description: 'Lesson planning, tailored materials, grading. AI as a classroom helper, not a replacement.',
  href: '/en/for-teachers/design-a-lesson/',
},
```

### Task K3: Attivare la card Modulo 5 in start-here IT

**Files:**
- Modifica: `src/content/docs/it/start-here.mdx` (riga ~46, card *Insegno*)

- [ ] **Step 1: Togliere `comingSoon: true`, aggiungere `href`**

```mdx
{
  icon: 'users',
  title: 'Insegno',
  description: "Usare l'IA per progettare lezioni, creare materiali, valutare. Il lavoro del docente, affiancato non rimpiazzato.",
  href: '/it/for-teachers/design-a-lesson/',
},
```

### Task K4: Attivare la card Modulo 5 in start-here EN

**Files:**
- Modifica: `src/content/docs/en/start-here.mdx` (riga ~45, card *I teach*)

- [ ] **Step 1: Togliere `comingSoon: true`, aggiungere `href`**

```mdx
{
  icon: 'users',
  title: 'I teach',
  description: "Use AI to plan lessons, build materials, grade. The teacher's work, supported not replaced.",
  href: '/en/for-teachers/design-a-lesson/',
},
```

### Task K5: Aggiornare `CONTENT.md` a "modulo chiuso al 100%"

**Files:**
- Modifica: `CONTENT.md` (sezione Modulo 5 + sezione "Prossima sessione")

- [ ] **Step 1: Cambiare lo stato attuale del Modulo 5**

Sostituire `**Stato attuale**: 0 su 9 pubblicate. Struttura definita, scrittura da iniziare.` con la formula consolidata (vedi pattern Moduli 2-4):

```markdown
**Stato attuale**: **9 su 9 pubblicate, modulo Per docenti completo al
100%** (2026-MM-DD). Tutte le lezioni live (IT + EN) con verifica
dell'apprendimento attiva (sezione `<LlmExercise variant="review">`
prima di "Cosa viene dopo", con prompt dedicato in
`public/skills/<locale>/review-<slug>.txt`); lezioni 1-7 con
sezione "Approfondisci per la tua disciplina" attiva (file
`deepen-<slug>.txt`); sidebar Modulo 5 con tutte e 9 le lezioni
attive, nessun placeholder disabilitato; card "Per docenti" / "For
teachers" in homepage e start-here attive, puntano alla lezione 1.
```

- [ ] **Step 2: Aggiornare "Prossima sessione"**

Spostare il fuoco al Modulo 6 (*Per chi vuole di più*), come si è fatto per la chiusura dei moduli precedenti.

### Task K6: Commit della Fase K

- [ ] **Step 1: Build smoke + commit**

```bash
npm run build
git add src/content/docs/it/index.mdx src/content/docs/en/index.mdx \
        src/content/docs/it/start-here.mdx src/content/docs/en/start-here.mdx \
        CONTENT.md
git commit -m "Close Module 5 (Per docenti): activate homepage + start-here cards"
```

---

## Verifica intermedia (raccomandata, non bloccante)

Dopo ogni Fase B-J, prima di passare alla successiva:

- [ ] `npm run build` (smoke test). Se fallisce, fermare la sequenza e fixare prima di avanzare.
- [ ] `npm run dev` su una pagina della lezione appena pubblicata (visiva: layout, `<LlmExercise>` IT, `<LlmExercise>` EN se applicabile, `<ChatDemo>` se presente, tooltip `<Def>` se aggiunti).
- [ ] Aggiornare `CONTENT.md` allo stato `✅` per la lezione appena pubblicata.

## Decisioni rinviate alla scrittura

Spec § "Decisioni aperte, non bloccanti". Sintesi operativa:

- **Pattern grafico `<LlmExercise variant="deepen">`**: se al momento della scrittura della Fase B (M5L1) l'occhio non distingue abbastanza bene fra approfondimento e review, valutare l'introduzione di una terza variante nel componente. Tracciare la decisione nel commit della Fase B.
- **Filo conduttore cross-lezione**: se durante la scrittura emerge un caso (es. classe immaginaria che torna), consolidarlo dalla Fase C in avanti.
- **Politiche d'istituto in J (M5L9)**: verificare al momento della scrittura quali documenti sono pubblicati al 2026 e citabili.
- **Glossario**: tre voci candidate (PEI, PDP, BES) da decidere se aggiungere in glossario.mdx, in alternativa glossarle inline via `<Def>`. Decisione rinviata alla scrittura della Fase D (`differentiated-materials`) o della Fase E (`inclusive-materials`), dove i termini compaiono per la prima volta.
