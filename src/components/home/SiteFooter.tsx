import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/site";

// Absolute paths so the footer works on every page.
const SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Service Areas", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = ["Facebook", "Instagram", "YouTube", "Pinterest"];

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
        {/* Social URLs aren't in the design yet. */}
        <ul className="pt-[1.1rem]">
          {SOCIAL_LINKS.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>

      <p className="mt-[13.4rem]">© alfaseptics — All Rights Reserved</p>

      <p
        aria-hidden
        className="mt-[21.5rem] whitespace-nowrap font-display text-[22.6rem] font-black uppercase leading-[1.1] tracking-[-0.452rem]"
      >
        Alfa Septics
      </p>
    </footer>
  );
}
