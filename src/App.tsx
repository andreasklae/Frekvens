import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Mission } from './components/sections/Mission';
import { People } from './components/sections/People';
import { Roster } from './components/sections/Roster';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <LanguageProvider>
      <div className="h-full w-full bg-black overflow-y-auto overflow-x-hidden relative">
        <div className="relative z-10">
          <Header />
          <main>
            <Hero />
            <Mission />
            <People />
            <Roster />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
