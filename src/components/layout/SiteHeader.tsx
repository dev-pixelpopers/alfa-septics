"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site";

/**
 * Site-wide header (white logo + stacked nav), rendered once in the root layout.
 * On the homepage the logo and nav start hidden: HeroScene docks the preloader logo
 * into `data-hero-logo` and slides in `data-nav` / `data-nav-line`.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  // Once the page scrolls off the dark hero, a navy backdrop keeps the white logo and links legible.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between pl-[7.5rem] pr-[6.8rem] pt-[3.4rem] text-white">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-brand-navy/90 via-brand-navy/70 via-55% to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <Link href="/" aria-label="Alfa Septic home" className="mt-[0.5rem]">
        <Image
          data-hero-logo
          src="/assets/images/logo-alfa-septics-white.png"
          alt="Alfa Septic"
          width={1137}
          height={1410}
          preload
          className={`h-[13.3rem] w-[10.7rem] ${isHome ? "invisible" : ""}`}
        />
      </Link>
      <nav data-nav aria-label="Primary" className={isHome ? "invisible" : undefined}>
        <ul className="flex flex-col items-end font-gotham text-[1.6rem] font-medium uppercase leading-[1.46]">
          {NAV_LINKS.map((item) => {
            // Inner pages (e.g. /services/pumping) keep their section highlighted.
            const active = item.href === pathname || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.label} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "text-white" : "text-white/45 transition-colors hover:text-white"}
                >
                  {item.label}
                </Link>
                {active && (
                  <span
                    data-nav-line
                    aria-hidden
                    className="absolute -right-[6.8rem] top-1/2 h-px w-[5.7rem] bg-white"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
