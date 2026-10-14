import Image from "next/image";
import type { Ref } from "react";

type BrandBackgroundProps = {
  /** Lets the hero parallax the watermark on scroll. */
  watermarkRef?: Ref<HTMLDivElement>;
};

// Royal blue fill + blurred brand glow + 2% logo watermark (Figma 203:22–24).
export function BrandBackground({ watermarkRef }: BrandBackgroundProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-brand-royal">
      <div ref={watermarkRef} className="absolute left-0 top-[-39.9rem] h-[170.8rem] w-full opacity-[0.02]">
        <Image
          src="/assets/images/bg-logo-watermark.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      {/* "Vector 1" pre-rendered with transparency: the source SVG's 230px blur is too costly to paint live. */}
      <Image src="/assets/images/bg-glow.webp" alt="" fill sizes="100vw" className="object-cover" />

    </div>
  );
}
