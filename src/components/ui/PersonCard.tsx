import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Music, User } from 'lucide-react';
import type { Person } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showImage = person.imageUrl && person.imageUrl.trim() !== '' && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
        {/* Avatar */}
        <div className="relative mb-3">
          {showImage ? (
            <>
              {!imageLoaded && (
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-dark-700 border-2 border-dark-600 transition-colors duration-300 flex items-center justify-center absolute">
                  <User className="w-10 h-10 sm:w-16 sm:h-16 text-dark-600" />
                </div>
              )}
              <img
                src={person.imageUrl}
                alt={person.alias || person.name || 'Person'}
                onError={handleImageError}
                onLoad={handleImageLoad}
                className={`w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-dark-600 transition-colors duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
                }`}
              />
            </>
          ) : (
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-dark-700 border-2 border-dark-600 transition-colors duration-300 flex items-center justify-center">
              <User className="w-10 h-10 sm:w-16 sm:h-16 text-dark-600" />
            </div>
          )}
        </div>

        {/* Role */}
        <p className="text-primary text-sm sm:text-base font-medium mb-1">
          {person.role[language]}
        </p>

        {/* Alias or Name with Country Code */}
        <h3 className="text-base sm:text-xl font-bold text-white mb-1">
          {person.alias || person.name}
          {person.countryCode && (
            <span className="text-gray-500 text-base sm:text-xl ml-2 uppercase font-normal">
              ({person.countryCode})
            </span>
          )}
        </h3>

        {/* Description */}
        {person.description && (
          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            {person.description[language]}
          </p>
        )}

        {/* Email */}
        {person.links?.email && (
          <a
            href={`mailto:${person.links.email}`}
            className="text-gray-400 hover:text-primary transition-colors duration-200 text-xs sm:text-sm mb-2"
          >
            {person.links.email}
          </a>
        )}

        {/* Social Links */}
        {person.links && (
          <div className="flex gap-2 sm:gap-3 mt-2 justify-center">
            {person.links.instagram && (
              <a
                href={person.links.instagram.startsWith('http') ? person.links.instagram : `https://instagram.com/${person.links.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {person.links.tiktok && (
              <a
                href={person.links.tiktok.startsWith('http') ? person.links.tiktok : `https://tiktok.com/@${person.links.tiktok.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors duration-200"
                aria-label="TikTok"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            )}
            {person.links.soundcloud && (
              <a
                href={person.links.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors duration-200"
                aria-label="SoundCloud"
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {person.links.residentAdvisor && (
              <a
                href={person.links.residentAdvisor}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors duration-200"
                aria-label="Resident Advisor"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  viewBox="0 0 83 40"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M82.092 32.018c.556-.533.908-1.28.908-2.113 0-.802-.38-1.523-.9-2.051L58.665 4.3l-7.073 7.11 18.45 18.543h-26.14c-1.278-.038-2.29-.469-3.147-1.304l-11.73-11.788a6.828 6.828 0 00-4.689-1.888l-.017.001H10.004v-4.92h14.825c2.938.002 5.559 1.21 7.48 3.15l8.749 8.793 7.073-7.11-8.92-8.963C35.485 2.234 30.45 0 24.805 0H0v25.027h20.978v.002a4.919 4.919 0 013.486 1.48L35.95 38.053A6.74 6.74 0 0040.449 40h31.733a4.911 4.911 0 003.423-1.45l6.491-6.524-.004-.008" />
                </svg>
              </a>
            )}
          </div>
        )}
    </motion.div>
  );
}
