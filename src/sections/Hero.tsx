'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowDownRight, FiPlay } from 'react-icons/fi';
import { gsap, registerGsap, ScrollTrigger } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { brand, heroHotspots } from '@/cms/content';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { ScrollIndicator } from '@/components/shared/ScrollIndicator';
import { AxisGizmo } from '@/components/shared/AxisGizmo';
import { OrbitReadout } from '@/components/shared/OrbitReadout';
import { StoryPanel } from '@/components/shared/StoryPanel';
import { useCursorHandlers } from '@/providers/CursorProvider';

// WebGL is client-only; skip SSR to avoid hydration + window access issues.
const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((m) => m.HeroScene),
  { ssr: false },
);

// Entrance begins as the loader curtain lifts (~2s in).
const HERO_DELAY = 2.05;

const LEFT_TICKS = ['000', '025', '050', '075', '100'];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const dragCursor = useCursorHandlers('drag', 'Drag');

  // Guided-tour / focus state.
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [touring, setTouring] = useState(false);
  const last = heroHotspots.length - 1;

  const select = useCallback((i: number) => {
    setTouring(false);
    setFocusIndex(i);
  }, []);
  const close = useCallback(() => {
    setTouring(false);
    setFocusIndex(null);
  }, []);
  const prev = useCallback(() => setFocusIndex((i) => (i === null ? 0 : Math.max(0, i - 1))), []);
  const next = useCallback(() => {
    setFocusIndex((i) => {
      if (i === null) return 0;
      if (i >= last) {
        setTouring(false);
        return null;
      }
      return i + 1;
    });
  }, [last]);
  const beginTour = useCallback(() => {
    setTouring(true);
    setFocusIndex(0);
  }, []);

  // Auto-advance while touring.
  useEffect(() => {
    if (!touring || focusIndex === null) return;
    const id = window.setTimeout(() => {
      setFocusIndex((i) => {
        if (i === null || i >= last) {
          setTouring(false);
          return i === null ? null : null;
        }
        return i + 1;
      });
    }, 6500);
    return () => window.clearTimeout(id);
  }, [touring, focusIndex, last]);

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');

      if (prefersReduced) {
        gsap.set([lines, fades, ghostRef.current], { opacity: 1, yPercent: 0 });
      } else {
        gsap.set(lines, { yPercent: 115 });
        gsap.set(fades, { y: 18, opacity: 0 });
        gsap.set(ghostRef.current, { opacity: 0, scale: 1.08, filter: 'blur(12px)' });

        const tl = gsap.timeline({ delay: HERO_DELAY });
        tl.to(ghostRef.current, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.6,
          ease: 'power3.out',
        })
          .to(
            lines,
            { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.12 },
            '-=1.2',
          )
          .to(
            fades,
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 },
            '-=0.9',
          );
      }

      if (!prefersReduced) {
        // Scene + ghost type parallax as the hero scrolls away.
        gsap.to(sceneRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(ghostRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
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
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0a09] text-bone"
    >
      {/* WebGL studio: the living-room vignette (drag to orbit, click to focus) */}
      <div
        ref={sceneRef}
        {...dragCursor}
        className="absolute inset-0 z-0"
      >
        <HeroScene focusIndex={focusIndex} onSelect={select} />
      </div>

      {/* Giant outline wordmark behind the object */}
      <div
        ref={ghostRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[1] flex items-center justify-center transition-opacity duration-700 ${
          focusIndex !== null ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="select-none whitespace-nowrap font-display text-[23vw] font-light leading-none text-transparent [-webkit-text-stroke:1px_rgba(244,241,234,0.14)]">
          monuments
        </span>
      </div>

      {/* Radial vignette to focus the centre + darken edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,10,9,0.75)_100%)]"
      />

      {/* Left measurement ruler */}
      <div
        data-hero-fade
        aria-hidden
        className="absolute left-6 top-1/2 z-[3] hidden -translate-y-1/2 flex-col gap-8 font-mono text-[10px] tracking-widest text-bone/35 lg:flex"
      >
        {LEFT_TICKS.map((t) => (
          <span key={t} className="flex items-center gap-2">
            <span className="inline-block h-px w-4 bg-bone/25" />
            {t}
          </span>
        ))}
      </div>

      {/* Content — transparent to pointer so the canvas underneath can be dragged;
          interactive children opt back in with pointer-events-auto. Dims while focused. */}
      <div
        className={`pointer-events-none relative z-[4] mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 pb-8 pt-28 transition-opacity duration-500 md:px-12 md:pb-12 md:pt-32 ${
          focusIndex !== null ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Top HUD row */}
        <div
          data-hero-fade
          className="flex items-start justify-between font-mono text-[11px] uppercase tracking-widest text-bone/50"
        >
          <span>
            [ Nº01 ] Collectible furniture
            <br className="hidden sm:block" />
            Est. {brand.founded}
          </span>
          <span className="text-right">
            55.6761° N / 12.5683° E
            <br className="hidden sm:block" />
            Oak · Travertine · Wool
          </span>
        </div>

        {/* Bottom cluster */}
        <div className="mt-auto grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <h1 className="font-display font-light">
              <span className="block overflow-hidden">
                <span data-hero-line className="block text-[clamp(2.5rem,6vw,5rem)] leading-[0.98]">
                  Quiet
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  data-hero-line
                  className="block text-[clamp(2.5rem,6vw,5rem)] italic leading-[0.98] text-clay-soft"
                >
                  monuments.
                </span>
              </span>
            </h1>

            <div
              data-hero-fade
              className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={beginTour}
                className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-sm font-medium text-espresso transition-transform duration-500 ease-norell hover:scale-[1.03]"
              >
                <FiPlay className="h-3.5 w-3.5 fill-espresso" />
                Take the tour
              </button>
              <MagneticButton href="#collections" variant="outline-light">
                Explore collections
                <FiArrowDownRight className="h-4 w-4" />
              </MagneticButton>
            </div>

            <p
              data-hero-fade
              className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-bone/40"
            >
              <span className="inline-block h-1 w-1 animate-ping rounded-full bg-clay" />
              Drag to explore · tap a piece · or take the guided tour
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <p
              data-hero-fade
              className="max-w-[34ch] font-mono text-[11px] uppercase leading-relaxed tracking-widest text-bone/50 md:text-right"
            >
              Furniture engineered to be inherited — drawn like architecture,
              finished by hand.
            </p>
            <div data-hero-fade className="flex items-center gap-4">
              <OrbitReadout />
              <AxisGizmo className="h-12 w-12" />
            </div>
          </div>
        </div>

        {/* Footer line: scroll cue */}
        <div data-hero-fade className="mt-10 flex items-center justify-between">
          <ScrollIndicator />
          <span className="font-mono text-[10px] uppercase tracking-widest text-bone/40">
            {brand.tagline}
          </span>
        </div>
      </div>

      {/* Narrative panel (guided tour + focus) */}
      <StoryPanel
        items={heroHotspots}
        index={focusIndex}
        touring={touring}
        onPrev={prev}
        onNext={next}
        onClose={close}
        onJump={select}
      />
    </section>
  );
}
