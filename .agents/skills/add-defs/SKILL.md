---
name: add-defs
description: Aggiunge tooltip `<Def>` inline alle parole tecniche di una lezione del manuale AI-Guide, in tutte le lingue disponibili. Da usare ogni volta che hai una lezione esistente (o appena scritta) e vuoi che termini come `LLM`, `prompt`, `allucinazione`, `contesto`, `modello` mostrino una breve definizione al click o all'hover, senza che il lettore debba aprire il Glossario. Lavora simmetricamente sulle versioni IT, EN e ogni altra lingua mirror trovata sotto `src/content/docs/<lang>/`, sceglie solo le prime occorrenze di termini non già spiegati dal paragrafo immediato, e mostra un piano da confermare prima di toccare i file. Invocare anche quando l'utente dice "arricchisci la lezione", "aggiungi tooltip ai termini", "definisci i termini difficili", "annota la pagina con Def".
---

# Skill: add-defs

Arricchisce una lezione del manuale AI-Guide con tooltip inline `<Def>`
sui termini più tecnici, lavorando in parallelo su tutte le lingue
disponibili. Il componente `<Def>` mostra una breve spiegazione al
passaggio del mouse o al click, senza far lasciare la pagina al
lettore.

## Quando usare questa skill

- Subito dopo aver scritto una nuova lezione, prima di pubblicarla, per
  catturare i termini tecnici che il lettore al livello dichiarato
  potrebbe non conoscere.
- Su lezioni esistenti, quando si introduce per la prima volta il
  pattern `<Def>` (come è successo sul modulo Fondamenti).
- Per uniformare lo stile fra lezioni: stessa densità di tooltip,
  stesso registro nelle definizioni.

Non usare questa skill su:

- Pagine meta (About, Privacy, Glossary stesso, Start-here): non sono
  lezioni didattiche e non hanno il livello dichiarato.
- Frammenti di testo isolati: la skill ha bisogno della lezione intera
  per capire quali termini sono già spiegati dal contesto.

## Input

Argomento richiesto: **path di una lezione** (in qualsiasi lingua
disponibile), relativo alla root del repo.

Esempio di invocazione:

```
/add-defs src/content/docs/it/fundamentals/what-is-ai.mdx
```

Argomenti opzionali (non implementati come flag, ma chiedi all'utente
se vuole derogare dal default):

- numero massimo di Def da aggiungere (default: dipende dalla densità
  di termini tecnici, tipicamente 2-4, vedi sotto).
- lingue da escludere (default: tutte quelle che hanno il file
  mirror).

## Processo

### 1. Scoprire le lingue disponibili

Dato il path passato, calcola lo "slug interno" della lezione
strippando il prefisso lingua. Esempio:

- Input: `src/content/docs/it/fundamentals/what-is-ai.mdx`
- Slug interno: `fundamentals/what-is-ai.mdx`

Poi fai un `ls src/content/docs/` per scoprire quali lingue esistono
nel progetto (oggi `it/` e `en/`, in futuro potrebbero essercene
altre). Per ogni lingua, verifica se esiste il file mirror:

```
src/content/docs/<lang>/<slug-interno>
```

La lista finale di file mirror sono le lingue da gestire. Se solo una
lingua è presente, va bene comunque: la skill lavora anche su lezioni
che non hanno (ancora) traduzione.

### 2. Caricare il contesto editoriale

Leggi:

- Tutti i file mirror identificati al passo 1.
- I file Glossary delle stesse lingue (`src/content/docs/<lang>/glossary.mdx`).
  Le voci del Glossary sono la fonte primaria per scegliere quali
  termini meritano un Def e per calibrare la lunghezza/tono delle
  spiegazioni.
- Il componente `src/components/Def.astro` per ricordare l'API
  (`explanation` come prop testuale, termine come slot).
- La voice guide in `.Codex/skills/voice-guide/SKILL.md` (no em
  dash, no AI buzzword italiani, tono coerente con il manuale).

### 3. Identificare i termini candidati

Lavora su una **lingua source** (preferibilmente IT, perché è la
lingua primaria del manuale e di solito la più curata). Scorri il
testo della lezione cercando termini che soddisfano TUTTI questi
criteri:

1. **Sono nel Glossary** della stessa lingua, oppure sono termini
   tecnici riconoscibili usati casualmente nella lezione (es. nomi
   propri di prodotti, parole tecniche specifiche del dominio).
