export type Language = 'no' | 'en';

export interface Person {
  id: string;
  alias?: string;
  name?: string;
  role: {
    no: string;
    en: string;
  };
  description?: {
    no: string;
    en: string;
  };
  imageUrl?: string;
  countryCode?: string;
  links?: {
    email?: string;
    instagram?: string;
    tiktok?: string;
    soundcloud?: string;
    residentAdvisor?: string;
  };
}

export interface TranslationStrings {
  nav: {
    mission: string;
    people: string;
    roster: string;
    contact: string;
  };
  hero: {
    tagline: string;
    scroll: string;
  };
  mission: {
    title: string;
    content: string;
  };
  people: {
    title: string;
    subtitle: string;
  };
  roster: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    email: string;
    followUs: string;
  };
  language: {
    toggle: string;
  };
}

export type Translations = {
  [key in Language]: TranslationStrings;
};
