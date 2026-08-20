import type { ImgHTMLAttributes } from 'react';
import manifest from '../../generated/image-manifest.json';

interface ImageVariant {
  width: number;
  url: string;
}

interface ImageEntry {
  width: number;
  height: number;
  variants: ImageVariant[];
}

const images = manifest as Record<string, ImageEntry>;

/**
 * Manifest keys are the public URLs as written in the JSON data (path segments
 * URL-encoded). Callers may pass either form, so try both.
 */
function lookup(src: string): ImageEntry | undefined {
  const direct = images[src];
  if (direct) return direct;
  try {
    return images[encodeURI(decodeURI(src))] ?? images[decodeURI(src)];
  } catch {
    return undefined;
  }
}

/** Largest generated derivative — use for "open the photo" links instead of the 19 MB original. */
export function fullSizeImageUrl(src: string | null | undefined): string {
  if (!src) return '';
  const entry = lookup(src);
  if (!entry || entry.variants.length === 0) return src;
  return entry.variants[entry.variants.length - 1].url;
}

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string | null | undefined;
  /** Layout hint for the browser's srcset pick — always pass one, the default is a full-width guess. */
  sizes?: string;
};

/**
 * Renders the build-time WebP derivatives (see `scripts/optimize-images.mjs`) via
 * `srcset`, so the browser downloads a photo at roughly its rendered size instead
 * of the full-resolution original. Unknown sources (remote URLs, missing
 * derivatives) fall back to a plain `<img>`.
 */
export function ResponsiveImage({ src, sizes = '100vw', ...rest }: ResponsiveImageProps) {
  const trimmed = src?.trim() ?? '';
  const entry = trimmed ? lookup(trimmed) : undefined;

  if (!entry || entry.variants.length === 0) {
    return <img src={trimmed || undefined} {...rest} />;
  }

  const srcSet = entry.variants.map((v) => `${v.url} ${v.width}w`).join(', ');
  // Fallback `src` for browsers ignoring srcset: a mid-size variant, never the original.
  const fallback = entry.variants[Math.min(1, entry.variants.length - 1)].url;

  return <img src={fallback} srcSet={srcSet} sizes={sizes} {...rest} />;
}
