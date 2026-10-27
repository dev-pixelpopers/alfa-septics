"use client";

import Image from "next/image";
import { useRef } from "react";
import { CheckIcon } from "@/components/contact/icons";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { CtaBand } from "@/components/ui/CtaBand";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { PROCESS_STEPS } from "@/lib/site";

const PROMISES = [
  {
    title: "One contractor, start to finish",
    body: "The same team evaluates, designs, permits, and builds your system, so nothing gets lost between handoffs.",
  },
  {
    title: "Paperwork handled for you",
    body: "We prepare the permit application and work with the county, so you're not chasing approvals.",
  },
  {
    title: "Built to pass inspection",
    body: "Every system is installed to TCEQ standards and readied for the county's final review.",
  },
];

const number = (i: number) => String(i + 1).padStart(2, "0");

/** /process: hero, one section per step, promises and a closing CTA. */
export function ProcessView() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-lede]", { y: "3rem" }, { y: 0, autoAlpha: 1 }, 0.45);

      // Each step: photo slides in from its side, copy rises after it.
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        const fromLeft = step.dataset.side === "left";
        gsap
          .timeline({
            defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1.1 },
            scrollTrigger: { trigger: step, start: "top 75%" },
          })
          .fromTo(step.querySelector("[data-step-photo]"), { x: fromLeft ? "-12rem" : "12rem" }, { x: 0, autoAlpha: 1 })
          .fromTo(step.querySelectorAll("[data-step-copy]"), { y: "5rem" }, { y: 0, autoAlpha: 1, stagger: 0.1 }, 0.2);

        // Gentle parallax inside the photo mask while the step crosses the viewport.
        gsap.fromTo(
          step.querySelector("[data-step-image]"),
          { yPercent: -6 },
          { yPercent: 6, ease: "none", scrollTrigger: { trigger: step, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      gsap.fromTo(
        "[data-promise]",
        { y: "6rem" },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          ease: EASE_REVEAL,
          duration: reduce ? 0.01 : 1,
          scrollTrigger: { trigger: "[data-promises]", start: "top 75%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-[20rem] pt-[24rem] text-white">
        <div className="absolute inset-0 -z-10">
          <BrandBackground />
        </div>
        <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
          <p data-hero-lede className="invisible text-[2rem] uppercase tracking-[0.6rem] text-white/70">
            Our Process
          </p>
          <h1 className="mt-[2.4rem] font-display text-[14rem] uppercase leading-[0.88] tracking-[-0.8rem]">
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block">
                From site
              </span>
            </span>
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block text-[#8fd8f0]">
                to system
              </span>
            </span>
          </h1>
          <p data-hero-lede className="invisible mt-[3.6rem] w-[76rem] text-[2.4rem] leading-[1.5] text-white/85">
            Five clear steps take your project from bare ground to an approved, working system — with one team
            handling every part of it.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-snow py-[16rem]">
        <ol className="mx-auto flex w-[164rem] flex-col gap-[16rem]">
          {PROCESS_STEPS.map((step, i) => {
            const photoLeft = i % 2 === 0;
            return (
              <li
                key={step.slug}
                id={step.slug}
                data-step
                data-side={photoLeft ? "left" : "right"}
                className="grid scroll-mt-[20rem] grid-cols-2 items-center gap-[12rem]"
              >
                {/* Photo card: navy square tilted behind a slightly tilted photo mask, as on the homepage */}
                <div data-step-photo className={`invisible relative px-[3rem] py-[3rem] ${photoLeft ? "" : "order-2"}`}>
                  <div
                    aria-hidden
                    className={`absolute inset-[3rem] bg-brand-navy ${photoLeft ? "rotate-[4deg]" : "-rotate-[4deg]"}`}
                  />
                  <div
                    className={`relative aspect-square overflow-hidden ${photoLeft ? "rotate-[2deg]" : "-rotate-[2deg]"}`}
                  >
                    <div data-step-image className="absolute -inset-y-[8%] inset-x-0">
                      <Image src={step.image} alt={step.alt} fill sizes="45vw" className="object-cover" />
                    </div>
                  </div>
                </div>

                <div>
                  <p
                    data-step-copy
                    className="invisible font-display text-[16rem] font-black leading-[0.8] text-transparent [-webkit-text-stroke:0.2rem_var(--color-brand-cyan)]"
                  >
                    {number(i)}
                  </p>
                  <h2
                    data-step-copy
                    className="invisible mt-[3.2rem] font-display text-[7.2rem] font-black uppercase leading-[0.95] tracking-[-0.3rem] text-brand-navy"
                  >
                    {step.title}
                  </h2>
                  <p data-step-copy className="invisible mt-[2.4rem] w-[60rem] text-[2.4rem] leading-[1.5] text-ink-muted">
                    {step.body}
                  </p>
                  <ul data-step-copy className="invisible mt-[4rem] flex flex-col gap-[2rem]">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-start gap-[2rem] text-[2rem] leading-[1.5] text-brand-navy">
                        <span className="mt-[0.2rem] grid size-[3.2rem] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy text-white">
                          <CheckIcon className="size-[1.8rem]" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Promises */}
      <section data-promises className="bg-white py-[14rem]">
        <div className="mx-auto w-[164rem]">
          <h2 className="text-center font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy">
            Why it <span className="text-brand-cyan">works</span>
          </h2>
          <ul className="mt-[7.2rem] grid grid-cols-3 gap-[3.2rem]">
            {PROMISES.map((promise) => (
              <li
                key={promise.title}
                data-promise
                className="invisible rounded-[3.2rem] bg-snow p-[4.8rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)]"
              >
                <h3 className="font-display text-[3.2rem] uppercase leading-[1.05] text-brand-navy">{promise.title}</h3>
                <p className="mt-[2rem] text-[2rem] leading-[1.5] text-ink-muted">{promise.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
