# Modulo 2 "Uso quotidiano": design

Data: 2026-04-20
Stato: spec validato con l'utente, pronto per il piano di implementazione.

## Obiettivo

Definire la struttura definitiva del Modulo 2 di AI-Guide ("Uso quotidiano")
prima di iniziare la scrittura delle lezioni. Questo documento fissa:

- numero e identità delle lezioni (8 lezioni),
- ordine pedagogico,
- slug (in inglese, da convenzione del progetto),
- livello (`principiante` o `intermedio`) per lezione,
- dove confluiscono i casi d'uso non promossi a lezione autonoma.

Le singole lezioni verranno scritte una alla volta; ciascuna avrà il suo
ciclo di revisione (`analyze-lesson` + `integrate-questions` +
`style-checker`) e potrà produrre aggiustamenti locali. Questo documento
resta la fonte di verità per come il modulo è organizzato.

## Contesto

Il Modulo 1 (Fondamenti) è chiuso al 100% il 2026-04-19. Il target di
AI-Guide è prioritariamente un pubblico italiano non tecnico. Il Modulo 2
serve lettori che hanno usato ChatGPT, Claude o Gemini qualche volta e
vogliono portarli nel quotidiano in modo più consapevole.

Il piano provvisorio in `CONTENT.md` elencava 10 voci. Con l'utente
abbiamo deciso di consolidare a 8, perché:

- Fondamenti ha 6 lezioni: 8 è coerente, 10 diluiva il percorso.
- Due voci provvisorie ("IA vs Google" e "Pianificare") coprono territori
  che si raccontano meglio dentro altre lezioni, come callout o esempio
  esteso, piuttosto che come lezione a sé.

Il livello del modulo non è un singolo badge: i lettori vedono le
lezioni una per una. Quindi `livello` nel frontmatter rispecchia la
difficoltà reale della singola lezione, non un'etichetta di modulo. Lo
schema in `src/content.config.ts` accetta solo
`principiante | intermedio | avanzato`: non c'è un livello "tra i due",
quindi il pitch "a metà tra principiante e intermedio" si traduce in un
**mix per lezione**, deciso caso per caso.

## Struttura del modulo

Otto lezioni, ordinate pedagogicamente. Il lettore può leggerle in
sequenza (percorso naturale) o saltare, come per Fondamenti.

| # | Slug (EN) | Titolo IT | Livello | Cosa insegna |
|---|-----------|-----------|---------|--------------|
| 1 | `ask-well` | Chiedere bene | `principiante` | Tecniche per scrivere una richiesta che funziona: chiarezza, contesto, formato atteso. Ponte diretto da *Cos'è un prompt?* di Fondamenti. |
| 2 | `iterate-the-conversation` | Iterare la conversazione | `principiante` | Il prompt come dialogo, non comando singolo. "Prompt magici" demistificati. Esempio esteso portante: pianificare un weekend in più giri. |
| 3 | `understand-something-complex` | Capire una cosa complicata | `principiante` | Tradurre dal burocratese al quotidiano: contratto, referto, bolletta, regolamento. Alto valore immediato per pubblico italiano. |
| 4 | `summarize-a-long-document` | Riassumere un documento lungo | `principiante` | PDF, articoli, libri. Come chiedere un riassunto affidabile e come verificarlo. |
| 5 | `learn-something-new` | Imparare un argomento nuovo | `intermedio` | L'IA come tutor personale: chiedere spiegazioni a più livelli, verificare la qualità, fare interrogazioni di ritorno. |
| 6 | `write-better` | Scrivere meglio | `intermedio` | Email, testi, messaggi. Giudizio "quando sì, quando no": riconoscere dove l'IA aiuta e dove appiattisce la voce. |
| 7 | `images-and-files` | Foto, immagini e file | `intermedio` | Multimodalità: foto di un documento, screenshot, upload di un PDF. Come funziona su ChatGPT/Claude/Gemini. |
| 8 | `what-not-to-do` | Cose da NON fare | `principiante` | Sanitari, finanza, consigli legali, decisioni importanti senza verifica. Chiusura del modulo, ponte verso *Sul lavoro*. |

## Ragionamento sull'ordine

- **1-2 sono meta-skills**: "come parlare all'IA" viene prima di ogni caso
  d'uso, perché ogni lezione successiva presuppone una richiesta ben
  formulata e la capacità di iterare.
- **3-4 sono i casi d'uso ad altissimo ritorno immediato** per il lettore
  italiano medio: tradurre il burocratese e riassumere testi lunghi sono
  problemi ricorrenti che l'IA risolve molto bene.
