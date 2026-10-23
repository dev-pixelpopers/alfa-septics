"use client";

import Image from "next/image";
import { useRef } from "react";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { PillLink } from "@/components/ui/PillLink";
import { StickyBackdrop } from "@/components/ui/StickyBackdrop";
import { EASE_REVEAL, FIGMA_EASE_OUT, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Services Areas", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "/contact" },
];

// One sprite (trust-badges.png) cropped into the four badges, crops from Figma 203:600–603.
const BADGES = [
  { label: "TCEQ OSSF Installer II", width: "14.4rem", imgWidth: "402.78%", left: "0%" },
  { label: "Licensed & Insured", width: "14.7rem", imgWidth: "394.56%", left: "-97.96%" },
  { label: "Residential & Commercial", width: "14.2rem", imgWidth: "408.45%", left: "-204.93%" },
  { label: "Turnkey Solutions", width: "14.7rem", imgWidth: "394.56%", left: "-294.56%" },
];

/**
 * Preloader (Default → Variant9) and hero (Variant9 → Variant20).
 * Preloader, hero entrance and the "From Bare Land" reveal are all time-based.
 */
export function HeroScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const [preloader] = q("[data-preloader]");
      const [gateLeft] = q("[data-gate='left']");
      const [gateRight] = q("[data-gate='right']");
      const [preUi] = q("[data-pre-ui]");
      const [preLogo] = q("[data-pre-logo]");
      const [preBar] = q("[data-pre-bar]");
      const [preCount] = q("[data-pre-count]");
      const [heroLogo] = q("[data-hero-logo]");
      const [bareBlock] = q("[data-bare-block]");
      const [bareHeading] = q("[data-bare-heading]");
      const [bareDesc] = q("[data-bare-desc]");
      const badges = q("[data-badge]");
      const html = document.documentElement;

      // --- Initial states (elements also carry `invisible` to avoid FOUC) ---
      gsap.set(gateLeft, { clipPath: "inset(0% 50% 0% 0%)" });
      gsap.set(gateRight, { clipPath: "inset(0% 0% 0% 50%)" });
      gsap.set(q("[data-nav]"), { x: "22rem", autoAlpha: 0 });
      gsap.set(q("[data-nav-line]"), { scaleX: 0, transformOrigin: "right center" });
      gsap.set(q("[data-line-a]"), { x: "-29rem", autoAlpha: 0 });
      gsap.set(q("[data-line-b]"), { x: "29rem", autoAlpha: 0 });
      gsap.set(q("[data-hero-support]"), { autoAlpha: 0 });
      gsap.set(bareHeading, { clipPath: "inset(0% 0% 100% 0%)", y: "4rem" });
      gsap.set(bareDesc, { x: "10rem", autoAlpha: 0 });
      gsap.set(badges, { y: "37rem", autoAlpha: 0, scale: 0.9 });

      // --- 3. Hero entrance (Variant9 → Variant12), played after the preloader exits ---
      const heroTl = gsap.timeline({
        paused: true,
        defaults: { ease: FIGMA_EASE_OUT },
        onComplete: () => {
          html.style.overflow = "";
          ScrollTrigger.refresh();
        },
      });
      heroTl
        .to(q("[data-line-a], [data-line-b]"), { x: 0, autoAlpha: 1, duration: 1, ease: EASE_REVEAL, stagger: 0.08 })
        .to(q("[data-nav]"), { x: 0, autoAlpha: 1, duration: 0.9, ease: EASE_REVEAL }, "<0.1")
        .to(q("[data-nav-line]"), { scaleX: 1, duration: 0.8, ease: EASE_REVEAL }, "-=0.5")
        .fromTo(
          q("[data-hero-support]"),
          { y: "3rem" },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE_REVEAL },
          "<",
        );

      // --- 2. Preloader exit: loading UI drops, logo docks into the header,
      //        the blue background splits open like a gate to reveal the hero ---
      const exitPreloader = () => {
        const from = preLogo.getBoundingClientRect();
        const to = heroLogo.getBoundingClientRect();

        gsap
          .timeline({
            defaults: { ease: FIGMA_EASE_OUT },
            onComplete: () => {
              gsap.set(heroLogo, { autoAlpha: 1 });
              gsap.set(preloader, { autoAlpha: 0 });
              heroTl.play();
            },
          })
          .to(preUi, { y: "15rem", autoAlpha: 0, duration: 0.3 })
          .to(
            preLogo,
            {
              x: to.left - from.left,
              y: to.top - from.top,
              scale: to.width / from.width,
              transformOrigin: "top left",
              duration: 1.2,
            },
            "<0.1",
          )
          .to(gateLeft, { clipPath: "inset(0% 100% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, "<0.35")
          .to(gateRight, { clipPath: "inset(0% 0% 0% 100%)", duration: 1.4, ease: "power4.inOut" }, "<");
      };

      // --- 1. Preloader: bar + counter follow real loading (fonts + non-lazy images) ---
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      html.style.overflow = "hidden";

      const progress = { value: 0 };
      const render = () => {
        (preBar as HTMLElement).style.width = `${progress.value}%`;
        preCount.textContent = String(Math.round(progress.value));
      };
      const imageLoaded = (img: HTMLImageElement) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
      const tasks: Promise<unknown>[] = [
        document.fonts.ready,
        ...Array.from(document.images)
          .filter((img) => img.loading !== "lazy")
          .map(imageLoaded),
      ];

      let loaded = 0;
      let exited = false;
      // Never hold the page hostage on one slow asset.
      const safetyNet = gsap.delayedCall(10, () => advanceTo(100));
      const finish = contextSafe!(() => {
        if (exited) return;
        exited = true;
        safetyNet.kill();
        gsap.delayedCall(0.25, exitPreloader);
      });
      const advanceTo = contextSafe!((target: number) => {
        gsap.to(progress, {
          value: target,
          duration: 0.6,
          ease: FIGMA_EASE_OUT,
          overwrite: true,
          onUpdate: render,
          onComplete: target >= 100 ? finish : undefined,
        });
      });
      tasks.forEach((task) => task.then(() => advanceTo((++loaded / tasks.length) * 100)));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) heroTl.timeScale(3);

      // --- 4. "From Bare Land" (Variant15 → Variant20) ---
      // Plays on its own (not scrubbed) every time the block comes into view, from either direction.
      const bareReveal = gsap
        .timeline({ paused: true })
        // V15 → V16: heading wipes in top-down, description slides in from the right.
        .to(bareHeading, { clipPath: "inset(0% 0% 0% 0%)", y: 0, ease: EASE_REVEAL, duration: 1.2 }, 0)
        .to(bareDesc, { x: 0, autoAlpha: 1, ease: EASE_REVEAL, duration: 1 }, 0.3)
        // V16 → V20: badges rise one after another, overlapping slightly.
        .to(badges, { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.3)", duration: 1, stagger: 0.18 }, 0.7);

      ScrollTrigger.create({
        trigger: bareBlock,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => bareReveal.play(),
        onEnterBack: () => bareReveal.play(),
      });
      // Rewind only once the block is fully off-screen, so it never blanks out while visible.
      ScrollTrigger.create({
        trigger: bareBlock,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => bareReveal.pause(0),
        onLeaveBack: () => bareReveal.pause(0),
      });

      return () => {
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative text-white">
      {/* Preloader overlay (Figma Default → Variant8) */}
      <div data-preloader className="fixed inset-0 z-50 grid text-white" role="status" aria-label="Loading">
        {/* Gate: two clipped halves of the same background, opened outwards on exit */}
        <div data-gate="left" className="absolute inset-0 [clip-path:inset(0_50%_0_0)]">
          <BrandBackground />
        </div>
        <div data-gate="right" className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
          <BrandBackground />
        </div>
        <div className="relative grid place-items-center [grid-area:1/1]">
          <Image
            data-pre-logo
            src="/assets/images/logo-alfa-septics-white.png"
            alt=""
            width={1137}
            height={1410}
            preload
            className="h-[31.5rem] w-[25.4rem]"
          />
        </div>
        <div data-pre-ui className="relative self-end px-[6rem] pb-[6.9rem] [grid-area:1/1]">
          <div className="flex items-start justify-between font-body text-[3rem] uppercase leading-[3rem]">
            <span className="tracking-[0.9rem]">Loading</span>
            <span className="tabular-nums">
              <span data-pre-count>0</span>%
            </span>
          </div>
          <div className="mt-[2.1rem] h-[1rem]">
            <div data-pre-bar className="h-full w-[1.11%] rounded-[1rem] bg-white" />
          </div>
        </div>
      </div>

      <StickyBackdrop>
        <BrandBackground watermark={false} />
      </StickyBackdrop>

      {/* Hero content (Variant12 layout) — scrolls natively, as V12 → V15 does in the prototype */}
      <div className="relative flex flex-col items-center">
        <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between pl-[7.5rem] pr-[6.8rem] pt-[3.4rem]">
          <a href="#top" aria-label="Alfa Septic home" className="mt-[0.5rem]">
            <Image
              data-hero-logo
              src="/assets/images/logo-alfa-septics-white.png"
              alt="Alfa Septic"
              width={1137}
              height={1410}
              preload
              className="invisible h-[13.3rem] w-[10.7rem]"
            />
          </a>
          <nav data-nav aria-label="Primary" className="invisible">
            <ul className="flex flex-col items-end font-gotham text-[1.6rem] font-medium uppercase leading-[1.46]">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={i === 0 ? "text-white" : "text-white/45 transition-colors hover:text-white"}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span data-nav-line aria-hidden className="absolute right-0 top-[5rem] h-px w-[5.7rem] bg-white" />
        </header>

        <div data-hero-image className="relative h-[90.3rem] w-full overflow-hidden">
          <div className="absolute inset-y-0 left-1/2 w-[219.8rem] -translate-x-1/2">
            <Image
              src="/assets/images/hero-site-excavator.png"
              alt="Septic tanks and an excavator on a cleared residential site"
              fill
              preload
              sizes="115vw"
              className="object-cover"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent from-[71.6%] to-black" />
        </div>

        <h1 className="relative -mt-[12.5rem] flex flex-col items-center whitespace-nowrap text-center font-display font-medium uppercase leading-[0.76] tracking-[-11.55px]">
          <span data-line-a className="invisible text-[165px]">
            Expert Septic &amp;
          </span>
          <span data-line-b className="invisible text-[168px]">
            Site Solutions
          </span>
        </h1>

        <div data-hero-support className="invisible mt-[3.4rem] flex w-[97.9rem] items-center justify-between">
          <p className="w-[62.5rem] text-[2rem] leading-[3rem]">
            Licensed septic, excavation, and utility services for homes, businesses, and new construction across
            Southeast Texas.
          </p>
          <PillLink href="/contact" className="w-[37.1rem]">
            Get a Free Estimate
          </PillLink>
        </div>
      </div>

      {/* After the hero → end of "From Bare Land": 2% logo artwork behind the content */}
      <div className="relative flex flex-col items-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[2]">
          <Image
            src="/assets/images/alfa-septics-logo-back.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="relative mt-[5.5rem] h-[65.5rem] w-[142.5rem]">
          {/* The white frame is baked into the image. */}
          <Image
            src="/assets/images/video-poster.png"
            alt="Alfa Septic truck and excavator on a septic installation"
            fill
            sizes="75vw"
            className="object-cover"
          />
        </div>

        {/* "From Bare Land" (Variant15 → Variant20 layout); reveals itself on entering view */}
        <div data-bare-block className="relative flex w-full flex-col items-center overflow-hidden pb-[12.6rem] pt-[15.1rem]">
          <div className="h-[34.8rem] w-[101.5rem]">
            <h2
              data-bare-heading
              className="whitespace-nowrap text-center font-display text-[12rem] font-black uppercase leading-[0.9] tracking-[-0.84rem]"
            >
              <span className="block">From Bare</span>
              <span className="block">Land to Fully</span>
              <span className="block">Connected</span>
            </h2>
          </div>
          <p data-bare-desc className="invisible mt-[2rem] w-[44.4rem] text-center text-[2rem] leading-[3rem]">
            One contractor for septic systems, excavation, site preparation, and utility connections.
          </p>
          <ul className="mt-[4.7rem] flex" aria-label="Credentials">
            {BADGES.map((badge) => (
              <li
                key={badge.label}
                data-badge
                className="relative h-[22.2rem] overflow-hidden"
                style={{ width: badge.width }}
              >
                <span className="sr-only">{badge.label}</span>
                <Image
                  src="/assets/images/trust-badges.png"
                  alt=""
                  width={1690}
                  height={931}
                  sizes="30vw"
                  className="absolute max-w-none"
                  style={{ top: "-20.29%", height: "144.08%", width: badge.imgWidth, left: badge.left }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
