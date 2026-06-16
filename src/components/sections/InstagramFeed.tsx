import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchInstagramPostUrl } from '../../utils/googleSheets';

const PROFILE_URL = 'https://www.instagram.com/frekvenscollective/';
const FALLBACK_POST_URL = 'https://www.instagram.com/p/DWRni5JDHDE/';

function processInstagramEmbeds() {
  const w = window as Window & { instgrm?: { Embeds: { process: () => void } } };
  w.instgrm?.Embeds?.process();
}

export function InstagramFeed() {
  const { t } = useLanguage();
  const [postUrl, setPostUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchInstagramPostUrl().then(url => {
      setPostUrl(url ?? FALLBACK_POST_URL);
    });
  }, []);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );

    if (existing) {
      processInstagramEmbeds();
      existing.addEventListener('load', processInstagramEmbeds);
      return () => existing.removeEventListener('load', processInstagramEmbeds);
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = processInstagramEmbeds;
    document.body.appendChild(script);
    return () => {
      script.onload = null;
    };
  }, [postUrl]);

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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center w-full"
        >
          {postUrl && (
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={postUrl}
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: 12,
                margin: 0,
                maxWidth: 540,
                minWidth: 280,
                padding: 0,
                width: '100%',
              }}
            >
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 text-center text-sm text-gray-600 no-underline"
              >
                {t.instagram.viewOnInstagram}
              </a>
            </blockquote>
          )}
        </motion.div>

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
      </div>
    </section>
  );
}
