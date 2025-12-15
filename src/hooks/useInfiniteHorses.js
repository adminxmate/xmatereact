import { useState, useEffect, useCallback } from 'react';
import { fetchHorses } from '../api/horseApi';
import _ from 'lodash';

export const useInfiniteHorses = (searchTerm) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadData = async (query, pageNum, append = false) => {
    if (loading) return;
    setLoading(true);
    
    const result = await fetchHorses({ search: query, page: pageNum, limit: 50 });
    
    setItems(prev => append ? [...prev, ...result.data] : result.data);
    setHasMore(result.data.length === 50);
    setLoading(false);
  };

  // Debounced search to prevent API spamming
  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setPage(1);
      loadData(query, 1, false);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const fetchNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(searchTerm, nextPage, true);
    }
  };

  return { items, loading, fetchNextPage };
};