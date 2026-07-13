/** Shared animation + layout constants. */

export const EASE = {
  norell: [0.22, 1, 0.36, 1] as const,
  in: [0.62, 0, 0.36, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
};

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  reveal: 1.4,
};

export const SITE = {
  url: 'https://studio-norell.vercel.app',
  title: 'Studio Noréll — Collectible Furniture Atelier',
  description:
    'Studio Noréll is an atelier of collectible furniture — objects composed with architectural restraint, warm materiality and a patience that outlasts trend.',
  ogImage: '/og.svg',
};
