import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CollectiveEvent } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface EventFlyerCardProps {
  event: CollectiveEvent;
  index: number;
}

export function EventFlyerCard({ event, index }: EventFlyerCardProps) {
  const { language } = useLanguage();
  const [posterFailed, setPosterFailed] = useState(false);
  const title = event.title[language];
  const staticSrc = event.posterUrl?.trim() || '';
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
    >
      <Link
        to={`/events/${event.slug}`}
        className="group block rounded-xl border border-dark-600 bg-dark-900 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:glow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[210/297] w-full bg-dark-800">
          {showPoster ? (
            <img
              src={staticSrc}
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
        <div className="p-3 sm:p-4 border-t border-dark-600">
          <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-3">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
