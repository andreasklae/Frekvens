import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-dark-800 rounded-full p-1">
      <button
        onClick={() => setLanguage('no')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          language === 'no'
            ? 'bg-primary text-white shadow-glow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        NO
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'bg-primary text-white shadow-glow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
