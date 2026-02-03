import { useState, useEffect } from 'react';
import type { Person } from '../types';
import { fetchRosterFromGoogleSheets } from '../utils/googleSheets';

export function useRosterData() {
  const [roster, setRoster] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useRosterData: Starting to fetch data...');
    
    fetchRosterFromGoogleSheets()
      .then((data: Person[]) => {
        console.log('useRosterData: Successfully fetched data:', data.length, 'items');
        setRoster(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading roster data from Google Sheets:', error);
        setRoster([]);
        setLoading(false);
      });
  }, []);

  return { roster, loading };
}
