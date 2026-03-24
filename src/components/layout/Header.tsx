import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

export function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const goContact = () => {
    setIsMobileMenuOpen(false);
    scrollToSection('#contact');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/72 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-dark-900/55">
      <div className="relative h-16 sm:h-20 w-full max-w-[100vw] px-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="absolute left-3 sm:left-6 lg:left-8 top-1/2 z-10 max-w-[min(11rem,46vw)] -translate-y-1/2 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-lastica text-base text-white transition-all duration-300 hover:glow-text-subtle sm:max-w-none sm:text-lg md:text-xl lg:text-2xl"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          FREKVENS
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-2 lg:gap-3 pointer-events-auto"
          aria-label="Main"
        >
          <Link
            to="/events"
            className="cursor-pointer select-none whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium text-gray-300 transition-all duration-200 hover:text-white hover:glow-text-subtle"
          >
            {t.nav.events}
          </Link>
          <Link
            to="/people"
            className="cursor-pointer select-none whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium text-gray-300 transition-all duration-200 hover:text-white hover:glow-text-subtle"
          >
            {t.nav.people}
          </Link>
          <button
            type="button"
            onClick={goContact}
            className="cursor-pointer select-none whitespace-nowrap rounded-lg px-4 py-2.5 text-base font-medium text-gray-300 transition-all duration-200 hover:text-white hover:glow-text-subtle"
          >
            {t.nav.contact}
          </button>
        </nav>

        <div className="absolute right-3 sm:right-6 lg:right-8 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 sm:gap-4">
          <LanguageToggle />

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer select-none p-2.5 text-gray-300 hover:text-white md:hidden [&_svg]:pointer-events-none"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          className="bg-dark-900/85 backdrop-blur-xl backdrop-saturate-150 md:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto max-w-7xl px-3 pb-4 pt-2 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1">
              <Link
                to="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer select-none rounded-lg px-4 py-3.5 text-base font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {t.nav.events}
              </Link>
              <Link
                to="/people"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer select-none rounded-lg px-4 py-3.5 text-base font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {t.nav.people}
              </Link>
              <button
                type="button"
                onClick={goContact}
                className="cursor-pointer select-none rounded-lg px-4 py-3.5 text-left text-base font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
              >
                {t.nav.contact}
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
