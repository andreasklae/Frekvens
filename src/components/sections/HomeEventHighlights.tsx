import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useEventsData } from '../../hooks/useEventsData';
import { cn } from '../../lib/utils';
import { EventFlyerCard } from '../events/EventFlyerCard';
import { sortPast, sortUpcoming } from '../../utils/eventSort';

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

  const upcoming = events.filter((e) => e.status === 'upcoming').sort(sortUpcoming);
  const past = events.filter((e) => e.status === 'past').sort(sortPast);
  const nextEvent = upcoming[0];
  const lastEvent = past[0];

  if (!nextEvent && !lastEvent) {
    return null;
  }

  return (
    <>
      {nextEvent && (
        <section
          id="next-event"
          aria-labelledby="home-next-event-heading"
          className="py-24 sm:py-32 bg-transparent relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <SectionHeading id="home-next-event-heading" title={t.events.homeNextEvent} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              <EventFlyerCard event={nextEvent} index={0} />
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
      )}

      {lastEvent && (
        <section
          id="last-event"
          aria-labelledby="home-last-event-heading"
          className="py-24 sm:py-32 bg-transparent relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <SectionHeading id="home-last-event-heading" title={t.events.homeLastEvent} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="col-span-2 flex justify-center sm:col-span-3 lg:col-span-4">
                <div className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]">
                  <EventFlyerCard event={lastEvent} index={nextEvent ? 1 : 0} />
                </div>
              </div>
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
      )}
    </>
  );
}
