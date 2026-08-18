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

      <section className="bg-titanium text-onyx">
        <div className="mx-auto max-w-[120rem] px-5 lg:px-10 py-20 lg:py-28">
          <div className="grid gap-px bg-onyx/10 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((a, i) => {
              const Icon = ICONS[a.icon] ?? ShieldCheck;

              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.06,
                  }}
                  className="group bg-titanium p-7 hover:bg-onyx hover:text-titanium transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-10 w-10 text-amber" />

                    <span className="font-mono text-[11px] text-onyx/20 group-hover:text-titanium/30">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-base uppercase leading-tight">
                    {a.title}
                  </h3>

                  <p className="mt-2 text-sm text-steel group-hover:text-titanium/70">
                    {a.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTAStrip
        title="Experience the Difference"
        subtitle="Deploy a workforce that's vetted, supervised, and ready."
      />
    </>
  );
}
