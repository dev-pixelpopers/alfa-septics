"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CheckIcon } from "@/components/contact/icons";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { CtaBand } from "@/components/ui/CtaBand";
import { EASE_REVEAL, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { SERVICES, projectPhoto, servicePath, sitePrepPhoto } from "@/lib/site";

// The site work that comes with a turnkey septic job.
const SITE_WORK = [
  {
    title: "Excavation",
    body: "Trenching, tank pits, and drain field cuts dug with our own equipment.",
    image: projectPhoto("field-trench-excavator"),
    alt: "Long drain field trench cut across a grassy property",
  },
  {
    title: "Site Preparation",
    body: "Clearing, grading, and pad work that gets raw land ready to build on.",
    image: sitePrepPhoto("cleared-wooded-lot"),
    alt: "Wooded lot cleared down to bare ground and ready to build",
  },
  {
    title: "Utility Connections",
    body: "Lines run and tied in so your system is fully connected to the building.",
    image: projectPhoto("drain-line-trench"),
    alt: "Drain line trench cut along a cleared site",
  },
];

const number = (i: number) => String(i + 1).padStart(2, "0");

/** /services: hero, sticky service index beside detail panels, site work and a closing CTA. */
export function ServicesView() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-lede]", { y: "3rem" }, { y: 0, autoAlpha: 1 }, 0.45)
        .fromTo("[data-index]", { x: "-6rem" }, { x: 0, autoAlpha: 1 }, 0.7);

      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel, i) => {
        // Index highlight follows whichever panel crosses the middle of the screen.
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && setActive(i),
        });
        gsap
          .timeline({
            defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1.1 },
            scrollTrigger: { trigger: panel, start: "top 80%" },
          })
          .fromTo(panel.querySelector("[data-panel-image]"), { y: "8rem", scale: 0.96 }, { y: 0, scale: 1, autoAlpha: 1 })
          .fromTo(panel.querySelectorAll("[data-panel-copy]"), { y: "4rem" }, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0.25);
      });

      gsap.fromTo(
        "[data-site-work]",
        { y: "6rem" },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          ease: EASE_REVEAL,
          duration: reduce ? 0.01 : 1,
          scrollTrigger: { trigger: "[data-site-work-section]", start: "top 75%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero — same cyan wash as the homepage services scene */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#3fcdf1_0%,#2b9fdc_55%,#2c3c92_100%)] pb-[18rem] pt-[24rem] text-white">
        <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
          <p data-hero-lede className="invisible text-[2rem] uppercase tracking-[0.6rem] text-white/80">
            Our Services
          </p>
          <h1 className="mt-[2.4rem] font-display text-[14rem] font-black uppercase leading-[0.88] tracking-[-0.8rem] [text-shadow:0_1rem_0_#2c3c92]">
            <span className="block overflow-hidden pb-[1.6rem]">
              <span data-hero-line className="invisible block">
                Complete site &amp;
              </span>
            </span>
            <span className="block overflow-hidden pb-[1.6rem]">
              <span data-hero-line className="invisible block">
                Septic solutions
              </span>
            </span>
          </h1>
          <p data-hero-lede className="invisible mt-[3.6rem] w-[80rem] text-[2.6rem] leading-[1.5] text-white/90">
            From new septic installations to commercial utility work, we handle the job from preparation to completion.
          </p>
        </div>
      </section>

      {/* Sticky index + service panels */}
      <section className="bg-snow py-[14rem]">
        <div className="mx-auto grid w-[164rem] grid-cols-[38rem_1fr] items-start gap-[10rem]">
          <nav data-index aria-label="Services" className="invisible sticky top-[22rem]">
            <p className="text-[1.6rem] uppercase tracking-[0.4rem] text-ink-soft">{SERVICES.length} services</p>
            <ol className="mt-[2.4rem] flex flex-col gap-[0.8rem]">
              {SERVICES.map((service, i) => (
                <li key={service.slug}>
                  <a
                    href={`#${service.slug}`}
                    aria-current={i === active ? "true" : undefined}
                    className={`group flex items-center gap-[2rem] rounded-[2rem] px-[2.4rem] py-[2rem] text-[2.2rem] leading-[1.2] transition-all duration-300 ${
                      i === active
                        ? "bg-brand-navy text-white shadow-[0_1.6rem_3.2rem_rgba(44,60,146,0.3)]"
                        : "text-brand-navy hover:bg-white"
                    }`}
                  >
                    <span
                      className={`font-display text-[1.6rem] tracking-[0.2rem] ${i === active ? "text-[#8fd8f0]" : "text-brand-cyan"}`}
                    >
                      {number(i)}
                    </span>
                    {service.title}
                  </a>
                </li>
              ))}
            </ol>
            <Link
              href="/contact"
              className="mt-[4rem] flex items-center justify-between rounded-[2rem] border-[0.2rem] border-brand-navy/15 px-[2.4rem] py-[2rem] text-[2rem] text-brand-navy transition-colors hover:border-brand-cyan"
            >
              Not sure what you need?
              <ArrowIcon className="w-[2.2rem]" />
            </Link>
          </nav>

          <div className="flex flex-col gap-[10rem]">
            {SERVICES.map((service, i) => (
              <article key={service.slug} id={service.slug} data-panel className="scroll-mt-[20rem]">
                <Link
                  data-panel-image
                  href={servicePath(service.slug)}
                  tabIndex={-1}
                  className="group invisible relative block h-[56rem] overflow-hidden rounded-[4rem] shadow-[0_3rem_8rem_rgba(44,60,146,0.18)]"
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-[3.2rem] top-[3.2rem] rounded-full bg-white/90 px-[2.4rem] py-[1.2rem] font-display text-[2rem] tracking-[0.2rem] text-brand-navy backdrop-blur-[0.8rem]">
                    {number(i)}
                  </span>
                </Link>
                <div className="mt-[5.6rem] grid grid-cols-[1fr_46rem] gap-[6rem]">
                  <div>
                    <h2
                      data-panel-copy
                      className="invisible font-display text-[6.4rem] font-black uppercase leading-[0.95] tracking-[-0.2rem] text-brand-navy"
                    >
                      <Link
                        href={servicePath(service.slug)}
                        className="decoration-brand-cyan decoration-[0.4rem] underline-offset-[0.8rem] transition-colors hover:text-brand-cyan"
                      >
                        {service.title}
                      </Link>
                    </h2>
                    <p data-panel-copy className="invisible mt-[2.4rem] text-[2.4rem] leading-[1.5] text-ink-muted">
                      {service.body}
                    </p>
                    <div data-panel-copy className="invisible mt-[4rem] flex items-center gap-[1.6rem]">
                      <Link
                        href={servicePath(service.slug)}
                        className="group inline-flex h-[6.4rem] items-center gap-[1.6rem] rounded-full bg-gradient-to-r from-brand-cyan to-brand-navy px-[3.6rem] text-[2.2rem] text-white shadow-[0_1.6rem_3.2rem_rgba(44,60,146,0.3)] transition-all duration-300 hover:-translate-y-[0.3rem]"
                      >
                        Learn more
                        <ArrowIcon className="w-[2.4rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
                      </Link>
                      <Link
                        href={`/contact?service=${service.slug}`}
                        className="inline-flex h-[6.4rem] items-center rounded-full border-[0.2rem] border-brand-navy/15 px-[3.2rem] text-[2.2rem] text-brand-navy transition-colors hover:border-brand-cyan"
                      >
                        Free estimate
                      </Link>
                    </div>
                  </div>
                  <div data-panel-copy className="invisible rounded-[3.2rem] bg-white p-[4rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)]">
                    <h3 className="text-[1.6rem] uppercase tracking-[0.4rem] text-brand-cyan">What&apos;s included</h3>
                    <ul className="mt-[2.4rem] flex flex-col gap-[2rem]">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-[1.6rem] text-[2rem] leading-[1.45] text-brand-navy">
                          <span className="mt-[0.2rem] grid size-[3rem] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy text-white">
                            <CheckIcon className="size-[1.6rem]" />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Site work */}
      <section data-site-work-section className="bg-white py-[14rem]">
        <div className="mx-auto w-[164rem]">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy">
              Beyond
              <br />
              <span className="text-brand-cyan">the tank</span>
            </h2>
            <p className="w-[56rem] text-[2rem] leading-[1.5] text-ink-muted">
              One contractor for septic systems, excavation, site preparation, and utility connections — so your
              project never stalls waiting on another crew.
            </p>
          </div>
          <ul className="mt-[7.2rem] grid grid-cols-3 gap-[3.2rem]">
            {SITE_WORK.map((item) => (
              <li
                key={item.title}
                data-site-work
                className="group invisible relative h-[52rem] overflow-hidden rounded-[3.2rem] text-white shadow-[0_2rem_6rem_rgba(44,60,146,0.12)]"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-[4rem] pt-[16rem]">
                  <h3 className="font-display text-[4rem] uppercase leading-none">{item.title}</h3>
                  <p className="mt-[1.6rem] text-[1.9rem] leading-[1.5] text-white/85">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
