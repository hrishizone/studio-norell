import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect warns during SSR; swap to useEffect on the server.
 * Used by GSAP setups that must run before paint on the client.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
