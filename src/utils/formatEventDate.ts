import type { Language } from '../types';

/** Localized date + time for event headers (nb-NO / en-GB). */
export function formatEventDateTime(iso: string, language: Language): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = language === 'no' ? 'nb-NO' : 'en-GB';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
