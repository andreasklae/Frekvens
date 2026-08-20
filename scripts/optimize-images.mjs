/**
 * Generates responsive WebP derivatives for every image under `public/images/`.
 *
 * Source photos are full-resolution originals (some 40+ megapixels / 19 MB) — far
 * too heavy to ship to a browser that renders them at 200–800 px. This writes a
 * flat set of downscaled WebPs to `public/images/_derived/` plus a manifest that
 * `ResponsiveImage` uses to build `srcset`. Originals stay untouched as the archive.
 *
 * Incremental: a derivative is rebuilt only when the source is newer or its size
 * changed. Run via `npm run optimize-images` (also runs before dev/build).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesRoot = path.join(root, 'public/images');
const derivedDirName = '_derived';
const derivedRoot = path.join(imagesRoot, derivedDirName);
const manifestPath = path.join(root, 'src/generated/image-manifest.json');

/** Rendered widths across the site: avatars (~128) up to full-bleed posters/slides. */
const TARGET_WIDTHS = [320, 640, 960, 1440, 2048];
const WEBP_QUALITY = 76;
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn(
    'optimize-images: sharp is not installed — skipping (run `npm install` to enable image optimization)'
  );
  process.exit(0);
}

/** Public URL used in JSON/JSX, e.g. `/images/events/frekvens_00/gallery/Image%20(5).JPG`. */
function toPublicUrl(relPath) {
  return `/images/${relPath.split(path.sep).map(encodeURIComponent).join('/')}`;
}

/** Flat, URL-safe derivative basename; the hash keeps distinct sources from colliding. */
function toDerivedSlug(relPath) {
  const withoutExt = relPath.slice(0, relPath.length - path.extname(relPath).length);
  const slug = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const hash = crypto.createHash('sha1').update(relPath).digest('hex').slice(0, 6);
  return `${slug || 'image'}-${hash}`;
}

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path.relative(base, abs) === derivedDirName) continue;
      out.push(...walk(abs, base));
    } else if (SOURCE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(abs);
    }
  }
  return out;
}

if (!fs.existsSync(imagesRoot)) {
  console.warn('optimize-images: no public/images directory — nothing to do');
  process.exit(0);
}

fs.mkdirSync(derivedRoot, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

const sources = walk(imagesRoot).sort();
const manifest = {};
const keep = new Set();
let built = 0;
let reused = 0;

for (const abs of sources) {
  const relPath = path.relative(imagesRoot, abs);
  const stat = fs.statSync(abs);
  const meta = await sharp(abs).metadata();
  if (!meta.width || !meta.height) {
    console.warn(`optimize-images: skip — unreadable dimensions: ${relPath}`);
    continue;
  }

  const slug = toDerivedSlug(relPath);
  // Never upscale: keep target widths below the original, plus the original width itself.
  const widths = [...new Set([...TARGET_WIDTHS.filter((w) => w < meta.width), Math.min(meta.width, TARGET_WIDTHS[TARGET_WIDTHS.length - 1])])].sort(
    (a, b) => a - b
  );

  const variants = [];
  for (const width of widths) {
    const name = `${slug}-${width}.webp`;
    const outAbs = path.join(derivedRoot, name);
    keep.add(name);

    const upToDate =
      fs.existsSync(outAbs) && fs.statSync(outAbs).mtimeMs >= stat.mtimeMs;
    if (upToDate) {
      reused += 1;
    } else {
      await sharp(abs)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toFile(outAbs);
      built += 1;
    }

    variants.push({ width, url: `/images/${derivedDirName}/${name}` });
  }

  manifest[toPublicUrl(relPath)] = {
    width: meta.width,
    height: meta.height,
    variants,
  };
}

// Drop derivatives whose source is gone or whose target widths changed.
for (const name of fs.readdirSync(derivedRoot)) {
  if (name.startsWith('.') || keep.has(name)) continue;
  fs.rmSync(path.join(derivedRoot, name));
  console.log(`optimize-images: removed stale ${name}`);
}

const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
const previous = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';
if (previous !== serialized) {
  fs.writeFileSync(manifestPath, serialized, 'utf8');
  console.log(`optimize-images: wrote manifest for ${Object.keys(manifest).length} images`);
}

console.log(
  `optimize-images: ${built} derivative(s) built, ${reused} reused across ${sources.length} source image(s)`
);
