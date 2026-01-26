import { useState, useEffect } from 'react';
import type { Person } from '../types';

export function usePeopleData() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/people.json')
      .then((res) => res.json())
      .then((data: Person[]) => {
        setPeople(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading people data:', error);
        setPeople([]);
        setLoading(false);
      });
  }, []);

  return { people, loading };
}
