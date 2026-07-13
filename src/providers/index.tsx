'use client';

import type { ReactNode } from 'react';
import { LoaderProvider } from './LoaderProvider';
import { CursorProvider } from './CursorProvider';
import { SmoothScrollProvider } from './SmoothScrollProvider';

/** Composition root for all client-side context providers. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderProvider>
      <CursorProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </CursorProvider>
    </LoaderProvider>
  );
}
