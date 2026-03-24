/**
 * Fills each event's galleryImageUrls from disk when `galleryDir` is set.
 *
 * Paths are relative to `public/images/events/` (e.g. `frekvens_00/gallery`).
 * Poster and background stay in the event root; only files inside `galleryDir` are listed.
 *
 * Run via: npm run sync-gallery (also runs before dev/build).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const eventsPath = path.join(root, 'public/data/events.json');
const imagesEventsRoot = path.join(root, 'public/images/events');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function isImageFile(name) {
  const ext = path.extname(name).toLowerCase();
  return IMAGE_EXT.has(ext);
}

function toPublicUrl(dirRel, filename) {
  const prefix = `/images/events/${dirRel.replace(/\\/g, '/')}`;
  return `${prefix}/${encodeURIComponent(filename)}`;
}

const raw = fs.readFileSync(eventsPath, 'utf8');
const data = JSON.parse(raw);
let changed = false;

for (const event of data.events) {
  const dirRel = typeof event.galleryDir === 'string' ? event.galleryDir.trim() : '';
  if (!dirRel) continue;

  const absDir = path.join(imagesEventsRoot, dirRel);
  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) {
    console.warn(`sync-event-gallery: skip — not a directory: ${absDir}`);
    continue;
  }

  const names = fs
    .readdirSync(absDir)
    .filter((n) => !n.startsWith('.') && n !== '.gitkeep' && isImageFile(n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const urls = names.map((n) => toPublicUrl(dirRel, n));
  const prev = JSON.stringify(event.galleryImageUrls ?? []);
  const next = JSON.stringify(urls);
  if (prev !== next) changed = true;
  event.galleryImageUrls = urls;
}

if (changed) {
  fs.writeFileSync(eventsPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log('sync-event-gallery: updated public/data/events.json');
} else {
  console.log('sync-event-gallery: gallery lists already match disk');
}
