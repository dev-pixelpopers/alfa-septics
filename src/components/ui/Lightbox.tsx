"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";

type Photo = { src: string; alt: string };

type LightboxProps = {
  photos: Photo[];
  /** Index of the photo on show; the lightbox is closed when null. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** Full-screen photo slider: large image on top, thumbnail strip along the bottom. */
export function Lightbox({ photos, index, onIndexChange, onClose }: LightboxProps) {
  if (index === null) return null;
  return createPortal(
    <LightboxDialog photos={photos} index={index} onIndexChange={onIndexChange} onClose={onClose} />,
    document.body,
  );
}

function LightboxDialog({ photos, index, onIndexChange, onClose }: LightboxProps & { index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const count = photos.length;
  const go = (step: number) => onIndexChange((index + step + count) % count);

  // Keyboard: Esc closes, arrows step. The page behind doesn't scroll while open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onIndexChange, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Opening: backdrop fades in, image and strip rise.
  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: EASE_REVEAL } })
        .fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 })
        .fromTo("[data-lb-stage]", { scale: 0.94, y: "3rem" }, { scale: 1, y: 0, duration: 0.6 }, 0.05)
        .fromTo("[data-lb-thumb]", { y: "4rem", autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.5 }, 0.15);
    },
    { scope: root },
  );

  // Switching: new photo fades in; its thumbnail scrolls into view.
  useGSAP(
    () => {
      gsap.fromTo("[data-lb-image]", { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: EASE_REVEAL });
      root.current
        ?.querySelector(`[data-lb-thumb="${index}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    },
    { scope: root, dependencies: [index] },
  );

  const photo = photos[index];

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      tabIndex={-1}
      className="invisible fixed inset-0 z-[60] flex flex-col bg-[rgba(10,14,40,0.94)] text-white outline-none backdrop-blur-[0.6rem]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-[6rem] py-[3rem]">
        <p className="font-albert text-[2rem] font-light tabular-nums tracking-[0.1rem] text-white/80">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid size-[5.6rem] cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 transition-colors hover:border-white/60 hover:bg-white/20"
        >
          <span aria-hidden className="relative block size-[2.2rem]">
            <span className="absolute left-0 top-1/2 h-[0.2rem] w-full -translate-y-1/2 rotate-45 rounded-full bg-white" />
            <span className="absolute left-0 top-1/2 h-[0.2rem] w-full -translate-y-1/2 -rotate-45 rounded-full bg-white" />
          </span>
        </button>
      </div>

      {/* Main image */}
      <div data-lb-stage className="relative flex min-h-0 flex-1 items-center gap-[3rem] px-[6rem]">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="grid size-[6.4rem] shrink-0 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 transition-colors hover:border-white/60 hover:bg-white/20"
        >
          <ArrowIcon direction="right" className="w-[2.2rem] rotate-180" />
        </button>
        <figure className="relative flex h-full min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <Image
              key={photo.src}
              data-lb-image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="80vw"
              quality={90}
              className="object-contain"
            />
          </div>
          <figcaption className="mt-[2rem] text-center text-[1.9rem] leading-[1.4] text-white/75">{photo.alt}</figcaption>
        </figure>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="grid size-[6.4rem] shrink-0 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 transition-colors hover:border-white/60 hover:bg-white/20"
        >
          <ArrowIcon direction="right" className="w-[2.2rem]" />
        </button>
      </div>

      {/* Thumbnails */}
      <ul className="flex shrink-0 justify-center gap-[1.6rem] overflow-x-auto px-[6rem] pb-[4rem] pt-[3rem]">
        {photos.map((thumb, i) => (
          <li key={thumb.src} className="shrink-0">
            <button
              type="button"
              data-lb-thumb={i}
              onClick={() => onIndexChange(i)}
              aria-label={`Show photo ${i + 1}: ${thumb.alt}`}
              aria-current={i === index ? "true" : undefined}
              className={`relative block h-[10rem] w-[14rem] cursor-pointer overflow-hidden rounded-[1.2rem] transition-all duration-300 ${
                i === index
                  ? "opacity-100 ring-[0.3rem] ring-white ring-offset-[0.3rem] ring-offset-transparent"
                  : "opacity-45 hover:opacity-80"
              }`}
            >
              <Image src={thumb.src} alt="" fill sizes="10vw" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
