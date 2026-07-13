'use client';

import type { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';
import { useCursorHandlers } from '@/providers/CursorProvider';
import { cn } from '@/utils/cn';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'light' | 'outline-light';
  strength?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * A magnetic, cursor-aware button. Inner label counter-moves slightly for
 * a layered, tactile feel. Renders as <a> when href is provided.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  strength = 0.4,
  className,
  ariaLabel,
}: MagneticButtonProps) {
  const magnetic = useMagnetic<HTMLDivElement>({ strength });
  const cursorHandlers = useCursorHandlers('hover');

  const base =
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-500 ease-norell';

  const variants: Record<string, string> = {
    solid: 'bg-espresso text-bone hover:text-bone',
    outline: 'border border-espresso/25 text-espresso hover:border-espresso/50',
    ghost: 'text-espresso',
    light: 'bg-bone text-espresso hover:text-espresso',
    'outline-light': 'border border-bone/25 text-bone hover:border-bone/50',
  };

  const inner = (
    <>
      <span
        className={cn(
          'absolute inset-0 -z-0 translate-y-full rounded-full bg-clay transition-transform duration-[600ms] ease-norell group-hover:translate-y-0',
          variant === 'ghost' && 'hidden',
        )}
      />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );

  return (
    <div
      ref={magnetic.ref}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={() => {
        magnetic.onPointerLeave();
        cursorHandlers.onPointerLeave();
      }}
      onPointerEnter={cursorHandlers.onPointerEnter}
      className="inline-block will-change-transform"
    >
      {href ? (
        <a href={href} aria-label={ariaLabel} className={cn(base, variants[variant], className)}>
          {inner}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className={cn(base, variants[variant], className)}
        >
          {inner}
        </button>
      )}
    </div>
  );
}
