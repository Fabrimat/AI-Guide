/**
 * Per-lesson conversation persistence in localStorage. Each lesson path has
 * its own thread, capped to the last 50 messages. All access is guarded so a
 * disabled/full localStorage never breaks the chat.
 */
export type ChatMsg = { role: 'user' | 'assistant'; content: string };

const PREFIX = 'aiguide:localai:chat:';
const MAX = 50;

export function historyKey(pathname: string): string {
  return PREFIX + pathname.replace(/\/+$/, '') + '/';
}

export function loadHistory(pathname: string): ChatMsg[] {
  try {
    const raw = localStorage.getItem(historyKey(pathname));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMsg =>
        m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    );
  } catch {
    return [];
  }
}

export function saveHistory(pathname: string, msgs: ChatMsg[]): void {
  try {
    localStorage.setItem(historyKey(pathname), JSON.stringify(msgs.slice(-MAX)));
  } catch {
    /* quota or unavailable: ignore */
  }
}

export function clearHistory(pathname: string): void {
  try {
    localStorage.removeItem(historyKey(pathname));
  } catch {
    /* ignore */
  }
}
