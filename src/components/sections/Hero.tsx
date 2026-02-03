import { motion } from 'framer-motion';
import { ChevronDown, Mail, Instagram } from 'lucide-react';
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

  const ResidentAdvisorIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 83 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M82.092 32.018c.556-.533.908-1.28.908-2.113 0-.802-.38-1.523-.9-2.051L58.665 4.3l-7.073 7.11 18.45 18.543h-26.14c-1.278-.038-2.29-.469-3.147-1.304l-11.73-11.788a6.828 6.828 0 00-4.689-1.888l-.017.001H10.004v-4.92h14.825c2.938.002 5.559 1.21 7.48 3.15l8.749 8.793 7.073-7.11-8.92-8.963C35.485 2.234 30.45 0 24.805 0H0v25.027h20.978v.002a4.919 4.919 0 013.486 1.48L35.95 38.053A6.74 6.74 0 0040.449 40h31.733a4.911 4.911 0 003.423-1.45l6.491-6.524-.004-.008" />
    </svg>
  );

  const contactLinks = [
    {
      icon: Mail,
      href: 'mailto:info@frekvenscollective.com',
      display: 'info@frekvenscollective.com',
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/frekvenscollective?igsh=NWh6MDd1bnZscG82',
      display: '@frekvenscollective',
    },
    {
      icon: ResidentAdvisorIcon,
      href: 'https://ra.co/promoters/173955',
      display: 'Frekvens',
    },
  ];

  return (
    <section className="relative h-screen overflow-hidden w-full">
      {/* Waveform - centered behind logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent md:inset-0 md:translate-x-0 md:translate-y-0 h-[60vh] max-h-[500px] w-full md:h-full md:max-h-none">
        {/* Threads effect */}
        <Threads
          amplitude={3}
          distance={0}
          enableMouseInteraction={false}
        />
      </div>

      {/* Logo - always vertically centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-4 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-lastica text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] text-white glow-text tracking-wider sm:tracking-wider whitespace-nowrap"
        >
          FREKVENS
        </motion.h1>
      </div>

      {/* Tagline and Links - below logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 z-10 text-center px-4 w-full mt-20 sm:mt-24 md:mt-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-gray-300 tracking-widest uppercase"
        >
          {t.hero.tagline}
        </motion.p>

        {/* Contact Links - icon only, bigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {contactLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="group flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-dark-900/50 backdrop-blur-sm rounded-lg border border-dark-600/50 hover:border-primary/50 transition-all duration-300 hover:glow-border"
              aria-label={link.display}
            >
              <link.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-gray-400 group-hover:text-primary transition-colors duration-300" />
            </motion.a>
          ))}
        </motion.div>
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
