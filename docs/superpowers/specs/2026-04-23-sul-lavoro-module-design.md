# Modulo 3 "Sul lavoro": design

Data: 2026-04-23
Stato: spec validato con l'utente, pronto per il piano di implementazione.

## Obiettivo

Definire la struttura definitiva del Modulo 3 di AI-Guide ("Sul lavoro")
prima di iniziare la scrittura delle lezioni. Questo documento fissa:

- taglio del modulo (trasversale per attività, non per professione),
- numero e identità delle lezioni (9 lezioni),
- ordine pedagogico,
- slug (in inglese, da convenzione del progetto),
- livello (`intermedio` uniforme per tutte e 9),
- prerequisiti cross-module per lezione,
- assorbimenti di voci non promosse a lezione autonoma.

Le singole lezioni verranno scritte una alla volta, ciascuna con il
proprio ciclo di revisione (`analyze-lesson` + `integrate-questions` +
`style-checker`). Questo documento resta la fonte di verità per come
il modulo è organizzato.

## Contesto

Modulo 1 (Fondamenti) chiuso al 100% il 2026-04-19. Modulo 2 (Uso
quotidiano) chiuso al 100% il 2026-04-23. Il Modulo 3 serve knowledge
worker non developer (project manager, marketing, HR, consulenza,
sales, didattica, design, comunicazione) che hanno già usato l'IA per
cose personali e vogliono portarla al lavoro.

