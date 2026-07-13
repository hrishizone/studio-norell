'use client';

import { useRef } from 'react';
import { gsap, registerGsap, ScrollTrigger } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { brand } from '@/cms/content';

const WORDS =
  'We compose objects for the rooms you will grow old in — shaped by hand, softened by time, and made to outlast the fashions that surround them.'.split(
    ' ',
  );

/**
 * Pinned "philosophy" statement: words illuminate from muted to espresso as
 * the section scrolls through — a slow, deliberate reading rhythm.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('[data-word]');

      if (prefersReduced) {
        gsap.set(words, { opacity: 1 });
        return;
      }

      gsap.set(words, { opacity: 0.14 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative bg-bone px-6 py-32 md:px-12 md:py-48"
    >
      <div className="mx-auto max-w-[1300px]">
        <p className="mb-10 text-xs uppercase tracking-eyebrow text-clay">
          Philosophy — {brand.tagline}
        </p>
        <p className="font-display text-[clamp(1.8rem,5vw,4.2rem)] font-light leading-[1.12] tracking-tight text-espresso">
          {WORDS.map((word, i) => (
            <span key={`${word}-${i}`} data-word className="inline-block">
              {word}
              {i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
