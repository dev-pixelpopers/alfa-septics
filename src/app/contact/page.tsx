import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact — Alfa Septic",
  description:
    "Request a free estimate for septic installation, repairs, pumping, maintenance, or design services across Southeast Texas.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // `/contact?service=pumping` preselects a service chip.
  const resolvedParams = await searchParams;
  const service = typeof resolvedParams?.service === "string" ? resolvedParams.service : undefined;

  return (
    <main className="relative inner-page">
      <ContactView initialService={service} />
    </main>
  );
}
