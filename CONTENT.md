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

6. 🆕 **Quello che condividi quando usi l'IA** (`fundamentals/privacy-basics`)
   Lezione sulla privacy delle proprie conversazioni, non sui dati del
   sito (per quella c'è già `/it/privacy/`). Tono non legale, "la nonna
   chiede". Cinque blocchi: cosa vede l'IA quando le parli (testo, file,
   immagini), cosa succede dopo (storage, training, differenze Free /
   Plus / Team / Enterprise), cosa non condividere (dati di terzi,
   segreti professionali, password, documenti sanitari/fiscali altrui),
   impostazioni che esistono (opt-out dal training, cronologia temporanea,
   chat senza memoria), modello mentale di chiusura ("trattala come un
   collega fidato ma con una catena informativa ignota"). Chiude il
   modulo Fondamenti.

**Stato attuale**: 5 su 6 pubblicate, lezione 6 (privacy-basics) da
scrivere. Ciclo di revisione chiuso su tutte le lezioni esistenti,
verifica dell'apprendimento attiva su tutte (sezione
`<EsercizioLLM variant="verifica">` prima di "Cosa viene dopo", con
prompt dedicato in `public/skills/verifica-<slug>.txt`).
La vecchia `cos-e-un-llm.mdx` è stata rinominata `come-capisce-l-ia.mdx` e
riscritta da capo: il vecchio URL `/it/fondamenti/cos-e-un-llm/` non esiste
più (per ora non è un problema, il sito non è ancora pubblicato).

## Modulo 2: Uso quotidiano (livello `intermedio`)

Target: chi usa già ChatGPT/Claude/Gemini occasionalmente e vuole usarli
meglio nel quotidiano. Ogni lezione è un caso d'uso concreto.

Elenco provvisorio, da validare prima di scrivere:

1. 🆕 Formulare una richiesta che funziona (chiarezza, contesto, formato atteso)
2. 🆕 Iterare: il prompt come conversazione (non "prompt magici")
3. 🆕 Riassumere un documento lungo (esempio su PDF o articolo reale)
4. 🆕 Capire una cosa complicata (contratto, referto medico, bolletta,
   regolamento condominiale: tradurre dal burocratese al quotidiano)
5. 🆕 Imparare un argomento nuovo con l'IA (il tutor personale)
6. 🆕 Scrivere meglio (email, testi, quando sì e quando no)
7. 🆕 Foto, immagini e file: parlare all'IA senza parole (multimodalità)
8. 🆕 Pianificare (viaggio, attività, evento)
9. 🆕 Quando l'IA è meglio di Google, e viceversa
10. 🆕 Cose da NON fare con l'IA (consigli sanitari, finanza, decisioni senza
    verifica)

Da decidere: ordine definitivo, eventuali accorpamenti, numero finale.

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

**Inglese live al 100% per il modulo Fondamenti** (8 pagine totali: index,
start-here, glossary, 5 lezioni). Cataloghi tradotti, file `.txt` di skill
mirror in `public/skills/en/`, stringhe UI dei componenti in
`src/i18n/ui.ts`. Per aggiungere una terza lingua: aggiungere la voce in
`astro.config.mjs > locales` e in `src/i18n/ui.ts > STRINGS`, mirrorare
`src/content/docs/<lang>/` e `public/skills/<lang>/`.

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

**Revisioni pendenti**: nessuna sulle lezioni già pubblicate.

**Prossima bozza nel modulo Fondamenti**: lezione 6 *Quello che condividi
quando usi l'IA* (`fundamentals/privacy-basics`). Aggiunta al piano il
2026-04-19 dopo audit dei moduli: gap identificato sul livello principiante
(la domanda "che fine fanno i miei messaggi?" blocca chi non ha mai usato
un'IA). Taglio non legale, 5 blocchi già definiti nel modulo 1 sopra.

**Audit moduli 2-6 (2026-04-19)**: aggiunti gap prima non coperti:
- Modulo 2: *Capire una cosa complicata*, *Foto, immagini e file*
- Modulo 3: *Lavorare con dati e tabelle*, *Slide e presentazioni*
- Modulo 4: *Fonti e citazioni*
- Modulo 5: *Inclusività (BES/DSA)*, *Comunicare con le famiglie*
- Modulo 6: *Scegliere il modello*, *Prompt injection e sicurezza*,
  *Evals*

Decisione aperta: dopo aver scritto *privacy-basics* e chiuso davvero
Fondamenti, aprire il **modulo 2 (Uso quotidiano)** validando l'ordine
definitivo delle 10 voci, oppure prima un giro di rifiniture al sito
(inizia-qui che linka tutte e 6 le lezioni, ecc.).
