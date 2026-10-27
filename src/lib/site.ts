// Shared site content used by the homepage, contact page, header and footer.

export const CONTACT = {
  phoneDisplay: "+1 (832) 998-2541",
  phoneHref: "tel:+1(832)998-2541",
  email: "alfaseptics@gmail.com",
  region: "Southeast Texas",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Services Areas", href: "/service-areas" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const photo = (name: string) => `/assets/images/projects/${name}.jpeg`;
export const sitePrepPhoto = (name: string) => `/assets/images/site-preparation/${name}.jpeg`;

/** Septic pumping starting price, shared by the pumping service pages and /pricing. */
export const PUMPING_PRICE = 650;

export const SERVICES = [
  {
    slug: "installation",
    title: "Septic Installation",
    body: "Conventional and aerobic systems installed to TCEQ standards, from excavation to final hookup.",
    image: photo("tank-in-excavation-crew"),
    alt: "Crew setting a concrete septic tank in a freshly dug excavation",
    points: [
      "Conventional and aerobic systems",
      "Excavation, tank setting, and drain field or spray installation",
      "Final hookup, ready for county inspection",
    ],
    intro:
      "Whether it's new construction or a replacement for a failing system, we install conventional and aerobic septic systems built to TCEQ standards. Our crew handles everything from the first dig to the final hookup, so one team is accountable for the whole job.",
    signs: [
      "You're building on a lot without sewer service",
      "Your old system is failing or past repair",
      "An addition means you need more capacity",
      "You're buying land and planning what it can support",
    ],
  },
  {
    slug: "repairs",
    title: "Servicing and Repairs",
    body: "Fast diagnostics and repairs for alarms, pumps, aerators, and failing components.",
    image: photo("technician-servicing-riser"),
    alt: "Technician working on a green septic riser on top of a concrete tank",
    points: [
      "Alarm, pump, and aerator troubleshooting",
      "Failed components repaired or replaced",
      "A clear explanation of what went wrong",
    ],
    intro:
      "When an alarm goes off or something doesn't seem right, we track down the cause and fix it. We work on the pumps, aerators, alarms, and components that keep conventional and aerobic systems running.",
    signs: [
      "Your system alarm is sounding",
      "Drains are slow or plumbing gurgles",
      "There are sewage odors in the yard or house",
      "Wet, soggy spots have appeared over the drain field",
    ],
  },
  {
    slug: "maintenance",
    title: "Maintenance Contract",
    body: "Scheduled inspections and upkeep that keep your system compliant and running clean.",
    image: photo("aerobic-system-complete"),
    alt: "Completed aerobic septic system with access lids and piping",
    points: [
      "Routine inspections on a set schedule",
      "Upkeep that keeps aerobic systems compliant",
      "Early warning on parts that need attention",
    ],
    intro:
      "Aerobic systems need regular attention to keep working properly and stay compliant. A maintenance contract puts your system on a schedule, so inspections and upkeep happen on time without you having to remember.",
    signs: [
      "You have an aerobic treatment unit",
      "Your current maintenance contract is ending",
      "You've just bought a home with a septic system",
      "You want problems caught before they get expensive",
    ],
  },
  {
    slug: "pumping",
    title: "Septic Tank Pumping",
    body: "Routine and emergency pumping to protect your tank, drain field, and property.",
    // Starting price, shown like the contract price on /pricing.
    price: { amount: PUMPING_PRICE, unit: "pump-out" },
    image: photo("tank-pit-risers-pipe"),
    alt: "Open septic tank with access risers and outlet piping in an excavation",
    points: [
      "Routine pumping before problems start",
      "Emergency pumping when you need it fast",
      "Tank condition checked while we're there",
    ],
    intro:
      "Solids build up in every septic tank over time. Regular pumping keeps them out of your drain field, protecting the most expensive part of your system, and we can come out fast when it's an emergency.",
    signs: [
      "It's been a few years since your last pumping",
      "Drains are slowing down across the house",
      "Sewage is backing up into fixtures",
      "You're selling or buying a home",
    ],
  },
  {
    slug: "design",
    title: "Septic Design Services",
    body: "Site-specific system designs built around your soil, layout, and county requirements.",
    image: sitePrepPhoto("aerobic-lids-graded-lot"),
    alt: "Aerobic system lids, vents, and control panel laid out across a newly graded lot",
    points: [
      "Designs based on your soil and site evaluation",
      "System sized for your home or building",
      "Plans prepared for county submittal",
    ],
    intro:
      "Every property is different, so every system should be too. We design septic systems around your soil, lot layout, and planned use, and prepare the plans your county needs to issue a permit.",
    signs: [
      "You're planning to build on a new lot",
      "Your site has difficult soil or limited space",
      "Your permit requires a system design",
      "You're upgrading to a larger or different system type",
    ],
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

export const servicePath = (slug: string) => `/services/${slug}`;
/**
 * Counties and towns listed on /service-areas.
 * TODO: placeholder Houston-area list — confirm with the client which areas they actually serve.
 */
export const SERVICE_AREAS = [
  { county: "Harris", towns: ["Houston", "Katy", "Cypress", "Spring", "Humble", "Tomball", "Crosby", "Huffman"] },
  { county: "Montgomery", towns: ["Conroe", "The Woodlands", "Magnolia", "Montgomery", "Willis", "New Caney", "Porter"] },
  { county: "Fort Bend", towns: ["Sugar Land", "Richmond", "Rosenberg", "Fulshear", "Needville"] },
  { county: "Brazoria", towns: ["Pearland", "Alvin", "Angleton", "Manvel", "Lake Jackson"] },
  { county: "Galveston", towns: ["League City", "Dickinson", "Santa Fe", "Hitchcock", "Friendswood"] },
  { county: "Liberty", towns: ["Liberty", "Dayton", "Cleveland", "Hardin"] },
  { county: "Chambers", towns: ["Baytown", "Mont Belvieu", "Anahuac", "Winnie"] },
  { county: "Waller", towns: ["Waller", "Hempstead", "Brookshire", "Prairie View"] },
  { county: "Jefferson", towns: ["Beaumont", "Port Arthur", "Nederland"] },
  { county: "Hardin", towns: ["Lumberton", "Silsbee", "Kountze"] },
  { county: "San Jacinto", towns: ["Coldspring", "Shepherd"] },
  { county: "Walker", towns: ["Huntsville", "New Waverly"] },
] as const;

/** What sets the company apart, shared by the homepage card stack and the /about page. */
export const FEATURES = [
  {
    title: "Licensed Expertise",
    body: "TCEQ Installer II expertise for compliant OSSF installations.",
    icon: { src: "/assets/icons/feature-licensed.png", width: 216, height: 257 },
  },
  {
    title: "Turnkey Service",
    body: "From site evaluation and permitting to installation and inspection.",
    icon: { src: "/assets/icons/feature-turnkey.png", width: 272, height: 271 },
  },
  {
    title: "Clear Communication",
    body: "Straightforward answers, clear expectations, and transparent project guidance.",
    icon: { src: "/assets/icons/feature-communication.png", width: 270, height: 239 },
  },
  {
    title: "Built for the Site",
    body: "Every solution is planned around your property, soil, and project requirements.",
    icon: { src: "/assets/icons/feature-site.png", width: 418, height: 265 },
  },
] as const;

/** The five-step process, shared by the homepage scene and the /process page. */
export const PROCESS_STEPS = [
  {
    slug: "site-evaluation",
    title: "Site Evaluation",
    body: "We assess your property. Soil, layout, access, and site conditions are evaluated.",
    points: [
      "Soil testing to find out what kind of system the ground can support",
      "Lot layout, setbacks, wells, and drainage measured and mapped",
      "Access checked for excavation equipment and tank delivery",
    ],
    image: "/assets/images/process-site-evaluation.png",
    alt: "Surveyor taking level readings on a staked-out lot",
  },
  {
    slug: "engineering",
    title: "Engineering",
    body: "We plan the system. The right septic or utility solution is designed for your site.",
    points: [
      "Conventional or aerobic system matched to your soil and usage",
      "Tank and drain field sized for the home or building it serves",
      "Layout drawn to meet TCEQ and county requirements",
    ],
    image: "/assets/images/process-engineering.png",
    alt: "Engineer drafting a septic system plan at a desk",
  },
  {
    slug: "permitting",
    title: "Permitting",
    body: "We handle the paperwork. Required permits and county requirements are addressed.",
    points: [
      "Permit application prepared and submitted for you",
      "Coordination with the county or permitting authority",
      "Reviewer questions answered so approval keeps moving",
    ],
    image: "/assets/images/process-permitting.png",
    alt: "Approved septic permit held up on site",
  },
  {
    slug: "installation",
    title: "Installation",
    body: "We build it right. Our team handles excavation, installation, and site work.",
    points: [
      "Excavation and tank placement by our own crew",
      "Drain field or spray system installed and connected",
      "Site backfilled and cleaned up when the work is done",
    ],
    image: photo("tank-pit-crew"),
    alt: "Crew setting a concrete septic tank in an excavation",
  },
  {
    slug: "inspection",
    title: "Inspection",
    body: "We finish with confidence. The completed system is prepared for county inspection and final approval.",
    points: [
      "System readied for the county inspector's review",
      "Any inspection notes addressed until it's approved",
      "A walkthrough of how to care for your new system",
    ],
    image: photo("tank-backfilled-risers"),
    alt: "Finished tank risers ready for county inspection",
  },
] as const;

export const projectPhoto = photo;
