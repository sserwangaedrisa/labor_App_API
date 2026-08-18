import { motion } from "framer-motion";
import type { JSX } from "react";
import { Image } from "../../components/portfolio-componets/ui/image";
import { Target, Eye, Gem, type LucideIcon } from "lucide-react";

import { COMPANY, IMAGES, VALUES, TIMELINE } from "../../lib/siteData";

import PageHero from "../../components/portfolio-componets/site/PageHero";
import SectionHeading from "../../components/portfolio-componets/site/SectionHeading";
import CTAStrip from "../../components/portfolio-componets/site/CTAStrip";

interface MissionVision {
  icon: LucideIcon;
  t: string;
  d: string;
}

const MISSION_VISION: MissionVision[] = [
  {
    icon: Target,
    t: "Mission",
    d: "To provide reliable, skilled, and flexible manpower solutions that help businesses complete projects efficiently and on time.",
  },
  {
    icon: Eye,
    t: "Vision",
    d: "To become one of the UAE's most trusted manpower supply companies by delivering quality workforce solutions and exceptional customer service.",
  },
];

const About = (): JSX.Element => {
  return (
    <>
      <PageHero
        index="01"
        kicker="About Us"
        title="The Human Infrastructure"
        subtitle="We treat the workforce not as a commodity, but as the kinetic energy driving the Emirates' skyline."
        tone="light"
      />

      {/* Story */}
      <section className="bg-titanium text-onyx">
        <div className="mx-auto grid max-w-[120rem] items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
          <div className="relative lg:col-span-7">
            <div className="aspect-[16/10]">
              <Image
                src={IMAGES.about}
                alt="AFRIC TECH SOLUTIONS workforce"
                className="h-full w-full"
                objectFit="fill"
              />
            </div>

            <div className="absolute -bottom-5 -right-5 hidden max-w-[16rem] bg-onyx p-5 text-titanium sm:block">
              <p className="font-display text-3xl">2020</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-amber">
                Founded in the UAE
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <SectionHeading index="02" kicker="Our Story" title="Who We Are" />

            <p className="mt-6 text-lg text-steel">
              {COMPANY.fullName} is a UAE-based manpower supply company built to
              help contractors and businesses meet project deadlines by
              providing reliable, experienced, and ready-to-work personnel.
            </p>

            <p className="mt-4 text-steel">
              From short-term deployments to long-term contracts, we deliver
              flexible workforce solutions across construction, warehouses,
              cleaning, facility management, logistics and industrial sectors —
              with a focus on discipline, safety and speed.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="relative overflow-hidden bg-onyx text-titanium">
        <div className="absolute inset-0 girder-lines" />

        <div className="relative mx-auto grid max-w-[120rem] gap-px bg-white/10 px-5 py-20 lg:grid-cols-2 lg:px-10">
          {MISSION_VISION.map((block) => {
            const Icon = block.icon;

            return (
              <div key={block.t} className="bg-onyx p-10">
                <Icon className="h-10 w-10 text-amber" />

                <h3 className="mt-5 font-display text-3xl uppercase">
                  {block.t}
                </h3>

                <p className="mt-3 text-lg text-titanium/70">{block.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="bg-titanium text-onyx">
        <div className="mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHeading index="03" kicker="Principles" title="Core Values" />

          <div className="mt-12 grid gap-px bg-onyx/10 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                }}
                className="border-t-2 border-transparent bg-titanium p-7 hover:border-amber"
              >
                <Gem className="h-7 w-7 text-amber" />

                <h3 className="mt-4 font-display text-lg uppercase">
                  {value.title}
                </h3>

                <p className="mt-2 text-sm text-steel">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden bg-onyx text-titanium">
        <div className="absolute inset-0 girder-lines" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            index="04"
            kicker="Journey"
            title="Company Advantages"
            tone="light"
          />

          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-4">
            {TIMELINE.map((timeline, index) => (
              <motion.div
                key={timeline.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                }}
                className="bg-onyx p-7"
              >
                <span className="font-display text-4xl text-amber">
                  {timeline.year}
                </span>

                <h3 className="mt-3 font-display text-lg uppercase">
                  {timeline.title}
                </h3>

                <p className="mt-2 text-sm text-titanium/60">{timeline.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip subtitle="Partner with a manpower supplier that delivers on its promises." />
    </>
  );
};

export default About;
