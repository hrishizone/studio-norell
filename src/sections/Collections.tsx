'use client';

import { useRef } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { gsap, registerGsap, ScrollTrigger } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { collections } from '@/cms/content';
import { ImageReveal } from '@/components/shared/ImageReveal';
import { RevealText } from '@/components/shared/RevealText';
import { useCursorHandlers } from '@/providers/CursorProvider';

function CollectionCard({ item }: { item: (typeof collections)[number] }) {
  const cursor = useCursorHandlers('view', 'View');
  return (
    <article
      {...cursor}
      className="group relative flex h-full w-[78vw] shrink-0 flex-col sm:w-[52vw] lg:w-[34vw] xl:w-[30vw]"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <ImageReveal
          src={item.image}
          alt={item.alt}
          onScroll
          parallax={6}
          className="aspect-[4/5] w-full"
          imageClassName="transition-transform duration-[900ms] ease-norell group-hover:scale-105"
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 34vw"
        />
        <span className="absolute left-4 top-4 rounded-full bg-bone/80 px-3 py-1 text-[11px] uppercase tracking-wide text-espresso backdrop-blur-md">
          {item.index}
        </span>
        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-espresso text-bone opacity-0 transition-all duration-500 ease-norell group-hover:opacity-100">
          <FiArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between">
        <h3 className="font-display text-2xl font-light text-espresso">{item.name}</h3>
        <span className="text-xs uppercase tracking-wide text-espresso/40">{item.year}</span>
      </div>
      <p className="mt-1 text-sm text-espresso/55">{item.material}</p>
    </article>
  );
}

export function Collections() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || isMobile) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - window.innerWidth + 96;
      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [isMobile]);

  return (
    <section id="collections" ref={sectionRef} className="relative overflow-hidden bg-bone py-24 md:py-0 md:min-h-[100svh] md:flex md:flex-col md:justify-center">
      <div className="mx-auto mb-14 w-full max-w-[1600px] px-6 md:mb-16 md:px-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-eyebrow text-clay">
              Selected works — 01 / 04
            </p>
            <RevealText
              as="h2"
              scroll
              className="max-w-[16ch] font-display text-display-md font-light text-espresso"
            >
              A catalogue of considered forms.
            </RevealText>
          </div>
          <p className="max-w-[38ch] text-sm leading-relaxed text-espresso/60 md:text-right">
            Each piece is drawn slowly, prototyped in the workshop and produced in
            limited series — never rushed to a season.
          </p>
        </div>
      </div>

      {/* Horizontal track (pinned on desktop, native scroll on mobile). */}
      <div
        ref={trackRef}
        className="flex gap-6 px-6 md:gap-10 md:px-12 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:pb-4 md:w-max"
      >
        {collections.map((item) => (
          <div key={item.id} className="max-md:snap-center">
            <CollectionCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
