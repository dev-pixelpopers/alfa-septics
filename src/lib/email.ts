import nodemailer, { type Transporter } from "nodemailer";
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

const FRIENDLY_ERROR = `We couldn't send your email right now. Please call us at ${CONTACT.phoneDisplay}.`;

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

/** Read SMTP settings from env. Returns null when credentials are missing. */
function getSmtpConfig(): SmtpConfig | null {
  const user = process.env.SMTP_USER?.trim();
  // Gmail shows app passwords with spaces ("abcd efgh ijkl mnop"); strip them.
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv ? secureEnv === "true" : port === 465;

  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port,
    secure,
    user,
    pass,
  };
}

let cachedTransporter: Transporter | null = null;

function getTransporter(config: SmtpConfig): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return cachedTransporter;
}

/**
 * Get the configured sender. Gmail rewrites the From address to the
 * authenticated account, so default to SMTP_USER.
 */
export function getFromEmail(): string {
  const fromEnv = process.env.CONTACT_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim();
  if (!fromEnv) {
    return "Alfa Septics Website";
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
 * Reusable utility to send an email over SMTP (Gmail by default) with Nodemailer.
 * Reads credentials and default addresses from environment variables.
 */
export async function sendEmail({
  to,
  from,
  replyTo,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<SendEmailResult> {
  const config = getSmtpConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      console.error("SMTP is not configured (SMTP_USER / SMTP_PASS missing).");
      return { success: false, error: FRIENDLY_ERROR };
    }
    console.warn("SMTP credentials are not set. Email delivery was simulated.");
    return { success: true, data: { messageId: "simulated-delivery" } };
  }

  try {
    const info = await getTransporter(config).sendMail({
      from: from || getFromEmail(),
      to: to || getToEmail(),
      replyTo,
      subject,
      text: text || "",
      html: html || undefined,
    });

    return { success: true, data: { messageId: info.messageId } };
  } catch (thrown: unknown) {
    // Don't leak SMTP/server details to the visitor; log them instead.
    console.error("SMTP error in sendEmail:", thrown);
    return { success: false, error: FRIENDLY_ERROR };
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
