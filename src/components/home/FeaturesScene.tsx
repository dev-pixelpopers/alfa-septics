"use client";

import Image from "next/image";
import { useRef } from "react";
import { EASE_REVEAL, createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";
// Card stack from Figma "Features" C001–C004 (shown in that order).
import { FEATURES } from "@/lib/site";

/** Variant21 → Variant26 */
export function FeaturesScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-card]");

      gsap.set(q("[data-heading]"), { clipPath: "inset(0% 0% 100% 0%)", y: "5rem" });
      gsap.set(q("[data-lede]"), { x: "-13rem", autoAlpha: 0 });
      gsap.set(cards, { y: "100rem", rotation: 8, autoAlpha: 1 });

      const tl = createSceneTimeline(root.current!)
        // V21 → V22: heading wipes in, lede slides in from the left.
        .to(q("[data-heading]"), { clipPath: "inset(0% 0% 0% 0%)", y: 0, ease: EASE_REVEAL, duration: 1.2 }, 0)
        .to(q("[data-lede]"), { x: 0, autoAlpha: 1, ease: EASE_REVEAL }, 0.3);

      // V22 → V26: each card swings up into place while the previous one recedes.
      cards.forEach((card, i) => {
        const at = i + 1;
        tl.to(card, { y: 0, ease: EASE_REVEAL, duration: 1.1 }, at);
        if (i > 0) {
          tl.to(cards[i - 1], { autoAlpha: 0, scale: 0.92, y: "-4rem", ease: "power2.in", duration: 0.6 }, at + 0.15);
        }
      });
      tl.to({}, { duration: 0.6 });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative h-[440vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-white">
        <div className="mx-auto mt-[23rem] h-[29.6rem] w-[178.3rem]">
          <h2
            data-heading
            className="whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] text-brand-navy"
          >
            <span className="block">Built on Experience</span>
            <span className="block">Driven by Precision</span>
          </h2>
        </div>
        <p
          data-lede
          className="invisible ml-[23.2rem] mt-[8.7rem] w-[72.8rem] text-right text-[2.9rem] leading-[4rem] text-ink-muted"
        >
          We combine licensed expertise, capable equipment, and clear communication to deliver septic and site utility
          projects without the runaround.
        </p>

        {/* Floating card stack overlapping the heading */}
        <ul className="absolute left-[112.4rem] top-[16.8rem] h-[49.8rem] w-[55rem]">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              data-card
              className="invisible absolute left-0 top-0 flex h-[49.8rem] w-[55rem] rotate-[7.68deg] flex-col overflow-hidden rounded-[5rem] bg-[linear-gradient(to_bottom,#64c3b3cf_0%,#2f9fcf_40%)] pb-[4rem] pl-[4.5rem] pr-[4rem] pt-[5rem] text-white shadow-[0_4rem_8rem_rgba(0,0,0,0.18)]"
            >
              {/* 5.5rem keeps the longest word ("Communication") inside the 46.5rem content box */}
              <h3 className="w-full font-display text-[5.5rem] font-black capitalize leading-[0.96]">
                {feature.title}
              </h3>
              <p className="mt-[2.4rem] w-full text-[2.5rem] leading-[1.5]">{feature.body}</p>
              <Image
                src={feature.icon.src}
                alt=""
                width={feature.icon.width}
                height={feature.icon.height}
                sizes="12vw"
                className="mt-auto h-[13rem] w-auto shrink-0 self-end"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
