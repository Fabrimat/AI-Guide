# Modulo 4 "Per studenti": design

Data: 2026-05-13
Stato: spec validato con l'utente, pronto per il piano di implementazione.

## Obiettivo

Definire la struttura definitiva del Modulo 4 di AI-Guide ("Per studenti")
prima di iniziare la scrittura delle lezioni. Questo documento fissa:

- target di età (misto liceo + università, baricentro università),
- impostazione etica vs operativa (operativa dominante + etica
  trasversale come callout + lezione finale di chiusura),
- trattamento degli esami proctored (callout dentro la lezione finale,
  non sezione né lezione dedicata),
- numero e identità delle lezioni (8 lezioni),
- ordine pedagogico,
- slug (in inglese, da convenzione del progetto),
- livello (`intermedio` uniforme per tutte e 8),
- prerequisiti cross-module per lezione,
- disambiguazione esplicita dalle lezioni dei moduli precedenti che
  toccano temi vicini.

Le singole lezioni verranno scritte una alla volta, ciascuna con il
proprio ciclo di revisione (`analyze-lesson` + `integrate-questions` +
`style-checker`). Questo documento resta la fonte di verità per come
il modulo è organizzato.

## Contesto

Modulo 1 (Fondamenti) chiuso al 100% il 2026-04-19. Modulo 2 (Uso
quotidiano) chiuso al 100% il 2026-04-23. Modulo 3 (Sul lavoro) chiuso
al 100% il 2026-04-25.

Il Modulo 4 serve studenti dalle superiori all'università, più adulti
in riqualificazione, che vogliono usare l'IA come supporto allo studio
senza cadere nel "fammi i compiti". Il piano provvisorio in
`CONTENT.md` elencava 8 voci; tutte e 8 sono confermate, nessun
assorbimento. Quattro voci avevano sovrapposizioni con lezioni dei
moduli 1-3 da disambiguare (vedi sezione apposita).

## Target di età: misto liceo + università, baricentro università

Pubblico ampio: dai 16 anni in su, fino agli adulti in formazione
continua. Tono adulto-ma-accessibile.

Esempi attinti **sia** dal contesto liceo (versione di latino,
interrogazione di storia, tema d'italiano) **sia** da quello
universitario (esame orale, paper, tesina di laurea, tesi). Il
baricentro è universitario per due motivi: lì lo studente prende
decisioni più autonome sull'uso dell'IA (non c'è un prof che gli
toglie il tablet), e i casi più impegnativi (tesi, bibliografia, paper
accademici, esami complessi) sono universitari per natura.

Esclusi: scuola primaria e medie inferiori. Il pubblico va dai 16
anni in su.

## Impostazione: operativa dominante, etica trasversale, chiusura sull'etica

Il modulo è **prevalentemente operativo**: 6 lezioni "come fare X bene
con l'IA" + 1 lezione di critica (*Quando l'IA ti imbroglia*) + 1
lezione finale di etica (*Etica dello studio*).

L'etica vive in due forme:

1. **Trasversale**: callout dentro ogni lezione operativa, dove serve,
   sul confine "aiuto vs sostituzione" specifico di quel caso d'uso.
2. **Lezione di chiusura**: *Etica dello studio* (lezione 8) come
   sintesi e ponte di chiusura del modulo, sullo stesso pattern di:
   - Fondamenti → chiude con *Quello che condividi quando usi l'IA*,
   - Uso quotidiano → chiude con *Cose da NON fare*,
   - Sul lavoro → chiude con *Privacy e dati aziendali*.

Motivi della scelta (contro l'etica come apertura o l'etica come due
lezioni dedicate):

- **Coerenza con il pattern editoriale già stabilito**: nei tre moduli
  precedenti il tema "responsabilità / dove si rompe" sta in chiusura,
  mai in apertura. L'etica trasversale come callout è già il modello
  con cui privacy attraversa Uso quotidiano e Sul lavoro.
- **Pratica prima della teoria** è un principio editoriale dichiarato
  in `CONTENT.md`. Aprire con "ecco cosa NON devi fare" prima di aver
  mostrato cosa si può fare suona moralista, soprattutto a un
  pubblico misto liceo+università.
- **Promuovere *Quando l'IA ti imbroglia* a "seconda lezione etica"
  appiattirebbe il suo taglio reale**: è critica della risposta
  (allucinazioni in contesto studio), non etica della scelta di
  usarla.

