/**
 * AI-Guide · localStorage keys
 *
 * Every key the site writes lives here, so "clear my progress" can find
 * them all. Reader data (progress, answers, notes, chat history) is
 * cleared together; preferences (theme, assisted reading, local AI
 * consent) are kept.
 *
 * Rule: only `progress.ts` writes into PROGRESS_KEY. Widgets keep their
 * own keys and never touch the progress record.
 */

export const PROGRESS_KEY = 'aiguide:progress:v1';
export const SELFCHECK_KEY = 'aiguide:selfcheck:v1';
export const JOURNAL_KEY = 'aiguide:journal:v1';
export const LOCALAI_CHAT_PREFIX = 'aiguide:localai:chat:';

// Preferences: never cleared by clearReaderData().
export const READING_MODE_KEY = 'aiguide:reading-mode';
export const LOCALAI_CONSENT_KEY = 'aiguide:localai:consent';

const READER_DATA_KEYS = [PROGRESS_KEY, SELFCHECK_KEY, JOURNAL_KEY];
const READER_DATA_PREFIXES = [LOCALAI_CHAT_PREFIX];

export function clearReaderData(): void {
  try {
    for (const key of READER_DATA_KEYS) localStorage.removeItem(key);
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && READER_DATA_PREFIXES.some((p) => key.startsWith(p))) {
        toRemove.push(key);
      }
    }
    for (const key of toRemove) localStorage.removeItem(key);
  } catch {
    /* storage unavailable: nothing to clear */
  }
}
