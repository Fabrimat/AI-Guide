# Piano dei contenuti

Roadmap editoriale di AI-Guide. Aggiornare questo file **nello stesso commit**
in cui una lezione viene scritta, spostata, o eliminata. Serve per sapere in
ogni momento cosa c'è, cosa manca, e cosa arriva dopo.

## Obiettivo e pubblico

AI-Guide insegna a usare l'IA in modo pratico e consapevole, con priorità al
pubblico italiano **non tecnico**. Il percorso va dal "non so cosa sia"
("Fondamenti") al "so usarla ogni giorno" ("Uso quotidiano") al "la uso
sul lavoro" ("Sul lavoro"), con due moduli dedicati al mondo della scuola
("Per studenti" e "Per docenti") e un modulo avanzato finale per developer
e chi vuole integrarla in strumenti propri ("Per chi vuole di più").

Principi editoriali:

- **Ogni lezione è autoesplicativa**: 400-1200 parole, almeno un esempio concreto.
- **Niente gergo non spiegato** rispetto al livello dichiarato nel frontmatter.
- **Zero pattern AI**: voice guide in `.claude/skills/voice-guide/SKILL.md`.
- **Pratica prima della teoria** quando possibile. Le lezioni che lo giustificano
  hanno un `<EsercizioLLM>` o un `<ChatDemo>` (vedi catalogo in `CLAUDE.md`).

## Legenda degli stati

- ✅ scritta e pubblicata
- ✍️ in lavorazione (bozza o QA in corso)
- ⏳ prevista, non ancora scritta
- 🆕 idea da valutare, non confermata

## Modulo 1: Fondamenti (livello `principiante`)

Target: chi non ha mai usato ChatGPT o un'IA conversazionale. Zero gergo.
Sei lezioni da 5-8 minuti ciascuna, pensate come percorso lineare.

1. ✅ **Ma cos'è l'IA?** (`fundamentals/what-is-ai`)
   Demistificazione generale. Cosa è davvero, cosa no. Le due famiglie
   (IA specializzate vs conversazionali). Quattro miti da chiarire subito.
   **Ciclo di revisione completo** (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-18).

2. ✅ **Cos'è un prompt?** (`fundamentals/what-is-a-prompt`)
   La parola "prompt" e il modello mentale "è come scrivere un messaggio
   chiaro a qualcuno che vuole aiutarti". Esempio prima/dopo con `<ChatDemo>`
   (vago vs chiaro). Quattro ingredienti di un prompt chiaro, avvertimento
   sui "prompt magici". **Ciclo di revisione completo** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-18). Style-checker ha
   restituito OK senza richiedere modifiche.

3. ✅ **La tua prima conversazione** (`fundamentals/first-conversation`)
   La lezione più pratica del modulo. Lista delle IA conversazionali
   principali con link, `<ChatDemo>` come anteprima, `<EsercizioLLM>` che
   riusa `public/skills/primo-esercizio.txt` per il primo dialogo guidato.
   **Ciclo di revisione completo** (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-18). Style-checker ha catturato una
   incoerenza fattuale residua dopo l'integrazione delle domande
   ("Tre situazioni tipiche" mentre la lista era cresciuta a quattro
   bullet), corretta in "Le situazioni più comuni".

4. ✅ **Come fa l'IA a "capire"?** (`fundamentals/how-ai-understands`)
   Spiegazione del meccanismo "una parola alla volta", come ha imparato
   (testo enorme, schemi non memorie), tre conseguenze pratiche per il
   lettore (non sa, contesto conta, memoria solo nella stessa chat),
   perché sembra intelligente, e infine il termine "LLM" come etichetta
   tecnica a fine pagina. Riusa il `<ChatDemo>` dei buchi neri come ancora
   visiva. **Ciclo di revisione completo** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-18). Style-checker ha
   restituito OK senza richiedere modifiche.

