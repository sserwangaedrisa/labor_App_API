import React from "react";
import { motion } from "framer-motion";
import type { JSX } from "react";

import { INDUSTRIES } from "../../../lib/siteData";
import SectionHeading from "../site/SectionHeading";

const IndustriesSection: React.FC = (): JSX.Element => {
  return (
    <section className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <SectionHeading
          index="03"
          kicker="Sectors"
          title="Industries We Serve"
        />

        <div className="mt-12 grid grid-cols-2 gap-px bg-slate-200 md:grid-cols-3">
          {INDUSTRIES.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
              }}
              className="group border-t-2 border-transparent bg-white p-7 transition-colors hover:border-sky-500"
            >
              <div className="text-4xl">{industry.icon}</div>

              <h3 className="mt-4 font-display text-lg uppercase">
                {industry.name}
              </h3>

              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                {industry.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
