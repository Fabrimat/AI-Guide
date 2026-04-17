---
name: integrate-questions
description: Prende una pagina del manuale e una lista di domande del lettore (tipicamente generate da `analyze-lesson`) e propone come integrarle nel testo. Per ogni domanda decide se la risposta va inline (riscrittura del paragrafo), come tip/callout, o in una sezione FAQ a fine pagina. Mostra un piano di modifiche in diff prima di applicarle.
---

# Skill: integrate-questions

Trasforma una lista di domande aperte in **modifiche concrete alla pagina**.
Ogni domanda diventa o una riscrittura inline, o un callout, o una voce FAQ.
Il principio: **risposte dove servono, non in appendice rimossa dal contesto**.

## Quando usare questa skill

- Subito dopo `analyze-lesson`, sulla stessa pagina, usando il file di domande generato.
- Quando l'utente ha domande proprie raccolte da feedback di lettori reali.
- Per integrare FAQ in pagine esistenti.

## Input

- **Path della pagina** da modificare (relativo alla root, es. `src/content/docs/fondamenti/cos-e-un-llm.mdx`).
- **Path del file di domande** (default: cerca `analysis/<slug>.questions.md`).
  In alternativa, l'utente può passare le domande direttamente nel prompt.

Esempio di invocazione:
```
/integrate-questions src/content/docs/fondamenti/cos-e-un-llm.mdx
/integrate-questions src/content/docs/fondamenti/cos-e-un-llm.mdx analysis/cos-e-un-llm.questions.md
```

## Processo

### 1. Caricare contesto

Leggi:

- La pagina target (intera, con frontmatter).
- Il file di domande (se esiste) o le domande passate inline.
- `.claude/skills/voice-guide/SKILL.md` (per rispettare lo stile durante le riscritture).

### 2. Triage delle domande: dove va la risposta?

Per ogni domanda, decidi una delle 4 strategie:

#### A. Inline (riscrittura locale)
La domanda riguarda un punto specifico del testo che va rivisto **dove è**.
Tipicamente domande `[termine]`, `[perché]` brevi, `[differenza]` brevi.
La risposta diventa una frase o due aggiunte/modificate nel paragrafo originale.

#### B. Callout / Tip / Note
La domanda è importante ma "laterale": la risposta arricchisce ma non è la spina dorsale del paragrafo.
Tipicamente domande `[caso-limite]`, `[verifica]`, `[esempio]` brevi.
Diventa un blocco Starlight, ad esempio:
```mdx
:::tip[Come capire se hai fatto bene]
Risposta concreta in 1-3 frasi.
:::
```
oppure:
```mdx
:::note[Caso particolare]
Cosa succede se...
:::
```
oppure `:::caution[…]:::` per avvertenze, `:::danger[…]:::` per errori comuni gravi.

#### C. Esempio aggiunto
La domanda è `[esempio]` o `[come]` e richiede un caso pratico più articolato.
Aggiungi un mini-esempio (codice, prompt, dialogo) inline nella sezione pertinente.

#### D. FAQ a fine pagina
La domanda è interessante ma non si incastra naturalmente nel flusso.
Va in una sezione `## Domande frequenti` a fine pagina (prima dell'eventuale "Cosa viene dopo").
Tipicamente domande `[caso-limite]` di nicchia, `[differenza]` con concetti collaterali,
o domande "what if" che il flusso principale non vuole interrompere.

**Regola di triage**: preferire A/B/C a D. La FAQ in coda è l'ultima opzione, non la prima.
Una pagina dovrebbe poter rispondere a 70-80% delle domande nel flusso principale.
La FAQ è per il restante 20-30%.

### 3. Applicare regole specifiche del manuale

- **Mantenere il livello dichiarato**. Se la pagina è `principiante`, le risposte non possono usare termini avanzati senza spiegarli.
- **Mantenere la lunghezza nel range**. Se le integrazioni portano la pagina sopra 1200 parole, valutare se splittare alcune risposte in una nuova lezione collegata.
- **Niente em dash, niente pattern AI**. Riferimento `.claude/skills/voice-guide/SKILL.md`.
- **Le risposte sono parte della voce della pagina**, non note di un'altra persona. Tono coerente.

### 4. Produrre il piano di modifiche

Prima di toccare il file, produci un piano in chat strutturato così:

```markdown
## Piano modifiche per {{path}}

Lette {{N}} domande. Triage:
- Inline: {{n}}
- Callout: {{n}}
- Esempio: {{n}}
- FAQ: {{n}}
- Saltate: {{n}} (con motivo)

### Modifica 1 (Inline)
Sezione: "{{H2 di riferimento}}"
Domanda: "{{testo domanda}}"
Strategia: inline rewrite

DA:
> paragrafo originale

A:
> paragrafo riscritto

### Modifica 2 (Callout)
Sezione: "{{H2}}"
Domanda: "{{testo domanda}}"
Strategia: aggiungere :::tip dopo paragrafo X

DA: (nessuna modifica al paragrafo)
A:
```mdx
:::tip[Titolo callout]
Risposta in 1-3 frasi.
:::
```

### Modifica 3 (FAQ)
...

### Domande saltate
- "{{domanda}}", motivo: già risposta nella sezione X, oppure fuori scope per livello, ecc.
```

### 5. Conferma e applicazione

**Aspettare conferma esplicita dell'utente** prima di modificare il file.

L'utente può:
- approvare tutto come proposto
- chiedere modifiche al piano (cambiare strategia, riformulare, scartare alcune)
- approvare solo un sottoinsieme

Solo dopo l'OK, applicare le modifiche al file con `Edit` (o `Write` se la diff è massiccia).

### 6. Post-modifica

- Aggiungere/aggiornare la sezione `## Domande frequenti` se sono state aggiunte FAQ.
- Verificare che il frontmatter sia ancora valido.
- (Opzionale) Suggerire all'utente di lanciare `style-checker` sulla pagina modificata per un pass di QA.
- (Opzionale) Rinominare il file di domande in `analysis/<slug>.questions.applied.md` per tracciare che è stato consumato.

## Pattern Markdown per i blocchi Starlight

Riferimento rapido per i callout (sintassi MDX di Starlight):

```mdx
:::note[Titolo opzionale]
Contenuto.
:::

:::tip
Suggerimento utile.
:::

:::caution[Attenzione]
Cosa fare attenzione a.
:::

:::danger[Errore comune]
Cosa NON fare.
:::
```

Tutti supportano titolo opzionale tra parentesi quadre dopo il tipo.

## Regole

- **Mai inventare contenuto**. Se non sai la risposta a una domanda, segnalalo
  all'utente nel piano: "questa domanda richiede input dell'esperto, non ho
  basi sufficienti per rispondere".
- **Mai aumentare il livello richiesto** dalla pagina. Se devi usare un termine
  più avanzato per rispondere, o lo spieghi inline, o sposti la risposta in una
  lezione di livello più alto e linki da qui.
- **Mai produrre una FAQ-fiume**. Più di 5-6 voci FAQ in una pagina è un segnale
  che la pagina principale risponde male: ripensare il triage prima.
- **Mai pattern AI nelle risposte**. Le risposte sono testo del manuale a tutti
  gli effetti.
- **Sempre mostrare il piano prima di applicare**. Non modificare il file senza OK.