Il piano provvisorio in `CONTENT.md` elencava 10 voci. In brainstorming
con l'utente è stato consolidato a 9 fondendo due voci molto
sovrapposte ("Email che funzionano" + "Riformulare comunicazioni
difficili") in una lezione con taglio più specifico.

## Taglio del modulo: trasversale per attività

Ogni lezione è un **caso d'uso da ufficio** che taglia tutte le
professioni (email, documenti, riunioni, dati, ricerca). Nessuna
lezione "per HR", "per marketing", "per consulenza".

Motivi:

- Scala senza duplicare. Project manager e marketing manager leggono
  la stessa lezione su "email difficili".
- Coerente con Uso quotidiano, anche quello trasversale per attività.
- I moduli 4 e 5 (Per studenti, Per docenti) sono già i "profili
  verticali" naturali del sito: lì il taglio cambia per costruzione.
- Rispetta il principio "ogni lezione autoesplicativa": il lettore
  traduce l'esempio al suo mestiere, ma il pattern è lo stesso.

Il costo ("traduci dal mio mestiere") si contiene variando gli esempi
lezione per lezione (una lezione ambientata in consulenza, un'altra in
marketing, un'altra in HR, ecc.).

## Struttura del modulo

Nove lezioni, ordinate pedagogicamente in quattro blocchi:
**produrre → elaborare → pensare/scalare → custodire e chiudere**.

| # | Slug (EN) | Titolo IT | Livello | Cosa insegna |
|---|-----------|-----------|---------|--------------|
| 1 | `hard-emails` | Email difficili | `intermedio` | Dire di no, negoziare, gestire un cliente irritato, dare feedback delicato. Taglio specifico su email dove il costo di una parola sbagliata è alto. Assorbe le due voci provvisorie "Email che funzionano" e "Riformulare comunicazioni difficili". |
| 2 | `draft-professional-documents` | Bozze di documenti professionali | `intermedio` | Proposte, brief, report. Struttura (exec summary, audience, sezioni), non solo scrittura. L'IA come prima bozza strutturata, non come ghostwriter. |
| 3 | `prepare-a-meeting` | Preparare una riunione | `intermedio` | Ordine del giorno, brief di preparazione, riassunto, follow-up. Ciclo pre/durante/post. |
| 4 | `slides-and-presentations` | Slide e presentazioni | `intermedio` | Contenuto, non design: scaletta, bullet asciugati, speaker notes. Pitfall: IA → slide piene di parole. |
| 5 | `data-and-tables` | Lavorare con dati e tabelle | `intermedio` | CSV, formule Excel/Sheets, pulizia, piccole analisi. Senza diventare programmatori. Privacy al centro. |
| 6 | `research-for-work` | Ricerca per il lavoro | `intermedio` | Sintesi multi-fonte per un deliverable. Differenza da *Imparare un argomento nuovo* (Modulo 2) e *Riassumere un documento lungo* (Modulo 2): più fonti contemporaneamente + obiettivo d'uso professionale. |
| 7 | `ai-as-thinking-partner` | L'IA come collega che ti aiuta a pensare | `intermedio` | Challenge, devil's advocate, brainstorming strutturato. Riconoscere quando stai usando l'IA per pensare meglio vs per essere rassicurato. |
| 8 | `reuse-context-with-projects` | Riusare contesto con i progetti | `intermedio` | Claude Projects, ChatGPT Custom GPT, Gemini Gems. Stesso pattern su tutte le piattaforme: caricare conoscenza ricorrente una volta, non ogni chat. |
| 9 | `company-data-and-privacy` | Privacy e dati aziendali | `intermedio` | Cosa NON dare in pasto a un'IA pubblica. Piani Enterprise/Team e cosa cambia. NDA e contratti. Opt-out reali. Chiusura del modulo, ponte verso i moduli successivi. |

## Ragionamento sull'ordine

**Blocco 1, produrre (1-4).** Gesti quotidiani di output professionale.
Si parte dall'email (più frequente, più quotidiana, più familiare come
forma) e si scala in sofisticazione: email → documenti → riunioni →
slide. La progressione rispecchia la complessità strutturale
dell'artefatto.

**Blocco 2, elaborare (5-6).** Gesti di input/trasformazione. Dati e
tabelle prima (più meccanico, meno giudizio), ricerca dopo (più
giudizio, allucinazioni più pericolose). Entrambi richiedono già
confidenza con l'interazione iterativa.

**Blocco 3, pensare e scalare (7-8).** Uso meta dell'IA. Thinking
partner è usarla per pensare; progetti è scalare tutto il pattern del
modulo su base ricorrente. Arrivano dopo perché richiedono un modello
mentale dell'IA già formato.

**Blocco 4, chiudere (9).** Privacy e dati aziendali chiude il modulo
riabbassando la foga e facendo da ponte verso i moduli successivi. Lo
stesso pattern di chiusura di Fondamenti (6) e Uso quotidiano (8).

## Livello: uniforme `intermedio`

Tutte e 9 le lezioni sono `intermedio`. Motivi:

- Il pubblico target è **intermedio per costruzione**: ci arriva dopo
  Fondamenti + Uso quotidiano (o ha esperienza equivalente), e "sul
  lavoro" implica di per sé che le basi sono già lì.
- Segnala visivamente che il modulo è un salto rispetto ai primi due.
- Mantiene `avanzato` riservato al Modulo 6 (Per chi vuole di più),
  pensato per developer. Usare `avanzato` anche qui confonderebbe la
  promessa della gerarchia del sito.

Nota: il tag `intermedio` è consumato dalla skill `analyze-lesson` per
simulare un lettore più esperto durante il QA, quindi il QA delle
lezioni del modulo sarà calibrato su quel profilo.

## Prerequisiti

Dentro al modulo, **nessuna lezione è prerequisito di un'altra** (stesso
principio di Uso quotidiano: si entra da qualunque punto).

