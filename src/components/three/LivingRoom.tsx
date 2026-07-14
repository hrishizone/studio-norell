'use client';

import { heroHotspots } from '@/cms/content';
import { Room } from './Room';
import { Model } from './Model';
import { Hotspot } from './Hotspot';

interface LivingRoomProps {
  focusIndex: number | null;
  onSelect: (index: number) => void;
}

/**
 * The hero vignette: a lived-in living room composed from real furniture models
 * set into a fully-dressed procedural room, with narrative inspection hotspots.
 */
export function LivingRoom({ focusIndex, onSelect }: LivingRoomProps) {
  return (
    <group>
      <Room />

      {/* Sofa — recoloured to a muted greige to sit in the palette */}
      <Model
        url="/models/GlamVelvetSofa.glb"
        position={[0, 0, -1.7]}
        rotation={[0, Math.PI, 0]}
        colorOverride="#8a7a68"
        envIntensity={1}
      />

      {/* Lounge chair — warm oatmeal bouclé */}
      <Model
        url="/models/chair.glb"
        position={[1.9, 0, -0.45]}
        rotation={[0, -1.15, 0]}
        colorOverride="#c2a985"
        envIntensity={1.1}
      />

      {/* Dish on the coffee table */}
      <Model
        url="/models/IridescentDishWithOlives.glb"
        position={[0, 0.465, -0.42]}
        rotation={[0, 0.4, 0]}
        envIntensity={1.4}
      />

      {/* Boombox on the media console */}
      <Model
        url="/models/BoomBox.glb"
        position={[3.25, 0.5, -2.85]}
        rotation={[0, -0.4, 0]}
        fitHeight={0.22}
      />

      {/* Antique camera + rubber duck on the bookcase shelves */}
      <Model
        url="/models/AntiqueCamera.glb"
        position={[-2.85, 1.08, -2.72]}
        rotation={[0, 0.6, 0]}
        fitHeight={0.34}
      />
      <Model
        url="/models/Duck.glb"
        position={[-3.05, 1.68, -2.72]}
        rotation={[0, 0.8, 0]}
        fitHeight={0.24}
      />

      {heroHotspots.map((h, i) => (
        <Hotspot
          key={h.id}
          data={h}
          index={i}
          active={focusIndex === i}
          focused={focusIndex !== null}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
