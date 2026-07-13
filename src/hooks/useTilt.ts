'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';

/**
 * Pointer-driven 3D tilt. Returns a ref + handlers that lean an element toward
 * the cursor with eased motion. Disabled under reduced-motion.
 */
export function useTilt<T extends HTMLElement>(max = 9) {
  const ref = useRef<T>(null);
  const rotX = useRef<((v: number) => void) | null>(null);
  const rotY = useRef<((v: number) => void) | null>(null);
  const enabled = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    enabled.current = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled.current) return;

    gsap.set(el, { transformPerspective: 900, transformOrigin: 'center' });
    rotX.current = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    rotY.current = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
  }, []);

  const onPointerMove = (e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el || !enabled.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotX.current?.(-py * max);
    rotY.current?.(px * max);
  };

  const onPointerLeave = () => {
    rotX.current?.(0);
    rotY.current?.(0);
  };

  return { ref, onPointerMove, onPointerLeave };
}
