import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Contract Pricing — Alfa Septic",
  description:
    "Septic maintenance contracts from $47/mo, with septic pumping from $650. Licensed septic service across Southeast Texas.",
};

export default function PricingPage() {
  return (
    <main className="relative">
      <PricingView />
    </main>
  );
}
