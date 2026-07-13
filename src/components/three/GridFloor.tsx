'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * An infinite architectural grid floor. Warm line-work receding into fog —
 * the "drafting table" the sculpture is presented on. Drifts slowly toward the
 * camera to feel endless.
 */
export function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const mat = grid.material as THREE.LineBasicMaterial;
    mat.transparent = true;
    mat.opacity = 0.32;
    mat.fog = true;
    mat.depthWrite = false;
  }, []);

  useFrame((_, delta) => {
    if (!gridRef.current) return;
    // cell size = 60 / 60 = 1 unit; loop the drift over one cell.
    gridRef.current.position.z = (gridRef.current.position.z + delta * 0.25) % 1;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[60, 60, '#8a6f5c', '#4a3b31']}
      position={[0, -1.5, 0]}
    />
  );
}
