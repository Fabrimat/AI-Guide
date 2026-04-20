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

**Stato attuale**: 1 su 8 pubblicate.

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

**Inglese live al 100% per il modulo Fondamenti**. Per il **Modulo 2
(Uso quotidiano)** la traduzione EN avanza lezione per lezione in pari
passo con la stesura IT (decisione 2026-04-20): 1 su 8 tradotta
(*Chiedere bene* / *Ask well*). Cataloghi tradotti, file `.txt` di
skill mirror in `public/skills/en/`, stringhe UI dei componenti in
`src/i18n/ui.ts`. Per aggiungere una terza lingua: aggiungere la voce
in `astro.config.mjs > locales` e in `src/i18n/ui.ts > STRINGS`,
mirrorare `src/content/docs/<lang>/` e `public/skills/<lang>/`.

Le card della homepage e della start-here EN per il Modulo 2 restano
`comingSoon: true` finché non è tradotta una massa critica di lezioni
(criterio: metà del modulo oppure le prime 4 in ordine pedagogico, da
riconsiderare strada facendo).

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

**Modulo 2 (Uso quotidiano)**: struttura validata 2026-04-20 in
`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`.
Piano di implementazione in
`docs/superpowers/plans/2026-04-20-uso-quotidiano-module.md`.
Stato: 1 su 8 lezioni pubblicate (Chiedere bene, 2026-04-20).
Prossima bozza: lezione 2, **Iterare la conversazione**
(`everyday-use/iterate-the-conversation`).

**Audit moduli 3-6 (2026-04-19)**: aggiunti gap prima non coperti:
- Modulo 3: *Lavorare con dati e tabelle*, *Slide e presentazioni*
- Modulo 4: *Fonti e citazioni*
- Modulo 5: *Inclusività (BES/DSA)*, *Comunicare con le famiglie*
- Modulo 6: *Scegliere il modello*, *Prompt injection e sicurezza*,
  *Evals*
