/**
 * UI strings for components, keyed by locale.
 *
 * Components import `t(Astro.currentLocale)` to get a strongly-typed
 * dictionary of strings for the active locale. For client-side scripts,
 * pass localized strings to the DOM via `data-*` attributes (resolved
 * server-side here), then read them in the browser.
 *
 * Adding a new locale: add an entry to `STRINGS` and update `Locale`.
 * All keys must be present in every locale (TypeScript enforces it).
 */

export type Locale = 'it' | 'en';

export const DEFAULT_LOCALE: Locale = 'en';

export interface UIStrings {
  // Resume
  resumeMeta: string;
  resumeFallbackTitle: string;
  resumePrivacy: string;
  resumeContinue: string;
  resumeReset: string;
  resumeConfirmTitle: string;
  resumeConfirmBody: string;
  resumeCancel: string;
  resumeYes: string;
  resumeConfirmFallback: string;

  // RecapWithAi
  recapBadge: string;
  recapTitle: string;
  recapDesc: string;
  recapEmpty: string;
  recapCountOne: string; // "1 lezione completata finora."
  recapCountMany: (n: number) => string; // "3 lezioni completate finora."
  recapGenerate: string;
  recapDialogTitle: string;
  recapDialogHint: string;
  recapCopy: string;
  recapClose: string;
  recapCopied: string;
  recapCopyError: string;
  recapPromptIntro: string; // first line of the assembled prompt
  recapPromptInstructions: string;
  recapUnmappedConcepts: string;

  // GlossaryTerm
  glossaryButton: string;
  glossaryCopied: string;
  glossaryError: string;
  glossaryPrompt: (term: string) => string;

  // LlmExercise
  practiceBadge: string;
  reviewBadge: string;
  practiceDuration: string; // e.g., "di esercizio" / "of practice"
  reviewDuration: string;
  llmExerciseHowTo: string; // can include <strong> markup
  llmExerciseCopy: string;
  llmExerciseDownload: string;
  llmExerciseOpen: string;
  llmExerciseCopied: string;
  llmExerciseError: string;

  // LocalAI (in-browser assistant)
  localAiLauncherLabel: string;
  localAiLauncherAria: string;
  localAiPanelTitle: string;
  localAiClose: string;
  localAiConsentHeading: string;
  localAiConsentBody: string;       // explains local + one-time CDN download
  localAiConsentPrivacy: string;    // short privacy line
  localAiConsentPrivacyLink: string;
  localAiModelBestWarn: string;     // GPU warning shown under "Best"
  localAiConsentConfirm: string;    // "Download & enable"
  localAiDownloading: string;       // status while weights download
  localAiInputPlaceholder: string;
  localAiSend: string;
  localAiThinking: string;          // status while generating
  localAiStartExercise: string;
  localAiNoWebgpuTitle: string;
  localAiNoWebgpuBody: string;      // points to the buttons below
  localAiErrorTitle: string;
  localAiErrorBody: string;
  localAiRetryLight: string;
  localAiDisclaimer: string;        // "answers are local, can be wrong"
  localAiRecommended: string;       // "Recommended" chip on Light model card
  localAiModelsTitle: string;       // title of models view ("Models")
  localAiNewChatAria: string;       // aria-label for new-chat icon button
  localAiModelsAria: string;        // aria-label for models gear icon button
  localAiBackAria: string;          // aria-label for back button in models view
  localAiOneTime: string;           // reassurance in download view: one-time + local
  localAiUse: string;               // models view: switch to a cached model
  localAiDownloadModel: string;     // models view: download + activate an idle model
  localAiDeleteModel: string;       // models view: delete a cached non-active model
  localAiStatusActive: string;      // models view pill: active model
  localAiStatusCached: string;      // models view pill: downloaded/cached
  localAiStatusIdle: string;        // models view pill: not downloaded
  localAiTierLight: string;
  localAiTierBetter: string;
  localAiTierBest: string;
  localAiDescLight: string;
  localAiDescBetter: string;
  localAiDescBest: string;
  localAiConfirmDelete: string;

  // ChatDemo
  chatUserLabel: string;
  chatAiLabel: string;
  chatReplay: string;
  chatReplayAria: string;
  chatSkip: string;
  chatSkipAria: string;
  chatExampleAria: (preview: string) => string;

  // ReadingTime
  readingTimeSuffix: string;
  readingTimeAria: string;

  // ReadingToggle (assisted reading / bionic reading)
  readingToggleAria: string;
  readingToggleTitle: string;
  readingToggleStateOn: string;
  readingToggleStateOff: string;

  // HeaderPreferences popover
  prefsButtonAria: string;
  prefsPanelHeading: string;
  prefsSectionReading: string;
  prefsSectionTheme: string;
  prefsSectionLanguage: string;

  // InstallApp (PWA install + bulk download progress)
  prefsSectionApp: string;
  installButtonLabel: string;
  installInProgress: string;
  installAlreadyInstalled: string;
  installAlreadyInstalledReady: string;
  installBulkProgress: string; // "Scarico per offline · {done}/{total}"
  installIosTitle: string;
  installIosStep1: string;
  installIosStep2: string;
  installIosStep3: string;
  installIosClose: string;

  // ShareLesson
  shareHeading: string;
  shareXAria: string;
  shareLinkedInAria: string;
  shareWhatsAppAria: string;
  shareEmailAria: string;
  shareEmailSubject: (title: string) => string;
  shareCopyLabel: string;
  shareCopyAria: string;
  shareCopied: string;
  shareCopyError: string;

  // HomeCards
  comingSoonLabel: string;

  // LessonSummary
  lessonSummaryLabel: string;

  // PromptBuilder
  builderBadge: string;
  builderTitle: string;
  builderHint: string;
  builderTaskLabel: string;
  builderTaskExample: string;
  builderContextLabel: string;
  builderContextExample: string;
  builderAudienceLabel: string;
  builderAudienceExample: string;
  builderFormatLabel: string;
  builderFormatExample: string;
  builderPreviewLabel: string;
  builderPlaceholder: string;
  builderCopy: string;
  builderReset: string;
  builderCopied: string;
  builderError: string;
  builderPromptTask: string;
  builderPromptContext: string;
  builderPromptAudience: string;
  builderPromptFormat: string;

  // MailtoComposer
  composerBadge: string;
  composerTitle: string;
  composerHint: string;
  composerPlaceholder: string;
  composerSubject: string;
  composerButton: string;
  composerEmpty: string;
  composerOpenError: string;

  // Search modal (custom Pagefind UI)
  searchHint: string;
  searchTooShort: string;
  searchLoading: string;
  searchNoResults: string; // "Nessun risultato per «{query}»"
  searchCountOne: string; // "1 risultato"
  searchCountMany: string; // "{n} risultati"
  searchError: string;
  searchResultsAria: string;
  searchClearAria: string;

