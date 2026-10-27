"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CheckIcon, PhoneIcon } from "@/components/contact/icons";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { CtaBand } from "@/components/ui/CtaBand";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, PROCESS_STEPS, SERVICES, servicePath } from "@/lib/site";

const number = (i: number) => String(i + 1).padStart(2, "0");

/** /services/[slug]: one service in depth, then the process and the other services. */
export function ServiceDetailView({ slug }: { slug: string }) {
  const root = useRef<HTMLDivElement>(null);
  const index = SERVICES.findIndex((s) => s.slug === slug);
  const service = SERVICES[index];
  const others = SERVICES.filter((s) => s.slug !== slug);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-copy]", { y: "4rem" }, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0.1)
        .fromTo("[data-hero-photo]", { x: "10rem", rotate: 6 }, { x: 0, rotate: 0, autoAlpha: 1, duration: 1.2 }, 0.3);

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
      <section className="relative isolate overflow-hidden pb-[14rem] pt-[24rem] text-white">
        <div className="absolute inset-0 -z-10">
          <BrandBackground />
        </div>
        <div className="mx-auto grid w-[164rem] grid-cols-[1fr_66rem] items-center gap-[10rem]">
          <div>
            <nav data-hero-copy aria-label="Breadcrumb" className="invisible text-[1.8rem] text-white/60">
              <ol className="flex items-center gap-[1.2rem]">
                <li>
                  <Link href="/services" className="transition-colors hover:text-white">
                    Services
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-white">
                  {service.title}
                </li>
              </ol>
            </nav>
            <p data-hero-copy className="invisible mt-[4rem] text-[2rem] uppercase tracking-[0.6rem] text-[#8fd8f0]">
              Service {number(index)}
            </p>
            <h1
              data-hero-copy
              className="invisible mt-[2rem] font-display text-[11rem] font-black uppercase leading-[0.9] tracking-[-0.5rem]"
            >
              {service.title}
            </h1>
            <p data-hero-copy className="invisible mt-[3.6rem] w-[72rem] text-[2.6rem] leading-[1.5] text-white/85">
              {service.body}
            </p>
            {"price" in service && (
              <div data-hero-copy className="invisible mt-[4rem]">
                <p className="text-[1.7rem] uppercase tracking-[0.4rem] text-[#8fd8f0]">Starting from</p>
                <p className="mt-[1.4rem] flex items-end gap-[1rem]">
                  <span className="font-display text-[9.6rem] font-black leading-[0.8] tracking-[-0.3rem]">
                    ${service.price.amount}+
                  </span>
                  <span className="pb-[0.4rem] text-[2.4rem] text-white/70">/{service.price.unit}</span>
                </p>
              </div>
            )}
            <div data-hero-copy className="invisible mt-[5.6rem] flex items-center gap-[3.2rem]">
              <Link
                href={`/contact?service=${service.slug}`}
                className="group inline-flex h-[6.9rem] items-center gap-[2rem] rounded-full border border-white bg-gradient-to-b from-[rgba(32,100,172,0.9)] to-[rgba(49,162,202,0.9)] px-[4rem] text-[2.4rem] transition-[filter] hover:brightness-110"
              >
                Get a free estimate
                <ArrowIcon className="w-[2.4rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
              </Link>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-[1.4rem] text-[2.2rem] text-white/85 transition-colors hover:text-white"
              >
                <PhoneIcon className="size-[2.6rem]" />
                {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Photo card: navy square tilted behind a slightly tilted photo mask, as on the homepage */}
          <div data-hero-photo className="invisible relative p-[3rem]">
            <div aria-hidden className="absolute inset-[3rem] rotate-[4deg] rounded-[4rem] bg-brand-navy" />
            <div className="relative aspect-square rotate-[2deg] overflow-hidden rounded-[4rem] shadow-[0_3rem_8rem_rgba(0,0,0,0.3)]">
              <Image src={service.image} alt={service.alt} fill preload sizes="40vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section data-reveal-group className="bg-white py-[14rem]">
        <div className="mx-auto grid w-[164rem] grid-cols-[1fr_56rem] items-start gap-[10rem]">
          <div>
            <p data-reveal className="invisible text-[1.8rem] uppercase tracking-[0.4rem] text-brand-cyan">
              Overview
            </p>
            <h2
              data-reveal
              className="invisible mt-[2rem] font-display text-[7.2rem] font-black uppercase leading-[0.95] tracking-[-0.3rem] text-brand-navy"
            >
              Done right, start to finish
            </h2>
            <p data-reveal className="invisible mt-[4rem] text-[2.4rem] leading-[1.6] text-ink-muted">
              {service.intro}
            </p>
          </div>
          <div
            data-reveal
            className="invisible rounded-[3.2rem] bg-snow p-[4.8rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)]"
          >
            <h3 className="text-[1.6rem] uppercase tracking-[0.4rem] text-brand-cyan">What&apos;s included</h3>
            <ul className="mt-[3.2rem] flex flex-col gap-[2.4rem]">
              {service.points.map((point) => (
                <li key={point} className="flex items-start gap-[1.6rem] text-[2.1rem] leading-[1.45] text-brand-navy">
                  <span className="mt-[0.2rem] grid size-[3.2rem] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy text-white">
                    <CheckIcon className="size-[1.8rem]" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* When to call */}
      <section data-reveal-group className="bg-snow py-[14rem]">
        <div className="mx-auto w-[164rem]">
          <h2
            data-reveal
            className="invisible text-center font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy"
          >
            When to <span className="text-brand-cyan">call us</span>
          </h2>
          <ul className="mt-[7.2rem] grid grid-cols-4 gap-[2.8rem]">
            {service.signs.map((sign, i) => (
              <li
                key={sign}
                data-reveal
                className="invisible flex h-[30rem] flex-col justify-between rounded-[3.2rem] bg-white p-[4rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)] transition-transform duration-500 hover:-translate-y-[0.8rem]"
              >
                <span className="font-display text-[6rem] font-black leading-none text-transparent [-webkit-text-stroke:0.15rem_var(--color-brand-cyan)]">
                  {number(i)}
                </span>
                <p className="text-[2.2rem] leading-[1.4] text-brand-navy">{sign}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section data-reveal-group className="bg-white py-[14rem]">
        <div className="mx-auto w-[164rem]">
          <div className="flex items-end justify-between">
            <h2
              data-reveal
              className="invisible font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy"
            >
              How it
              <br />
              <span className="text-brand-cyan">works</span>
            </h2>
            <Link
              data-reveal
              href="/process"
              className="invisible group flex items-center gap-[1.4rem] text-[2.2rem] text-brand-navy underline decoration-brand-cyan underline-offset-[0.6rem]"
            >
              See our full process
              <ArrowIcon className="w-[2.2rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
            </Link>
          </div>
          <ol className="relative mt-[8rem] grid grid-cols-5 gap-[2.4rem]">
            <span aria-hidden className="absolute inset-x-[4rem] top-[2.3rem] h-[0.2rem] bg-mist" />
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.slug} data-reveal className="invisible relative">
                <span className="relative grid size-[4.6rem] place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy font-display text-[1.6rem] text-white">
                  {i + 1}
                </span>
                <h3 className="mt-[2.8rem] font-display text-[2.8rem] font-black leading-[1.1] text-brand-navy">
                  {step.title}
                </h3>
                <p className="mt-[1.4rem] text-[1.8rem] leading-[1.5] text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Other services */}
      <section data-reveal-group className="bg-snow py-[14rem]">
        <div className="mx-auto w-[164rem]">
          <h2
            data-reveal
            className="invisible font-display text-[7.2rem] uppercase leading-[0.9] tracking-[-0.3rem] text-brand-navy"
          >
            Other <span className="text-brand-cyan">services</span>
          </h2>
          <ul className="mt-[5.6rem] grid grid-cols-4 gap-[2.4rem]">
            {others.map((other) => (
              <li key={other.slug} data-reveal className="invisible">
                <Link
                  href={servicePath(other.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-[3.2rem] bg-white shadow-[0_2rem_6rem_rgba(44,60,146,0.08)] transition-all duration-300 hover:-translate-y-[0.6rem] hover:shadow-[0_3rem_8rem_rgba(44,60,146,0.16)]"
                >
                  <div className="relative h-[24rem] overflow-hidden">
                    <Image
                      src={other.image}
                      alt={other.alt}
                      fill
                      sizes="22vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-[2rem] p-[3.2rem]">
                    <h3 className="font-display text-[2.6rem] uppercase leading-[1.05] text-brand-navy">{other.title}</h3>
                    <ArrowIcon className="w-[2.4rem] shrink-0 text-brand-cyan transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
