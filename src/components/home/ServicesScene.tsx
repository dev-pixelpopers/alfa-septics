"use client";

import Image from "next/image";
import { useRef } from "react";
import { PillLink } from "@/components/ui/PillLink";
import { StickyBackdrop } from "@/components/ui/StickyBackdrop";
import { EASE_REVEAL, createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";

const SERVICES = [
  {
    title: "Aerobic Septic Systems",
    body: "Efficient aerobic systems designed, installed, and maintained for Texas properties.",
    image: "/assets/images/service-aerobic-septic.jpg",
    alt: "Concrete aerobic septic tank with green access lids set in an open excavation",
  },
  {
    title: "Conventional Septic Systems",
    body: "Reliable septic solutions built around your property, soil, and site requirements.",
    image: "/assets/images/service-conventional-septic.png",
    alt: "Cutaway of a conventional septic tank and drain field beside a house",
  },
  {
    title: "Commercial Utilities",
    body: "Utility installation for commercial developments, new construction, and larger sites.",
    image: "/assets/images/service-commercial-utilities.png",
    alt: "Cutaway of commercial utility tanks and piping beside an office building",
  },
];

/** Variant26 → Variant31 */
export function ServicesScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const images = q("[data-service-image]");

      gsap.set(q("[data-heading]"), { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(q("[data-lede]"), { x: "15rem", autoAlpha: 0 });
      gsap.set(images.slice(1), { yPercent: 100 });

      // V27 → V28: heading wipes in, lede slides in from the right — tied to the intro
      // scrolling into view. V28 → V29 is plain page movement, so it's native scroll.
      gsap
        .timeline({
          scrollTrigger: { trigger: q("[data-intro]")[0], start: "top 60%", end: "top 15%", scrub: 0.8 },
        })
        .to(q("[data-heading]"), { clipPath: "inset(0% 0% 0% 0%)", y: 0, ease: EASE_REVEAL }, 0)
        .to(q("[data-lede]"), { x: 0, autoAlpha: 1, ease: EASE_REVEAL }, 0.25);

      // V29 → V31 (pinned): next photo slides up over the last one (which drifts up
      // behind it), copy + counter roll up in step.
      const tl = createSceneTimeline(q("[data-carousel]")[0]).to({}, { duration: 0.5 });
      images.slice(1).forEach((image, i) => {
        const step = i + 1;
        const at = step - 0.5;
        tl.to(image, { yPercent: 0 }, at)
          // .to(images[step - 1], { yPercent: -25 }, at)
          .to(q("[data-copy]"), { y: `${-30.5 * step}rem` }, at)
          .to(q("[data-counter]"), { y: `${-4 * step}rem` }, at);
      });
      tl.to({}, { duration: 0.6 });
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} className="relative text-white">
      <StickyBackdrop>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#3fcdf1_0%,#2b9fdc_45%,#36c6ef_100%)]" />
      </StickyBackdrop>

      {/* Intro (Variant28 layout) */}
      <div data-intro className="relative flex h-[58.1rem] flex-col items-center pt-[12.5rem]">
        <div className="h-[31.1rem] w-[160.4rem]">
          <h2
            data-heading
            className="whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] [text-shadow:0_1rem_0_#2c3c92]"
          >
            <span className="block">Complete Site &amp;</span>
            <span className="block">Septic Solutions</span>
          </h2>
        </div>
        <p data-lede className="invisible relative z-10 mt-[3.3rem] w-[118.4rem] text-center text-[4.4rem] leading-[5.4rem]">
          From new septic installations to commercial utility work, we handle the job from preparation to completion.
        </p>
      </div>

      {/* Carousel (Variant29–31), pinned */}
      <div data-carousel className="relative h-[290vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-x-0 top-[26.4rem] h-[37.1rem] bg-gradient-to-r from-[rgba(44,60,146,0)] via-[rgba(44,60,146,0.5)] to-[rgba(44,60,146,0)]"
          />
          <div aria-hidden className="absolute right-[6.8rem] top-[23.6rem] flex gap-[1rem]">
            <span className="size-[1rem] rounded-full bg-white opacity-50" />
            <span className="size-[1rem] rounded-full bg-white" />
            <span className="size-[1rem] rounded-full bg-white" />
          </div>

          <div className="relative flex items-start">
            <p className="flex w-[23.4rem] pl-[2.4rem] pt-[67rem] text-[2.9rem] leading-[4rem]" aria-hidden>
              <span className="h-[4rem] w-[3.9rem] overflow-hidden text-right">
                <span data-counter className="flex flex-col">
                  {SERVICES.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </span>
              </span>
              <span>/{SERVICES.length}</span>
            </p>

            <div className="relative ml-[3.6rem] mt-[8.6rem] h-[69.2rem] w-[71rem] rotate-[3deg] overflow-hidden rounded-[4.8rem] shadow-[0_2rem_6rem_rgba(0,0,0,0.25)]">
              {SERVICES.map((service) => (
                <div key={service.title} data-service-image className="absolute inset-0">
                  <Image src={service.image} alt={service.alt} fill sizes="40vw" loading="eager" className="object-cover" />
                </div>
              ))}
            </div>

            <div className="ml-[8rem] pt-[31.7rem]">
              <div className="h-[28.9rem] w-[66rem] overflow-hidden">
                <ul data-copy>
                  {SERVICES.map((service) => (
                    <li key={service.title} className="h-[30.5rem]">
                      <h3 className="flex h-[13.3rem] w-[58.5rem] items-center font-display text-[7rem] font-black capitalize leading-[7.3rem]">
                        {service.title}
                      </h3>
                      <p className="mt-[4.5rem] w-[62.6rem] text-[2.9rem] leading-[4rem]">{service.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <PillLink href="#services" className="mt-[10.5rem] w-[29.4rem]">
                View All Services
              </PillLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
