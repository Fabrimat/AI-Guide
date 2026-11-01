# Modulo "Per mestiere": design

Data: 2026-11-01. Stato: da approvare.

## Intento

Persone non tecniche che fanno a mano, ogni settimana, lavori ripetitivi del
proprio mestiere devono poter chiudere la pagina e farli da sole con l'IA che
usano davvero. Il metro di successo è l'autonomia: il lettore ripete il compito
la settimana dopo senza tornare sulla guida e senza chiedere a nessuno.

Il modulo nasce con due mestieri ed è pensato per crescere: aggiungere un
mestiere deve voler dire aggiungere una cartella e una voce in sidebar.

## Obiettivi

- Lezioni costruite su un compito reale del mestiere, mostrato dall'inizio
  alla fine (dalle note grezze al documento finito), non su un concetto.
- Istruzioni passo passo sullo strumento che quel mestiere usa davvero:
  **Claude** per l'agenzia viaggi, **Copilot** per il dipendente pubblico.
  Nomi di menu e pulsanti reali, con la data della verifica ("verificato a
  novembre 2026").
- Insegnare a configurare un assistente di mestiere: come si crea davvero un
  Progetto, come si scrivono le istruzioni/linee guida, quali file caricare,
  come lo si aggiorna.
- Essere onesti sui limiti: cosa l'IA non sa (festività locali, scioperi,
  orari, norme vigenti) e come verificarlo a mano.

## Non obiettivi

- Non ripetere le lezioni generali già esistenti (privacy, bozze, tabelle,
  ricerca, progetti in astratto): si linkano.
- Non coprire tutti gli strumenti in ogni lezione. Lo strumento principale
  del mestiere in primo piano; gli altri al massimo in una nota.
- Non insegnare integrazioni tecniche (API, Zapier, macro VBA, Power Automate).
  "Automazione" qui significa: assistente configurato una volta + modelli +
  fogli Excel con formule che l'IA aiuta a costruire.

## Anti-obiettivi (fallimento anche se tecnicamente funziona)

- Una lista di "prompt magici" da copiare senza capire.
- Istruzioni che invitano a incollare dati personali di clienti o cittadini
  dove non si dovrebbe (passaporti, codici fiscali, pratiche).
- Un itinerario o una lettera "verificati dall'IA" presentati come affidabili.
- Fatti sugli strumenti (nomi di piani, menu, limiti) inventati o non datati.
- Tono da documentazione aziendale; si applica la voice guide per intero.

## Struttura

Nuovo modulo nella sidebar dopo "Sul lavoro": **"Per mestiere" / "By
profession"**, cartella `src/content/docs/<lang>/by-profession/`.

```
by-profession/
  index.mdx                         pagina di ingresso: elenco mestieri (HomeCards)
  your-work-assistant.mdx           lezione comune: l'assistente di mestiere
  travel-agency/
    start-here.mdx                  parti da qui (applica la lezione comune)
    quote-from-template.mdx
    checked-itinerary.mdx
    payment-tracker.mdx
  public-sector/
    start-here.mdx
    citizen-replies.mdx
    minutes-and-circulars.mdx
    fix-a-letter-check-facts.mdx
```

Slug in inglese come nel resto del sito; mirror EN con stessi percorsi.

### Lezione comune: `your-work-assistant` ("Il tuo assistente di mestiere")

Livello `principiante`, prerequisito `ask-well`. Il manuale d'uso pratico che
manca a `at-work/reuse-context-with-projects` (che resta concettuale e viene
linkata):

- creare un Progetto passo passo in **Claude** e in **ChatGPT**; l'equivalente
  in **Copilot** (da verificare cosa offre davvero, vedi Ricerca);
- scrivere le istruzioni del Progetto: chi sei e cosa fai, per chi scrivi,
  tono, formato, cosa non fare mai, cosa chiedere quando mancano informazioni;
  con un modello di istruzioni da riempire;
- quali file caricare (modelli, listini, condizioni, due esempi buoni) e quali
  no (dati personali);
- come si aggiorna: quando l'output sbaglia sempre nello stesso modo, si
  corregge l'istruzione, non la singola chat.

Esercizio `.txt`: l'IA intervista il lettore e alla fine gli consegna le
istruzioni del suo Progetto, pronte da incollare.

### Agenzia viaggi (strumento: Claude)

Persona di riferimento: titolare di una piccola agenzia, usa Word ed Excel,
non tecnica. Esempi con clienti e agenzia fittizi (nessun nome reale di
agenzia o persona).

