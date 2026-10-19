import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";

/** Static version of the homepage header (white logo + stacked nav), for inner pages. */
export function SiteHeader({ current }: { current: string }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between pl-[7.5rem] pr-[6.8rem] pt-[3.4rem] text-white">
      <Link href="/" aria-label="Alfa Septics home" className="mt-[0.5rem]">
        <Image
          src="/assets/images/logo-alfa-septics-white.png"
          alt="Alfa Septics"
          width={1137}
          height={1410}
          preload
          className="h-[13.3rem] w-[10.7rem]"
        />
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-col items-end font-gotham text-[1.6rem] font-medium uppercase leading-[1.46]">
          {NAV_LINKS.map((item) => {
            const active = item.href === current;
            return (
              <li key={item.label} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={active ? "text-white" : "text-white/45 transition-colors hover:text-white"}
                >
                  {item.label}
                </Link>
                {active && <span aria-hidden className="absolute -right-[6.8rem] top-1/2 h-px w-[5.7rem] bg-white" />}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
