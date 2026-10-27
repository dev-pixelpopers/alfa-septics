import { ContactSection } from "@/components/home/ContactSection";
import { FeaturesScene } from "@/components/home/FeaturesScene";
import { GalleryScene } from "@/components/home/GalleryScene";
import { HeroScene } from "@/components/home/HeroScene";
import { ProcessScene } from "@/components/home/ProcessScene";
import { ReviewsScene } from "@/components/home/ReviewsScene";
import { ServicesScene } from "@/components/home/ServicesScene";

// Figma "Prototype" (203:13): Default → Variant44, one scene per prototype chapter.
export default function Home() {
  return (
    <main>
      <HeroScene />
      <FeaturesScene />
      <ServicesScene />
      <ProcessScene />
      <GalleryScene />
      <ReviewsScene />
      <ContactSection />
    </main>
  );
}
