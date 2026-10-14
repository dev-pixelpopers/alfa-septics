"use client";

import { useRef } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";

// Copy is the placeholder text from the Figma file.
const QUOTE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In massa mauris, sodales non gravida vitae, sodales ac est. Aliquam pretium lectus vitae est ornare eleifend. Aenean tincidunt nulla id tincidunt egestas. Sed sed libero nibh. Mauris ut sodales dolor, eleifend laoreet est. Aenean accumsan hendrerit ullamcorper. Aliquam pellentesque facilisis imperdiet. Nulla pulvinar tincidunt eros, ac posuere quam tempor eu.";

const REVIEWS = [
  { name: "James Anderson", quote: QUOTE },
  { name: "Catherine Miller", quote: QUOTE },
  { name: "Jayson Roy", quote: QUOTE },
];

/** Variant39 → Variant42 */
export function ReviewsScene() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const quotes = q("[data-quote]");
      gsap.set(quotes.slice(1), { autoAlpha: 0 });

      const tl = createSceneTimeline(root.current!).addLabel("review-0", 0);
      for (let step = 1; step < REVIEWS.length; step++) {
        const at = step - 1;
        // Outgoing quote fades as the list rolls; the name follows a beat later.
        tl.to(q("[data-quotes]"), { y: `${-19 * step}rem` }, at)
          .to(quotes[step - 1], { autoAlpha: 0, ease: "power2.in", duration: 0.5 }, at)
          .to(quotes[step], { autoAlpha: 1, ease: "power2.out", duration: 0.6 }, at + 0.4)
          .to(q("[data-names]"), { y: `${-3.8 * step}rem` }, at + 0.15)
          .addLabel(`review-${step}`, at + 1.15);
      }
      tl.to({}, { duration: 0.5 });
      timeline.current = tl;
    },
    { scope: root },
  );

  // Prev/Next scroll the page to the neighbouring review state.
  const go = (direction: 1 | -1) => {
    const tl = timeline.current;
    const st = tl?.scrollTrigger;
    if (!tl || !st) return;
    const stops = REVIEWS.map((_, i) => tl.labels[`review-${i}`]);
    const time = st.progress * tl.duration();
    // Index of the review currently in view (nearest settled state).
    const current = stops.reduce((best, t, i) => (Math.abs(t - time) < Math.abs(stops[best] - time) ? i : best), 0);
    const target = gsap.utils.clamp(0, REVIEWS.length - 1, current + direction);
    window.scrollTo({ top: st.start + (st.end - st.start) * (stops[target] / tl.duration()), behavior: "smooth" });
  };

  return (
    <section id="reviews" ref={root} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-white pt-[14.8rem]">
        <h2 className="w-[125.3rem] whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] text-brand-cyan">
          <span className="block">What Our</span>
          <span className="block">Clients Say</span>
        </h2>

        <div className="mt-[6.1rem] h-[15.8rem] w-[89.9rem] overflow-hidden">
          <ul data-quotes>
            {REVIEWS.map((review) => (
              <li key={review.name} data-quote className="h-[19rem]">
                <blockquote className="text-center text-[2rem] leading-[1.4] text-[rgba(102,102,102,0.66)]">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-[4.1rem] h-[3.5rem] w-[25.3rem] overflow-hidden">
          <ul data-names>
            {REVIEWS.map((review) => (
              <li
                key={review.name}
                className="h-[3.8rem] text-center text-[2.5rem] font-medium leading-[1.4] text-brand-navy"
              >
                {review.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-[130rem] justify-between font-albert text-[2rem] leading-[1.4] tracking-[0.1rem] text-brand-navy">
          <button type="button" onClick={() => go(-1)} className="flex items-center gap-[1rem] hover:opacity-70">
            <ArrowIcon direction="right" className="w-[1.6rem] rotate-180" />
            Prev
          </button>
          <button type="button" onClick={() => go(1)} className="flex items-center gap-[1rem] hover:opacity-70">
            Next
            <ArrowIcon direction="right" className="w-[1.6rem]" />
          </button>
        </div>
      </div>
    </section>
  );
}
