'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './shaders';

/**
 * The hero sculpture: a shader-displaced icosphere that breathes, rotates
 * slowly and leans toward the pointer. All motion runs on the GPU.
 */
export function FloatingObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.32 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#8F5B40') }, // clay deep
      uColorB: { value: new THREE.Color('#C79378') }, // clay soft
      uColorC: { value: new THREE.Color('#F4F1EA') }, // bone rim
    }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      // ease pointer influence
      mouse.current.lerp(state.pointer, 0.05);
      materialRef.current.uniforms.uMouse.value.copy(mouse.current);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.12 + state.pointer.y * 0.15;
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.35}>
      <icosahedronGeometry args={[1.15, 42]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
