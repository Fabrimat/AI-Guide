# Piano dei contenuti

Roadmap editoriale di AI-Guide. Aggiornare questo file **nello stesso commit**
in cui una lezione viene scritta, spostata, o eliminata. Serve per sapere in
ogni momento cosa c'è, cosa manca, e cosa arriva dopo.

## Obiettivo e pubblico

AI-Guide insegna a usare l'IA in modo pratico e consapevole, con priorità al
pubblico italiano **non tecnico**. Il percorso va dal "non so cosa sia" al
"so usarla ogni giorno", con un modulo avanzato per chi vuole integrarla nel
proprio lavoro (developer, professionisti).

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
Cinque lezioni da 5-8 minuti ciascuna, pensate come percorso lineare.

1. ✅ **Ma cos'è l'IA?** (`fondamenti/cos-e-l-ia`)
   Demistificazione generale. Cosa è davvero, cosa no. Le due famiglie
   (IA specializzate vs conversazionali). Quattro miti da chiarire subito.
   **Ciclo di revisione completo** (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-18).

2. ✅ **Cos'è un prompt?** (`fondamenti/cos-e-un-prompt`)
   La parola "prompt" e il modello mentale "è come scrivere un messaggio
   chiaro a qualcuno che vuole aiutarti". Esempio prima/dopo con `<ChatDemo>`
   (vago vs chiaro). Quattro ingredienti di un prompt chiaro, avvertimento
   sui "prompt magici". **Ciclo di revisione completo** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-18). Style-checker ha
   restituito OK senza richiedere modifiche.

3. ✅ **La tua prima conversazione** (`fondamenti/prima-conversazione`)
   La lezione più pratica del modulo. Lista delle IA conversazionali
   principali con link, `<ChatDemo>` come anteprima, `<EsercizioLLM>` che
   riusa `public/skills/primo-esercizio.md` per il primo dialogo guidato.
   **Ciclo di revisione completo** (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-18). Style-checker ha catturato una
   incoerenza fattuale residua dopo l'integrazione delle domande
   ("Tre situazioni tipiche" mentre la lista era cresciuta a quattro
   bullet), corretta in "Le situazioni più comuni".

4. ✅ **Come fa l'IA a "capire"?** (`fondamenti/come-capisce-l-ia`)
   Spiegazione del meccanismo "una parola alla volta", come ha imparato
   (testo enorme, schemi non memorie), tre conseguenze pratiche per il
   lettore (non sa, contesto conta, memoria solo nella stessa chat),
   perché sembra intelligente, e infine il termine "LLM" come etichetta
   tecnica a fine pagina. Riusa il `<ChatDemo>` dei buchi neri come ancora
   visiva. Revisione ancora da fare.

5. ✅ **Quando fidarsi e quando no** (`fondamenti/fidarsi`)
   Apre con il problema del "convincente anche quando sbaglia". `<ChatDemo>`
   con riassunto di un libro inventato per mostrare un'allucinazione in
   atto. Mappa "dove va bene / dove va male" pratica, tre mosse per
   verificare a sforzo crescente, e una mentalità di chiusura ("assistente
   brillante ma incostante"). Termine "allucinazione" introdotto a metà
   come etichetta. Chiude il modulo Fondamenti e ponte verso *Uso
   quotidiano*. Revisione ancora da fare.

**Stato attuale**: 5 su 5 pubblicate. **Modulo Fondamenti completo come bozza**.
Lezioni 1, 2 e 3 hanno completato l'intero ciclo di revisione; lezioni 4 e 5
hanno la revisione ancora aperta. La vecchia `cos-e-un-llm.mdx` è stata
rinominata `come-capisce-l-ia.mdx` e riscritta da capo: il vecchio URL
`/it/fondamenti/cos-e-un-llm/` non esiste più (per ora non è un problema, il
sito non è ancora pubblicato).

## Modulo 2: Uso quotidiano (livello `intermedio`)

Target: chi usa già ChatGPT/Claude/Gemini occasionalmente e vuole usarli
meglio nel quotidiano. Ogni lezione è un caso d'uso concreto.

Elenco provvisorio, da validare prima di scrivere:

1. 🆕 Formulare una richiesta che funziona (chiarezza, contesto, formato atteso)
2. 🆕 Iterare: il prompt come conversazione (non "prompt magici")
3. 🆕 Riassumere un documento lungo (esempio su PDF o articolo reale)
4. 🆕 Imparare un argomento nuovo con l'IA (il tutor personale)
5. 🆕 Scrivere meglio (email, testi, quando sì e quando no)
6. 🆕 Pianificare (viaggio, attività, evento)
7. 🆕 Quando l'IA è meglio di Google, e viceversa
8. 🆕 Cose da NON fare con l'IA (consigli sanitari, finanza, decisioni senza
   verifica)

Da decidere: ordine definitivo, eventuali accorpamenti, numero finale.

## Modulo 3: Per chi vuole di più (livello `avanzato`)

Target: developer e professionisti che vogliono integrare l'IA in strumenti
propri. Pubblico tecnico: tono più diretto, meno propedeutico.

Elenco provvisorio:

1. 🆕 Dalle chat alle API (cosa cambia, quando conviene)
2. 🆕 Il contesto in token (limiti, cosa entra e cosa no)
3. 🆕 System prompt e ruoli (separare istruzioni da input)
4. 🆕 Tool use, function calling, structured output
5. 🆕 RAG: dare all'IA i tuoi documenti (concetti e quando serve davvero)
6. 🆕 Agenti (panoramica realistica, non hype)
7. 🆕 MCP e integrazioni (standard emergenti)
8. 🆕 Costi, prompt caching, pattern di ottimizzazione
9. 🆕 Privacy e data handling nelle API
10. 🆕 Un mini progetto end-to-end (mettere insieme quello che si è visto)

Da decidere: stack degli esempi (Node? Python? Entrambi?), profondità dei
pattern (RAG: spiegazione concettuale o tutorial con codice?).

## Pagine trasversali (fuori dai moduli)

- 🆕 **Glossario** — termini tecnici con definizione breve, ordine alfabetico.
- 🆕 **FAQ** — privacy, costi, quale IA scegliere, cosa succede se l'IA sbaglia.
- 🆕 **Chi fa AI-Guide / Contribuisci** — about + come proporre modifiche.
- 🆕 **Cronologia** (opzionale) — breve storia di come siamo arrivati qui.

## Traduzione

Mirror completo in inglese sotto `src/content/docs/en/`. Da avviare quando il
**modulo 1 italiano è stabile** (5 su 5 lezioni pubblicate e passate in QA).
Le pagine non tradotte ricadono automaticamente sull'italiano, quindi si può
tradurre una pagina alla volta senza rompere il sito.

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

Due filoni aperti, scegliere in che ordine attaccarli:

**Revisioni pendenti**:
- Lezione 4: da lanciare `/analyze-lesson` + `/integrate-questions` + `style-checker`.
- Lezione 5: stesso giro.

**Prossima bozza**: nessuna nel modulo Fondamenti, è completo. Dopo le
revisioni di 4 e 5, decidere se aprire il **modulo 2 (Uso quotidiano)** o
fare prima un giro di rifiniture: la lista provvisoria degli 8 titoli è
ancora `🆕`, va validata o ridisegnata.
