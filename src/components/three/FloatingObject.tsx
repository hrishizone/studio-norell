'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './shaders';

/**
 * The hero sculpture: a shader-displaced icosphere that breathes, rotates
 * slowly and leans gently toward the pointer. Kept smooth + ceramic so it
 * reads as a crafted object floating in space, not a boxed blob.
 */
export function FloatingObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.2 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#7c4d35') }, // shadow clay
      uColorB: { value: new THREE.Color('#c99a7d') }, // body clay
      uColorC: { value: new THREE.Color('#f6efe4') }, // bone rim
      uLight: { value: new THREE.Vector3(0.45, 0.9, 0.65).normalize() },
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
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x =
        Math.sin(t * 0.15) * 0.1 + state.pointer.y * 0.1;
      meshRef.current.rotation.z = Math.cos(t * 0.12) * 0.05;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} scale={1}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
