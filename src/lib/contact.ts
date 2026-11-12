// Contact request shape + validation, shared by the client form and the server action.

export const PROPERTY_TYPES = ["Residential", "Commercial", "New Construction"] as const;
export const TIMELINES = ["As soon as possible", "Within 1–3 months", "Just planning"] as const;
export const CONTACT_METHODS = ["Call", "Text", "Email"] as const;
export const NOT_SURE = "not-sure";

export type ContactRequest = {
  services: string[];
  propertyType: string;
  timeline: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactMethod: string;
  message: string;
  bedrooms?: string;
  bathrooms?: string;
  county?: string;
};

export type ContactField = keyof ContactRequest;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const MESSAGE_LIMIT = 1000;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const phoneDigits = (value: string) => value.replace(/\D/g, "");

/** "7732334278" → "(773) 233-4278" while typing. */
export function formatPhone(value: string) {
  const d = phoneDigits(value).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function validateContact(data: ContactRequest): ContactErrors {
  const errors: ContactErrors = {};
  if (data.services.length === 0) errors.services = "Pick at least one option so we know where to start.";
  if (!data.firstName.trim()) errors.firstName = "Please tell us your first name.";

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = "That email doesn't look quite right.";
  }

  const hasPhone = phoneDigits(data.phone).length > 0;
  if (hasPhone && phoneDigits(data.phone).length !== 10) errors.phone = "Enter a 10-digit phone number.";
  if ((data.contactMethod === "Call" || data.contactMethod === "Text") && !hasPhone) {
    errors.phone = `Add a phone number, or choose email.`;
  }
  if (data.message.length > MESSAGE_LIMIT) errors.message = `Keep it under ${MESSAGE_LIMIT} characters.`;
  return errors;
}

export function readContactForm(formData: FormData): ContactRequest {
  const text = (key: string) => String(formData.get(key) ?? "").slice(0, 2000);
  return {
    services: formData.getAll("services").map(String).slice(0, 10),
    propertyType: text("propertyType"),
    timeline: text("timeline"),
    firstName: text("firstName"),
    lastName: text("lastName"),
    phone: text("phone"),
    email: text("email"),
    contactMethod: text("contactMethod"),
    message: text("message"),
    bedrooms: text("bedrooms"),
    bathrooms: text("bathrooms"),
    county: text("county"),
  };
}
