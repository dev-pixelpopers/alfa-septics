import { Resend } from "resend";
import { type ContactRequest } from "@/lib/contact";
import { buildContactEmail } from "@/lib/contact-email";
import { CONTACT } from "@/lib/site";

export type SendEmailOptions = {
  to?: string | string[];
  from?: string;
  replyTo?: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

export type SendEmailResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

/** Get the configured sender email from environment or default */
export function getFromEmail(): string {
  const fromEnv = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!fromEnv) {
    return "Alfa Septics Website <onboarding@resend.dev>";
  }
  if (fromEnv.includes("<") && fromEnv.includes(">")) {
    return fromEnv;
  }
  return `Alfa Septics Website <${fromEnv}>`;
}

/** Get the configured recipient email from environment or site fallback */
export function getToEmail(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || CONTACT.email || "alfaseptics@gmail.com";
}

/**
 * Reusable utility to send an email using Resend.
 * Retrieves API key and default addresses from environment variables (.env.local).
 */
export async function sendEmail({
  to,
  from,
  replyTo,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = to || getToEmail();
  const fromAddress = from || getFromEmail();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("Resend API key is not configured (RESEND_API_KEY missing).");
      return {
        success: false,
        error: `We couldn't send your email right now. Please call us at ${CONTACT.phoneDisplay}.`,
      };
    }
    console.warn("Resend API key is not set. Email delivery was simulated.");
    return { success: true, data: { id: "simulated-delivery" } };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo,
      subject,
      text: text || "",
      html: html || undefined,
    });

    if (error) {
      console.error("Resend API error:", error);
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to send email via Resend.";
      return {
        success: false,
        error: message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (thrown: unknown) {
    console.error("Unexpected error in sendEmail:", thrown);
    return {
      success: false,
      error:
        thrown instanceof Error
          ? thrown.message
          : `Something went wrong sending your request. Please call us at ${CONTACT.phoneDisplay}.`,
    };
  }
}

/**
 * High-level reusable function to format and send a contact request email.
 */
export async function sendContactEmail(data: ContactRequest): Promise<SendEmailResult> {
  const { subject, text, html } = buildContactEmail(data);
  const replyTo = data.email?.trim() || undefined;

  return sendEmail({
    subject,
    text,
    html,
    replyTo,
  });
}
