"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { type ContactState, submitContactRequest } from "@/app/contact/actions";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import {
  CONTACT_METHODS,
  type ContactErrors,
  type ContactField,
  type ContactRequest,
  MESSAGE_LIMIT,
  NOT_SURE,
  PROPERTY_TYPES,
  TIMELINES,
  formatPhone,
  phoneDigits,
  validateContact,
} from "@/lib/contact";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, SERVICES } from "@/lib/site";
import { CheckIcon } from "./icons";

const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ value: s.slug as string, label: s.title as string })),
  { value: NOT_SURE, label: "Not sure yet" },
];

const EMPTY: ContactRequest = {
  services: [],
  propertyType: PROPERTY_TYPES[0],
  timeline: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  contactMethod: CONTACT_METHODS[0],
  message: "",
};

/** Remounts the form on "Send another request" so action state starts clean. */
export function ContactForm({ initialService }: { initialService?: string }) {
  const [round, setRound] = useState(0);
  return <ContactFormBody key={round} initialService={round === 0 ? initialService : undefined} onReset={() => setRound((r) => r + 1)} />;
}

function ContactFormBody({ initialService, onReset }: { initialService?: string; onReset: () => void }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContactRequest, { status: "idle" });
  const [values, setValues] = useState<ContactRequest>(() => ({
    ...EMPTY,
    services: SERVICE_OPTIONS.some((o) => o.value === initialService) ? [initialService!] : [],
  }));
  const [clientErrors, setClientErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});

  const errors: ContactErrors = { ...(state.status === "error" ? state.errors : {}), ...clientErrors };
  const set = <K extends ContactField>(key: K, value: ContactRequest[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-check fields the visitor already interacted with, so errors clear as they type.
    if (touched[key] || clientErrors[key]) setClientErrors(pickErrors(validateContact(next), touched, key));
  };
  const blur = (key: ContactField) => {
    const nextTouched = { ...touched, [key]: true };
    setTouched(nextTouched);
    setClientErrors(pickErrors(validateContact(values), nextTouched));
  };

  const toggleService = (value: string) => {
    const has = values.services.includes(value);
    set("services", has ? values.services.filter((s) => s !== value) : [...values.services, value]);
  };

  // Five things make a complete request; the bar fills as each is done.
  const checks = [
    values.services.length > 0,
    Boolean(values.timeline),
    Boolean(values.firstName.trim()),
    phoneDigits(values.phone).length === 10 || /\S+@\S+\.\S{2,}/.test(values.email),
    Boolean(values.message.trim()),
  ];
  const progress = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  if (state.status === "success") {
    return <SuccessPanel values={values} onReset={onReset} />;
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        const found = validateContact(values);
        if (Object.keys(found).length > 0) {
          event.preventDefault();
          setClientErrors(found);
          setTouched(Object.fromEntries(Object.keys(found).map((k) => [k, true])));
          // Errors render on the next paint, so find the first bad field by name, not aria-invalid.
          const firstKey = Object.keys(found)[0];
          event.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
        }
      }}
      className="flex flex-col gap-[5.6rem]"
    >
      <header>
        <p className="text-[1.8rem] uppercase tracking-[0.4rem] text-brand-cyan">Free estimate</p>
        <h2 className="mt-[1.4rem] font-display text-[5.6rem] uppercase leading-[0.95] tracking-[-0.2rem] text-brand-navy">
          Tell us about your project
        </h2>
        <div className="mt-[3.2rem] flex items-center gap-[2rem]">
          <div
            className="h-[0.8rem] flex-1 overflow-hidden rounded-full bg-mist"
            role="progressbar"
            aria-label="Form completion"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-navy transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(progress, 3)}%` }}
            />
          </div>
          <span className="w-[13rem] text-right text-[1.8rem] tabular-nums text-ink-muted">
            {progress === 100 ? "Ready to send" : `${progress}% done`}
          </span>
        </div>
      </header>

      <Step number={1} title="What do you need?" error={errors.services} errorId="services-error">
        <div className="flex flex-wrap gap-[1.4rem]" role="group" aria-label="Services">
          {SERVICE_OPTIONS.map((option) => {
            const checked = values.services.includes(option.value);
            return (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="services"
                  value={option.value}
                  checked={checked}
                  onChange={() => toggleService(option.value)}
                  onBlur={() => blur("services")}
                  aria-invalid={Boolean(errors.services)}
                  aria-describedby={errors.services ? "services-error" : undefined}
                  className="peer sr-only"
                />
                <span
                  className={`flex items-center gap-[1.2rem] rounded-full border-[0.2rem] px-[2.8rem] py-[1.6rem] text-[2rem] leading-none transition-all duration-300 peer-focus-visible:ring-[0.4rem] peer-focus-visible:ring-brand-cyan/40 ${
                    checked
                      ? "border-brand-navy bg-brand-navy text-white shadow-[0_1rem_2.4rem_rgba(44,60,146,0.3)]"
                      : "border-brand-navy/15 bg-white text-brand-navy hover:-translate-y-[0.2rem] hover:border-brand-cyan"
                  }`}
                >
                  <span
                    className={`grid size-[2.4rem] place-items-center rounded-full transition-all duration-300 ${
                      checked ? "scale-100 bg-brand-cyan" : "scale-90 border-[0.2rem] border-brand-navy/20"
                    }`}
                  >
                    <CheckIcon className={`size-[1.6rem] transition-opacity ${checked ? "opacity-100" : "opacity-0"}`} />
                  </span>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </Step>

      <Step number={2} title="About the property">
        <div className="grid grid-cols-1 gap-[3.2rem]">
          <Segmented
            label="Property type"
            name="propertyType"
            options={PROPERTY_TYPES}
            value={values.propertyType}
            onChange={(v) => set("propertyType", v)}
          />
          <fieldset>
            <legend className="mb-[1.4rem] text-[1.8rem] text-ink-muted">When do you need it?</legend>
            <div className="flex flex-wrap gap-[1rem]">
              {TIMELINES.map((option) => {
                const checked = values.timeline === option;
                return (
                  <label key={option} className="cursor-pointer">
                    <input
                      type="radio"
                      name="timeline"
                      value={option}
                      checked={checked}
                      onChange={() => set("timeline", option)}
                      className="peer sr-only"
                    />
                    <span
                      className={`block rounded-[1.4rem] border-[0.2rem] px-[2rem] py-[1.4rem] text-[1.8rem] leading-none transition-all duration-300 peer-focus-visible:ring-[0.4rem] peer-focus-visible:ring-brand-cyan/40 ${
                        checked
                          ? "border-brand-cyan bg-brand-cyan/10 text-brand-navy"
                          : "border-brand-navy/15 text-ink-muted hover:border-brand-cyan/60"
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </Step>

      <Step number={3} title="How can we reach you?">
        <div className="grid grid-cols-2 gap-x-[2.4rem] gap-y-[2.8rem]">
          <FloatingInput
            name="firstName"
            label="First name"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(v) => set("firstName", v)}
            onBlur={() => blur("firstName")}
            error={errors.firstName}
          />
          <FloatingInput
            name="lastName"
            label="Last name (optional)"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(v) => set("lastName", v)}
          />
          <FloatingInput
            name="phone"
            label="Phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(v) => set("phone", formatPhone(v))}
            onBlur={() => blur("phone")}
            error={errors.phone}
          />
          <FloatingInput
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(v) => set("email", v)}
            onBlur={() => blur("email")}
            error={errors.email}
          />
        </div>
        <div className="mt-[3.2rem]">
          <Segmented
            label="Best way to reach you"
            name="contactMethod"
            options={CONTACT_METHODS}
            value={values.contactMethod}
            onChange={(v) => set("contactMethod", v)}
          />
        </div>
        <div className="mt-[3.2rem]">
          <FloatingInput
            name="message"
            label="Anything else we should know? (optional)"
            multiline
            value={values.message}
            onChange={(v) => set("message", v.slice(0, MESSAGE_LIMIT))}
            error={errors.message}
            hint={`${values.message.length}/${MESSAGE_LIMIT}`}
          />
        </div>
      </Step>

      <div className="flex items-center justify-between gap-[3rem] border-t border-brand-navy/10 pt-[4rem]">
        <p className="text-[1.8rem] leading-[1.5] text-ink-muted">
          Prefer to talk?{" "}
          <a href={CONTACT.phoneHref} className="text-brand-navy underline decoration-brand-cyan underline-offset-[0.4rem]">
            Call {CONTACT.phoneDisplay}
          </a>
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-[7.2rem] shrink-0 items-center gap-[2rem] rounded-full bg-gradient-to-r from-brand-cyan to-brand-navy px-[4.4rem] text-[2.4rem] text-white shadow-[0_1.6rem_3.2rem_rgba(44,60,146,0.35)] transition-all duration-300 hover:-translate-y-[0.3rem] hover:shadow-[0_2rem_4rem_rgba(44,60,146,0.45)] disabled:cursor-wait disabled:opacity-80"
        >
          {pending ? (
            <>
              <span className="size-[2.2rem] animate-spin rounded-full border-[0.3rem] border-white/40 border-t-white" />
              Sending…
            </>
          ) : (
            <>
              Send request
              <ArrowIcon className="w-[2.6rem] transition-transform duration-300 group-hover:-translate-y-[0.3rem] group-hover:translate-x-[0.3rem]" />
            </>
          )}
        </button>
      </div>

      <p aria-live="polite" className={`-mt-[3rem] text-[1.8rem] ${state.status === "error" ? "text-[#c0392b]" : "sr-only"}`}>
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}

