# Modulo 5 "Per docenti": design

Data: 2026-05-16
Stato: spec validato con l'utente, pronto per il piano di implementazione.

## Obiettivo

Definire la struttura definitiva del Modulo 5 di AI-Guide ("Per docenti")
prima di iniziare la scrittura delle lezioni. Questo documento fissa:

- target (primaria + secondaria + università + formatori adulti, con
  baricentro su secondaria + università),
- taglio editoriale (generalista trasversale + pattern di approfondimento
  per disciplina via prompt da incollare nella propria IA),
- peso del tema "riconoscere l'uso dell'IA da parte degli studenti"
  (lezione dedicata in chiusura + filo rosso in due lezioni operative),
- relazione con il Modulo 4 "Per studenti" (autonomia totale, nessun
  cross-link),
- numero e identità delle lezioni (9 lezioni),
- ordine pedagogico,
- slug (in inglese, da convenzione del progetto),
- livello (`intermedio` uniforme per tutte e 9),
- prerequisiti cross-module per lezione,
- disambiguazione esplicita dalle lezioni dei moduli precedenti che
  toccano temi vicini.

Le singole lezioni verranno scritte una alla volta, ciascuna con il
proprio ciclo di revisione (`analyze-lesson` + `integrate-questions` +
`style-checker`). Questo documento resta la fonte di verità per come
il modulo è organizzato.

## Contesto

Modulo 1 (Fondamenti) chiuso il 2026-04-19. Modulo 2 (Uso quotidiano)
chiuso il 2026-04-23. Modulo 3 (Sul lavoro) chiuso il 2026-04-25.
Modulo 4 (Per studenti) chiuso il 2026-05-13.

Il Modulo 5 serve insegnanti dalle primarie all'università, formatori
aziendali e divulgatori. Pubblico non tecnico ma con **competenza
didattica propria**: non bisogna spiegare cosa sia una rubrica di
valutazione o un BES, bisogna mostrare come l'IA si aggancia a quelle
pratiche senza sostituirle.

Il piano provvisorio in `CONTENT.md` elencava 9 voci; tutte e 9 sono
confermate. Tre voci hanno sovrapposizioni con lezioni dei moduli
precedenti da disambiguare (vedi sezione apposita).

## Target: primaria + secondaria + università + formatori adulti

Pubblico ampio. La spec assume questa segmentazione interna:

- **Primaria**: docenti con classi di bambini fra i 6 e i 10 anni.
  L'IA non è in mano agli studenti (niente account, niente smartphone in
  classe per la maggior parte degli istituti). L'uso del docente è
  prevalentemente di **preparazione** (materiali, schede, esercizi
  graduati). Il filo rosso "studenti che usano l'IA" è praticamente
  assente.
- **Secondaria** (medie + superiori): classi 11-19 anni. Gli studenti
  delle superiori hanno accesso autonomo a ChatGPT/Claude/Gemini.
  Compaiono compiti a casa portati dal cellulare, temi scritti con
  l'IA, ricerche copiate. Filo rosso "studenti che usano l'IA" è
  centrale.
- **Università**: docenti, ricercatori, tutor. Gli studenti sono
  adulti, scrivono tesi, paper, esami at-home. L'asticella della
  responsabilità si sposta: dichiarazione dell'uso, integrità
  accademica, AI detector.
- **Formatori aziendali e divulgatori**: corsi per adulti
  (riqualificazione, formazione continua, public speaking
  divulgativo). Niente registro, niente voti, niente famiglie, ma
  resto del modulo applicabile (progettare, materiali differenziati,
  spiegare in modi diversi, comunicare con i partecipanti).

**Baricentro pratico**: secondaria + università. La primaria viene
servita con esempi mirati nelle lezioni dove il caso d'uso è
trasversale (progettare una lezione, materiali differenziati,
inclusività, spiegare in cinque modi). Nelle lezioni dove la primaria
non è il caso d'uso naturale (comunicazione con le famiglie sì, ma
quando lo studente usa l'IA no), il taglio resta su secondaria +
università e la primaria è menzionata solo se rilevante.

