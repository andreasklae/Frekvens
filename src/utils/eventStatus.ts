import type { CollectiveEvent, CollectiveEventStatus } from '../types';

/**
 * Club nights run past midnight, so an event is not "past" the moment it starts.
 * Without an explicit `endDate` we keep it upcoming for this long after `startDate`.
 */
export const EVENT_LIVE_WINDOW_MS = 8 * 60 * 60 * 1000;

/** Epoch ms when the event stops counting as upcoming, or `NaN` if the dates are unusable. */
export function getEventEndTime(event: CollectiveEvent): number {
  const explicitEnd = event.endDate?.trim();
  if (explicitEnd) {
    const end = new Date(explicitEnd).getTime();
    if (!Number.isNaN(end)) return end;
  }
  const start = new Date(event.startDate).getTime();
  return Number.isNaN(start) ? NaN : start + EVENT_LIVE_WINDOW_MS;
}

/**
 * Derived from the event's date — `status` in the JSON is only a manual override
 * (e.g. to archive an event early). Unparseable dates stay upcoming so a typo
 * never silently hides an event that has not happened yet.
 */
export function getEventStatus(
  event: CollectiveEvent,
  now: number = Date.now()
): CollectiveEventStatus {
  if (event.status) return event.status;
  const end = getEventEndTime(event);
  if (Number.isNaN(end)) return 'upcoming';
  return end <= now ? 'past' : 'upcoming';
}

export function isUpcomingEvent(event: CollectiveEvent, now?: number): boolean {
  return getEventStatus(event, now) === 'upcoming';
}

export function isPastEvent(event: CollectiveEvent, now?: number): boolean {
  return getEventStatus(event, now) === 'past';
}

/**
 * Ticket links, QR codes and the "sale live" badge are only shown while the event
 * is still ahead of us (door sales during the night included).
 */
export function hasLiveTicketing(event: CollectiveEvent, now?: number): boolean {
  return isUpcomingEvent(event, now) && Boolean(event.ticketing?.url?.trim());
}
