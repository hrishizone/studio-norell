'use client';

import { Fragment } from 'react';
import { PiAsteriskBold } from 'react-icons/pi';
import type { MarqueeItem } from '@/types';
import { cn } from '@/utils/cn';

interface MarqueeProps {
  items: MarqueeItem[];
  className?: string;
}

/** Seamless CSS marquee (duplicated track). Pauses on hover. */
export function Marquee({ items, className }: MarqueeProps) {
  const track = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <Fragment key={item.id}>
          <span className="font-display text-2xl italic text-espresso/80 sm:text-3xl">
            {item.label}
          </span>
          <PiAsteriskBold className="h-4 w-4 shrink-0 text-clay" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        'group flex w-full overflow-hidden border-y border-espresso/10 py-6',
        className,
      )}
    >
      <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
        {track}
        {track}
      </div>
    </div>
  );
}