I formatori e i divulgatori sono accolti dal taglio trasversale di
default e dal pattern di approfondimento personalizzato (vedi sotto).

## Taglio editoriale: generalista + approfondimento via prompt

Decisione utente 2026-05-16: il modulo è **generalista trasversale**,
con un pattern specifico per gestire il bisogno di calare ogni tecnica
sulla disciplina e sul livello del lettore.

### Generalista trasversale come default

Ogni lezione è scritta senza specializzazione disciplinare. Gli
esempi pescano a rotazione da:

- discipline umanistiche (italiano, storia, filosofia, latino),
- discipline scientifiche (matematica, fisica, scienze, informatica),
- lingue straniere (inglese, francese, tedesco, spagnolo),
- discipline pratiche e artistiche (arte, musica, educazione fisica,
  laboratori),
- contesti universitari (corso semestrale, seminario, laboratorio,
  esame orale).

Nessuna lezione è "lezione per insegnanti di matematica" o "lezione
per insegnanti di lingue". Tutte sono "lezione su un'attività
didattica trasversale, esemplificata su materie diverse".

### Approfondimento via prompt: il pattern del modulo

Decisione utente 2026-05-16. Il limite del taglio generalista è che
chi insegna chimica al triennio scientifico vuole esempi concreti
su chimica al triennio scientifico, non un sondaggio di tutte le
materie. Per coprire questo gap senza moltiplicare le lezioni il
modulo introduce un **pattern editoriale specifico**:

Ogni lezione operativa (1-7) chiude con una sezione "Approfondisci
per la tua disciplina" che mostra un prompt pronto da copiare e
incollare nella propria IA. Il prompt:

1. comunica all'IA il contesto della lezione (tecnica didattica
   appena descritta),
2. chiede all'IA di intervistare il docente su disciplina, livello
   scolastico, classe specifica, un esempio concreto su cui sta
   lavorando in questi giorni,
3. genera un approfondimento mirato (un'applicazione completa della
   tecnica calata sul caso del lettore).

Il pattern sfrutta il punto di forza dell'IA stessa per personalizzare
l'approfondimento, evitando di scrivere una lezione per disciplina e
restando nel principio "pratica prima della teoria" del progetto.

**Implementazione tecnica**: il prompt vive in un file di esercizio
dedicato che `<LlmExercise variant="practice">` espone per copia /
download / apertura. Convenzione filename: `deepen-<slug-lezione>.txt`
(es. `deepen-design-a-lesson.txt`), in pari passo IT + EN come per
tutti gli skill `.txt` del progetto.

Posizionamento nella struttura della lezione: **subito prima** della
sezione "Cosa NON fare" / "Verifica con la tua IA" / "Cosa viene
dopo", come ultima sezione di "lavoro vero" della lezione.

Lezioni che **non** hanno la sezione di approfondimento:

- Lezione 8 "Quando lo studente usa l'IA": è critica, non operativa.
  L'approfondimento per disciplina non si applica: gli studenti usano
  l'IA allo stesso modo trasversale.
- Lezione 9 "Etica del docente": è chiusura/concettuale, non operativa.

### Cosa il pattern NON è

- Non sostituisce la verifica dell'apprendimento di fine lezione
  (`<LlmExercise variant="review">`). Entrambe vivono nella lezione,
  una di seguito all'altra: prima l'approfondimento per disciplina
  (pratica calata sul lettore), poi la review (controllo del
  comprendere).
- Non è un cavallo di Troia per fare scrivere all'IA il materiale
  didattico del docente "chiavi in mano". Il prompt è esplicito: l'IA
  guida un esempio operativo, non produce una settimana di lezioni
  pronte. Il confine va presidiato nel testo del prompt stesso.
- Non riguarda le materie scolastiche italiane in modo esclusivo: nel
  mirror EN il prompt accomoda il sistema scolastico anglosassone
  (K-12, undergraduate, graduate) lasciando libero il docente di
  specificare il proprio contesto.

## Filo rosso anti-cheating + lezione dedicata

Decisione utente 2026-05-16: "lezione dedicata + filo rosso".

