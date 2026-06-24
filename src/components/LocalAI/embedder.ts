/**
 * Lazy in-browser text embedder (Transformers.js, multilingual-e5-small).
 * The library + model load only when embedQuery is first called, which only
 * happens inside the assistant's chat-send path (post-consent). Runs on the
 * default WASM backend so it does not contend with web-llm's WebGPU use.
 */
import type { FeatureExtractionPipeline } from '@huggingface/transformers';

export const EMBED_MODEL_ID = 'Xenova/multilingual-e5-small';

let pipePromise: Promise<FeatureExtractionPipeline> | null = null;

function getPipe(): Promise<FeatureExtractionPipeline> {
  if (pipePromise) return pipePromise;
  pipePromise = (async () => {
    const { pipeline } = await import('@huggingface/transformers');
    return pipeline('feature-extraction', EMBED_MODEL_ID);
  })();
  return pipePromise;
}

/** Embed a query with the e5 `query: ` prefix; returns a normalized vector. */
export async function embedQuery(text: string): Promise<Float32Array> {
  const pipe = await getPipe();
  const output = await pipe('query: ' + text, { pooling: 'mean', normalize: true });
  return output.data as Float32Array;
}

/** Cosine similarity. Inputs are L2-normalized, so this is the dot product. */
export function cosineSim(a: Float32Array, b: Float32Array | number[]): number {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * (b[i] as number);
  return dot;
}
