import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useEventsData } from '../hooks/useEventsData';
import { EventFlyerCard } from '../components/events/EventFlyerCard';
import { sortPast, sortUpcoming } from '../utils/eventSort';

export function EventsPage() {
  const { t } = useLanguage();
  const { events, loading } = useEventsData();

  const upcoming = events.filter((e) => e.status === 'upcoming').sort(sortUpcoming);
  const past = events.filter((e) => e.status === 'past').sort(sortPast);

  return (
    <div className="py-24 sm:py-32 pt-28 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {t.events.pageTitle}
          </h1>
          <div className="w-16 h-1 bg-primary mx-auto shadow-glow-sm" />
        </motion.div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <>
            <section aria-labelledby="events-upcoming-heading" className="mb-20 sm:mb-24">
              <h2
                id="events-upcoming-heading"
                className="text-xl sm:text-2xl font-bold text-white mb-8 text-center sm:text-left"
              >
                {t.events.upcoming}
              </h2>
              {upcoming.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-md mx-auto sm:mx-0 rounded-xl border border-dashed border-dark-600 bg-dark-900/50 p-10 text-center"
                >
                  <p className="text-gray-400">{t.events.comingSoon}</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {upcoming.map((event, i) => (
                    <EventFlyerCard key={event.slug} event={event} index={i} />
                  ))}
                </div>
              )}
            </section>

            <section aria-labelledby="events-past-heading">
              <h2
                id="events-past-heading"
                className="text-xl sm:text-2xl font-bold text-white mb-8 text-center sm:text-left"
              >
                {t.events.past}
              </h2>
              {past.length === 0 ? (
                <p className="text-center text-gray-500">{t.events.pastEmpty}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {past.map((event, i) => (
                    <EventFlyerCard key={event.slug} event={event} index={i} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
