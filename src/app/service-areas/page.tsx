import type { Metadata } from "next";
import { ServiceAreasView } from "@/components/service-areas/ServiceAreasView";

export const metadata: Metadata = {
  title: "Service Areas — Alfa Septic",
  description:
    "Septic installation, repairs, pumping, maintenance, and design across Southeast Texas. Check whether Alfa Septic serves your town or county.",
};

export default function ServiceAreasPage() {
  return (
    <main className="relative">
      <ServiceAreasView />
    </main>
  );
}
