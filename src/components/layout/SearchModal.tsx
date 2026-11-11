"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, NAV_LINKS, PROCESS_STEPS, PUMPING_PRICE, SERVICE_AREAS, SERVICES } from "@/lib/site";

export type SearchCategory = "Service" | "Page" | "Process" | "Service Area" | "Pricing" | "Contact";

export type SearchItem = {
  id: string;
  title: string;
  category: SearchCategory;
  description: string;
  href: string;
  keywords: string[];
};

// Build the site-wide search index
function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // 1. Services
  SERVICES.forEach((service) => {
    items.push({
      id: `service-${service.slug}`,
      title: service.title,
      category: "Service",
      description: service.body,
      href: `/services/${service.slug}`,
      keywords: [
        service.title,
        service.slug,
        service.intro,
        ...(service.points || []),
        ...(service.signs || []),
        "septic",
        "system",
        "service",
      ],
    });
  });

  // 2. Primary Pages
  NAV_LINKS.forEach((nav) => {
    items.push({
      id: `page-${nav.href === "/" ? "home" : nav.href.replace("/", "")}`,
      title: nav.label === "Home" ? "Alfa Septic — Home" : nav.label,
      category: "Page",
      description:
        nav.href === "/"
          ? "Licensed septic, excavation, and utility solutions across Southeast Texas."
          : `Visit the Alfa Septic ${nav.label} page.`,
      href: nav.href,
      keywords: [nav.label, "page", "website", "alfa septic"],
    });
  });

  // 3. Process Steps
  PROCESS_STEPS.forEach((step, index) => {
    items.push({
      id: `process-${step.slug}`,
      title: `Step ${index + 1}: ${step.title}`,
      category: "Process",
      description: step.body,
      href: `/process#${step.slug}`,
      keywords: [
        step.title,
        step.slug,
        `step ${index + 1}`,
        ...(step.points || []),
        "process",
        "workflow",
        "turnkey",
      ],
    });
  });

  // 4. Counties and Service Areas
  SERVICE_AREAS.forEach((area) => {
    items.push({
      id: `area-${area.county.toLowerCase()}`,
      title: `${area.county} County Service Area`,
      category: "Service Area",
      description: `Septic solutions in ${area.county} County: ${area.towns.slice(0, 5).join(", ")}${
        area.towns.length > 5 ? ", and more" : ""
      }.`,
      href: "/service-areas",
      keywords: [area.county, ...area.towns, "county", "town", "texas", "southeast texas", "service area"],
    });
  });

  // 5. Individual Towns
  SERVICE_AREAS.forEach((area) => {
    area.towns.forEach((town) => {
      items.push({
        id: `town-${town.toLowerCase().replace(/\s+/g, "-")}`,
        title: `${town}, TX`,
        category: "Service Area",
        description: `Professional septic tank pumping, installation, and repairs in ${town} (${area.county} County).`,
        href: "/service-areas",
        keywords: [town, area.county, "town", "city", "location", "service area"],
      });
    });
  });

  // 6. Pricing & Estimates
  items.push(
    {
      id: "pricing-pumping",
      title: `Septic Tank Pumping (From $${PUMPING_PRICE})`,
      category: "Pricing",
      description: "Routine and emergency pumping upfront rates to protect your property and drain field.",
      href: "/pricing",
      keywords: ["pricing", "cost", "rates", "pumping price", String(PUMPING_PRICE), "pump out"],
    },
    {
      id: "pricing-maintenance",
      title: "Annual Maintenance Contract",
      category: "Pricing",
      description: "Scheduled inspections and TCEQ compliance support for aerobic systems.",
      href: "/pricing",
      keywords: ["maintenance contract", "price", "monthly", "year-round", "aerobic contract", "inspection"],
    },
    {
      id: "contact-estimate",
      title: "Request a Free Estimate",
      category: "Contact",
      description: "Get a clear, honest quote for your septic installation, repair, or pumping project.",
      href: "/contact",
      keywords: ["estimate", "quote", "free estimate", "consultation", "cost estimate", "bid"],
    },
    {
      id: "contact-phone",
      title: `Emergency Dispatch: ${CONTACT.phoneDisplay}`,
      category: "Contact",
      description: "Immediate phone line for system alarms, sewage backups, or urgent pump-outs.",
      href: CONTACT.phoneHref,
      keywords: ["emergency", "call", "phone", "hotline", "urgent", "alarm sounding", "backup"],
    },
  );

  return items;
}

