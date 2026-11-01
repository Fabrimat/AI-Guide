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
// Full-bleed paper + grid + margin line; the swipe and the "AI" strokes are
// the same paths as public/favicon.svg (keep them in sync), shifted into the
// safe zone. Paths only, no <text>: sharp has no web fonts.
function maskableSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#F7F8F4"/>
  <path d="M0 10H100M0 23H100M0 36H100M0 49H100M0 62H100M0 75H100M0 88H100M37 0V100M50 0V100M63 0V100M76 0V100M89 0V100" stroke="#DCE4EC" stroke-width="1"/>
  <path d="M27 0V100" stroke="#EBA9B1" stroke-width="2.5"/>
  <g transform="translate(13 18)">
    <path d="M16.5 37.2C25 35.6 36 36.4 47 35.3S56.6 34.9 58.4 35.6L58.9 48.6C50 49.7 40 48.5 31 49.6S20 50.1 16.2 49.7C15.6 45.6 15.7 41.2 16.5 37.2Z" fill="#F5E663"/>
    <g fill="none" stroke="#1E3A8A" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19.6 48.6C22.3 38.9 25.3 27.4 28.8 15.4C32.1 26.6 35.2 38 38.4 48.8"/>
      <path d="M23.6 37.6C27.2 36.6 30.8 36.5 34.6 36.9"/>
      <path d="M43.4 16.1C46.4 15.4 49.4 15.6 52.6 15.8"/>
      <path d="M48 16C47.6 26.8 48.1 38.2 47.8 48.6"/>
      <path d="M43 48.9C46.3 49.4 49.6 49 52.9 49.3"/>
    </g>
  </g>
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
