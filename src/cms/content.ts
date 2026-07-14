import type {
  BrandConfig,
  Collection,
  HeroHotspot,
  ManifestoLine,
  MarqueeItem,
  NavLink,
  Stat,
} from '@/types';

/**
 * Single source of truth for editorial copy and content.
 * In a production system this would be sourced from a headless CMS
 * (Sanity / Contentful); the shape here mirrors that contract.
 */

export const brand: BrandConfig = {
  name: 'Studio Noréll',
  wordmark: 'NORÉLL',
  tagline: 'Quietly monumental.',
  founded: '2014',
  location: 'Copenhagen · Milan',
  description:
    'Studio Noréll is an atelier of collectible furniture — objects composed with architectural restraint, warm materiality and a patience that outlasts trend.',
};

export const navLinks: NavLink[] = [
  { id: 'collections', label: 'Collections', href: '#collections' },
  { id: 'atelier', label: 'The Atelier', href: '#atelier' },
  { id: 'philosophy', label: 'Philosophy', href: '#philosophy' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const heroStats: Stat[] = [
  { value: '11', label: 'Years of practice' },
  { value: '48', label: 'Collectible pieces' },
  { value: '9', label: 'Ateliers worldwide' },
];

export const marqueeItems: MarqueeItem[] = [
  { id: 'm1', label: 'Hand-finished' },
  { id: 'm2', label: 'Solid oak' },
  { id: 'm3', label: 'Made to endure' },
  { id: 'm4', label: 'Editorial forms' },
  { id: 'm5', label: 'Quiet luxury' },
  { id: 'm6', label: 'Slow craft' },
];

export const collections: Collection[] = [
  {
    id: 'c1',
    index: '01',
    name: 'Vellÿ Lounge',
    material: 'Oiled oak · bouclé',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80',
    alt: 'A sculptural lounge chair in a sunlit gallery interior',
  },
  {
    id: 'c2',
    index: '02',
    name: 'Måre Table',
    material: 'Travertine · brass',
    year: '2023',
    image:
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80',
    alt: 'A minimalist stone dining table in a warm architectural space',
  },
  {
    id: 'c3',
    index: '03',
    name: 'Sölden Sofa',
    material: 'Walnut · wool',
    year: '2024',
    image:
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80',
    alt: 'A low modular sofa framed by soft natural light',
  },
  {
    id: 'c4',
    index: '04',
    name: 'Norr Credenza',
    material: 'Smoked ash · linen',
    year: '2022',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    alt: 'A refined storage credenza against a plaster wall',
  },
];

export const manifestoLines: ManifestoLine[] = [
  { id: 'l1', text: 'We do not follow seasons.' },
  { id: 'l2', text: 'We compose objects for the', emphasis: false },
  { id: 'l3', text: 'rooms you will grow old in', emphasis: true },
  { id: 'l4', text: '— shaped by hand, softened by time.' },
];

export const heroWords = ['Furniture', 'as', 'quiet', 'architecture'];

/**
 * Inspection points anchored to the hero chair (local-space coordinates within
 * the scaled chair group). Reveal spec cards when explored.
 */
export const heroHotspots: HeroHotspot[] = [
  {
    id: 'sofa',
    index: '01',
    position: [0.1, 0.85, -1.35],
    title: 'Sölden Sofa',
    detail: 'A low, deep three-seater in sheened velvet over a solid ash frame.',
    spec: 'VELVET · WALNUT · 2024',
    camPos: [0.4, 1.0, 1.4],
    camTarget: [0, 0.6, -1.6],
    story:
      'It begins here. A sofa low enough to sink into and wide enough to lose an afternoon — the quiet centre the whole room is arranged around.',
  },
  {
    id: 'table',
    index: '02',
    position: [0.0, 0.55, -0.3],
    title: 'Måre Table',
    detail: 'A monolithic travertine top on slender darkened-brass legs.',
    spec: 'TRAVERTINE · BRASS',
    camPos: [0.1, 1.05, 1.2],
    camTarget: [0, 0.45, -0.3],
    story:
      'A single slab of travertine, still cool to the touch at noon. Coffee rings, open books, the odd bowl of olives — it wears a life well.',
  },
  {
    id: 'chair',
    index: '03',
    position: [1.8, 0.8, -0.45],
    title: 'Vellÿ Lounge',
    detail: 'Our signature bouclé lounge chair — hand-finished, made to order.',
    spec: 'WOOL BOUCLÉ · OAK',
    camPos: [3.4, 0.95, 1.3],
    camTarget: [1.8, 0.5, -0.45],
    story:
      'Pulled a little apart from the rest — the reading chair. Bouclé you can feel through a Sunday, on legs bent from a single length of oak.',
  },
  {
    id: 'shelf',
    index: '04',
    position: [-3.4, 1.85, -2.7],
    title: 'The Shelf',
    detail: 'Objects gathered over years — the way a room earns its character.',
    spec: 'OAK · BRASS · FOUND OBJECTS',
    camPos: [-1.4, 1.7, 0.4],
    camTarget: [-3.4, 1.6, -2.8],
    story:
      'The things that make it yours: books half-read, a camera that still works, a small brass bird. A room is really just a shelf that grew.',
  },
  {
    id: 'lamp',
    index: '05',
    position: [-2.3, 1.75, -1.5],
    title: 'Norr Light',
    detail: 'A warm, dimmable reading lamp in patinated brass and linen.',
    spec: 'BRASS · LINEN · 2700K',
    camPos: [-0.6, 1.6, 1.2],
    camTarget: [-2.3, 1.4, -1.5],
    story:
      'And when the sun goes, this stays. A pool of 2700-kelvin warmth that turns the room in on itself — the last light left on.',
  },
];
