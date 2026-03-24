/** Returns embed URL for common youtube.com / youtu.be watch links, or null. */
export function toYoutubeEmbedUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;

      const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

      const shortMatch = u.pathname.match(/\/shorts\/([^/?]+)/);
      if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
  } catch {
    return null;
  }

  return null;
}
