'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { HeroHotspot } from '@/types';
import { orbitState } from './orbitState';
import { cn } from '@/utils/cn';

interface HotspotProps {
  data: HeroHotspot;
  index: number;
  active: boolean;
  /** any focus active (dim non-active markers) */
  focused: boolean;
  onSelect: (index: number) => void;
}

/**
 * A 3D-anchored inspection marker. Hover shows the piece name; clicking selects
 * it, which drives the camera to focus and opens the story panel in the HUD.
 */
export function Hotspot({ data, index, active, focused, onSelect }: HotspotProps) {
  const [hovered, setHovered] = useState(false);
  const show = hovered || active;

  return (
    <Html position={data.position} center zIndexRange={[30, 0]} className="pointer-events-none">
      <button
        type="button"
        aria-label={`Inspect ${data.title}`}
        className={cn(
          'pointer-events-auto relative flex h-8 w-8 -translate-y-1/2 items-center justify-center transition-opacity duration-500',
          focused && !active ? 'opacity-0' : 'opacity-100',
        )}
        onPointerEnter={() => {
          setHovered(true);
          orbitState.activeHotspot = data.id;
        }}
        onPointerLeave={() => {
          setHovered(false);
          orbitState.activeHotspot = active ? data.id : null;
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
      >
        <span
          className={cn(
            'absolute inset-1 rounded-full border transition-all duration-500',
            active ? 'scale-110 border-clay bg-clay/30' : 'scale-90 border-clay/70',
          )}
        />
        <span className="absolute inset-0 animate-ping rounded-full border border-clay/30" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-clay" />

        {/* hover label */}
        <span
          className={cn(
            'absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-bone/15 bg-[#100d0b]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-bone/80 backdrop-blur-md transition-all duration-300',
            show ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0',
          )}
        >
          {data.index} · {data.title}
        </span>
      </button>
    </Html>
  );
}
