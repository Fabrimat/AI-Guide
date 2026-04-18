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
   Revisione `analyze-lesson` + `integrate-questions` completata
   (2026-04-18). Manca solo il pass finale dello `style-checker`.

2. ✅ **Cos'è un prompt?** (`fondamenti/cos-e-un-prompt`)
   La parola "prompt" e il modello mentale "è come scrivere un messaggio
   chiaro a qualcuno che vuole aiutarti". Esempio prima/dopo con `<ChatDemo>`
   (vago vs chiaro). Quattro ingredienti di un prompt chiaro, avvertimento
   sui "prompt magici". Revisione (`analyze-lesson` + `integrate-questions`)
   ancora da fare.

3. ✅ **La tua prima conversazione** (`fondamenti/prima-conversazione`)
   La lezione più pratica del modulo. Lista delle IA conversazionali
   principali con link, `<ChatDemo>` come anteprima, `<EsercizioLLM>` che
   riusa `public/skills/primo-esercizio.md` per il primo dialogo guidato.
   Revisione ancora da fare.

4. ⏳ **Come fa l'IA a "capire"?** (`fondamenti/come-capisce-l-ia`)
   Riscrittura alleggerita dell'attuale `fondamenti/cos-e-un-llm`. Indovina
   la parola successiva, impara da molti testi, non sa davvero, non ha
   memoria. Il termine "LLM" arriva solo alla fine come etichetta, non in
   apertura.

5. ⏳ **Quando fidarsi e quando no** (`fondamenti/fidarsi`)
   Allucinazioni con esempi concreti, come verificare, casi d'uso dove
   conviene affidarsi e dove no. Chiude il modulo dando al lettore un modello
   operativo per il rapporto con l'IA.

**Stato attuale**: 3 su 5 pubblicate. La lezione 1 ha completato il ciclo
`analyze-lesson` + `integrate-questions` (manca solo `style-checker`); le
lezioni 2 e 3 hanno la revisione ancora interamente aperta. La vecchia
`cos-e-un-llm.mdx` resta in sidebar a `order: 10` come placeholder, sarà
sostituita dalla lezione 4 quando ci arriveremo.

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
- Lezione 1: integrazione fatta, manca pass finale dello `style-checker`.
- Lezione 2: da lanciare `/analyze-lesson` + `/integrate-questions` + `style-checker`.
- Lezione 3: stesso giro, `/analyze-lesson` + `/integrate-questions` + `style-checker`.

**Prossima bozza**: lezione 4, *"Come fa l'IA a 'capire'?"*. Riscrittura
alleggerita dell'attuale `cos-e-un-llm.mdx`. A quel punto rinomineremo il
file (slug a `come-capisce-l-ia`) e ridaremo `sidebar.order: 4`.
