'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { LivingRoom } from './LivingRoom';
import { StudioEnvironment } from './StudioEnvironment';
import { Dust } from './Dust';
import { orbitState } from './orbitState';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const BG = '#0b0a09';
const TARGET: [number, number, number] = [0, 0.62, -0.9];

/**
 * Feeds live orientation to the HUD and, when the viewer isn't dragging, eases
 * the camera into a gentle idle sway so the room quietly breathes.
 */
function CameraRig({
  controls,
  reduced,
}: {
  controls: React.RefObject<OrbitControlsImpl | null>;
  reduced: boolean;
}) {
  useFrame((state) => {
    const c = controls.current;
    if (!c) return;
    orbitState.azimuthDeg = THREE.MathUtils.radToDeg(c.getAzimuthalAngle());
    orbitState.polarDeg = THREE.MathUtils.radToDeg(c.getPolarAngle());

    if (!orbitState.dragging && !reduced) {
      const t = state.clock.getElapsedTime();
      const targetAz = Math.sin(t * 0.11) * 0.2;
      c.setAzimuthalAngle(THREE.MathUtils.lerp(c.getAzimuthalAngle(), targetAz, 0.012));
      c.update();
    }
  });
  return null;
}

/**
 * The dark "gallery" staging: a warm, lived-in living room lit by a low sun
 * through a side window, with soft shadows, image-based reflections and drifting
 * dust. Drag to explore; it idles with a slow sway.
 */
export function HeroScene() {
  const reduced = usePrefersReducedMotion();
  const controls = useRef<OrbitControlsImpl | null>(null);
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.05, 6.1], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      frameloop={reduced ? 'demand' : 'always'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <fog attach="fog" args={[BG, 9, 22]} />
      <ambientLight intensity={0.28} />
      {/* low warm sun through the window */}
      <directionalLight
        position={[-6, 5, 2]}
        intensity={2.6}
        color="#ffd9a8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
      </directionalLight>
      <directionalLight position={[5, 4, 4]} intensity={0.4} color="#9fb0c0" />

      <Suspense fallback={null}>
        <StudioEnvironment />
        <LivingRoom />
        <Dust />
      </Suspense>

      <OrbitControls
        ref={controls}
        makeDefault
        target={TARGET}
        enabled={!isTouch}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.32}
        maxPolarAngle={Math.PI * 0.52}
        minAzimuthAngle={-0.5}
        maxAzimuthAngle={0.5}
        onStart={() => {
          orbitState.dragging = true;
        }}
        onEnd={() => {
          orbitState.dragging = false;
        }}
      />
      <CameraRig controls={controls} reduced={reduced} />
    </Canvas>
  );
}
