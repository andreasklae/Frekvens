import { useCallback, useRef } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import { EventGalleryCarousel } from './EventGalleryCarousel';
import { EventGalleryGrid } from './EventGalleryGrid';

type EventGallerySectionProps = {
  urls: string[];
  backdropUrl: string | null;
  gridTitle: string;
  /** Short label for thumbnail buttons, e.g. “Show in main gallery”. */
  thumbnailShowLabel: string;
};

export function EventGallerySection({
  urls,
  backdropUrl,
  gridTitle,
  thumbnailShowLabel,
}: EventGallerySectionProps) {
  const carouselApiRef = useRef<CarouselApi | undefined>(undefined);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  const handleApiChange = useCallback((api: CarouselApi | undefined) => {
    carouselApiRef.current = api;
  }, []);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      carouselApiRef.current?.scrollTo(index);
      carouselScrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    },
    []
  );

  if (urls.length === 0) return null;

  return (
    <>
      <div
        ref={carouselScrollRef}
        className="scroll-mt-24 sm:scroll-mt-28"
        id="event-gallery-carousel"
      >
        <EventGalleryCarousel
          urls={urls}
          backdropUrl={backdropUrl}
          onApiChange={handleApiChange}
        />
      </div>
      <EventGalleryGrid
        urls={urls}
        title={gridTitle}
        thumbnailShowLabel={thumbnailShowLabel}
        onThumbnailClick={handleThumbnailClick}
      />
    </>
  );
}
