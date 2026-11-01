// Single source of truth for the manual's modules: directory names in
// sidebar order, with IT/EN labels. Plain JS with JSDoc so Node scripts
// (`scripts/llms-txt-data.mjs`) and Astro/TS code can both import it.
// Keep the order in sync with the sidebar in `astro.config.mjs`.

/**
 * @typedef {{ dir: string, label: { it: string, en: string } }} ModuleInfo
 */

/** @type {ModuleInfo[]} */
export const MODULES = [
  { dir: 'fundamentals', label: { it: 'Fondamenti', en: 'Fundamentals' } },
  { dir: 'everyday-use', label: { it: 'Uso quotidiano', en: 'Everyday use' } },
  { dir: 'at-work', label: { it: 'Sul lavoro', en: 'At work' } },
  { dir: 'by-profession', label: { it: 'Per mestiere', en: 'By profession' } },
  { dir: 'for-students', label: { it: 'Per studenti', en: 'For students' } },
  { dir: 'for-teachers', label: { it: 'Per docenti', en: 'For teachers' } },
  { dir: 'going-deeper', label: { it: 'Per chi vuole di più', en: 'Going deeper' } },
];

/**
 * @param {string} dir
 * @param {'it' | 'en'} locale
 * @returns {string | undefined}
 */
export function moduleLabel(dir, locale) {
  const m = MODULES.find((x) => x.dir === dir);
  return m ? m.label[locale] : undefined;
}
