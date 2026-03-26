import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex cursor-pointer select-none items-center gap-1 rounded-full bg-dark-800 p-1">
      <button
        type="button"
        onClick={() => setLanguage('no')}
        className={`cursor-pointer select-none rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
          language === 'no'
            ? 'bg-primary text-white shadow-glow-sm'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        NO
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`cursor-pointer select-none rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
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
