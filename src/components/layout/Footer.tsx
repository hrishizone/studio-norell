'use client';

import { FiArrowUpRight } from 'react-icons/fi';
import { brand, navLinks } from '@/cms/content';
import { RevealText } from '@/components/shared/RevealText';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { useCursorHandlers } from '@/providers/CursorProvider';

/** Editorial closing section doubling as contact + footer. */
export function Footer() {
  const cursor = useCursorHandlers('hover');

  return (
    <footer id="contact" className="relative bg-espresso px-6 pb-10 pt-24 text-bone md:px-12 md:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-14 border-b border-bone/10 pb-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-6 text-xs uppercase tracking-eyebrow text-clay">
              Commissions &amp; enquiries
            </p>
            <RevealText
              as="h2"
              scroll
              className="max-w-3xl font-display text-display-md font-light"
            >
              Let us compose something made to outlast you.
            </RevealText>
            <div className="mt-10">
              <MagneticButton href="mailto:atelier@studio-norell.com" variant="ghost">
                atelier@studio-norell.com
                <FiArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-8 md:items-end">
            <nav className="flex flex-col gap-2 md:items-end">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  {...cursor}
                  className="text-sm text-bone/70 transition-colors hover:text-bone"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex gap-6 text-xs uppercase tracking-eyebrow text-bone/50 md:justify-end">
              <a href="#" {...cursor} className="hover:text-bone">Instagram</a>
              <a href="#" {...cursor} className="hover:text-bone">Pinterest</a>
              <a href="#" {...cursor} className="hover:text-bone">Journal</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs uppercase tracking-eyebrow text-bone/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {brand.name}
          </span>
          <span className="font-display text-sm italic tracking-normal text-bone/60">
            {brand.tagline}
          </span>
          <span>{brand.location}</span>
        </div>
      </div>
    </footer>
  );
}
