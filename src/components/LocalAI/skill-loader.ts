/**
 * Finds the check-in skill files for the current lesson by scanning the
 * rendered LlmExercise cards (each carries data-file + data-variant and
 * a title). Far more robust than deriving a filename from the slug:
 * lessons can have several skill files (practice-, review-, deepen-).
 */
export interface SkillRef {
  file: string;
  variant: string;
  title: string;
  url: string;
}

export function findSkillFiles(): SkillRef[] {
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('.llm-exercise[data-file]'),
  );
  const refs: SkillRef[] = [];
  cards.forEach((card) => {
    const file = card.dataset.file;
    if (!file) return;
    const variant = card.dataset.variant || 'practice';
    const title = card.querySelector('h3')?.textContent?.trim() || file;
    // Resolve the same URL LlmExercise builds: the copy button's data-copy-src.
    const url = card.querySelector<HTMLElement>('[data-copy-src]')?.getAttribute('data-copy-src') || '';
    if (url) refs.push({ file, variant, title, url });
  });
  return refs;
}

/** Picks the most relevant skill: prefer review, then practice, then first. */
export function pickPrimarySkill(refs: SkillRef[]): SkillRef | null {
  if (!refs.length) return null;
  return (
    refs.find((r) => r.variant === 'review') ||
    refs.find((r) => r.variant === 'practice') ||
    refs[0]
  );
}

export async function loadSkill(ref: SkillRef): Promise<string> {
  const res = await fetch(ref.url);
  if (!res.ok) throw new Error(`skill fetch failed: ${res.status}`);
  return res.text();
}
