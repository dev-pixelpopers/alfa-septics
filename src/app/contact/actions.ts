"use server";

import { type ContactErrors, readContactForm, validateContact } from "@/lib/contact";
import { CONTACT } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  errors?: ContactErrors;
  message?: string;
};

/**
 * Receives a contact request. Delivery goes to CONTACT_WEBHOOK_URL (e.g. a Zapier/Make
 * hook, CRM or email service endpoint) as JSON. Without it, development accepts the
 * request without sending it anywhere; production reports a clear error instead of
 * pretending the message was delivered.
 */
export async function submitContactRequest(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const data = readContactForm(formData);
  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please check the highlighted fields." };
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      return {
        status: "error",
        message: `We couldn't send your request online right now. Please call us at ${CONTACT.phoneDisplay}.`,
      };
    }
    return { status: "success" };
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, submittedAt: new Date().toISOString(), source: "website-contact" }),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: `Something went wrong sending your request. Please try again or call ${CONTACT.phoneDisplay}.`,
    };
  }
}
