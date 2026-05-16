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

Target: knowledge worker non developer (project manager, marketing,
HR, consulenza, sales, didattica, design, comunicazione) che sanno già
usare l'IA per cose personali e vogliono portarla nel proprio lavoro.
Taglio trasversale per attività (non per professione). Spec di
modulo: `docs/superpowers/specs/2026-04-23-sul-lavoro-module-design.md`.

Struttura validata 2026-04-23. Nove lezioni, ordine pedagogico = ordine
di scrittura. Livello uniforme `intermedio`: il pubblico ci arriva
dopo Fondamenti + Uso quotidiano o con esperienza equivalente.

1. ✅ **Email difficili** (`at-work/hard-emails`)
   Dire di no, rispondere a chi ha sbagliato, dare feedback delicato.
   Taglio specifico "parola sbagliata costa caro". Tre situazioni,
   pattern in tre passi (racconta la situazione completa, chiedi
   versioni con registri diversi, componi la tua da pezzi), ChatDemo
   portante anonimizzato, callout sul tono per il capo, cosa NON fare.
   Assorbe le due voci provvisorie "Email che funzionano" e
   "Riformulare comunicazioni difficili". **Ciclo di revisione
   completo** (`analyze-lesson` + integrazione manuale curata con
   l'utente + `style-checker` IT e EN, 2026-04-24). Integrazioni
   principali: anonimizzazione completa del ChatDemo (tre modi:
   generico, nome fittizio, iniziali), mini-esempio in *Dire di no*
   (no + ragione + ponte, variante senza ponte), prompt concreto per
   diagnosi del tono in *Rispondere a chi ha sbagliato*, differenza
   reattivo/proattivo tra le due sezioni, nota sull'urgenza al passo
   1 del pattern. Style-checker IT ha richiesto solo un fix
   sull'apertura ("temperatura della stanza" → "chi legge registra
   come reagisci"); EN ha richiesto 11 aggiustamenti di idiomaticità
   (calchi IT→EN).

2. ✅ **Bozze di documenti professionali** (`at-work/draft-professional-documents`)
   Proposte, brief, report. Struttura (exec summary, audience, sezioni),
   non solo scrittura. Il taglio scelto è *struttura prima del testo*: l'IA
   come prima bozza strutturata, non ghostwriter. Tre documenti canonici
   (proposta, brief interno, report), pattern *outline + riempimento*,
   stop-rule sulla scaletta, callout sul template imposto (procurement,
   bandi), calibrazione esplicita sul pubblico. Ciclo di revisione
   completo (`analyze-lesson` + integrazione + `style-checker` IT e EN,
   2026-04-24). Integrazioni principali: riga su "quando ghostwriter va
   bene" in apertura, glossa inline di *handoff* + struttura a quattro
   voci del brief, mini-esempio dati → interpretazione nel report,
   paragrafo "ma io non so criticare" con la domanda-filtro "parla al
   mio cliente o a un cliente generico?", callout `:::tip` stop-rule
   scaletta, callout `:::note` template imposto, chiarimento "sezione
   per sezione tiene una chat unica". Style-checker IT ha richiesto fix
   su due em dash in ChatDemo (righe 178 e 206), "letteralmente" come
   avverbio magico, pattern "Primo/Secondo" listicle mascherato,
   coerenza "executive summary" vs "exec summary". Style-checker EN ha
   richiesto tre fix di idiomaticità ("It happens often" calco dall'IT,
   cascata "so does X, so does Y", "which" relativo in coda).

3. ✅ **Preparare una riunione** (`at-work/prepare-a-meeting`)
   Ordine del giorno strutturato (obiettivo, owner, tempo, decisione
   attesa), brief di preparazione sotto le 150 parole, anticipazione
   delle obiezioni con l'IA come devil's advocate. "Durante" è una
   sezione breve: l'IA non è al tavolo. Dopo, estratto azionabile a
   tre sezioni (decisioni, action item con owner e scadenza, domande
   aperte) invece di "riassumi la riunione". ChatDemo su una
   trascrizione finta di uno status settimanale. Callout `:::note`
   sulle IA integrate nei tool di call (Zoom Companion, Teams
   Copilot, Gemini in Meet) e `:::caution` sulla privacy delle
   trascrizioni come dato di terzi, con criterio pratico per
   decidere se la riunione è "sensibile". Ciclo di revisione
   completo (`analyze-lesson` + integrazione + `style-checker` IT e
   EN, 2026-04-24). Integrazioni principali dall'analisi lettore:
   contesto concreto per il prompt "anticipare obiezioni" (ruoli,
   posta in gioco, storia recente), controllo di completezza
   sull'estratto (scorri l'ordine del giorno), criterio pratico per
   "sensibile" + caso non-sensibile con nomi, specifica sulle
   modalità di consenso (orale per routine, scritto per formale),
   callout `:::note` sulle IA nei tool di call. Style-checker IT ha
   richiesto il fix della frase "questa parte la riprendiamo più
   giù" (regola "vedi sopra/sotto") e due rifiniture opzionali
   (ritrovo → riunione, glossa inline su devil's advocate).
   Style-checker EN ha richiesto 8 fix di idiomaticità (calchi
   IT→EN come "pays a high return", "buy you double", "don't
   land", "beats the benefit", "record only if you're the one
   recording", "paper minutes", "jotted down too", "straight away
   the two topics").

4. ✅ **Slide e presentazioni** (`at-work/slides-and-presentations`)
   Contenuto, non design. Tre prompt rigidi per invertire il default
   "slide piene di testo": scaletta dal documento (filo narrativo in
   N slide, una idea per slide, 30 parole massime), bullet asciutti
   (max 4-6 bullet di max 10 parole, senza verbi alla terza persona,
   telegrafico, cifre e nomi che restano), speaker notes (quello che
   dici a voce, non quello che sta sulla slide, niente ripetizione
   parola per parola). Esempio portante su una slide "Risultati Q2"
   con ChatDemo prima/dopo. Callout `:::note` sui tool di slide
   generate dall'IA (Gamma, Tome, Beautiful.ai, Decktopus) con
   criterio di scelta rispetto al percorso ChatGPT + PowerPoint.
   "Cosa NON chiedere": design, colori, font, animazioni, template.
   Ciclo di revisione completo (`analyze-lesson` + integrazione +
   `style-checker` IT e EN, 2026-04-24). Integrazioni principali
   dall'analisi lettore: decisioni fuori dal prompt (numero di
   slide dal tempo di presentazione, documento lungo da riassumere
   prima), ponte esplicito sul perché "niente verbi alla terza
   persona" fa più lavoro, criterio di scelta Gamma/Tome vs
   ChatGPT+PowerPoint, speaker notes una alla volta non in blocco,
   eccezione pratica per chi non ha template aziendale.
   Style-checker IT: verdetto OK, applicate due rifiniture (link
   mancante a *Bozze di documenti professionali* al secondo
   riferimento, "è importante" → "fa la differenza"). Style-checker
   EN ha richiesto 5 fix di idiomaticità (doppio inciso "which are
   numbers and names, that is...", "carry the narrative" → "tell
   the story", concordanza "are worth" → "is worth", "And what to
   feed in" → "What to feed in", "the dedicated tool" → "your slide
   tool or a designer").

5. ✅ **Lavorare con dati e tabelle** (`at-work/data-and-tables`)
   Tre casi d'uso canonici (pulizia di dati incoerenti, formule
   Excel/Sheets, piccole analisi su estratti), tre mosse di privacy
   prima di caricare in una chat pubblica (policy o test del
   giornale, estrai solo le colonne necessarie, anonimizza i
   nomi), callout *IA pubblica o IA aziendale?* con criterio
   pratico per distinguere consumer vs business, callout *IA per
   l'ad-hoc, BI per il ricorrente* con regola del mese, ChatDemo
   portante sulla pulizia di cinque righe con il vincolo "più una
   riga con i dubbi aperti". Ciclo di revisione completo
   (`analyze-lesson` + integrazione + `style-checker` IT e EN,
   2026-04-24). Integrazioni principali dall'analisi lettore:
   regola 5% con minimo tre per la verifica a campione, pattern
   *campione, regola, estensione* per dataset grandi, mini-paragrafo
   sul rimbalzare l'errore di Excel (`#NOME?`, `#VALORE!`, `#RIF!`)
   alla chat, criterio del giornale per freelance senza IT/legale,
   aggiunta al callout *IA pubblica o IA aziendale?* su come
   distinguere consumer da business dal nome del piano. Style-checker
   IT: verdetto OK con rifiniture opzionali, applicati sei fix
   (link esplicito "vedi sopra/sotto" in due punti, "fa davvero la
   differenza" nell'intro, "veramente utile", titolo "Tre casi
   d'uso concreti", scioglimento di "BI" in Business Intelligence,
   paragrafo "E se le righe sono cinquecento" spezzato).
   Style-checker EN ha richiesto un fix strutturale (*management
   system* come calco di "gestionale", sostituito con *CRM*/*ERP*
   in cinque occorrenze) e nove rifiniture di idiomaticità
   ("caveat you can't skip" → "catch", "hand over" → "give",
   "more robust" + "keeps control" → "safer" + "keeps you in
   control", "The useful part is" → "The real value is",
   "Bouncing the error back" → "Pasting the error back",
   "recurrently" → "regularly", "ask it to a tool" → "ask a
   tool", "what it got even better" → "better still", "the
   difference is in the method" → "method is what separates the
   two", "less risk surface" → "less risk").

6. ✅ **Ricerca per il lavoro** (`at-work/research-for-work`)
   Tre modi di usare l'IA per la ricerca (mappare un territorio
   nuovo, sintetizzare più fonti che hai, fare ricerca live con
   citazioni), tre forme di allucinazione professionale (citazioni
   inventate, numeri tondi senza fonte, sintesi che inventa
   attribuzione), pattern verifica-cita-traccia in tre passi con
   mini-template di tracciamento, callout `:::caution` sulle fonti
   aziendali riservate (coerenza con la sezione privacy della
   lezione 5), ChatDemo portante su un brief competitivo nel
   settore abbigliamento sportivo italiano. Ciclo di revisione
   completo (`analyze-lesson` + integrazione + `style-checker` IT
   e EN, 2026-04-25). Integrazioni principali dall'analisi
   lettore: differenza esplicita tra mappa di un argomento e
   indice di un documento (lezione 4 Modulo 2), volumi oltre il
   limite di contesto + rimando a NotebookLM, callout privacy
   sulle fonti riservate, criterio di scelta tra Perplexity e gli
   altri motori live, regola operativa per quanti link aprire
   (cinque punti del brief = cinque fonti), nota sul vincolo
   "se non hai fonte dillo" (freno non garanzia), Deep Research e
   ricerca agentica con glossa inline. Style-checker IT: una
   violazione netta (em dash dentro l'esempio di tracciamento,
   sostituito con slash) e tre rifiniture opzionali applicate
   ("Vale la pena" → "conviene", due "Lo vedrai/leggerai sotto"
   sostituiti con ancore esplicite, "letteralmente" → "parola
   per parola"). Style-checker EN: OK con rifiniture opzionali,
   applicate cinque polish di idiomaticità ("it happens that"
   calco → "Sometimes", grappolo di "actually" ridotto, "different
   weight" calco → "more weight than", triplo "It [verb]" merged
   in una frase variata, doppio "usually X, usually Y" rimosso).

7. ✅ **L'IA come collega che ti aiuta a pensare** (`at-work/ai-as-thinking-partner`)
   Cambio di postura: l'IA non produce un output, aiuta a tirare
   fuori un pensiero. Tre modi (devil's advocate sulla tua idea,
   brainstorming strutturato divergi-converti, anticipare obiezioni
   in role-play). Sycophancy come rischio specifico, con
   spiegazione di RLHF e tre prompt di sfida (ruolo specifico +
   blocco preamboli + numero/intensità). Test di chiusura "almeno
   una cosa è cambiata" con anti-test su "cambiamento in peggio"
   (rileggi a freddo, verifica i fatti su cui poggia la nuova
   posizione). ChatDemo portante: CFO scettico sul programma di
   mentoring per junior con tre obiezioni (causa-effetto turnover,
   costo nascosto del tempo dei senior, orizzonte di sei mesi
   troppo corto). Ciclo di revisione completo (`analyze-lesson` +
   integrazione + `style-checker` IT e EN, 2026-04-25).
   Integrazioni principali dall'analisi lettore: callout `:::tip`
   "quanto contesto dare" (setup minimo, non brief di pagina),
   traduzione del "critico specifico" per chi non ha ruoli classici
   da consiglio (ONG, freelance, scuola), secondo round di
   brainstorming per uscire dagli angoli ovvi, paragrafo privacy
   nel role-play (riusa la sezione di *Lavorare con dati e
   tabelle*), nota sulla sycophancy che varia tra modelli ma con
   vincoli espliciti come difesa principale, anti-test
   rileggi-a-freddo + verifica fatti per il rischio di cambiare in
   peggio, paragrafo dedicato in *Cosa NON fare* sul thinking
   partner ammesso anche su salute/soldi/legali ma solo per
   pensare meglio (capire opzioni, formulare le domande da fare a
   un professionista). Style-checker IT: OK con rifiniture
   opzionali, applicate quattro correzioni (due deittici
   "sopra/paragrafo precedente" sostituiti con ancore esplicite,
   due "davvero" diradati, "che vedremo fra poco" sostituito con
   link esplicito). Style-checker EN: OK con rifiniture opzionali,
   applicate tre polish ("make the difference" calco di "fare la
   differenza" → "that matter", typo "a accommodating" → "an
   accommodating", "actually" difensivo rimosso). Bug fix di
   contorno: la description in entrambi i frontmatter conteneva un
   `: ` non quotato che YAML parsava come mapping; quotata in
   entrambe le lingue per stabilizzare il build.

8. ✅ **Riusare contesto con i progetti** (`at-work/reuse-context-with-projects`)
   Stesso pattern su Claude Projects, ChatGPT Custom GPTs, Gemini
   Gems: contenitore persistente con istruzioni + file di knowledge
   + esempi, ereditato da ogni chat aperta dentro. Tre ingredienti
   spiegati uno per uno con buone pratiche e cose da evitare.
   Tabella comparativa delle tre piattaforme con punti di forza
   specifici (Claude per i file lunghi, ChatGPT per Actions e
   marketplace, Gemini per la semplicità free). Tre criteri di
   applicabilità (ricorrenza, contesto stabile, più persone o
   canali). Esempio portante: setup di un progetto per la
   newsletter del giovedì di uno studio di consulenza con
   istruzioni complete + tre file mirati di knowledge + esempi
   inline. Cinque cose da non fare: magazzino di file, materiale
   riservato in account consumer, confusione con Memory personale,
   troppi progetti, mancanza di manutenzione. Ciclo di revisione
   completo (`analyze-lesson` + integrazione + `style-checker` IT
   e EN, 2026-04-25). Integrazioni principali dall'analisi
   lettore: ragione meccanica per cui pochi file mirati battono
   molti generici (rilevanza diluita, rischio di pescaggio
   sbagliato), formati dei file (PDF e Markdown affidabili,
   scansionati no), callout `:::tip` su come aggiornare la
   knowledge (cancella e ricarica, no versioning automatico, riga
   "documenti caricati" in calce alle istruzioni), distinzione tra
   creare un Custom GPT (Plus in su) e usarne uno pubblico
   (anche Free), spiegazione di cosa vince fra istruzioni del
   progetto e request del singolo turno (turno esplicito vince,
   default del progetto altrimenti), paragrafo finale su
   manutenzione e fine vita del progetto (passata trimestrale,
   soglia dei due mesi senza aprire). Style-checker IT: OK con
   rifiniture opzionali, applicate due polish lessicali ("La
   knowledge invecchia" → "I documenti caricati invecchiano",
   "overingegnerizzando" → "complicando troppo"). Style-checker
   EN: OK con rifiniture opzionali, applicato un piccolo polish
   ("Below that threshold" → "Below that" per ritmo); il sweep
   sui calchi italiani-inglese non ha trovato nulla.

9. ✅ **Privacy e dati aziendali** (`at-work/company-data-and-privacy`)
   Chiusura del modulo. Scala il modello di privacy personale di
   Fondamenti 6 al contesto aziendale: tre livelli di rischio
   (rosso/giallo/verde), come anonimizzare in pratica (nomi,
   identificatori numerici, dettagli combinabili), piani business
   veri (Team/Enterprise/Workspace/Copilot for Business) vs piani
   consumer (Plus/Pro/Advanced) con il criterio "cerca data
   retention, training opt-out, DPA", NDA come primo filtro,
   GDPR e categorie particolari, AI Act per usi ad alto rischio,
   policy aziendale e variante freelance. Ponte ai moduli
   successivi (4, 5, 6) come chiusura naturale del modulo.
   Ciclo di revisione completo (`analyze-lesson` + integrazione +
   `style-checker` IT e EN, 2026-04-25). Integrazioni principali
   dall'analisi lettore: glossa inline su DPA e DPO, chiarimento
   "Plus/Pro/Advanced sono consumer, non business", callout
   `:::tip` "se ho già incollato dati in passato" con tre
   contromisure, callout `:::tip` su PDF scansionati/foto/audio
   (anonimizzazione alla fonte, riscrittura, OCR locale), check
   rapido "leggi come un estraneo" prima di incollare,
   distinzione fra numeri di business che servono al ragionamento
   e numeri da tagliare, glossa su backend Azure OpenAI di
   Microsoft Copilot, esempio pratico AI Act ("studio piccolo che
   fa screening di CV"), variante freelance con clausola tipo
   nei contratti. Style-checker IT: OK con rifiniture opzionali,
   applicate due polish ("qui sotto" → "tipiche dei piani
   business" per evitare deittico, chiusura "Lo strumento
   amplifica chi sei" attenuata in formula meno keynote).
   Style-checker EN: OK con rifiniture opzionali, applicate
   quattro polish (variazione "usually" → "typically" / "likely",
   "roughly these three" → "Business plans usually offer three",
   periodo lungo del DPA spezzato in due frasi, "may move you in"
   → "may put you in scope").

**Stato attuale**: **9 su 9 pubblicate, modulo Sul lavoro
completo al 100%** (2026-04-25). Tutte le lezioni live (IT + EN)
con verifica dell'apprendimento attiva (sezione `<LlmExercise
variant="review">` prima di "Cosa viene dopo", con prompt
dedicato in `public/skills/<locale>/review-<slug>.txt`); sidebar
Modulo 3 con tutte e 9 le lezioni attive, nessun placeholder
disabilitato; card "Sul lavoro" / "At work" in homepage e
start-here attive, puntano alla lezione 1.

## Modulo 4: Per studenti (livello `intermedio`)

Target: studenti dalle superiori all'università (più adulti in
riqualificazione), che vogliono usare l'IA come supporto allo studio
senza cadere nel "fammi i compiti". Tono pratico, attento al rischio
plagio e al confine fra studio e sostituzione. Spec di modulo:
`docs/superpowers/specs/2026-05-13-per-studenti-module-design.md`.

Struttura validata 2026-05-13. Otto lezioni, ordine pedagogico = ordine
di scrittura. Livello uniforme `intermedio`: il pubblico ci arriva
dopo Fondamenti + Uso quotidiano (o con esperienza equivalente).

1. ✅ **Studiare un argomento nuovo** (`for-students/study-a-new-topic`)
   Studio formale contro un programma fissato. Apre il modulo col
   contratto "non è il manuale del fammi i compiti". Ciclo di revisione
   completo (`analyze-lesson` + `integrate-questions` + `style-checker`
   IT e EN, 2026-05-13). Integrazioni principali dall'analisi lettore:
   estensione del bullet "materiale di riferimento" per coprire mix di
   libri + dispense + slide, esplicitazione della tensione prof vs
   manuale, paragrafo di apertura della sezione tecniche che chiarisce
   la combinazione fra le tre, callout `:::tip` "Quanto incollare per
   volta", precisazione sulle slide scarne, esempio operativo concreto
   nella Tecnica 3 (storia contemporanea, Mosse/Gentile), callout
   `:::note` "Per chi studia matematica, fisica, ingegneria,
   informatica", test rapido di verifica dell'ancoraggio, estensione
   del check Feynman finale con cosa fare se inciampi. Style-checker
   IT: OK con rifiniture (rimozione mic-drop "È tutto qui", due codici
   M2L5 sostituiti con link espliciti a `learn-something-new`, due
   "davvero" difensivi rimossi). Style-checker EN: OK con un fix di
   calco ("questions of type Z" → "questions like Z").

2. ✅ **Appunti da lezioni e testi lunghi** (`for-students/notes-from-lectures`)
   Materiale grezzo (audio, dispense, slide) portato a forma studiabile.
   Ciclo di revisione completo (`analyze-lesson` + `integrate-questions` +
   `style-checker` IT e EN, 2026-05-13). Integrazioni principali
   dall'analisi lettore: estensione del riferimento alla capienza di
   contesto con guida pratica (un'ora di audio + slide + 40-50 pagine
   di capitolo nello stesso prompt), tip Whisper estesa con esempi
   concreti di nomi propri normalizzati (Husserl→Usserl, Schmitt→Smith),
   nota sulla qualità della foto degli appunti scritti a mano + comportamento
   dell'IA di fronte alla grafia da medico, callout `:::caution` "Verifica
   i tag prima di fidarti" sul fatto che le attribuzioni `[Prof]
   [Manuale] [Slide]` sono fatte dall'IA e possono sbagliare, nota
   sul piano richiesto per Claude Projects e ChatGPT Custom GPTs (Gems
   gratuiti, in alternativa lavoro a chat singole), estensione del "Cosa
   NON fare 2" sulla tensione prof-vs-manuale e come gestirla all'orale.
   Style-checker IT: OK con un fix critico (un em dash a riga 95 dentro
   una parentesi annidata, sciolto in due frasi). Style-checker EN: OK
   con un "actually" borderline non bloccante (mantenuto, fa lavoro
   semantico).

3. ✅ **Ripassare prima di un esame** (`for-students/revise-before-an-exam`)
   Interrogazioni simulate, mappe, flashcards, strategia per il docente.
   Ciclo di revisione completo (`analyze-lesson` + `integrate-questions` +
   `style-checker` IT e EN, 2026-05-13). Integrazioni principali
   dall'analisi lettore: paragrafo "cadenza pratica della sessione"
   (durata 40 minuti, 5-8 domande, soglia "tre risposte di fila senza
   correzione"), istruzioni per studenti senza manuale unico (slide +
   dispense + articoli → ricostruire 15-20 voci dai titoli), pattern
   per test a risposta multipla con spiegazione del "perché no" ai
   distrattori, strategia "primo esame con prof sconosciuto" (default
   sul profilo imprevedibile), terza contromisura cross-IA nel callout
   "L'IA che ti conferma" (Claude vs ChatGPT vs Gemini come tripla
   verifica), workflow di quando verificare sul manuale (in tempo reale
   per correzioni concettuali, fine sessione per puntuali). Style-checker
   IT: OK con un fix di accordo sintattico ("alle distrattori" → "ai
   distrattori"). Style-checker EN: OK, conversione "28" → "B+" 
   verificata coerente in entrambe le occorrenze.

4. ✅ **Scrivere una tesi** (`for-students/write-a-thesis`)
   Pubblicata IT + EN il 2026-05-13. La lezione più lunga del modulo
   (~1525 parole IT). Outline + riempimento ereditato da M3L2, ogni
   capitolo è un dialogo separato, IA come secondo lettore (non
   autore). ChatDemo portante su Manierismo a Firenze (committenza
   medicea vs romana). Callout `:::note` "E se la mia tesi è di
   laboratorio?" per generalizzare il pattern alle tesi STEM, callout
   `:::tip` "Relatore evasivo" su come ricavare aspettative
   indirettamente, callout `:::caution` "Dichiarazione dell'uso di
   LLM" con confine pratico fra revisione e generazione. Ciclo di
   revisione completo (`analyze-lesson` 10 domande + `integrate-questions`
   con 6 modifiche + style-checker IT e EN, 2026-05-13). Integrazioni
   principali dall'analisi lettore: callout STEM (il pattern oltre
   l'umanistica), esempio inline sul confine "rendi più chiara" vs
   "riformula come se l'avessi scritto io", quaderno delle idee
   originali concretizzato (tre cose da annotare), gestione dell'ateneo
   senza policy ufficiale ("dichiara comunque"), relatore evasivo.

5. ✅ **Fonti e citazioni** (`for-students/sources-and-citations`)
   Pubblicata IT + EN il 2026-05-13. Lezione tecnica sul tema più
   rischioso del modulo: bibliografia. Anatomia della citazione
   inventata (quattro pattern tipici), DOI come gate di verifica con
   tre esiti possibili, quattro stili principali (APA, MLA, Chicago,
   ISO 690) con guida pratica alla scelta, tre filtri per distinguere
   fonte accademica vera da blog mascherato (DOI, journal indicizzato,
   editore noto). ChatDemo portante: economia, tre paper sulla
   tassazione dei consumi alimentari, due con DOI inventati e uno vero
   (Cawley et al. 2019). Callout `:::tip` "IA con accesso al web"
   (ChatGPT browsing, Claude web search, Perplexity), `:::note`
   "Fonti istituzionali: caso a parte" (Banca d'Italia, OECD, ISTAT),
   `:::tip` "NotebookLM e simili" (Claude Projects, Custom GPTs).
   Ciclo di revisione completo (`analyze-lesson` 8 domande +
   `integrate-questions` con 7 modifiche + style-checker IT e EN,
   2026-05-13). Integrazioni principali dall'analisi lettore:
   spiegazione concettuale del "perché l'IA inventa con quella
   struttura precisa" (combinazione plausibile vs combinazione
   esistente è informazione esterna al pattern di scrittura),
   chiarimento operativo su proxy della biblioteca, Zotero spiegato
   per chi non lo conosce (installazione, sync, plugin Word/Docs),
   scelta dello stile per disciplina, differenza fra NotebookLM,
   Claude Projects, Custom GPTs.

6. ✅ **Tradurre e confrontare testi** (`for-students/translate-and-compare`)
   Pubblicata IT + EN il 2026-05-13. Lezione laterale per il pubblico
   di lingue (moderne e antiche), classici, letterature comparate,
   filologia. Pattern delle tre versioni (letterale, idiomatica,
   libera) per non scegliere ma ricomporre; glosse storiche con
   verifica obbligatoria; confronto fra edizioni (Monti vs Calzecchi
   Onesti per *Iliade* in IT, Lattimore vs Fagles in EN; Pavese vs
   Fatica per *Moby Dick* in IT, Heaney vs Tolkien per *Beowulf* in
   EN); registri formale/informale per lingue moderne con varianti
   regionali. ChatDemo portante: Catullo *Carme 5* (*Vivamus, mea
   Lesbia, atque amemus*), tre versioni + glossa solida su *vivamus*
   + glossa con incertezza dichiarata su *amemus*. Callout `:::tip`
   "Senza accesso a enciclopedie a pagamento" (Perseus, SEP,
   Wikipedia EN/FR, Castiglioni-Mariotti, Rocci, LSJ), `:::caution`
   "Quando l'IA non dichiara incertezza ma sbaglia" (tre contromisure
   per non-esperti), `:::caution` "Trabocchetti linguistici" (falsi
   amici, registri storici, dialetti), `:::danger` "L'IA in una
   verifica di traduzione è plagio" con zona grigia studio vs
   preparazione di plagio. Ciclo di revisione completo
   (`analyze-lesson` 9 domande + `integrate-questions` con 7
   modifiche + style-checker IT e EN, 2026-05-13). Integrazioni
   principali: priorità delle glosse da verificare (nomi propri,
   date, etimologie), istruzioni per il confronto fra edizioni
   (incollare sempre 10-30 versi, mai fidarsi della memoria dell'IA
   per opere note), gestione di testi con una sola traduzione
   italiana, alternative gratuite a OCD, contromisure per la glossa
   sbagliata senza dichiarazione di incertezza, distinzione studio
   vs preparazione di plagio.

7. ✅ **Quando l'IA ti imbroglia** (`for-students/when-ai-tricks-you`)
   Pubblicata IT + EN il 2026-05-13. Lezione di critica della risposta
   calibrata sul contesto studio. Apertura sul problema strutturale
   (chi studia per la prima volta non può accorgersi dell'errore).
   Cinque errori tipici in contesto studio: definizioni shift dal
   manuale (anomia Durkheim vs Merton), date confuse (Yalta marzo vs
   febbraio 1945), biografie miste (stoa media, Curie, papi numerati,
   Carracci), formule giuste nella forma ma sbagliate nel segno
   (*F = ma* sempre giusta, equazione di Schrödinger spesso sbagliata),
   opere fantasma (Foucault, *Le tecniche del sapere normativo*). Tre
   test rapidi che funzionano senza sapere la risposta: test del
   manuale, test della fonte, test del secondo prompt. ChatDemo
   portante sullo studente di Storia che verifica la data di Yalta.
   Callout `:::tip` "Riconoscere una domanda ad alto rischio" (cifra
   precisa + omonimi/varianti), `:::note` "Quando la 'chat nuova' non
   è davvero nuova" (ChatGPT memory, Claude Projects), `:::tip`
   "Materie più rischiose" (matematica, fisica, medicina, diritto,
   cronologie). Ciclo di revisione completo (`analyze-lesson` 8
   domande + `integrate-questions` con 5 modifiche + style-checker
   IT e EN, 2026-05-13). Integrazioni principali: secondo esempio
   trasversale per biografie miste (Curie, Carracci, papi), istruzioni
   pratiche su formulazione del secondo prompt, test del manuale per
   chi non ha un manuale unico, callout su IA con memoria attivata.

8. ✅ **Etica dello studio** (`for-students/ethics-of-studying`)
   Pubblicata IT + EN il 2026-05-13. Chiusura del modulo. Apertura
   sul richiamo al contratto fissato nella lezione 1 e alla regola
   "chi firma" di M2L8. Scala dei quattro livelli di uso (spiegazione/
   tutor sempre OK; organizzazione/struttura di solito OK con
   dichiarazione; generazione di porzioni dipende dal contesto, con
   quattro casi distinti tesi/paper/saggio/lavori non valutati;
   generazione completa è copiato anche se riscritta parola per
   parola). Sezione su dichiarazione dell'uso con formula tipo
   completa di "sono stati usati come" e "NON sono stati usati per",
   istruzioni per compilare i placeholder con un esempio concreto
   (ChatGPT Plus GPT-5 al 12 maggio 2026, Claude Sonnet 4.6).
   Callout `:::note` "Le politiche d'istituto cambiano" (Polimi,
   Bocconi, Sapienza in IT; Polimi, MIT, Stanford in EN). Callout
   `:::caution` "Esami proctored e AI detector" con citazione del
   disclaimer ufficiale Turnitin. Regola "chi firma" applicata in
   tre casi (orale, tesi, esame). Ciclo di revisione completo
   (`analyze-lesson` 8 domande + `integrate-questions` con 4
   modifiche inline + style-checker IT e EN, 2026-05-13).
   Integrazioni principali: linea pratica fra revisore di stile e
   autore di paragrafi, caso limite della riscrittura completa,
   esempio di compilazione dei placeholder, indicatori concreti che
   un commissario riconosce. Ponte ai moduli successivi (Per docenti,
   Per chi vuole di più). Non usa ChatDemo (lezione concettuale/etica).

**Stato attuale**: 8 su 8 pubblicate, **modulo Per studenti completo
al 100%**.

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

1. ✍️ **Progettare una lezione** (`for-teachers/design-a-lesson`)
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

## Modulo 6: Per chi vuole di più (livello `avanzato`)

Target: developer e professionisti che vogliono integrare l'IA in strumenti
propri. Pubblico tecnico: tono più diretto, meno propedeutico.

Slug definitivi e ordine in sidebar (2026-04-23). Decisione 2026-04-23:
il modulo resta un blocco unico da 13 voci finché non ne vengono scritte
le prime 3-4 lezioni; se cresce, valutare lo split in "Core APIs" +
"Beyond APIs".

1. 🆕 **Dalle chat alle API** (`going-deeper/from-chats-to-apis`) — cosa cambia, quando conviene.
2. 🆕 **Scegliere il modello** (`going-deeper/choose-the-model`) — Claude / GPT / Gemini / open source: criteri, non tifoseria.
3. 🆕 **Il contesto in token** (`going-deeper/context-in-tokens`) — limiti, cosa entra e cosa no.
4. 🆕 **System prompt e ruoli** (`going-deeper/system-prompts-and-roles`) — separare istruzioni da input.
5. 🆕 **Tool use, function calling, structured output** (`going-deeper/tool-use-and-structured-output`).
6. 🆕 **RAG: dare all'IA i tuoi documenti** (`going-deeper/rag`) — concetti e quando serve davvero.
7. 🆕 **Agenti** (`going-deeper/agents`) — panoramica realistica, non hype.
8. 🆕 **MCP e integrazioni** (`going-deeper/mcp-and-integrations`) — standard emergenti.
9. 🆕 **Prompt injection e sicurezza** (`going-deeper/prompt-injection`) — input utente, jailbreak, difese pratiche.
10. 🆕 **Evals** (`going-deeper/evals`) — come testi se il tuo sistema IA funziona.
11. 🆕 **Costi e prompt caching** (`going-deeper/costs-and-caching`) — pattern di ottimizzazione.
12. 🆕 **Privacy e dati nelle API** (`going-deeper/privacy-in-apis`).
13. 🆕 **Mini progetto end-to-end** (`going-deeper/mini-project`) — mettere insieme quello che si è visto.

Da decidere prima di scrivere: stack degli esempi (Node? Python?
Entrambi?), profondità dei pattern (RAG: spiegazione concettuale o
tutorial con codice?).

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

**Audit moduli 3-6 (storico)**: gap identificati e coperti nei moduli
3, 4 (chiusi), 5 (in scrittura). Per Modulo 6 vedi piano provvisorio
in `CONTENT.md`.