**Aggiustamento specifico per questo modulo**: nella **prima lezione**
(*Studiare un argomento nuovo*), il paragrafo di apertura (4-6 righe,
non una sezione) fissa il contratto del modulo. Non come moralizzazione,
come distinzione operativa:

> Questo modulo non è il manuale del "fammi i compiti". È il manuale
> del "studia meglio". Sono due cose diverse non perché una sia
> morale e l'altra no, ma perché il primo non ti fa imparare niente
> e si vede al primo confronto orale.

Questo gestisce il rischio specifico del pubblico studenti (la
tentazione "fammi i compiti") senza promuovere l'etica a lezione di
apertura.

## Esami proctored: callout dentro la lezione finale

Il tema è reale per il pubblico universitario (esami sorvegliati da
software anti-cheating, esami at-home con webcam, lockdown browser)
ma non è il cuore del modulo. Non avrà sezione propria né lezione
dedicata.

Verrà gestito come **callout `:::caution`** dentro *Etica dello
studio* (lezione 8), su tre punti:

- Durante un esame supervisionato (in presenza o at-home con
  proctoring) l'IA è vietata anche se l'università non la blocca
  tecnicamente.
- Gli AI detector tipo Turnitin AI esistono ma sono inaffidabili
  (Turnitin stessa lo dichiara in disclaimer ufficiale); non sono
  prova unica.
- La regola di chiusura è quella di Uso quotidiano lezione 8:
  l'asticella non è "cosa riesco a non far vedere", è "quale lavoro
  è mio".

Niente how-to anti-detection, niente sezione "come usare l'IA durante
proctoring". Il modulo non insegna a barare.

## Struttura del modulo

Otto lezioni, ordinate pedagogicamente in **quattro blocchi**:
assorbire → produrre → strumenti specifici → critica e chiudere.

| # | Slug (EN) | Titolo IT | Livello | Cosa insegna |
|---|-----------|-----------|---------|---------------|
| 1 | `study-a-new-topic` | Studiare un argomento nuovo | `intermedio` | Studio formale contro un programma fissato. Apertura: paragrafo di 4-6 righe "non è il modulo del fammi i compiti". Ancorare l'IA al manuale, non improvvisare contenuti fuori programma, distinguere "ho capito" da "so quello che il prof si aspetta". |
| 2 | `notes-from-lectures` | Appunti da lezioni e testi lunghi | `intermedio` | Materiale grezzo → forma studiabile. Trascrizione audio (Whisper, integrazioni dei tool di call), unire appunti propri + slide + manuale dello stesso corso, organizzare per ripasso. |
| 3 | `revise-before-an-exam` | Ripassare prima di un esame | `intermedio` | Interrogazioni simulate (orale e scritto), mappe mentali, flashcards generate dall'IA per Anki/Quizlet (callout, non lezione dedicata), strategia per orali con un docente prevedibile vs imprevedibile. |
| 4 | `write-a-thesis` | Scrivere una tesi | `intermedio` | Senza farsela scrivere. Pattern *outline + riempimento* ereditato da M3L2, calibrato sul relatore. Capitoli come dialoghi separati, dialoghi con l'IA come "secondo lettore". Differenza fra tesi triennale, magistrale, dottorato. |
| 5 | `sources-and-citations` | Fonti e citazioni | `intermedio` | Bibliografia accademica. Stili (APA, Chicago, MLA, ISO 690), DOI come gate di verifica, distinguere fonte accademica reale da blog mascherato, anatomia della citazione inventata. NotebookLM come strumento specifico per bibliografia controllata. |
| 6 | `translate-and-compare` | Tradurre e confrontare testi | `intermedio` | Lingue straniere, classici, letterature comparate. Varianti di traduzione, glosse, confronto fra edizioni, registri (formale/informale), trabocchetti linguistici (falsi amici, registri storici, dialetti). |
| 7 | `when-ai-tricks-you` | Quando l'IA ti imbroglia | `intermedio` | Errori tipici in contesto studio: definizioni leggermente shift rispetto al manuale, date confuse, formule giuste nella forma ma con segno sbagliato, opere fantasma. Tre test rapidi per accorgersene quando NON sai già la risposta giusta. |
| 8 | `ethics-of-studying` | Etica dello studio | `intermedio` | Chiusura. Dove finisce l'aiuto e inizia il copiato, dichiarazione dell'uso, politiche d'istituto (esempi reali: Polimi, Bocconi, Sapienza), callout `:::caution` su esami proctored e AI detector. Regola "chi firma" portata da M2L8. Ponte ai moduli successivi (5, 6). |

