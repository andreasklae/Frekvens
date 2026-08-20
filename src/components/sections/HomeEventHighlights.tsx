import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useEventsData } from '../../hooks/useEventsData';
import { cn } from '../../lib/utils';
import { EventFlyerCard } from '../events/EventFlyerCard';
import { sortPast, sortUpcoming } from '../../utils/eventSort';
import { isPastEvent, isUpcomingEvent } from '../../utils/eventStatus';

/** Matches `Button` default variant — use on `Link` for navigation CTAs. */
const allEventsCtaClassName = cn(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
  'bg-primary hover:bg-primary/90',
  'h-11 min-w-[10rem] px-8 select-none cursor-pointer'
);

function AllEventsCta() {
  const { t } = useLanguage();
  return (
    <Link to="/events" className={allEventsCtaClassName}>
      <span>{t.events.homeAllEvents}</span>
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
    </Link>
  );
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 sm:mb-14"
    >
      <h2 id={id} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      <div className="w-16 h-1 bg-primary mx-auto shadow-glow-sm" />
    </motion.div>
  );
}

export function HomeEventHighlights() {
  const { t } = useLanguage();
  const { events, loading } = useEventsData();

  if (loading) {
    return null;
  }

  const upcoming = events.filter((e) => isUpcomingEvent(e)).sort(sortUpcoming);
  const past = events.filter((e) => isPastEvent(e)).sort(sortPast);
  // Upcoming events first, then the most recent past event as a highlight.
  const highlights = [...upcoming, ...past.slice(0, 1)];

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section
      id="events"
      aria-labelledby="home-events-heading"
      className="py-24 sm:py-32 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading id="home-events-heading" title={t.events.pageTitle} />
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {highlights.map((event, i) => (
            <div
              key={event.slug}
              className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
            >
              <EventFlyerCard event={event} index={i} showStatusBadge />
            </div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <AllEventsCta />
        </motion.div>
      </div>
    </section>
  );
}
