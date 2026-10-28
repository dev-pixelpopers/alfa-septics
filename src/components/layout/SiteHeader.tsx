"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandBackground } from "@/components/ui/BrandBackground";
import { PillLink } from "@/components/ui/PillLink";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, NAV_LINKS } from "@/lib/site";

// The menu wipes open as a circle from the hamburger button.
const CLOSED = "circle(0% at calc(100% - 9rem) 5.7rem)";
const OPEN = "circle(150% at calc(100% - 9rem) 5.7rem)";

/**
 * Site-wide header (white logo + hamburger menu), rendered once in the root layout.
 * On the homepage the logo and menu button start hidden: HeroScene docks the preloader
 * logo into `data-hero-logo` and slides in `data-nav` / `data-nav-line`.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // Esc closes the menu; the page behind it doesn't scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [overlay] = q("[data-menu]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speed = reduce ? 0.01 : 1;

      if (open) {
        gsap
          .timeline()
          .set(overlay, { visibility: "visible" })
          .fromTo(overlay, { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.9 * speed, ease: "power3.inOut" })
          .fromTo(
            q("[data-menu-item]"),
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8 * speed, ease: EASE_REVEAL, stagger: 0.05 },
            "-=0.45",
          )
          .fromTo(q("[data-menu-aside]"), { y: "4rem", autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 * speed }, "<0.2");
      } else {
        gsap.to(overlay, {
          clipPath: CLOSED,
          duration: 0.6 * speed,
          ease: "power3.inOut",
          onComplete: () => gsap.set(overlay, { visibility: "hidden" }),
        });
      }
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-[7.2rem] py-[2rem] text-white"
    >
      {/* Subtle black wash so the white logo and button read over any section, fading out below the bar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[16rem] bg-gradient-to-b from-black/45 via-black/15 to-transparent"
      />

      <Link href="/" aria-label="Alfa Septic home" onClick={() => setOpen(false)} className="relative z-10 shrink-0">
        <Image
          data-hero-logo
          src="/assets/images/alfa-septic-logo.png"
          alt="Alfa Septic"
          width={1137}
          height={1410}
          preload
          className={`h-[7.4rem] w-[6rem] ${isHome ? "invisible" : ""}`}
        />
      </Link>

      <div data-nav className={`relative z-10 ${isHome ? "invisible" : ""}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="group flex h-[5.4rem] cursor-pointer items-center gap-[1.6rem] rounded-full border border-white/30 bg-white/10 pl-[2.4rem] pr-[1.8rem] font-gotham text-[1.5rem] font-medium uppercase tracking-[0.15rem] backdrop-blur-[0.8rem] transition-colors hover:border-white/60 hover:bg-white/20"
        >
          <span className="w-[5.2rem] text-left">{open ? "Close" : "Menu"}</span>
          <span aria-hidden className="relative block h-[1.4rem] w-[2.6rem]">
            <span
              className={`absolute left-0 h-[0.2rem] w-full rounded-full bg-white transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
            />
            <span
              data-nav-line
              className={`absolute bottom-0 right-0 h-[0.2rem] rounded-full bg-white transition-all duration-300 ${open ? "bottom-1/2 w-full translate-y-1/2 !-rotate-45" : "w-[65%] group-hover:w-full"
                }`}
            />
          </span>
        </button>
      </div>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        data-menu
        inert={!open}
        className="invisible fixed inset-0 [clip-path:circle(0%_at_calc(100%_-_9rem)_5.7rem)]"
      >
        <BrandBackground />
        <div className="relative mx-auto grid h-full w-[164rem] grid-cols-[1fr_46rem] items-center gap-[10rem] pt-[11rem]">
          <nav aria-label="Primary">
            <ol className="flex flex-col">
              {NAV_LINKS.map((item, i) => {
                // Inner pages (e.g. /services/pumping) keep their section highlighted.
                const active = item.href === pathname || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                return (
                  <li key={item.label} className="overflow-hidden">
                    <Link
                      data-menu-item
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`group flex items-baseline gap-[3.2rem] py-[0.4rem] font-display text-[7.6rem] font-black uppercase leading-[1] tracking-[-0.3rem] transition-colors ${active ? "text-[#8fd8f0]" : "text-white hover:text-[#8fd8f0]"
                        }`}
                    >
                      <span className="w-[4rem] font-body text-[1.8rem] font-normal tracking-[0.2rem] text-white/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="transition-transform duration-500 group-hover:translate-x-[2rem]">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <aside data-menu-aside className="flex flex-col gap-[4.8rem] border-l border-white/15 pl-[6rem]">
            <div>
              <p className="text-[1.6rem] uppercase tracking-[0.4rem] text-white/50">Call us</p>
              <a href={CONTACT.phoneHref} className="mt-[1.2rem] block text-[3.2rem] transition-colors hover:text-[#8fd8f0]">
                {CONTACT.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="text-[1.6rem] uppercase tracking-[0.4rem] text-white/50">Email us</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-[1.2rem] block text-[2.6rem] transition-colors hover:text-[#8fd8f0]"
              >
                {CONTACT.email}
              </a>
            </div>
            <div>
              <p className="text-[1.6rem] uppercase tracking-[0.4rem] text-white/50">Service area</p>
              <p className="mt-[1.2rem] text-[2.6rem]">{CONTACT.region}</p>
            </div>
            <div onClick={() => setOpen(false)}>
              <PillLink href="/contact" variant="gradient" className="w-full">
                Get a Free Estimate
              </PillLink>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}
