/**
 * Extracts the current lesson's prose from the rendered DOM, stripped
 * of UI chrome, for use as the assistant's grounding context. Pure DOM
 * + string logic; no dependencies on other LocalAI modules.
 */
export interface LessonContext {
  title: string;
  text: string;
}

/** Rough token estimate: ~4 characters per token for mixed en/it prose. */
export function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}

/** Trim text to a token budget on a word boundary, no mid-word cut. */
export function clampToTokenBudget(text: string, budgetTokens: number): string {
  const maxChars = budgetTokens * 4;
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd();
}

export function extractLessonContext(budgetTokens = 1500): LessonContext {
  const main = document.querySelector('main .sl-markdown-content');
  const titleEl = document.querySelector('main h1, .sl-markdown-content h1');
  const title = (titleEl?.textContent || document.title || '').trim();

  if (!main) return { title, text: '' };

  // Clone so we can strip chrome without touching the live page.
  const clone = main.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll('.not-content, .llm-exercise, [hidden], script, style, nav, button')
    .forEach((el) => el.remove());

  const raw = clone.textContent || '';
  const text = raw.replace(/\s+/g, ' ').trim();
  return { title, text: clampToTokenBudget(text, budgetTokens) };
}
