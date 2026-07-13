'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { brand, navLinks } from '@/cms/content';
import { cn } from '@/utils/cn';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeId: string;
}

const panel = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const, when: 'beforeChildren', staggerChildren: 0.07, delayChildren: 0.15 },
  },
  exit: {
    clipPath: 'inset(0% 0% 100% 0%)',
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const item = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Fullscreen mobile navigation with a clip-path curtain and staggered links. */
export function MobileMenu({ open, onClose, activeId }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col bg-espresso px-6 py-6 text-bone md:hidden"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-tight">
              {brand.wordmark}
              <span className="text-clay">.</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="text-sm uppercase tracking-eyebrow text-bone/70"
            >
              Close
            </button>
          </div>

          <nav className="mt-auto flex flex-col gap-2 pb-6">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                onClick={onClose}
                variants={item}
                className={cn(
                  'group flex items-baseline justify-between border-b border-bone/10 pb-3 pt-4 font-display text-[13vw] leading-none transition-colors',
                  activeId === link.id ? 'text-clay' : 'text-bone',
                )}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-sans text-xs tracking-eyebrow text-bone/40">
                    0{i + 1}
                  </span>
                  {link.label}
                </span>
                <FiArrowUpRight className="h-6 w-6 opacity-40 transition-transform group-hover:translate-x-1" />
              </motion.a>
            ))}
          </nav>

          <motion.div
            variants={item}
            className="flex items-center justify-between text-xs uppercase tracking-eyebrow text-bone/50"
          >
            <span>{brand.location}</span>
            <span>Est. {brand.founded}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
