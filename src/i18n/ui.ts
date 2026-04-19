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

  // ChatDemo
  chatUserLabel: string;
  chatAiLabel: string;
  chatReplay: string;
  chatReplayAria: string;
  chatExampleAria: (preview: string) => string;

  // ReadingTime
  readingTimeSuffix: string;
  readingTimeAria: string;

  // ReadingToggle (assisted reading / bionic reading)
  readingToggleAria: string;
  readingToggleTitle: string;
  readingToggleStateOn: string;
  readingToggleStateOff: string;

  // HomeCards
  comingSoonLabel: string;

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

  // Footer
  footerAbout: string;
  footerPrivacy: string;
  footerLinkedinAria: string;
  footerEmailAria: string;
  footerSiteAria: string;
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

  chatUserLabel: 'Tu',
  chatAiLabel: 'IA',
  chatReplay: 'Riavvia',
  chatReplayAria: "Riavvia l'animazione della conversazione",
  chatExampleAria: (preview) => `Esempio di conversazione: "${preview}"`,

  readingTimeSuffix: 'min di lettura',
  readingTimeAria: 'Tempo di lettura stimato',

  readingToggleAria: 'Lettura assistita',
  readingToggleTitle:
    'Lettura assistita: mette in grassetto l\'inizio di ogni parola per scorrere più in fretta',
  readingToggleStateOn: 'attiva',
  readingToggleStateOff: 'disattivata',

  comingSoonLabel: 'Presto',

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

  footerAbout: 'Chi sono',
  footerPrivacy: 'Privacy',
  footerLinkedinAria: 'Profilo LinkedIn di Fabrizio La Rosa',
  footerEmailAria: 'Scrivi una mail ad AI-Guide',
  footerSiteAria: 'Sito personale di Fabrizio La Rosa',
  footerTagline: 'Manuale aperto, scritto da una persona vera.',
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

  chatUserLabel: 'You',
  chatAiLabel: 'AI',
  chatReplay: 'Replay',
  chatReplayAria: 'Replay the conversation animation',
  chatExampleAria: (preview) => `Example conversation: "${preview}"`,

  readingTimeSuffix: 'min read',
  readingTimeAria: 'Estimated reading time',

  readingToggleAria: 'Assisted reading',
  readingToggleTitle:
    'Assisted reading: bolds the start of each word so you can scan faster',
  readingToggleStateOn: 'on',
  readingToggleStateOff: 'off',

  comingSoonLabel: 'Soon',

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

  footerAbout: 'About',
  footerPrivacy: 'Privacy',
  footerLinkedinAria: "Fabrizio La Rosa's LinkedIn profile",
  footerEmailAria: 'Send an email to AI-Guide',
  footerSiteAria: "Fabrizio La Rosa's personal site",
  footerTagline: 'Open manual, written by a real person.',
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
