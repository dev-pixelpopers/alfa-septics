import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

// Absolute paths so the footer works on every page.
const SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

// TODO: swap "#" for the real profile URLs once the client provides them.
const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Pinterest", href: "#" },
];

/** Variant44 footer */
export function SiteFooter() {
  return (
    <footer className="relative isolate flex h-[80.8rem] flex-col items-center overflow-hidden text-[1.8rem] leading-[1.4] text-white">
      <Image
        src="/assets/images/footer-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <div className="flex w-full pl-[39.6rem] pt-[7.3rem]">
        <div className="flex w-[39rem] flex-col gap-[4.2rem]">
          <a href={CONTACT.phoneHref} className="hover:opacity-80">
            Call Us Now →<br />
            {CONTACT.phoneDisplay}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="hover:opacity-80">
            Send Email →<br />
            {CONTACT.email}
          </a>
        </div>
        <nav aria-label="Footer" className="w-[28rem]">
          <ul>
            {SITE_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:opacity-80">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="pt-[1.1rem]">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-[13.4rem]">© alfaseptic — All Rights Reserved</p>

      <p
        aria-hidden
        className="mt-[21.5rem] whitespace-nowrap font-display text-[22.6rem] font-black uppercase leading-[1.1] tracking-[-0.452rem]"
      >
        Alfa Septic
      </p>
    </footer>
  );
}
