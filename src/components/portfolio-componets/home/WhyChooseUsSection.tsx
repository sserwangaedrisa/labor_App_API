import { motion } from "framer-motion";
import type { JSX } from "react";
import {
  ShieldCheck,
  Rocket,
  RefreshCw,
  Clock,
  Users,
  Tags,
  MapPin,
  Smile,
  type LucideIcon,
} from "lucide-react";

import SectionHeading from "../site/SectionHeading";

interface WhyChooseUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ITEMS: WhyChooseUsItem[] = [
  {
    icon: Users,
    title: "Skilled Workforce",
    description:
      "Vetted, trained professionals who integrate seamlessly with your operations and standards.",
  },
  {
    icon: Rocket,
    title: "Fast Deployment",
    description:
      "Teams mobilised within 24–48 hours, minimising downtime and keeping projects on track.",
  },
  {
    icon: RefreshCw,
    title: "Flexible Contracts",
    description:
      "Scale your workforce up or down with commercial terms tailored to your project scope.",
  },
  {
    icon: Clock,
    title: "Short & Long-Term",
    description:
      "From urgent one-day assignments to multi-year outsourcing partnerships — we cover it all.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Team",
    description:
      "Background-checked staff with proven attendance records, accountability, and on-site discipline.",
  },
  {
    icon: Tags,
    title: "Competitive Pricing",
    description:
      "Transparent rates with no hidden costs, optimised to deliver maximum value for your budget.",
  },
  {
    icon: MapPin,
    title: "UAE-Based Company",
    description:
      "Local market knowledge, full legal compliance, and nationwide coverage across the Emirates.",
  },
  {
    icon: Smile,
    title: "Customer Satisfaction",
    description:
      "Dedicated account managers and continuous performance reviews ensure long-term success.",
  },
];

const WhyChooseUsSection = (): JSX.Element => {
  return (
    <section className="relative overflow-hidden bg-onyx text-titanium">
      {/* Base texture */}
      <div className="absolute inset-0 girder-lines" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(203, 203, 201, 0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(241, 240, 238, 0.1),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(211, 208, 197, 0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <SectionHeading title="Why Choose Us" tone="light" />

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col items-start gap-5 rounded-2xl border border-white/15 bg-white/[0.08] p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-colors duration-300 hover:border-amber/60 hover:bg-amber hover:text-onyx md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber/25 bg-amber/15 text-amber transition-colors duration-300 group-hover:border-onyx/20 group-hover:bg-onyx/10 group-hover:text-onyx">
                  <Icon className="h-6 w-6" />
                </div>

                <span className="font-bold text-sm uppercase leading-tight tracking-wide text-orange-500/50 transition-colors duration-300 group-hover:text-onyx">
                  {item.title}
                </span>

                <p className="text-sm leading-relaxed text-titanium/70 transition-colors duration-300 group-hover:text-onyx/75">
                  {item.description}
                </p>

                <span className="absolute right-5 top-5 font-mono text-[10px] tracking-widest text-titanium/40 transition-colors duration-300 group-hover:text-onyx/60">
                  0{index + 1}
                </span>

                <div className="mt-auto h-0.5 w-8 rounded-full bg-amber transition-all duration-300 group-hover:w-full group-hover:bg-onyx/20" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
