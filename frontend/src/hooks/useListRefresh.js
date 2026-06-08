import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDataRefresh } from '../context/DataRefreshContext';

/**
 * Re-fetches list data when navigating (back/forward) or after cache invalidation.
 */
export function useListRefresh(refreshKey, fetchFn) {
  const location = useLocation();
  const { tick } = useDataRefresh(refreshKey);

  useEffect(() => {
    fetchFn();
  }, [location.key, tick]);
}
