'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { FloatingObject } from './FloatingObject';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * WebGL canvas hosting the hero sculpture. DPR is capped for performance and
 * the object is skipped entirely under reduced-motion preferences.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      aria-hidden
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={0.6} />
      <Suspense fallback={null}>
        <FloatingObject />
      </Suspense>
    </Canvas>
  );
}
