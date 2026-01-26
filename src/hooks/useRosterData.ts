import { useState, useEffect } from 'react';
import type { Person } from '../types';

export function useRosterData() {
  const [roster, setRoster] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/roster.json')
      .then((res) => res.json())
      .then((data: Person[]) => {
        setRoster(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading roster data:', error);
        setRoster([]);
        setLoading(false);
      });
  }, []);

  return { roster, loading };
}
