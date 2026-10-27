import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About — Alfa Septic",
  description:
    "Alfa Septic is a licensed septic and site utility contractor serving homes, businesses, and new construction across Southeast Texas.",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <AboutView />
    </main>
  );
}
