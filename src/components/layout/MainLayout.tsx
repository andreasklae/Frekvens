import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