5. ✅ **Quando fidarsi e quando no** (`fundamentals/when-to-trust-it`)
   Apre con il problema del "convincente anche quando sbaglia". `<ChatDemo>`
   con riassunto di un libro inventato per mostrare un'allucinazione in
   atto. Mappa "dove va bene / dove va male" pratica, tre mosse per
   verificare a sforzo crescente, e una mentalità di chiusura ("assistente
   brillante ma incostante"). Termine "allucinazione" introdotto a metà
   come etichetta. Ponte verso la lezione 6. **Ciclo di revisione completo**
   (`analyze-lesson` + `integrate-questions` + `style-checker`, 2026-04-18).
   Style-checker ha catturato "come hai visto sopra" (vietato dalla regola
   "vedi sopra/sotto" della voice guide), corretto con riferimento esplicito
   all'esempio del libro inventato.

6. ✅ **Quello che condividi quando usi l'IA** (`fundamentals/privacy-basics`)
   Lezione sulla privacy delle proprie conversazioni, non sui dati del
   sito (per quella c'è già `/it/privacy/`). Tono non legale, "la nonna
   chiede". Cinque blocchi: cosa vede l'IA quando le parli, cosa succede
   dopo il messaggio (conservazione, allenamento, revisione per sicurezza
   + differenze Free / Plus / Team / Enterprise), cosa non condividere
   (dati di terzi, documenti sensibili di altri, segreti professionali,
   credenziali), impostazioni che puoi cambiare (opt-out dal training,
   chat temporanee, cancellazione), modello mentale di chiusura
   ("trattala come un collega fidato ma con una catena informativa
   ignota"). Chiude il modulo Fondamenti e fa da ponte verso *Uso
   quotidiano*. **Ciclo di revisione completo** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-19). Quattro
   callout aggiunti in integrazione: memorization fear, anonimizzare
   prima di incollare, verificare che l'opt-out sia andato a buon fine,
   cautela con app di IA meno famose. Style-checker ha suggerito di
   neutralizzare "Impostazioni che esistono davvero" (lievemente
   difensivo) in "Impostazioni che puoi cambiare", applicato.

**Stato attuale**: 6 su 6 pubblicate, **modulo Fondamenti completo al
100%**. Ciclo di revisione chiuso su tutte le lezioni, verifica
dell'apprendimento attiva su tutte (sezione `<LlmExercise variant="review">`
prima di "Cosa viene dopo", con prompt dedicato in
`public/skills/<locale>/review-<slug>.txt`).
La vecchia `cos-e-un-llm.mdx` era stata rinominata `come-capisce-l-ia.mdx`
e riscritta da capo: il vecchio URL `/it/fondamenti/cos-e-un-llm/` non
esiste più (per ora non è un problema, il sito non è ancora pubblicato).

## Modulo 2: Uso quotidiano (livello misto `principiante` / `intermedio`)

Target: chi ha usato ChatGPT / Claude / Gemini qualche volta e vuole
portarli nel quotidiano con più consapevolezza. Spec di modulo:
`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`.

Struttura validata 2026-04-20. Otto lezioni, ordine pedagogico =
ordine di scrittura. Livello misto per lezione (5 `principiante`, 3
`intermedio`): il tag riflette la difficoltà reale della singola
lezione, non un'etichetta di modulo.

1. ✅ **Chiedere bene** (`everyday-use/ask-well`, `principiante`)
   Tecniche per scrivere una richiesta che funziona: chiarezza,
   contesto, formato atteso, ruolo. Ponte da *Cos'è un prompt?* di
   Fondamenti. Assorbe il caso "IA vs Google" come callout. **Ciclo di
   revisione completo** (`analyze-lesson` + `integrate-questions` +
   `add-defs` + style-check, 2026-04-20). Integrazioni principali:
   ponte esplicito alle quattro leve di Fondamenti 2, etichettatura
   delle leve nell'esempio buono, distinzione ruolo vs "prompt magici",
   callout IA vs Google sfumato sul "Google no".

2. ✅ **Iterare la conversazione** (`everyday-use/iterate-the-conversation`, `principiante`)
   Il prompt come dialogo, non comando singolo. "Prompt magici"
   demistificati. Esempio portante: pianificare un weekend a Firenze
   in quattro giri (vincoli, approfondimento, cambio di taglio). Ciclo
   di revisione completo (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-21). Integrazioni principali: callout sul
   limite della memoria della chat, paragrafo "quando aprire una chat
   nuova", Giro 4 "cambio taglio" per coprire tutti e tre i tipi di
   follow-up nell'esempio portante.

3. ✅ **Capire una cosa complicata** (`everyday-use/understand-something-complex`, `principiante`)
   Tradurre dal burocratese al quotidiano: contratto, referto,
   bolletta, regolamento condominiale. Ciclo di revisione completo
   (`analyze-lesson` + `integrate-questions` + `style-checker`,
   2026-04-23). Integrazioni principali: callout `:::tip` su PDF e
   documenti cartacei tra le tecniche e la privacy, riga di
   precisazione referto medico in apertura (ponte a *Cose da NON
   fare*), differenza esplicita tecnica 1 vs tecnica 2, paragrafo
   "le parole" nella sezione verifica per coprire le imprecisioni
   non numeriche, callout privacy esteso a documenti di terzi e con
   glossa di POD.

4. ✅ **Riassumere un documento lungo** (`everyday-use/summarize-a-long-document`, `principiante`)
   PDF, articoli, libri. Come chiedere un riassunto affidabile e come
   verificarlo. Ciclo di revisione completo (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-23). Integrazioni
   principali: differenza esplicita con la lezione 3 in apertura
   (scala vs complessità, con combinazione delle tecniche sui
   documenti sia lunghi sia difficili), Tecnica 1 con esempi
   contestuali di "profondità" e "va bene per te" vs "va bene per
   chiunque", Tecnica 3 estesa a documenti senza sezioni numerate e
   con differenza esplicita dalla Tecnica 1, callout `:::tip`
   riscritto con istruzioni concrete su upload e su cosa succede
   quando il documento è "troppo grande", sezione *Cosa verificare*
   con le due ragioni della maggiore frequenza di invenzioni sui
   documenti lunghi. Style-checker ha catturato "spot-check" residuo
   nel sommario, quattro occorrenze di "davvero" (parola difensiva),
   "di fatto" (buzzword), una ripetizione ravvicinata di "plausibile"
   e una tripla parallela nella chiusura: tutti sistemati.

5. ✅ **Imparare un argomento nuovo** (`everyday-use/learn-something-new`, `intermedio`)
   L'IA come tutor: spiegazioni a più livelli, interrogazioni di
   ritorno, verifica della qualità. Prerequisiti estesi a
   `when-to-trust-it` oltre a `what-is-a-prompt` (lezione a posta
   più alta sulla verifica). Ciclo di revisione completo
   (`analyze-lesson` + `integrate-questions` + `style-checker`,
   2026-04-23). Integrazioni principali: "regola rapida" sul livello
   di partenza nella Tecnica 1, rimpiazzo della metafora opaca
   "scalpello locale" con "a grana fine", motivo per cui le analogie
   generiche (*"libro mastro"*) falliscono, paragrafo sull'analogia
   che si rompe, variante "chiedila all'IA", differenza esplicita
   fra Tecnica 1 e Tecnica 2, aggiustamento del quiz e cautela sul
   feedback nella Tecnica 3, quarta `<ChatDemo>` col turno completo
   utente/IA per far vedere il loop dell'interrogazione,
   escalation sul caso "l'IA insiste che è tutto ok",
   chiarimento su cosa sia una "fonte seria" + callout su
   argomenti di nicchia, spiegazione meccanica del test di
   Feynman, motivo strutturale per cui matematica/programmazione/
   medicina sono le aree più rischiose, callout finale su
   competenze vs concetti. Style-checker: verdetto OK, applicati 3
   fix su "davvero/veramente" nell'asse "capire sul serio".

6. ✅ **Scrivere meglio** (`everyday-use/write-better`, `intermedio`)
   L'IA come editor sulla propria bozza, non come ghostwriter.
   Tre pattern che tengono la voce (bozza + critica, più versioni,
   temperatura emotiva), trappola della voce media con istruzione
   "standing" per smorzare il default, matrice sì/cautela/no.
   Ciclo di revisione completo (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-23).
   Integrazioni principali: secondo ChatDemo sul pattern 1
   (email ritardo cliente), mini-paragrafo su "come identifichi
   la tua voce" nel pattern 2, variante "incolla testi passati"
   per evitare la voce media, caveat "la diagnosi può sbagliare"
   nel pattern 3, callout privacy per anonimizzare prima di
   incollare, callout "lavoro quasi tutto cautela" per HR/customer
   success, glosse inline di *AI-polish* e *imbottitura*.
   Style-checker: verdetto OK senza fix richiesti.

7. ✅ **Foto, immagini e file** (`everyday-use/images-and-files`, `intermedio`)
   Multimodalità: foto, screenshot, PDF, fogli di calcolo. Tre casi
   d'uso canonici (foto di documento cartaceo, screenshot, PDF/file),
   quattro criteri per orientarsi fra ChatGPT / Claude / Gemini,
   cosa va bene e cosa va male per ogni formato, privacy. Ciclo di
   revisione completo (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-23). Integrazioni principali: callout
   `:::tip` su come si carica un file (graffetta / drag-and-drop /
   fotocamera), callout `:::caution` sull'allenamento con opt-out
   (la domanda chiave del lettore intermedio sui file caricati),
   callout `:::note` sui documenti in altre lingue, paragrafo sulla
   scrittura a mano (stampatello vs corsivo del medico) in caso
   d'uso 1, distinzione PDF digitale vs PDF scansionato in caso
   d'uso 3, chiarimento sui File Office "via allegato" su Claude.
   Style-checker: verdetto OK, applicate quattro rifiniture
   opzionali (glossa inline di *opt-out*, rimpiazzo di "quel
   territorio" con formulazione più piana, linking ancora esplicito
   alla sezione "Cosa va bene, cosa va male", variazione di una
   ripetizione di "vale/valgono le cautele").

8. ✅ **Cose da NON fare** (`everyday-use/what-not-to-do`, `principiante`)
   Chiusura del modulo. La tesi non è "l'IA sbaglia" (quello è in
   Fondamenti 5) né privacy (Fondamenti 6): è dove non delegare la
   **decisione** anche se la risposta fosse giusta, per chi si
   prende la responsabilità. Regola madre (costo alto + non te ne
   accorgi → solo capire, non decidere) con due test, caso peggiore
   su argomenti specialistici dove il test "me ne accorgo in tempo"
   non regge. Cinque aree: salute, soldi, questioni legali,
   decisioni che toccano altre persone, lavori dove la firma vale
   competenza tua. Bussola finale: differenza concreta è "chi
   firma". Ciclo di revisione completo (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-23).
   Integrazioni principali: estensione della regola madre per il
   caso specialistico (non hai competenza per accorgerti
   dell'errore), callout `:::tip` sull'emergenza sanitaria (112 o
   pronto soccorso, non l'IA), chiarimento nella sezione "medico vs
   IA", mini-esempio sulla linea fra delega totale e aiuto a pensare
   una conversazione difficile, callout `:::tip` su editor vs
   ghostwriter (chi ha l'idea iniziale), estensione del "Perché"
   della sezione firma con il boomerang del colloquio. Style-checker:
   verdetto OK, applicate due rifiniture nella bussola ("Guarda i
   cinque casi sopra" → "In tutti e cinque i casi", triade
   **Non/Sì** allentata).

**Stato attuale**: 8 su 8 pubblicate, **modulo Uso quotidiano
completo al 100%**.

## Modulo 3: Sul lavoro (livello `intermedio`)

Target: chi sa già usare l'IA per cose personali e vuole portarla nel
proprio lavoro. Non developer: tipicamente knowledge worker (project
manager, marketing, HR, consulenza, didattica, sales, design,
comunicazione). Tono pratico, ogni lezione un caso d'uso da ufficio.

Elenco provvisorio, da validare prima di scrivere:

1. 🆕 Bozze di documenti professionali (proposte, brief, report)
2. 🆕 Preparare una riunione (ordine del giorno, riassunto, follow-up)
3. 🆕 Email che funzionano (negoziare, chiedere, dire di no, gestire conflitti)
4. 🆕 Lavorare con dati e tabelle (CSV, formule Excel/Sheets, pulizia,
   piccole analisi — senza diventare programmatori)
5. 🆕 Slide e presentazioni (contenuto, non design: scaletta, bullet, speaker notes)
6. 🆕 Ricerca per il lavoro (raccogliere informazioni, sintetizzare fonti)
7. 🆕 L'IA come "collega che ti aiuta a pensare" (challenge, devil's advocate, brainstorming)
8. 🆕 Riformulare comunicazioni difficili (cliente irritato, feedback delicato)
9. 🆕 Privacy e dati aziendali: cosa NON dare in pasto a un'IA pubblica
10. 🆕 Riusare contesto: progetti, custom GPT, Claude Project (lo stesso
    pattern su tutte le piattaforme)

Da decidere: ordine, taglio (orizzontale per professione vs trasversale),
quanti use case professionali coprire prima di passare al modulo avanzato.

## Modulo 4: Per studenti (livello `intermedio`)

Target: studenti dalle superiori all'università (più adulti in
riqualificazione), che vogliono usare l'IA come supporto allo studio
senza cadere nel "fammi i compiti". Tono pratico, attento al rischio
plagio e al confine fra studio e sostituzione.

Elenco provvisorio, da validare prima di scrivere:

1. 🆕 Studiare un argomento nuovo con l'IA (dal capire al verificare)
2. 🆕 Ripassare prima di un esame (interrogazioni simulate, mappe mentali)
3. 🆕 Scrivere una tesi senza farsela scrivere
4. 🆕 Prendere appunti da lezioni registrate o testi lunghi
5. 🆕 Tradurre e confrontare testi in lingue straniere
6. 🆕 Fonti e citazioni: come non farsi inventare la bibliografia
7. 🆕 Quando l'IA ti imbroglia: riconoscere risposte plausibili ma sbagliate
8. 🆕 Etica dello studio: dove finisce l'aiuto e inizia il copiato

Da decidere: target di età prevalente (liceo vs università), peso della
componente etica vs operativa, se includere l'uso dell'IA nei test/esami
proctored.

## Modulo 5: Per docenti (livello `intermedio`)

Target: insegnanti di scuola primaria, secondaria e università, più
formatori aziendali e divulgatori. Pubblico non tecnico ma con
competenza didattica propria. Tono pratico, casi d'uso da classe.

Elenco provvisorio, da validare prima di scrivere:

1. 🆕 Progettare una lezione con l'IA (dal piano alla pratica)
2. 🆕 Materiali differenziati: stesso argomento, più livelli di difficoltà
3. 🆕 Inclusività: adattare materiali per BES e DSA (accessibilità, non solo
   difficoltà)
4. 🆕 Generare domande per verifiche e interrogazioni
5. 🆕 Correggere con criterio: l'IA come assistente, non come giudice
6. 🆕 Spiegare la stessa cosa in cinque modi diversi
7. 🆕 Comunicare con le famiglie: email delicate ai genitori (voti, comportamento,
   segnalazioni)
8. 🆕 Quando lo studente usa l'IA: riconoscere, non demonizzare
9. 🆕 Etica del docente: onestà, privacy degli studenti, valutazione

Da decidere: taglio (generalista vs per disciplina), peso della parte
"riconoscere l'uso dell'IA da parte degli studenti", relazione con il
modulo 4 (riferimenti reciproci vs autonomia).

## Modulo 6: Per chi vuole di più (livello `avanzato`)

Target: developer e professionisti che vogliono integrare l'IA in strumenti
propri. Pubblico tecnico: tono più diretto, meno propedeutico.

Elenco provvisorio:

1. 🆕 Dalle chat alle API (cosa cambia, quando conviene)
2. 🆕 Scegliere il modello (Claude / GPT / Gemini / open source: criteri, non
   tifoseria)
3. 🆕 Il contesto in token (limiti, cosa entra e cosa no)
4. 🆕 System prompt e ruoli (separare istruzioni da input)
5. 🆕 Tool use, function calling, structured output
6. 🆕 RAG: dare all'IA i tuoi documenti (concetti e quando serve davvero)
7. 🆕 Agenti (panoramica realistica, non hype)
8. 🆕 MCP e integrazioni (standard emergenti)
9. 🆕 Prompt injection e sicurezza (input utente, jailbreak, difese pratiche)
10. 🆕 Evals: come testi se il tuo sistema AI funziona davvero
11. 🆕 Costi, prompt caching, pattern di ottimizzazione
12. 🆕 Privacy e data handling nelle API
13. 🆕 Un mini progetto end-to-end (mettere insieme quello che si è visto)

Da decidere: stack degli esempi (Node? Python? Entrambi?), profondità dei
pattern (RAG: spiegazione concettuale o tutorial con codice?). Con 13 voci
il modulo è denso: valutare se spezzarlo in "API di base" + "Oltre le API"
una volta scritte le prime lezioni.

## Pagine trasversali (fuori dai moduli)

- ✅ **Glossario** (`/it/glossary/`) — termini tecnici (Allenamento,
  Allucinazione, Contesto, Freemium, IA, LLM, Memoria, Modello, Prompt)
  con definizione breve e bottone "Spiegamelo meglio con la tua IA"
  che genera un prompt calibrato sul termine.
- ✅ **Chi sono / About** (`/it/about/`, `/en/about/`) — pagina autoriale
  in prima persona: cosa faccio, da dove vengo, perché AI-Guide. Include
  `<MailtoComposer>` verso `ai-guide@larosa.work` per raccolta feedback e
  link a LinkedIn + sito personale. Linkata dal footer (override
  `Footer.astro`) su tutte le pagine.
- ✅ **Privacy del sito** (`/it/privacy/`, `/en/privacy/`) — cosa raccoglie
  il sito stesso (cookie zero, `localStorage` locale, analytics via proxy
  Cloudflare). Non va confusa con la lezione *Quello che condividi quando
  usi l'IA* (Modulo 1, lezione 6), che riguarda le conversazioni del
  lettore con la propria IA.
- 🆕 **FAQ** — privacy, costi, quale IA scegliere, cosa succede se l'IA
  sbaglia, AI Act in pillole.
- 🆕 **Cronologia** (opzionale) — breve storia di come siamo arrivati qui,
  tono narrativo non Wikipedia. Antidoto all'hype: "non è la prima volta
  che l'IA 'arriva'".

## Traduzione

**Inglese live al 100% per i moduli Fondamenti e Uso quotidiano**.
La traduzione EN del Modulo 2 è avanzata lezione per lezione in
pari passo con la stesura IT (decisione 2026-04-20): 8 su 8
tradotte (*Chiedere bene* / *Ask well*, *Iterare la conversazione*
/ *Iterate the conversation*, *Capire una cosa complicata* /
*Understanding something complicated*, *Riassumere un documento
lungo* / *Summarize a long document*, *Imparare un argomento
nuovo* / *Learn something new*, *Scrivere meglio* / *Write better*,
*Foto, immagini e file* / *Photos, images, and files*, *Cose da
NON fare* / *Things NOT to do*).
Cataloghi tradotti, file `.txt` di skill mirror in
`public/skills/en/`, stringhe UI dei componenti in
`src/i18n/ui.ts`. Per aggiungere una terza lingua: aggiungere la voce
in `astro.config.mjs > locales` e in `src/i18n/ui.ts > STRINGS`,
mirrorare `src/content/docs/<lang>/` e `public/skills/<lang>/`.

Le card della homepage e della start-here EN per il Modulo 2 sono
state attivate con la pubblicazione di *Ask well* (commit b64e411,
2026-04-20) e puntano alla prima lezione EN del modulo.

## Workflow per scrivere una lezione

1. Aggiungere la voce nel modulo con stato ✍️ (in questo file).
2. Bozza in `src/content/docs/it/<sezione>/<slug>.mdx` seguendo voice-guide.
3. `/analyze-lesson <path>` per generare domande del lettore.
4. Curare le domande generate in `analysis/<slug>.questions.md` (scartare
   quelle che non convincono, aggiungere le proprie).
5. `/integrate-questions <path>` per applicare le risposte inline, come
   callout, esempio, o FAQ.
6. Agent `style-checker` per QA finale (em dash, pattern AI, voice).
7. Aggiornare lo stato a ✅ in questo file, **nello stesso commit** che
   pubblica la lezione.

## Prossima sessione

**Revisioni pendenti**: nessuna. Modulo Fondamenti chiuso al 100% il
2026-04-19.

**Modulo 2 (Uso quotidiano)**: chiuso al 100% il 2026-04-23. Otto
lezioni pubblicate secondo lo spec in
`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`.
Ciclo di revisione completo su tutte, verifica dell'apprendimento
attiva su ciascuna.

**Prossimo passo**: validazione dello spec per il **Modulo 3 (Sul
lavoro)**. L'elenco provvisorio di 10 voci vive nella sezione
Modulo 3 di questo file. Da decidere prima di scrivere: ordine di
lettura, taglio (orizzontale per professione vs trasversale per
attività), quanti casi d'uso coprire prima di passare al modulo
avanzato. Workflow analogo a Modulo 2: prima uno spec dedicato,
poi il piano di implementazione, poi le singole lezioni.

**Audit moduli 3-6 (2026-04-19)**: aggiunti gap prima non coperti:
- Modulo 3: *Lavorare con dati e tabelle*, *Slide e presentazioni*
- Modulo 4: *Fonti e citazioni*
- Modulo 5: *Inclusività (BES/DSA)*, *Comunicare con le famiglie*
- Modulo 6: *Scegliere il modello*, *Prompt injection e sicurezza*,
  *Evals*