Cross-module, `ask-well` è prerequisito di default per tutte (è il
minimo per entrare in qualunque contesto professionale con l'IA).
Prerequisiti specifici aggiuntivi dove la lezione presume skill
puntuali di Modulo 1 o 2:

| # | Lezione | Prerequisiti |
|---|---------|--------------|
| 1 | Email difficili | `ask-well`, `write-better` |
| 2 | Bozze di documenti professionali | `ask-well`, `write-better` |
| 3 | Preparare una riunione | `ask-well`, `iterate-the-conversation` |
| 4 | Slide e presentazioni | `ask-well`, `write-better` |
| 5 | Lavorare con dati e tabelle | `ask-well`, `images-and-files` |
| 6 | Ricerca per il lavoro | `ask-well`, `when-to-trust-it`, `summarize-a-long-document` |
| 7 | L'IA come collega che ti aiuta a pensare | `ask-well`, `when-to-trust-it` |
| 8 | Riusare contesto con i progetti | `ask-well`, `iterate-the-conversation` |
| 9 | Privacy e dati aziendali | `ask-well`, `privacy-basics` |

Logica per asse:

- **`write-better`** per 1, 2, 4: tutte lezioni "scrivi qualcosa"; eredita
  il pattern voce-che-resta-tua.
- **`when-to-trust-it`** per 6, 7: ricerca e thinking partner sono dove le
  allucinazioni fanno più danno.
- **`images-and-files`** per 5: dati e tabelle implica upload di CSV/Excel
  e foto di documenti cartacei.
- **`privacy-basics`** per 9: eredita il modello "cosa vede l'IA quando le
  parli" e lo scala al contesto aziendale.
- **`iterate-the-conversation`** per 3, 8: riunioni sono multi-turno per
  natura; progetti è iterazione ricorrente.

## Assorbimenti

Voci del piano provvisorio non promosse a lezione autonoma:

- **"Email che funzionano" + "Riformulare comunicazioni difficili"** →
  fuse nella lezione 1 (`hard-emails`). Le due voci originali coprivano
  entrambe "dire di no", conflitti e feedback delicato. Il taglio
  "difficile" (dove il costo di una parola sbagliata è alto) copre
  tutti i casi senza diluizione. Lo slug `hard-emails` sostituisce i
  due precedenti.

Assorbimenti secondari previsti come callout all'interno delle lezioni
(decisioni rinviate alla scrittura delle singole lezioni):

- **Callout "IA vs CRM/gestionale"** dentro lezione 5 (`data-and-tables`):
  breve nota sul perché incollare dati estratti dal proprio sistema è
  diverso da usare un tool di Business Intelligence.
- **Callout "custom instructions" / "system prompt in Projects"** dentro
  lezione 8: la meccanica tecnica di Claude Projects / ChatGPT Custom
  GPT / Gemini Gems viene spiegata qui, non in Fondamenti.
- **Callout "tono per il tuo capo"** dentro lezione 1: stile aziendale
  e registri diversi.

Se in corso di scrittura uno di questi callout diventa troppo grande
per stare inline, si valuterà la promozione a lezione autonoma,
aggiornando questo spec e `CONTENT.md` nello stesso commit.

## Struttura file

Per ogni lezione del modulo verrà creata la coppia IT + EN:

```
src/content/docs/it/at-work/<slug>.mdx
src/content/docs/en/at-work/<slug>.mdx
```

Sidebar `autogenerate` in `astro.config.mjs` con
`translations: { en: 'At work' }`.

Per gli esercizi `.txt` di `<LlmExercise>`:

```
public/skills/it/<filename>.txt
public/skills/en/<filename>.txt
```

Convenzione filename per i `review-*.txt`: `review-<slug-lezione>.txt`
(pattern già usato in Modulo 2).

## Traduzione EN

Avanzata **lezione per lezione in pari passo con la stesura IT**, come
per Modulo 2. Non a modulo concluso.

Motivi:

- Il sito EN resta coerente settimana per settimana.
- Tradurre subito cattura incoerenze della versione IT (la traduzione
  è il miglior QA della coerenza).
- Non si accumula debito di traduzione che diventa un blocco a fine
  modulo.

## Scope di questo spec

Questo documento fissa **solo** la struttura del modulo. Non contiene:

- bozze o scalette di singole lezioni (ciascuna avrà il suo brief nella
  sessione di scrittura),
- decisioni sulla sidebar di `astro.config.mjs` (gli slug placeholder
  disabilitati saranno sostituiti con `{ slug: 'at-work/<slug>' }` al
  rilascio di ciascuna lezione, un commit per lezione come da pattern
  stabilito),
- aggiornamenti a `start-here.mdx` e a `index.mdx` (la card "Al
  lavoro…" passa da `comingSoon: true` a linkata quando atterra la
  prima lezione del modulo).

Questi punti faranno parte del piano di implementazione (prossimo
passo: skill `writing-plans`).

## Decisioni aperte, non bloccanti

- **Ordine di scrittura delle 9 lezioni** (diverso dall'ordine
  pedagogico): da decidere nel piano di implementazione. Ipotesi:
  partire dalle 3-4 con maggior payoff immediato per il lettore
  (email difficili, bozze di documenti, preparare riunioni), poi
  slide, ricerca, dati, infine thinking partner, progetti, privacy.
- **Esempio portante a livello modulo**: se durante la scrittura emerge
  un caso aziendale cross-lezione utile (es. stesso progetto che
  appare in preparare una riunione + bozze + slide), lo si consolida
  come filo conduttore. Nessuna decisione anticipata.
