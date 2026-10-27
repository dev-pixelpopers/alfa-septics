"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { PhoneIcon, PinIcon } from "@/components/contact/icons";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { CtaBand } from "@/components/ui/CtaBand";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, SERVICES, SERVICE_AREAS, servicePath } from "@/lib/site";

const TOWN_COUNT = SERVICE_AREAS.reduce((sum, area) => sum + area.towns.length, 0);

const normalize = (value: string) => value.trim().toLowerCase();

/** /service-areas: hero, searchable county cards, services offered and a closing CTA. */
export function ServiceAreasView() {
  const root = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const needle = normalize(query);

  const matches = (text: string) => needle !== "" && normalize(text).includes(needle);
  const visible = SERVICE_AREAS.filter(
    (area) => !needle || matches(`${area.county} County`) || area.towns.some(matches),
  );

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-lede]", { y: "3rem" }, { y: 0, autoAlpha: 1 }, 0.45)
        .fromTo("[data-hero-stat]", { y: "4rem" }, { y: 0, autoAlpha: 1, stagger: 0.1 }, 0.55);

      // Cards stay mounted while filtering (hidden, not removed) so these reveals hold.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll("[data-reveal]"),
          { y: "6rem" },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.06,
            ease: EASE_REVEAL,
            duration: reduce ? 0.01 : 1,
            scrollTrigger: { trigger: group, start: "top 80%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-[16rem] pt-[24rem] text-white">
        <div className="absolute inset-0 -z-10">
          <BrandBackground />
        </div>
        <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
          <p data-hero-lede className="invisible text-[2rem] uppercase tracking-[0.6rem] text-white/70">
            Service Areas
          </p>
          <h1 className="mt-[2.4rem] font-display text-[14rem] uppercase leading-[0.88] tracking-[-0.8rem]">
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block">
                Proudly serving
              </span>
            </span>
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block text-[#8fd8f0]">
                {CONTACT.region}
              </span>
            </span>
          </h1>
          <p data-hero-lede className="invisible mt-[3.6rem] w-[76rem] text-[2.4rem] leading-[1.5] text-white/85">
            Our crews and equipment cover homes, businesses, and new construction across the region. Find your county
            below, or call and we&apos;ll confirm we can reach your site.
          </p>
          <dl className="mt-[6.4rem] flex gap-[2.4rem]">
            {[
              { value: SERVICE_AREAS.length, label: "Counties" },
              { value: `${TOWN_COUNT}+`, label: "Communities" },
              { value: SERVICES.length, label: "Core services" },
            ].map((stat) => (
              <div
                key={stat.label}
                data-hero-stat
                className="invisible w-[24rem] rounded-[3rem] border border-white/20 bg-white/10 px-[3.2rem] py-[2.8rem] backdrop-blur-[1.2rem]"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-[6rem] leading-none">{stat.value}</dd>
                <dd className="mt-[1rem] text-[1.7rem] uppercase tracking-[0.3rem] text-white/60">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Areas */}
      <section className="relative z-10 bg-snow py-[14rem]">
        <div className="mx-auto w-[164rem]">
          {/* Search panel */}
          <div className="flex items-center gap-[4rem] rounded-[4rem] bg-white p-[4.8rem] shadow-[0_4rem_12rem_rgba(44,60,146,0.16)]">
            <div className="flex-1">
              <label htmlFor="area-search" className="font-display text-[4rem] uppercase leading-none text-brand-navy">
                Check your area
              </label>
              <div className="relative mt-[2.4rem]">
                <PinIcon className="pointer-events-none absolute left-[2.4rem] top-1/2 size-[2.8rem] -translate-y-1/2 text-brand-cyan" />
                <input
                  id="area-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type your town or county"
                  autoComplete="address-level2"
                  className="h-[7.2rem] w-full rounded-full border-[0.2rem] border-transparent bg-snow pl-[6.8rem] pr-[3rem] text-[2.2rem] text-brand-navy outline-none transition-all duration-300 placeholder:text-ink-soft hover:border-brand-navy/10 focus:border-brand-cyan focus:bg-white focus:shadow-[0_0_0_0.5rem_rgba(49,162,202,0.15)]"
                />
              </div>
            </div>
            <p aria-live="polite" className="w-[44rem] text-[2rem] leading-[1.5] text-ink-muted">
              {!needle
                ? `We serve ${SERVICE_AREAS.length} counties across ${CONTACT.region}.`
                : visible.length > 0
                  ? `Good news — we work in ${visible.map((a) => `${a.county} County`).join(", ")}.`
                  : "We don't list that area yet, but we may still reach you. Give us a call to check."}
            </p>
          </div>

          <ul data-reveal-group className="mt-[6.4rem] grid grid-cols-3 gap-[2.8rem]">
            {SERVICE_AREAS.map((area) => {
              const shown = visible.includes(area);
              return (
                <li
                  key={area.county}
                  data-reveal
                  className={`invisible rounded-[3.2rem] bg-white p-[4rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)] transition-shadow duration-300 hover:shadow-[0_3rem_8rem_rgba(44,60,146,0.16)] ${
                    shown ? "" : "hidden"
                  }`}
                >
                  <div className="flex items-center gap-[1.6rem]">
                    <span className="grid size-[5.2rem] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy text-white">
                      <PinIcon className="size-[2.6rem]" />
                    </span>
                    <h2 className="font-display text-[3.2rem] uppercase leading-none text-brand-navy">
                      {area.county} County
                    </h2>
                  </div>
                  <ul className="mt-[2.8rem] flex flex-wrap gap-[1rem]">
                    {area.towns.map((town) => (
                      <li
                        key={town}
                        className={`rounded-full px-[2rem] py-[1rem] text-[1.8rem] leading-none transition-colors ${
                          matches(town) ? "bg-brand-cyan text-white" : "bg-mist text-brand-navy"
                        }`}
                      >
                        {town}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          {needle && visible.length === 0 && (
            <div className="mt-[6.4rem] flex flex-col items-center rounded-[3.2rem] bg-white p-[6.4rem] text-center shadow-[0_2rem_6rem_rgba(44,60,146,0.08)]">
              <p className="font-display text-[4rem] uppercase leading-none text-brand-navy">
                Not on the list?
              </p>
              <p className="mt-[2rem] w-[60rem] text-[2rem] leading-[1.5] text-ink-muted">
                We regularly travel for the right project. Call us and we&apos;ll let you know if we can reach &ldquo;
                {query.trim()}&rdquo;.
              </p>
              <a
                href={CONTACT.phoneHref}
                className="mt-[3.6rem] inline-flex items-center gap-[1.6rem] rounded-full bg-brand-navy px-[4rem] py-[2rem] text-[2.2rem] text-white transition-transform hover:-translate-y-[0.3rem]"
              >
                <PhoneIcon className="size-[2.4rem]" />
                {CONTACT.phoneDisplay}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Services available everywhere */}
      <section data-reveal-group className="bg-white py-[14rem]">
        <div className="mx-auto flex w-[164rem] items-center justify-between gap-[8rem]">
          <h2
            data-reveal
            className="invisible font-display text-[8rem] uppercase leading-[0.9] tracking-[-0.3rem] text-brand-navy"
          >
            Every service,
            <br />
            <span className="text-brand-cyan">every area</span>
          </h2>
          <ul data-reveal className="invisible flex w-[84rem] flex-wrap justify-end gap-[1.4rem]">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={servicePath(service.slug)}
                  className="block rounded-full border-[0.2rem] border-brand-navy/15 px-[2.8rem] py-[1.6rem] text-[2rem] leading-none text-brand-navy transition-all duration-300 hover:-translate-y-[0.2rem] hover:border-brand-cyan hover:text-brand-cyan"
                >
                  {service.title}
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
