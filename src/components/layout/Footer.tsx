export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-lastica text-lg text-white">
            FREKVENS
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Frekvens Collective. Oslo, Norway.
          </p>
        </div>
      </div>
    </footer>
  );
}
