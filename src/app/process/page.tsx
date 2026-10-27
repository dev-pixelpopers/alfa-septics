import type { Metadata } from "next";
import { ProcessView } from "@/components/process/ProcessView";

export const metadata: Metadata = {
  title: "Our Process — Alfa Septic",
  description:
    "How Alfa Septic takes a septic project from site evaluation and engineering through permitting, installation, and county inspection.",
};

export default function ProcessPage() {
  return (
    <main className="relative">
      <ProcessView />
    </main>
  );
}
