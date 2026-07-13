'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Central GSAP configuration. We deliberately avoid Club/premium plugins
 * (SplitText, etc.) and register only the free ScrollTrigger plugin, so the
 * project installs and runs with the public npm package.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });
  registered = true;
}

export { gsap, ScrollTrigger };
