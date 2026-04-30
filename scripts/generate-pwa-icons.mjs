// scripts/generate-pwa-icons.mjs
//
// Rasterize PWA icons from public/favicon.svg.
// Idempotent: skips outputs newer than the source SVG.
//
// Outputs:
//   public/icons/pwa-192.png             (192×192, purpose "any")
//   public/icons/pwa-512.png             (512×512, purpose "any")
//   public/icons/pwa-512-maskable.png    (512×512, purpose "maskable", 80% safe-zone)
//   public/icons/apple-touch-icon.png    (180×180, iOS home screen)

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'public/favicon.svg';
const OUT_DIR = 'public/icons';

const TARGETS = [
  { name: 'pwa-192.png',          size: 192, maskable: false },
  { name: 'pwa-512.png',          size: 512, maskable: false },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'pwa-512-maskable.png', size: 512, maskable: true  },
];

// For maskable PWA icons: launcher crops the canvas into a circle/squircle.
// Content must live in the central 80% (safe-zone). Background fills 100%.
function maskableSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#E07A5F"/>
  <text x="50" y="62" text-anchor="middle"
        font-family="'Outfit', system-ui, sans-serif"
        font-size="38" font-weight="700" fill="#FCEEE3"
        letter-spacing="-1">AI</text>
</svg>`;
}

async function isUpToDate(outputPath, srcMtime) {
  try {
    const stat = await fs.stat(outputPath);
    return stat.mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

async function main() {
  const srcStat = await fs.stat(SRC);
  await fs.mkdir(OUT_DIR, { recursive: true });
  const srcSvg = await fs.readFile(SRC, 'utf8');

  for (const { name, size, maskable } of TARGETS) {
    const out = path.join(OUT_DIR, name);
    if (await isUpToDate(out, srcStat.mtimeMs)) {
      console.log(`[icons] skip (up-to-date): ${name}`);
      continue;
    }
    const input = Buffer.from(maskable ? maskableSvg() : srcSvg);
    await sharp(input).resize(size, size).png().toFile(out);
    console.log(`[icons] wrote ${name} (${size}×${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
