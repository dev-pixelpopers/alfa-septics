"use client";

import { useRef } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { createSceneTimeline, gsap, useGSAP } from "@/lib/gsap";

// TODO: placeholder reviews for layout only — replace with real customer reviews before launch.
const REVIEWS = [
  {
    name: "James Anderson",
    initial: "J",
    color: "#1a73e8",
    meta: "6 reviews",
    when: "2 weeks ago",
    quote:
      "Alfa Septic installed a new aerobic system on our property in Crosby. They walked us through the permit, showed up when they said they would, and left the yard cleaner than they found it. Couldn't ask for a smoother install.",
  },
  {
    name: "Catherine Miller",
    initial: "C",
    color: "#e8710a",
    meta: "Local Guide · 23 reviews",
    when: "1 month ago",
    quote:
      "Our alarm went off on a Sunday and they had someone out first thing Monday. The tech found a failed pump, explained exactly what happened, and had it replaced the same day. Fair price and honest advice.",
  },
  {
    name: "Jayson Roy",
    initial: "J",
    color: "#188038",
    meta: "3 reviews",
    when: "2 months ago",
    quote:
      "We're building on raw land and Alfa handled everything — site evaluation, design, permitting, and the install. One crew from start to finish made a huge difference. Highly recommend them to any builder.",
  },
  {
    name: "Maria Gonzalez",
    initial: "M",
    color: "#a142f4",
    meta: "11 reviews",
    when: "3 months ago",
    quote:
      "Signed up for their maintenance contract after buying our home. Inspections happen on schedule and they always call ahead before they come. It's one less thing I have to think about.",
  },
];

function Stars() {
  return (
    <span className="flex gap-[0.3rem]" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-[2rem]" aria-hidden>
          <path
            fill="#fbbc04"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </span>
  );
}

/** Variant39 → Variant42 */
export function ReviewsScene() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cards = q("[data-review]");
      const dots = q("[data-dot]");
      gsap.set(cards.slice(1), { autoAlpha: 0, y: "6rem" });
      gsap.set(dots.slice(1), { opacity: 0.3 });

      const tl = createSceneTimeline(root.current!).addLabel("review-0", 0);
      for (let step = 1; step < REVIEWS.length; step++) {
        const at = step - 1;
        // Outgoing card lifts away; the next one rises into its place.
        tl.to(cards[step - 1], { autoAlpha: 0, y: "-6rem", ease: "power2.in", duration: 0.5 }, at)
          .to(cards[step], { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 }, at + 0.4)
          .to(dots[step - 1], { opacity: 0.3, duration: 0.4 }, at + 0.3)
          .to(dots[step], { opacity: 1, duration: 0.4 }, at + 0.3)
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
    <section id="reviews" ref={root} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden bg-white pt-[14.8rem]">
        <h2 className="w-[125.3rem] whitespace-nowrap text-center font-display text-[16.5rem] font-black uppercase leading-[0.9] tracking-[-1.155rem] text-brand-cyan">
          <span className="block">What Our</span>
          <span className="block">Clients Say</span>
        </h2>

        {/* Review cards, styled after a Google review */}
        <ul className="relative mt-[6.1rem] h-[27rem] w-[89.9rem]">
          {REVIEWS.map((review) => (
            <li
              key={review.name}
              data-review
              className="absolute inset-0 rounded-[2.4rem] border border-[#dadce0] bg-white p-[4rem] text-left font-[family-name:Arial,Helvetica,sans-serif] shadow-[0_0.2rem_0.6rem_rgba(60,64,67,0.15)]"
            >
              <div className="flex items-center gap-[1.6rem]">
                <span
                  aria-hidden
                  className="grid size-[4.8rem] shrink-0 place-items-center rounded-full text-[2.2rem] font-medium text-white"
                  style={{ backgroundColor: review.color }}
                >
                  {review.initial}
                </span>
                <div>
                  <p className="text-[1.9rem] font-medium leading-[1.3] text-[#202124]">{review.name}</p>
                  <p className="text-[1.5rem] leading-[1.3] text-[#70757a]">{review.meta}</p>
                </div>
              </div>
              <div className="mt-[1.6rem] flex items-center gap-[1.2rem]">
                <Stars />
                <span className="text-[1.5rem] text-[#70757a]">{review.when}</span>
              </div>
              <blockquote className="mt-[1.4rem] text-[1.9rem] leading-[1.55] text-[#3c4043]">{review.quote}</blockquote>
            </li>
          ))}
        </ul>

        <div className="mt-[4.4rem] flex w-[89.9rem] items-center justify-between font-albert text-[2rem] leading-[1.4] tracking-[0.1rem] text-brand-navy">
          <button type="button" onClick={() => go(-1)} className="flex items-center gap-[1rem] hover:opacity-70">
            <ArrowIcon direction="right" className="w-[1.6rem] rotate-180" />
            Prev
          </button>
          <span aria-hidden className="flex gap-[1rem]">
            {REVIEWS.map((review) => (
              <span key={review.name} data-dot className="size-[1rem] rounded-full bg-brand-navy" />
            ))}
          </span>
          <button type="button" onClick={() => go(1)} className="flex items-center gap-[1rem] hover:opacity-70">
            Next
            <ArrowIcon direction="right" className="w-[1.6rem]" />
          </button>
        </div>
      </div>
    </section>
  );
}
