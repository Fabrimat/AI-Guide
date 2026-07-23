---
name: analyze-lesson
description: Analizza una pagina del manuale AI-Guide simulando un lettore al livello dichiarato (principiante, intermedio, avanzato) e produce una lista strutturata di domande su ciò che potrebbe non essere chiaro. Usa quando hai scritto una bozza di lezione e vuoi verificare se è autoesplicativa per il pubblico target. Output salvabile su disco per essere consumato dalla skill `integrate-questions`.
---

# Skill: analyze-lesson

Simula un lettore al livello dichiarato dalla pagina e genera **domande
realistiche** che quel lettore si farebbe leggendo il testo. Lo scopo è
trovare i punti dove la pagina **assume troppo**, **salta passaggi**,
**non dà esempi**, o **introduce concetti senza spiegarli**.

## Quando usare questa skill

- Dopo aver scritto una bozza di una nuova lezione, prima di pubblicarla.
- Quando una lezione esistente riceve segnalazioni di poca chiarezza.
- Come step di QA periodico sulle pagine `principiante` (le più sensibili).

## Input

Argomento richiesto: **path della pagina** da analizzare (relativo alla root del repo).

Esempio di invocazione:
```
/analyze-lesson src/content/docs/it/fondamenti/<lezione>.mdx
```

Argomento opzionale: **path di output** dove salvare le domande (default:
`analysis/<slug>.questions.md`, dove `<slug>` è il nome del file senza estensione).

## Processo

### 1. Caricare il file e leggere il frontmatter

Leggi il file. Estrai dal frontmatter:

- `title` (obbligatorio)
- `livello` (uno tra `principiante | intermedio | avanzato`)
- `prerequisiti` (opzionale, lista di slug di altre lezioni)

**Se manca `livello`**: chiedi all'utente quale livello assumere prima di procedere. Non procedere con default.

### 2. Definire il profilo del lettore simulato

In base al livello dichiarato, assumi un profilo specifico:

- **principiante**:
  - Zero esperienza pregressa con IA conversazionali (può aver sentito parlare di ChatGPT ma non l'ha usato seriamente).
  - Conosce internet e sa usare un browser, ma non è developer.
  - Non sa cosa sono: token, embedding, parametro, fine-tuning, RAG, agente, MCP, contesto (in senso tecnico), API.
  - Termini come "prompt" sono nuovi e vanno spiegati la prima volta.
  - Si chiede sempre "perché?" e "a cosa mi serve?".

- **intermedio**:
  - Usa regolarmente almeno un'IA conversazionale (Codex, ChatGPT, Gemini).
  - Conosce: cos'è un prompt, cosa sono le allucinazioni, che il modello ha un limite di contesto.
  - Non conosce ancora a fondo: token (ne ha sentito parlare), embedding, RAG, system prompt vs user prompt, structured output, tool use, agenti.
  - È curioso ma non tecnico. Si chiede "come faccio a fare X meglio?".

- **avanzato**:
  - Developer o professionista.
  - Conosce: API REST, JSON, autenticazione, rate limit, contesto in token, system/user/assistant message.
  - Vuole risposte tecniche dirette. Si chiede "quale trade-off?", "perché questa scelta e non quella?".

Considera anche i `prerequisiti`: se la lezione richiede `prerequisiti: [cos-e-l-ia]`, puoi assumere che il lettore abbia già letto quella pagina e quindi conosca il vocabolario lì introdotto.

### 3. Lettura attiva della pagina

Scorri il contenuto come farebbe il lettore simulato. Per ogni paragrafo, sezione o esempio, cerca attivamente:

- **Termini non definiti** che il lettore al livello dichiarato non conosce.
- **Salti logici**: il testo dice "quindi X" ma il "perché" non è esplicito.
- **Esempi mancanti**: la spiegazione è astratta e non ancorata a un caso concreto.
- **Affermazioni senza giustificazione**: il testo afferma qualcosa che il lettore potrebbe trovare controintuitivo o contestabile.
- **"Why" non risposto**: il lettore si chiederebbe "perché funziona così?" o "a cosa mi serve sapere questo?"
- **"How" non risposto**: il lettore si chiederebbe "come faccio in pratica?".
- **Casi limite ovvi non menzionati**: "e se invece...", "ma cosa succede quando...".
- **Confronti impliciti non chiariti**: il testo dice "X è diverso da Y" ma non spiega in cosa.

### 4. Generare le domande

Per ogni problema identificato al passo 3, formula UNA domanda dal punto di vista
del lettore (in italiano, prima persona o impersonale, breve e diretta).

Categorizza ogni domanda con un tag:

- `[termine]`: chiede la definizione di un termine non spiegato
- `[perché]`: chiede una giustificazione o un motivo
- `[come]`: chiede un metodo o un'istruzione operativa
- `[esempio]`: chiede un esempio concreto
- `[differenza]`: chiede la differenza tra due cose
- `[caso-limite]`: chiede cosa succede in un caso non coperto
- `[verifica]`: chiede come capire se ho fatto giusto / se ha funzionato

Indica anche, per ogni domanda, **il riferimento al passaggio del testo**
che la innesca (citazione breve di max 8-10 parole, oppure numero di sezione/paragrafo).

### 5. Output

Produci un file Markdown nel path di output (default `analysis/<slug>.questions.md`)
strutturato così:

```markdown
---
source: src/content/docs/it/fondamenti/<lezione>.mdx
title: Cos'è un LLM?
livello: principiante
generated_at: YYYY-MM-DD
---

# Domande del lettore: {{title}}

Lettore simulato: **{{livello}}**.

## [termine] Termini non definiti

- "Cosa significa esattamente '{{termine}}'?"
  → Innescata da: "{{citazione}}"

## [perché] Domande di motivazione

- "Perché un LLM non ha memoria tra conversazioni?"
  → Innescata da: "{{citazione}}"

## [come] Domande operative

- "Come faccio in pratica a dare più contesto?"
  → Innescata da: "{{citazione}}"

## [esempio] Esempi mancanti

- "Mi puoi mostrare un esempio reale di X?"
  → Innescata da: "{{citazione}}"

## [differenza] Differenze non chiare

- "Qual è la differenza tra X e Y?"
  → Innescata da: "{{citazione}}"

## [caso-limite] Casi non coperti

- "Cosa succede se {{caso}}?"
  → Innescata da: "{{citazione}}"

## [verifica] Come capisco di aver capito

- "Come capisco se ho formulato un buon prompt?"
  → Innescata da: "{{citazione}}"

## Note generali

(Opzionale, 1-3 frasi:) osservazioni sul livello di chiarezza complessivo
della pagina rispetto al pubblico target.
```

Mostra anche un riepilogo in chat:
- Numero totale di domande generate.
- Quante per categoria.
- 2-3 domande "più importanti" (quelle che, se non risposte, lasciano il lettore davvero perso).

### 6. Cosa NON fare

- **Non modificare la pagina**. Questa skill solo analizza e produce domande.
- **Non inventare domande pretestuose** per gonfiare il numero. Meglio 4 domande buone che 15 generiche.
- **Non porre domande che la pagina già risponde**. Rileggere prima di proporre.
- **Non porre domande fuori scope** rispetto al livello (es. domande tecniche da developer su una pagina `principiante`).
- **Non riscrivere la pagina** né suggerire come riscriverla. Quello è compito di `integrate-questions`.

## Regole di stile per il file di output

Anche il file delle domande deve rispettare la voice guide del progetto:

- Nessun em dash.
- Nessun pattern AI nel testo delle domande (le domande devono suonare come quelle che farebbe una persona vera).
- Italiano semplice, frasi brevi.

Se necessario, rileggi `.Codex/skills/voice-guide/SKILL.md` prima di scrivere l'output.
