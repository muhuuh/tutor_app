import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Pupil } from '../types/database';

export function usePupils() {
  const [pupils, setPupils] = useState<Pupil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPupils = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pupils')
        .select('*')
        .order('name');

      if (error) throw error;
      setPupils(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pupils'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPupils();
  }, [fetchPupils]);

  return { pupils, loading, error, refetch: fetchPupils };
}