  // Footer
  footerAbout: string;
  footerPrivacy: string;
  footerLinkedinAria: string;
  footerEmailAria: string;
  footerSiteAria: string;
  footerKofiAria: string;
  footerGithubAria: string;
  footerTagline: string;
  footerCopyright: (year: number) => string;
  footerLocation: string;
  footerVatLabel: string;

  // --- F1: progress & review ---
  recapLevelBeginner: string;
  recapLevelIntermediate: string;
  recapLevelAdvanced: string;
  recapJournalNote: string;
  moduleProgressAria: string; // "{done}" and "{total}" placeholders
  reviewTodayBadge: string;
  reviewTitle: string;
  reviewDueOne: string;
  reviewDueMany: (n: number) => string;
  reviewDesc: string;
  reviewListAria: string;
  reviewGenerate: string;
  reviewDialogTitle: string;
  reviewDialogHint: string;
  progressIntro: string;
  progressReadOf: string; // "{read}" and "{total}" placeholders
  progressReadMark: string;
  progressNotReadMark: string;
  progressNoSummary: string;
  progressPrint: string;
  progressNeedsJs: string;
  // --- end F1 ---
  // --- F2: lesson widgets ---
  selfCheckBadge: string;
  selfCheckGroupAria: string;
  selfCheckCorrect: string;
  selfCheckIncorrect: string;
  selfCheckRetry: string;
  selfCheckShowAnswer: string;
  selfCheckRightAnswerLabel: string;
  selfCheckPrevCorrect: (date: string) => string;
  selfCheckPrevWrong: (date: string) => string;
  selfCheckNoJsSummary: string;
  selfCheckNoJsCorrectMark: string;
  selfCheckNoJsWrongMark: string;
  spotBadge: string;
  spotDefaultTitle: string;
  spotHint: string;
  spotPromptLabel: string;
  spotAnswerLabel: string;
  spotCheck: string;
  spotReset: string;
  spotFound: string;
  spotMissed: string;
  spotFalseAlarm: string;
  /** Templates with {found}, {total}, {fa}. */
  spotSummary: string;
  spotSummaryNone: string;
  spotNoJsTitle: string;
  spotNoJsNone: string;
  predictBadge: string;
  predictQuestionLabel: string;
  predictLabel: string;
  predictPlaceholder: string;
  predictReveal: string;
  predictCompare: string;
  compareWeakLabel: string;
  compareStrongLabel: string;
  compareCopy: string;
  compareCopied: string;
  compareCopyError: string;
  compareCopyAria: (label: string) => string;
  compareNoteLabel: string;
  anonBadge: string;
  anonTitle: string;
  anonIntro: string;
  anonInputLabel: string;
  anonInputPlaceholder: string;
  anonTermsLabel: string;
  anonTermsHint: string;
  anonTermsPlaceholder: string;
  anonAllNumbers: string;
  anonOutputLabel: string;
  anonCopy: string;
  anonCopied: string;
  anonCopyError: string;
  anonCountsTitle: string;
  anonCountsNone: string;
  anonKindEmail: string;
  anonKindPhone: string;
  anonKindIban: string;
  anonKindCf: string;
  anonKindCard: string;
  anonKindNumber: string;
  anonKindName: string;
  anonPhEmail: string;
  anonPhPhone: string;
  anonPhIban: string;
  anonPhCf: string;
  anonPhCard: string;
  anonPhNumber: string;
  anonPhName: string;
  anonNoteTitle: string;
  anonNoteIntro: string;
  anonNoteItems: string[];
  anonNoteLocal: string;
  anonNoJs: string;
  // --- end F2 ---
  // --- F3: journal, plan prompt, Def ---
  journalSummary: string;
  journalPlaceholder: string;
  journalPrivacy: string;
  planBadge: string;
  planTitle: string;
  planHint: string;
  planPathLabel: string;
  planPaceLabel: string;
  planMinutesLabel: string;
  planMinutesPlaceholder: string;
  planPreviewLabel: string;
  planCopy: string;
  planCopied: string;
  planError: string;
  planPaths: Record<'fundamentals' | 'everyday-use' | 'at-work' | 'by-profession' | 'for-students' | 'for-teachers' | 'going-deeper', string>;
  planPaces: Record<'daily' | 'weekly' | 'weekend', string>;
  planPromptIntro: (path: string) => string;
  planPromptLessons: string;
  planPromptPace: Record<'daily' | 'weekly' | 'weekend', string>;
  planPromptMinutes: string; // contains {n}
  planPromptClosing: string;
  // --- end F3 ---
}

