import type { Metadata } from "next";
import { Albert_Sans, Manrope, Montserrat, Outfit } from "next/font/google";
import "./globals.css";

// Fallbacks for the licensed Gotham (display) and Nohemi (body) faces.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Alfa Septic — Expert Septic & Site Solutions",
  description:
    "Licensed septic, excavation, and utility services for homes, businesses, and new construction across Southeast Texas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${outfit.variable} ${albertSans.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