2. **Compaiono per la prima volta** in quel punto del testo. Le
   occorrenze successive non vanno annotate (sarebbe rumore).
3. **Il paragrafo che le contiene non le spiega già**. Se la frase
   stessa o le 1-2 frasi adiacenti definiscono il termine, il Def
   sarebbe ridondante. Salta.
4. **Non sono il termine principale della lezione**. Es. nella
   lezione "Cos'è un prompt?" non si annota "prompt": tutta la
   lezione è la definizione di prompt.

### 4. Decidere quanti Def aggiungere

Non c'è un numero fisso. Linea guida pratica:

- Lezioni con poca terminologia tecnica (es. una lezione molto
  pratica): **1-2 Def**.
- Lezioni di teoria che introducono più concetti: **3-4 Def**.
- Massimo morbido: **5 Def**. Oltre, l'effetto è di "macchia di
  inchiostro tratteggiato" e infastidisce più che aiutare.

Se hai più candidati di quanti ne stai per aggiungere, prioritizza
quelli che:

- Hanno una voce dedicata nel Glossary (massima coerenza).
- Vengono riusati in più lezioni del modulo (pagano l'investimento).
- Compaiono presto nella lezione (il lettore beneficia subito).

### 5. Mappare termini sulle lingue mirror

Per ciascun termine scelto, identifica il **termine equivalente** in
ciascuna lingua mirror. Esempio: `IA` (IT) → `AI` (EN), `prompt` (IT)
→ `prompt` (EN), `allucinazione` (IT) → `hallucination` (EN). Il
Glossary in ciascuna lingua è il dizionario di riferimento.

Per la **posizione** del Def nel testo mirror: trova la prima
occorrenza del termine equivalente nella lezione mirror, dentro la
stessa sezione concettuale. Le lezioni del manuale sono strutturate
con corrispondenza fedele paragrafo per paragrafo, quindi nella
pratica il termine equivalente si trova nello stesso paragrafo
relativo. Se non lo trovi (lezione divergente), segnalalo nel piano
e proponi una posizione approssimata.

### 6. Scrivere le spiegazioni

Per ogni termine, scrivi una spiegazione **per ogni lingua**.

Linea guida per la spiegazione:

- **Lunghezza**: 90-180 caratteri. Sotto i 90 sembra povera; sopra i
  180 il popover diventa troppo denso.
- **Stile**: derivata dalla voce del Glossary di quella lingua,
  compressa a 1-2 frasi. Stesso tono, stesse parole chiave, niente
  fatti nuovi.
- **No markup**: il prop `explanation` è testo puro. Niente bold,
  niente link, niente codice inline. Se ti serve markup, dillo
  all'utente: rinegoziamo il componente con uno slot.
- **No em dash** (regola generale del progetto).
- **Coerenza fra lingue**: la spiegazione IT e quella EN devono dire
  la stessa cosa, non una versione amplificata o ridotta dell'altra.

### 7. Mostrare il piano e attendere conferma

Prima di toccare i file, presenta un piano in chat. Formato:

```markdown
## Piano `add-defs` per `<slug-interno>`

Lingue trovate: it, en (e altre se presenti).
Glossary di riferimento: `src/content/docs/it/glossary.mdx` + mirror.

Termini scelti: N (su M candidati totali).

### Def 1 di N

**Termine**: `IA` (it) / `AI` (en)
**Sezione**: "{H2 di riferimento}"
**Citazione**: "...Le IA conversazionali come ChatGPT..."
**Spiegazione (it)**: "Programmi capaci di fare cose che prima richiedevano una persona: capire un testo, riconoscere una voce. Qui parliamo di IA conversazionali."
**Spiegazione (en)**: "Programs that do things that used to require a person: understanding text, recognising a voice. We focus on conversational AIs here."

### Def 2 di N
...

### Candidati scartati

- `LLM`: già definito in modo esteso nella sezione finale della
  lezione, Def sarebbe ridondante.
- `freemium`: definito in callout `:::note` poco sotto.
```

Aspetta che l'utente:

- approvi tutto come proposto;
- chieda di modificare un sottoinsieme (riformulare una spiegazione,
  cambiare un termine, aggiungere/togliere una Def);
- approvi solo un sottoinsieme.

### 8. Applicare le modifiche

Solo dopo l'OK, modifica i file. Su quante lingue ci sono e quante
Def vanno aggiunte, **valuta se delegare a subagent paralleli**:

- 2 lingue × pochi Def: applica direttamente.
- 3+ lingue oppure più di 5 Def per lingua: delega a un subagent per
  lingua, in parallelo. Ogni subagent riceve la lista termini +
  spiegazioni per la sua lingua e applica le `Edit` localmente.
  Vantaggi: parallelismo, isolamento del context, riduzione errori
  di mismatch fra lingue.

Per ogni file mirror, le modifiche da applicare sono:

1. Aggiungere l'`import Def` dopo gli altri import nel frontmatter:
   ```mdx
   import Def from '../../../../components/Def.astro';
   ```
   (Il path è `../../../../components/Def.astro` per lezioni a
   `src/content/docs/<lang>/<sezione>/<slug>.mdx`.)

2. Per ciascun termine, sostituire l'occorrenza con il wrapper:
   ```mdx
   prima: ...le IA conversazionali...
   dopo:  ...le <Def explanation="...">IA</Def> conversazionali...
   ```

   Se il termine compare più volte nel testo, l'Edit deve colpire
   solo la prima occorrenza. Usa `replace_all: false` (il default) e
   includi abbastanza contesto nel `old_string` da rendere il match
   univoco.

### 9. Verifica finale

Dopo aver applicato le modifiche:

- Lancia `npm run build`. Se fallisce, leggi l'errore e rivedi le
  Edit. Errori tipici:
  - Importpath sbagliato (controlla la profondità relativa).
  - Caratteri speciali nel prop `explanation` non escapati (es.
    virgolette doppie). Usa virgolette singole o l'apostrofo HTML.
  - Mismatched JSX (parentesi `<Def>...</Def>` non bilanciate).
- Riepiloga in chat: numero di Def aggiunte per lingua, file
  modificati, eventuali avvertimenti.

## Regole di stile per la skill

Anche le spiegazioni che produci sono parte della voce del manuale e
devono rispettare la voice guide:

- Niente em dash.
- Niente lessico AI italiano vietato (`panorama`, `cruciale`,
  `sinergia`, `mindset`, `strategico`, `paradigmatico`, ecc.).
- Niente formule burocratiche (`al fine di`, `in merito a`).
- Tono coerente con la lezione: né più formale né più ammiccante.
- In italiano: dare del "tu" al lettore, frasi brevi, parole
  comprensibili.
- In inglese: stesso registro, stesso target di lettore (principianti
  non tecnici).

Se hai dubbi sulla formulazione di una spiegazione, pesca dal
Glossary la frase più adatta e compriminila. Mai inventare definizioni
nuove: la consistenza fra Glossary e Def è la cosa più importante.

## Cosa NON fare

- **Non modificare i file senza prima mostrare il piano.** Anche se la
  lezione ha solo un termine candidato, fai il giro completo (piano,
  conferma, applicazione).
- **Non aggiungere Def su pagine non-lezione** (About, Privacy,
  Glossary, Start-here, 404, index). Se il path passato corrisponde a
  una di queste, segnalalo all'utente e fermati.
- **Non aggiungere Def su un termine spiegato dal paragrafo
  adiacente.** È il singolo errore più frequente e infastidisce il
  lettore: leggi la spiegazione, poi vede subito sotto la stessa cosa
  scritta meglio.
- **Non aggiungere più di una Def sullo stesso termine** nella stessa
  lezione. Solo prima occorrenza.
- **Non superare i 180 caratteri** nelle spiegazioni. Se il termine
  richiede più spazio, è un candidato per il Glossary, non per il Def.
- **Non rompere la simmetria fra lingue.** Se aggiungi una Def in IT,
  l'analoga in EN deve esserci. Se non riesci a trovare il termine
  equivalente nella lingua mirror, segnala il problema e chiedi
  all'utente come procedere.
- **Non usare un termine inventato come `explanation`.** Solo testo
  che potrebbe essere stato preso dal Glossary o dalla lezione stessa.

## Riferimenti

- Componente: `src/components/Def.astro`
- Voce nel catalogo: `AGENTS.md` sezione `<Def>`
- Glossary: `src/content/docs/<lang>/glossary.mdx`
- Voice guide: `.Codex/skills/voice-guide/SKILL.md`
- Skill correlata: `analyze-lesson` (identifica buchi di
  comprensione, complementare ad add-defs).
- Skill correlata: `integrate-questions` (pattern di "piano →
  conferma → applicazione" da cui add-defs eredita lo stile).
