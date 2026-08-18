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
}

const ITEMS: WhyChooseUsItem[] = [
  {
    icon: Users,
    title: "Skilled Workforce",
  },
  {
    icon: Rocket,
    title: "Fast Deployment",
  },
  {
    icon: RefreshCw,
    title: "Flexible Contracts",
  },
  {
    icon: Clock,
    title: "Short & Long-Term",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Team",
  },
  {
    icon: Tags,
    title: "Competitive Pricing",
  },
  {
    icon: MapPin,
    title: "UAE-Based Company",
  },
  {
    icon: Smile,
    title: "Customer Satisfaction",
  },
];

const WhyChooseUsSection = (): JSX.Element => {
  return (
    <section className="relative overflow-hidden bg-onyx text-titanium">
      <div className="absolute inset-0 girder-lines" />

      <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <SectionHeading
          index="04"
          kicker="Advantages"
          title="Why Choose Us"
          tone="light"
        />

        <div className="mt-12 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
                className="group flex flex-col items-start gap-4 bg-onyx p-6 transition-colors hover:bg-amber hover:text-onyx"
              >
                <Icon className="h-8 w-8 text-amber group-hover:text-onyx" />

                <span className="font-display text-sm uppercase leading-tight">
                  {item.title}
                </span>

                <span className="font-mono text-[10px] text-titanium/30 group-hover:text-onyx/50">
                  0{index + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
