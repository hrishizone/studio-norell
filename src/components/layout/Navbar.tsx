'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { brand, navLinks } from '@/cms/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useCursorHandlers } from '@/providers/CursorProvider';
import { cn } from '@/utils/cn';
import { MobileMenu } from './MobileMenu';
import { MagneticButton } from '@/components/shared/MagneticButton';

function NavItem({
  link,
  active,
  dark,
}: {
  link: (typeof navLinks)[number];
  active: boolean;
  dark: boolean;
}) {
  const cursor = useCursorHandlers('hover');
  return (
    <a
      href={link.href}
      {...cursor}
      className={cn(
        'group relative py-1 text-sm tracking-wide transition-colors',
        dark ? 'text-bone/70 hover:text-bone' : 'text-espresso/80 hover:text-espresso',
      )}
    >
      <span className="flex items-center gap-1.5">
        <span
          className={cn(
            'h-1 w-1 rounded-full bg-clay transition-opacity duration-300',
            active ? 'opacity-100' : 'opacity-0',
          )}
        />
        {link.label}
      </span>
      <span
        className={cn(
          'absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-500 ease-norell',
          dark ? 'bg-bone' : 'bg-espresso',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(navLinks.map((l) => l.id));
  const brandCursor = useCursorHandlers('hover');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Over the dark hero (not yet scrolled) the bar is light-on-dark.
  const dark = !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[80] transition-all duration-500 ease-norell',
          scrolled
            ? 'border-b border-espresso/10 bg-bone/70 py-3 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-6',
        )}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
          <a
            href="#top"
            {...brandCursor}
            className={cn(
              'font-display text-xl font-medium tracking-tight transition-colors',
              dark ? 'text-bone' : 'text-espresso',
            )}
          >
            {brand.wordmark}
            <span className="text-clay">.</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <NavItem key={link.id} link={link} active={active === link.id} dark={dark} />
            ))}
          </div>

          <div className="hidden md:block">
            <MagneticButton
              href="#contact"
              variant={dark ? 'outline-light' : 'outline'}
              strength={0.3}
            >
              Enquire
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-end gap-1.5 md:hidden"
          >
            <span className={cn('block h-px w-7 transition-colors', dark ? 'bg-bone' : 'bg-espresso')} />
            <span className={cn('block h-px w-5 transition-colors', dark ? 'bg-bone' : 'bg-espresso')} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={active} />
    </>
  );
}
