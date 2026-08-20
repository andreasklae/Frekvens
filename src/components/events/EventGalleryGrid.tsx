import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

type EventGalleryGridProps = {
  urls: string[];
  /** Section label (e.g. i18n “All photos”). */
  title: string;
  /** Opens the main carousel at this index and scrolls it into view. */
  onThumbnailClick: (index: number) => void;
  /** Prepended to aria-label with index / count. */
  thumbnailShowLabel: string;
};

/**
 * Square thumbnail grid using shadcn/Radix {@link AspectRatio} (1:1) — shadcn has no separate “gallery” primitive.
 */
export function EventGalleryGrid({
  urls,
  title,
  onThumbnailClick,
  thumbnailShowLabel,
}: EventGalleryGridProps) {
  if (urls.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        {title}
      </h3>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {urls.map((url, i) => (
          <li key={`${url}-${i}`} className="min-w-0">
            <AspectRatio
              ratio={1}
              className="overflow-hidden rounded-lg border border-dark-600 bg-dark-900 transition-colors hover:border-primary/45 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/40"
            >
              <button
                type="button"
                onClick={() => onThumbnailClick(i)}
                className="block h-full w-full cursor-pointer outline-none"
                aria-label={`${thumbnailShowLabel} (${i + 1} / ${urls.length})`}
              >
                <ResponsiveImage
                  src={url}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  alt=""
                  className="pointer-events-none h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </AspectRatio>
          </li>
        ))}
      </ul>
    </div>
  );
}
