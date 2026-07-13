'use client';

import { motion } from 'framer-motion';

/** Minimal scroll cue: a label plus a travelling line inside a track. */
export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.8, duration: 1 }}
      className="flex items-center gap-3 text-xs uppercase tracking-eyebrow text-espresso/50"
    >
      <span>Scroll</span>
      <span className="relative block h-8 w-px overflow-hidden bg-espresso/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-3 bg-clay"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </motion.div>
  );
}
