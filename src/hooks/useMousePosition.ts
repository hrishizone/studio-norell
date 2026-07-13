'use client';

import { useEffect, useRef, useState } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks pointer position. `smooth` returns a value updated via rAF-lerp,
 * useful for mouse-following elements that should trail slightly.
 */
export function useMousePosition(smooth = false, ease = 0.12): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const target = useRef<MousePosition>({ x: 0, y: 0 });
  const current = useRef<MousePosition>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!smooth) setPosition(target.current);
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    if (smooth) {
      const tick = () => {
        current.current.x += (target.current.x - current.current.x) * ease;
        current.current.y += (target.current.y - current.current.y) * ease;
        setPosition({ x: current.current.x, y: current.current.y });
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [smooth, ease]);

  return position;
}
