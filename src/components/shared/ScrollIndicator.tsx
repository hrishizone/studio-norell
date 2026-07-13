'use client';

import { motion } from 'framer-motion';

/** Minimal scroll cue for the dark hero: a label plus a travelling line. */
export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.8, duration: 1 }}
      className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-bone/50"
    >
      <span>Scroll</span>
      <span className="relative block h-8 w-px overflow-hidden bg-bone/20">
        <motion.span
          className="absolute inset-x-0 top-0 h-3 bg-clay"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </motion.div>
  );
}
