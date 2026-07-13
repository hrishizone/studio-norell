'use client';

import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { HeroHotspot } from '@/types';
import { orbitState } from './orbitState';
import { cn } from '@/utils/cn';

interface HotspotProps {
  data: HeroHotspot;
  open: boolean;
  dimmed: boolean;
  onToggle: (id: string) => void;
}

/**
 * A 3D-anchored inspection point. A pulsing marker that, on hover or tap,
 * expands into a spec card. Anchored to the chair so it tracks as you orbit.
 */
export function Hotspot({ data, open, dimmed, onToggle }: HotspotProps) {
  const [hovered, setHovered] = useState(false);
  const active = open || hovered;

  return (
    <Html position={data.position} center zIndexRange={[40, 0]} className="pointer-events-none">
      <div
        className={cn(
          'pointer-events-auto relative -translate-y-1/2 select-none transition-opacity duration-500',
          dimmed && !active ? 'opacity-30' : 'opacity-100',
        )}
        onPointerEnter={() => {
          setHovered(true);
          orbitState.activeHotspot = data.id;
        }}
        onPointerLeave={() => {
          setHovered(false);
          orbitState.activeHotspot = open ? data.id : null;
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(data.id);
        }}
      >
        {/* marker */}
        <button
          type="button"
          aria-label={`Inspect ${data.title}`}
          className="relative flex h-6 w-6 items-center justify-center"
        >
          <span
            className={cn(
              'absolute inset-0 rounded-full border border-clay/70 transition-transform duration-500',
              active ? 'scale-100' : 'scale-75',
            )}
          />
          <span className="absolute inset-0 animate-ping rounded-full border border-clay/40" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-clay" />
          <span className="absolute left-1/2 top-1/2 -z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/20 blur-md" />
        </button>

        {/* card */}
        <div
          className={cn(
            'absolute left-9 top-1/2 w-60 -translate-y-1/2 origin-left rounded-xl border border-bone/15 bg-[#100d0b]/85 p-4 backdrop-blur-xl transition-all duration-500 ease-norell',
            active
              ? 'pointer-events-auto translate-x-0 opacity-100'
              : 'pointer-events-none -translate-x-2 opacity-0',
          )}
        >
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-clay">
            <span>Detail Nº {data.index}</span>
            <span className="text-bone/40">{open ? '—' : '+'}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-light text-bone">{data.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-bone/60">{data.detail}</p>
          <p className="mt-3 border-t border-bone/10 pt-2 font-mono text-[10px] uppercase tracking-widest text-bone/45">
            {data.spec}
          </p>
        </div>
      </div>
    </Html>
  );
}
