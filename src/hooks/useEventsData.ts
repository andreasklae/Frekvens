import { useState, useEffect } from 'react';
import type { CollectiveEvent } from '../types';

interface EventsPayload {
  events: CollectiveEvent[];
}

export function useEventsData() {
  const [events, setEvents] = useState<CollectiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/events.json')
      .then((res) => res.json())
      .then((data: EventsPayload) => {
        setEvents(Array.isArray(data.events) ? data.events : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading events data:', error);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  return { events, loading };
}
