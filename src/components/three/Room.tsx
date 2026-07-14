'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Small procedural helpers                                            */
/* ------------------------------------------------------------------ */

const BOOK_COLORS = ['#7c4d35', '#8a8b7c', '#b98e6f', '#3a2e24', '#c7a07d', '#5f6b5a'];

function BookRow({
  count = 8,
  spacing = 0.16,
  y = 0,
}: {
  count?: number;
  spacing?: number;
  y?: number;
}) {
  const books = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        h: 0.26 + Math.random() * 0.12,
        w: 0.04 + Math.random() * 0.03,
        color: BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)],
        lean: i === count - 1 ? 0.3 : 0,
      })),
    [count],
  );
  let x = 0;
  return (
    <group position={[0, y, 0]}>
      {books.map((b, i) => {
        x += b.w + 0.01;
        return (
          <mesh key={i} position={[x, b.h / 2, 0]} rotation={[0, 0, b.lean]} castShadow>
            <boxGeometry args={[b.w, b.h, 0.22]} />
            <meshStandardMaterial color={b.color} roughness={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

function Vase({ color = '#b98e6f', h = 0.28 }: { color?: string; h?: number }) {
  return (
    <mesh position={[0, h / 2, 0]} castShadow>
      <latheGeometry
        args={[
          Array.from({ length: 10 }).map(
            (_, i) =>
              new THREE.Vector2(
                0.06 + Math.sin((i / 9) * Math.PI) * 0.05,
                (i / 9) * h,
              ),
          ),
          16,
        ]}
      />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

/** Stylised leafy plant — a pot, a few stems and broad tilted leaves. */
function Monstera({ scale = 1 }: { scale?: number }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return {
          pos: [Math.cos(a) * 0.28, 0.7 + i * 0.11, Math.sin(a) * 0.28] as [
            number,
            number,
            number,
          ],
          rot: [Math.random() * 0.6 - 0.3, a, Math.random() * 0.5 + 0.2] as [
            number,
            number,
            number,
          ],
          s: 0.34 + Math.random() * 0.18,
          c: ['#4f6b4a', '#5f7a54', '#6f8560'][i % 3],
        };
      }),
    [],
  );
  return (
    <group scale={scale}>
      {/* pot */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.18, 0.44, 20]} />
        <meshStandardMaterial color="#c7b299" roughness={0.9} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 20]} />
        <meshStandardMaterial color="#241c15" roughness={1} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} position={l.pos} rotation={l.rot}>
          <mesh castShadow scale={[l.s, 0.02, l.s * 1.5]}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color={l.c} roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The room                                                            */
/* ------------------------------------------------------------------ */

export function Room() {
  const lampGlow = useRef<THREE.PointLight>(null);
  const shade = useRef<THREE.MeshStandardMaterial>(null);
  const tableLamp = useRef<THREE.PointLight>(null);
  const tvScreen = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const flicker = 1 + Math.sin(t * 1.6) * 0.04 + Math.sin(t * 4.3) * 0.02;
    if (lampGlow.current) lampGlow.current.intensity = 5.5 * flicker;
    if (shade.current) shade.current.emissiveIntensity = 1.4 * flicker;
    if (tableLamp.current) tableLamp.current.intensity = 1.4 * (1 + Math.sin(t * 2.1) * 0.03);
    if (tvScreen.current) tvScreen.current.emissiveIntensity = 0.8 + Math.sin(t * 0.7) * 0.25;
  });

  return (
    <group>
      {/* ---- Shell ---- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#6a4f37" roughness={0.7} />
      </mesh>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.4]} receiveShadow>
        <planeGeometry args={[4.4, 3.1]} />
        <meshStandardMaterial color="#b39072" roughness={0.98} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, -0.4]} receiveShadow>
        <planeGeometry args={[4.05, 2.75]} />
        <meshStandardMaterial color="#a17c5d" roughness={0.98} />
      </mesh>

      {/* walls */}
      <mesh position={[0, 2.4, -3.1]} receiveShadow>
        <planeGeometry args={[16, 5]} />
        <meshStandardMaterial color="#d9cfbe" roughness={1} />
      </mesh>
      <mesh position={[-5, 2.4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#cfc4b2" roughness={1} />
      </mesh>
      <mesh position={[5, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#cabfad" roughness={1} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, 4.7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#e6ddce" roughness={1} />
      </mesh>
      {/* baseboards */}
      <mesh position={[0, 0.06, -3.06]}>
        <boxGeometry args={[16, 0.12, 0.04]} />
        <meshStandardMaterial color="#efe8db" roughness={0.8} />
      </mesh>

      {/* ---- Window + curtains on the left wall ---- */}
      <group position={[-4.95, 0, -1.1]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.9, 0]}>
          <planeGeometry args={[2.6, 2.4]} />
          <meshStandardMaterial color="#fff3e0" emissive="#ffdca6" emissiveIntensity={1.3} />
        </mesh>
        {/* frame */}
        <mesh position={[0, 1.9, 0.02]}>
          <boxGeometry args={[2.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#efe8db" />
        </mesh>
        <mesh position={[0, 3.1, 0.02]}>
          <boxGeometry args={[2.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#efe8db" />
        </mesh>
        <mesh position={[0, 0.7, 0.02]}>
          <boxGeometry args={[2.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#efe8db" />
        </mesh>
        {/* curtains */}
        {[-1.5, 1.5].map((x) => (
          <mesh key={x} position={[x, 1.9, 0.12]} castShadow>
            <boxGeometry args={[0.5, 2.6, 0.06]} />
            <meshStandardMaterial color="#e8decb" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* ---- Wall art + mirror + clock ---- */}
      {[-1.3, 1.2].map((x, i) => (
        <group key={x} position={[x, 2.55, -3.06]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 1.4, 0.05]} />
            <meshStandardMaterial color="#2a241f" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.84, 1.24]} />
            <meshStandardMaterial color={i === 0 ? '#b98e6f' : '#8a8b7c'} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* round mirror on left wall */}
      <group position={[-4.93, 2.0, 1.4]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <ringGeometry args={[0.52, 0.6, 48]} />
          <meshStandardMaterial color="#8a6b48" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.54, 48]} />
          <meshStandardMaterial color="#c9c4bb" metalness={0.9} roughness={0.05} />
        </mesh>
      </group>
      {/* wall clock */}
      <mesh position={[0, 3.4, -3.05]}>
        <circleGeometry args={[0.22, 40]} />
        <meshStandardMaterial color="#efe8db" />
      </mesh>

      {/* ---- Coffee table ---- */}
      <group position={[0, 0, -0.3]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.08, 0.78]} />
          <meshStandardMaterial color="#e8e2d6" roughness={0.35} metalness={0.05} />
        </mesh>
        {[
          [-0.66, -0.32],
          [0.66, -0.32],
          [-0.66, 0.32],
          [0.66, 0.32],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.2, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.42, 12]} />
            <meshStandardMaterial color="#3a2e24" roughness={0.4} metalness={0.35} />
          </mesh>
        ))}
        {/* stacked books on the table */}
        <group position={[-0.45, 0.46, 0.08]} rotation={[0, 0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.05, 0.24]} />
            <meshStandardMaterial color="#7c4d35" roughness={0.8} />
          </mesh>
          <mesh position={[0.01, 0.055, 0.01]} rotation={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.32, 0.045, 0.22]} />
            <meshStandardMaterial color="#8a8b7c" roughness={0.8} />
          </mesh>
        </group>
        {/* coffee cup */}
        <mesh position={[0.42, 0.49, -0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.07, 16]} />
          <meshStandardMaterial color="#efe8db" roughness={0.5} />
        </mesh>
      </group>

      {/* ---- Floor lamp ---- */}
      <group position={[-2.35, 0, -1.5]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 24]} />
          <meshStandardMaterial color="#2a2420" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.8, 12]} />
          <meshStandardMaterial color="#8a6b48" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.74, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.24, 0.34, 24, 1, true]} />
          <meshStandardMaterial
            ref={shade}
            color="#f0e2c8"
            emissive="#ffcf8a"
            emissiveIntensity={1.7}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
        <pointLight
          ref={lampGlow}
          position={[0, 1.7, 0]}
          intensity={7}
          distance={7}
          decay={2}
          color="#ffbf80"
        />
      </group>

      {/* ---- Pendant light over the table ---- */}
      <group position={[0, 0, -0.3]}>
        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 2.1, 6]} />
          <meshStandardMaterial color="#2a2420" />
        </mesh>
        <mesh position={[0, 1.55, 0]} castShadow>
          <coneGeometry args={[0.22, 0.28, 24, 1, true]} />
          <meshStandardMaterial
            color="#caa06f"
            emissive="#ffcf8a"
            emissiveIntensity={0.9}
            side={THREE.DoubleSide}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* ---- TV / media console (back wall, right) ---- */}
      <group position={[2.7, 0, -2.9]}>
        {/* console */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.44, 0.42]} />
          <meshStandardMaterial color="#4a3524" roughness={0.5} metalness={0.05} />
        </mesh>
        {/* tv */}
        <group position={[0, 1.35, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[1.7, 0.98, 0.05]} />
            <meshStandardMaterial color="#141210" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.58, 0.88]} />
            <meshStandardMaterial
              ref={tvScreen}
              color="#12202a"
              emissive="#3a6a8a"
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>
      </group>

      {/* ---- Bookcase (back wall, left) ---- */}
      <group position={[-3.4, 0, -2.85]}>
        {/* frame */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 2.2, 0.4]} />
          <meshStandardMaterial color="#5a4230" roughness={0.6} />
        </mesh>
        {/* shelves (recessed) */}
        {[0.45, 1.05, 1.65].map((y) => (
          <mesh key={y} position={[0, y, 0.06]}>
            <boxGeometry args={[1.56, 0.03, 0.32]} />
            <meshStandardMaterial color="#6a5038" roughness={0.6} />
          </mesh>
        ))}
        <group position={[-0.66, 0.48, 0.05]}>
          <BookRow count={7} y={0} />
        </group>
        <group position={[-0.2, 1.08, 0.05]}>
          <BookRow count={5} y={0} />
        </group>
        <group position={[0.42, 1.68, 0.05]}>
          <Vase color="#8a8b7c" h={0.3} />
        </group>
      </group>

      {/* ---- Side table + lamp by the chair ---- */}
      <group position={[3.0, 0, -0.2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 24]} />
          <meshStandardMaterial color="#e8e2d6" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 12]} />
          <meshStandardMaterial color="#3a2e24" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* table lamp */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 10]} />
          <meshStandardMaterial color="#8a6b48" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.15, 0.2, 20, 1, true]} />
          <meshStandardMaterial
            color="#e6d3b0"
            emissive="#ffcf8a"
            emissiveIntensity={0.7}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
        <pointLight ref={tableLamp} position={[0, 0.82, 0]} intensity={1.4} distance={2.6} decay={2} color="#ffc98a" />
      </group>

      {/* ---- Plants ---- */}
      <group position={[3.8, 0, -2.4]}>
        <Monstera scale={1.15} />
      </group>
      <group position={[-4.1, 0, -0.6]}>
        <Monstera scale={0.8} />
      </group>
      {/* small topiary on the console */}
      <group position={[2.1, 0.5, -2.85]} scale={0.5}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.44, 20]} />
          <meshStandardMaterial color="#b9a68a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <icosahedronGeometry args={[0.34, 2]} />
          <meshStandardMaterial color="#6f7360" roughness={1} flatShading />
        </mesh>
      </group>

      {/* ---- Throw pillows + blanket on the sofa ---- */}
      <group position={[0, 0, -1.7]}>
        {[-0.7, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.52, 0.1]} rotation={[0.2, 0, x < 0 ? 0.3 : -0.3]} castShadow>
            <boxGeometry args={[0.4, 0.4, 0.16]} />
            <meshStandardMaterial color={x < 0 ? '#a17c5d' : '#8a8b7c'} roughness={1} />
          </mesh>
        ))}
        {/* folded blanket over the arm */}
        <mesh position={[1.05, 0.5, 0.05]} rotation={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[0.5, 0.14, 0.5]} />
          <meshStandardMaterial color="#c7a07d" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}
