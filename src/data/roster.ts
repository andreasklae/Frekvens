import type { Person } from '../types';

export const roster: Person[] = [
  {
    id: 'artist-placeholder-1',
    name: 'Artist Navn',
    role: {
      no: 'DJ / Produsent',
      en: 'DJ / Producer',
    },
    description: {
      no: 'Beskrivelse kommer',
      en: 'Description coming soon',
    },
    imageUrl: undefined,
    links: {
      soundcloud: 'https://soundcloud.com/',
      residentAdvisor: 'https://ra.co/',
    },
  },
];
