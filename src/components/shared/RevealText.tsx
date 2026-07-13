'use client';

import { createElement, type ElementType } from 'react';
import { useTextReveal } from '@/hooks/useTextReveal';
import type { SplitType } from '@/utils/splitText';
import { cn } from '@/utils/cn';

interface RevealTextProps {
  as?: ElementType;
  children: string;
  type?: SplitType;
  stagger?: number;
  duration?: number;
  delay?: number;
  scroll?: boolean;
  className?: string;
}

/**
 * Declarative wrapper around useTextReveal — masked, staggered word/char reveal.
 * Falls back to plain text when reduced motion is preferred (handled in hook).
 */
export function RevealText({
  as = 'span',
  children,
  type = 'words',
  stagger,
  duration,
  delay,
  scroll,
  className,
}: RevealTextProps) {
  const ref = useTextReveal<HTMLElement>({ type, stagger, duration, delay, scroll });

  return createElement(
    as,
    { ref, className: cn(className) },
    children,
  );
}
