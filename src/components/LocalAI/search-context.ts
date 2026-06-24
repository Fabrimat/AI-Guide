/**
 * Pulls relevant excerpts from OTHER lessons via the Pagefind index
 * (same index Starlight search uses). Pagefind only exists in a built
 * site; in dev or on error this fails soft to an empty list.
 */
export interface LessonExcerpt {
  title: string;
  url: string;
  excerpt: string;
}

interface PagefindSubResult { url: string; title: string; excerpt: string }
interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results?: PagefindSubResult[];
}
interface PagefindResult { id: string; data: () => Promise<PagefindResultData> }
interface PagefindModule {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
  options?: (o: Record<string, unknown>) => void;
  init?: () => Promise<void>;
}

let pagefindPromise: Promise<PagefindModule | null> | null = null;

function loadPagefind(): Promise<PagefindModule | null> {
  if (pagefindPromise) return pagefindPromise;
  pagefindPromise = (async () => {
    try {
      const base = (import.meta.env.BASE_URL as string).replace(/\/$/, '');
      const url = `${base}/pagefind/pagefind.js`;
      const mod = (await import(/* @vite-ignore */ url)) as PagefindModule;
      mod.options?.({ baseUrl: base + '/' });
      await mod.init?.();
      return mod;
    } catch {
      return null; // dev or missing index
    }
  })();
  return pagefindPromise;
}

function stripMarks(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export async function searchOtherLessons(
  query: string,
  _locale: string,
  opts: { limit?: number; currentPath?: string } = {},
): Promise<LessonExcerpt[]> {
  const limit = opts.limit ?? 3;
  const mod = await loadPagefind();
  if (!mod) return [];
  try {
    const { results } = await mod.search(query);
    const top = results.slice(0, limit + 2);
    const data = await Promise.all(top.map((r) => r.data()));
    return data
      .filter((d) => !opts.currentPath || !d.url.startsWith(opts.currentPath))
      .slice(0, limit)
      .map((d) => ({
        title: d.meta?.title || d.url,
        url: d.url,
        excerpt: stripMarks(d.excerpt),
      }));
  } catch {
    return [];
  }
}
