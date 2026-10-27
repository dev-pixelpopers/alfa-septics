"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CheckIcon } from "@/components/contact/icons";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { CtaBand } from "@/components/ui/CtaBand";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, FEATURES, SERVICES, projectPhoto, servicePath } from "@/lib/site";

// Same four credentials as the homepage trust badges.
const CREDENTIALS = ["TCEQ OSSF Installer II", "Licensed & Insured", "Residential & Commercial", "Turnkey Solutions"];

/** /about: hero, who we are, what sets us apart, services and a closing CTA. */
export function AboutView() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-lede]", { y: "3rem" }, { y: 0, autoAlpha: 1 }, 0.45)
        .fromTo("[data-hero-photo]", { y: "10rem" }, { y: 0, autoAlpha: 1, duration: 1.2 }, 0.6);

      // Each group rises in, its items staggered, when it scrolls into view.
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll("[data-reveal]"),
          { y: "6rem" },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.12,
            ease: EASE_REVEAL,
            duration: reduce ? 0.01 : 1,
            scrollTrigger: { trigger: group, start: "top 75%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-[34rem] pt-[24rem] text-white">
        <div className="absolute inset-0 -z-10">
          <BrandBackground />
        </div>
        <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
          <p data-hero-lede className="invisible text-[2rem] uppercase tracking-[0.6rem] text-white/70">
            About Alfa Septic
          </p>
          <h1 className="mt-[2.4rem] font-display text-[14rem] uppercase leading-[0.88] tracking-[-0.8rem]">
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block">
                Built on experience
              </span>
            </span>
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block text-[#8fd8f0]">
                Driven by precision
              </span>
            </span>
          </h1>
          <p data-hero-lede className="invisible mt-[3.6rem] w-[76rem] text-[2.4rem] leading-[1.5] text-white/85">
            We combine licensed expertise, capable equipment, and clear communication to deliver septic and site
            utility projects without the runaround.
          </p>
        </div>
      </section>

      {/* Framed crew photo overlapping the hero; the white frame is baked into the image. */}
      <div className="relative z-10 -mt-[24rem] flex justify-center">
        <div data-hero-photo className="invisible relative h-[65.5rem] w-[142.5rem] shadow-[0_4rem_12rem_rgba(44,60,146,0.25)]">
          <Image
            src="/assets/images/video-poster.png"
            alt="Alfa Septic truck and excavator on a septic installation"
            fill
            sizes="75vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Who we are */}
      <section data-reveal-group className="bg-white py-[16rem]">
        <div className="mx-auto grid w-[164rem] grid-cols-[1fr_62rem] items-center gap-[12rem]">
          <div>
            <p data-reveal className="invisible text-[1.8rem] uppercase tracking-[0.4rem] text-brand-cyan">
              Who we are
            </p>
            <h2
              data-reveal
              className="invisible mt-[2rem] font-display text-[8rem] font-black uppercase leading-[0.92] tracking-[-0.3rem] text-brand-navy"
            >
              From bare land to fully connected
            </h2>
            <p data-reveal className="invisible mt-[4rem] text-[2.2rem] leading-[1.6] text-ink-muted">
              Alfa Septic is a licensed septic and site utility contractor serving homeowners, builders, and businesses
              across {CONTACT.region}. Septic systems, excavation, site preparation, and utility connections are all
              handled by one team.
            </p>
            <p data-reveal className="invisible mt-[2.4rem] text-[2.2rem] leading-[1.6] text-ink-muted">
              Because the same crew evaluates, plans, permits, and builds your system, you get one point of contact,
              straight answers, and a site that&apos;s ready for county inspection when we&apos;re done.
            </p>
            <ul data-reveal className="invisible mt-[4.8rem] grid grid-cols-2 gap-[2rem]">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="flex items-center gap-[1.6rem] text-[2rem] text-brand-navy">
                  <span className="grid size-[3.2rem] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy text-white">
                    <CheckIcon className="size-[1.8rem]" />
                  </span>
                  {credential}
                </li>
              ))}
            </ul>
          </div>

          {/* Photo card: navy square tilted behind a slightly tilted photo mask, as on the homepage */}
          <div data-reveal className="invisible relative p-[3rem]">
            <div aria-hidden className="absolute inset-[3rem] rotate-[4deg] bg-brand-navy" />
            <div className="relative aspect-[4/5] rotate-[2deg] overflow-hidden">
              <Image
                src={projectPhoto("crane-tank-crew")}
                alt="Crew guiding a concrete tank off a crane truck"
                fill
                sizes="35vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What sets us apart */}
      <section data-reveal-group className="bg-snow py-[16rem]">
        <div className="mx-auto w-[164rem]">
          <h2
            data-reveal
            className="invisible text-center font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy"
          >
            What sets us <span className="text-brand-cyan">apart</span>
          </h2>
          <ul className="mt-[8rem] grid grid-cols-4 gap-[2.8rem]">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                data-reveal
                className="invisible flex h-[46rem] flex-col rounded-[4rem] bg-[linear-gradient(to_bottom,#64c3b3cf_0%,#2f9fcf_40%)] p-[4rem] text-white shadow-[0_3rem_6rem_rgba(47,159,207,0.25)] transition-transform duration-500 hover:-translate-y-[1rem] hover:rotate-[-1.5deg]"
              >
                <h3 className="font-display text-[3.8rem] font-black capitalize leading-[1]">{feature.title}</h3>
                <p className="mt-[2rem] text-[2rem] leading-[1.5]">{feature.body}</p>
                <Image
                  src={feature.icon.src}
                  alt=""
                  width={feature.icon.width}
                  height={feature.icon.height}
                  sizes="10vw"
                  className="mt-auto h-[10rem] w-auto shrink-0 self-end"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section data-reveal-group className="bg-white py-[16rem]">
        <div className="mx-auto w-[164rem]">
          <div className="flex items-end justify-between">
            <h2
              data-reveal
              className="invisible font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy"
            >
              What we
              <br />
              <span className="text-brand-cyan">do</span>
            </h2>
            <p data-reveal className="invisible w-[52rem] text-[2rem] leading-[1.5] text-ink-muted">
              Septic work for homes, businesses, and new construction — from the first design to years of upkeep.
            </p>
          </div>
          <ul className="mt-[7.2rem] grid grid-cols-3 gap-[3.2rem]">
            {SERVICES.map((service) => (
              <li key={service.slug} data-reveal className="invisible">
                <Link
                  href={servicePath(service.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-[3.2rem] bg-snow shadow-[0_2rem_6rem_rgba(44,60,146,0.08)] transition-all duration-300 hover:-translate-y-[0.6rem] hover:shadow-[0_3rem_8rem_rgba(44,60,146,0.16)]"
                >
                  <div className="relative h-[32rem] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-[4rem]">
                    <h3 className="font-display text-[3.2rem] uppercase leading-[1.05] text-brand-navy">
                      {service.title}
                    </h3>
                    <p className="mt-[1.6rem] text-[1.9rem] leading-[1.5] text-ink-muted">{service.body}</p>
                    <span className="mt-auto flex items-center gap-[1.2rem] pt-[3.2rem] text-[1.9rem] text-brand-cyan">
                      Learn more
                      <ArrowIcon className="w-[2.2rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
                    </span>
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
