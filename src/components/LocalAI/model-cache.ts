/**
 * Per-model cache status + deletion, lazily importing web-llm's cache helpers
 * so nothing AI-related loads before consent. Status: active (the loaded
 * model), cached (downloaded, in browser cache), idle (not downloaded).
 */
export type CacheStatus = 'active' | 'cached' | 'idle';

export async function getStatuses(
  modelIds: string[],
  activeId: string | null,
): Promise<Record<string, CacheStatus>> {
  const result: Record<string, CacheStatus> = {};
  let has: ((id: string) => Promise<boolean>) | null = null;
  try {
    const mod = await import('@mlc-ai/web-llm');
    has = mod.hasModelInCache as (id: string) => Promise<boolean>;
  } catch {
    has = null;
  }
  await Promise.all(
    modelIds.map(async (id) => {
      if (id === activeId) { result[id] = 'active'; return; }
      if (!has) { result[id] = 'idle'; return; }
      try { result[id] = (await has(id)) ? 'cached' : 'idle'; }
      catch { result[id] = 'idle'; }
    }),
  );
  return result;
}

export async function deleteModel(modelId: string): Promise<void> {
  const mod = await import('@mlc-ai/web-llm');
  const del = mod.deleteModelAllInfoInCache as (id: string) => Promise<void>;
  await del(modelId);
}
