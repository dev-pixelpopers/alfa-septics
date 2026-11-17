"use server";

import { type ContactState, readContactForm, validateContact } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";
import { CONTACT } from "@/lib/site";

export type { ContactState };

/**
 * Receives a contact request and emails it to the team over SMTP (Nodemailer) using the reusable email lib.
 */
export async function submitContactRequest(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const data = readContactForm(formData);
  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, message: "Please check the highlighted fields." };
  }

  const result = await sendContactEmail(data);

  if (!result.success) {
    console.error("Contact form action: email could not be sent.", result.error);
    return {
      status: "error",
      message:
        result.error ||
        `Something went wrong sending your request. Please try again or call ${CONTACT.phoneDisplay}.`,
    };
  }

  return { status: "success" };
}
