// scripts/generate-llms-txt.mjs
//
// Postbuild: emit dist/llms.txt, a curated index of the manual for LLM
// agents that fetch a site to understand its scope. Spec at
// https://llmstxt.org.
//
// The data and the markdown formatting both live in
// `scripts/llms-txt-data.mjs`, shared with the Astro footer that embeds
// the same index on every page (hidden from users, visible to crawlers
// that don't fetch /llms.txt separately).

import fs from 'node:fs/promises';
import path from 'node:path';
import { getLlmsTxtData, formatLlmsTxtMarkdown } from './llms-txt-data.mjs';

const OUT = path.join('dist', 'llms.txt');

async function main() {
  const data = await getLlmsTxtData();
  const content = formatLlmsTxtMarkdown(data);
  await fs.writeFile(OUT, content);
  console.log(`[llms-txt] wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
