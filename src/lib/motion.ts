import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Shared timing so the whole narrative feels like one edit. */
export const motion = {
  durations: {
    fast: 0.35,
    base: 0.8,
    slow: 1.2,
    scene: 1.6,
  },
  ease: {
    out: 'power3.out',
    inOut: 'power2.inOut',
    expo: 'expo.out',
    soft: 'sine.inOut',
  },
  stagger: {
    tight: 0.06,
    base: 0.09,
    loose: 0.14,
  },
} as const;

/**
 * Allows QA and users to force a motion mode with ?motion=reduced or
 * ?motion=full. The media query remains the default source of truth.
 */
export function readMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  const param = new URLSearchParams(window.location.search).get('motion');
  if (param === 'reduced') return true;
  if (param === 'full') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersReducedMotion(): boolean {
  return readMotionPreference();
}