const it: UIStrings = {
  resumeMeta: 'Riprendi da dove hai lasciato',
  resumeFallbackTitle: 'la lezione precedente',
  resumePrivacy:
    'I tuoi progressi sono salvati solo sul tuo browser, mai inviati altrove.',
  resumeContinue: 'Continua',
  resumeReset: 'Cancella progressi',
  resumeConfirmTitle: 'Cancellare i progressi?',
  resumeConfirmBody:
    "Tutti i progressi salvati su questo browser verranno rimossi. L'azione non si può annullare.",
  resumeCancel: 'Annulla',
  resumeYes: 'Sì, cancella',
  resumeConfirmFallback: 'Cancellare i progressi salvati su questo browser?',

  recapBadge: 'Ripasso con la tua IA',
  recapTitle: 'Trasforma la tua IA in un tutor',
  recapDesc:
    'Genera un prompt che trasforma la tua IA in un tutor sulle lezioni che hai completato. Ti fa una domanda alla volta per aiutarti a ricordare quello che hai imparato.',
  recapEmpty: 'Completa almeno una lezione per attivare il ripasso.',
  recapCountOne: '1 lezione completata finora.',
  recapCountMany: (n) => `${n} lezioni completate finora.`,
  recapGenerate: 'Genera prompt di ripasso',
  recapDialogTitle: 'Ecco il tuo prompt di ripasso',
  recapDialogHint:
    'Copialo e incollalo nella tua IA. Parlerà solo delle lezioni che hai completato.',
  recapCopy: 'Copia il prompt',
  recapClose: 'Chiudi',
  recapCopied: 'Copiato!',
  recapCopyError: 'Errore, riprova',
  recapPromptIntro:
    'Sei un tutor paziente. Sto studiando il manuale AI-Guide e ho completato queste lezioni. Per ognuna ti elenco i concetti chiave:',
  recapPromptInstructions: `Fammi ripassare con il metodo socratico. Fammi una domanda alla volta e aspetta la mia risposta prima di andare avanti. Non anticipare mai la risposta.

Se sbaglio o non so rispondere, dammi prima un indizio e lasciami riprovare. Solo dopo un secondo tentativo spiegami la risposta giusta.

Dopo ogni mia risposta dimmi cosa ho centrato e cosa posso precisare, in due frasi al massimo, poi passa alla domanda successiva. Parti dalle domande più facili e falle crescere di difficoltà. Mescola le lezioni, senza seguire l'ordine. Verso metà ripasso inserisci una domanda di applicazione: un caso realistico in cui devo decidere cosa fare con l'IA. In tutto, al massimo otto domande.

Alla fine fai un bilancio in tre punti: cosa ricordo bene, cosa conviene ripassare e una piccola prova pratica per la mia prossima conversazione con un'IA.

Tono incoraggiante, senza voti. Se non sei sicuro di un'informazione sulle lezioni, dillo invece di inventare.

Comincia ora con la prima domanda.`,
  recapUnmappedConcepts: '(riassunto non disponibile: parti dal titolo e chiedimi cosa ricordo)',

  glossaryButton: 'Approfondisci con la tua IA',
  glossaryCopied: 'Prompt copiato! Incollalo nella tua IA',
  glossaryError: 'Errore, riprova',
  glossaryPrompt: (term) =>
    `Sei un tutor paziente di un manuale di IA per principianti. Spiegami con parole semplici cosa significa "${term}" parlando di IA conversazionali (ChatGPT, Claude, Gemini). Usa un esempio concreto della vita di tutti i giorni, in al massimo 150 parole. Niente gergo: se usi un termine tecnico, spiegalo subito.

Poi fammi una sola domanda per controllare se ho capito e aspetta la mia risposta. Se sbaglio, dammi un indizio prima di dirmi la soluzione. Se ho capito, chiedimi se voglio un esempio più difficile.`,

  practiceBadge: 'Esercizio con la tua IA',
  reviewBadge: 'Verifica con la tua IA',
  practiceDuration: 'di esercizio',
  reviewDuration: 'di verifica',
  llmExerciseHowTo:
    "Premi «Copia il testo» e incollalo nella tua IA preferita (<strong>Claude</strong>, <strong>ChatGPT</strong>, <strong>Gemini</strong> o un'altra). In alternativa scarica il file e daglielo come allegato.",
  llmExerciseCopy: 'Copia il testo',
  llmExerciseDownload: 'Scarica',
  llmExerciseOpen: 'Apri',
  llmExerciseCopied: 'Copiato!',
  llmExerciseError: 'Errore, riprova',

  localAiLauncherLabel: "Chiedi all'IA locale",
  localAiLauncherAria: "Apri l'assistente IA locale",
  localAiPanelTitle: 'Assistente IA locale',
  localAiClose: 'Chiudi',
  localAiConsentHeading: 'Fai girare una piccola IA qui, sul tuo dispositivo',
  localAiConsentBody:
    "Questo assistente gira nel tuo browser. La prima volta scarica i suoi file di modello una volta sola da un fornitore esterno (Hugging Face): il modello di chat e un piccolo modello di ricerca. Dopo funziona offline e niente di quello che scrivi esce dal tuo dispositivo.",
  localAiConsentPrivacy: 'I tuoi messaggi restano in questo browser. Non vengono mai inviati a me né a un server.',
  localAiConsentPrivacyLink: 'Leggi la pagina sulla privacy',
  localAiModelBestWarn: 'Richiede una scheda grafica potente. Sulla maggior parte dei telefoni non si carica.',
  localAiConsentConfirm: 'Scarica e attiva',
  localAiDownloading: 'Sto scaricando il modello, solo questa volta',
  localAiInputPlaceholder: 'Chiedi qualcosa su questa lezione',
  localAiSend: 'Invia',
  localAiThinking: 'Sto pensando',
  localAiStartExercise: "Inizia l'esercizio",
  localAiNoWebgpuTitle: "L'IA locale non è disponibile in questo browser",
  localAiNoWebgpuBody:
    "Il tuo browser non può far girare l'IA sul dispositivo. Usa i pulsanti nella lezione per aprire l'esercizio in Claude, ChatGPT o Gemini.",
  localAiErrorTitle: 'Il modello non è partito',
  localAiErrorBody:
    "Il tuo dispositivo potrebbe non avere memoria a sufficienza per questo modello. Prova il più leggero, oppure usa i pulsanti nella lezione per aprire un'IA esterna.",
  localAiRetryLight: 'Prova il modello leggero',
  localAiDisclaimer: "Le risposte sono generate qui sul tuo dispositivo e possono contenere errori.",
  localAiRecommended: 'Consigliato',
  localAiModelsTitle: 'Modelli',
  localAiNewChatAria: 'Nuova chat',
  localAiModelsAria: 'Gestisci modelli',
  localAiBackAria: 'Torna alla chat',
  localAiOneTime: 'Scaricato una volta sola. I tuoi dati non lasciano mai il dispositivo.',
  localAiUse: 'Usa',
  localAiDownloadModel: 'Scarica',
  localAiDeleteModel: 'Elimina',
  localAiStatusActive: 'Attivo',
  localAiStatusCached: 'Scaricato',
  localAiStatusIdle: 'Non scaricato',
  localAiTierLight: 'Leggero',
  localAiTierBetter: 'Migliore',
  localAiTierBest: 'Massimo',
  localAiDescLight: 'Risposte molto semplici e limitate',
  localAiDescBetter: 'Risposte più solide e più dettagliate',
  localAiDescBest: 'Le risposte migliori',
  localAiConfirmDelete: 'Conferma eliminazione',

  chatUserLabel: 'Tu',
  chatAiLabel: 'IA',
  chatReplay: 'Riavvia',
  chatReplayAria: "Riavvia l'animazione della conversazione",
  chatSkip: 'Salta',
  chatSkipAria: "Salta l'animazione e mostra subito il risultato",
  chatExampleAria: (preview) => `Esempio di conversazione: "${preview}"`,

  readingTimeSuffix: 'min di lettura',
  readingTimeAria: 'Tempo di lettura stimato',

  readingToggleAria: 'Lettura assistita',
  readingToggleTitle:
    "Mette in grassetto l'inizio di ogni parola, per scorrere il testo più in fretta.",
  readingToggleStateOn: 'attiva',
  readingToggleStateOff: 'disattivata',

  prefsButtonAria: 'Preferenze',
  prefsPanelHeading: 'Preferenze',
  prefsSectionReading: 'Lettura assistita',
  prefsSectionTheme: 'Tema',
  prefsSectionLanguage: 'Lingua',

  prefsSectionApp: 'App',
  installButtonLabel: "Installa l'app",
  installInProgress: 'Installazione…',
  installAlreadyInstalled: 'App installata',
  installAlreadyInstalledReady: 'App installata · pronta offline',
  installBulkProgress: 'Scarico per offline · {done}/{total}',
  installIosTitle: 'Installa AI-Guide su iPhone/iPad',
  installIosStep1: 'Tocca il pulsante Condividi qui sotto.',
  installIosStep2: "Scorri e scegli «Aggiungi alla schermata Home».",
  installIosStep3: 'Conferma con «Aggiungi» in alto a destra.',
  installIosClose: 'Chiudi',

  shareHeading: 'Condividi questa lezione',
  shareXAria: 'Condividi su X',
  shareLinkedInAria: 'Condividi su LinkedIn',
  shareWhatsAppAria: 'Condividi su WhatsApp',
  shareEmailAria: 'Condividi via email',
  shareEmailSubject: (title) => `AI-Guide: ${title}`,
  shareCopyLabel: 'Copia link',
  shareCopyAria: 'Copia il link della lezione',
  shareCopied: 'Link copiato!',
  shareCopyError: 'Errore, riprova',

  comingSoonLabel: 'Presto',

  lessonSummaryLabel: 'Riepilogo in 30 secondi',

  builderBadge: 'Costruisci il tuo prompt',
  builderTitle: 'Mettiti alla prova: scrivi un prompt che funziona',
  builderHint:
    "Compila i quattro campi pensando a una richiesta vera che vuoi fare a un'IA. Mentre scrivi, il prompt prende forma nell'anteprima. Quando è pronto, copialo e incollalo nella tua IA preferita.",
  builderTaskLabel: "1. Cosa vuoi che l'IA faccia?",
  builderTaskExample:
    'es. "scrivimi una mail al mio capo per chiedere tre giorni di ferie"',
  builderContextLabel: '2. Contesto: chi sei, cosa stai facendo',
  builderContextExample:
    'es. "lavoro come grafica freelance, non ho ferie da 4 mesi"',
  builderAudienceLabel: '3. Per chi è la risposta?',
  builderAudienceExample: 'es. "il mio capo, rigido ma ragionevole"',
  builderFormatLabel: '4. Come la vuoi (formato, lunghezza, tono)',
  builderFormatExample:
    'es. "una mail breve, tono professionale ma cordiale, max 100 parole"',
  builderPreviewLabel: 'Prompt generato',
  builderPlaceholder: 'Compila i campi e il prompt apparirà qui.',
  builderCopy: 'Copia il prompt',
  builderReset: 'Ripulisci tutto',
  builderCopied: 'Copiato!',
  builderError: 'Errore, riprova',
  builderPromptTask: 'Cosa mi serve',
  builderPromptContext: 'Contesto',
  builderPromptAudience: 'Per chi è la risposta',
  builderPromptFormat: 'Formato',

  composerBadge: 'Scrivimi',
  composerTitle: "Hai un'idea o una correzione?",
  composerHint:
    'Scrivi qui sotto e si aprirà il tuo client di posta con il messaggio già pronto. Niente form, niente backend: il messaggio parte dalla tua email.',
  composerPlaceholder:
    "Es. Mi piacerebbe una lezione sull'IA per la scuola, oppure: nella lezione X manca un esempio di…",
  composerSubject: 'AI-Guide: idea o correzione',
  composerButton: 'Apri email',
  composerEmpty: 'Scrivi qualcosa prima di aprire la mail.',
  composerOpenError:
    "Non sono riuscito ad aprire il client di posta. Prova con l'email in fondo alla pagina.",

  searchHint: 'Scrivi qualcosa per cercare nel manuale',
  searchTooShort: 'Scrivi almeno due caratteri',
  searchLoading: 'Cerco…',
  searchNoResults: 'Nessun risultato per «{query}»',
  searchCountOne: '1 risultato',
  searchCountMany: '{n} risultati',
  searchError: 'Errore di ricerca, riprova',
  searchResultsAria: 'Risultati di ricerca',
  searchClearAria: 'Cancella la ricerca',

  footerAbout: 'Chi sono',
  footerPrivacy: 'Privacy',
  footerLinkedinAria: 'Profilo LinkedIn di Fabrizio La Rosa',
  footerEmailAria: 'Scrivi una mail ad AI-Guide',
  footerSiteAria: 'Sito personale di Fabrizio La Rosa',
  footerKofiAria: 'Offrimi un caffè su Ko-fi',
  footerGithubAria: 'Codice sorgente su GitHub',
  footerTagline: "Manuale aperto, scritto da una persona vera, in collaborazione con l'IA.",
  footerCopyright: (year) => `© ${year} Fabrizio La Rosa`,
  footerLocation: 'Gent, Belgio',
  footerVatLabel: 'P.IVA',

  // --- F1: progress & review ---
  recapLevelBeginner:
    'Livello: principiante. Usa esempi di vita quotidiana e niente gergo tecnico.',
  recapLevelIntermediate:
    'Livello: intermedio. Puoi usare i termini delle lezioni, spiegandoli in una frase la prima volta.',
  recapLevelAdvanced:
    'Livello: avanzato. Puoi andare in profondità tecnica e usare il lessico del settore.',
  recapJournalNote: 'Quello che ho annotato mentre facevo pratica:',
  moduleProgressAria: '{done} lezioni su {total} completate',
  reviewTodayBadge: 'Ripasso di oggi',
  reviewTitle: 'Rinfresca quello che hai letto',
  reviewDueOne: 'Oggi, ripassa 1 lezione',
  reviewDueMany: (n) => `Oggi, ripassa ${n} lezioni`,
  reviewDesc:
    'Ripassare a distanza di qualche giorno fissa meglio le idee. Queste lezioni sono pronte per un giro di domande con la tua IA.',
  reviewListAria: 'Lezioni da ripassare oggi',
  reviewGenerate: 'Genera il ripasso di oggi',
  reviewDialogTitle: 'Ecco il ripasso di oggi',
  reviewDialogHint:
    'Copialo e incollalo nella tua IA. Parlerà solo delle lezioni da ripassare oggi. Quando lo copi, le segniamo come ripassate.',
  progressIntro:
    'Il tuo percorso, modulo per modulo, con i punti chiave di ogni lezione. I segni di lettura restano nel tuo browser.',
  progressReadOf: '{read} di {total} lezioni lette',
  progressReadMark: 'Letta',
  progressNotReadMark: 'Da leggere',
  progressNoSummary: 'Nessun riassunto per questa lezione.',
  progressPrint: 'Stampa o salva come PDF',
  progressNeedsJs:
    "Senza JavaScript non vedi quali lezioni hai letto, ma l'elenco dei moduli resta consultabile.",
  // --- end F1 ---
  // --- F2: lesson widgets ---
  selfCheckBadge: 'Mettiti alla prova',
  selfCheckGroupAria: 'Opzioni di risposta',
  selfCheckCorrect: 'Giusto.',
  selfCheckIncorrect: 'Non proprio.',
  selfCheckRetry: 'Riprova',
  selfCheckShowAnswer: 'Mostra la risposta giusta',
  selfCheckRightAnswerLabel: 'La risposta giusta',
  selfCheckPrevCorrect: (date) => `Hai già risposto il ${date}: giusto.`,
  selfCheckPrevWrong: (date) => `Hai già risposto il ${date}: sbagliato.`,
  selfCheckNoJsSummary: 'Vedi le risposte',
  selfCheckNoJsCorrectMark: 'giusta',
  selfCheckNoJsWrongMark: 'sbagliata',
  spotBadge: "Trova l'errore",
  spotDefaultTitle: 'Dove ha sbagliato questa IA?',
  spotHint: 'Tocca le frasi che ti sembrano sbagliate, poi premi Controlla.',
  spotPromptLabel: 'La domanda',
  spotAnswerLabel: "La risposta dell'IA",
  spotCheck: 'Controlla',
  spotReset: 'Ricomincia',
  spotFound: 'Errore trovato',
  spotMissed: 'Errore che ti è sfuggito',
  spotFalseAlarm: 'Falso allarme: questa frase era corretta',
  spotSummary: 'Errori trovati: {found} su {total}. Falsi allarmi: {fa}.',
  spotSummaryNone:
    "In questa risposta non c'era nessun errore. Falsi allarmi: {fa}.",
  spotNoJsTitle: 'Dove stavano gli errori',
  spotNoJsNone: "In questa risposta non c'era nessun errore.",
  predictBadge: 'Prima prevedi',
  predictQuestionLabel: "Il messaggio che mandi all'IA",
  predictLabel: "Cosa ti aspetti che risponda l'IA?",
  predictPlaceholder:
    'Scrivi la tua previsione. Resta sul tuo schermo, non viene salvata.',
  predictReveal: 'Mostra la risposta',
  predictCompare: 'Confronta: cosa avevi indovinato? Cosa ti ha sorpreso?',
  compareWeakLabel: 'Prompt debole',
  compareStrongLabel: 'Prompt ricostruito',
  compareCopy: 'Copia',
  compareCopied: 'Copiato',
  compareCopyError: 'Copia non riuscita, seleziona il testo a mano.',
  compareCopyAria: (label) => `Copia: ${label}`,
  compareNoteLabel: 'Cosa cambia',
  anonBadge: 'Anonimizza prima di incollare',
  anonTitle: 'Togli i dati personali dal testo',
  anonIntro:
    'Incolla il testo, controlla il risultato e copia la versione ripulita da dare alla tua IA. Tutto avviene nel tuo browser: il testo non viene inviato né salvato da nessuna parte.',
  anonInputLabel: 'Testo originale',
  anonInputPlaceholder: 'Incolla qui il testo da ripulire',
  anonTermsLabel: 'Parole da sostituire',
  anonTermsHint:
    'Nomi di persone, aziende e luoghi, separati da virgola. Diventano [NOME 1], [NOME 2] e così via, sempre uguali per la stessa parola.',
  anonTermsPlaceholder: 'Mario Rossi, Acme Srl, Milano',
  anonAllNumbers:
    'Sostituisci anche tutti gli altri numeri (date, importi, quantità)',
  anonOutputLabel: 'Testo ripulito',
  anonCopy: 'Copia il testo ripulito',
  anonCopied: 'Copiato',
  anonCopyError: 'Copia non riuscita, seleziona il testo a mano.',
  anonCountsTitle: 'Sostituzioni fatte',
  anonCountsNone: 'Nessuna sostituzione, per ora.',
  anonKindEmail: 'email',
  anonKindPhone: 'numeri di telefono',
  anonKindIban: 'IBAN',
  anonKindCf: 'codici fiscali',
  anonKindCard: 'numeri di carta',
  anonKindNumber: 'altri numeri',
  anonKindName: 'parole indicate da te',
  anonPhEmail: '[EMAIL]',
  anonPhPhone: '[TELEFONO]',
  anonPhIban: '[IBAN]',
  anonPhCf: '[CODICE FISCALE]',
  anonPhCard: '[CARTA]',
  anonPhNumber: '[NUMERO]',
  anonPhName: '[NOME {n}]',
  anonNoteTitle: 'Cosa NON trova',
  anonNoteIntro:
    'È un aiuto, non una garanzia. Rileggi sempre il testo ripulito prima di incollarlo nella tua IA.',
  anonNoteItems: [
    'I nomi che non hai indicato nel campo "Parole da sostituire".',
    'Indirizzi, vie e numeri civici.',
    'Dettagli indiretti che identificano una persona: un ruolo unico, un episodio riconoscibile, una combinazione di fatti.',
    'Il contenuto di immagini e allegati: lo strumento lavora solo sul testo incollato.',
  ],
  anonNoteLocal:
    'Niente lascia il tuo browser: il testo non viene inviato e non viene salvato.',
  anonNoJs: 'Questo strumento ha bisogno di JavaScript per funzionare.',
  // --- end F2 ---
  // --- F3: journal, plan prompt, Def ---
  journalSummary: 'Una cosa che ho notato',
  journalPlaceholder: "Cosa hai notato facendo l'esercizio?",
  journalPrivacy: 'Resta solo in questo browser',
  planBadge: 'Piano di studio',
  planTitle: 'Chiedi alla tua IA un calendario di studio',
  planHint:
    'Scegli il percorso e il ritmo. Ti prepariamo un testo da incollare nella tua IA: ti costruirà il calendario e ti seguirà lungo la strada.',
  planPathLabel: 'Percorso',
  planPaceLabel: 'Ritmo',
  planMinutesLabel: 'Minuti per sessione (facoltativo)',
  planMinutesPlaceholder: 'es. 20',
  planPreviewLabel: 'Il tuo testo',
  planCopy: 'Copia il testo',
  planCopied: 'Copiato!',
  planError: 'Errore, riprova',
  planPaths: {
    fundamentals: 'Fondamenti',
    'everyday-use': 'Uso quotidiano',
    'at-work': 'Sul lavoro',
    'by-profession': 'Per mestiere',
    'for-students': 'Per studenti',
    'for-teachers': 'Per docenti',
    'going-deeper': 'Per chi vuole di più',
  },
  planPaces: {
    daily: 'Una lezione al giorno',
    weekly: 'Tre lezioni a settimana',
    weekend: 'Solo nel weekend',
  },
  planPromptIntro: (path) =>
    `Fai da tutor di studio. Voglio seguire il percorso "${path}" del manuale AI-Guide (https://ai-guide.larosa.work/it/) e mi serve un calendario di studio.`,
  planPromptLessons: 'Ecco le lezioni del percorso, in ordine:',
  planPromptPace: {
    daily: 'Il mio ritmo: una lezione al giorno.',
    weekly: 'Il mio ritmo: tre lezioni a settimana.',
    weekend: 'Il mio ritmo: solo nel fine settimana (sabato e domenica).',
  },
  planPromptMinutes: 'Ho circa {n} minuti per ogni sessione.',
  planPromptClosing:
    "Chiedimi da quale data voglio partire. Poi costruisci un calendario settimana per settimana: per ogni giorno scrivi il titolo della lezione e il suo link. Usa solo le lezioni dell'elenco, non inventarne altre. Nelle conversazioni successive chiedimi come sta andando: cosa ho letto, cosa non mi è chiaro, se devo spostare qualcosa. Se salto un giorno, aiutami a riprendere senza drammi.",
  // --- end F3 ---
};