## Ragionamento sull'ordine

**Blocco 1, assorbire (1-2).** Si parte dal verbo dominante dello
studente: capire un argomento e portarlo a memoria. Lezione 1 fissa il
contratto del modulo e copre lo studio "formale" su programma fissato.
Lezione 2 risolve il problema upstream: portare la materia grezza
(audio di lezione, dispense disordinate, slide del prof + manuale)
in forma studiabile. È il prerequisito per ripassare bene.

**Blocco 2, produrre (3-4).** Output dello studio. Ripasso (3) è
output "verso il prof" su orizzonte settimanale; tesi (4) è output
"di sé" su orizzonte mensile/annuale. La progressione rispecchia la
scala temporale e l'autonomia.

**Blocco 3, strumenti specifici (5-6).** Casi d'uso che valgono per
sottoinsiemi specifici di studenti. Fonti e citazioni (5) si collega
direttamente alla tesi della lezione 4 (chi scrive la tesi sta
costruendo bibliografia in parallelo) e copre anche il bisogno
universitario più generico (paper, tesina). Tradurre e confrontare
(6) è laterale ma utile per studenti di lingue, classici, comparate,
filologia, letteratura inglese.

**Blocco 4, critica e chiudere (7-8).** Lezione 7 è verifica della
risposta in contesto studio, simmetrica alla lezione 5 di Fondamenti
(*Quando fidarsi e quando no*) ma con esempi e taglio interamente da
studente. Lezione 8 chiude sull'etica e fa da ponte verso il modulo
Per docenti e il modulo Per chi vuole di più.

## Disambiguazione dalle lezioni dei moduli precedenti

Quattro lezioni di Modulo 4 toccano temi che esistono già nei moduli
1-3 con un altro taglio. Differenziazioni esplicite, da preservare in
fase di scrittura:

### Lezione 1 *Studiare un argomento nuovo* vs M2L5 *Imparare un argomento nuovo*

- **M2L5**: curiosità personale generalista. Il lettore vuole capire
  un buco nero, capire blockchain, capire come funziona un mutuo. IA
  come tutor generico.
- **M4L1**: studio formale contro un programma fissato. C'è un
  manuale, un docente che decide cosa è "giusto", una verifica in
  fondo. Differenze chiave da rendere esplicite nella lezione:
  ancorare l'IA al testo di riferimento (non improvvisare contenuti
  fuori programma), prepararsi alla domanda del professore più che
  alla curiosità propria, non lasciarsi distrarre da divagazioni che
  l'IA fa volentieri.

### Lezione 2 *Appunti da lezioni e testi lunghi* vs M2L4 *Riassumere un documento lungo*

- **M2L4**: come chiedere un riassunto affidabile di un singolo
  documento (PDF, articolo, libro) e verificarlo.
- **M4L2**: portare materiale grezzo a forma studiabile. Non
  "riassumi questo", ma "organizza questo per ripassarlo". Differenze
  chiave: trasformare la registrazione audio di una lezione (voce →
  trascrizione → struttura), unire appunti propri disordinati con
  materiale del prof, organizzare più documenti dello stesso corso
  in mappa di studio. Il prerequisito M2L4 vale per la parte di
  riassunto, M2L7 (`images-and-files`) per la parte di upload audio.

### Lezione 5 *Fonti e citazioni* vs M3L6 *Ricerca per il lavoro*

- **M3L6**: ricerca multi-fonte per deliverable professionale,
  citazioni inventate come uno dei tre tipi di allucinazione
  professionale.
- **M4L5**: bibliografia accademica come oggetto a sé. Differenze
  chiave: stili bibliografici (APA, Chicago, MLA, ISO 690, non
  presenti in M3), DOI come gate di verifica, distinguere fonte
  accademica reale da blog che si traveste da fonte, anatomia della
  citazione accademica inventata (autore plausibile + journal
  plausibile + anno plausibile, ma il DOI non risolve), aspettative
  del peer review e del relatore. NotebookLM come strumento
  specifico per bibliografia chiusa.

### Lezione 7 *Quando l'IA ti imbroglia* vs M1L5 *Quando fidarsi e quando no*

