'use client';

import { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MAP_KEYS = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'emissiveMap',
  'sheenColorMap',
  'sheenRoughnessMap',
  'clearcoatMap',
] as const;

interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  /** recentre on X/Z and sit the base at local y = 0 */
  grounded?: boolean;
  envIntensity?: number;
  /** retint every material toward this colour (for palette harmony) */
  colorOverride?: string;
  /** normalise the model to this height (metres) regardless of source scale */
  fitHeight?: number;
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
  colorOverride,
  fitHeight,
}: ModelProps) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  useLayoutEffect(() => {
    if (fitHeight) {
      const raw = new THREE.Box3().setFromObject(cloned);
      const size = raw.getSize(new THREE.Vector3());
      const s = fitHeight / (size.y || 1);
      cloned.scale.multiplyScalar(s);
    }
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
        // Crisp textures at grazing angles: max anisotropy + trilinear mips.
        if (mat) {
          for (const key of MAP_KEYS) {
            const tex = (mat as unknown as Record<string, THREE.Texture | null>)[key];
            if (tex && tex.isTexture) {
              tex.anisotropy = maxAniso;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              tex.generateMipmaps = true;
              tex.needsUpdate = true;
            }
          }
        }
        if (mat && colorOverride && mat.color) {
          mat.color.set(colorOverride);
          if ('sheenColor' in mat && (mat as THREE.MeshPhysicalMaterial).sheenColor) {
            (mat as THREE.MeshPhysicalMaterial).sheenColor.set(colorOverride);
          }
        }
      }
    });
  }, [cloned, grounded, envIntensity, colorOverride, fitHeight, maxAniso]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload('/models/GlamVelvetSofa.glb');
useGLTF.preload('/models/chair.glb');
useGLTF.preload('/models/IridescentDishWithOlives.glb');
useGLTF.preload('/models/BoomBox.glb');
useGLTF.preload('/models/AntiqueCamera.glb');
useGLTF.preload('/models/Duck.glb');
