"use client";

import Image from "next/image";
import { useRef } from "react";
import { EASE_REVEAL, createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";
import { projectPhoto } from "@/lib/site";

type Shot = { src: string; alt: string; width: number; height: number; flyFrom?: string };

// Left → right as laid out in Variant39 (box sizes in design px). `flyFrom` is the
// Variant38 offset each thumb flies in from.
const SHOTS: Shot[] = [
  { src: projectPhoto("crane-lowering-tank"), alt: "Crane lowering a concrete septic tank into place", width: 166, height: 331, flyFrom: "-192.6rem" },
  { src: projectPhoto("tank-install-trench-worker"), alt: "Installer connecting a green poly tank in a trench", width: 166, height: 331, flyFrom: "-128.4rem" },
  { src: projectPhoto("trench-to-tank"), alt: "Drain line trench leading to installed tank risers", width: 165, height: 331, flyFrom: "-64.2rem" },
  { src: projectPhoto("crane-truck-site"), alt: "Crane truck delivering a septic tank across an open lot", width: 627, height: 480 },
  { src: projectPhoto("poly-tank-excavator"), alt: "Green poly septic tank beside a mini excavator", width: 165, height: 331, flyFrom: "64.2rem" },
  { src: projectPhoto("crane-tank-delivery"), alt: "Concrete septic tank lifted off a crane truck", width: 166, height: 331, flyFrom: "128.4rem" },
  { src: projectPhoto("field-trench-excavator"), alt: "Long drain field trench cut across a grassy property", width: 166, height: 331, flyFrom: "192.6rem" },
];

/** Variant34 → Variant39 */
export function GalleryScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const thumbs = q("[data-thumb]") as HTMLElement[];

      gsap.set(q("[data-heading]"), { clipPath: "inset(0% 0% 100% 0%)", y: "5rem" });
      gsap.set(q("[data-panel]"), { scaleY: 0, transformOrigin: "top center" });
      gsap.set(q("[data-main]"), { y: "75rem", autoAlpha: 0 });
      thumbs.forEach((thumb) => gsap.set(thumb, { x: thumb.dataset.flyFrom, autoAlpha: 0 }));
      gsap.set(q("[data-categories]"), { y: "6rem" });

      // Thumbs closest to the centre land first, then ripple outwards.
      const byDistance = [...thumbs].sort(
        (a, b) => Math.abs(parseFloat(a.dataset.flyFrom!)) - Math.abs(parseFloat(b.dataset.flyFrom!)),
      );

      createSceneTimeline(root.current!)
        // V35 → V36: heading wipes in.
        .to(q("[data-heading]"), { clipPath: "inset(0% 0% 0% 0%)", y: 0, ease: EASE_REVEAL, duration: 1.2 }, 0)
        // V36 → V37: grey panel drops open.
        .to(q("[data-panel]"), { scaleY: 1 }, 0.8)
        // V37 → V38: hero shot rises into the panel.
        .to(q("[data-main]"), { y: 0, autoAlpha: 1, ease: EASE_REVEAL, duration: 1.2 }, 1.6)
        // V38 → V39: thumbs fly in from both sides, meta fades up.
        .to(byDistance, { x: 0, autoAlpha: 1, ease: EASE_REVEAL, duration: 1.2, stagger: 0.12 }, 2.6)
        .to(q("[data-meta]"), { autoAlpha: 1, ease: EASE_REVEAL }, 3.2)
        .to(q("[data-categories]"), { y: 0, ease: EASE_REVEAL }, 3.2)
        .to({}, { duration: 0.6 });
    },
    { scope: root },
  );

  return (
    <section id="gallery" ref={root} className="relative h-[400vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-white">
        <div aria-hidden data-panel className="absolute left-[calc(50%-42.3rem)] top-[8rem] h-[85.3rem] w-[86rem] bg-cloud" />

        <div className="relative mt-[5.7rem] h-[14.8rem] w-[160.2rem]">
          <h2
            data-heading
            className="whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] text-brand-navy"
          >
            Built in the Field
          </h2>
        </div>

        <div className="relative mt-[6.6rem] flex items-end gap-[3rem]">
          {SHOTS.map((shot) => (
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes={shot.flyFrom ? "10vw" : "35vw"}
              loading="eager"
              data-thumb={shot.flyFrom ? "" : undefined}
              data-fly-from={shot.flyFrom}
              data-main={shot.flyFrom ? undefined : ""}
              className="block object-cover"
              style={{ width: `${shot.width / 10}rem`, height: `${shot.height / 10}rem` }}
            />
          ))}
          <p
            data-meta
            className="invisible absolute left-[165.7rem] top-[7rem] w-[10rem] font-albert text-[2rem] font-light leading-[1.8] text-brand-navy"
          >
            01 / {String(SHOTS.length).padStart(2, "0")}
          </p>
        </div>

        <div data-categories className="relative flex flex-col items-center">
          <p data-meta className="invisible mt-[7.1rem] flex gap-[2.2rem] text-[2rem] leading-[1.8] text-ink-soft">
            <span>Septic Installation</span>
            <span className="text-brand-navy">Excavation</span>
            <span>Site Preparation</span>
          </p>
          <span data-meta aria-hidden className="invisible ml-[1.5rem] mt-[5.5rem] h-[0.3rem] w-[3.5rem] bg-brand-navy" />
        </div>
      </div>
    </section>
  );
}
