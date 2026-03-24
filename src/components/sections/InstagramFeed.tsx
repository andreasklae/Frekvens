import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useInstagramFeed } from '../../hooks/useInstagramFeed';

const PROFILE_URL = 'https://www.instagram.com/frekvenscollective/';

export function InstagramFeed() {
  const { t } = useLanguage();
  const { posts, loading } = useInstagramFeed();

  return (
    <section id="instagram" className="py-24 sm:py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.instagram.title}
          </h2>
          <p className="text-gray-400 text-lg">{t.instagram.subtitle}</p>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 shadow-glow-sm" />
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <p className="text-gray-500 mb-8">{t.instagram.empty}</p>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-900 border border-dark-600 hover:border-primary/50 transition-all duration-300 hover:glow-border text-white font-medium"
            >
              <Instagram className="w-5 h-5 text-primary" aria-hidden />
              {t.instagram.openProfile}
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {posts.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4) }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-dark-600 bg-dark-900 hover:border-primary/50 transition-all duration-300 hover:glow-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t.instagram.viewOnInstagram}
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption ? post.caption.slice(0, 120) : 'Instagram post'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-xs text-white/90 font-medium flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
                    {t.instagram.viewOnInstagram}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              <Instagram className="w-4 h-4" aria-hidden />
              {t.instagram.openProfile}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
