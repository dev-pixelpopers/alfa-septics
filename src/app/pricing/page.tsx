import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/PricingView";
import { PUMPING_PRICE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contract Pricing — Alfa Septic",
  description:
    `Septic maintenance contracts from $47/mo, with septic pumping from $${PUMPING_PRICE}. Licensed septic service across Southeast Texas.`,
};

export default function PricingPage() {
  return (
    <main className="relative">
      <PricingView />
    </main>
  );
}