/** Show only errors for fields the visitor has touched (plus the one being edited). */
function pickErrors(all: ContactErrors, touched: Partial<Record<ContactField, boolean>>, editing?: ContactField) {
  return Object.fromEntries(
    Object.entries(all).filter(([key]) => touched[key as ContactField] || key === editing),
  ) as ContactErrors;
}

function Step({
  number,
  title,
  error,
  errorId,
  children,
}: {
  number: number;
  title: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-[2.4rem] flex items-center gap-[1.6rem] text-[2.4rem] text-brand-navy">
        <span className="grid size-[4rem] place-items-center rounded-full bg-mist font-display text-[1.8rem] text-brand-navy">
          {number}
        </span>
        {title}
      </h3>
      {children}
      {error && (
        <p id={errorId} className="mt-[1.4rem] text-[1.6rem] text-[#c0392b]">
          {error}
        </p>
      )}
    </section>
  );
}

function Segmented<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: readonly T[];
  value: string;
  onChange: (value: T) => void;
}) {
  const index = Math.max(0, options.indexOf(value as T));
  return (
    <fieldset>
      <legend className="mb-[1.4rem] text-[1.8rem] text-ink-muted">{label}</legend>
      <div className="relative grid rounded-full bg-mist p-[0.6rem]" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {/* Sliding highlight */}
        <span
          aria-hidden
          className="absolute inset-y-[0.6rem] left-[0.6rem] rounded-full bg-white shadow-[0_0.6rem_1.6rem_rgba(44,60,146,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ width: `calc((100% - 1.2rem) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
        />
        {options.map((option) => (
          <label key={option} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={`block whitespace-nowrap rounded-full px-[1.6rem] py-[1.4rem] text-center text-[1.8rem] leading-none transition-colors peer-focus-visible:ring-[0.4rem] peer-focus-visible:ring-brand-cyan/40 ${
                value === option ? "text-brand-navy" : "text-ink-muted hover:text-brand-navy"
              }`}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type FloatingInputProps = {
  name: ContactField;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
  multiline?: boolean;
};

function FloatingInput({ name, label, value, onChange, onBlur, error, hint, multiline, ...rest }: FloatingInputProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    placeholder: " ",
    onBlur,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    className: `peer w-full rounded-[1.6rem] border-[0.2rem] bg-snow px-[2.4rem] pb-[0.8rem] pt-[3.4rem] text-[2.2rem] text-brand-navy outline-none transition-all duration-300 focus:bg-white focus:shadow-[0_0_0_0.5rem_rgba(49,162,202,0.15)] ${
      error ? "border-[#c0392b]/70" : "border-transparent hover:border-brand-navy/10 focus:border-brand-cyan"
    }`,
  };
  return (
    <div>
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={4} className={`${shared.className} resize-none`} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input {...shared} {...rest} className={`${shared.className} h-[7.2rem]`} onChange={(e) => onChange(e.target.value)} />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-[2.6rem] top-[0.9rem] origin-left text-[1.5rem] leading-[1.2] text-ink-muted transition-all duration-300 peer-placeholder-shown:top-[2.4rem] peer-placeholder-shown:text-[2.1rem] peer-focus:top-[0.9rem] peer-focus:text-[1.5rem] peer-focus:text-brand-cyan"
        >
          {label}
        </label>
      </div>
      <div className="mt-[0.8rem] flex justify-between gap-[2rem] text-[1.5rem]">
        <span id={errorId} className="text-[#c0392b]">
          {error}
        </span>
        {hint && <span className="text-ink-soft tabular-nums">{hint}</span>}
      </div>
    </div>
  );
}

function SuccessPanel({ values, onReset }: { values: ContactRequest; onReset: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const chosen = values.services.map((s) => SERVICE_OPTIONS.find((o) => o.value === s)?.label ?? s);

  useEffect(() => {
    root.current?.focus();
  }, []);

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-ring]", { scale: 0, duration: 0.6, ease: "back.out(1.8)" })
        .fromTo("[data-tick]", { strokeDashoffset: 30 }, { strokeDashoffset: 0, duration: 0.5 }, "-=0.2")
        .from("[data-success-item]", { y: "3rem", autoAlpha: 0, stagger: 0.08, duration: 0.6 }, "-=0.2");
    },
    { scope: root },
  );

  return (
    <div ref={root} tabIndex={-1} className="flex flex-col items-center py-[6rem] text-center outline-none" role="status">
      <span data-ring className="grid size-[14rem] place-items-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-navy shadow-[0_2rem_5rem_rgba(44,60,146,0.35)]">
        <svg viewBox="0 0 24 24" className="size-[7rem] text-white" aria-hidden>
          <path
            data-tick
            d="m5 12.5 4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={30}
          />
        </svg>
      </span>
      <h2 data-success-item className="mt-[4.8rem] font-display text-[6rem] uppercase leading-none text-brand-navy">
        Thanks{values.firstName ? `, ${values.firstName}` : ""}!
      </h2>
      <p data-success-item className="mt-[2.4rem] max-w-[64rem] text-[2.2rem] leading-[1.5] text-ink-muted">
        Your request is in. We&apos;ll reach out by {values.contactMethod.toLowerCase()} to talk through your site and next steps.
      </p>
      {chosen.length > 0 && (
        <ul data-success-item className="mt-[3.6rem] flex flex-wrap justify-center gap-[1.2rem]">
          {chosen.map((label) => (
            <li key={label} className="rounded-full bg-mist px-[2.4rem] py-[1.2rem] text-[1.8rem] text-brand-navy">
              {label}
            </li>
          ))}
        </ul>
      )}
      <div data-success-item className="mt-[5.6rem] flex gap-[2rem]">
        <Link
          href="/"
          className="rounded-full bg-brand-navy px-[4rem] py-[2rem] text-[2rem] text-white transition-transform hover:-translate-y-[0.3rem]"
        >
          Back to homepage
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border-[0.2rem] border-brand-navy/20 px-[4rem] py-[2rem] text-[2rem] text-brand-navy transition-colors hover:border-brand-cyan"
        >
          Send another request
        </button>
      </div>
    </div>
  );
}
