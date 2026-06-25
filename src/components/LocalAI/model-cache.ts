/**
 * Per-model cache status + deletion for Transformers.js models. Transformers.js
 * stores downloaded model files in the browser Cache API (cache name
 * 'transformers-cache'); there is no hasModelInCache helper, so we inspect that
 * cache: a model is "cached" if at least one entry's URL contains its id.
 */
export type CacheStatus = 'active' | 'cached' | 'idle';

const CACHE_NAME = 'transformers-cache';

async function cachedIds(modelIds: string[]): Promise<Set<string>> {
  const present = new Set<string>();
  try {
    if (!('caches' in self)) return present;
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const urls = keys.map((r) => r.url);
    for (const id of modelIds) {
      if (urls.some((u) => u.includes(id))) present.add(id);
    }
  } catch {
    /* cache unavailable: treat all as not cached */
  }
  return present;
}

export async function getStatuses(
  modelIds: string[],
  activeId: string | null,
): Promise<Record<string, CacheStatus>> {
  const present = await cachedIds(modelIds);
  const result: Record<string, CacheStatus> = {};
  for (const id of modelIds) {
    result[id] = id === activeId ? 'active' : present.has(id) ? 'cached' : 'idle';
  }
  return result;
}

export async function deleteModel(modelId: string): Promise<void> {
  try {
    if (!('caches' in self)) return;
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    await Promise.all(
      keys.filter((r) => r.url.includes(modelId)).map((r) => cache.delete(r)),
    );
  } catch {
    /* ignore */
  }
}
