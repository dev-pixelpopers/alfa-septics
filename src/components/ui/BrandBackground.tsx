import Image from "next/image";

type BrandBackgroundProps = {
  /** The 2% logo watermark; off where a section supplies its own. */
  watermark?: boolean;
};

// Royal blue fill + blurred brand glow + 2% logo watermark (Figma 203:22–24).
export function BrandBackground({ watermark = true }: BrandBackgroundProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-brand-royal">
      {watermark && (
        <div className="absolute left-0 top-[-39.9rem] h-[170.8rem] w-full opacity-[0.02]">
          <Image
            src="/assets/images/bg-logo-watermark.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom"
          />
        </div>
      )}
      {/* "Vector 1" pre-rendered with transparency: the source SVG's 230px blur is too costly to paint live. */}
      <Image src="/assets/images/bg-glow.webp" alt="" fill sizes="100vw" className="object-cover" />
    </div>
  );
}