### Lezione dedicata (8): *Quando lo studente usa l'IA*

Riconoscere senza demonizzare. Apertura sul fatto che gli AI detector
(Turnitin AI, GPTZero, Copyleaks) sono inaffidabili, **tre approcci
realistici al problema**:

1. **Indicatori manuali**: segnali stilistici che fanno alzare un
   sopracciglio (uniformità di registro, citazioni "perfette" ma
   inverificabili, struttura troppo geometrica per il livello dello
   studente, scomparsa dei tipici errori personali). Sono ipotesi, non
   prove.
2. **Ridisegnare le consegne**: domande che l'IA fatica a fare bene
   (collegamento con la lezione di ieri, riferimento a un'esperienza
   personale dello studente, dato locale specifico, vincolo di
   forma molto stretto). Più efficace del detector.
3. **Conversazione, non condanna**: come parlarne con uno studente
   senza accusarlo a vuoto. Il caso del falso positivo (studente
   onesto che ha scritto bene) e il caso vero ammesso.

Il taglio è **costruttivo, non punitivo**: il modulo non insegna a
scoprire i bari, insegna a progettare didattica robusta in un mondo
dove l'IA esiste.

### Filo rosso: callout in due lezioni operative

In due lezioni del blocco "valutare" un callout breve (`:::tip` o
`:::note`) richiama il tema:

- **Lezione 5 "Domande per verifiche"**: callout breve sui formati
  di domanda che restano significativi anche se lo studente ha studiato
  con l'IA (domande di applicazione su casi nuovi, collegamento con
  un'esperienza di classe condivisa, vincoli specifici a corso e
  docente). Rimando esplicito alla lezione 8 per il quadro complessivo.
- **Lezione 6 "Correggere con criterio"**: callout breve sugli
  indicatori manuali ricorrenti quando si correggono temi/elaborati
  scritti con sospetta IA (uniformità di registro, citazioni che non
  reggono al check). Rimando esplicito alla lezione 8 per il "cosa fai
  con quel sospetto".

Niente filo rosso nelle altre lezioni: aggiungere callout ovunque
sposterebbe il tono del modulo verso "il pericolo IA" mentre il modulo
parla di "uso intelligente dell'IA per chi insegna".

## Autonomia totale dal Modulo 4 (Per studenti)

Decisione utente 2026-05-16. Il modulo non linka mai al Modulo 4.
Nessuna lezione dice "lo abbiamo visto dal lato studente" né rimanda
a lezioni di "Per studenti".

Motivi:

- **Il docente arriva qui senza aver letto Per studenti**. È un
  professionista che cerca pratiche didattiche per sé, non un lettore
  curioso che esplora il sito modulo per modulo.
- **Frammentazione cognitiva**: rimandi reciproci fra moduli paralleli
  costringono il lettore a saltare avanti e indietro per costruirsi il
  quadro. Funziona se il quadro è la promessa del sito. Qui la
  promessa è didattica operativa.
- **Coerenza editoriale**: ogni lezione si regge da sola. Eventuali
  concetti già trattati nel Modulo 4 ma serventi alla lezione del
  docente vengono **riformulati in autonomia** in chiave docente, con
  il proprio taglio.

I prerequisiti dichiarati nel frontmatter restano sui moduli **1-3**
(Fondamenti, Uso quotidiano, Sul lavoro) perché sono il percorso
canonico. Modulo 4 e Modulo 5 sono fratelli, non genitori l'uno
dell'altro.

## Struttura del modulo

Nove lezioni, ordinate pedagogicamente in **quattro blocchi**:
progettare → insegnare in classe → valutare → comunicare → chiudere.

