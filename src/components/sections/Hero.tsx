import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Threads } from '../ui/Threads';

export function Hero() {
  const { t } = useLanguage();

  const scrollToMission = () => {
    const element = document.querySelector('#mission');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-transparent">
        {/* Threads effect */}
        <Threads
          amplitude={3}
          distance={0}
          enableMouseInteraction={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-lastica text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white glow-text tracking-wider break-words"
        >
          FREKVENS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-300 tracking-widest uppercase"
        >
          {t.hero.tagline}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        onClick={scrollToMission}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-primary transition-colors duration-200 flex flex-col items-center gap-2"
        aria-label={t.hero.scroll}
      >
        <span className="text-xs uppercase tracking-widest">{t.hero.scroll}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>

    </section>
  );
}
