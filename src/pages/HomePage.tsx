import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/sections/Hero';
import { Mission } from '../components/sections/Mission';
import { InstagramFeed } from '../components/sections/InstagramFeed';
import { HomeEventHighlights } from '../components/sections/HomeEventHighlights';

export function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    requestAnimationFrame(() => {
      el?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [hash]);

  return (
    <>
      <Hero />
      <Mission />
      <InstagramFeed />
      <HomeEventHighlights />
    </>
  );
}
