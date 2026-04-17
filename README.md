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
│       ├── index.mdx               # landing (italiano)
│       ├── inizia-qui.md           # pagina di orientamento
│       ├── fondamenti/             # sezione "Fondamenti"
│       │   └── cos-e-un-llm.mdx
│       └── en/                     # traduzioni inglesi (stesso albero)
│           └── ...                 # attualmente vuoto: fallback automatico in italiano
├── components/
│   ├── EsercizioLLM.astro          # riquadro "esercizio con la tua IA"
│   └── Head.astro                  # override per abilitare le view transitions
├── styles/custom.css
└── content.config.ts
public/
└── skills/                         # file .md serviti staticamente (prompt per gli LLM)
    └── primo-esercizio.md
```

## Aggiungere una lezione

1. Crea un file `.md` (o `.mdx` se vuoi usare componenti) dentro `src/content/docs/<sezione>/`.
2. Frontmatter minimo:
   ```yaml
   ---
   title: Titolo della lezione
   description: Una frase che descrive la lezione
   ---
   ```
3. Se la lezione ha un esercizio pratico:
   - crea il prompt in `public/skills/nome-esercizio.md`
   - nel file `.mdx` della lezione, importa e usa il componente:
     ```mdx
     import EsercizioLLM from '../../../components/EsercizioLLM.astro';

     <EsercizioLLM titolo="..." file="nome-esercizio.md" descrizione="..." />
     ```

## Tradurre una lezione

Il sito è multilingua (attualmente italiano + inglese configurato, traduzioni da fare).

Per tradurre una pagina, replica il percorso sotto `src/content/docs/en/`:

```
src/content/docs/inizia-qui.md           → src/content/docs/en/inizia-qui.md
src/content/docs/fondamenti/cos-e-un-llm.mdx → src/content/docs/en/fondamenti/cos-e-un-llm.mdx
```

Le pagine non tradotte ricadono automaticamente sul contenuto in italiano: nessun
errore di build, nessun link rotto. Il selettore di lingua appare nell'header e
preserva la pagina corrente al cambio di lingua.

Per aggiungere una nuova lingua: aggiungere la voce in `astro.config.mjs > locales` e
creare la cartella corrispondente in `src/content/docs/<codice-lingua>/`.