| # | Slug (EN) | Titolo IT | Livello | Cosa insegna |
|---|-----------|-----------|---------|---------------|
| 1 | `design-a-lesson` | Progettare una lezione | `intermedio` | Apertura del modulo. Dal piano alla pratica: scaletta di una lezione di 50-90 minuti, gradazione degli obiettivi, attività agganciate, tempi realistici. Pattern *outline + riempimento* ereditato da M3L2 ma calibrato sul docente. Apertura con il contratto del modulo (IA come collega di prepararazione, non sostituto in classe). |
| 2 | `explain-in-five-ways` | Spiegare in cinque modi diversi | `intermedio` | Stessa nozione raccontata a pubblici diversi (analogia quotidiana, registro tecnico, modalità visiva, narrazione storica, gioco/manipolazione). Tecnica che torna utile sia in preparazione sia "on the fly" davanti alla classe quando uno studente non capisce. Distinguere la differenziazione PER STILE (laterale) dalla differenziazione PER LIVELLO (verticale: lezione 3). |
| 3 | `differentiated-materials` | Materiali differenziati per livello | `intermedio` | Stesso argomento, livelli verticali di difficoltà: scheda di consolidamento, scheda standard, scheda di approfondimento. Pattern *un solo testo base, tre derivati* per evitare il drift di contenuto. Quando il docente lavora su una classe disomogenea o su un'unità didattica che dura più giorni. |
| 4 | `inclusive-materials` | Inclusività: BES e DSA | `intermedio` | Adattare materiali per Bisogni Educativi Speciali e Disturbi Specifici dell'Apprendimento. Non è "scheda più facile": è accessibilità (font ad alta leggibilità, grafica pulita, mappe concettuali, semplificazione sintattica che preserva il contenuto). PEI e PDP come vincoli che il docente conosce. L'IA come acceleratore di lavoro su misura, mai sostituto del referente DSA/sostegno. |
| 5 | `generate-assessment-questions` | Domande per verifiche | `intermedio` | Verifiche e interrogazioni: domande aperte, multiple, vero/falso, problem-solving. Distrattori sensati. Calibrazione sulla tassonomia di Bloom. Callout di filo rosso sui formati che restano significativi se lo studente ha studiato con l'IA. |
| 6 | `grading-with-criteria` | Correggere con criterio | `intermedio` | L'IA come assistente di correzione, non come giudice. Rubrica di valutazione esplicita prima di iniziare, prima passata dell'IA su un sottoinsieme di elaborati, verifica a campione delle correzioni dell'IA, decisione finale del docente. Callout di filo rosso sugli indicatori manuali di sospetta IA. Privacy: anonimizzare gli elaborati prima di caricare. |
| 7 | `emails-to-families` | Comunicare con le famiglie | `intermedio` | Email delicate ai genitori: comunicazione di un voto basso, segnalazione di un problema comportamentale o di apprendimento, convocazione a colloquio. Pattern dei tre passi ereditato da M3L1 ma calibrato sul registro istituzionale (scuola/università), inclusa la differenza fra primaria (tono familiare-cordiale), secondaria (tono istituzionale ma vicino), università (tono formale). Privacy: niente nomi di terzi, niente dettagli sanitari, niente prima persona del minore. |
| 8 | `when-students-use-ai` | Quando lo studente usa l'IA | `intermedio` | Riconoscere senza demonizzare. AI detector inaffidabili, indicatori manuali come ipotesi (non prove), ridisegnare le consegne per renderle robuste, gestire il colloquio con lo studente sul sospetto (caso vero, caso falso positivo). Niente how-to detection: il modulo non insegna a giocare al gatto e al topo, insegna a progettare didattica che regge. |
| 9 | `ethics-of-teaching` | Etica del docente | `intermedio` | Chiusura del modulo. Tre asse di responsabilità specifica del docente: onestà verso studenti e famiglie (dichiarare l'uso dell'IA per preparazione materiali), privacy degli studenti (dati di minori, registro, comunicazioni delicate, foto e video di classe), valutazione (la firma resta del docente, l'IA non emette voti). Esempi concreti di policy d'istituto italiane (Ministero, USR regionali) ed estere. Ponte al Modulo 6 (Per chi vuole di più). |

## Ragionamento sull'ordine

**Blocco 1, progettare (1-4).** Si parte dal lavoro che il docente fa
**prima** di entrare in classe. Lezione 1 fissa il contratto del
modulo (IA in preparazione, non in classe) e copre la progettazione
canonica della singola lezione. Lezione 2 introduce un trucco di
preparazione che torna anche "on the fly" in classe (spiegare in più
modi), e lo distingue subito dalla differenziazione per livello
(lezione 3). Lezione 3 (verticale, per livello) e lezione 4 (per
bisogno specifico, BES/DSA) sono progressione naturale: dalla
gradazione di tutti gli studenti al lavoro mirato su chi ha un PEI o
un PDP.

**Blocco 2, valutare (5-6).** Output del docente nel ciclo
valutativo. Lezione 5 (creare le domande) viene prima di lezione 6
(correggere le risposte) perché è la sequenza temporale reale.
Entrambe portano il filo rosso anti-cheating con callout brevi.

**Blocco 3, comunicare (7).** Comunicazione esterna alla classe.
Eredita il pattern di M3L1 sulle email difficili ma lo calibra
specificamente sul registro scuola/famiglia, che è diverso dal
registro azienda/cliente.

**Blocco 4, critica e chiudere (8-9).** Lezione 8 affronta il tema
specifico "studenti che usano l'IA" in modo dedicato. Lezione 9
chiude sull'etica del docente come ruolo professionale e fa da
ponte al Modulo 6.

## Disambiguazione dalle lezioni dei moduli precedenti

Tre lezioni di Modulo 5 toccano temi che esistono nei moduli 1-3 con
un altro taglio. Differenziazioni esplicite, da preservare in fase di
scrittura.

### Lezione 1 *Progettare una lezione* vs M3L3 *Preparare una riunione*

- **M3L3**: workflow operativo per una riunione di lavoro. Ordine del
  giorno, owner, decisioni attese, estratto azionabile dopo.
- **M5L1**: workflow didattico per una lezione in classe. Obiettivi di
  apprendimento, gradazione degli stimoli, attività con tempi
  realistici, valutazione formativa in itinere. Il "dopo" non è un
  estratto di decisioni, è il bilancio didattico (cosa ha funzionato,
  cosa rimettere a fuoco la lezione successiva). Pubblico diverso
  (docente vs project manager), output diverso (lezione vs deliverable
  professionale), ritmo diverso (uno stimolo ogni 10-15 minuti vs un
  punto OdG ogni 10-30 minuti).

### Lezione 5 *Domande per verifiche* vs M4L3 *Ripassare prima di un esame* (lato studente)

- **Autonomia totale dichiarata** (vedi sezione "Autonomia dal Modulo
  4"). Niente cross-link.
- Per chiarezza interna: la lezione di studente parla di
  **interrogazioni simulate** generate dall'IA che fa le domande allo
  studente. La lezione di docente parla di **batterie di domande** che
  il docente userà nelle verifiche reali. Stesso output formale
  ("una domanda"), funzione opposta (allenare vs valutare),
  destinatario opposto (chi risponde vs chi corregge).
- La lezione del docente entra in profondità su: distrattori sensati
  nelle multiple, taratura sulla tassonomia di Bloom, varietà dei
  formati che il singolo studente non ha bisogno di gestire.

### Lezione 7 *Comunicare con le famiglie* vs M3L1 *Email difficili*

- **M3L1**: email professionali su parola sbagliata (dire di no,
  rispondere a chi ha sbagliato, dare feedback). Registro
  azienda/cliente/collega.
- **M5L7**: email scuola/famiglia. Registro istituzionale ma con
  attenzione affettiva (i destinatari sono genitori, non clienti). Il
  pattern in tre passi (racconta la situazione completa, chiedi
  versioni con registri diversi, componi la tua da pezzi) è ereditato
  e riformulato, **senza dire al lettore "lo abbiamo già visto in M3L1"**.
  Differenze sostanziali rispetto a M3L1:
  - presenza di minori al centro della comunicazione (privacy
    rinforzata, niente nomi di terzi, niente dettagli sanitari),
  - asimmetria emotiva (il genitore può leggere come critica
    personale ciò che è descrizione di un fatto),
  - tre registri distinti (primaria, secondaria, università) che la
    versione M3L1 non ha,
  - regola operativa "se la comunicazione contiene una decisione di
    classe o un giudizio formativo, va comunque vista a freddo da te
    e non solo dall'IA".

### Note di NON disambiguazione (autonomia totale)

Le seguenti lezioni del Modulo 5 condividono con il Modulo 4 lo stesso
mondo concettuale, ma per decisione utente non si linkano e non si
disambiguano esplicitamente. Sono trattate **come se il Modulo 4 non
esistesse**:

- M5L8 *Quando lo studente usa l'IA* (specchio inverso di M4L8 *Etica
  dello studio*).
- M5L9 *Etica del docente* (parallelo a M4L8 ma su asse responsabilità
  docente).

Nei rispettivi testi si parla del problema dal punto di vista del
docente senza presupporre che il lettore conosca la versione
studente. Non si dice "come dicevamo nel modulo Per studenti…".

## Livello: uniforme `intermedio`

Tutte e 9 le lezioni sono `intermedio`. Motivi:

- Il pubblico target è **intermedio per costruzione**: i docenti
  arrivano qui dopo Fondamenti + Uso quotidiano + (eventualmente) Sul
  lavoro, o con esperienza equivalente. La competenza didattica
  propria del docente è data per acquisita, non insegnata.
- Coerenza con Moduli 3 e 4, anch'essi uniformi `intermedio`.
- `avanzato` resta riservato al Modulo 6 (Per chi vuole di più),
  pensato per developer e integrazioni API.

Nota: il tag `intermedio` è consumato dalla skill `analyze-lesson` per
simulare un lettore più esperto durante il QA. Calibrazione specifica
per questo modulo: il lettore simulato dovrà avere **competenza
didattica** (sa cos'è un PDP, una rubrica, la tassonomia di Bloom) ma
**competenza IA intermedia** (ha usato ChatGPT, sa cos'è un prompt,
ha visto allucinazioni almeno una volta).

## Prerequisiti

Dentro al modulo, **nessuna lezione è prerequisito di un'altra** (stesso
principio di Uso quotidiano, Sul lavoro, Per studenti: si entra da
qualunque punto).

Cross-module, `ask-well` (M2L1) è prerequisito di default per tutte (è
il minimo per entrare in qualunque contesto con l'IA). Prerequisiti
specifici aggiuntivi dove la lezione presume skill puntuali di Modulo
1, 2 o 3:

| # | Lezione | Prerequisiti |
|---|---------|--------------|
| 1 | Progettare una lezione | `ask-well`, `iterate-the-conversation`, `draft-professional-documents` |
| 2 | Spiegare in cinque modi diversi | `ask-well`, `iterate-the-conversation`, `learn-something-new` |
| 3 | Materiali differenziati per livello | `ask-well`, `write-better`, `draft-professional-documents` |
| 4 | Inclusività: BES e DSA | `ask-well`, `write-better`, `images-and-files` |
| 5 | Domande per verifiche | `ask-well`, `when-to-trust-it` |
| 6 | Correggere con criterio | `ask-well`, `when-to-trust-it`, `data-and-tables` |
| 7 | Comunicare con le famiglie | `ask-well`, `write-better`, `hard-emails` |
| 8 | Quando lo studente usa l'IA | `ask-well`, `when-to-trust-it` |
| 9 | Etica del docente | `ask-well`, `privacy-basics`, `what-not-to-do`, `company-data-and-privacy` |

Logica per asse:

- **`iterate-the-conversation`** (M2L2) per 1, 2: progettare e
  spiegare richiedono giri di iterazione, non un singolo prompt.
- **`learn-something-new`** (M2L5) per 2: spiegare in più modi è il
  rovescio dell'imparare un argomento nuovo (l'IA come tutor che
  esplora analogie diverse).
- **`write-better`** (M2L6) per 3, 4, 7: tre lezioni con forte
  componente di scrittura controllata, con voce del docente da
  preservare.
- **`draft-professional-documents`** (M3L2) per 1, 3: il pattern
  *outline + riempimento* ricorre sia nella progettazione della
  singola lezione sia nei materiali derivati.
- **`images-and-files`** (M2L7) per 4: BES/DSA implicano upload di
  materiali esistenti (PDF, scansioni, foto di pagine) da adattare.
- **`when-to-trust-it`** (M1L5) per 5, 6, 8: tre lezioni dove
  l'allucinazione fa danno didattico diretto (domande sbagliate,
  correzioni errate, sospetti infondati).
