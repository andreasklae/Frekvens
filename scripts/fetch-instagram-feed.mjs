/**
 * Fetches recent Instagram media via Meta Instagram Graph API and writes
 * public/data/instagram-posts.json for the site to consume at runtime.
 *
 * Requires a Professional (Business or Creator) Instagram account linked to a
 * Facebook Page, and a long-lived User or Page access token with permissions
 * to read that account's media (e.g. instagram_basic / pages_show_list flow).
 *
 * Environment:
 *   INSTAGRAM_ACCESS_TOKEN — required
 *   INSTAGRAM_USER_ID      — Instagram Business Account ID (numeric IG user id)
 *   INSTAGRAM_LIMIT        — optional, default 12 (max ~25 per request)
 *   INSTAGRAM_API_VERSION  — optional, default v21.0
 *
 * Usage: node scripts/fetch-instagram-feed.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'data', 'instagram-posts.json');

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const igUserId = process.env.INSTAGRAM_USER_ID;
const limit = Math.min(Number(process.env.INSTAGRAM_LIMIT) || 12, 25);
const version = process.env.INSTAGRAM_API_VERSION || 'v21.0';

if (!token || !igUserId) {
  console.error(
    'Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID.\n' +
      'Create a Meta app, connect the Instagram professional account, then set these env vars.'
  );
  process.exit(1);
}

const fields = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'permalink',
  'thumbnail_url',
  'timestamp',
  'children{media_url,media_type}',
].join(',');

const url = new URL(`https://graph.facebook.com/${version}/${igUserId}/media`);
url.searchParams.set('fields', fields);
url.searchParams.set('limit', String(limit));
url.searchParams.set('access_token', token);

function pickImageUrl(item) {
  const type = item.media_type;
  if (type === 'VIDEO') {
    return item.thumbnail_url || item.media_url || null;
  }
  if (type === 'CAROUSEL_ALBUM') {
    const first = item.children?.data?.[0];
    return first?.media_url || item.media_url || item.thumbnail_url || null;
  }
  return item.media_url || item.thumbnail_url || null;
}

const res = await fetch(url);
const body = await res.json();

if (!res.ok) {
  console.error('Instagram API error:', body);
  process.exit(1);
}

const raw = Array.isArray(body.data) ? body.data : [];
const posts = [];

for (const item of raw) {
  const imageUrl = pickImageUrl(item);
  if (!imageUrl || !item.permalink) continue;
  posts.push({
    id: item.id,
    caption: item.caption || undefined,
    mediaType: item.media_type || 'UNKNOWN',
    imageUrl,
    permalink: item.permalink,
    timestamp: item.timestamp || '',
  });
}

fs.writeFileSync(OUT, JSON.stringify({ posts }, null, 2) + '\n', 'utf8');
console.log(`Wrote ${posts.length} post(s) to ${path.relative(process.cwd(), OUT)}`);
