'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, registerGsap, ScrollTrigger } from '@/animations/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { cn } from '@/utils/cn';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** vertical parallax distance in px across the scroll range */
  parallax?: number;
  /** delay reveal (used for the hero, on mount) */
  delay?: number;
  /** trigger reveal on scroll instead of on mount */
  onScroll?: boolean;
  rounded?: boolean;
}

/**
 * Masked image reveal: a clip-path curtain lifts while the inner image
 * counter-scales, plus optional scroll parallax. The workhorse visual of the
 * editorial layout.
 */
export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  parallax = 0,
  delay = 0,
  onScroll = false,
  rounded = true,
}: ImageRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        gsap.set(wrap, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(img, { scale: 1.35 });

        const tl = gsap.timeline({
          delay,
          scrollTrigger: onScroll ? { trigger: wrap, start: 'top 82%' } : undefined,
        });
        tl.to(wrap, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'power4.inOut',
        }).to(img, { scale: 1, duration: 1.6, ease: 'power3.out' }, '<');
      }

      if (parallax !== 0 && !prefersReduced) {
        gsap.fromTo(
          img,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, wrap);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [delay, onScroll, parallax]);

  return (
    <div
      ref={wrapRef}
      className={cn('relative overflow-hidden', rounded && 'rounded-2xl', className)}
    >
      <div ref={imgRef} className="relative h-full w-full will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn('object-cover', imageClassName)}
        />
      </div>
    </div>
  );
}
