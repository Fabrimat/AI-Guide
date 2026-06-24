/**
 * Web Worker hosting the web-llm engine, so inference never blocks the
 * UI thread. The handler implements the full engine protocol; the main
 * thread drives it through the CreateWebWorkerMLCEngine proxy.
 */
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg: MessageEvent) => handler.onmessage(msg);
