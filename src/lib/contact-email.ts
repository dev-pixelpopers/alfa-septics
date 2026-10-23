// Builds the notification email the team receives for each contact request.

import { type ContactRequest, NOT_SURE } from "@/lib/contact";
import { SERVICES } from "@/lib/site";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const serviceLabel = (slug: string) =>
  slug === NOT_SURE ? "Not sure yet" : (SERVICES.find((s) => s.slug === slug)?.title ?? slug);

export function buildContactEmail(data: ContactRequest) {
  const name = [data.firstName, data.lastName].map((s) => s.trim()).filter(Boolean).join(" ");
  const rows: [string, string][] = [
    ["Name", name],
    ["Phone", data.phone.trim() || "—"],
    ["Email", data.email.trim() || "—"],
    ["Preferred contact", data.contactMethod],
    ["Services", data.services.map(serviceLabel).join(", ")],
    ["Property type", data.propertyType],
    ["Timeline", data.timeline || "—"],
  ];
  const message = data.message.trim();

  const subject = `New estimate request from ${name}`;

  const text = [
    "New estimate request from the website",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message || "—",
  ].join("\n");

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#1d2a6b;max-width:560px">
  <h2 style="margin:0 0 16px">New estimate request</h2>
  <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:15px">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="border-bottom:1px solid #e3e7f3;color:#6b7390;width:160px">${label}</td><td style="border-bottom:1px solid #e3e7f3">${escape(value)}</td></tr>`,
      )
      .join("")}
  </table>
  <h3 style="margin:24px 0 8px">Message</h3>
  <p style="white-space:pre-wrap;font-size:15px;line-height:1.5;margin:0">${message ? escape(message) : "—"}</p>
</div>`.trim();

  return { subject, text, html };
}
