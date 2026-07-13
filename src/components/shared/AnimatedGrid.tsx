'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * A subtle architectural column grid that draws itself in — evokes drafting
 * lines / blueprint. Sits behind hero content at very low opacity.
 */
export function AnimatedGrid({ className }: { className?: string }) {
  const columns = 6;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className="mx-auto flex h-full max-w-[1600px] justify-between px-6 md:px-12">
        {Array.from({ length: columns + 1 }).map((_, i) => (
          <motion.span
            key={i}
            className="block w-px origin-top bg-gradient-to-b from-transparent via-espresso/10 to-transparent"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{
              duration: 1.6,
              delay: 0.4 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