const SEARCH_INDEX = buildSearchIndex();

const POPULAR_SEARCHES = [
  "Septic Pumping",
  "Maintenance Contract",
  "Emergency Repairs",
  "Aerobic Installation",
  "Pricing",
  "Service Areas",
  "Houston",
  "Free Estimate",
];

const CATEGORY_STYLES: Record<SearchCategory, { badge: string; text: string }> = {
  Service: {
    badge: "border-[#31a2ca]/40 bg-[#31a2ca]/15 text-[#8fd8f0]",
    text: "text-[#8fd8f0]",
  },
  Page: {
    badge: "border-white/20 bg-white/10 text-white/80",
    text: "text-white/80",
  },
  Process: {
    badge: "border-[#2a9667]/40 bg-[#2a9667]/15 text-[#5eead4]",
    text: "text-[#5eead4]",
  },
  "Service Area": {
    badge: "border-[#818cf8]/40 bg-[#818cf8]/15 text-[#c7d2fe]",
    text: "text-[#c7d2fe]",
  },
  Pricing: {
    badge: "border-[#f59e0b]/40 bg-[#f59e0b]/15 text-[#fde68a]",
    text: "text-[#fde68a]",
  },
  Contact: {
    badge: "border-[#ec4899]/40 bg-[#ec4899]/15 text-[#fbcfe8]",
    text: "text-[#fbcfe8]",
  },
};

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const emptySubscribe = () => () => {};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted || !isOpen) return null;

  return createPortal(<SearchModalDialog onClose={onClose} />, document.body);
}

function SearchModalDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputId = useId();

  // Esc key listener & body scroll lock
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Entrance animation
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [backdrop] = q("[data-search-backdrop]");
      const [card] = q("[data-search-card]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const speed = reduce ? 0.01 : 1;

      gsap
        .timeline({ defaults: { ease: EASE_REVEAL } })
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 * speed })
        .fromTo(
          card,
          { y: "-2.5rem", scale: 0.96, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.45 * speed },
          0.04,
        );
    },
    { scope: root },
  );

  // Filter items matching query
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const terms = trimmed.split(/\s+/).filter(Boolean);

    const scored = SEARCH_INDEX.map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const categoryLower = item.category.toLowerCase();
      const keywordsJoined = item.keywords.join(" ").toLowerCase();

      // Check if all terms match somewhere in the item
      const matchesAll = terms.every(
        (term) =>
          titleLower.includes(term) ||
          descLower.includes(term) ||
          categoryLower.includes(term) ||
          keywordsJoined.includes(term),
      );

      if (!matchesAll) return { item, score: 0 };

      // Scoring
      terms.forEach((term) => {
        if (titleLower === term) score += 150;
        else if (titleLower.startsWith(term)) score += 90;
        else if (titleLower.includes(term)) score += 50;

        if (keywordsJoined.includes(term)) score += 30;
        if (categoryLower.includes(term)) score += 20;
        if (descLower.includes(term)) score += 10;
      });

      return { item, score };
    })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    return scored.slice(0, 10);
  }, [query]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  // Keep selected item visible in view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-search-index="${selectedIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  const navigateTo = useCallback(
    (href: string) => {
      onClose();
      if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    },
    [onClose, router],
  );

  // Keyboard navigation within the search dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        navigateTo(filteredResults[selectedIndex].href);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Search Alfa Septic"
      className="fixed inset-0 z-[70] flex items-start justify-center p-[2rem] pt-[6rem] sm:pt-[10rem]"
    >
      {/* Blurred dark backdrop */}
      <div
        data-search-backdrop
        onClick={handleBackdropClick}
        className="fixed inset-0 -z-10 bg-[rgba(6,10,28,0.85)] backdrop-blur-[1.4rem]"
      />

      {/* Modal Card */}
      <div
        data-search-card
        className="relative flex w-[100rem] max-w-[94vw] max-h-[82vh] flex-col overflow-hidden rounded-[2.8rem] border border-white/20 bg-gradient-to-b from-[#131d42]/95 via-[#0c1432]/95 to-[#070b20]/95 text-white shadow-[0_4rem_12rem_rgba(0,0,0,0.8)] backdrop-blur-[2.4rem]"
      >
        {/* Header with Search Input & Close button */}
        <div className="flex items-center gap-[1.6rem] border-b border-white/10 p-[2.4rem]">
          {/* Input container */}
          <div className="flex h-[6.4rem] flex-1 items-center gap-[1.6rem] rounded-full border border-white/25 bg-white/10 px-[2.2rem] backdrop-blur-[0.8rem] transition-all focus-within:border-[#8fd8f0] focus-within:ring-2 focus-within:ring-[#8fd8f0]/40">
            {/* White search icon */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[2.4rem] shrink-0 text-white"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded={filteredResults.length > 0}
              aria-autocomplete="list"
              aria-controls="search-results-list"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search services, pumping, pricing, process, service areas..."
              className="w-full bg-transparent font-body text-[2rem] text-white outline-none placeholder:text-white/45"
            />

            {/* Clear button if text entered */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  handleQueryChange("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search query"
                className="grid size-[3.2rem] shrink-0 cursor-pointer place-items-center rounded-full text-white/60 transition-colors hover:bg-white/15 hover:text-white"
              >
                <span aria-hidden className="relative block size-[1.4rem]">
                  <span className="absolute left-0 top-1/2 h-[0.16rem] w-full -translate-y-1/2 rotate-45 rounded-full bg-white" />
                  <span className="absolute left-0 top-1/2 h-[0.16rem] w-full -translate-y-1/2 -rotate-45 rounded-full bg-white" />
                </span>
              </button>
            )}

            {/* ESC badge */}
            <span
              aria-hidden
              className="hidden sm:inline-block rounded-[0.8rem] border border-white/20 bg-white/5 px-[1rem] py-[0.3rem] font-mono text-[1.2rem] text-white/50"
            >
              ESC
            </span>
          </div>

          {/* Close modal button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-[6.4rem] shrink-0 cursor-pointer place-items-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:border-white/60 hover:bg-white/20"
          >
            <span aria-hidden className="relative block size-[2rem]">
              <span className="absolute left-0 top-1/2 h-[0.2rem] w-full -translate-y-1/2 rotate-45 rounded-full bg-white" />
              <span className="absolute left-0 top-1/2 h-[0.2rem] w-full -translate-y-1/2 -rotate-45 rounded-full bg-white" />
            </span>
          </button>
        </div>

        {/* Modal Results Body */}
        <div className="flex-1 overflow-y-auto p-[2.4rem]">
          {/* State 1: When no query entered yet (Empty State with Popular Searches & Quick Links) */}
          {!query.trim() && (
            <div className="space-y-[2.8rem]">
              <div>
                <p className="font-gotham text-[1.3rem] font-medium uppercase tracking-[0.2rem] text-white/50">
                  Popular Searches
                </p>
                <div className="mt-[1.4rem] flex flex-wrap gap-[1rem]">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        handleQueryChange(tag);
                        inputRef.current?.focus();
                      }}
                      className="cursor-pointer rounded-full border border-white/20 bg-white/10 px-[1.8rem] py-[0.8rem] font-body text-[1.5rem] text-white/80 transition-all hover:border-[#8fd8f0] hover:bg-[#8fd8f0]/15 hover:text-white"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-gotham text-[1.3rem] font-medium uppercase tracking-[0.2rem] text-white/50">
                  Quick Access
                </p>
                <div className="mt-[1.4rem] grid grid-cols-1 gap-[1.2rem] sm:grid-cols-2">
                  {SERVICES.slice(0, 4).map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-[1.8rem] border border-white/15 bg-white/[0.04] p-[1.8rem] transition-all hover:border-[#8fd8f0]/60 hover:bg-white/10"
                    >
                      <div>
                        <span className="font-gotham text-[1.1rem] uppercase tracking-[0.15rem] text-[#8fd8f0]">
                          Service
                        </span>
                        <p className="mt-[0.2rem] font-gotham text-[1.7rem] font-medium text-white group-hover:text-[#8fd8f0] transition-colors">
                          {service.title}
                        </p>
                      </div>
                      <ArrowIcon className="w-[1.8rem] shrink-0 text-white/40 transition-all group-hover:translate-x-[0.3rem] group-hover:text-white" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* State 2: Query entered with matching results */}
          {query.trim() && filteredResults.length > 0 && (
            <div>
              <div className="mb-[1.4rem] flex items-center justify-between px-[0.6rem]">
                <p className="font-gotham text-[1.3rem] font-medium uppercase tracking-[0.2rem] text-white/50">
                  {filteredResults.length} {filteredResults.length === 1 ? "Result" : "Results"} Found
                </p>
                <p className="text-[1.3rem] text-white/40 hidden sm:block">Press ↵ to view</p>
              </div>

              <ul id="search-results-list" ref={listRef} role="listbox" className="space-y-[1rem]">
                {filteredResults.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Page;

                  return (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      data-search-index={index}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => navigateTo(item.href)}
                      className={`group flex cursor-pointer items-center justify-between gap-[2rem] rounded-[2rem] border p-[1.8rem] sm:p-[2rem] transition-all duration-200 ${
                        isSelected
                          ? "border-[#8fd8f0] bg-white/[0.12] shadow-[0_1rem_3rem_rgba(49,162,202,0.15)] ring-1 ring-[#8fd8f0]/50"
                          : "border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-[1rem]">
                          <span
                            className={`rounded-full border px-[1.2rem] py-[0.2rem] font-gotham text-[1.1rem] font-medium uppercase tracking-[0.15rem] ${catStyle.badge}`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p
                          className={`mt-[0.6rem] font-gotham text-[1.9rem] font-medium text-white transition-colors ${
                            isSelected ? "text-[#8fd8f0]" : "group-hover:text-[#8fd8f0]"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-[0.4rem] font-body text-[1.5rem] leading-[1.4] text-white/70 line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="shrink-0 pl-[1rem]">
                        <span
                          className={`grid size-[4.4rem] place-items-center rounded-full border transition-all ${
                            isSelected
                              ? "border-[#8fd8f0] bg-[#8fd8f0]/20 text-white"
                              : "border-white/20 bg-white/5 text-white/40 group-hover:border-white/40 group-hover:text-white"
                          }`}
                        >
                          <ArrowIcon className="w-[1.8rem] transition-transform group-hover:translate-x-[0.2rem]" />
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* State 3: Query entered but no matching results */}
          {query.trim() && filteredResults.length === 0 && (
            <div className="py-[4.8rem] text-center">
              <div className="mx-auto grid size-[8rem] place-items-center rounded-full border border-white/20 bg-white/10">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="size-[3.6rem] text-white/60"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.35-4.35" />
                  <path d="M11 8v3M11 14h.01" />
                </svg>
              </div>

              <p className="mt-[2.4rem] font-gotham text-[2.2rem] font-medium text-white">
                No results found for &ldquo;{query}&rdquo;
              </p>
              <p className="mx-auto mt-[1rem] max-w-[50rem] font-body text-[1.6rem] text-white/65">
                We couldn&apos;t find matching services or pages. Try a different keyword, or contact our team directly:
              </p>

              <div className="mt-[2.8rem] flex flex-wrap justify-center gap-[1.6rem]">
                <a
                  href={CONTACT.phoneHref}
                  className="inline-flex h-[5.2rem] items-center gap-[1.2rem] rounded-full border border-white/30 bg-white/10 px-[2.8rem] font-gotham text-[1.4rem] uppercase tracking-[0.15rem] text-white transition-colors hover:border-white/60 hover:bg-white/20"
                >
                  Call {CONTACT.phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="inline-flex h-[5.2rem] items-center gap-[1.2rem] rounded-full bg-gradient-to-r from-brand-cyan to-brand-navy px-[2.8rem] font-gotham text-[1.4rem] uppercase tracking-[0.15rem] text-white shadow-lg transition-transform hover:-translate-y-[0.2rem]"
                >
                  Request Free Estimate
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/30 px-[2.4rem] py-[1.6rem] text-[1.3rem] text-white/50">
          <div className="flex items-center gap-[1.6rem]">
            <span>
              <kbd className="rounded border border-white/20 bg-white/10 px-[0.6rem] py-[0.2rem] font-mono text-[1.1rem]">
                ↑
              </kbd>{" "}
              <kbd className="rounded border border-white/20 bg-white/10 px-[0.6rem] py-[0.2rem] font-mono text-[1.1rem]">
                ↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="rounded border border-white/20 bg-white/10 px-[0.6rem] py-[0.2rem] font-mono text-[1.1rem]">
                ↵
              </kbd>{" "}
              to select
            </span>
            <span>
              <kbd className="rounded border border-white/20 bg-white/10 px-[0.6rem] py-[0.2rem] font-mono text-[1.1rem]">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>

          <span className="font-gotham text-[1.1rem] uppercase tracking-[0.2rem] text-white/40">
            Alfa Septic Search
          </span>
        </div>
      </div>
    </div>
  );
}
