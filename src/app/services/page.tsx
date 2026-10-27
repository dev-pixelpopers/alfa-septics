import type { Metadata } from "next";
import { ServicesView } from "@/components/services/ServicesView";

export const metadata: Metadata = {
  title: "Services — Alfa Septic",
  description:
    "Septic installation, servicing and repairs, maintenance contracts, tank pumping, and septic design across Southeast Texas.",
};

export default function ServicesPage() {
  return (
    <main className="relative">
      <ServicesView />
    </main>
  );
}
