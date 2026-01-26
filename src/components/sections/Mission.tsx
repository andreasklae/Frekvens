import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export function Mission() {
  const { t } = useLanguage();

  return (
    <section id="mission" className="py-24 sm:py-32 bg-transparent relative overflow-hidden min-h-[600px]">
      {/* Background Video */}
      <video
        src="/videos/mission-background.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ minHeight: '100%', minWidth: '100%' }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8">
            {t.mission.title}
          </h2>

          <div className="w-16 h-1 bg-primary mx-auto mb-8 shadow-glow-sm" />

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {t.mission.content}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
