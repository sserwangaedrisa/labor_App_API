import React from "react";
import type { JSX } from "react";
import { motion } from "framer-motion";

import { Image } from "../ui/image.tsx";
import { COMPANY, IMAGES } from "../../../lib/siteData";
import SectionHeading from "../site/SectionHeading";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  {
    value: "48h",
    label: "Deployment",
  },
  {
    value: "100+",
    label: "Workers",
  },
  {
    value: "6",
    label: "Sectors",
  },
];

const IntroSection: React.FC = (): JSX.Element => {
  return (
    <section className="relative bg-titanium text-onyx">
      <div className="mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Text Content */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <SectionHeading
              index="01"
              kicker="Who We Are"
              title="Built to Power Your Projects"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mt-6 text-lg text-steel"
            >
              {COMPANY.fullName} is a UAE-based manpower supply company
              committed to helping contractors and businesses meet project
              deadlines by providing reliable, experienced, and ready-to-work
              personnel. Whether you require workers for short-term projects or
              long-term contracts, our team delivers flexible manpower solutions
              tailored to your operational needs.
            </motion.p>

            {/* Statistics */}
            <dl className="mt-8 grid grid-cols-3 gap-px bg-onyx/10">
              {STATS.map((stat: Stat) => (
                <div key={stat.label} className="bg-titanium p-4">
                  <dt className="font-display text-3xl text-onyx">
                    {stat.value}
                  </dt>

                  <dd className="font-mono text-[11px] uppercase tracking-wider text-steel">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <div className="relative aspect-[4/3]">
              <Image
                src={IMAGES.intro}
                alt="Construction workers collaborating on a UAE site"
                className="h-full w-full"
                objectFit="fill"
              />
            </div>

            {/* Image Label */}
            <div className="absolute -bottom-5 -left-5 hidden max-w-[14rem] bg-amber p-5 text-onyx sm:block">
              <p className="font-display text-sm uppercase leading-tight">
                The Human Infrastructure
              </p>

              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-onyx/70">
                Workforce = kinetic energy
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