- **`hard-emails`** (M3L1) per 7: la lezione di comunicazione con le
  famiglie eredita il pattern delle email difficili e lo calibra sul
  contesto scolastico.
- **`data-and-tables`** (M3L5) per 6: la correzione su un campione
  implica tabelle e griglie di valutazione.
- **`privacy-basics`** (M1L6), **`what-not-to-do`** (M2L8),
  **`company-data-and-privacy`** (M3L9) per 9: l'etica del docente
  eredita il quadro privacy generale, il modello "chi firma" e la
  scala di rischio aziendale per riformularla su dati di minori e
  responsabilità docente.

## Assorbimenti

Nessuno. Tutte e 9 le voci del piano provvisorio in `CONTENT.md` sono
promosse a lezione autonoma.

Assorbimenti secondari previsti **come callout dentro le lezioni**
(decisioni rinviate alla scrittura delle singole lezioni):

- **Callout "tassonomia di Bloom"** dentro lezione 5
  (`generate-assessment-questions`): la tassonomia come griglia per
  variare i livelli cognitivi delle domande. Non è una lezione, è uno
  schema di riferimento.
- **Callout "Anki / Quizlet / quiz online"** dentro lezione 5: l'IA
  come generatore di flashcards o item per piattaforme di quiz.
  Glossato brevemente, niente sezione dedicata.
