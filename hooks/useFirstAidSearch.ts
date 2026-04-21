import { useState, useEffect, useCallback } from 'react';
import { searchFirstAid, seedFirstAidDB, FirstAidRow } from '../data/db/firstAidDb';

export type ParsedTopic = {
  id: string;
  title: string;
  shortDescription: string;
  instructions: string[];
  warnings: string[];
  category: string;
};

const parseRow = (row: FirstAidRow): ParsedTopic => ({
  id: row.id,
  title: row.title,
  shortDescription: row.short_description,
  instructions: JSON.parse(row.instructions_json),
  warnings: JSON.parse(row.warnings_json),
  category: row.category,
});

export function useFirstAidSearch() {
  const [topics, setTopics] = useState<ParsedTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  // Seed on mount
  useEffect(() => {
    seedFirstAidDB()
      .then(() => setIsReady(true))
      .catch(err => {
        console.warn('[FirstAid] Seed failed, will use fallback', err);
        setIsReady(true);
      });
  }, []);

  // Search whenever query/category/ready changes
  const runSearch = useCallback(async () => {
    if (!isReady) return;
    setIsLoading(true);
    try {
      const rows = await searchFirstAid(query, category);
      setTopics(rows.map(parseRow));
    } catch (e) {
      console.warn('[FirstAid] Search failed', e);
    } finally {
      setIsLoading(false);
    }
  }, [query, category, isReady]);

  useEffect(() => {
    const timeout = setTimeout(runSearch, query ? 200 : 0); // debounce
    return () => clearTimeout(timeout);
  }, [runSearch]);

  return { topics, isLoading, query, setQuery, category, setCategory };
}
