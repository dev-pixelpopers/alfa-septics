import Image from "next/image";
import Link from "next/link";
import { CONTACT, SOCIAL_LINKS } from "@/lib/site";

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

/** Variant44 footer */
export function SiteFooter() {
  return (
    <footer className="relative isolate flex h-[80.8rem] flex-col items-center overflow-hidden text-[1.8rem] leading-[1.4] text-white max-sm:h-auto max-sm:text-[15px]">
      <Image
        src="/assets/images/footer-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />

      {/* Mobile (max-sm): contact + affiliations full width, site and social links side by side. */}
      <div className="flex w-full pl-[39.6rem] pt-[7.3rem] footer-inner max-sm:grid! max-sm:grid-cols-2 max-sm:gap-x-[16px] max-sm:gap-y-[28px]! max-sm:px-[20px]! max-sm:pt-[48px]">
        <div className="flex w-[39rem] flex-col gap-[4.2rem] max-sm:col-span-2 max-sm:w-auto max-sm:gap-[12px]">
          <a href={CONTACT.phoneHref} className="hover:opacity-80">
            Call Us Now →<br />
            {CONTACT.phoneDisplay}
          </a>
          {/* <a href={`mailto:${CONTACT.email}`} className="hover:opacity-80">
            Send Email →<br />
            {CONTACT.email}
          </a> */}
        </div>
        <nav aria-label="Footer" className="w-[28rem] max-sm:w-auto">
          <ul className="max-sm:flex max-sm:flex-col max-sm:gap-[6px]">
            {SITE_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:opacity-80">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="pt-[1.1rem] max-sm:flex max-sm:flex-col max-sm:gap-[6px] max-sm:pt-0">
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

        <div className="pl-50 max-sm:col-span-2 max-sm:pl-0">
          <h3 className="pb-10 font-display text-[3rem] uppercase leading-none max-sm:pb-[10px] max-sm:text-[20px]">Our Affiliations</h3>
          <p className="max-sm:w-auto! max-sm:text-[14px]! max-sm:leading-[1.5]!">
            Proudly affiliated with Alfa Plumbing and Alfa Services.
          </p>
        </div>
      </div>

      <p className="mt-[13.4rem] max-sm:mt-[40px] max-sm:w-auto! max-sm:px-[20px] max-sm:text-center max-sm:text-[13px]!">
        © alfaseptic — All Rights Reserved
      </p>

      <p
        aria-hidden
        className="mt-[21.5rem] whitespace-nowrap font-display text-[22.6rem] font-black uppercase leading-[1.1] tracking-[-0.452rem] max-sm:mt-[16px] max-sm:w-auto! max-sm:text-[13.5vw]! max-sm:leading-[1.1]! max-sm:tracking-[-0.02em]"
      >
        Alfa Septic
      </p>
    </footer>
  );
}
