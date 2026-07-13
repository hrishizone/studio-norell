'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type CursorVariant = 'default' | 'hover' | 'view' | 'drag' | 'hidden';

interface CursorContextValue {
  variant: CursorVariant;
  label: string;
  setCursor: (variant: CursorVariant, label?: string) => void;
  reset: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursor must be used within CursorProvider');
  return ctx;
}

/** Convenience props to attach cursor states to any interactive element. */
export function useCursorHandlers(variant: CursorVariant, label = '') {
  const { setCursor, reset } = useCursor();
  return {
    onPointerEnter: () => setCursor(variant, label),
    onPointerLeave: reset,
  };
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');

  const setCursor = useCallback((next: CursorVariant, nextLabel = '') => {
    setVariant(next);
    setLabel(nextLabel);
  }, []);

  const reset = useCallback(() => {
    setVariant('default');
    setLabel('');
  }, []);

  const value = useMemo(
    () => ({ variant, label, setCursor, reset }),
    [variant, label, setCursor, reset],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}
