'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { FloatingObject } from './FloatingObject';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * WebGL canvas hosting the hero sculpture. The camera is pulled back so the
 * object floats with air around it (never clipping the canvas edges). DPR is
 * capped for performance and animation is paused under reduced-motion.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      aria-hidden
      frameloop={reduced ? 'demand' : 'always'}
    >
      <Suspense fallback={null}>
        <FloatingObject />
      </Suspense>
    </Canvas>
  );
}