- **5-6 aprono usi più sfumati**: studiare e scrivere richiedono più
  giudizio (la spiegazione è buona? la bozza suona come te o come l'IA?).
  Coerente con livello `intermedio`.
- **7 arriva dopo il testo**: la multimodalità estende il repertorio ma
  richiede già un modello mentale dell'IA (introdotto nelle 6 lezioni
  precedenti).
- **8 chiude riabbassando la foga**: consapevolezza sui limiti, ponte
  verso il Modulo 3 dove la posta in gioco diventa professionale.

## Livelli: perché il mix

Cinque lezioni a `principiante`, tre a `intermedio`:

- **principiante** (1, 2, 3, 4, 8): concetti praticabili subito, lessico
  già introdotto in Fondamenti, judgment basso. "Cose da NON fare" è
  volutamente `principiante` perché il pubblico più vulnerabile è quello
  che ha appena iniziato a usare l'IA.
- **intermedio** (5, 6, 7): richiedono al lettore di valutare qualità
  (la spiegazione ti aiuta davvero?), stile (la bozza suona come te?),
  o di navigare piattaforme diverse con comportamenti diversi (file e
  multimodalità). Il tag `intermedio` è consumato dalla skill
  `analyze-lesson` per simulare un lettore più esperto durante il QA.

## Assorbimenti

Le due voci provvisorie non promosse a lezione autonoma:

- **"Quando l'IA è meglio di Google, e viceversa"** → callout breve
  dentro lezione 1 (`ask-well`). Momento naturale: prima di scrivere un
  prompt, il lettore si chiede se non gli basti una ricerca. Un callout
  di ~80-120 parole con due colonne mentali ("L'IA vince quando…" / "Google
  vince quando…") copre il caso senza bisogno di una lezione meta.
- **"Pianificare un viaggio, un'attività, un evento"** → esempio esteso
  portante dentro lezione 2 (`iterate-the-conversation`). Pianificare è
  il caso canonico dell'iterazione: prima bozza di itinerario, raffinazione
  con vincoli (budget, tempo, clima), dettagli finali. L'esempio fa da
  filo conduttore alla lezione invece di essere confinato a una lezione a
  sé.

Se in corso di scrittura un assorbimento non regge, si valuterà se
promuovere la voce a lezione autonoma, aggiornando questo spec e
`CONTENT.md` nello stesso commit.

## Prerequisiti e posizionamento

Il modulo presume Fondamenti 1-2. In concreto, il frontmatter di ogni
lezione di Uso quotidiano avrà almeno:

```yaml
prerequisiti: [what-is-a-prompt]
```

Le lezioni 5 e 6 (che fanno leva su "Quando fidarsi e quando no")
aggiungeranno `when-to-trust-it`. Le altre restano autoesplicative senza
forzare ulteriori letture.

All'interno del modulo le lezioni sono autoesplicative (principio in
`CONTENT.md`): nessuna lezione di Uso quotidiano può essere prerequisito
di un'altra dello stesso modulo. Il lettore può entrare da qualunque
punto.

## Struttura file

Per ogni lezione del modulo verrà creata la coppia:

```
src/content/docs/it/everyday-use/<slug>.mdx
src/content/docs/en/everyday-use/<slug>.mdx
```

La scelta di `everyday-use` come directory segue la convenzione di
`fundamentals`: slug in inglese, sidebar `autogenerate` in
`astro.config.mjs` con `translations: { it: 'Uso quotidiano' }`.

Per gli esercizi `.txt` di `<LlmExercise>`:

```
public/skills/it/<filename>.txt
public/skills/en/<filename>.txt
```

## Scope di questo spec

Questo documento fissa **solo** la struttura del modulo. Non contiene:

- bozze o scalette di singole lezioni (ciascuna lezione avrà il suo
  brief nella sessione di scrittura),
- decisioni sulla sidebar di `astro.config.mjs` (sarà aggiornata quando
  la prima lezione di `everyday-use` atterra),
- aggiornamenti a `start-here.mdx` e a `index.mdx` (la card "Uso già
  ChatGPT…" passa da `comingSoon: true` a linkata quando il modulo è
  parzialmente pubblicabile).

Questi punti faranno parte del piano di implementazione (prossimo
passo: skill `writing-plans`).

## Decisioni aperte, non bloccanti

- **Ordine di scrittura delle 8 lezioni** (diverso dall'ordine pedagogico):
  da decidere nel piano di implementazione. Ipotesi: scrivere prima
  quelle `principiante` che costruiscono sui Fondamenti (1, 2), poi 3 e 4
  (alto valore, basso sforzo), infine 5-8.
- **Traduzione EN**: per il Modulo 1 è stata fatta a modulo concluso.
  Per Uso quotidiano la stessa logica è probabile, ma si decide lezione
  per lezione nel piano di implementazione.
