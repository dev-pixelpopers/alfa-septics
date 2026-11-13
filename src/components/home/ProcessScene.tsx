"use client";

import Image from "next/image";
import { useRef } from "react";
import { PillLink } from "@/components/ui/PillLink";
import { createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";
import { PROCESS_STEPS } from "@/lib/site";

// Body text widths from the Figma frames, one per step.
const BODY_WIDTHS = ["35.4rem", "38.2rem", "37.6rem", "32.4rem", "44.2rem"];
const STEPS = PROCESS_STEPS.map((step, i) => ({ ...step, width: BODY_WIDTHS[i] }));

// One photo per step (Figma mask layers "01"–"03", then real job-site photos).
const PHOTOS = PROCESS_STEPS.map((step) => ({ src: step.image, alt: step.alt }));

const ACTIVE = "#31a2ca";
const IDLE = "#666666";

function StepCheck({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 46 46" className="size-full shrink-0" aria-hidden>
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
      {/* Mobile (max-sm): one centred column — heading, landscape photo card, steps, CTA. */}
      <div className="sticky top-0 flex min-h-[120dvh] flex-col items-center overflow-hidden bg-white max-sm:h-svh max-sm:min-h-0 max-sm:justify-center max-sm:gap-0!">
        <h2 className="relative z-10 mt-[1.3rem] w-[178.3rem] whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] text-brand-cyan max-sm:mt-0 max-sm:w-full max-sm:whitespace-normal max-sm:px-[16px] max-sm:text-[clamp(30px,min(11vw,6.2svh),46px)] max-sm:tracking-[-0.04em]">
          From Site to System
        </h2>

        <div className="box-system -mt-[1.1rem] flex h-[92.4rem] w-[171.9rem] shrink-0 items-start bg-mist pl-[16.8rem] pt-[4rem] max-sm:mt-[min(12px,1.2svh)] max-sm:h-auto max-sm:w-[calc(100%-32px)] max-sm:flex-col max-sm:items-stretch max-sm:p-[14px]!">
          {/* Photo card: navy square tilted behind a slightly tilted photo mask */}
          <div className="relative grid size-[76rem] shrink-0 place-items-center max-sm:h-[min(180px,20svh)] max-sm:w-full">
            <div
              aria-hidden
              className="system-bg absolute size-[71.14rem] rotate-[4.09deg] bg-brand-navy max-sm:h-[88%]! max-sm:w-[90%] max-sm:rotate-[2.5deg]"
            />
            <div className="relative size-[71.14rem] rotate-[2deg] overflow-hidden site-system max-sm:h-[88%]! max-sm:w-[90%] max-sm:rotate-[1deg]">
              {PHOTOS.map((photo) => (
                <div key={photo.src} data-photo className="absolute inset-0">
                  <Image src={photo.src} alt={photo.alt} fill sizes="40vw" loading="eager" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="ml-[14.1rem] pt-[2.2rem] system-content max-sm:ml-0 max-sm:mt-[min(14px,1.8svh)] max-sm:pt-0">
            <ol className="relative flex flex-col gap-[4.5rem] max-sm:gap-[min(12px,1.5svh)]!">
              <span
                aria-hidden
                className="absolute left-[2.15rem] top-[2.4rem] h-[55.1rem] w-[0.3rem] bg-ink-muted max-sm:bottom-[56px] max-sm:left-[11px] max-sm:top-[12px] max-sm:h-auto max-sm:w-[2px]"
              />
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-[3.9rem] max-sm:gap-[14px]">
                  <span className="relative size-[4.6rem] shrink-0 max-sm:size-[24px]">
                    <StepCheck />
                    <span data-step-check className={`absolute inset-0 ${i === 0 ? "" : "invisible"}`}>
                      <StepCheck active />
                    </span>
                  </span>
                  <div>
                    <h3
                      data-step-title
                      className="whitespace-nowrap font-display text-[3.5rem] font-black leading-[4rem] max-sm:text-[17px]! max-sm:leading-[24px]"
                      style={{ color: i === 0 ? ACTIVE : IDLE }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-[0.6rem] w-(--body-w) text-[1.8rem] leading-[2.3rem] text-ink-muted max-sm:mt-0 max-sm:w-auto! max-sm:text-[12.5px]! max-sm:leading-[16px]!"
                      style={{ "--body-w": step.width } as React.CSSProperties}
                    >
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <PillLink
              href="/contact"
              variant="gradient"
              className="ml-[2.3rem] mt-[3.5rem] w-[31.1rem] max-sm:mx-0 max-sm:mt-[min(16px,2svh)] max-sm:h-[44px] max-sm:w-full max-sm:gap-[10px] max-sm:text-[15px] max-sm:leading-none max-sm:[&>svg]:w-[14px]"
            >
              Start Your Project
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
