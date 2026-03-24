import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { MainLayout } from './components/layout/MainLayout';
import { EventDetailLayout } from './components/layout/EventDetailLayout';
import { HomePage } from './pages/HomePage';
import { PeoplePage } from './pages/PeoplePage';
import { EventsPage } from './pages/EventsPage';

function ScrollToTop({ scrollContainerRef }: { scrollContainerRef: React.RefObject<HTMLElement | null> }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === '/' && hash) {
      return;
    }
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, scrollContainerRef]);

  return null;
}

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <LanguageProvider>
      <div
        ref={scrollContainerRef}
        className="h-full w-full bg-black overflow-y-auto overflow-x-hidden relative flex flex-col min-h-screen"
      >
        <div className="relative z-10 flex flex-col flex-1">
          <ScrollToTop scrollContainerRef={scrollContainerRef} />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/events" element={<EventsPage />} />
            </Route>
            <Route path="/events/:slug" element={<EventDetailLayout />} />
          </Routes>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
