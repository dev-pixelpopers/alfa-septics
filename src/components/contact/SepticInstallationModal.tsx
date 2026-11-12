"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { EASE_REVEAL, gsap, useGSAP } from "@/lib/gsap";
import { SERVICE_AREAS } from "@/lib/site";

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5", "6+"] as const;
type BedroomOption = (typeof BEDROOM_OPTIONS)[number];

const BATHROOM_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "5+"] as const;
type BathroomOption = (typeof BATHROOM_OPTIONS)[number];

// Common Texas counties served by Alfa Septic
const SUGGESTED_COUNTIES = SERVICE_AREAS.map((a) => a.county);

export type InstallationDetails = {
  bedrooms: string;
  bathrooms: string;
  county: string;
};

type SepticInstallationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialBedrooms?: string;
  initialBathrooms?: string;
  initialCounty?: string;
  onSave: (details: InstallationDetails) => void;
  onRemove?: () => void;
};

const emptySubscribe = () => () => {};

export function SepticInstallationModal(props: SepticInstallationModalProps) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!isClient || !props.isOpen) return null;

  return createPortal(
    <SepticInstallationDialog
      onClose={props.onClose}
      initialBedrooms={props.initialBedrooms}
      initialBathrooms={props.initialBathrooms}
      initialCounty={props.initialCounty}
      onSave={props.onSave}
      onRemove={props.onRemove}
    />,
    document.body,
  );
}

