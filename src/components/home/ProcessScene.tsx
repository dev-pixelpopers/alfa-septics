"use client";

import Image from "next/image";
import { useRef } from "react";
import { PillLink } from "@/components/ui/PillLink";
import { createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";

const STEPS = [
  {
    title: "Site Evaluation",
    body: "We assess your property. Soil, layout, access, and site conditions are evaluated.",
    width: "35.4rem",
  },
  {
    title: "Engineering",
    body: "We plan the system. The right septic or utility solution is designed for your site.",
    width: "38.2rem",
  },
  {
    title: "Permitting",
    body: "We handle the paperwork. Required permits and county requirements are addressed.",
    width: "37.6rem",
  },
  {
    title: "Installation",
    body: "We build it right. Our team handles excavation, installation, and site work.",
    width: "32.4rem",
  },
  {
    title: "Inspection",
    body: "We finish with confidence. The completed system is prepared for county inspection and final approval.",
    width: "44.2rem",
  },
];

// Figma mask layers "01", "02", "03", "4" — one per step; Inspection keeps the Installation shot.
const PHOTOS = [
  { src: "/assets/images/process-site-evaluation.png", alt: "Surveyor taking level readings on a staked-out lot" },
  { src: "/assets/images/process-engineering.png", alt: "Engineer drafting a septic system plan at a desk" },
  { src: "/assets/images/process-permitting.png", alt: "Approved septic permit held up on site" },
  { src: "/assets/images/process-installation.png", alt: "Crew trenching beside a house with a mini excavator" },
];

const ACTIVE = "#31a2ca";
const IDLE = "#666666";

function StepCheck({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 46 46" className="size-[4.6rem] shrink-0" aria-hidden>
      <circle cx="23" cy="23" r="23" fill={active ? ACTIVE : "#D8D8D8"} />
      <path d="M14 22.2197L18.3725 30L32 16" stroke="white" strokeWidth="4" fill="none" />
    </svg>
  );
}

/** Variant31 → Variant34 (continued through all five steps) */
export function ProcessScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const titles = q("[data-step-title]");
      const checks = q("[data-step-check]");
      const photos = q("[data-photo]");

      gsap.set(titles.slice(1), { color: IDLE });
      gsap.set(checks.slice(1), { autoAlpha: 0 });
      gsap.set(photos.slice(1), { yPercent: 100 });

      const tl = createSceneTimeline(root.current!).to({}, { duration: 0.3 });
      for (let step = 1; step < STEPS.length; step++) {
        const at = step - 0.7;
        // Highlight hands off down the list mid-move.
        tl.to(titles[step - 1], { color: IDLE, ease: "power1.inOut", duration: 0.5 }, at + 0.25)
          .to(checks[step - 1], { autoAlpha: 0, scale: 0.6, ease: "power2.in", duration: 0.4 }, at + 0.25)
          .to(titles[step], { color: ACTIVE, ease: "power1.inOut", duration: 0.5 }, at + 0.35)
          .fromTo(checks[step], { scale: 0.6 }, { autoAlpha: 1, scale: 1, ease: "back.out(2)", duration: 0.5 }, at + 0.4);
        // Next photo slides up over the last (Figma "02"/"03" at top 959 → 190); the last drifts up behind it.
        if (photos[step]) {
          tl.to(photos[step], { yPercent: 0 }, at).to(photos[step - 1], { yPercent: -20 }, at);
        }
      }
      tl.to({}, { duration: 0.6 });
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} className="relative h-[390vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-white">
        <h2 className="relative z-10 mt-[1.3rem] w-[178.3rem] whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] text-brand-cyan">
          From Site to System
        </h2>

        <div className="-mt-[1.1rem] flex h-[92.4rem] w-[171.9rem] shrink-0 items-start bg-mist pl-[16.8rem] pt-[4rem]">
          {/* Photo card: navy square tilted behind a slightly tilted photo mask */}
          <div className="relative grid size-[76rem] shrink-0 place-items-center">
            <div aria-hidden className="absolute size-[71.14rem] rotate-[4.09deg] bg-brand-navy" />
            <div className="relative size-[71.14rem] rotate-[2deg] overflow-hidden">
              {PHOTOS.map((photo) => (
                <div key={photo.src} data-photo className="absolute inset-0">
                  <Image src={photo.src} alt={photo.alt} fill sizes="40vw" loading="eager" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="ml-[14.1rem] pt-[2.2rem]">
            <ol className="relative flex flex-col gap-[4.5rem]">
              <span aria-hidden className="absolute left-[2.15rem] top-[2.4rem] h-[55.1rem] w-[0.3rem] bg-ink-muted" />
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-[3.9rem]">
                  <span className="relative size-[4.6rem] shrink-0">
                    <StepCheck />
                    <span data-step-check className={`absolute inset-0 ${i === 0 ? "" : "invisible"}`}>
                      <StepCheck active />
                    </span>
                  </span>
                  <div>
                    <h3
                      data-step-title
                      className="whitespace-nowrap font-display text-[3.5rem] font-black leading-[4rem]"
                      style={{ color: i === 0 ? ACTIVE : IDLE }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-[0.6rem] text-[1.8rem] leading-[2.3rem] text-ink-muted" style={{ width: step.width }}>
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <PillLink href="#contact" variant="gradient" className="ml-[2.3rem] mt-[3.5rem] w-[31.1rem]">
              Start Your Project
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
