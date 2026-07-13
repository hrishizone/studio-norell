'use client';

import { useEffect, useRef, useState } from 'react';
import { orbitState } from '@/components/three/orbitState';

/**
 * Live viewport HUD: mirrors the chair's camera orientation (fed from the WebGL
 * loop via a shared singleton) without re-rendering every frame — it polls with
 * its own rAF and only flips React state when the drag flag changes.
 */
export function OrbitReadout() {
  const azRef = useRef<HTMLSpanElement>(null);
  const poRef = useRef<HTMLSpanElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastDrag = false;
    const fmt = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}°`;
    const tick = () => {
      if (azRef.current) azRef.current.textContent = fmt(orbitState.azimuthDeg);
      if (poRef.current) poRef.current.textContent = fmt(orbitState.polarDeg);
      if (orbitState.dragging !== lastDrag) {
        lastDrag = orbitState.dragging;
        setDragging(orbitState.dragging);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-bone/45">
      <span className="flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
            dragging ? 'bg-clay' : 'bg-bone/30'
          }`}
        />
        {dragging ? 'Exploring' : 'Interior · Nº 01'}
      </span>
      <span className="text-bone/35">
        AZ <span ref={azRef}>+0.0°</span> · PO <span ref={poRef}>+90.0°</span>
      </span>
    </div>
  );
}
