import { BrandBackground } from "@/components/ui/BrandBackground";
import { PillLink } from "@/components/ui/PillLink";
import { CONTACT } from "@/lib/site";

/** Closing "free estimate" band for inner pages. */
export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden py-[16rem] text-white">
      <div className="absolute inset-0 -z-10">
        <BrandBackground />
      </div>
      <div className="mx-auto flex w-[164rem] flex-col items-center text-center">
        <h2 className="font-display text-[11rem] uppercase leading-[0.9] tracking-[-0.6rem]">
          Ready to start
          <br />
          <span className="text-[#8fd8f0]">your project?</span>
        </h2>
        <p className="mt-[3.6rem] w-[70rem] text-[2.4rem] leading-[1.5] text-white/85">
          Tell us about your site and we&apos;ll walk you through the first step with a free, no-obligation estimate.
        </p>
        <div className="mt-[6rem] flex items-center gap-[4rem]">
          <PillLink href="/contact" variant="gradient" className="w-[37.1rem]">
            Get a Free Estimate
          </PillLink>
          <a
            href={CONTACT.phoneHref}
            className="text-[2.4rem] underline decoration-white/40 underline-offset-[0.6rem] transition-colors hover:decoration-white"
          >
            Or call {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
