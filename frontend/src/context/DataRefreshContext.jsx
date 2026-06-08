import React, { createContext, useCallback, useContext, useState } from 'react';

const DataRefreshContext = createContext(null);

export function DataRefreshProvider({ children }) {
  const [tick, setTick] = useState({});

  const invalidate = useCallback((keys) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    setTick((prev) => {
      const next = { ...prev };
      keyList.forEach((key) => {
        next[key] = (next[key] || 0) + 1;
      });
      return next;
    });
  }, []);

  return (
    <DataRefreshContext.Provider value={{ tick, invalidate }}>
      {children}
    </DataRefreshContext.Provider>
  );
}

export function useDataRefresh(key) {
  const context = useContext(DataRefreshContext);
  const tick = context?.tick?.[key] || 0;
  const invalidate = context?.invalidate || (() => {});

  return {
    tick,
    invalidate: (keys) => invalidate(keys || key),
  };
}

export function useInvalidate() {
  const context = useContext(DataRefreshContext);
  return context?.invalidate || (() => {});
}
