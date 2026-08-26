import { motion } from "framer-motion";
import {
  Rocket,
  ShieldCheck,
  Award,
  Tags,
  RefreshCw,
  Eye,
  Briefcase,
  HardHat,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import PageHero from "../../components/portfolio-componets/site/PageHero";
import CTAStrip from "../../components/portfolio-componets/site/CTAStrip";

const ICONS = {
  Rocket,
  ShieldCheck,
  Award,
  Tags,
  RefreshCw,
  Eye,
  Briefcase,
  HardHat,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof ICONS;

interface Advantage {
  icon: IconName;
  title: string;
  desc: string;
}

const ADVANTAGES: Advantage[] = [
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

export default function WhyChooseUs(): React.JSX.Element {
  return (
    <>
      <PageHero
        index="04"
        kicker="Why Choose Us"
        title="Benefits, Not Buzzwords"
        subtitle="Hard advantages that keep your project on schedule and your workforce reliable."
        tone="light"
      />

      {/* =========================================================
          ADVANTAGES
      ========================================================= */}
      <section className="relative overflow-visible border-y border-slate-200 bg-slate-50 text-slate-900 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)]">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* Ambient background */}
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-slate-200/60 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          {/* Section introduction */}
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-600">
              Our Advantages
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why Businesses Choose Us
            </h2>

            <div className="mt-5 h-px w-20 bg-amber-500" />

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
              We combine speed, reliability and professional workforce
              management to help contractors keep their operations moving.
            </p>
          </div>

          {/* Advantage cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((a, i) => {
              const Icon = ICONS[a.icon] ?? ShieldCheck;

              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.06,
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-900 hover:text-slate-100 hover:shadow-2xl hover:shadow-slate-900/15"
                >
                  {/* Hover accent */}
                  <div className="absolute left-0 top-0 h-1 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />

                  {/* Large background number */}
                  <span className="pointer-events-none absolute -right-2 -top-5 font-display text-8xl font-bold text-slate-100 transition-colors duration-300 group-hover:text-slate-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon + number */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 group-hover:border-slate-700 group-hover:bg-slate-800">
                      <Icon className="h-6 w-6 text-amber-500" />
                    </div>

                    <span className="font-mono text-[10px] tracking-[0.2em] text-slate-400 group-hover:text-slate-600">
                      ADVANTAGE
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="relative mt-6 font-display text-base font-bold uppercase leading-tight tracking-wide text-slate-900 transition-colors duration-300 group-hover:text-slate-100">
                    {a.title}
                  </h3>

                  {/* Description */}
                  <p className="relative mt-3 text-sm leading-6 text-slate-500 transition-colors duration-300 group-hover:text-slate-400">
                    {a.desc}
                  </p>

                  {/* Bottom separator */}
                  <div className="relative mt-7 h-px w-full bg-slate-100 transition-colors duration-300 group-hover:bg-slate-800" />

                  {/* Bottom label */}
                  <div className="relative mt-4 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-500">
                      AFRIC TECH SOLUTIONS
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom shadow extension */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 translate-y-full bg-slate-950/20 blur-xl" />
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <div className="border-t border-slate-800 bg-slate-950">
        <CTAStrip
          title="Experience the Difference"
          subtitle="Deploy a workforce that's vetted, supervised, and ready."
        />
      </div>
    </>
  );
}
