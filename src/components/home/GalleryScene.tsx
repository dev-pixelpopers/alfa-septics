"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { EASE_REVEAL, createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";
import { projectPhoto, sitePrepPhoto } from "@/lib/site";

type Photo = { src: string; alt: string };

// Left → right as laid out in Variant39 (box sizes in design px). `flyFrom` is the
// Variant38 offset each thumb flies in from; the slot without one is the hero shot.
const SLOTS = [
  { width: 166, height: 331, flyFrom: "-192.6rem" },
  { width: 166, height: 331, flyFrom: "-128.4rem" },
  { width: 165, height: 331, flyFrom: "-64.2rem" },
  { width: 627, height: 480 },
  { width: 165, height: 331, flyFrom: "64.2rem" },
  { width: 166, height: 331, flyFrom: "128.4rem" },
  { width: 166, height: 331, flyFrom: "192.6rem" },
];

// One photo per slot; slot 4 (the hero) wants a landscape shot.
const CATEGORIES: { label: string; photos: Photo[] }[] = [
  {
    label: "Septic Installation",
    photos: [
      { src: projectPhoto("tank-in-excavation-crew"), alt: "Crew setting a concrete septic tank in a freshly dug excavation" },
      { src: projectPhoto("tank-in-trench-risers"), alt: "Concrete septic tank with green risers set in a trench" },
      { src: projectPhoto("tank-risers-set"), alt: "Tank risers and lids set on a concrete septic tank" },
      { src: projectPhoto("crane-tank-crew"), alt: "Crew guiding a concrete tank off a crane truck" },
      { src: projectPhoto("tank-backfilled-risers"), alt: "Finished tank risers ready for county inspection" },
      { src: projectPhoto("technician-servicing-riser"), alt: "Technician working on a green septic riser on top of a concrete tank" },
      { src: projectPhoto("tank-pit-risers-pipe"), alt: "Open septic tank with access risers and outlet piping in an excavation" },
    ],
  },
  {
    label: "Excavation",
    photos: [
      { src: projectPhoto("crane-lowering-tank"), alt: "Crane lowering a concrete septic tank into place" },
      { src: projectPhoto("tank-install-trench-worker"), alt: "Installer connecting a green poly tank in a trench" },
      { src: projectPhoto("trench-to-tank"), alt: "Drain line trench leading to installed tank risers" },
      { src: projectPhoto("crane-truck-site"), alt: "Crane truck delivering a septic tank across an open lot" },
      { src: projectPhoto("poly-tank-excavator"), alt: "Green poly septic tank beside a mini excavator" },
      { src: projectPhoto("crane-tank-delivery"), alt: "Concrete septic tank lifted off a crane truck" },
      { src: projectPhoto("field-trench-excavator"), alt: "Long drain field trench cut across a grassy property" },
    ],
  },
  {
    label: "Site Preparation",
    photos: [
      { src: sitePrepPhoto("graded-lot-roadside"), alt: "Freshly graded lot beside a country road" },
      { src: sitePrepPhoto("pasture-cut-utility-stub"), alt: "Cut line across a pasture with a utility stub marked" },
      { src: sitePrepPhoto("aerobic-lids-graded-lot"), alt: "Aerobic system lids and control panel on a newly graded lot" },
      { src: sitePrepPhoto("cleared-wooded-lot"), alt: "Wooded lot cleared down to bare ground and ready to build" },
      { src: sitePrepPhoto("graded-yard-house"), alt: "Yard graded smooth around a renovated home" },
      { src: sitePrepPhoto("graded-yard-spoil-pile"), alt: "Graded backyard with excavated spoil piled by the fence" },
      { src: sitePrepPhoto("driveway-pad-cut"), alt: "Driveway pad cut and leveled alongside a building" },
    ],
  },
];

// Excavation is the one highlighted in the design.
const DEFAULT_CATEGORY = 1;

/** Variant34 → Variant39 */
export function GalleryScene() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(DEFAULT_CATEGORY);
  const activeRef = useRef(DEFAULT_CATEGORY);
  const switched = useRef(false);
  const photos = CATEGORIES[active].photos;

  // Centres the underline beneath the active category label.
  const placeUnderline = (duration: number) => {
    const tabs = root.current!.querySelector<HTMLElement>("[data-tabs]")!;
    const tab = tabs.children[activeRef.current] as HTMLElement;
    gsap.to(root.current!.querySelector("[data-underline]"), {
      x: tab.offsetLeft + tab.offsetWidth / 2 - tabs.offsetWidth / 2,
      duration,
      ease: EASE_REVEAL,
      overwrite: true,
    });
  };

  const { contextSafe } = useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const thumbs = q("[data-thumb]") as HTMLElement[];

      // Label widths shift once the web font lands and on resize.
      const replace = contextSafe!(() => placeUnderline(0));
      replace();
      document.fonts.ready.then(replace);
      window.addEventListener("resize", replace);

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

      return () => window.removeEventListener("resize", replace);
    },
    { scope: root },
  );

  // After a switch: slide the underline over and fade the new photos in.
  useGSAP(
    () => {
      if (!switched.current) return;
      placeUnderline(0.5);
      gsap.fromTo(
        root.current!.querySelector("[data-shots]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5, ease: EASE_REVEAL },
      );
    },
    { scope: root, dependencies: [active] },
  );

  const select = (index: number) =>
    contextSafe(() => {
      if (index === activeRef.current) return;
      activeRef.current = index;
      gsap.to(root.current!.querySelector("[data-shots]"), {
        autoAlpha: 0,
        duration: 0.25,
        overwrite: true,
        onComplete: () => {
          switched.current = true;
          setActive(index);
        },
      });
    })();

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

        <div data-shots className="relative mt-[6.6rem] flex items-end gap-[3rem]">
          {SLOTS.map((slot, i) => (
            <Image
              // Keyed by slot so GSAP's fly-in state survives a category switch.
              key={i}
              src={photos[i].src}
              alt={photos[i].alt}
              width={slot.width}
              height={slot.height}
              sizes={slot.flyFrom ? "10vw" : "35vw"}
              loading="eager"
              data-thumb={slot.flyFrom ? "" : undefined}
              data-fly-from={slot.flyFrom}
              data-main={slot.flyFrom ? undefined : ""}
              className="block object-cover"
              style={{ width: `${slot.width / 10}rem`, height: `${slot.height / 10}rem` }}
            />
          ))}
          <p
            data-meta
            className="invisible absolute left-[165.7rem] top-[7rem] w-[10rem] font-albert text-[2rem] font-light leading-[1.8] text-brand-navy"
          >
            01 / {String(photos.length).padStart(2, "0")}
          </p>
        </div>

        <div data-categories className="relative flex flex-col items-center">
          <div
            data-meta
            data-tabs
            role="group"
            aria-label="Project categories"
            className="invisible mt-[7.1rem] flex gap-[2.2rem] text-[2rem] leading-[1.8]"
          >
            {CATEGORIES.map((category, i) => (
              <button
                key={category.label}
                type="button"
                aria-pressed={i === active}
                onClick={() => select(i)}
                className={
                  i === active
                    ? "cursor-default text-brand-navy"
                    : "cursor-pointer text-ink-soft transition-colors hover:text-brand-navy"
                }
              >
                {category.label}
              </button>
            ))}
          </div>
          <span data-meta data-underline aria-hidden className="invisible mt-[5.5rem] h-[0.3rem] w-[3.5rem] bg-brand-navy" />
        </div>
      </div>
    </section>
  );
}
