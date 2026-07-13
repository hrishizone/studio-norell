'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './shaders';

/**
 * The hero monolith: a shader-displaced icosphere finished like polished
 * bronze, floating and slowly turning above the grid so its reflections
 * drift. Leans subtly toward the pointer.
 */
export function FloatingObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.17 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#241813') }, // deep bronze shadow
      uColorB: { value: new THREE.Color('#d8a878') }, // warm metal highlight
      uColorC: { value: new THREE.Color('#f6efe4') }, // bone specular
      uColorD: { value: new THREE.Color('#b4795a') }, // clay bounce
    }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      mouse.current.lerp(state.pointer, 0.04);
      materialRef.current.uniforms.uMouse.value.copy(mouse.current);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x =
        Math.sin(t * 0.15) * 0.08 + state.pointer.y * 0.08;
      meshRef.current.rotation.z = Math.cos(t * 0.12) * 0.04;
      meshRef.current.position.y = 0.15 + Math.sin(t * 0.5) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.12} position={[0, 0.15, 0]}>
      <icosahedronGeometry args={[1, 72]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
