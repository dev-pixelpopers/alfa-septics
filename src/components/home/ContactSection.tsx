"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { type ContactState, submitContactRequest } from "@/app/contact/actions";
import { NOT_SURE, formatPhone } from "@/lib/contact";

const FIELDS = [
  { name: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", type: "text", autoComplete: "family-name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "message", label: "Message", type: "text", autoComplete: "off" },
] as const;

/** Variant42 → Variant43 ("Contact us for") — a quick callback form; the full form lives on /contact. */
export function ContactSection() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContactRequest, { status: "idle" });
  const [phone, setPhone] = useState("");
  const errors = state.status === "error" ? (state.errors ?? {}) : {};

  return (
    <section id="contact" className="flex h-[98.3rem] justify-center bg-snow pt-[15.9rem] max-sm:h-auto max-sm:px-[16px] max-sm:py-[48px]">
      <div className="flex h-[71.7rem] w-[160.6rem] flex-col items-center bg-brand-navy pt-[5.8rem] max-sm:h-auto max-sm:w-full max-sm:px-[20px] max-sm:py-[32px]">
        <h2 className="font-display text-[16.5rem] font-black uppercase leading-[0.941] tracking-[-1.155rem] text-white max-sm:text-[clamp(32px,11vw,46px)] max-sm:tracking-[-0.04em]">
          Contact us
        </h2>

        {state.status === "success" ? (
          <div className="mt-[11rem] flex flex-col items-center text-center text-white max-sm:mt-[24px]" role="status">
            <p className="text-[3.2rem] max-sm:w-auto! max-sm:text-[18px]! max-sm:leading-[1.4]!">
              Thanks — we&apos;ve got your request and will call you back.
            </p>
            <Link
              href="/contact"
              className="mt-[3rem] text-[2rem] text-frost underline underline-offset-[0.5rem] max-sm:mt-[16px] max-sm:text-[14px] max-sm:underline-offset-[4px]"
            >
              Want to add project details? Use the full contact form →
            </Link>
          </div>
        ) : (
          <form
            action={formAction}
            noValidate
            className="mt-[11rem] grid w-[140rem] grid-cols-2 gap-x-[10.8rem] gap-y-[8.4rem] max-sm:mt-[28px] max-sm:w-full max-sm:grid-cols-1 max-sm:gap-y-[30px]"
          >
            <input type="hidden" name="services" value={NOT_SURE} />
            <input type="hidden" name="contactMethod" value="Call" />
            {FIELDS.map((field) => {
              const error = errors[field.name];
              return (
                <label key={field.name} className="relative flex flex-col">
                  <span className="text-[2rem] leading-[0.849] text-frost max-sm:text-[14px] max-sm:leading-none">{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(error)}
                    {...(field.name === "phone"
                      ? { value: phone, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPhone(formatPhone(e.target.value)) }
                      : {})}
                    className={`mt-[0.5rem] h-[3rem] border-b bg-transparent text-[2rem] text-white outline-none transition-colors focus:border-white max-sm:mt-[6px] max-sm:h-[36px] max-sm:text-[16px] ${
                      error ? "border-[#ff9b8f]" : "border-white/60"
                    }`}
                  />
                  {error && (
                    <span className="absolute top-full mt-[0.8rem] text-[1.5rem] text-[#ffb3aa] max-sm:mt-[4px] max-sm:text-[12px]">
                      {error}
                    </span>
                  )}
                </label>
              );
            })}
            <div className="flex items-center gap-[3rem] max-sm:mt-[6px] max-sm:flex-col max-sm:items-stretch max-sm:gap-[12px]">
              <button
                type="submit"
                disabled={pending}
                className="w-fit bg-white px-[4.4rem] py-[2.5rem] text-[2rem] leading-[1.4] tracking-[0.1rem] text-black transition-colors hover:bg-frost disabled:opacity-70 max-sm:w-full max-sm:px-[20px] max-sm:py-[14px] max-sm:text-[15px]"
              >
                {pending ? "Sending…" : "Request a Callback →"}
              </button>
              {state.status === "error" && state.message && !Object.keys(errors).length && (
                <p className="text-[1.6rem] text-[#ffb3aa] max-sm:w-auto! max-sm:text-[13px]!" aria-live="polite">
                  {state.message}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
