'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { FloatingObject } from './FloatingObject';
import { GridFloor } from './GridFloor';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const BG = '#0b0a09';

/**
 * The dark "studio" scene: an infinite grid floor fading into fog with the
 * polished monolith floating above it. DPR capped; paused under reduced-motion.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      aria-hidden
      frameloop={reduced ? 'demand' : 'always'}
    >
      <fog attach="fog" args={[BG, 5.5, 15]} />
      <ambientLight intensity={0.4} />
      <Suspense fallback={null}>
        <GridFloor />
        <FloatingObject />
      </Suspense>
    </Canvas>
  );
}
