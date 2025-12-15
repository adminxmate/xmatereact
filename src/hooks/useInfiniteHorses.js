import { useState, useEffect, useCallback } from 'react';
import { getHorses } from '../api/horseApi';
import _ from 'lodash';

export const useInfiniteHorses = (searchTerm) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadData = async (query, pageNum, append = false) => {
    setLoading(true);
    try {
      const result = await getHorses(query, pageNum);
      const newItems = result.data || [];
      
      setData(prev => append ? [...prev, ...newItems] : newItems);
      setHasMore(newItems.length === 50); // If less than 50, we've reached the end
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const debouncedSearch = _.debounce(() => {
      setPage(1);
      loadData(searchTerm, 1, false);
    }, 500);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const fetchNextPage = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(searchTerm, nextPage, true);
    }
  };

  return { data, loading, fetchNextPage, hasMore };
};