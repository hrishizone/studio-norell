'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface ChairProps {
  /** floor height the chair should rest on */
  floorY?: number;
  scale?: number;
}

/**
 * The hero object: a real collectible lounge chair (glTF, PBR + sheen fabric).
 * The model is recentred and dropped onto the grid floor, casts a soft shadow,
 * turns slowly and leans toward the pointer like a piece on a turntable.
 */
export function Chair({ floorY = -1.5, scale = 3.1 }: ChairProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/models/chair.glb');

  // Clone so we can safely mutate materials / transforms.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useLayoutEffect(() => {
    // Recentre on X/Z and sit the base at local y = 0.
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.x -= center.x;
    scene.position.z -= center.z;
    scene.position.y -= box.min.y;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && 'envMapIntensity' in mat) mat.envMapIntensity = 1.1;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y += delta * 0.18;
    // subtle pointer lean
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.04, 0.05);
  });

  return (
    <group ref={groupRef} position={[0, floorY, 0]} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
