/**
 * Semantic cross-lesson retrieval for the assistant. Loads the static
 * embeddings index (built at postbuild) for the current locale, embeds the
 * query in the browser, and returns the top distinct lessons by cosine
 * similarity. Fails soft to [] when the index is missing (dev) or the
 * embedder cannot load, so the assistant simply answers from lesson context.
 *
 * Note: Pagefind is no longer used here; it still powers the Ctrl+K site
 * search in Search.astro.
 */
import { embedQuery, cosineSim } from './embedder';

export interface LessonExcerpt {
  title: string;
  url: string;
  excerpt: string;
}

interface IndexChunk {
  url: string;
  title: string;
  heading: string;
  text: string;
  vector: number[];
}
interface EmbeddingIndex {
  model: string;
  dim: number;
  chunks: IndexChunk[];
}

const indexCache = new Map<string, Promise<EmbeddingIndex | null>>();

function loadIndex(locale: string): Promise<EmbeddingIndex | null> {
  const cached = indexCache.get(locale);
  if (cached) return cached;
  const p = (async () => {
    try {
      const base = (import.meta.env.BASE_URL as string).replace(/\/$/, '');
      const res = await fetch(`${base}/embeddings/${locale}.json`);
      if (!res.ok) return null;
      return (await res.json()) as EmbeddingIndex;
    } catch {
      return null; // dev (no index) or fetch error
    }
  })();
  indexCache.set(locale, p);
  return p;
}

export async function searchOtherLessons(
  query: string,
  locale: string,
  opts: { limit?: number; currentPath?: string } = {},
): Promise<LessonExcerpt[]> {
  const limit = opts.limit ?? 3;
  try {
    const index = await loadIndex(locale);
    if (!index || !index.chunks.length) return [];
    const qvec = await embedQuery(query);
    const ranked = index.chunks
      .filter((c) => !opts.currentPath || !c.url.startsWith(opts.currentPath))
      .map((c) => ({ c, score: cosineSim(qvec, c.vector) }))
      .sort((a, b) => b.score - a.score);

    // One excerpt per distinct lesson, best chunk first.
    const seen = new Set<string>();
    const out: LessonExcerpt[] = [];
    for (const { c } of ranked) {
      if (seen.has(c.url)) continue;
      seen.add(c.url);
      out.push({ title: c.title, url: c.url, excerpt: c.text });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return []; // embedder failed to load, etc. — assistant falls back
  }
}
