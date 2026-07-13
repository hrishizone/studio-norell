'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCursor } from '@/providers/CursorProvider';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Bespoke cursor: a trailing outer ring + precise inner dot, with a
 * contextual label ("View", "Drag"). Hidden on touch / coarse pointers.
 */
export function CustomCursor() {
  const { variant, label } = useCursor();
  const hasFinePointer = useMediaQuery('(pointer: fine)');

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!hasFinePointer) return;

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    let raf = 0;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) return null;

  const isActive = variant === 'hover' || variant === 'view' || variant === 'drag';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center"
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-espresso/40 bg-espresso/[0.02] backdrop-blur-[1px]"
          animate={{
            width: isActive ? 76 : 48,
            height: isActive ? 76 : 48,
            borderColor:
              variant === 'view' || variant === 'drag'
                ? 'rgba(180,121,90,0)'
                : 'rgba(26,22,19,0.4)',
            backgroundColor:
              variant === 'view' || variant === 'drag'
                ? 'rgba(180,121,90,0.95)'
                : 'rgba(26,22,19,0.02)',
          }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="select-none text-[10px] font-medium uppercase tracking-wide text-bone"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-espresso transition-opacity"
        style={{ opacity: isActive ? 0 : 1 }}
      />
    </div>
  );
}
