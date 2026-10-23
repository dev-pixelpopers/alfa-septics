"use server";

import { Resend } from "resend";
import { type ContactErrors, readContactForm, validateContact } from "@/lib/contact";
import { buildContactEmail } from "@/lib/contact-email";
import { CONTACT } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  errors?: ContactErrors;
  message?: string;
};

/**
 * Receives a contact request and emails it to the team through Resend (see .env.example).
 * Without RESEND_API_KEY, development accepts the request without sending it anywhere;
 * production reports a clear error instead of pretending the message was delivered.
 */
export async function submitContactRequest(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const data = readContactForm(formData);
  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please check the highlighted fields." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("Contact form: RESEND_API_KEY is not set.");
      return {
        status: "error",
        message: `We couldn't send your request online right now. Please call us at ${CONTACT.phoneDisplay}.`,
      };
    }
    console.warn("Contact form: RESEND_API_KEY is not set, so this request was not emailed.");
    return { status: "success" };
  }

  const { subject, text, html } = buildContactEmail(data);
  const { error } = await new Resend(apiKey).emails
    .send({
      from: process.env.CONTACT_FROM_EMAIL || "Alfa Septics Website <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || CONTACT.email,
      replyTo: data.email.trim() || undefined,
      subject,
      text,
      html,
    })
    .catch((thrown: unknown) => ({ error: thrown }));

  if (error) {
    console.error("Contact form: email could not be sent.", error);
    return {
      status: "error",
      message: `Something went wrong sending your request. Please try again or call ${CONTACT.phoneDisplay}.`,
    };
  }
  return { status: "success" };
}
