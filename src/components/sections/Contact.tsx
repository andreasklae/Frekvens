import { motion } from 'framer-motion';
import { Mail, Instagram } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Contact() {
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
      icon: () => (
        <svg
          className="w-8 h-8"
          viewBox="0 0 83 40"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M82.092 32.018c.556-.533.908-1.28.908-2.113 0-.802-.38-1.523-.9-2.051L58.665 4.3l-7.073 7.11 18.45 18.543h-26.14c-1.278-.038-2.29-.469-3.147-1.304l-11.73-11.788a6.828 6.828 0 00-4.689-1.888l-.017.001H10.004v-4.92h14.825c2.938.002 5.559 1.21 7.48 3.15l8.749 8.793 7.073-7.11-8.92-8.963C35.485 2.234 30.45 0 24.805 0H0v25.027h20.978v.002a4.919 4.919 0 013.486 1.48L35.95 38.053A6.74 6.74 0 0040.449 40h31.733a4.911 4.911 0 003.423-1.45l6.491-6.524-.004-.008" />
        </svg>
      ),
      label: 'Resident Advisor',
      href: 'https://ra.co/promoters/173955',
      display: 'Frekvens',
    },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 bg-transparent relative overflow-hidden">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.contact.title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto shadow-glow-sm" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {links.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col items-center p-8 bg-dark-900 rounded-2xl border border-dark-600 hover:border-primary/50 transition-all duration-300 hover:glow-border"
            >
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <link.icon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="text-sm text-gray-400 mb-1">{link.label}</span>
              <span className="text-white font-medium group-hover:glow-text-subtle transition-all duration-300">
                {link.display}
              </span>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-gray-500 mt-12"
        >
          {t.contact.followUs}
        </motion.p>
      </div>
    </section>
  );
}
