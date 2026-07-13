'use client';

import { useRef } from 'react';
import { gsap, registerGsap, ScrollTrigger } from '@/animations/gsap';
import { splitText, type SplitType } from '@/utils/splitText';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

interface TextRevealOptions {
  type?: SplitType;
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: string;
  /** When true, tie the reveal to scroll instead of running on mount. */
  scroll?: boolean;
  start?: string;
}

/**
 * Masked, staggered line/word/char reveal.
 * Respects prefers-reduced-motion by rendering text statically.
 */
export function useTextReveal<T extends HTMLElement>({
  type = 'words',
  stagger = 0.08,
  duration = 1.1,
  delay = 0,
  y = '110%',
  scroll = false,
  start = 'top 85%',
}: TextRevealOptions = {}) {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const { elements } = splitText(el, type);

      gsap.set(elements, { yPercent: parseFloat(y) });

      const animation = {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: 'power4.out',
      } as gsap.TweenVars;

      if (scroll) {
        gsap.to(elements, {
          ...animation,
          scrollTrigger: { trigger: el, start },
        });
      } else {
        gsap.to(elements, animation);
      }
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [type, stagger, duration, delay, y, scroll, start]);

  return ref;
}
