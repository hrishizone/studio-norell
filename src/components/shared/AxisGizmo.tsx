'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';

/**
 * A tiny orientation gizmo — a nod to a 3D viewport HUD. Purely decorative;
 * it idles with a slow rotation to hint at the live scene beside it.
 */
export function AxisGizmo({ className }: { className?: string }) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const tween = gsap.to(el, {
      rotation: 360,
      transformOrigin: '50% 50%',
      svgOrigin: '32 32',
      duration: 24,
      repeat: -1,
      ease: 'none',
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      <g ref={ref}>
        {/* Z (bone) */}
        <line x1="32" y1="32" x2="32" y2="10" stroke="#f4f1ea" strokeWidth="1" strokeOpacity="0.7" />
        <circle cx="32" cy="10" r="2.5" fill="#f4f1ea" />
        {/* X (clay) */}
        <line x1="32" y1="32" x2="52" y2="44" stroke="#b4795a" strokeWidth="1" />
        <circle cx="52" cy="44" r="2.5" fill="#b4795a" />
        {/* Y (sage) */}
        <line x1="32" y1="32" x2="12" y2="44" stroke="#8a8b7c" strokeWidth="1" />
        <circle cx="12" cy="44" r="2.5" fill="#8a8b7c" />
      </g>
    </svg>
  );
}
