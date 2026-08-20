import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarClock, History } from 'lucide-react';
import type { CollectiveEvent } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { hasLiveTicketing, isUpcomingEvent } from '../../utils/eventStatus';

interface EventFlyerCardProps {
  event: CollectiveEvent;
  index: number;
  /** Show an "Upcoming"/"Past" tag overlay on the poster. */
  showStatusBadge?: boolean;
}

export function EventFlyerCard({ event, index, showStatusBadge = false }: EventFlyerCardProps) {
  const { language, t } = useLanguage();
  const [posterFailed, setPosterFailed] = useState(false);
  const title = event.title[language];
  const staticSrc = event.posterUrl?.trim() || '';
  const isUpcoming = isUpcomingEvent(event);
  const ticketsLive = hasLiveTicketing(event);
  const showPoster = staticSrc.length > 0 && !posterFailed;

  useEffect(() => {
    setPosterFailed(false);
  }, [staticSrc]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.35) }}
      className="h-full"
    >
      <Link
        to={`/events/${event.slug}`}
        className="group flex h-full flex-col rounded-xl border border-dark-600 bg-dark-900 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:glow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[210/297] w-full shrink-0 bg-dark-800">
          {showStatusBadge && (
            <span
              className={cn(
                'absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] shadow-sm',
                isUpcoming
                  ? 'border-primary/60 bg-primary/90 text-white'
                  : 'border-dark-600 bg-dark-900/85 text-gray-300'
              )}
            >
              {isUpcoming ? (
                <CalendarClock className="h-3 w-3 shrink-0" aria-hidden />
              ) : (
                <History className="h-3 w-3 shrink-0" aria-hidden />
              )}
              {isUpcoming ? t.events.upcoming : t.events.past}
            </span>
          )}
          {showPoster ? (
            <ResponsiveImage
              src={staticSrc}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-dark-800 to-dark-900">
              <span className="text-center text-sm sm:text-base text-gray-500 font-medium leading-snug">
                {title}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4 border-t border-dark-600">
          <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-3">
            {title}
          </h3>
          {ticketsLive && event.ticketing.kind === 'vipps' && (
            <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
              {t.events.ticketSaleLive}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
