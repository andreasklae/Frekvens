/**
 * Drops the heavy source images from `dist/` after a build.
 *
 * Vite copies all of `public/` verbatim, which would ship ~200 MB of camera
 * originals that no page ever requests — the browser only loads the WebP
 * derivatives in `images/_derived/` (see `scripts/optimize-images.mjs`).
 *
 * Only originals above `MIN_PRUNE_BYTES` that actually have derivatives are
 * removed, so small assets referenced directly (QR codes, logos) keep working.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distImages = path.join(root, 'dist/images');
const manifestPath = path.join(root, 'src/generated/image-manifest.json');

const MIN_PRUNE_BYTES = 500 * 1024;

if (!fs.existsSync(distImages) || !fs.existsSync(manifestPath)) {
  console.log('prune-dist-images: nothing to prune');
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const optimized = new Map(
  Object.entries(manifest).map(([url, entry]) => [decodeURI(url), entry])
);

let removed = 0;
let freed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_derived') continue;
      walk(abs);
      continue;
    }
    const url = `/${path.relative(path.join(root, 'dist'), abs).split(path.sep).join('/')}`;
    const optimizedEntry = optimized.get(url);
    if (!optimizedEntry) continue;
    const { size } = fs.statSync(abs);
    if (size < MIN_PRUNE_BYTES) continue;
    // Safety net: never drop an original unless every derivative made it into dist.
    const derivativesShipped = optimizedEntry.variants.every((v) =>
      fs.existsSync(path.join(root, 'dist', v.url.replace(/^\//, '')))
    );
    if (!derivativesShipped) {
      console.warn(`prune-dist-images: keeping ${url} — derivatives missing from dist`);
      continue;
    }
    fs.rmSync(abs);
    removed += 1;
    freed += size;
  }
}

walk(distImages);

console.log(
  `prune-dist-images: removed ${removed} source image(s) from dist (${(freed / 1024 / 1024).toFixed(1)} MB) — derivatives are served instead`
);
