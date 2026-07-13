'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** A warm plaster + oak room shell with a coffee table, floor lamp, plant and art. */
export function Room() {
  const lampGlow = useRef<THREE.PointLight>(null);
  const shade = useRef<THREE.MeshStandardMaterial>(null);

  // Subtle lamp "breathing" — the room feels lived-in.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const flicker = 1 + Math.sin(t * 1.6) * 0.04 + Math.sin(t * 4.3) * 0.02;
    if (lampGlow.current) lampGlow.current.intensity = 6 * flicker;
    if (shade.current) shade.current.emissiveIntensity = 1.6 * flicker;
  });

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#5f4630" roughness={0.72} metalness={0} />
      </mesh>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.4]} receiveShadow>
        <planeGeometry args={[4.2, 3]} />
        <meshStandardMaterial color="#b98e6f" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, -0.4]} receiveShadow>
        <planeGeometry args={[3.9, 2.7]} />
        <meshStandardMaterial color="#a67a5b" roughness={0.95} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.4, -3.1]} receiveShadow>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial color="#d9cfbe" roughness={1} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-5, 2.4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#cfc4b2" roughness={1} />
      </mesh>
      {/* Right wall (encloses the room) */}
      <mesh position={[5, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#cabfad" roughness={1} />
      </mesh>

      {/* Window (bright warm panel) on the left wall */}
      <mesh position={[-4.96, 1.9, -1.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.6, 2.4]} />
        <meshStandardMaterial
          color="#fff3e0"
          emissive="#ffd9a0"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      {/* Wall art (two framed panels) */}
      {[-1.4, 1.4].map((x) => (
        <group key={x} position={[x, 2.5, -3.06]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 1.5, 0.05]} />
            <meshStandardMaterial color="#2a241f" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.92, 1.32]} />
            <meshStandardMaterial color={x < 0 ? '#c08a63' : '#8a8b7c'} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Coffee table */}
      <group position={[0, 0, -0.3]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.07, 0.72]} />
          <meshStandardMaterial color="#e8e2d6" roughness={0.35} metalness={0.05} />
        </mesh>
        {[
          [-0.62, -0.3],
          [0.62, -0.3],
          [-0.62, 0.3],
          [0.62, 0.3],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.2, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
            <meshStandardMaterial color="#3a2e24" roughness={0.4} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Floor lamp */}
      <group position={[-2.3, 0, -1.5]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
          <meshStandardMaterial color="#2a2420" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.8, 12]} />
          <meshStandardMaterial color="#8a6b48" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.72, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.32, 24, 1, true]} />
          <meshStandardMaterial
            ref={shade}
            color="#f0e2c8"
            emissive="#ffcf8a"
            emissiveIntensity={1.6}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
        <pointLight
          ref={lampGlow}
          position={[0, 1.7, 0]}
          intensity={6}
          distance={6}
          decay={2}
          color="#ffbf80"
          castShadow
        />
      </group>

      {/* Potted plant / topiary */}
      <group position={[3.15, 0, -2.5]} scale={0.92}>
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.44, 20]} />
          <meshStandardMaterial color="#b9a68a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <icosahedronGeometry args={[0.34, 2]} />
          <meshStandardMaterial color="#6f7360" roughness={1} flatShading />
        </mesh>
        <mesh position={[0.06, 1.02, 0.02]} castShadow>
          <icosahedronGeometry args={[0.22, 2]} />
          <meshStandardMaterial color="#7c8069" roughness={1} flatShading />
        </mesh>
      </group>
    </group>
  );
}
