"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, projectPhoto } from "@/lib/site";
import { ContactForm } from "./ContactForm";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";
import { ProjectMarquee } from "./ProjectMarquee";

const QUICK_CONTACTS = [
  { icon: PhoneIcon, label: "Call us", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
  { icon: MailIcon, label: "Email us", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: PinIcon, label: "Service area", value: CONTACT.region, href: "/#services" },
];

const NEXT_STEPS = [
  { title: "We review your request", body: "Your details go straight to the Alfa Septics team." },
  { title: "We talk through your site", body: "A quick conversation about your property, soil, and goals." },
  { title: "You get a clear estimate", body: "A written plan and price before any work begins." },
];

/** Contact page hero, form and sidebar, with a time-based entrance like the homepage. */
export function ContactView({ initialService }: { initialService?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL, duration: reduce ? 0.01 : 1 } })
        .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1 }, 0.1)
        .fromTo("[data-hero-lede]", { y: "3rem" }, { y: 0, autoAlpha: 1 }, 0.45)
        .fromTo("[data-quick]", { y: "5rem" }, { y: 0, autoAlpha: 1, stagger: 0.1 }, 0.55)
        .fromTo("[data-panel]", { y: "10rem" }, { y: 0, autoAlpha: 1, stagger: 0.15, duration: 1.2 }, 0.7);

      gsap.fromTo(
        "[data-work]",
        { y: "6rem" },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          ease: EASE_REVEAL,
          duration: 1,
          scrollTrigger: { trigger: "[data-work-section]", start: "top 75%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pb-[22rem] pt-[24rem] text-white">
        <div className="absolute inset-0 -z-10">
          <BrandBackground />
        </div>
        <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
          <p data-hero-lede className="invisible text-[2rem] uppercase tracking-[0.6rem] text-white/70">
            Contact Alfa Septics
          </p>
          <h1 className="mt-[2.4rem] font-display text-[14rem] uppercase leading-[0.88] tracking-[-0.8rem]">
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block">
                Let&apos;s get your
              </span>
            </span>
            <span className="block overflow-hidden pb-[1rem]">
              <span data-hero-line className="invisible block text-[#8fd8f0]">
                site moving
              </span>
            </span>
          </h1>
          <p data-hero-lede className="invisible mt-[3.6rem] w-[76rem] text-[2.4rem] leading-[1.5] text-white/85">
            Septic installs, repairs, pumping, and maintenance across {CONTACT.region}. Tell us what you need and
            we&apos;ll put together a clear, no-obligation estimate.
          </p>

          <ul className="mt-[7.2rem] grid w-full grid-cols-3 gap-[2.4rem]">
            {QUICK_CONTACTS.map(({ icon: Icon, label, value, href }) => (
              <li key={label} data-quick className="invisible">
                <Link
                  href={href}
                  className="group flex items-center gap-[2.4rem] rounded-[3rem] border border-white/20 bg-white/10 p-[2.8rem] text-left backdrop-blur-[1.2rem] transition-all duration-300 hover:-translate-y-[0.6rem] hover:border-white/40 hover:bg-white/15"
                >
                  <span className="grid size-[7.2rem] shrink-0 place-items-center rounded-full bg-white text-brand-navy transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <Icon className="size-[3.2rem]" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[1.7rem] uppercase tracking-[0.3rem] text-white/60">{label}</span>
                    <span className="mt-[0.6rem] block text-[2.4rem]">{value}</span>
                  </span>
                  <ArrowIcon className="w-[2.6rem] opacity-60 transition-all duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem] group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="relative z-10 bg-snow pb-[12rem]">
        <div className="mx-auto -mt-[12rem] grid w-[164rem] grid-cols-[1fr_54rem] items-start gap-[4.8rem]">
          <div
            data-panel
            className="invisible rounded-[4rem] bg-white p-[6.4rem] shadow-[0_4rem_12rem_rgba(44,60,146,0.16)]"
          >
            <ContactForm initialService={initialService} />
          </div>

          <aside data-panel className="invisible sticky top-[4rem] flex flex-col gap-[3.2rem]">
            {/* Photo card echoing the homepage's tilted navy square */}
            <div className="relative px-[2rem] pt-[2rem]">
              <div aria-hidden className="absolute inset-x-[2rem] bottom-0 top-[2rem] rotate-[3deg] rounded-[3.2rem] bg-brand-navy" />
              <div className="relative h-[42rem] -rotate-[1.5deg] overflow-hidden rounded-[3.2rem] shadow-[0_2rem_5rem_rgba(0,0,0,0.2)]">
                <Image
                  src={projectPhoto("crane-tank-crew-2")}
                  alt="Alfa Septics crew unloading a concrete septic tank from a crane truck"
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-[3.2rem] pt-[10rem] text-white">
                  <p className="font-display text-[3.6rem] uppercase leading-none">Licensed &amp; insured</p>
                  <p className="mt-[1rem] text-[1.8rem] text-white/80">TCEQ OSSF Installer II</p>
                </div>
              </div>
            </div>

            <div className="rounded-[3.2rem] bg-white p-[4.4rem] shadow-[0_2rem_6rem_rgba(44,60,146,0.08)]">
              <h2 className="font-display text-[3.2rem] uppercase leading-none text-brand-navy">What happens next</h2>
              <ol className="relative mt-[3.6rem] flex flex-col gap-[3.2rem]">
                <span aria-hidden className="absolute bottom-[2rem] left-[1.9rem] top-[2rem] w-[0.2rem] bg-mist" />
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="relative flex gap-[2.4rem]">
                    <span className="grid size-[4rem] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy font-display text-[1.8rem] text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[2.2rem] text-brand-navy">{step.title}</h3>
                      <p className="mt-[0.6rem] text-[1.8rem] leading-[1.5] text-ink-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Recent work */}
      <section data-work-section className="bg-snow pb-[14rem]">
        <div className="mx-auto mb-[5.6rem] flex w-[164rem] items-end justify-between">
          <h2
            data-work
            className="invisible font-display text-[9rem] uppercase leading-[0.9] tracking-[-0.4rem] text-brand-navy"
          >
            Recent work across
            <br />
            <span className="text-brand-cyan">{CONTACT.region}</span>
          </h2>
          <p data-work className="invisible w-[46rem] text-[2rem] leading-[1.5] text-ink-muted">
            Every photo is from one of our own job sites — real tanks, real crews, real installs.
          </p>
        </div>
        <div data-work className="invisible">
          <ProjectMarquee />
        </div>
      </section>
    </div>
  );
}
