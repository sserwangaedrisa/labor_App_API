import { motion } from "framer-motion";
import { Image } from "../../components/portfolio-componets/ui/image";
import { ArrowUpRight } from "lucide-react";
import { IMAGES } from "../../lib/siteData";

import PageHero from "../../components/portfolio-componets/site/PageHero";
import SectionHeading from "../../components/portfolio-componets/site/SectionHeading";
import CTAStrip from "../../components/portfolio-componets/site/CTAStrip";
import Navbar from "../../components/portfolio-componets/site/Navbar";

interface Project {
  img: string;
  title: string;
  cat: string;
  workers: number;
  status: "Completed" | "Ongoing";
  year: number;
}

interface Story {
  title: string;
  desc: string;
  metric: string;
}

const PROJECTS: Project[] = [
  {
    img: "src/assets/binghatti_elite.webp",
    title: "Elite Binghatti Project",
    cat: "Construction",
    workers: 160,
    status: "Completed",
    year: 2025,
  },
  {
    img: "src/assets/binghatti_flare.avif",
    title: "Binghatti Flare — Business Bay",
    cat: "Construction",
    workers: 80,
    status: "Ongoing",
    year: 2026,
  },
  {
    img: "src/assets/binghatti_grove.jpg",
    title: "Binghatti Grove — Jumeirah",
    cat: "Construction",
    workers: 100,
    status: "Completed",
    year: 2025,
  },
  {
    img: IMAGES.warehouse,
    title: "Warehouse Operations Team",
    cat: "Warehousing",
    workers: 24,
    status: "Ongoing",
    year: 2026,
  },
  {
    img: IMAGES.cleaning,
    title: "Corporate Cleaning Contract",
    cat: "Facility Management",
    workers: 18,
    status: "Ongoing",
    year: 2026,
  },
  {
    img: IMAGES.intro,
    title: "Infrastructure Labour Supply",
    cat: "Construction",
    workers: 40,
    status: "Completed",
    year: 2025,
  },
];

const PARTNERS: string[] = [
  "BINGHATTI",
  "GRANADA EUROPE CONSTRUCTION",
  "SAMANA",
  "MODERN CONSTRUCTION",
  "ABUL TALIQ TECHNICAL L.L.C",
];

const STORIES: Story[] = [
  {
    title: "Elite Binghatti Workforce Deployment",
    desc: "In 2025, we partnered with another manpower supply company to support the Elite Binghatti construction project with a workforce of 160 personnel, including general helpers, masons and carpenters.",
    metric: "160 workers · 2025",
  },
  {
    title: "Binghatti Flare — Business Bay",
    desc: "In 2026, we partnered with another supply company to support the Binghatti Flare project in Business Bay, providing a workforce of 80 people including general helpers, masons and scaffolders.",
    metric: "80 workers · 2026",
  },
  {
    title: "Binghatti Grove — Jumeirah",
    desc: "In 2025, we partnered with Abdul Talic Technical Supply Company to supply more than 100 workers to the Binghatti Grove project in Jumeirah, including helpers, masons and steel fixers.",
    metric: "100+ workers · 2025",
  },
];
export default function Projects(): React.JSX.Element {
  return (
    <>
      <Navbar />

      <PageHero
        index="05"
        kicker="Projects & Partners"
        title="Built. Deployed. Delivered."
        subtitle="A selection of workforce deployments and the partners who trust AFRIC TECH SOLUTIONS to power their operations."
        tone="light"
      />

      {/* =========================================================
          PROJECT GALLERY
      ========================================================= */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-slate-50 text-slate-900 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.3)]">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHeading index="01" kicker="Deployments" title="Projects" />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  duration: 0.5,
                  delay: (i % 3) * 0.08,
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/10 transition-all duration-500 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-900/25"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full scale-100 transition-transform duration-700 group-hover:scale-110"
                    objectFit="fill"
                  />

                  {/* Top status */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-100 backdrop-blur-md">
                      {p.status}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5 text-amber-400" />
                  </div>
                </div>
                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-400">
                      {p.cat}
                    </span>

                    <span className="h-px flex-1 bg-slate-800" />
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-wide text-slate-100">
                    {p.title}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                      Workforce
                    </span>

                    <span className="font-display text-lg font-bold text-slate-300">
                      {p.workers}
                    </span>
                  </div>

                  {/* Hover accent */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500 transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PARTNERS
      ========================================================= */}
      <section className="relative overflow-hidden border-y border-slate-800 bg-slate-950 text-slate-100">
        <div className="absolute inset-0 girder-lines opacity-25" />

        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/3 top-0 h-72 w-72 rounded-full bg-slate-800/30 blur-3xl" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-16 lg:px-10 lg:py-20">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
              Trusted by partners across the UAE
            </p>

            <div className="mx-auto mt-4 h-px w-16 bg-amber-500/70" />
          </div>

          <div className="mt-10 grid overflow-hidden rounded-2xl border border-slate-800 shadow-2xl shadow-black/30 sm:grid-cols-2 lg:grid-cols-5">
            {PARTNERS.map((p, i) => (
              <div
                key={p}
                className="group relative grid min-h-28 place-items-center border-b border-r border-slate-800 bg-slate-900/70 p-6 text-center transition-all duration-300 hover:bg-slate-800"
              >
                {/* Hover indicator */}
                <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-amber-500 transition-all duration-300 group-hover:w-10" />

                <span className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors duration-300 group-hover:text-slate-200">
                  {p}
                </span>

                <span className="absolute right-3 top-3 font-mono text-[8px] text-slate-700">
                  0{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SUCCESS STORIES
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-100 text-slate-900">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHeading index="02" kicker="Results" title="Success Stories" />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STORIES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.45,
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10"
              >
                {/* Top accent */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />

                {/* Metric */}
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl font-bold tracking-tight text-slate-900">
                    {s.metric}
                  </span>

                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
                    0{i + 1}
                  </span>
                </div>

                {/* Separator */}
                <div className="mt-6 h-px bg-slate-100 transition-colors group-hover:bg-slate-200" />

                {/* Title */}
                <h3 className="mt-5 font-display text-base font-bold uppercase leading-tight tracking-wide text-slate-900">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {s.desc}
                </p>

                {/* Bottom indicator */}
                <div className="mt-7 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
                    Deployment Result
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <div className="border-t border-slate-800 bg-slate-950">
        <CTAStrip
          title="Your Project Next?"
          subtitle="Let's add your deployment to this list."
        />
      </div>
    </>
  );
}