1. **start-here: Prepara Claude per la tua agenzia.** Applica la lezione
   comune: istruzioni già scritte per un'agenzia (da adattare), cosa caricare
   (modello di preventivo, condizioni generali, tono), regola sui dati dei
   clienti (nomi sì se servono, documenti d'identità e dati di pagamento mai).
2. **quote-from-template: Il preventivo personalizzato.** Dalle note sul
   cliente (date, persone, budget, preferenze) al preventivo nel modello
   dell'agenzia, pronto da incollare in Word. Come chiedere varianti (economica
   / comoda), come far segnalare all'IA cosa manca invece di inventarlo.
   Prezzi: l'IA non li conosce, vengono dall'agente.
3. **checked-itinerary: L'itinerario controllato.** Costruire l'itinerario e
   farlo controllare: festività nazionali e locali, chiusure settimanali di
   musei, coincidenze, tempi di trasferimento, fusi orari, stagionalità.
   Sezione esplicita "cosa Claude non sa o sbaglia" (scioperi, orari
   aggiornati, festività locali minori, chiusure straordinarie) con dove
   verificarlo. Se lo strumento ha la ricerca web, come usarla e come
   controllare le fonti che cita.
4. **payment-tracker: Il registro pagamenti in Excel.** Claude progetta il
   foglio (pratica, cliente, totale, acconto, saldo, scadenze, stato) con
   formule e formattazione condizionale per i ritardi, spiegate passo passo.
   Poi: come chiedere aiuto quando una formula non va, come preparare il
   riepilogo del mese. L'IA non "ricorda" i pagamenti: il registro vive in
   Excel. Dati: non incollare l'intero registro con nomi se non serve.

### Dipendente pubblico (strumento: Copilot)

Persona di riferimento: impiegato di un ufficio comunale o di un ente,
spesso vincolato a Copilot (o a un'altra IA scelta dall'ente).

1. **start-here: Cosa puoi fare con Copilot, e cosa no.** Come capire quale
   Copilot hai (versione inclusa in Microsoft 365 dell'ente, Copilot Chat,
   altro), cosa cambia; regole dell'ente e protezione dei dati: niente dati
   personali dei cittadini nei prompt se l'ente non lo consente; istruzioni
   ricorrenti con gli strumenti che Copilot offre (da verificare); cosa fare
   quando lo strumento è limitato (prompt più espliciti, testi spezzati).
2. **citizen-replies: Rispondere ai cittadini.** Dalla richiesta del cittadino
   a una risposta chiara, cortese, corretta: linguaggio semplice invece del
   burocratese, struttura (cosa chiedi, cosa facciamo, cosa devi fare tu,
   entro quando), anonimizzare prima di incollare (link a `<Anonymizer>`).
3. **minutes-and-circulars: Verbali e circolari.** Dagli appunti (o dalla
   trascrizione di Teams, se disponibile) al verbale nel formato dell'ufficio;
   circolare interna da una decisione. Controllare che il verbale non
   aggiunga cose mai dette.
