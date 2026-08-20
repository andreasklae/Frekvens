export type Language = 'no' | 'en';

export type CollectiveEventStatus = 'upcoming' | 'past';
export type TicketingKind = 'partiful' | 'residentAdvisor' | 'vipps';

export interface CollectiveEvent {
  slug: string;
  /**
   * Optional manual override. Normally omitted — the status is derived from the
   * dates by `getEventStatus()` in `src/utils/eventStatus.ts`.
   */
  status?: CollectiveEventStatus;
  title: { no: string; en: string };
  description: { no: string; en: string };
  locationLine: { no: string; en: string };
  startDate: string;
  /** Optional end time. Defaults to `startDate` + 8h when deciding upcoming vs past. */
  endDate?: string | null;
  /** Path under `public/` (e.g. `/images/events/my-event/poster.jpg`) or any image URL. */
  posterUrl?: string | null;
  /** Optional carousel backdrop; if unset, the poster is used behind gallery slides. */
  galleryBackgroundUrl?: string | null;
  /**
   * Relative to `public/images/events/` (e.g. `frekvens_00/gallery`).
   * When set, `npm run sync-gallery` (and dev/build) fills `galleryImageUrls` from that folder.
   */
  galleryDir?: string | null;
  /** Populated automatically when `galleryDir` is set; otherwise list URLs manually. */
  galleryImageUrls?: string[];
  youtubeUrl?: string | null;
  /** Optional co-host / collaborating collective shown as a link on the detail page. */
  collaborator?: { name: string; url: string } | null;
  /** `qrUrl` is shown alongside the ticket link for `vipps` (scan-to-pay). */
  ticketing: { kind: TicketingKind; url: string; qrUrl?: string | null };
}

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
    people: string;
    events: string;
    contact: string;
  };
  hero: {
    tagline: string;
    scroll: string;
    /** CTA button label linking to the soonest upcoming event. */
    nextEvent: string;
    /** CTA button label linking to the most recent past event. */
    lastEvent: string;
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
  instagram: {
    title: string;
    subtitle: string;
    viewOnInstagram: string;
    openProfile: string;
  };
  contact: {
    title: string;
    email: string;
    followUs: string;
  };
  events: {
    pageTitle: string;
    upcoming: string;
    past: string;
    comingSoon: string;
    pastEmpty: string;
    galleryTitle: string;
    /** Heading above the thumbnail grid under the carousel. */
    galleryGridTitle: string;
    /** Thumbnail control: show this image in the main carousel (aria + behavior). */
    galleryThumbnailShowInCarousel: string;
    galleryEmpty: string;
    watchYoutube: string;
    ticketsRa: string;
    /** Vipps ticket button label. */
    ticketsVipps: string;
    /** Caption under the Vipps QR code. */
    vippsScan: string;
    /** Badge shown near the title of an upcoming event with tickets on sale. */
    ticketSaleLive: string;
    /** Note explaining early-bird/limited capacity and door sales. */
    ticketsNote: string;
    /** Prefix before a collaborating collective's name/link. */
    collaboratorPrefix: string;
    notFound: string;
    back: string;
    /** Shown on past event detail pages. */
    eventPastBadge: string;
    /** Home: link to the full events listing. */
    homeAllEvents: string;
  };
  language: {
    toggle: string;
  };
}

export type Translations = {
  [key in Language]: TranslationStrings;
};
