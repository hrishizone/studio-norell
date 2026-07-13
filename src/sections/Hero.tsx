'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { FiArrowDownRight } from 'react-icons/fi';
import { gsap, registerGsap, ScrollTrigger } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { brand, collections, heroStats } from '@/cms/content';
import { AnimatedGrid } from '@/components/shared/AnimatedGrid';
import { ImageReveal } from '@/components/shared/ImageReveal';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { ScrollIndicator } from '@/components/shared/ScrollIndicator';
import { useCursorHandlers } from '@/providers/CursorProvider';

// WebGL is client-only; skip SSR to avoid hydration + window access issues.
const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((m) => m.HeroScene),
  { ssr: false },
);

// Entrance begins as the loader curtain lifts (~2s in).
const HERO_DELAY = 2.05;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const viewCursor = useCursorHandlers('view', 'View');

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

      if (prefersReduced) {
        gsap.set([lines, fades], { clearProps: 'all', opacity: 1, yPercent: 0 });
      } else {
        gsap.set(lines, { yPercent: 115 });
        gsap.set(fades, { y: 24, opacity: 0 });

        const tl = gsap.timeline({ delay: HERO_DELAY });
        tl.to(lines, {
          yPercent: 0,
          duration: 1.3,
          ease: 'power4.out',
          stagger: 0.12,
        })
          .to(
            fades,
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.1 },
            '-=0.8',
          );
      }

      // Scene parallax + fade on scroll out.
      if (sceneRef.current && !prefersReduced) {
        gsap.to(sceneRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pb-10 pt-28 md:pb-14 md:pt-32"
    >
      <AnimatedGrid className="opacity-70" />

      {/* Floating WebGL sculpture — soft-masked so it never shows a hard box. */}
      <div
        ref={sceneRef}
        className="pointer-events-none absolute inset-y-0 right-0 z-0 flex w-full items-center justify-center md:right-[-2%] md:w-[58%] lg:right-[1%] lg:w-[52%]"
      >
        <div className="relative aspect-square h-[74%] max-h-[680px] md:h-[86%]">
          {/* warm ambient glow behind the object */}
          <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(201,154,125,0.42),rgba(180,121,90,0.12)_45%,transparent_72%)] blur-2xl" />

          {/* the sculpture, its canvas edges dissolved with a radial mask */}
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                'radial-gradient(closest-side at 50% 46%, #000 58%, transparent 90%)',
              WebkitMaskImage:
                'radial-gradient(closest-side at 50% 46%, #000 58%, transparent 90%)',
            }}
          >
            <HeroScene />
          </div>

          {/* soft contact shadow grounding the object */}
          <div className="absolute bottom-[10%] left-1/2 h-8 w-[42%] -translate-x-1/2 rounded-[50%] bg-espresso/25 blur-2xl" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 md:px-12">
        {/* Top meta row */}
        <div
          data-hero-fade
          className="flex items-start justify-between text-xs uppercase tracking-eyebrow text-espresso/60"
        >
          <span>Collectible furniture — Est. {brand.founded}</span>
          <span className="hidden max-w-[26ch] text-right leading-relaxed md:block">
            An atelier composing objects for the rooms you will grow old in.
          </span>
        </div>

        {/* Headline */}
        <div className="mt-auto">
          <h1 className="font-display font-light text-espresso">
            <span className="block overflow-hidden">
              <span data-hero-line className="block text-display-xl">
                Quiet
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block text-display-xl italic text-clay">
                monuments
              </span>
            </span>
            <span className="mt-4 block max-w-[20ch] overflow-hidden md:mt-6">
              <span
                data-hero-line
                className="block font-sans text-lg font-normal leading-snug tracking-tight text-espresso/70 md:text-2xl"
              >
                for the rooms you will grow old in.
              </span>
            </span>
          </h1>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#collections" variant="solid">
              Explore collections
              <FiArrowDownRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#atelier" variant="outline">
              The atelier
            </MagneticButton>
          </div>
        </div>

        {/* Bottom row: scroll cue · portrait image · stats */}
        <div className="mt-14 flex items-end justify-between gap-6">
          <div data-hero-fade>
            <ScrollIndicator />
          </div>

          <div
            data-hero-fade
            {...viewCursor}
            className="hidden w-40 shrink-0 lg:block xl:w-52"
          >
            <ImageReveal
              src={collections[0].image}
              alt={collections[0].alt}
              className="aspect-[3/4] w-full"
              sizes="220px"
              parallax={8}
              delay={HERO_DELAY + 0.3}
              priority
            />
            <p className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-wide text-espresso/50">
              <span>{collections[0].name}</span>
              <span>{collections[0].year}</span>
            </p>
          </div>

          <dl
            data-hero-fade
            className="flex gap-8 text-right md:gap-12"
          >
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-light text-espresso md:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 max-w-[12ch] text-[11px] uppercase leading-tight tracking-wide text-espresso/50">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
