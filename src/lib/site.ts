// Shared site content used by the homepage, contact page, header and footer.

export const CONTACT = {
  phoneDisplay: "+1 (832) 998-2541",
  phoneHref: "tel:+1(832)998-2541",
  email: "alfaseptics@gmail.com",
  region: "Southeast Texas",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Services Areas", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

const photo = (name: string) => `/assets/images/projects/${name}.jpeg`;

export const SERVICES = [
  {
    slug: "installation",
    title: "Septic Installation",
    body: "Conventional and aerobic systems installed to TCEQ standards, from excavation to final hookup.",
    image: photo("tank-in-excavation-crew"),
    alt: "Crew setting a concrete septic tank in a freshly dug excavation",
  },
  {
    slug: "repairs",
    title: "Servicing and Repairs",
    body: "Fast diagnostics and repairs for alarms, pumps, aerators, and failing components.",
    image: photo("technician-servicing-riser"),
    alt: "Technician working on a green septic riser on top of a concrete tank",
  },
  {
    slug: "maintenance",
    title: "Maintenance Contract",
    body: "Scheduled inspections and upkeep that keep your system compliant and running clean.",
    image: photo("aerobic-system-complete"),
    alt: "Completed aerobic septic system with access lids and piping",
  },
  {
    slug: "pumping",
    title: "Septic Tank Pumping",
    body: "Routine and emergency pumping to protect your tank, drain field, and property.",
    image: photo("tank-pit-risers-pipe"),
    alt: "Open septic tank with access risers and outlet piping in an excavation",
  },
  {
    slug: "design",
    title: "Septic Design Services",
    body: "Site-specific system designs built around your soil, layout, and county requirements.",
    image: photo("tank-lids-excavator"),
    alt: "Septic tank layout with access lids beside a mini excavator",
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

export const projectPhoto = photo;

export const sitePrepPhoto = (name: string) => `/assets/images/site-preparation/${name}.jpeg`;
