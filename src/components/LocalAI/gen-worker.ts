/**
 * Web Worker running a Transformers.js text-generation pipeline, so inference
 * never blocks the UI thread. Protocol (main -> worker):
 *   { type:'load', modelId, dtype }         -> 'progress'{pct}... then 'ready' | 'error'{message}
 *   { type:'generate', id, messages, opts }  -> 'token'{id,text}... then 'done'{id,full} | 'error'{id,message}
 *     NOTE: token.text is the CUMULATIVE running text so far (a snapshot, not a per-chunk delta).
 *     Consumers must assign it directly — do NOT accumulate on top of it.
 *   { type:'dispose' }
 */
import {
  pipeline,
  TextStreamer,
  type TextGenerationPipeline,
  type ProgressInfo,
} from '@huggingface/transformers';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
type GenOpts = {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  repetition_penalty?: number;
};
type InMessage =
  | { type: 'load'; modelId: string; dtype: string }
  | { type: 'generate'; id: number; messages: ChatMessage[]; opts: GenOpts }
  | { type: 'dispose' };

let pipe: TextGenerationPipeline | null = null;
let pipeModelId: string | null = null;

function post(m: unknown): void {
  (self as unknown as Worker).postMessage(m);
}

async function load(modelId: string, dtype: string): Promise<void> {
  if (pipe && pipeModelId === modelId) {
    post({ type: 'ready' });
    return;
  }
  if (pipe) {
    try { await pipe.dispose(); } catch { /* ignore */ }
    pipe = null;
    pipeModelId = null;
  }
  // Aggregate per-file download progress into one 0..100 number.
  const loaded: Record<string, number> = {};
  const total: Record<string, number> = {};
  pipe = (await pipeline('text-generation', modelId, {
    device: 'webgpu',
    // dtype is a per-model string ('q4' | 'q4f16'); cast at this library boundary.
    dtype: dtype as 'q4' | 'q4f16',
    progress_callback: (p: ProgressInfo) => {
      if (p.status === 'progress' && 'file' in p && p.file) {
        loaded[p.file] = (p as { loaded?: number }).loaded ?? 0;
        total[p.file] = (p as { total?: number }).total ?? 0;
        const l = Object.values(loaded).reduce((a, b) => a + b, 0);
        const t = Object.values(total).reduce((a, b) => a + b, 0);
        if (t > 0) post({ type: 'progress', pct: Math.round((l / t) * 100) });
      }
    },
  })) as TextGenerationPipeline;
  pipeModelId = modelId;
  post({ type: 'ready' });
}

async function generate(id: number, messages: ChatMessage[], opts: GenOpts): Promise<void> {
  if (!pipe) {
    post({ type: 'error', id, message: 'Model not loaded' });
    return;
  }
  let full = '';
  const streamer = new TextStreamer(pipe.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (text: string) => {
      full += text;
      post({ type: 'token', id, text: full });
    },
  });
  try {
    await pipe(messages, {
      max_new_tokens: opts.max_new_tokens ?? 360,
      temperature: opts.temperature ?? 0.35,
      top_p: opts.top_p ?? 0.9,
      repetition_penalty: opts.repetition_penalty ?? 1.2,
      do_sample: true,
      streamer,
    });
    post({ type: 'done', id, full });
  } catch (e) {
    post({ type: 'error', id, message: e instanceof Error ? e.message : String(e) });
  }
}

self.onmessage = (e: MessageEvent<InMessage>) => {
  const d = e.data;
  if (d.type === 'load') {
    load(d.modelId, d.dtype).catch((err) =>
      post({ type: 'error', message: err instanceof Error ? err.message : String(err) }),
    );
  } else if (d.type === 'generate') {
    void generate(d.id, d.messages, d.opts);
  } else if (d.type === 'dispose') {
    if (pipe) { try { void pipe.dispose(); } catch { /* ignore */ } }
    pipe = null;
    pipeModelId = null;
  }
};
