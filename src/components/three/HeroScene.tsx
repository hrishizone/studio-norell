'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  HueSaturation,
  BrightnessContrast,
  SMAA,
} from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { LivingRoom } from './LivingRoom';
import { StudioEnvironment } from './StudioEnvironment';
import { Dust } from './Dust';
import { orbitState } from './orbitState';
import { heroHotspots } from '@/cms/content';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const BG = '#0b0a09';
const IDLE_TARGET: [number, number, number] = [0, 0.72, -1.0];

interface HeroSceneProps {
  focusIndex: number | null;
  onSelect: (index: number) => void;
}

const tmpPos = new THREE.Vector3();
const tmpTgt = new THREE.Vector3();

/**
 * Directs the camera: eases toward a piece's framing when focused, otherwise
 * gently sways. Also publishes orientation to the HUD.
 */
function CameraDirector({
  controls,
  focusIndex,
  reduced,
}: {
  controls: React.RefObject<OrbitControlsImpl | null>;
  focusIndex: number | null;
  reduced: boolean;
}) {
  const { camera } = useThree();

  useFrame((state) => {
    const c = controls.current;
    if (!c) return;
    orbitState.azimuthDeg = THREE.MathUtils.radToDeg(c.getAzimuthalAngle());
    orbitState.polarDeg = THREE.MathUtils.radToDeg(c.getPolarAngle());

    if (focusIndex !== null) {
      // Drive the camera directly (bypass OrbitControls clamps) for exact framing.
      const w = heroHotspots[focusIndex];
      camera.position.lerp(tmpPos.set(...w.camPos), 0.06);
      c.target.lerp(tmpTgt.set(...w.camTarget), 0.06);
      camera.lookAt(c.target);
      return;
    }

    if (!orbitState.dragging && !reduced) {
      const t = state.clock.getElapsedTime();
      const targetAz = Math.sin(t * 0.11) * 0.2;
      c.setAzimuthalAngle(THREE.MathUtils.lerp(c.getAzimuthalAngle(), targetAz, 0.012));
      c.target.lerp(tmpTgt.set(...IDLE_TARGET), 0.04);
      c.update();
    }
  });
  return null;
}

/**
 * The dark "gallery" staging: a warm, fully-dressed living room lit by a low sun
 * through a side window, graded with a cinematic post-processing stack. Drag to
 * explore; click a piece to focus it; it idles with a slow sway.
 */
export function HeroScene({ focusIndex, onSelect }: HeroSceneProps) {
  const reduced = usePrefersReducedMotion();
  const controls = useRef<OrbitControlsImpl | null>(null);
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const canOrbit = focusIndex === null && !isTouch;

  // Keep depth-of-field focused on whatever we're looking at so the focused
  // piece stays razor sharp — only the background falls off.
  const dofTarget = useMemo(() => {
    const p = focusIndex !== null ? heroHotspots[focusIndex].camTarget : IDLE_TARGET;
    return new THREE.Vector3(p[0], p[1], p[2]);
  }, [focusIndex]);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.85, 6.3], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      className="!absolute inset-0"
      frameloop={reduced ? 'demand' : 'always'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.92;
      }}
    >
      <fog attach="fog" args={[BG, 11, 26]} />
      <ambientLight intensity={0.35} />
      {/* low warm sun through the window */}
      <directionalLight
        position={[-6, 5, 2]}
        intensity={1.9}
        color="#ffce9c"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 0.1, 34]} />
      </directionalLight>
      <directionalLight position={[5, 4, 4]} intensity={0.3} color="#9fb0c0" />

      <Suspense fallback={null}>
        <StudioEnvironment />
        <LivingRoom focusIndex={focusIndex} onSelect={onSelect} />
        <Dust />
      </Suspense>

      <OrbitControls
        ref={controls}
        makeDefault
        target={IDLE_TARGET}
        enabled={canOrbit}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.34}
        maxPolarAngle={Math.PI * 0.5}
        minAzimuthAngle={-0.9}
        maxAzimuthAngle={0.9}
        onStart={() => {
          orbitState.dragging = true;
        }}
        onEnd={() => {
          orbitState.dragging = false;
        }}
      />
      <CameraDirector controls={controls} focusIndex={focusIndex} reduced={reduced} />

      <EffectComposer multisampling={4}>
        <DepthOfField
          target={dofTarget}
          focalLength={0.018}
          bokehScale={focusIndex !== null ? 2 : 0.8}
        />
        <Bloom intensity={0.42} luminanceThreshold={0.9} luminanceSmoothing={0.2} mipmapBlur />
        <HueSaturation saturation={0.05} />
        <BrightnessContrast brightness={-0.03} contrast={0.12} />
        <Vignette eskil={false} offset={0.26} darkness={0.78} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
