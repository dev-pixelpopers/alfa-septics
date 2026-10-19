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
    <section id="contact" className="flex h-[98.3rem] justify-center bg-snow pt-[15.9rem]">
      <div className="flex h-[71.7rem] w-[160.6rem] flex-col items-center bg-brand-navy pt-[5.8rem]">
        <h2 className="font-display text-[16.5rem] font-black uppercase leading-[0.941] tracking-[-1.155rem] text-white">
          Contact us
        </h2>

        {state.status === "success" ? (
          <div className="mt-[11rem] flex flex-col items-center text-center text-white" role="status">
            <p className="text-[3.2rem]">Thanks — we&apos;ve got your request and will call you back.</p>
            <Link href="/contact" className="mt-[3rem] text-[2rem] text-frost underline underline-offset-[0.5rem]">
              Want to add project details? Use the full contact form →
            </Link>
          </div>
        ) : (
          <form action={formAction} noValidate className="mt-[11rem] grid w-[140rem] grid-cols-2 gap-x-[10.8rem] gap-y-[8.4rem]">
            <input type="hidden" name="services" value={NOT_SURE} />
            <input type="hidden" name="contactMethod" value="Call" />
            {FIELDS.map((field) => {
              const error = errors[field.name];
              return (
                <label key={field.name} className="relative flex flex-col">
                  <span className="text-[2rem] leading-[0.849] text-frost">{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(error)}
                    {...(field.name === "phone"
                      ? { value: phone, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPhone(formatPhone(e.target.value)) }
                      : {})}
                    className={`mt-[0.5rem] h-[3rem] border-b bg-transparent text-[2rem] text-white outline-none transition-colors focus:border-white ${
                      error ? "border-[#ff9b8f]" : "border-white/60"
                    }`}
                  />
                  {error && <span className="absolute top-full mt-[0.8rem] text-[1.5rem] text-[#ffb3aa]">{error}</span>}
                </label>
              );
            })}
            <div className="flex items-center gap-[3rem]">
              <button
                type="submit"
                disabled={pending}
                className="w-fit bg-white px-[4.4rem] py-[2.5rem] text-[2rem] leading-[1.4] tracking-[0.1rem] text-black transition-colors hover:bg-frost disabled:opacity-70"
              >
                {pending ? "Sending…" : "Request a Callback →"}
              </button>
              {state.status === "error" && state.message && !Object.keys(errors).length && (
                <p className="text-[1.6rem] text-[#ffb3aa]" aria-live="polite">
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