- **Callout "rubrica di valutazione"** dentro lezione 6
  (`grading-with-criteria`): come scrivere una rubrica esplicita con
  l'IA prima di correggere. Non è una lezione, è una pratica.
- **Callout "AI detector"** dentro lezione 8 (`when-students-use-ai`):
  Turnitin AI, GPTZero, Copyleaks, perché sono inaffidabili. Già
  parte del corpo della lezione, non un callout aggiuntivo, ma vale
  ricordare che il modulo NON insegna a usarli come prova.
- **Callout "politiche d'istituto"** dentro lezione 9
  (`ethics-of-teaching`): esempi concreti di politiche italiane e
  straniere sull'uso dell'IA in classe. Da curare al momento della
  scrittura (le politiche evolvono).
- **Callout "registro elettronico e IA"**: non incluso come callout
  dedicato. La privacy del registro vive dentro lezione 9 come parte
  della sezione dati di minori, non come callout a sé.

Se in corso di scrittura uno di questi callout diventa troppo grande
per stare inline, si valuterà la promozione a lezione autonoma,
aggiornando questo spec e `CONTENT.md` nello stesso commit.

## Struttura file

Per ogni lezione del modulo verrà creata la coppia IT + EN:

```
src/content/docs/it/for-teachers/<slug>.mdx
src/content/docs/en/for-teachers/<slug>.mdx
```

