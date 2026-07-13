import type { ReactNode } from 'react';

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface Collection {
  id: string;
  index: string;
  name: string;
  material: string;
  year: string;
  image: string;
  alt: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface MarqueeItem {
  id: string;
  label: string;
}

export interface ManifestoLine {
  id: string;
  text: string;
  emphasis?: boolean;
}

export interface BrandConfig {
  name: string;
  wordmark: string;
  tagline: string;
  founded: string;
  location: string;
  description: string;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}
