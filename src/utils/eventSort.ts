import type { CollectiveEvent } from '../types';

export function sortUpcoming(a: CollectiveEvent, b: CollectiveEvent) {
  return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
}

export function sortPast(a: CollectiveEvent, b: CollectiveEvent) {
  return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
}
