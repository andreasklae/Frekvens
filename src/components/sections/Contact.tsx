import { motion } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ResidentAdvisorMark } from '../ui/ResidentAdvisorMark';

export function ContactBlock() {
  const { t } = useLanguage();

  const links = [
    {
      icon: Mail,
      label: t.contact.email,
      href: 'mailto:info@frekvenscollective.com',
      display: 'info@frekvenscollective.com',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/frekvenscollective?igsh=NWh6MDd1bnZscG82',
      display: '@frekvenscollective',
    },
    {
      icon: ResidentAdvisorMark,
      label: 'Resident Advisor',
      href: 'https://ra.co/promoters/173955',
      display: 'Frekvens',
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          {t.contact.title}
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto shadow-glow-sm" />
      </motion.div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group flex flex-col items-center p-6 sm:p-8 bg-dark-900 rounded-2xl border border-dark-600 hover:border-primary/50 transition-all duration-300 hover:glow-border"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-dark-800 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="text-sm text-gray-400 mb-1">{link.label}</span>
              <span className="text-white font-medium text-center group-hover:glow-text-subtle transition-all duration-300">
                {link.display}
              </span>
            </motion.a>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="text-center text-gray-500 mt-8 sm:mt-10"
      >
        {t.contact.followUs}
      </motion.p>
    </>
  );
}