- **M1L5**: concetto generale di allucinazione, principio di
  sfiducia, "convincente anche quando sbaglia".
- **M4L7**: applicazione specifica al contesto studio. Tipi di
  errore tipici: definizioni leggermente shift rispetto a quelle del
  manuale (l'IA ha pescato da Wikipedia o testi anglosassoni in
  traduzione), date confuse (anno corretto, mese sbagliato),
  biografie miste (eventi del padre attribuiti al figlio), formule
  giuste nella forma ma con segno sbagliato, riferimenti a opere
  fantasma. Punto chiave: nello studio sei valutato sulla precisione
  del programma, non su una "versione plausibile", e tu studente non
  sei in posizione di accorgertene se non sai già la risposta giusta.

## Livello: uniforme `intermedio`

Tutte e 8 le lezioni sono `intermedio`. Motivi:

- Il pubblico target è **intermedio per costruzione**: ci arriva dopo
  Fondamenti + Uso quotidiano, o con esperienza equivalente. Uno
  studente che apre questo modulo ha già visto ChatGPT/Claude/Gemini
  almeno qualche volta.
- Segnala visivamente che il modulo è uno step più impegnativo dei
  primi due, come per Sul lavoro.
- Mantiene `avanzato` riservato al Modulo 6 (Per chi vuole di più),
  pensato per developer. Usare `avanzato` anche qui confonderebbe la
  promessa della gerarchia del sito.

Nota: il tag `intermedio` è consumato dalla skill `analyze-lesson` per
simulare un lettore più esperto durante il QA, quindi il QA delle
lezioni del modulo sarà calibrato su quel profilo.

## Prerequisiti

Dentro al modulo, **nessuna lezione è prerequisito di un'altra** (stesso
principio di Uso quotidiano e Sul lavoro: si entra da qualunque punto).

