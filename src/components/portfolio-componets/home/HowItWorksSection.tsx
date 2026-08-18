import React from "react";
import { motion } from "framer-motion";
import type { JSX } from "react";

import SectionHeading from "../site/SectionHeading";

interface Step {
  no: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    no: "01",
    title: "Tell Us Your Need",
    desc: "Share your manpower requirement, category and volume.",
  },
  {
    no: "02",
    title: "We Select Workers",
    desc: "We screen and match suitable, verified personnel.",
  },
  {
    no: "03",
    title: "Workers Deployed",
    desc: "Personnel mobilised to your site, ready to work.",
  },
  {
    no: "04",
    title: "Project Completed",
    desc: "Your project delivered on time with full support.",
  },
];

const HowItWorksSection: React.FC = (): JSX.Element => {
  return (
    <section className="bg-titanium text-onyx">
      <div className="mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <SectionHeading index="05" kicker="Process" title="How It Works" />

        <div className="mt-12 grid gap-px bg-onyx/10 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.no}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              className="group relative bg-titanium p-7"
            >
              <span className="font-display text-6xl text-onyx/10 transition-colors group-hover:text-amber">
                {step.no}
              </span>

              <h3 className="mt-3 font-display text-lg uppercase">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-steel">{step.desc}</p>

              {index < STEPS.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden text-2xl text-amber md:block">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
