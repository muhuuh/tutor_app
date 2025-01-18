import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Report {
  trainings: string[];
  class_content: string[];
  online_content: string[];
  wrong_questions: string[];
  unclear_concepts: string[];
}

export function useReport(reportId: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('report')
          .eq('id', reportId)
          .single();

        if (error) throw error;
        setReport(data.report as Report);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch report'));
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [reportId]);

  return { report, loading, error };
}