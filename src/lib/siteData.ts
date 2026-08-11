// constants.ts

// ==============================
// Company
// ==============================

export const COMPANY = {
  name: "AFRIC TECH SOLUTIONS",
  fullName: "AFRIC TECH SOLUTIONS FZC LLC",
  tagline: "Manpower Supply Across the UAE",
  phone: "+971 50 123 4567",
  phoneRaw: "+971501234567",
  whatsapp: "971501234567",
  email: "info@africtechsolutions.ae",
  office: "Hamriyah Free Zone, Sharjah, United Arab Emirates",
  hours: "Sat –Thu: 8:00 AM – 7:00 PM",
  mapQuery: "Hamriyah Free Zone Sharjah UAE",
} as const;

// ==============================
// Images
// ==============================

export const IMAGES = {
  hero: "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/a173550a8_generated_272c2e14.png",
  intro:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/cbace4eb7_generated_3165e590.png",
  about:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/9870abddc_generated_5a5b93b6.png",
  warehouse:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/e2acfda37_generated_879fd1aa.png",
  construction:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/cdb6c6f28_generated_100c0897.png",
  cleaning:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/a52e4fffc_generated_e69e7498.png",
  tools:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/fa96c32cb_generated_e14f8ec2.png",
  facility:
    "https://media.base44.com/images/public/6a74b6191509fc1fc53033b0/fa272f292_generated_af2fde8e.png",
} as const;

// ==============================
// Interfaces
// ==============================

export interface NavLink {
  label: string;
  to: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  code: string;
  desc: string;
  roles: string[];
}

export interface Industry {
  icon: string;
  name: string;
  note: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Advantage {
  icon: string;
  title: string;
  desc: string;
}

export interface Value {
  title: string;
  desc: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// ==============================
// Navigation
// ==============================

export const NAV_LINKS: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Why Choose Us", to: "/why-choose-us" },
  { label: "Projects & Partners", to: "/projects" },
  { label: "Contact Us", to: "/contact" },
];

// ==============================
// Services
// ==============================

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "skilled",
    title: "Skilled Manpower",
    code: "SKL-01",
    desc: "Certified tradesmen for construction and finishing works across the UAE.",
    roles: [
      "Mason",
      "Carpenter",
      "Steel Fixer",
      "Painter",
      "Electrician",
      "Plumber",
      "Tile Fixer",
      "Gypsum Carpenter",
    ],
  },
  {
    id: "helpers",
    title: "General Helpers",
    code: "HLP-02",
    desc: "Dependable labour to keep construction and warehouse sites moving.",
    roles: [
      "Construction Helpers",
      "Warehouse Helpers",
      "Loading & Unloading",
      "Packing Staff",
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning Services",
    code: "CLN-03",
    desc: "Trained housekeeping and cleaning crews for any facility scale.",
    roles: [
      "Housekeeping",
      "Office Cleaning",
      "Industrial Cleaning",
      "Site Cleaning",
    ],
  },
  {
    id: "warehouse",
    title: "Warehouse Operations",
    code: "WRH-04",
    desc: "Operational staff optimised for inventory and dispatch throughput.",
    roles: ["Pickers", "Packers", "Inventory Helpers", "Forklift Assistants"],
  },
];

// ==============================
// Industries
// ==============================

export const INDUSTRIES: Industry[] = [
  {
    icon: "🏗",
    name: "Construction",
    note: "Towers · Infrastructure · Residential",
  },
  {
    icon: "🏢",
    name: "Facility Management",
    note: "Maintenance · Support Staff",
  },
  {
    icon: "🏭",
    name: "Manufacturing",
    note: "Production · Machine Helpers",
  },
  {
    icon: "📦",
    name: "Warehousing",
    note: "Inventory · Packing · Sorting",
  },
  {
    icon: "🚚",
    name: "Logistics",
    note: "Loading · Dispatch · Drivers",
  },
  {
    icon: "🧹",
    name: "Cleaning Services",
    note: "Hotels · Offices · Hospitals",
  },
];

// ==============================
// Stats
// ==============================

export const STATS: Stat[] = [
  {
    value: 100,
    suffix: "+",
    label: "Workers Available",
  },
  {
    value: 25,
    suffix: "+",
    label: "Projects Supported",
  },
  {
    value: 15,
    suffix: "+",
    label: "Business Clients",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Support",
  },
];

// ==============================
// Advantages
// ==============================

export const ADVANTAGES: Advantage[] = [
  {
    icon: "Rocket",
    title: "Fast Worker Deployment",
    desc: "Mobilise verified workers to your site within 48 hours of request.",
  },
  {
    icon: "ShieldCheck",
    title: "Reliable Workforce",
    desc: "Vetted, disciplined personnel who show up and deliver.",
  },
  {
    icon: "Award",
    title: "Experienced Staff",
    desc: "Tradesmen with proven site experience across the Emirates.",
  },
  {
    icon: "Tags",
    title: "Competitive Rates",
    desc: "Transparent, market-aligned pricing with no hidden charges.",
  },
  {
    icon: "RefreshCw",
    title: "Flexible Contracts",
    desc: "Part-time, full-time, project-based or emergency supply.",
  },
  {
    icon: "Eye",
    title: "Quality Supervision",
    desc: "On-site supervisors ensuring standards and productivity.",
  },
  {
    icon: "Briefcase",
    title: "Professional Management",
    desc: "Dedicated account handling from request to deployment.",
  },
  {
    icon: "HardHat",
    title: "Health & Safety Focus",
    desc: "Compliant, safety-trained workforce and PPE provision.",
  },
];

// ==============================
// Values
// ==============================

export const VALUES: Value[] = [
  {
    title: "Integrity",
    desc: "Honest dealings and transparent commitments.",
  },
  {
    title: "Professionalism",
    desc: "Standards-driven conduct on every site.",
  },
  {
    title: "Safety",
    desc: "Zero-compromise approach to worker and site safety.",
  },
  {
    title: "Reliability",
    desc: "Dependable supply, on time, every time.",
  },
  {
    title: "Customer Satisfaction",
    desc: "Solutions shaped around your operational needs.",
  },
  {
    title: "Excellence",
    desc: "Continuous improvement in workforce quality.",
  },
];

// ==============================
// Timeline
// ==============================

export const TIMELINE: TimelineItem[] = [
  {
    year: "2020",
    title: "Founded",
    desc: "Established in the UAE to serve a manpower-hungry market.",
  },
  {
    year: "2021",
    title: "Growth",
    desc: "Scaled skilled tradesmen pool and first major contractor contracts.",
  },
  {
    year: "2023",
    title: "Expansion",
    desc: "Added warehouse, cleaning and facility management divisions.",
  },
  {
    year: "2026",
    title: "Future",
    desc: "Becoming one of the UAE's most trusted manpower suppliers.",
  },
];

// ==============================
// Testimonials
// ==============================

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "AFRIC TECH deployed 30 masons and steel fixers within two days. They kept our tower project on schedule.",
    author: "Site Manager",
    role: "Main Contractor, Dubai",
  },
  {
    quote:
      "Their warehouse helpers are consistent and well-supervised. Inventory throughput improved noticeably.",
    author: "Operations Lead",
    role: "Logistics Firm, Jebel Ali",
  },
  {
    quote:
      "Professional cleaning teams for our offices and common areas. Reliable and discreet.",
    author: "Facilities Director",
    role: "Facility Management Co., Sharjah",
  },
];
