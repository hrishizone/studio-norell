'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { Chair } from './Chair';
import { GridFloor } from './GridFloor';
import { StudioEnvironment } from './StudioEnvironment';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const BG = '#0b0a09';
const FLOOR_Y = -1.5;

/**
 * The dark "studio" scene: an infinite grid floor fading into fog, a collectible
 * chair presented on it under soft key light with a real contact shadow, and
 * image-based studio reflections. DPR capped; paused under reduced-motion.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 6.4], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      aria-hidden
      frameloop={reduced ? 'demand' : 'always'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <fog attach="fog" args={[BG, 6, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-6, 6, 6, -6, 0.1, 30]} />
      </directionalLight>
      <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#b4795a" />

      <Suspense fallback={null}>
        <StudioEnvironment />
        <GridFloor />
        <Chair floorY={FLOOR_Y} />

        {/* soft contact shadow catcher */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, FLOOR_Y + 0.001, 0]}
          receiveShadow
        >
          <planeGeometry args={[40, 40]} />
          <shadowMaterial transparent opacity={0.45} />
        </mesh>
      </Suspense>
    </Canvas>
  );
}