4. **fix-a-letter-check-facts: Sistemare una lettera e verificare i fatti.**
   Revisione di una lettera esistente (chiarezza, tono, errori). Verifica dei
   fatti, soprattutto norme: l'IA inventa articoli e numeri di legge; ogni
   riferimento va controllato su fonti ufficiali (Normattiva, Gazzetta
   Ufficiale, sito dell'ente). SpotTheError su una lettera con un riferimento
   normativo inventato.

## Componenti ed esercizi

- Ogni lezione: `<LessonSummary>`, almeno un esempio completo, al massimo due
  widget interattivi fra quelli esistenti (`SelfCheck`, `SpotTheError`,
  `PromptCompare`, `PredictThenReveal`, `Collapsible`, `ChatDemo`,
  `Anonymizer`), un `<LlmExercise>` practice e uno review a fine lezione.
- Passi sugli strumenti come liste numerate brevi con i nomi esatti delle voci
  di menu in grassetto, e una riga "verificato a novembre 2026; se l'interfaccia
  è cambiata, cerca la voce X".
- File `.txt` in `public/skills/it/` e `public/skills/en/`, testo semplice,
  lettere accentate reali.
- Modelli di esempio (preventivo, istruzioni del Progetto, struttura del
  registro) come blocchi di testo copiabili dentro la lezione, non come file
  .docx/.xlsx scaricabili. *(Scelta mia: coerente con il resto del sito, niente
  file binari da mantenere; il lettore chiede all'IA di produrre il file.)*
- Nessun componente nuovo previsto.

## Vincoli

- Voice guide `.claude/skills/voice-guide/SKILL.md` per intero (zero em dash,
  niente gergo IA, niente aziendalese). Il pubblico è non tecnico: livello
  `principiante` per tutte le lezioni salvo diversa necessità.
- 400-1200 parole di prosa visibile per lezione, massimo ~1600.
- IT e EN speculari. Le note giuridiche (GDPR, regole PA) restano generali e
  nella versione EN segnalano che il contesto è italiano.
- Aggiornare nello stesso commit: `CONTENT.md` (nuovo modulo), sidebar in
  `astro.config.mjs`, `src/i18n/modules.mjs` (etichette modulo per progress e
  llms.txt), `PATHS` in `StudyPlanPrompt.astro` (nuovo percorso "Per mestiere"),
  le pagine indice/home se elencano i moduli.
- Build: `npx astro build` per le verifiche intermedie, una sola `npm run
  build` completa alla fine; `npm run check` ≤ 9 errori.

## Ricerca prima di scrivere

I fatti sugli strumenti cambiano spesso e vanno verificati (web, novembre
2026) prima di scrivere, con le fonti annotate:

- Claude: come si crea un Progetto, istruzioni del progetto, caricamento file,
  limiti sul piano gratuito; lettura e creazione di file Excel/Word.
- ChatGPT: Progetti, istruzioni, file, disponibilità per piano.
- Copilot: differenza fra Microsoft 365 Copilot e Copilot Chat; cosa offre per
  istruzioni ricorrenti (agenti, Notebook o simili); Copilot in Word, Outlook,
  Excel, Teams (trascrizione e riepilogo riunioni).
- PA: linee guida pubbliche italiane sull'uso dell'IA nella pubblica
  amministrazione, citate solo se verificate.

Dove un fatto non si verifica, la lezione lo scrive in modo che regga
("controlla nelle impostazioni del tuo piano").

## Decisioni dopo la revisione *(scelte mie, da controllare)*

- **Pubblicazione.** Il modulo entra completo su `main` (niente segnaposto
  "Presto"): sidebar, `CONTENT.md`, `modules.mjs` e `PATHS` nello stesso
  commit delle lezioni. Va su `production` solo dopo revisione e build.
- **Sidebar.** Un gruppo "Per mestiere" con dentro la pagina di ingresso, la
  lezione comune e un sottogruppo comprimibile per ogni mestiere.
- **Tipo di pagine.** `by-profession/index.mdx` è una pagina meta (senza
  `livello`: niente tempo di lettura, condivisione, progressi). Le due
  `start-here.mdx` di mestiere sono lezioni a tutti gli effetti.
- **Percorsi a due livelli.** Il costruttore verifica che `modules.mjs`,
  `lesson-data.ts`, Recap, Resume e `llms.txt` gestiscano
  `by-profession/<mestiere>/<slug>`; se no, la piccola modifica al codice
  rientra nel lavoro (con aggiornamento di CLAUDE.md se tocca il catalogo).
- **Esercizi.** Ogni lezione ha un practice e un review; la pagina di
  ingresso nessuno. Nomi con il mestiere per evitare collisioni:
  `review-travel-agency-start-here.txt`, `practice-public-sector-citizen-replies.txt`.
- **Ricerca.** Prima della scrittura, un passaggio di ricerca web separato
  produce un file di fonti datato (Claude, ChatGPT, Copilot, linee guida PA);
  i costruttori scrivono i passi sugli strumenti solo da lì. Quello che non
  si verifica va scritto in forma generica.
- **Copilot senza istruzioni persistenti.** Se il Copilot tipico dell'ente
  non ha un equivalente dei Progetti, la lezione insegna a tenere le
  istruzioni in un documento Word dell'ufficio e a incollarle all'inizio di
  ogni chat (o allegarlo, se possibile).
- **EN per le lezioni PA.** Traduzione fedele (Normattiva, Gazzetta Ufficiale
  restano), con una nota in apertura che il contesto è quello italiano.

## Lasciato al costruttore

- Titoli esatti delle lezioni e ordine interno delle sezioni.
- Scelta degli esempi fittizi (destinazioni, clienti, uffici).
- Quali widget usare in ogni lezione, nel limite di due.
- Testi delle pagine di ingresso.
