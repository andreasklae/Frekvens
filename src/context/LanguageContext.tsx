import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language, TranslationStrings } from '../types';
import { translations } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'frekvens-language';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'no';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'no' || saved === 'en') return saved;

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('no') || browserLang.startsWith('nb') || browserLang.startsWith('nn')) {
    return 'no';
  }

  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('no');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLanguageState(getInitialLanguage());
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const t = translations[language];

  if (!mounted) {
    return <div className="min-h-screen bg-dark-900" />;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
