'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiX } from 'react-icons/fi';
import type { HeroHotspot } from '@/types';
import { cn } from '@/utils/cn';

interface StoryPanelProps {
  items: HeroHotspot[];
  index: number | null;
  touring: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onJump: (i: number) => void;
}

/**
 * The narrative panel. When a piece is focused, it tells that chapter of the
 * room's story with prev/next controls and a progress rail — the spine of the
 * guided tour.
 */
export function StoryPanel({
  items,
  index,
  touring,
  onPrev,
  onNext,
  onClose,
  onJump,
}: StoryPanelProps) {
  const item = index !== null ? items[index] : null;
  const isLast = index === items.length - 1;

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          key="story"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute inset-x-4 bottom-6 z-[6] mx-auto max-w-3xl md:inset-x-auto md:left-1/2 md:w-[min(46rem,90vw)] md:-translate-x-1/2"
        >
          <div className="overflow-hidden rounded-2xl border border-bone/15 bg-[#100d0b]/80 backdrop-blur-2xl">
            {/* progress rail */}
            <div className="flex gap-1.5 px-6 pt-5">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  aria-label={`Go to ${it.title}`}
                  onClick={() => onJump(i)}
                  className="group relative h-1 flex-1 overflow-hidden rounded-full bg-bone/15"
                >
                  <span
                    className={cn(
                      'absolute inset-0 origin-left rounded-full bg-clay transition-transform duration-500',
                      i <= index ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5 p-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-clay">
                  <span>
                    Chapter {item.index} / {String(items.length).padStart(2, '0')}
                  </span>
                  {touring && (
                    <span className="flex items-center gap-1.5 text-bone/45">
                      <span className="inline-block h-1 w-1 animate-ping rounded-full bg-clay" />
                      Auto
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-2xl font-light text-bone md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/65">{item.story}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-bone/40">
                  {item.spec}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={onPrev}
                  disabled={index === 0}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:border-bone/50 disabled:opacity-30"
                >
                  <FiArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="flex h-11 items-center gap-2 rounded-full bg-bone px-5 text-sm font-medium text-espresso transition-transform hover:scale-[1.03]"
                >
                  {isLast ? 'Finish' : 'Next'}
                  {!isLast && <FiArrowRight className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:border-bone/50"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
