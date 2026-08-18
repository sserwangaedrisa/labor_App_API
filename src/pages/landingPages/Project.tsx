import { motion } from "framer-motion";
import { Image } from "../../components/portfolio-componets/ui/image";
import { ArrowUpRight } from "lucide-react";
import { IMAGES } from "../../lib/siteData";
import PageHero from "../../components/portfolio-componets/site/PageHero";
import SectionHeading from "../../components/portfolio-componets/site/SectionHeading";
import CTAStrip from "../../components/portfolio-componets/site/CTAStrip";

interface Project {
  img: string;
  title: string;
  cat: string;
  workers: number;
  status: "Completed" | "Ongoing";
}

interface Story {
  title: string;
  desc: string;
  metric: string;
}

const PROJECTS: Project[] = [
  {
    img: IMAGES.construction,
    title: "Tower Construction Crew",
    cat: "Construction",
    workers: 35,
    status: "Completed",
  },
  {
    img: IMAGES.warehouse,
    title: "Warehouse Operations Team",
    cat: "Warehousing",
    workers: 24,
    status: "Ongoing",
  },
  {
    img: IMAGES.cleaning,
    title: "Corporate Cleaning Contract",
    cat: "Facility Management",
    workers: 18,
    status: "Ongoing",
  },
  {
    img: IMAGES.facility,
    title: "Facility Maintenance Staff",
    cat: "Facility Management",
    workers: 12,
    status: "Completed",
  },
  {
    img: IMAGES.intro,
    title: "Infrastructure Labour Supply",
    cat: "Construction",
    workers: 40,
    status: "Completed",
  },
  {
    img: IMAGES.tools,
    title: "Specialised Trades Deployment",
    cat: "Skilled Manpower",
    workers: 16,
    status: "Ongoing",
  },
];

const PARTNERS: string[] = [
  "AL NAS CONTRACTING",
  "GULF LOGISTICS GROUP",
  "EMIRATES FACILITIES CO.",
  "SHARJAH BUILDERS",
  "DUBAI WAREHOUSE HUB",
  "MERIDIAN FM",
];

const STORIES: Story[] = [
  {
    title: "48-Hour Tower Crew Mobilisation",
    desc: "Deployed 35 masons and steel fixers to a Dubai tower site within two days, keeping the project on schedule.",
    metric: "35 workers · 48h",
  },
  {
    title: "Warehouse Throughput Lift",
    desc: "Steady team of pickers and loaders improved dispatch throughput for a Jebel Ali logistics firm.",
    metric: "+22% throughput",
  },
  {
    title: "Facility Management Partnership",
    desc: "Long-term cleaning and maintenance staff placement for a Sharjah facility management company.",
    metric: "18 staff · 12 months",
  },
];

export default function Projects(): React.JSX.Element {
  return (
    <>
      <PageHero
        index="05"
        kicker="Projects & Partners"
        title="Built. Deployed. Delivered."
        subtitle="A selection of workforce deployments and the partners who trust AFRIC TECH SOLUTIONS to power their operations."
        tone="light"
      />

      {/* Project gallery */}
      <section className="bg-titanium text-onyx">
        <div className="mx-auto max-w-[120rem] px-5 lg:px-10 py-20 lg:py-28">
          <SectionHeading index="01" kicker="Deployments" title="Projects" />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  margin: "-50px",
                }}
                transition={{
                  duration: 0.4,
                  delay: (i % 3) * 0.08,
                }}
                className="group relative overflow-hidden bg-onyx"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                    objectFit="fill"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-titanium">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-amber">
                      {p.cat}
                    </span>

                    <span className="font-mono text-[11px] uppercase tracking-wider text-titanium/60">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg uppercase leading-tight">
                    {p.title}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-titanium/60">
                    {p.workers} workers deployed
                  </p>
                </div>

                <ArrowUpRight className="absolute top-4 right-4 h-6 w-6 text-amber opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-onyx text-titanium relative overflow-hidden">
        <div className="absolute inset-0 girder-lines" />

        <div className="relative mx-auto max-w-[120rem] px-5 lg:px-10 py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber text-center">
            Trusted by partners across the UAE
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="bg-onyx grid place-items-center p-6 text-center"
              >
                <span className="font-display text-xs uppercase tracking-wider text-titanium/60">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section className="bg-titanium text-onyx">
        <div className="mx-auto max-w-[120rem] px-5 lg:px-10 py-20 lg:py-28">
          <SectionHeading index="02" kicker="Results" title="Success Stories" />

          <div className="mt-12 grid gap-px bg-onyx/10 md:grid-cols-3">
            {STORIES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-titanium p-7 flex flex-col"
              >
                <span className="font-display text-3xl text-amber">
                  {s.metric}
                </span>

                <h3 className="mt-4 font-display text-base uppercase leading-tight">
                  {s.title}
                </h3>

                <p className="mt-2 text-sm text-steel">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip
        title="Your Project Next?"
        subtitle="Let's add your deployment to this list."
      />
    </>
  );
}
