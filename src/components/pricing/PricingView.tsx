"use client";

import Link from "next/link";
import { useRef } from "react";
import { CheckIcon, PhoneIcon } from "@/components/contact/icons";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { CtaBand } from "@/components/ui/CtaBand";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, servicePath } from "@/lib/site";

const PLAN = {
  name: "Maintenance Contract",
  price: 47,
  period: "mo",
  summary: "Year-round care for your aerobic septic system, handled by a licensed local team.",
  features: ["1-Yr Maintenance Contract", "Septic Pumping From $650+"],
};

const INCLUDED = [
  { title: "TCEQ Licensed Technicians", body: "Every visit is handled by trained, licensed septic professionals." },
  { title: "Scheduled Inspections", body: "Routine checks on a set schedule, so nothing slips through the cracks." },
  { title: "Compliance Support", body: "Upkeep that keeps your system in line with Texas OSSF requirements." },
  { title: "Great Customer Service", body: "Straight answers and a real person on the phone when you call." },
];

const FAQS = [
  {
    q: "What does the maintenance contract cover?",
    a: "A one-year contract with scheduled inspections and routine upkeep of your system. Repairs and pumping aren't part of the monthly price, and we always quote them before doing the work.",
  },
  {
    q: "How much does septic pumping cost?",
    a: "Pumping starts at $650. The final price depends on your tank size, how deep it is, and how easy it is to reach.",
  },
  {
    q: "What kinds of systems do you maintain?",
    a: "We maintain aerobic and conventional septic systems for homes and businesses. If you're not sure what you have, we'll help you find out.",
  },
  {
    q: "How do I sign up?",
    a: "Request a contract through our contact form or give us a call. We'll confirm your system details and send the agreement for you to sign.",
  },
];

