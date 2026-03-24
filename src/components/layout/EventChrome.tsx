import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

export function EventChrome() {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/72 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-dark-900/55">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        <Link
          to="/events"
          className="inline-flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:text-white [&_svg]:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
          {t.events.back}
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}
