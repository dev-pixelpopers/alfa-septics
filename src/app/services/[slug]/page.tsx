import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { CONTACT, SERVICES } from "@/lib/site";

// Only the five known services exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

const findService = (slug: string) => SERVICES.find((service) => service.slug === slug);

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = findService((await props.params).slug);
  if (!service) return {};
  return {
    title: `${service.title} — Alfa Septic`,
    description: `${service.body} Serving ${CONTACT.region}.`,
  };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  if (!findService(slug)) notFound();

  return (
    <main className="relative">
      {/* Keyed so moving between services remounts and replays the entrance. */}
      <ServiceDetailView key={slug} slug={slug} />
    </main>
  );
}
