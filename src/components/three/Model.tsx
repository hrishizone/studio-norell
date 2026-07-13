'use client';

import { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  /** recentre on X/Z and sit the base at local y = 0 */
  grounded?: boolean;
  envIntensity?: number;
}

/**
 * Loads a glTF, clones it, grounds + centres it, and enables shadows. A single
 * reusable wrapper for every furniture piece in the room.
 */
export function Model({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  grounded = true,
  envIntensity = 1,
}: ModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    if (grounded) {
      const box = new THREE.Box3().setFromObject(cloned);
      const center = box.getCenter(new THREE.Vector3());
      cloned.position.x -= center.x;
      cloned.position.z -= center.z;
      cloned.position.y -= box.min.y;
    }
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && 'envMapIntensity' in mat) mat.envMapIntensity = envIntensity;
      }
    });
  }, [cloned, grounded, envIntensity]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload('/models/GlamVelvetSofa.glb');
useGLTF.preload('/models/chair.glb');
useGLTF.preload('/models/IridescentDishWithOlives.glb');
