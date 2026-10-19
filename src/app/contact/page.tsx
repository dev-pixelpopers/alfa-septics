import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Contact — Alfa Septics",
  description:
    "Request a free estimate for septic installation, repairs, pumping, maintenance, or design services across Southeast Texas.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // `/contact?service=pumping` preselects a service chip.
  const { service } = await searchParams;

  return (
    <main className="relative">
      <SiteHeader current="/contact" />
      <ContactView initialService={typeof service === "string" ? service : undefined} />
      <SiteFooter />
    </main>
  );
}
