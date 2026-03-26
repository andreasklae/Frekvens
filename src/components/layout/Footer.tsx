import { ContactBlock } from '../sections/Contact';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent border-t border-dark-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
        <div id="contact" className="scroll-mt-24 sm:scroll-mt-28">
          <ContactBlock />
        </div>
      </div>
      <div className="border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-lastica text-lg text-white">FREKVENS</div>
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Frekvens Collective. Oslo, Norway.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
