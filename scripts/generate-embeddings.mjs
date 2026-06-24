// Build-time RAG index generator. Reads lesson MDX sources, chunks by H2,
// embeds each chunk with multilingual-e5-small, and writes a static index
// per locale to dist/embeddings/<locale>.json.
//
// NON-FATAL BY CONTRACT: any failure logs a warning and exits 0, so the
// site build and deploy always succeed even if RAG can't be generated.
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(root, 'src', 'content', 'docs');
const OUT_DIR = join(root, 'dist', 'embeddings');
const LOCALES = ['en', 'it'];
const MODEL_ID = 'Xenova/multilingual-e5-small';
const EMBED_CHARS = 2000; // cap text sent to the model (~512 token budget)
const EXCERPT_CHARS = 500; // cap text stored for the prompt

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(mdx|md)$/.test(e.name)) out.push(p);
  }
  return out;
}

function parseFrontmatter(raw) {
  // Normalize CRLF → LF so the regex works on Windows-checked-out files
  const src = raw.replace(/\r\n/g, '\n');
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const fm = m[1];
  const title = fm.match(/^title:\s*(.+)$/m);
  const livello = fm.match(/^livello:\s*(.+)$/m);
  return {
    data: {
      title: title ? title[1].trim().replace(/^["']|["']$/g, '') : '',
      livello: livello ? livello[1].trim() : '',
    },
    body: src.slice(m[0].length),
  };
}

function stripInline(s) {
  return s
    .replace(/<[^>]+>/g, ' ')               // JSX / HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links -> text
    .replace(/[`*_>#]/g, '')                 // emphasis / code / heading marks
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkLesson(title, body) {
  const cleaned = body
    .replace(/^import\s.+$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const parts = cleaned.split(/^##\s+/m);
  const chunks = [];
  const intro = stripInline(parts[0]);
  if (intro) chunks.push({ heading: title, text: intro });
  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const nl = seg.indexOf('\n');
    const heading = stripInline(nl >= 0 ? seg.slice(0, nl) : seg);
    const text = stripInline(nl >= 0 ? seg.slice(nl + 1) : '');
    if (text) chunks.push({ heading, text });
  }
  return chunks;
}

function urlFor(file) {
  const rel = relative(DOCS, file).replace(/\\/g, '/').replace(/\.(mdx|md)$/, '');
  return '/' + rel + '/';
}

async function main() {
  const { pipeline, env } = await import('@huggingface/transformers');
  env.allowLocalModels = false; // load straight from the HF hub
  const extractor = await pipeline('feature-extraction', MODEL_ID);

  mkdirSync(OUT_DIR, { recursive: true });

  for (const locale of LOCALES) {
    const dir = join(DOCS, locale);
    const files = walk(dir);
    const chunks = [];
    for (const file of files) {
      const raw = readFileSync(file, 'utf8');
      const { data, body } = parseFrontmatter(raw);
      if (!data.livello) continue; // lessons only
      const url = urlFor(file);
      for (const c of chunkLesson(data.title, body)) {
        const embedText = `passage: ${data.title}. ${c.heading}. ${c.text}`.slice(0, EMBED_CHARS);
        const out = await extractor(embedText, { pooling: 'mean', normalize: true });
        const vector = Array.from(out.data, (v) => Math.round(v * 1e5) / 1e5);
        chunks.push({
          url,
          title: data.title,
          heading: c.heading,
          text: c.text.slice(0, EXCERPT_CHARS),
          vector,
        });
      }
    }
    const dim = chunks[0]?.vector.length ?? 0;
    if (chunks.length === 0) {
      console.warn(`[embeddings] ${locale}: no lessons found, writing empty index`);
    }
    const outFile = join(OUT_DIR, `${locale}.json`);
    writeFileSync(outFile, JSON.stringify({ model: MODEL_ID, dim, chunks }));
    console.log(`[embeddings] ${locale}: ${chunks.length} chunks -> ${outFile}`);
  }
}

main().catch((err) => {
  console.warn('[embeddings] skipped (non-fatal):', err?.message || err);
  process.exit(0); // never fail the build
});
