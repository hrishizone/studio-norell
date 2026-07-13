'use client';

import { useState } from 'react';
import { heroHotspots } from '@/cms/content';
import { Room } from './Room';
import { Model } from './Model';
import { Hotspot } from './Hotspot';

/**
 * The hero vignette: a lived-in living room composed from real furniture models
 * (sofa, lounge chair, table dish) set into a warm plaster + oak room, with
 * inspection hotspots on each collectible piece.
 */
export function LivingRoom() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <group>
      <Room />

      {/* Sofa — centrepiece, against the back */}
      <Model
        url="/models/GlamVelvetSofa.glb"
        position={[0, 0, -1.7]}
        rotation={[0, Math.PI, 0]}
        envIntensity={1}
      />

      {/* Lounge chair — angled toward the table */}
      <Model
        url="/models/chair.glb"
        position={[1.9, 0, -0.45]}
        rotation={[0, -1.15, 0]}
        envIntensity={1.1}
      />

      {/* Dish resting on the coffee table */}
      <Model
        url="/models/IridescentDishWithOlives.glb"
        position={[0, 0.455, -0.3]}
        rotation={[0, 0.4, 0]}
        envIntensity={1.4}
      />

      {heroHotspots.map((h) => (
        <Hotspot
          key={h.id}
          data={h}
          open={openId === h.id}
          dimmed={openId !== null && openId !== h.id}
          onToggle={toggle}
        />
      ))}
    </group>
  );
}
