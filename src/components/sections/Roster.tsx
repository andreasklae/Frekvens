import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { PersonCard } from '../ui/PersonCard';
import { useRosterData } from '../../hooks/useRosterData';

export function Roster() {
  const { t } = useLanguage();
  const { roster, loading } = useRosterData();

  return (
    <section id="roster" className="py-24 sm:py-32 bg-transparent relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.roster.title}
          </h2>
          <p className="text-gray-400 text-lg">
            {t.roster.subtitle}
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 shadow-glow-sm" />
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {roster.map((artist) => (
              <PersonCard key={artist.id} person={artist} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
