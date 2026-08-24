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
        tone="dark"
      />

      <section className="bg-onyx text-titanium">
        <div className="mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          {/* Section intro */}
          <div className="mb-16 max-w-3xl lg:mb-24">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber">
              Workforce Capabilities
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              The right people for
              <span className="text-steel"> every operation.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-steel sm:text-lg">
              From skilled tradesmen to general labour and warehouse operators,
              we provide dependable manpower solutions built around your project
              requirements.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-5 lg:space-y-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.code}
                id={s.code}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border border-white/[0.08]
            bg-white/30
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-amber/30
            hover:bg-white/2
            hover:shadow-2xl
            hover:shadow-black/20
            lg:p-10
          "
              >
                {/* Amber accent line */}
                <div
                  className="
              absolute
              left-0
              top-0
              h-full
              w-1
              bg-amber/30
              transition-all
              duration-300
              group-hover:bg-amber
            "
                />

                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  {/* Left */}
                  <div className="lg:col-span-4">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="h-px w-8 bg-amber/60" />

                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
                        {s.code}
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-tight text-slate-500 sm:text-3xl">
                      {s.title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-steel">
                      {s.desc}
                    </p>

                    <div className="mt-6 hidden lg:block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel/60">
                        0{i + 1} / 0{SERVICES.length}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="lg:col-span-8 bg-white/50 rounded-xl p-6 lg:p-8">
                    <div className="grid gap-x-8 sm:grid-cols-2">
                      {s.roles.map((r) => (
                        <div
                          key={r}
                          className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-white/[0.06]
                      py-3
                      text-sm
                      text-titanium/90
                      transition-colors
                      hover:text-white
                    "
                        >
                          <span
                            className="
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-amber/30
                        bg-amber/5
                      "
                          >
                            <Check className="h-3 w-3 text-amber" />
                          </span>

                          <span>{r}</span>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div className="mt-8 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-steel">
                        <span className="text-amber">Ideal projects</span>

                        <span className="mx-2 text-steel/30">/</span>

                        {s.projects}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTAStrip
        title="Need a Specific Trade?"
        subtitle="Tell us the role and we'll deploy the right people."
      />
    </>
  );
}