function SepticInstallationDialog({
  onClose,
  initialBedrooms = "",
  initialBathrooms = "",
  initialCounty = "",
  onSave,
  onRemove,
}: Omit<SepticInstallationModalProps, "isOpen">) {
  const [bedrooms, setBedrooms] = useState<string>(() => {
    if (initialBedrooms && !BEDROOM_OPTIONS.slice(0, -1).includes(initialBedrooms as BedroomOption)) {
      return "6+";
    }
    return initialBedrooms;
  });

  const [customBedrooms, setCustomBedrooms] = useState<string>(() => {
    if (initialBedrooms && !BEDROOM_OPTIONS.slice(0, -1).includes(initialBedrooms as BedroomOption)) {
      return initialBedrooms.replace(/\D/g, "");
    }
    return "";
  });

  const [bathrooms, setBathrooms] = useState<string>(() => {
    if (initialBathrooms && !BATHROOM_OPTIONS.slice(0, -1).includes(initialBathrooms as BathroomOption)) {
      return "5+";
    }
    return initialBathrooms;
  });

  const [customBathrooms, setCustomBathrooms] = useState<string>(() => {
    if (initialBathrooms && !BATHROOM_OPTIONS.slice(0, -1).includes(initialBathrooms as BathroomOption)) {
      return initialBathrooms;
    }
    return "";
  });

  const [county, setCounty] = useState<string>(() => initialCounty);

  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const countyInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll and listen for Escape key
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

  // Modal entrance animation
  useGSAP(
    () => {
      if (!root.current || !card.current) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.fromTo(
        root.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: reduce ? 0.01 : 0.25, ease: "power2.out" },
      );

      gsap.fromTo(
        card.current,
        { scale: 0.94, y: "2.4rem", autoAlpha: 0 },
        { scale: 1, y: 0, autoAlpha: 1, duration: reduce ? 0.01 : 0.4, ease: EASE_REVEAL },
      );
    },
    { scope: root },
  );

  const handleSave = () => {
    const finalBedrooms = bedrooms === "6+" && customBedrooms.trim() ? customBedrooms.trim() : bedrooms;
    const finalBathrooms = bathrooms === "5+" && customBathrooms.trim() ? customBathrooms.trim() : bathrooms;
    onSave({
      bedrooms: finalBedrooms,
      bathrooms: finalBathrooms,
      county: county.trim(),
    });
    onClose();
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="septic-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-[2rem] sm:p-[4rem]"
    >
      {/* Blurred dark backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 -z-10 bg-[rgba(6,10,28,0.78)] backdrop-blur-[1rem] transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div
        ref={card}
        className="relative flex w-full max-w-[76rem] max-h-[90vh] flex-col overflow-y-auto rounded-[3.2rem] border border-brand-navy/15 bg-white p-[3.6rem] sm:p-[5.2rem] text-brand-navy shadow-[0_4rem_12rem_rgba(44,60,146,0.28)]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-[2.8rem] top-[2.8rem] grid size-[4.8rem] cursor-pointer place-items-center rounded-full border border-brand-navy/15 bg-snow text-brand-navy transition-all duration-200 hover:border-brand-navy/30 hover:bg-mist hover:scale-105"
        >
          <span aria-hidden className="relative block size-[1.6rem]">
            <span className="absolute left-0 top-1/2 h-[0.2rem] w-full -translate-y-1/2 rotate-45 rounded-full bg-brand-navy" />
            <span className="absolute left-0 top-1/2 h-[0.2rem] w-full -translate-y-1/2 -rotate-45 rounded-full bg-brand-navy" />
          </span>
        </button>

        {/* Header */}
        <div className="pr-[4rem]">
          <span className="inline-block rounded-full bg-brand-cyan/10 px-[1.8rem] py-[0.6rem] font-display text-[1.4rem] uppercase tracking-[0.25rem] text-brand-cyan">
            Septic Installation Details
          </span>
          <h2
            id="septic-modal-title"
            className="mt-[1.4rem] font-display text-[3.8rem] sm:text-[4.6rem] uppercase leading-[0.95] tracking-[-0.15rem] text-brand-navy"
          >
            Tell us about your home
          </h2>
          <p className="mt-[1.4rem] text-[1.8rem] leading-[1.5] text-ink-muted">
            In Texas, septic tank capacity and drain field sizing are regulated by TCEQ guidelines based on bedroom
            count, plumbing fixtures, and your local county jurisdiction.
          </p>
        </div>

        {/* Form Body */}
        <div className="mt-[3.6rem] flex flex-col gap-[3.2rem]">
          {/* 1. Bedrooms Count */}
          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-[2rem] font-semibold text-brand-navy">
                Bedrooms <span className="text-[1.5rem] font-normal text-ink-muted">(Primary sizing factor)</span>
              </label>
              {bedrooms && (
                <span className="text-[1.6rem] font-medium text-brand-cyan">
                  {bedrooms === "6+" && customBedrooms ? `${customBedrooms} Bedrooms` : `${bedrooms} ${Number(bedrooms) === 1 ? "Bedroom" : "Bedrooms"}`}
                </span>
              )}
            </div>

            <div className="mt-[1.4rem] flex flex-wrap gap-[1rem]">
              {BEDROOM_OPTIONS.map((num) => {
                const isSelected = bedrooms === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBedrooms(num)}
                    className={`h-[5.2rem] min-w-[5.2rem] cursor-pointer rounded-[1.6rem] border-[0.2rem] px-[2.2rem] text-[2rem] font-medium leading-none transition-all duration-200 ${
                      isSelected
                        ? "border-brand-navy bg-brand-navy text-white shadow-[0_0.8rem_2rem_rgba(44,60,146,0.25)]"
                        : "border-brand-navy/15 bg-snow text-brand-navy hover:border-brand-cyan hover:bg-white"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Custom bedroom input if 6+ */}
            {bedrooms === "6+" && (
              <div className="mt-[1.6rem] flex items-center gap-[1.4rem]">
                <label htmlFor="custom-bedrooms" className="text-[1.6rem] text-ink-muted">
                  Specify total bedrooms:
                </label>
                <input
                  id="custom-bedrooms"
                  type="number"
                  min="6"
                  max="25"
                  placeholder="e.g. 7"
                  value={customBedrooms}
                  onChange={(e) => setCustomBedrooms(e.target.value)}
                  className="h-[4.6rem] w-[10rem] rounded-[1.2rem] border-[0.2rem] border-brand-cyan bg-snow px-[1.6rem] text-[1.8rem] text-brand-navy outline-none focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* 2. Bathrooms Count */}
          <div>
            <div className="flex items-baseline justify-between">
              <label className="text-[2rem] font-semibold text-brand-navy">
                Bathrooms <span className="text-[1.5rem] font-normal text-ink-muted">(Fixture unit calculation)</span>
              </label>
              {bathrooms && (
                <span className="text-[1.6rem] font-medium text-brand-cyan">
                  {bathrooms === "5+" && customBathrooms ? `${customBathrooms} Bathrooms` : `${bathrooms} ${Number(bathrooms) === 1 ? "Bathroom" : "Bathrooms"}`}
                </span>
              )}
            </div>

            <div className="mt-[1.4rem] flex flex-wrap gap-[1rem]">
              {BATHROOM_OPTIONS.map((num) => {
                const isSelected = bathrooms === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBathrooms(num)}
                    className={`h-[5.2rem] min-w-[5.2rem] cursor-pointer rounded-[1.6rem] border-[0.2rem] px-[2.2rem] text-[2rem] font-medium leading-none transition-all duration-200 ${
                      isSelected
                        ? "border-brand-navy bg-brand-navy text-white shadow-[0_0.8rem_2rem_rgba(44,60,146,0.25)]"
                        : "border-brand-navy/15 bg-snow text-brand-navy hover:border-brand-cyan hover:bg-white"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Custom bathroom input if 5+ */}
            {bathrooms === "5+" && (
              <div className="mt-[1.6rem] flex items-center gap-[1.4rem]">
                <label htmlFor="custom-bathrooms" className="text-[1.6rem] text-ink-muted">
                  Specify total bathrooms:
                </label>
                <input
                  id="custom-bathrooms"
                  type="text"
                  placeholder="e.g. 5.5"
                  value={customBathrooms}
                  onChange={(e) => setCustomBathrooms(e.target.value)}
                  className="h-[4.6rem] w-[10rem] rounded-[1.2rem] border-[0.2rem] border-brand-cyan bg-snow px-[1.6rem] text-[1.8rem] text-brand-navy outline-none focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* 3. County Name */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="county-input" className="text-[2rem] font-semibold text-brand-navy">
                County Name <span className="text-[1.5rem] font-normal text-ink-muted">(For local permit &amp; health dept. rules)</span>
              </label>
            </div>

            <div className="relative mt-[1.4rem]">
              <input
                ref={countyInputRef}
                id="county-input"
                type="text"
                list="service-counties"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Liberty, Montgomery, Harris, Fort Bend..."
                className="h-[6.4rem] w-full rounded-[1.8rem] border-[0.2rem] border-brand-navy/20 bg-snow px-[2.4rem] text-[2rem] text-brand-navy outline-none transition-all focus:border-brand-cyan focus:bg-white focus:shadow-[0_0_0_0.4rem_rgba(49,162,202,0.15)]"
              />
              <datalist id="service-counties">
                {SUGGESTED_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c} County
                  </option>
                ))}
              </datalist>
            </div>

            {/* Quick-select chips for popular counties */}
            <div className="mt-[1.4rem]">
              <p className="text-[1.4rem] uppercase tracking-[0.15rem] text-ink-muted">Quick select county:</p>
              <div className="mt-[0.8rem] flex flex-wrap gap-[0.8rem]">
                {SUGGESTED_COUNTIES.map((c) => {
                  const active = county.toLowerCase().trim() === c.toLowerCase();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCounty(c)}
                      className={`cursor-pointer rounded-full border px-[1.6rem] py-[0.6rem] text-[1.5rem] transition-colors ${
                        active
                          ? "border-brand-cyan bg-brand-cyan/15 font-medium text-brand-navy"
                          : "border-brand-navy/15 bg-white text-ink-muted hover:border-brand-cyan hover:text-brand-navy"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-[4.4rem] flex flex-col-reverse sm:flex-row items-center justify-between gap-[2rem] border-t border-brand-navy/10 pt-[3.2rem]">
          <div>
            {onRemove ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                className="text-[1.6rem] text-ink-muted underline decoration-brand-navy/30 underline-offset-[0.4rem] hover:text-[#c0392b] hover:decoration-[#c0392b]"
              >
                Deselect septic installation
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-[1.6rem] text-ink-muted underline decoration-brand-navy/30 underline-offset-[0.4rem] hover:text-brand-navy"
              >
                Skip for now
              </button>
            )}
          </div>

          <div className="flex w-full sm:w-auto items-center justify-end gap-[1.6rem]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-[0.2rem] border-brand-navy/20 px-[2.8rem] py-[1.4rem] text-[1.8rem] text-brand-navy transition-colors hover:border-brand-cyan"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="group inline-flex items-center gap-[1.4rem] rounded-full bg-gradient-to-r from-brand-cyan to-brand-navy px-[3.6rem] py-[1.4rem] text-[1.9rem] font-medium text-white shadow-[0_1.2rem_2.8rem_rgba(44,60,146,0.3)] transition-all duration-300 hover:-translate-y-[0.2rem] hover:shadow-[0_1.6rem_3.6rem_rgba(44,60,146,0.4)]"
            >
              Save details
              <ArrowIcon className="w-[2rem] transition-transform duration-300 group-hover:translate-x-[0.3rem]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
