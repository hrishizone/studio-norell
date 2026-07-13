'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface LoaderContextValue {
  isLoading: boolean;
  complete: () => void;
}

const LoaderContext = createContext<LoaderContextValue | null>(null);

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader must be used within LoaderProvider');
  return ctx;
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const value = useMemo(
    () => ({ isLoading, complete: () => setIsLoading(false) }),
    [isLoading],
  );

  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
}
