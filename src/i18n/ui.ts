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
  localAiModelLightLabel: string;
  localAiModelBetterLabel: string;
  localAiModelBestLabel: string;
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
  footerTagline: string;
  footerCopyright: (year: number) => string;
  footerLocation: string;
  footerVatLabel: string;
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

  recapBadge: '🎓 Ripasso con la tua IA',
  recapTitle: 'Trasforma la tua IA in un tutor',
  recapDesc:
    'Generiamo un prompt che fa diventare la tua IA un tutor delle lezioni che hai completato. Ti farà domande socratiche per rievocare quello che hai imparato.',
  recapEmpty: 'Completa almeno una lezione per attivare il ripasso.',
  recapCountOne: '1 lezione completata finora.',
  recapCountMany: (n) => `${n} lezioni completate finora.`,
  recapGenerate: 'Genera prompt di ripasso',
  recapDialogTitle: 'Ecco il tuo prompt di ripasso',
  recapDialogHint:
    'Copialo e incollalo nella tua IA. Si calibrerà sulle lezioni che hai effettivamente completato.',
  recapCopy: 'Copia il prompt',
  recapClose: 'Chiudi',
  recapCopied: '✅ Copiato!',
  recapCopyError: '❌ Errore, riprova',
  recapPromptIntro:
    'Sei un tutor amichevole. Sto studiando il manuale AI-Guide e ho completato queste lezioni, di cui ti elenco i concetti chiave:',
  recapPromptInstructions: `Aiutami a fare un ripasso usando il metodo socratico. Fammi domande progressive che mi obblighino a rievocare e collegare i concetti delle diverse lezioni. Una domanda alla volta. Per ogni mia risposta, dammi un feedback breve (cosa ho centrato, cosa potrei precisare) e poi passa alla prossima.

Mescola le domande fra le lezioni che ho fatto, non procedere strettamente in ordine. Inserisci almeno una domanda di "applicazione" (es. uno scenario realistico in cui devo decidere cosa fare con l'IA) verso metà ripasso.

Alla fine fai una sintesi in tre punti: cosa ho ben presente, cosa vale la pena ripassare, e una piccola sfida pratica per la prossima conversazione con un'IA.

Tono incoraggiante, mai da esame. Niente gergo nelle tue spiegazioni: ricorda che sono alle prime armi.`,
  recapUnmappedConcepts: '(concetti non mappati)',

  glossaryButton: 'Approfondisci con la tua IA',
  glossaryCopied: '✅ Prompt copiato! Incollalo nella tua IA',
  glossaryError: '❌ Errore, riprova',
  glossaryPrompt: (term) =>
    `Sei un tutor amichevole di un manuale di IA per principianti. Spiegami con parole semplici cosa significa "${term}" nel contesto delle IA conversazionali (ChatGPT, Claude, Gemini). Usa un esempio concreto preso dalla vita di tutti i giorni. Tono incoraggiante, niente gergo. Massimo 200 parole.

Se dopo ho domande di approfondimento, lasciami chiederle e rispondi sempre con la stessa accessibilità.`,

  practiceBadge: 'Esercizio con la tua IA',
  reviewBadge: 'Verifica con la tua IA',
  practiceDuration: 'di esercizio',
  reviewDuration: 'di verifica',
  llmExerciseHowTo:
    "Copia il testo qui sotto e incollalo nella tua IA preferita (<strong>Claude</strong>, <strong>ChatGPT</strong>, <strong>Gemini</strong> o un'altra). In alternativa scarica il file e dallo all'IA come allegato.",
  llmExerciseCopy: 'Copia il testo',
  llmExerciseDownload: 'Scarica',
  llmExerciseOpen: 'Apri',
  llmExerciseCopied: '✅ Copiato!',
  llmExerciseError: '❌ Errore, riprova',

  localAiLauncherLabel: "Chiedi all'IA locale",
  localAiLauncherAria: "Apri l'assistente IA locale",
  localAiPanelTitle: 'Assistente IA locale',
  localAiClose: 'Chiudi',
  localAiConsentHeading: 'Fai girare una piccola IA qui, sul tuo dispositivo',
  localAiConsentBody:
    "Questo assistente gira nel tuo browser. La prima volta scarica un file del modello, una volta sola, da un fornitore esterno (Hugging Face). Dopo funziona offline e niente di quello che scrivi esce dal tuo dispositivo.",
  localAiConsentPrivacy: 'I tuoi messaggi restano in questo browser. Non vengono mai inviati a me né a un server.',
  localAiConsentPrivacyLink: 'Leggi la pagina sulla privacy',
  localAiModelLightLabel: 'Leggero · circa 0,4 GB · veloce, risposte basilari',
  localAiModelBetterLabel: 'Migliore · circa 1,1 GB · più lento da caricare, italiano migliore',
  localAiModelBestLabel: 'Massimo · circa 1,9 GB · risposte migliori',
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
  shareCopied: '✅ Link copiato!',
  shareCopyError: '❌ Errore, riprova',

  comingSoonLabel: 'Presto',

  lessonSummaryLabel: 'Riepilogo in 30 secondi',

  builderBadge: '🛠️ Costruisci il tuo prompt',
  builderTitle: 'Mettiti alla prova: scrivi un prompt che funziona',
  builderHint:
    "Compila i quattro campi qui sotto pensando a una richiesta vera che vuoi fare a un'IA. Mentre scrivi vedi il prompt prendere forma a destra. Quando sei pronto, copialo e incollalo nella tua IA preferita.",
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
  builderPlaceholder: 'Compila i campi a sinistra e il prompt apparirà qui.',
  builderCopy: 'Copia il prompt',
  builderReset: 'Ripulisci tutto',
  builderCopied: '✅ Copiato!',
  builderError: '❌ Errore, riprova',
  builderPromptTask: 'Cosa mi serve',
  builderPromptContext: 'Contesto',
  builderPromptAudience: 'Per chi è la risposta',
  builderPromptFormat: 'Formato',

  composerBadge: '💌 Scrivimi',
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
  footerTagline: "Manuale aperto, scritto da una persona vera, in collaborazione con l'IA.",
  footerCopyright: (year) => `© ${year} Fabrizio La Rosa`,
  footerLocation: 'Gent, Belgio',
  footerVatLabel: 'P.IVA',
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

  recapBadge: '🎓 Recap with your AI',
  recapTitle: 'Turn your AI into a tutor',
  recapDesc:
    "We'll generate a prompt that turns your AI into a tutor for the lessons you've completed. It will ask Socratic questions to help you recall what you learned.",
  recapEmpty: 'Complete at least one lesson to enable the recap.',
  recapCountOne: '1 lesson completed so far.',
  recapCountMany: (n) => `${n} lessons completed so far.`,
  recapGenerate: 'Generate recap prompt',
  recapDialogTitle: 'Here is your recap prompt',
  recapDialogHint:
    "Copy it and paste it into your AI. It will tune itself to the lessons you've actually completed.",
  recapCopy: 'Copy prompt',
  recapClose: 'Close',
  recapCopied: '✅ Copied!',
  recapCopyError: '❌ Error, please retry',
  recapPromptIntro:
    "You are a friendly tutor. I'm studying the AI-Guide manual and I've completed these lessons. Here are the key concepts for each:",
  recapPromptInstructions: `Help me review using the Socratic method. Ask me progressive questions that force me to recall and connect concepts across the different lessons. One question at a time. After each of my answers, give me brief feedback (what I got right, what I could sharpen) then move to the next.

Mix questions across the lessons I've done, don't go strictly in order. Include at least one "application" question (e.g. a realistic scenario where I have to decide what to do with an AI) around the middle of the recap.

At the end, give a three-point summary: what I have well in mind, what is worth reviewing, and a small practical challenge for my next conversation with an AI.

Encouraging tone, never exam-like. No jargon in your explanations: remember I'm a beginner.`,
  recapUnmappedConcepts: '(concepts not mapped yet)',

  glossaryButton: 'Go deeper with your AI',
  glossaryCopied: '✅ Prompt copied! Paste it into your AI',
  glossaryError: '❌ Error, please retry',
  glossaryPrompt: (term) =>
    `You are a friendly tutor for a beginner-level AI manual. Explain to me in simple words what "${term}" means in the context of conversational AIs (ChatGPT, Claude, Gemini). Use a concrete example from everyday life. Encouraging tone, no jargon. Maximum 200 words.

If I have follow-up questions afterwards, let me ask them and keep the same accessible style in your answers.`,

  practiceBadge: 'Exercise with your AI',
  reviewBadge: 'Check-in with your AI',
  practiceDuration: 'of practice',
  reviewDuration: 'of check-in',
  llmExerciseHowTo:
    'Copy the text below and paste it into your favourite AI (<strong>Claude</strong>, <strong>ChatGPT</strong>, <strong>Gemini</strong>, or another). Or download the file and give it to your AI as an attachment.',
  llmExerciseCopy: 'Copy the text',
  llmExerciseDownload: 'Download',
  llmExerciseOpen: 'Open',
  llmExerciseCopied: '✅ Copied!',
  llmExerciseError: '❌ Error, please retry',

  localAiLauncherLabel: 'Ask the local AI',
  localAiLauncherAria: 'Open the local AI assistant',
  localAiPanelTitle: 'Local AI assistant',
  localAiClose: 'Close',
  localAiConsentHeading: 'Run a small AI here, on your device',
  localAiConsentBody:
    'This assistant runs in your browser. The first time, it downloads a model file once from an external provider (Hugging Face). After that it works offline and nothing you type leaves your device.',
  localAiConsentPrivacy: 'Your messages stay in this browser. They are never sent to me or to any server.',
  localAiConsentPrivacyLink: 'Read the privacy page',
  localAiModelLightLabel: 'Light · about 0.4 GB · fast, basic answers',
  localAiModelBetterLabel: 'Better · about 1.1 GB · slower to load, better Italian',
  localAiModelBestLabel: 'Best · about 1.9 GB · best answers',
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
  shareCopied: '✅ Link copied!',
  shareCopyError: '❌ Error, please retry',

  comingSoonLabel: 'Soon',

  lessonSummaryLabel: '30-second summary',

  builderBadge: '🛠️ Build your prompt',
  builderTitle: 'Give it a go: write a prompt that works',
  builderHint:
    "Fill in the four fields below thinking of a real request you want to make to an AI. As you type, watch the prompt take shape on the right. When you're ready, copy it and paste it into your favourite AI.",
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
  builderPlaceholder: 'Fill in the fields on the left and the prompt will appear here.',
  builderCopy: 'Copy prompt',
  builderReset: 'Clear everything',
  builderCopied: '✅ Copied!',
  builderError: '❌ Error, please retry',
  builderPromptTask: 'What I need',
  builderPromptContext: 'Context',
  builderPromptAudience: 'Who the answer is for',
  builderPromptFormat: 'Format',

  composerBadge: '💌 Drop me a line',
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
  footerTagline: 'Open manual, written by a real person, in collaboration with AI.',
  footerCopyright: (year) => `© ${year} Fabrizio La Rosa`,
  footerLocation: 'Ghent, Belgium',
  footerVatLabel: 'VAT',
};

const STRINGS: Record<Locale, UIStrings> = { it, en };

export function getLocale(raw: string | undefined | null): Locale {
  return raw === 'it' ? 'it' : 'en';
}

export function t(raw: string | undefined | null): UIStrings {
  return STRINGS[getLocale(raw)];
}
