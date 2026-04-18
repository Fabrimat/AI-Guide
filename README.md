# AI-Guide

Sito pubblico che insegna a usare l'IA, dalle basi al livello avanzato, in modo semplice e lineare.

Integrazione con l'IA lato utente: ogni esercizio pratico è un file `.md` che l'utente
copia/scarica e incolla nel proprio LLM (Claude, ChatGPT, Gemini, ecc.). Niente backend LLM.

## Stack

- [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) (sito statico)
- Contenuti scritti in Markdown / MDX
- Hosting: statico, deploy su qualsiasi CDN (GitHub Pages, Cloudflare Pages, Netlify, Vercel…)

## Comandi

```bash
npm install       # installa le dipendenze
npm run dev       # avvia il dev server su http://localhost:4321
npm run build     # genera il sito statico in ./dist
npm run preview   # serve localmente ./dist (per verificare la build)
```

## Struttura dei contenuti

```
src/
├── content/
│   └── docs/
│       ├── it/                     # italiano: servito sotto /it/
│       │   ├── index.mdx
│       │   ├── inizia-qui.md
│       │   └── fondamenti/
│       │       ├── cos-e-l-ia.mdx
│       │       └── ... (altre lezioni)
│       └── en/                     # inglese: servito sotto /en/
│           └── ...                 # attualmente vuoto: fallback automatico all'italiano
├── components/
│   ├── ChatDemo.astro              # demo animata di una conversazione utente/IA
│   ├── EsercizioLLM.astro          # riquadro "esercizio con la tua IA"
│   └── Head.astro                  # override per abilitare le view transitions
├── styles/custom.css
└── content.config.ts
public/
└── skills/                         # file .txt serviti staticamente (istruzioni per gli LLM)
    └── primo-esercizio.txt
```

Tutte le lingue hanno prefisso URL uniforme (`/it/...`, `/en/...`). La root `/`
fa redirect verso la lingua di default (`/it/`).

## Aggiungere una lezione

1. Crea un file `.md` (o `.mdx` se vuoi usare componenti) dentro `src/content/docs/it/<sezione>/`.
2. Frontmatter minimo:
   ```yaml
   ---
   title: Titolo della lezione
   description: Una frase che descrive la lezione
   livello: principiante   # oppure: intermedio | avanzato
   ---
   ```
3. Se la lezione ha un esercizio pratico:
   - crea il file di istruzioni in `public/skills/nome-esercizio.txt` (plain text, niente markdown)
   - nel file `.mdx` della lezione, importa e usa il componente:
     ```mdx
     import EsercizioLLM from '../../../../components/EsercizioLLM.astro';

     <EsercizioLLM titolo="..." file="nome-esercizio.md" descrizione="..." />
     ```
   Il numero di `../` dipende dalla profondità della lezione. Per una lezione a
   due livelli di profondità (`docs/it/sezione/lezione.mdx`) sono quattro.

## Componenti riutilizzabili

### `<ChatDemo>`

Mostra una conversazione utente/IA animata (typewriter + dots di "thinking").
Sostituisce le GIF di esempio.

```mdx
import ChatDemo from '../../../../components/ChatDemo.astro';

<ChatDemo
  user="La tua domanda all'IA"
  ai={`La risposta dell'IA. Supporta più paragrafi
con i normali a-capo nel template literal.`}
/>
```

Props opzionali: `typingSpeed` (ms/char, default 28), `thinkingTime` (ms,
default 900), `autoPlay` (default true), `loop` (default false), `loopDelay`
(default 3500), `userLabel` ("Tu"), `aiLabel` ("IA"), `showReplay` (default
true). L'animazione parte quando il componente entra in viewport. Rispetta
`prefers-reduced-motion` (rendering statico) ed è no-JS friendly (mostra il
testo finale).

### `<EsercizioLLM>`

Già documentato sopra ("Aggiungere una lezione", punto 3).

## Tradurre una lezione

Per tradurre una pagina, replica il percorso sotto `src/content/docs/en/`:

```
src/content/docs/it/inizia-qui.md               → src/content/docs/en/inizia-qui.md
src/content/docs/it/fondamenti/cos-e-l-ia.mdx        → src/content/docs/en/fondamenti/cos-e-l-ia.mdx
```

Le pagine non tradotte ricadono automaticamente sul contenuto nella lingua di
default (italiano): nessun errore di build, nessun link rotto. Il selettore di
lingua appare nell'header e preserva la pagina corrente al cambio.

Per aggiungere una nuova lingua: aggiungere la voce in `astro.config.mjs > locales`
e creare la cartella corrispondente in `src/content/docs/<codice-lingua>/`.
