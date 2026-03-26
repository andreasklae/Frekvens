import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

type EventGalleryCarouselProps = {
  urls: string[];
  /** Full-bleed layer behind slides (e.g. `background.jpg`); gallery photos use object-contain on top. */
  backdropUrl?: string | null;
  /** Fired when Embla is ready or changes (e.g. to wire thumbnail grid). */
  onApiChange?: (api: CarouselApi | undefined) => void;
};

export function EventGalleryCarousel({ urls, backdropUrl, onApiChange }: EventGalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    onApiChange?.(api);
  }, [api, onApiChange]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  if (urls.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden rounded-xl border border-dark-600 shadow-inner">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            aria-hidden
          />
        ) : (
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-dark-800 to-dark-900"
            aria-hidden
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-black/40"
          aria-hidden
        />

        <Carousel
          setApi={setApi}
          opts={{ align: 'center', loop: urls.length > 1 }}
          className="relative z-[2] h-full w-full"
        >
          <CarouselContent className="-ml-0 h-full min-h-0 sm:-ml-0">
            {urls.map((url, i) => (
              <CarouselItem key={`${url}-${i}`} className="h-full basis-full pl-0 sm:pl-0">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center p-4 sm:p-6 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
                >
                  <img
                    src={url}
                    alt=""
                    className="max-h-full max-w-full object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.65)]"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          {urls.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
      {urls.length > 1 && (
        <p className="mt-3 text-center text-sm text-gray-500 tabular-nums" aria-live="polite">
          {current + 1} / {count}
        </p>
      )}
    </div>
  );
}
