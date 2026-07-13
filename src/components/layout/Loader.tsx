'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLoader } from '@/providers/LoaderProvider';
import { brand } from '@/cms/content';

/**
 * Smooth loading screen: a counter climbs to 100 while the wordmark rises,
 * then the whole panel lifts away as a curtain. Marks loading complete so
 * hero entrance animations can begin.
 */
export function Loader() {
  const { isLoading, complete } = useLoader();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const total = prefersReduced ? 300 : 1600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / total, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(complete, 300);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [complete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-espresso text-bone"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="block font-display text-[13vw] font-light leading-none tracking-tight md:text-[8vw]"
            >
              {brand.wordmark}
            </motion.span>
          </div>

          <div className="mt-8 flex w-[min(78vw,420px)] items-center justify-between text-xs uppercase tracking-eyebrow text-bone/60">
            <span>{brand.tagline}</span>
            <span className="tabular-nums">{count.toString().padStart(3, '0')}</span>
          </div>

          <div className="mt-4 h-px w-[min(78vw,420px)] overflow-hidden bg-bone/15">
            <motion.div
              className="h-full bg-clay"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
