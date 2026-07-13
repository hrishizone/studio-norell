'use client';

import { FiArrowUpRight } from 'react-icons/fi';
import { brand } from '@/cms/content';
import { ImageReveal } from '@/components/shared/ImageReveal';
import { RevealText } from '@/components/shared/RevealText';
import { MagneticButton } from '@/components/shared/MagneticButton';

/**
 * The atelier: a full-bleed workshop image with a floating glass-morphism
 * card describing the practice. Demonstrates depth + glass + parallax.
 */
export function Atelier() {
  return (
    <section id="atelier" className="relative bg-espresso px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl md:min-h-[620px]">
            <ImageReveal
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80"
              alt="Craftspeople at work inside a warm, light-filled furniture atelier"
              onScroll
              parallax={10}
              rounded={false}
              className="h-full w-full"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Glass card */}
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-bone/20 bg-bone/10 p-6 backdrop-blur-xl md:bottom-8 md:left-8 md:right-auto md:max-w-sm md:p-8">
              <p className="text-xs uppercase tracking-eyebrow text-bone/70">
                The workshop
              </p>
              <p className="mt-3 font-display text-xl font-light leading-snug text-bone md:text-2xl">
                Every joint cut, sanded and oiled by the same hands that drew it.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center text-bone">
            <p className="mb-6 text-xs uppercase tracking-eyebrow text-clay">
              The atelier
            </p>
            <RevealText
              as="h2"
              scroll
              className="font-display text-display-md font-light leading-[1.05]"
            >
              A practice of patience.
            </RevealText>
            <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-bone/70 md:text-lg">
              {brand.description} We keep production small and deliberate — a
              handful of pieces a year, each documented, numbered and built to be
              repaired rather than replaced.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-8 border-t border-bone/15 pt-8">
              <div>
                <p className="font-display text-4xl font-light">100%</p>
                <p className="mt-2 text-sm text-bone/55">
                  Solid, responsibly sourced hardwood
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-light">∞</p>
                <p className="mt-2 text-sm text-bone/55">
                  Repairable, made to be inherited
                </p>
              </div>
            </div>

            <div className="mt-10">
              <MagneticButton href="#contact" variant="ghost">
                Book a studio visit
                <FiArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