Sidebar `autogenerate` in `astro.config.mjs` con
`translations: { en: 'For teachers' }`. Pattern già stabilito per i
moduli precedenti.

Per gli esercizi `.txt` di `<LlmExercise>`:

```
public/skills/it/<filename>.txt
public/skills/en/<filename>.txt
```

Convenzione filename:

- **Approfondimento per disciplina**: `deepen-<slug-lezione>.txt`
  (solo per le lezioni 1-7).
- **Verifica dell'apprendimento di fine lezione**:
  `review-<slug-lezione>.txt` (per tutte e 9, pattern già usato in
  Moduli 2-4).

## Traduzione EN

Avanzata **lezione per lezione in pari passo con la stesura IT**, come
per i Moduli 2, 3, 4. Non a modulo concluso.

Motivi:

- Il sito EN resta coerente settimana per settimana.
- Tradurre subito cattura incoerenze della versione IT (la traduzione
  è il miglior QA della coerenza).
- Non si accumula debito di traduzione che diventa un blocco a fine
  modulo.

Nota di idiomaticità: il modulo Per docenti ha terminologia scolastica
italiana con calchi e false equivalenze potenziali su cui lo
style-checker EN dovrà essere chiamato con attenzione:

- **registro / pagella / scrutinio**: niente equivalente esatto in EN
  (grade book / report card / faculty meeting sono solo approssimazioni
  parziali). Da usare con glossa quando necessario.
