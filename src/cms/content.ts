import type {
  BrandConfig,
  Collection,
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
