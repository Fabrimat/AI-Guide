/**
 * Main-thread wrapper around the Transformers.js generation worker
 * (`gen-worker.ts`). Owns the worker + model lifecycle and exposes a small
 * promise/callback API. Survives Astro view transitions via module-level
 * singletons (page swaps don't reload JS).
 */
export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export interface GenOpts {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  repetition_penalty?: number;
}

let worker: Worker | null = null;
let activeModelId: string | null = null; // loading-or-loaded (dedupe / dispose decisions)
let readyModelId: string | null = null;  // finished loading (UI "active")
let genCounter = 0;

type LoadWaiter = { resolve: () => void; reject: (e: Error) => void; onProgress: (pct: number) => void };
type GenWaiter = { resolve: (full: string) => void; reject: (e: Error) => void; onToken: (full: string) => void };
let loadWaiter: LoadWaiter | null = null;
const genWaiters = new Map<number, GenWaiter>();

function ensureWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('./gen-worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent) => {
    const d = e.data as
      | { type: 'progress'; pct: number }
      | { type: 'ready' }
      | { type: 'token'; id: number; text: string }
      | { type: 'done'; id: number; full: string }
      | { type: 'error'; id?: number; message: string };
    if (d.type === 'progress') {
      loadWaiter?.onProgress(d.pct);
    } else if (d.type === 'ready') {
      readyModelId = activeModelId;
      loadWaiter?.resolve();
      loadWaiter = null;
    } else if (d.type === 'token') {
      genWaiters.get(d.id)?.onToken(d.text);
    } else if (d.type === 'done') {
      genWaiters.get(d.id)?.resolve(d.full);
      genWaiters.delete(d.id);
    } else if (d.type === 'error') {
      const err = new Error(d.message);
      if (d.id != null) {
        genWaiters.get(d.id)?.reject(err);
        genWaiters.delete(d.id);
      } else {
        loadWaiter?.reject(err);
        loadWaiter = null;
      }
    }
  };
  return worker;
}

export function loadModel(
  modelId: string,
  dtype: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  // Already loaded this exact model: nothing to do.
  if (readyModelId === modelId) return Promise.resolve();
  const w = ensureWorker();
  activeModelId = modelId;
  readyModelId = null;
  return new Promise<void>((resolve, reject) => {
    loadWaiter = { resolve, reject, onProgress };
    w.postMessage({ type: 'load', modelId, dtype });
  });
}

export function generate(
  messages: ChatMessage[],
  opts: GenOpts,
  onToken: (full: string) => void,
): Promise<string> {
  if (!worker || !readyModelId) return Promise.reject(new Error('No model loaded'));
  const id = ++genCounter;
  return new Promise<string>((resolve, reject) => {
    genWaiters.set(id, { resolve, reject, onToken });
    worker!.postMessage({ type: 'generate', id, messages, opts });
  });
}

export function disposeEngine(): Promise<void> {
  if (worker) {
    try { worker.postMessage({ type: 'dispose' }); } catch { /* ignore */ }
    try { worker.terminate(); } catch { /* ignore */ }
  }
  worker = null;
  activeModelId = null;
  readyModelId = null;
  // Reject any pending waiters so in-flight promises don't hang forever.
  if (loadWaiter) {
    loadWaiter.reject(new Error('Engine disposed'));
    loadWaiter = null;
  }
  for (const waiter of genWaiters.values()) {
    waiter.reject(new Error('Engine disposed'));
  }
  genWaiters.clear();
  return Promise.resolve();
}

export function getReadyModelId(): string | null { return readyModelId; }
export function getActiveModelId(): string | null { return activeModelId; }
