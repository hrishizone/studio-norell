'use client';

import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from './useMediaQuery';

interface MagneticOptions {
  strength?: number;
  radius?: number;
}

/**
 * Magnetic hover: the target element eases toward the cursor while inside it.
 * Returns handlers to spread onto the interactive element.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.35,
  radius = 1,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  const handleMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(ref.current, {
        x: relX * strength * radius,
        y: relY * strength * radius,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    [reduced, strength, radius],
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.35)',
    });
  }, []);

  return {
    ref,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
  };
}
