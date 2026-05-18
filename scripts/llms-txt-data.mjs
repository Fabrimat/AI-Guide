// scripts/llms-txt-data.mjs
//
// Shared source of truth for the site's `llms.txt` index. Two consumers:
//
//   1. `scripts/generate-llms-txt.mjs` (postbuild) — formats the data as
//      markdown and writes it to `dist/llms.txt`.
//   2. `src/components/Footer.astro` (Astro render) — embeds the same
//      data on every page inside a `<nav hidden>` so crawlers that don't
//      fetch `/llms.txt` separately still discover the full site structure
//      from any page they land on.
//
// English is the default locale of the site, so the index lives in English
// and points to `/en/` URLs. The Italian mirror is mentioned at the bottom:
// every page mirrors the same path under `/it/`.
//
// Reads MDX frontmatter from `src/content/docs/en/`, so any new lesson
// under EN is picked up automatically on the next build with no manual
// upkeep of the index. Section order mirrors the sidebar in
// `astro.config.mjs`. Modules that exist as placeholders only (all
// `link: '#'`) are skipped: nothing to link to.

import fs from 'node:fs/promises';
import path from 'node:path';

export const SITE = 'https://ai-guide.larosa.work';

// Anchor the docs directory to the project root via `process.cwd()`.
// Both consumers run from the repo root: `npm run build` (Astro renders
// components, the module gets bundled into `dist/.prerender/...` and
// `import.meta.url` points there, not to source) and `npm run postbuild`
// (Node loads this file directly). cwd is the only path that's stable
// across both.
const DOCS_DIR = path.resolve(process.cwd(), 'src', 'content', 'docs', 'en');

// Order and labels of the modules surfaced in the index. Keep in sync
// with the sidebar in `astro.config.mjs`. Skip placeholder modules
// (going-deeper) until they have published lessons, since listing only
// "Soon" entries would be noise.
const MODULES = [
  { dir: null,            slug: 'start-here', label: 'Start here' },
  { dir: 'fundamentals',  label: 'Fundamentals' },
  { dir: 'everyday-use',  label: 'Everyday use' },
  { dir: 'at-work',       label: 'At work' },
  { dir: 'for-students',  label: 'For students' },
];

const REFERENCE = [
  { slug: 'glossary', label: 'Glossary' },
  { slug: 'about',    label: 'About' },
];

const SITE_DESCRIPTION =
  'A free, bilingual (English and Italian) manual that teaches non-technical readers ' +
  'how to use conversational AI well, from the very first question through everyday ' +
  'productivity, work scenarios, and advanced topics. Audience: parents, teachers, ' +
  'professionals, students. Not engineers.';

const INTRO =
  `The canonical site is ${SITE}. English is the default locale (\`/en/\`); ` +
  'every page is mirrored in Italian at the same path under `/it/`. URL slugs are ' +
  'identical across languages so any English URL below can be translated by ' +
  'replacing `/en/` with `/it/`.';

const TRANSLATIONS =
  `The same manual is available in Italian at ${SITE}/it/. Every English page ` +
  'has an Italian counterpart at the same path; replace `/en/` with `/it/` in ' +
  'any URL above to get the Italian version.';

const OPTIONAL = [
  { title: 'Sitemap', url: `${SITE}/sitemap-index.xml`, description: 'every public URL on the site.' },
  { title: 'Privacy', url: `${SITE}/en/privacy/`, description: 'what is and is not collected about readers.' },
];

// Lightweight YAML frontmatter parser, scoped to the fields we read
// (title, description). Avoids pulling a dependency just for build.
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const data = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.+)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return data;
}

async function readLesson(filePath, urlPath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const fm = parseFrontmatter(raw);
  if (!fm.title) return null;
  return {
    title: fm.title,
    description: fm.description ?? '',
    url: `${SITE}${urlPath}`,
  };
}

async function readModuleLessons(moduleDir) {
  const dir = path.join(DOCS_DIR, moduleDir);
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.mdx'));
  const lessons = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, 'utf8');
    const fm = parseFrontmatter(raw);
    if (!fm.title) continue;
    const orderMatch = raw.match(/sidebar:[\s\S]*?order:\s*(\d+)/);
    const order = orderMatch ? Number(orderMatch[1]) : Number.POSITIVE_INFINITY;
    lessons.push({
      title: fm.title,
      description: fm.description ?? '',
      url: `${SITE}/en/${moduleDir}/${slug}/`,
      order,
      slug,
    });
  }
  lessons.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.slug.localeCompare(b.slug);
  });
  return lessons.map(({ order, slug, ...rest }) => rest);
}

// Cache the structured data at module level so multiple Astro components
// rendering in the same build don't re-scan the docs directory once for
// each of 76 pages.
let cached = null;

export async function getLlmsTxtData() {
  if (cached) return cached;

  const sections = [];
  for (const mod of MODULES) {
    if (mod.dir === null) {
      const lesson = await readLesson(
        path.join(DOCS_DIR, `${mod.slug}.mdx`),
        `/en/${mod.slug}/`
      );
      sections.push({ label: mod.label, items: lesson ? [lesson] : [] });
    } else {
      const items = await readModuleLessons(mod.dir);
      sections.push({ label: mod.label, items });
    }
  }

  const reference = [];
  for (const ref of REFERENCE) {
    const lesson = await readLesson(
      path.join(DOCS_DIR, `${ref.slug}.mdx`),
      `/en/${ref.slug}/`
    );
    if (lesson) reference.push(lesson);
  }

  cached = {
    title: 'AI-Guide',
    summary: SITE_DESCRIPTION,
    intro: INTRO,
    sections,
    reference,
    translations: TRANSLATIONS,
    optional: OPTIONAL,
  };
  return cached;
}

// Render the structured data as the `llms.txt` markdown format spec'd at
// https://llmstxt.org: H1 title, blockquote summary, then H2 sections
// with bulleted links and short descriptions.
export function formatLlmsTxtMarkdown(data) {
  const lines = [];
  lines.push(`# ${data.title}`);
  lines.push('');
  lines.push(`> ${data.summary}`);
  lines.push('');
  lines.push(data.intro);
  lines.push('');

  for (const section of data.sections) {
    if (section.items.length === 0) continue;
    lines.push(`## ${section.label}`);
    lines.push('');
    for (const item of section.items) {
      lines.push(formatItem(item));
    }
    lines.push('');
  }

  if (data.reference.length > 0) {
    lines.push('## Reference');
    lines.push('');
    for (const item of data.reference) {
      lines.push(formatItem(item));
    }
    lines.push('');
  }

  lines.push('## Translations');
  lines.push('');
  lines.push(data.translations);
  lines.push('');

  if (data.optional.length > 0) {
    lines.push('## Optional');
    lines.push('');
    for (const item of data.optional) {
      lines.push(formatItem(item));
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatItem({ title, description, url }) {
  return description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`;
}
