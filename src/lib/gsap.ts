"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Figma's "Ease out" smart-animate curve.
export const FIGMA_EASE_OUT = "power2.out";
// Reveals settle softly; state-to-state moves accelerate and settle.
export const EASE_REVEAL = "power3.out";
export const EASE_MOVE = "power3.inOut";

/**
 * Scrubbed timeline for the sticky-scene pattern: `trigger` is the tall parent,
 * its sticky child stays pinned by CSS while the timeline maps 0 → 1 progress
 * onto the prototype states. One prototype step == 1 unit of timeline time.
 */
export function createSceneTimeline(trigger: Element) {
  return gsap.timeline({
    defaults: { ease: EASE_MOVE, duration: 1 },
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "bottom bottom",
      // Light smoothing; every scene ends on a hold step so it settles before unpinning.
      scrub: 0.8,
    },
  });
}

export { gsap, ScrollTrigger, useGSAP };