Cross-module, `ask-well` (M2L1) è prerequisito di default per tutte (è
il minimo per entrare in qualunque contesto con l'IA). Prerequisiti
specifici aggiuntivi dove la lezione presume skill puntuali di Modulo
1, 2 o 3:

| # | Lezione | Prerequisiti |
|---|---------|--------------|
| 1 | Studiare un argomento nuovo | `ask-well`, `learn-something-new`, `when-to-trust-it` |
| 2 | Appunti da lezioni e testi lunghi | `ask-well`, `summarize-a-long-document`, `images-and-files` |
| 3 | Ripassare prima di un esame | `ask-well`, `learn-something-new` |
| 4 | Scrivere una tesi | `ask-well`, `write-better`, `draft-professional-documents` |
| 5 | Fonti e citazioni | `ask-well`, `research-for-work`, `when-to-trust-it` |
| 6 | Tradurre e confrontare testi | `ask-well`, `images-and-files` |
| 7 | Quando l'IA ti imbroglia | `ask-well`, `when-to-trust-it` |
| 8 | Etica dello studio | `ask-well`, `privacy-basics`, `what-not-to-do` |

Logica per asse:

- **`learn-something-new`** (M2L5) per 1, 3: l'IA come tutor è il
  meccanismo di base di studio e ripasso.
- **`when-to-trust-it`** (M1L5) per 1, 5, 7: studio formale, fonti e
  imbroglio sono dove le allucinazioni fanno più danno (programma da
  rispettare, bibliografia, definizioni precise).
- **`summarize-a-long-document`** (M2L4) per 2: appunti scala il
  pattern di riassunto a un insieme di documenti.
- **`images-and-files`** (M2L7) per 2, 6: trascrizione audio (2) e
  scansioni/foto di testi (6) implicano upload multimodale.
- **`write-better`** (M2L6) e **`draft-professional-documents`**
  (M3L2) per 4: la tesi eredita il pattern *voce-che-resta-tua* e
  *outline + riempimento*.
- **`research-for-work`** (M3L6) per 5: bibliografia eredita la
  meccanica della verifica multi-fonte e la traduce all'accademico.
- **`privacy-basics`** (M1L6) e **`what-not-to-do`** (M2L8) per 8:
  l'etica dello studio eredita il modello "chi firma" e lo applica
  al contesto valutazione formale.

## Assorbimenti

Nessuno. Tutte e 8 le voci del piano provvisorio in `CONTENT.md` sono
promosse a lezione autonoma.

Assorbimenti secondari previsti **come callout dentro le lezioni**
(decisioni rinviate alla scrittura delle singole lezioni):

- **Callout "flashcards per spaced repetition"** dentro lezione 3
  (`revise-before-an-exam`): l'IA come generatore di flashcards da
  appunti per Anki/Quizlet. Non è una lezione, è uno strumento.
- **Callout "tesi vs paper vs tesina"** dentro lezione 4
  (`write-a-thesis`): le differenze fra triennale, magistrale,
  dottorato, e con paper accademici brevi.
- **Callout "esami proctored e AI detector"** dentro lezione 8
  (`ethics-of-studying`): vedi sezione "Esami proctored" sopra.
- **Callout "NotebookLM"** dentro lezione 5
  (`sources-and-citations`): strumento specifico di Google per
  bibliografia chiusa (l'IA risponde solo sui documenti caricati,
  niente world knowledge).
- **Callout "gestione del tempo / pianificazione dello studio"**:
  non incluso. La gestione del tempo non è uso dell'IA, è studio:
  resta fuori scope esplicito.

Se in corso di scrittura uno di questi callout diventa troppo grande
per stare inline, si valuterà la promozione a lezione autonoma,
aggiornando questo spec e `CONTENT.md` nello stesso commit.

## Struttura file

Per ogni lezione del modulo verrà creata la coppia IT + EN:

```
src/content/docs/it/for-students/<slug>.mdx
src/content/docs/en/for-students/<slug>.mdx
```

Sidebar `autogenerate` in `astro.config.mjs` con
`translations: { en: 'For students' }`.

Per gli esercizi `.txt` di `<LlmExercise>`:

```
public/skills/it/<filename>.txt
public/skills/en/<filename>.txt
```

Convenzione filename per i `review-*.txt`: `review-<slug-lezione>.txt`
(pattern già usato in Modulo 2 e 3).

## Traduzione EN

Avanzata **lezione per lezione in pari passo con la stesura IT**, come
per Modulo 2 e 3. Non a modulo concluso.

Motivi:

- Il sito EN resta coerente settimana per settimana.
- Tradurre subito cattura incoerenze della versione IT (la traduzione
  è il miglior QA della coerenza).
- Non si accumula debito di traduzione che diventa un blocco a fine
  modulo.

Nota di idiomaticità: il modulo Per studenti ha terminologia
accademica con possibili calchi (tesi/thesis vs dissertation, laurea
triennale/magistrale, relatore/supervisor, esame orale/oral exam vs
viva). Lo `style-checker` EN dovrà essere chiamato con attenzione
specifica a questi calchi, come già per i termini aziendali in
Modulo 3.

## Scope di questo spec

Questo documento fissa **solo** la struttura del modulo. Non contiene:

- bozze o scalette di singole lezioni (ciascuna avrà il suo brief
  nella sessione di scrittura),
- decisioni sulla sidebar di `astro.config.mjs` (gli slug placeholder
  disabilitati saranno sostituiti con `{ slug: 'for-students/<slug>' }`
  al rilascio di ciascuna lezione, un commit per lezione come da
  pattern stabilito),
- aggiornamenti a `start-here.mdx` e a `index.mdx` (la card "Per
  studenti…" passa da `comingSoon: true` a linkata quando atterra la
  prima lezione del modulo).

Questi punti faranno parte del piano di implementazione (prossimo
passo: skill `writing-plans`).

## Decisioni aperte, non bloccanti

- **Ordine di scrittura delle 8 lezioni** (diverso dall'ordine
  pedagogico): da decidere nel piano di implementazione. Ipotesi:
  partire dalle 2-3 con maggior payoff immediato per il lettore e
  più "vendibili" come prima impressione del modulo (studiare un
  argomento nuovo, appunti, ripassare), poi tesi e fonti come
  blocco coordinato, poi tradurre, infine imbroglio ed etica come
  chiusura.
- **Esempio portante a livello modulo**: se durante la scrittura
  emerge un caso studio cross-lezione utile (es. lo stesso esame
  universitario che torna in studiare, ripassare, imbroglio), lo si
  consolida come filo conduttore. Nessuna decisione anticipata.
- **Politiche d'istituto in lezione 8**: lista esemplificativa
  (Polimi, Bocconi, Sapienza) da definire al momento della scrittura.
  Verificare che le politiche siano pubblicate e citabili al momento
  della lezione 8 (le università aggiornano le linee guida sull'IA
  con cadenza non regolare).
