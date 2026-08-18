import { motion } from "framer-motion";
import { Check } from "lucide-react";
import PageHero from "../../components/portfolio-componets/site/PageHero";
import SectionHeading from "../../components/portfolio-componets/site/SectionHeading";
import CTAStrip from "../../components/portfolio-componets/site/CTAStrip";

interface Service {
  code: string;
  title: string;
  desc: string;
  roles: string[];
  projects: string;
}

const SERVICES: Service[] = [
  {
    code: "SKL-01",
    title: "Skilled Manpower Supply",
    desc: "Certified tradesmen for construction and finishing works, delivered with site-ready discipline.",
    roles: [
      "Masons",
      "Carpenters",
      "Steel Fixers",
      "Painters",
      "Electricians",
      "Plumbers",
      "Gypsum Installers",
      "Tile Fixers",
      "Scaffolders",
    ],
    projects: "Towers, villas, commercial fit-outs, infrastructure.",
  },
  {
    code: "HLP-02",
    title: "General Helpers",
    desc: "Dependable labour to keep construction and warehouse sites moving efficiently.",
    roles: [
      "Construction Helpers",
      "Warehouse Helpers",
      "Loading Staff",
      "Packing Staff",
      "General Labour",
      "Site Helpers",
    ],
    projects: "Site support, material handling, dispatch lines.",
  },
  {
    code: "CLN-03",
    title: "Cleaning Services",
    desc: "Trained housekeeping and cleaning crews for any facility, at any scale.",
    roles: [
      "Office Cleaning",
      "Industrial Cleaning",
      "Commercial Cleaning",
      "Housekeeping",
      "Deep Cleaning",
    ],
    projects: "Hotels, offices, hospitals, residential complexes.",
  },
  {
    code: "WRH-04",
    title: "Warehouse Operations",
    desc: "Operational staff optimised for inventory accuracy and dispatch throughput.",
    roles: [
      "Pickers",
      "Packers",
      "Inventory Staff",
      "Sorters",
      "Loaders",
      "Unloaders",
    ],
    projects: "Fulfilment centres, cold storage, distribution hubs.",
  },
  {
    code: "FLX-05",
    title: "Flexible Hiring",
    desc: "Engagement models that flex with your project cycle and headcount demands.",
    roles: [
      "Part-Time",
      "Full-Time",
      "Contract Staffing",
      "Project-Based",
      "Emergency Manpower",
    ],
    projects: "Seasonal peaks, emergency cover, long-term contracts.",
  },
];

export default function Services(): React.JSX.Element {
  return (
    <>
      <PageHero
        index="02"
        kicker="Services"
        title="Manpower, Engineered"
        subtitle="A full-spectrum workforce inventory — from certified tradesmen to warehouse operators — deployed with speed and supervision."
        tone="light"
      />

      <section className="bg-titanium text-onyx">
        <div className="mx-auto max-w-[120rem] px-5 lg:px-10 py-20 lg:py-28 space-y-16 lg:space-y-24">
          {SERVICES.map((s, i) => (
            <div
              key={s.code}
              id={s.code}
              className="grid gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-4">
                <SectionHeading
                  index={s.code}
                  kicker={`0${i + 1} / 0${SERVICES.length}`}
                  title={s.title}
                />
              </div>

              <div className="lg:col-span-8">
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-lg text-steel"
                >
                  {s.desc}
                </motion.p>

                <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {s.roles.map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-3 border-b border-onyx/10 py-2"
                    >
                      <Check className="h-4 w-4 text-amber shrink-0" />
                      <span className="text-sm font-medium">{r}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 font-mono text-xs uppercase tracking-wider text-steel">
                  <span className="text-amber">Ideal projects:</span>{" "}
                  {s.projects}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTAStrip
        title="Need a Specific Trade?"
        subtitle="Tell us the role and we'll deploy the right people."
      />
    </>
  );
}