/** /pricing: hero, the maintenance contract card, what's included, FAQs and a closing CTA. */
export function PricingView() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-lede]", { y: "3rem" }, { y: 0, autoAlpha: 1 }, 0.45)
        .fromTo("[data-plan]", { y: "10rem" }, { y: 0, autoAlpha: 1, duration: 1.2 }, 0.6);

      // Each group rises in, its items staggered, when it scrolls into view.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll("[data-reveal]"),
          { y: "6rem" },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            ease: EASE_REVEAL,
            duration: reduce ? 0.01 : 1,
            scrollTrigger: { trigger: group, start: "top 78%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-[30rem] pt-[24rem] text-white">
        <div className="absolute inset-0 -z-10">
          <BrandBackground />
        </div>
        <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
          <p data-hero-lede className="invisible text-[2rem] uppercase tracking-[0.6rem] text-white/70">
            Contract Pricing
          </p>
          <h1 className="mt-[2.4rem] font-display text-[14rem] uppercase leading-[0.88] tracking-[-0.8rem]">
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block">
                Simple, honest
              </span>
            </span>
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block text-[#8fd8f0]">
                pricing
              </span>
            </span>
          </h1>
          <p data-hero-lede className="invisible mt-[3.6rem] w-[76rem] text-[2.4rem] leading-[1.5] text-white/85">
            One straightforward maintenance plan that keeps your septic system inspected, compliant, and running
            clean, with no surprises on your bill.
          </p>
        </div>
      </section>

      {/* Plan card overlapping the hero */}
      <section className="relative z-10 bg-snow pb-[14rem]">
        <div className="mx-auto -mt-[20rem] w-[120rem]">
          <div
            data-plan
            className="invisible grid grid-cols-[1fr_48rem] overflow-hidden rounded-[4rem] bg-white shadow-[0_4rem_12rem_rgba(44,60,146,0.18)]"
          >
            <div className="p-[6.4rem]">
              <span className="inline-block rounded-full bg-mist px-[2rem] py-[0.8rem] text-[1.6rem] uppercase tracking-[0.3rem] text-brand-navy">
                Most popular
              </span>
              <h2 className="mt-[2.8rem] font-display text-[5.6rem] uppercase leading-[0.95] tracking-[-0.2rem] text-brand-navy">
                {PLAN.name}
              </h2>
              <p className="mt-[2rem] w-[52rem] text-[2.2rem] leading-[1.5] text-ink-muted">{PLAN.summary}</p>
              <p className="mt-[4rem] flex items-end gap-[1rem] text-brand-navy">
                <span className="font-display text-[12rem] font-black leading-[0.8] tracking-[-0.4rem]">
                  ${PLAN.price}
                </span>
                <span className="pb-[0.6rem] text-[2.6rem] text-ink-muted">/{PLAN.period}</span>
              </p>
              <div className="mt-[5.6rem] flex items-center gap-[3.2rem]">
                <Link
                  href="/contact?service=maintenance"
                  className="group inline-flex h-[7.2rem] items-center gap-[2rem] rounded-full bg-gradient-to-r from-brand-cyan to-brand-navy px-[4.4rem] text-[2.4rem] text-white shadow-[0_1.6rem_3.2rem_rgba(44,60,146,0.35)] transition-all duration-300 hover:-translate-y-[0.3rem]"
                >
                  Get started
                  <ArrowIcon className="w-[2.6rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
                </Link>
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex items-center gap-[1.2rem] text-[2rem] text-brand-navy underline decoration-brand-cyan underline-offset-[0.4rem]"
                >
                  <PhoneIcon className="size-[2.4rem]" />
                  {CONTACT.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="relative isolate flex flex-col justify-center p-[6.4rem] text-white">
              <div className="absolute inset-0 -z-10">
                <BrandBackground watermark={false} />
              </div>
              <h3 className="text-[1.6rem] uppercase tracking-[0.4rem] text-[#8fd8f0]">Plan includes</h3>
              <ul className="mt-[3.2rem] flex flex-col gap-[2.8rem]">
                {PLAN.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-[2rem] text-[2.6rem] leading-[1.3]">
                    <span className="grid size-[4rem] shrink-0 place-items-center rounded-full bg-white text-brand-navy">
                      <CheckIcon className="size-[2.2rem]" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={servicePath("maintenance")}
                className="mt-[4.8rem] text-[1.9rem] text-white/80 underline decoration-white/40 underline-offset-[0.5rem] transition-colors hover:text-white"
              >
                More about maintenance contracts
              </Link>
            </div>
          </div>
          <p className="mt-[3.2rem] text-center text-[1.7rem] leading-[1.5] text-ink-soft">
            Prices shown are starting rates and may change. The terms in your signed contract apply.
          </p>
        </div>
      </section>

      {/* Included */}
      <section data-reveal-group className="bg-white py-[14rem]">
        <div className="mx-auto w-[164rem]">
          <h2
            data-reveal
            className="invisible text-center font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy"
          >
            Every contract <span className="text-brand-cyan">includes</span>
          </h2>
          <ul className="mt-[7.2rem] grid grid-cols-4 gap-[2.8rem]">
            {INCLUDED.map((item) => (
              <li
                key={item.title}
                data-reveal
                className="invisible rounded-[3.2rem] bg-snow p-[4rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)]"
              >
                <span className="grid size-[5.2rem] place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy text-white">
                  <CheckIcon className="size-[2.6rem]" />
                </span>
                <h3 className="mt-[2.8rem] font-display text-[2.8rem] uppercase leading-[1.05] text-brand-navy">
                  {item.title}
                </h3>
                <p className="mt-[1.6rem] text-[1.9rem] leading-[1.5] text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section data-reveal-group className="bg-snow py-[14rem]">
        <div className="mx-auto grid w-[164rem] grid-cols-[56rem_1fr] items-start gap-[10rem]">
          <div data-reveal className="invisible sticky top-[22rem]">
            <h2 className="font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy">
              Contract
              <br />
              <span className="text-brand-cyan">FAQs</span>
            </h2>
            <p className="mt-[3.2rem] text-[2rem] leading-[1.5] text-ink-muted">
              Have a question that isn&apos;t answered here? Call us at{" "}
              <a href={CONTACT.phoneHref} className="text-brand-navy underline decoration-brand-cyan underline-offset-[0.4rem]">
                {CONTACT.phoneDisplay}
              </a>{" "}
              or check our{" "}
              <Link href="/service-areas" className="text-brand-navy underline decoration-brand-cyan underline-offset-[0.4rem]">
                service areas
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col gap-[1.6rem]">
            {FAQS.map((faq, i) => (
              <details
                key={faq.q}
                data-reveal
                open={i === 0}
                className="group invisible rounded-[2.8rem] bg-white shadow-[0_2rem_6rem_rgba(44,60,146,0.06)] open:shadow-[0_2rem_6rem_rgba(44,60,146,0.14)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-[3rem] p-[3.6rem] text-[2.4rem] text-brand-navy [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden
                    className="grid size-[4.4rem] shrink-0 place-items-center rounded-full bg-mist text-[2.8rem] leading-none text-brand-navy transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="-mt-[1rem] px-[3.6rem] pb-[3.6rem] text-[2rem] leading-[1.6] text-ink-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
