import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useEventsData } from '../hooks/useEventsData';
import { toYoutubeEmbedUrl } from '../utils/youtube';
import { ResidentAdvisorMark } from '../components/ui/ResidentAdvisorMark';
import { EventGallerySection } from '../components/events/EventGallerySection';
import { EventIconWhen, EventIconWhere } from '../components/events/EventDetailMetaIcons';
import { formatEventDateTime } from '../utils/formatEventDate';

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { events, loading } = useEventsData();
  const [posterFailed, setPosterFailed] = useState(false);

  const event = useMemo(() => events.find((e) => e.slug === slug), [events, slug]);
  const posterSrc = event?.posterUrl?.trim() ?? '';
  const galleryBackdropSrc =
    event?.galleryBackgroundUrl?.trim() || posterSrc || '';
  const showPoster = posterSrc.length > 0 && !posterFailed;

  useEffect(() => {
    setPosterFailed(false);
  }, [posterSrc]);

  const embedUrl = event?.youtubeUrl?.trim()
    ? toYoutubeEmbedUrl(event.youtubeUrl.trim())
    : null;

  const galleryUrls = useMemo(
    () => (event?.galleryImageUrls ?? []).map((u) => u.trim()).filter(Boolean),
    [event?.galleryImageUrls]
  );

  const formattedDateTime = useMemo(() => {
    if (!event) return '';
    return formatEventDateTime(event.startDate, language);
  }, [event, language]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-400 px-4 pt-20">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 pt-20 text-center">
        <p className="text-gray-400">{t.events.notFound}</p>
        <Link
          to="/events"
          className="text-primary text-sm font-medium hover:glow-text-subtle transition-all"
        >
          {t.events.back}
        </Link>
      </div>
    );
  }

  const title = event.title[language];
  const description = event.description[language];
  const locationLine = event.locationLine[language];

  return (
    <article className="pb-20 sm:pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <div className="mb-8 sm:mb-10">
          {showPoster ? (
            <img
              src={posterSrc}
              alt=""
              className="mx-auto block h-auto w-full max-w-3xl max-h-[min(72vh,640px)] object-contain"
              loading="eager"
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <div className="flex min-h-[12rem] items-center justify-center px-6 py-12">
              <span className="text-center text-gray-500 font-medium">{title}</span>
            </div>
          )}
        </div>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">{title}</h1>
          {event.status === 'past' ? (
            <p className="mb-3">
              <span className="inline-block rounded-md border border-dark-600 bg-dark-800/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {t.events.eventPastBadge}
              </span>
            </p>
          ) : event.ticketing.kind === 'vipps' ? (
            <p className="mb-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-primary/60 bg-primary/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
                {t.events.ticketSaleLive}
              </span>
            </p>
          ) : null}
          <ul className="flex flex-col gap-3 text-primary/90 text-sm sm:text-base font-medium">
            <li className="flex items-center gap-3">
              <EventIconWhen className="h-[1.125rem] w-[1.125rem] shrink-0 text-primary/55" />
              <time dateTime={event.startDate}>{formattedDateTime}</time>
            </li>
            <li className="flex items-start gap-3">
              <EventIconWhere className="mt-[0.2em] h-[1.125rem] w-[1.125rem] shrink-0 text-primary/55" />
              <span className="leading-snug">{locationLine}</span>
            </li>
          </ul>
          {event.collaborator && (
            <p className="mt-4 text-sm text-gray-400">
              {t.events.collaboratorPrefix}{' '}
              <a
                href={event.collaborator.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:glow-text-subtle transition-all"
              >
                {event.collaborator.name}
              </a>
            </p>
          )}

          {event.ticketing.kind === 'vipps' && (
            <div className="mt-6 flex flex-col items-center gap-4 sm:items-start">
              <p className="max-w-md text-sm text-gray-400 leading-relaxed text-center sm:text-left">
                {t.events.ticketsNote}
              </p>
              {event.ticketing.qrUrl?.trim() && (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={event.ticketing.qrUrl.trim()}
                    alt=""
                    className="h-44 w-44 rounded-xl bg-white p-2.5"
                    loading="lazy"
                  />
                  <p className="text-xs text-gray-500">{t.events.vippsScan}</p>
                </div>
              )}
              <a
                href={event.ticketing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-900 px-5 py-3 text-white hover:border-primary/50 transition-all duration-300 hover:glow-border"
              >
                <span className="text-sm font-medium">{t.events.ticketsVipps}</span>
                <ExternalLink className="w-4 h-4 text-gray-500" aria-hidden />
              </a>
            </div>
          )}
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-10"
        >
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">{description}</p>
        </motion.div>

        {(event.ticketing.kind !== 'vipps' || (event.youtubeUrl && embedUrl)) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            {event.ticketing.kind === 'partiful' ? (
              <a
                href={event.ticketing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-dark-600 bg-dark-900 px-5 py-3 hover:border-primary/50 transition-all duration-300 hover:glow-border"
              >
                <img
                  src="/images/partiful-logo.png"
                  alt="Partiful"
                  className="h-10 sm:h-12 w-auto max-w-[200px] object-contain"
                />
              </a>
            ) : event.ticketing.kind === 'residentAdvisor' ? (
              <a
                href={event.ticketing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-900 px-5 py-3 text-white hover:border-primary/50 transition-all duration-300 hover:glow-border"
              >
                <ResidentAdvisorMark className="h-8 w-auto text-gray-200" />
                <span className="text-sm font-medium">{t.events.ticketsRa}</span>
                <ExternalLink className="w-4 h-4 text-gray-500" aria-hidden />
              </a>
            ) : null}

            {event.youtubeUrl && embedUrl && (
              <a
                href={event.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                {t.events.watchYoutube}
              </a>
            )}
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          aria-labelledby="event-gallery-heading"
        >
          <h2 id="event-gallery-heading" className="text-xl font-bold text-white mb-6">
            {t.events.galleryTitle}
          </h2>

          {embedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mb-10 rounded-xl overflow-hidden border border-dark-600 bg-black aspect-video"
            >
              <iframe
                title={title}
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          )}

          {galleryUrls.length > 0 ? (
            <EventGallerySection
              urls={galleryUrls}
              backdropUrl={galleryBackdropSrc || null}
              gridTitle={t.events.galleryGridTitle}
              thumbnailShowLabel={t.events.galleryThumbnailShowInCarousel}
            />
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">{t.events.galleryEmpty}</p>
          )}
        </motion.section>
      </div>
    </article>
  );
}