- **BES / DSA / PEI / PDP**: acronimi specifici del sistema italiano.
  In EN si traducono con il loro significato (Special Educational
  Needs / Specific Learning Disorders / Individualized Education Plan
  o termine locale equivalente) ma non hanno la stessa codifica
  normativa. Glossare e citare l'acronimo italiano.
- **maturità / esame di stato / laurea triennale-magistrale**: glosse
  ad hoc nel mirror EN, niente uso non spiegato.
- **classe / sezione**: in EN spesso "class" copre entrambi. Usare
  "class" con disambiguazione quando il contesto IT distingue.
- **didattica / pedagogia / metodologia**: in EN "teaching" /
  "pedagogy" / "methodology" non hanno la stessa estensione
  semantica. Da curare caso per caso.

Decisione operativa: per il mirror EN il taglio resta sul sistema
**italiano** (esempi, politiche, normativa), ma le sezioni "Etica del
docente" e "Quando lo studente usa l'IA" includono almeno un esempio
extra-italiano (Common Core USA, IB internazionale, sistema scolastico
UK / canadese a seconda della rilevanza) perché il pubblico EN è per
definizione globale.

## Scope di questo spec

Questo documento fissa **solo** la struttura del modulo. Non contiene:

- bozze o scalette di singole lezioni (ciascuna avrà il suo brief
  nella sessione di scrittura),
- decisioni sulla sidebar di `astro.config.mjs` (gli slug placeholder
  disabilitati saranno sostituiti con `{ slug: 'for-teachers/<slug>' }`
  al rilascio di ciascuna lezione, un commit per lezione come da
  pattern stabilito),
- aggiornamenti a `start-here.mdx` e a `index.mdx` (la card "Per
  docenti…" passa da `comingSoon: true` a linkata quando atterra la
  prima lezione del modulo, come per i moduli precedenti).

Questi punti faranno parte del piano di implementazione (prossimo
passo: skill `writing-plans`).

## Decisioni aperte, non bloccanti

- **Ordine di scrittura delle 9 lezioni** (diverso dall'ordine
  pedagogico): da decidere nel piano di implementazione. Ipotesi:
  partire dal blocco progettare (1-2-3-4) come prima impressione del
  modulo, poi valutare (5-6) come blocco coordinato (il filo rosso
  lega le due), poi comunicare (7) e chiudere con critica-etica (8-9)
  in quest'ordine fisso (l'etica è sempre l'ultima a chiudere).
- **Esempio portante a livello modulo**: se durante la scrittura
  emerge un filo cross-lezione utile (es. la stessa classe
  immaginaria di seconda media che torna in progettare → spiegare →
  materiali differenziati), lo si consolida come filo conduttore.
  Nessuna decisione anticipata.
- **Politiche d'istituto in lezione 9**: lista esemplificativa
  (Ministero, USR, qualche università italiana di riferimento;
  qualche istituzione estera per il mirror EN) da definire al momento
  della scrittura. Verificare che le politiche siano pubblicate e
  citabili al momento della lezione 9.
- **Pattern grafico/UI dell'approfondimento per disciplina**: se al
  momento della scrittura della prima lezione (M5L1) il pattern
  `<LlmExercise variant="practice">` con file `deepen-*.txt` non
  risulta sufficientemente distinguibile dalla verifica
  (`<LlmExercise variant="review">`), valutare l'introduzione di una
  terza variante dedicata (es. `variant="deepen"`, accento blu
  freddo) con propria iconografia. Decisione rimandata alla prima
  lezione scritta del modulo.
- **Glossario**: tre voci possibili da aggiungere se necessarie alla
  comprensione del modulo (PEI, PDP, BES). Decisione rinviata: se i
  testi delle lezioni 3-4 glossano i termini inline in modo
  sufficiente, niente nuove voci nel glossario.
