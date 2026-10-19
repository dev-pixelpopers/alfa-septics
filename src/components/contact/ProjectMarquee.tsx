import Image from "next/image";
import { projectPhoto } from "@/lib/site";

const PHOTOS = [
  { name: "crane-tank-crew", alt: "Crew guiding a concrete tank off a crane truck" },
  { name: "tank-in-trench-risers", alt: "Concrete septic tank with green risers set in a trench" },
  { name: "mini-excavator-site", alt: "Mini excavator working on an open lot" },
  { name: "aerobic-unit-construction", alt: "Aerobic treatment unit installed beside new construction" },
  { name: "crane-truck-pit", alt: "Crane truck parked beside a freshly dug tank pit" },
  { name: "tank-risers-set", alt: "Tank risers and lids set on a concrete septic tank" },
  { name: "crane-truck-unloading", alt: "Crane truck unloading a septic tank at a job site" },
  { name: "drain-line-trench", alt: "Drain line trench cut along a cleared site" },
];

/** Infinite strip of recent job photos; pauses on hover. Duplicated once for a seamless loop. */
export function ProjectMarquee() {
  return (
    <div className="group relative overflow-hidden" aria-label="Recent projects">
      <div className="flex w-max animate-marquee gap-[2.4rem] group-hover:[animation-play-state:paused]">
        {[...PHOTOS, ...PHOTOS].map((photo, i) => (
          <figure
            key={`${photo.name}-${i}`}
            aria-hidden={i >= PHOTOS.length}
            className={`relative h-[34rem] shrink-0 overflow-hidden rounded-[2.8rem] ${i % 3 === 1 ? "w-[26rem]" : "w-[46rem]"}`}
          >
            <Image
              src={projectPhoto(photo.name)}
              alt={i >= PHOTOS.length ? "" : photo.alt}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </figure>
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[16rem] bg-gradient-to-r from-snow to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[16rem] bg-gradient-to-l from-snow to-transparent" />
    </div>
  );
}