const en: UIStrings = {
  resumeMeta: 'Pick up where you left off',
  resumeFallbackTitle: 'the previous lesson',
  resumePrivacy:
    'Your progress is saved only on your browser, never sent anywhere else.',
  resumeContinue: 'Continue',
  resumeReset: 'Clear progress',
  resumeConfirmTitle: 'Clear your progress?',
  resumeConfirmBody:
    "All progress saved on this browser will be removed. This can't be undone.",
  resumeCancel: 'Cancel',
  resumeYes: 'Yes, clear it',
  resumeConfirmFallback: 'Clear the progress saved on this browser?',

  recapBadge: 'Recap with your AI',
  recapTitle: 'Turn your AI into a tutor',
  recapDesc:
    "Generate a prompt that turns your AI into a tutor on the lessons you've completed. It asks you one question at a time to help you recall what you learned.",
  recapEmpty: 'Complete at least one lesson to enable the recap.',
  recapCountOne: '1 lesson completed so far.',
  recapCountMany: (n) => `${n} lessons completed so far.`,
  recapGenerate: 'Generate recap prompt',
  recapDialogTitle: 'Here is your recap prompt',
  recapDialogHint:
    "Copy it and paste it into your AI. It will only talk about the lessons you've completed.",
  recapCopy: 'Copy prompt',
  recapClose: 'Close',
  recapCopied: 'Copied!',
  recapCopyError: 'Error, please retry',
  recapPromptIntro:
    "You are a patient tutor. I'm studying the AI-Guide manual and I've completed these lessons. For each one, here are the key concepts:",
  recapPromptInstructions: `Help me review using the Socratic method. Ask me one question at a time and wait for my answer before moving on. Never give the answer ahead of time.

If I get it wrong or don't know, give me a hint first and let me try again. Only after a second attempt, explain the right answer.

After each answer, tell me what I got right and what I could sharpen, in two sentences at most, then move to the next question. Start with the easier questions and make them harder as we go. Mix the lessons, don't follow their order. Around the middle, include an application question: a realistic case where I have to decide what to do with an AI. Ask at most eight questions in total.

At the end, give me a three-point wrap-up: what I remember well, what is worth reviewing, and a small practical task for my next conversation with an AI.

Encouraging tone, no grades. If you're unsure about something in the lessons, say so instead of making it up.

Start now with the first question.`,
  recapUnmappedConcepts: '(summary not available: start from the title and ask me what I remember)',

  glossaryButton: 'Go deeper with your AI',
  glossaryCopied: 'Prompt copied! Paste it into your AI',
  glossaryError: 'Error, please retry',
  glossaryPrompt: (term) =>
    `You are a patient tutor for a beginner-level AI manual. Explain in simple words what "${term}" means when talking about conversational AIs (ChatGPT, Claude, Gemini). Use a concrete example from everyday life, in 150 words at most. No jargon: if you use a technical term, explain it right away.

Then ask me one single question to check I understood, and wait for my answer. If I get it wrong, give me a hint before telling me the solution. If I got it, ask whether I want a harder example.`,

  practiceBadge: 'Exercise with your AI',
  reviewBadge: 'Check-in with your AI',
  practiceDuration: 'of practice',
  reviewDuration: 'of check-in',
  llmExerciseHowTo:
    'Press "Copy the text" and paste it into your favourite AI (<strong>Claude</strong>, <strong>ChatGPT</strong>, <strong>Gemini</strong>, or another). Or download the file and give it to your AI as an attachment.',
  llmExerciseCopy: 'Copy the text',
  llmExerciseDownload: 'Download',
  llmExerciseOpen: 'Open',
  llmExerciseCopied: 'Copied!',
  llmExerciseError: 'Error, please retry',

  localAiLauncherLabel: 'Ask the local AI',
  localAiLauncherAria: 'Open the local AI assistant',
  localAiPanelTitle: 'Local AI assistant',
  localAiClose: 'Close',
  localAiConsentHeading: 'Run a small AI here, on your device',
  localAiConsentBody:
    'This assistant runs in your browser. The first time, it downloads its model files once from an external provider (Hugging Face): the chat model and a small search model. After that it works offline and nothing you type leaves your device.',
  localAiConsentPrivacy: 'Your messages stay in this browser. They are never sent to me or to any server.',
  localAiConsentPrivacyLink: 'Read the privacy page',
  localAiModelBestWarn: 'Needs a strong graphics card. It will not load on most phones.',
  localAiConsentConfirm: 'Download and enable',
  localAiDownloading: 'Downloading the model, one time only',
  localAiInputPlaceholder: 'Ask about this lesson',
  localAiSend: 'Send',
  localAiThinking: 'Thinking',
  localAiStartExercise: 'Start the exercise',
  localAiNoWebgpuTitle: 'Local AI is not available in this browser',
  localAiNoWebgpuBody:
    'Your browser cannot run AI on the device. Use the buttons in the lesson to open the exercise in Claude, ChatGPT, or Gemini instead.',
  localAiErrorTitle: 'The model could not start',
  localAiErrorBody:
    'Your device may not have enough memory for this model. Try the lightest one, or use the buttons in the lesson to open an external AI.',
  localAiRetryLight: 'Try the Light model',
  localAiDisclaimer: 'Answers are generated here on your device and can be wrong.',
  localAiRecommended: 'Recommended',
  localAiModelsTitle: 'Models',
  localAiNewChatAria: 'New chat',
  localAiModelsAria: 'Manage models',
  localAiBackAria: 'Back to chat',
  localAiOneTime: 'One-time download. Your data never leaves this device.',
  localAiUse: 'Use',
  localAiDownloadModel: 'Download',
  localAiDeleteModel: 'Delete',
  localAiStatusActive: 'Active',
  localAiStatusCached: 'Cached',
  localAiStatusIdle: 'Not downloaded',
  localAiTierLight: 'Light',
  localAiTierBetter: 'Better',
  localAiTierBest: 'Best',
  localAiDescLight: 'Very simple, limited answers',
  localAiDescBetter: 'Stronger and more detailed answers',
  localAiDescBest: 'The best answers',
  localAiConfirmDelete: 'Confirm delete',

  chatUserLabel: 'You',
  chatAiLabel: 'AI',
  chatReplay: 'Replay',
  chatReplayAria: 'Replay the conversation animation',
  chatSkip: 'Skip',
  chatSkipAria: 'Skip the animation and show the result right away',
  chatExampleAria: (preview) => `Example conversation: "${preview}"`,

  readingTimeSuffix: 'min read',
  readingTimeAria: 'Estimated reading time',

  readingToggleAria: 'Assisted reading',
  readingToggleTitle:
    'Bolds the start of each word so you can scan the text faster.',
  readingToggleStateOn: 'on',
  readingToggleStateOff: 'off',

  prefsButtonAria: 'Preferences',
  prefsPanelHeading: 'Preferences',
  prefsSectionReading: 'Assisted reading',
  prefsSectionTheme: 'Theme',
  prefsSectionLanguage: 'Language',

  prefsSectionApp: 'App',
  installButtonLabel: 'Install the app',
  installInProgress: 'Installing…',
  installAlreadyInstalled: 'App installed',
  installAlreadyInstalledReady: 'App installed · offline ready',
  installBulkProgress: 'Downloading for offline · {done}/{total}',
  installIosTitle: 'Install AI-Guide on iPhone/iPad',
  installIosStep1: 'Tap the Share button below.',
  installIosStep2: 'Scroll and pick "Add to Home Screen".',
  installIosStep3: 'Confirm with "Add" in the top right.',
  installIosClose: 'Close',

  shareHeading: 'Share this lesson',
  shareXAria: 'Share on X',
  shareLinkedInAria: 'Share on LinkedIn',
  shareWhatsAppAria: 'Share on WhatsApp',
  shareEmailAria: 'Share via email',
  shareEmailSubject: (title) => `AI-Guide: ${title}`,
  shareCopyLabel: 'Copy link',
  shareCopyAria: 'Copy the lesson link',
  shareCopied: 'Link copied!',
  shareCopyError: 'Error, please retry',

  comingSoonLabel: 'Soon',

  lessonSummaryLabel: '30-second summary',

  builderBadge: 'Build your prompt',
  builderTitle: 'Give it a go: write a prompt that works',
  builderHint:
    "Fill in the four fields thinking of a real request you want to make to an AI. As you type, the prompt takes shape in the preview. When it's ready, copy it and paste it into your favourite AI.",
  builderTaskLabel: '1. What do you want the AI to do?',
  builderTaskExample:
    'e.g. "write me an email to my manager asking for three days off"',
  builderContextLabel: "2. Context: who you are, what you're doing",
  builderContextExample:
    "e.g. \"I'm a freelance designer, I haven't taken time off in 4 months\"",
  builderAudienceLabel: '3. Who is the answer for?',
  builderAudienceExample: 'e.g. "my manager, strict but reasonable"',
  builderFormatLabel: '4. How you want it (format, length, tone)',
  builderFormatExample:
    'e.g. "a short email, professional but friendly tone, max 100 words"',
  builderPreviewLabel: 'Generated prompt',
  builderPlaceholder: 'Fill in the fields and the prompt will appear here.',
  builderCopy: 'Copy prompt',
  builderReset: 'Clear everything',
  builderCopied: 'Copied!',
  builderError: 'Error, please retry',
  builderPromptTask: 'What I need',
  builderPromptContext: 'Context',
  builderPromptAudience: 'Who the answer is for',
  builderPromptFormat: 'Format',

  composerBadge: 'Drop me a line',
  composerTitle: 'Got an idea or a correction?',
  composerHint:
    "Type below and your email client will open with the message ready to send. No form, no backend: the message goes from your own inbox.",
  composerPlaceholder:
    "E.g. I'd love a lesson on using AI in the classroom, or: lesson X is missing an example of…",
  composerSubject: 'AI-Guide: idea or correction',
  composerButton: 'Open email',
  composerEmpty: 'Write something before opening the email.',
  composerOpenError:
    "Couldn't open your email client. Try the email link at the bottom of the page.",

  searchHint: 'Type something to search the manual',
  searchTooShort: 'Type at least two characters',
  searchLoading: 'Searching…',
  searchNoResults: 'No results for "{query}"',
  searchCountOne: '1 result',
  searchCountMany: '{n} results',
  searchError: 'Search error, please retry',
  searchResultsAria: 'Search results',
  searchClearAria: 'Clear search',

  footerAbout: 'About',
  footerPrivacy: 'Privacy',
  footerLinkedinAria: "Fabrizio La Rosa's LinkedIn profile",
  footerEmailAria: 'Send an email to AI-Guide',
  footerSiteAria: "Fabrizio La Rosa's personal site",
  footerKofiAria: 'Buy me a coffee on Ko-fi',
  footerGithubAria: 'Source code on GitHub',
  footerTagline: 'Open manual, written by a real person, in collaboration with AI.',
  footerCopyright: (year) => `© ${year} Fabrizio La Rosa`,
  footerLocation: 'Ghent, Belgium',
  footerVatLabel: 'VAT',

  // --- F1: progress & review ---
  recapLevelBeginner:
    'Level: beginner. Use everyday examples and no technical jargon.',
  recapLevelIntermediate:
    'Level: intermediate. You can use the terms from the lessons, explaining each in one sentence the first time.',
  recapLevelAdvanced:
    "Level: advanced. You can go into technical depth and use the field's vocabulary.",
  recapJournalNote: 'What I noted while practicing:',
  moduleProgressAria: '{done} lessons out of {total} completed',
  reviewTodayBadge: "Today's review",
  reviewTitle: 'Refresh what you have read',
  reviewDueOne: 'Today, review 1 lesson',
  reviewDueMany: (n) => `Today, review ${n} lessons`,
  reviewDesc:
    'Reviewing a few days later makes ideas stick. These lessons are ready for a round of questions with your AI.',
  reviewListAria: 'Lessons to review today',
  reviewGenerate: "Generate today's review",
  reviewDialogTitle: "Here is today's review",
  reviewDialogHint:
    'Copy it and paste it into your AI. It will only talk about the lessons due for review. When you copy it, we mark them as reviewed.',
  progressIntro:
    'Your path, module by module, with the key points of each lesson. Reading marks stay in your browser.',
  progressReadOf: '{read} of {total} lessons read',
  progressReadMark: 'Read',
  progressNotReadMark: 'To read',
  progressNoSummary: 'No summary for this lesson.',
  progressPrint: 'Print or save as PDF',
  progressNeedsJs: 'JavaScript is needed to see which lessons you have read. The module list below stays readable.',
  // --- end F1 ---
  // --- F2: lesson widgets ---
  selfCheckBadge: 'Test yourself',
  selfCheckGroupAria: 'Answer options',
  selfCheckCorrect: 'Correct.',
  selfCheckIncorrect: 'Not quite.',
  selfCheckRetry: 'Try again',
  selfCheckShowAnswer: 'Show the correct answer',
  selfCheckRightAnswerLabel: 'The correct answer',
  selfCheckPrevCorrect: (date) => `You answered this on ${date}: correct.`,
  selfCheckPrevWrong: (date) => `You answered this on ${date}: not correct.`,
  selfCheckNoJsSummary: 'See the answers',
  selfCheckNoJsCorrectMark: 'correct',
  selfCheckNoJsWrongMark: 'not correct',
  spotBadge: 'Spot the error',
  spotDefaultTitle: 'Where did this AI go wrong?',
  spotHint: 'Select the sentences that look wrong, then press Check.',
  spotPromptLabel: 'The question',
  spotAnswerLabel: "The AI's answer",
  spotCheck: 'Check',
  spotReset: 'Start over',
  spotFound: 'Error found',
  spotMissed: 'Error you missed',
  spotFalseAlarm: 'False alarm: this sentence was fine',
  spotSummary: 'Errors found: {found} of {total}. False alarms: {fa}.',
  spotSummaryNone: 'This answer had no errors. False alarms: {fa}.',
  spotNoJsTitle: 'Where the errors were',
  spotNoJsNone: 'This answer had no errors.',
  predictBadge: 'Predict first',
  predictQuestionLabel: 'The message you send to the AI',
  predictLabel: 'What do you expect the AI to answer?',
  predictPlaceholder:
    'Write your guess. It stays on your screen and is not saved.',
  predictReveal: 'Reveal the answer',
  predictCompare: 'Compare: what did you get right? What surprised you?',
  compareWeakLabel: 'Weak prompt',
  compareStrongLabel: 'Rebuilt prompt',
  compareCopy: 'Copy',
  compareCopied: 'Copied',
  compareCopyError: 'Copy failed, select the text by hand.',
  compareCopyAria: (label) => `Copy: ${label}`,
  compareNoteLabel: 'What changes',
  anonBadge: 'Anonymize before you paste',
  anonTitle: 'Strip personal data from your text',
  anonIntro:
    'Paste your text, check the result and copy the cleaned version to give to your AI. Everything happens in your browser: the text is not sent or stored anywhere.',
  anonInputLabel: 'Original text',
  anonInputPlaceholder: 'Paste the text to clean here',
  anonTermsLabel: 'Words to replace',
  anonTermsHint:
    'Names of people, companies and places, separated by commas. They become [NAME 1], [NAME 2] and so on, always the same for the same word.',
  anonTermsPlaceholder: 'Jane Smith, Acme Ltd, London',
  anonAllNumbers:
    'Also replace every other number (dates, amounts, quantities)',
  anonOutputLabel: 'Cleaned text',
  anonCopy: 'Copy the cleaned text',
  anonCopied: 'Copied',
  anonCopyError: 'Copy failed, select the text by hand.',
  anonCountsTitle: 'Replacements made',
  anonCountsNone: 'No replacements yet.',
  anonKindEmail: 'emails',
  anonKindPhone: 'phone numbers',
  anonKindIban: 'IBANs',
  anonKindCf: 'Italian tax codes',
  anonKindCard: 'card numbers',
  anonKindNumber: 'other numbers',
  anonKindName: 'words you listed',
  anonPhEmail: '[EMAIL]',
  anonPhPhone: '[PHONE]',
  anonPhIban: '[IBAN]',
  anonPhCf: '[TAX CODE]',
  anonPhCard: '[CARD]',
  anonPhNumber: '[NUMBER]',
  anonPhName: '[NAME {n}]',
  anonNoteTitle: 'What it does NOT catch',
  anonNoteIntro:
    'It is a help, not a guarantee. Always reread the cleaned text before pasting it into your AI.',
  anonNoteItems: [
    'Names you did not list in the "Words to replace" field.',
    'Addresses, street names and house numbers.',
    'Indirect details that identify a person: a unique role, a recognizable episode, a combination of facts.',
    'The content of images and attachments: the tool only works on the pasted text.',
  ],
  anonNoteLocal:
    'Nothing leaves your browser: the text is not sent and not stored.',
  anonNoJs: 'This tool needs JavaScript to work.',
  // --- end F2 ---
  // --- F3: journal, plan prompt, Def ---
  journalSummary: 'One thing I noticed',
  journalPlaceholder: 'What did you notice while doing the exercise?',
  journalPrivacy: 'Stays only in this browser',
  planBadge: 'Study plan',
  planTitle: 'Ask your AI for a study calendar',
  planHint:
    'Pick the path and the pace. We prepare a text for you to paste into your AI: it will build the calendar and check in with you along the way.',
  planPathLabel: 'Path',
  planPaceLabel: 'Pace',
  planMinutesLabel: 'Minutes per session (optional)',
  planMinutesPlaceholder: 'e.g. 20',
  planPreviewLabel: 'Your text',
  planCopy: 'Copy the text',
  planCopied: 'Copied!',
  planError: 'Error, please retry',
  planPaths: {
    fundamentals: 'Fundamentals',
    'everyday-use': 'Everyday use',
    'at-work': 'At work',
    'by-profession': 'By profession',
    'for-students': 'For students',
    'for-teachers': 'For teachers',
    'going-deeper': 'Going deeper',
  },
  planPaces: {
    daily: 'One lesson a day',
    weekly: 'Three lessons a week',
    weekend: 'Weekends only',
  },
  planPromptIntro: (path) =>
    `Act as my study tutor. I want to follow the "${path}" path of the AI-Guide manual (https://ai-guide.larosa.work/en/) and I need a study calendar.`,
  planPromptLessons: 'Here are the lessons of the path, in order:',
  planPromptPace: {
    daily: 'My pace: one lesson a day.',
    weekly: 'My pace: three lessons a week.',
    weekend: 'My pace: weekends only (Saturday and Sunday).',
  },
  planPromptMinutes: 'I have about {n} minutes for each session.',
  planPromptClosing:
    'Ask me which date I want to start from. Then build a week-by-week calendar: for each day write the lesson title and its link. Use only the lessons in the list, do not invent others. In later conversations, check in with me: what I read, what is unclear, whether something needs to move. If I skip a day, help me pick up again without drama.',
  // --- end F3 ---
};

const STRINGS: Record<Locale, UIStrings> = { it, en };

export function getLocale(raw: string | undefined | null): Locale {
  return raw === 'it' ? 'it' : 'en';
}

export function t(raw: string | undefined | null): UIStrings {
  return STRINGS[getLocale(raw)];
}
