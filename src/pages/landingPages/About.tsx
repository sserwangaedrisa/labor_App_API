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
    <div className="bg-slate-950 text-slate-200">
      <PageHero
        index="01"
        kicker="About Us"
        title="The Human Infrastructure"
        subtitle="We treat the workforce not as a commodity, but as the kinetic energy driving the Emirates' skyline."
        tone="light"
      />

      {/* =========================================================
          STORY
      ========================================================= */}
      <section className="relative overflow-hidden border-t border-slate-800 bg-slate-50 text-slate-900">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-slate-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-slate-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-[120rem] items-center gap-14 px-5 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
          {/* Image */}
          <div className="relative lg:col-span-7">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-300 bg-slate-200 p-2 shadow-2xl shadow-slate-900/10">
              <div className="aspect-[16/10] overflow-hidden rounded-xl">
                <Image
                  src={IMAGES.about}
                  alt="AFRIC TECH SOLUTIONS workforce"
                  className="h-full w-full transition duration-700 group-hover:scale-105"
                  objectFit="fill"
                />
              </div>

              {/* Image overlay */}
              <div className="pointer-events-none absolute inset-2 rounded-xl bg-gradient-to-tr from-slate-950/20 via-transparent to-white/10" />
            </div>

            {/* Founded card */}
            <div className="absolute -bottom-7 -right-3 hidden w-64 rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl shadow-slate-950/30 sm:block lg:-right-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="h-2 w-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/40" />

                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  Established
                </span>
              </div>

              <p className="font-display text-4xl font-bold tracking-tight"></p>

              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400">
                Found in the UAE
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-5 lg:pl-8">
            <SectionHeading index="02" kicker="Our Story" title="Who We Are" />

            <div className="mt-7 space-y-5">
              <p className="text-lg leading-8 text-slate-700">
                {COMPANY.fullName} is a UAE-based manpower supply company built
                to help contractors and businesses meet project deadlines by
                providing reliable, experienced, and ready-to-work personnel.
              </p>

              <p className="leading-7 text-slate-600">
                From short-term deployments to long-term contracts, we deliver
                flexible workforce solutions across construction, warehouses,
                cleaning, facility management, logistics and industrial sectors
                — with a focus on discipline, safety and speed.
              </p>
            </div>

            {/* Small information cards */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                <p className="font-display text-xl font-bold text-slate-900">
                  Reliable
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Workforce delivery
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                <p className="font-display text-xl font-bold text-slate-900">
                  Flexible
                </p>
                <p className="mt-1 text-xs text-slate-500">Short & long-term</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MISSION / VISION
      ========================================================= */}
      <section className="relative z-10 border-y border-slate-800 bg-slate-700/80 text-slate-100 shadow-[0_-10px_10px_-10px_rgba(10,10,10,1),0_10px_0px_-10px_rgba(10,10,10,1)]">
        {" "}
        <div className="absolute inset-0 girder-lines opacity-30" />
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-slate-700/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-slate-800/30 blur-3xl" />
        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
              What Drives Us
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-100 md:text-4xl">
              Built Around Purpose
            </h2>

            <div className="mt-4 h-px w-20 bg-amber-500/70" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {MISSION_VISION.map((block) => {
              const Icon = block.icon;

              return (
                <motion.div
                  key={block.t}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/20 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900 hover:shadow-2xl hover:shadow-black/30 lg:p-10"
                >
                  {/* Accent line */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-slate-700 transition group-hover:bg-amber-500" />

                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 shadow-inner shadow-black/20">
                    <Icon className="h-7 w-7 text-amber-400" />
                  </div>

                  <h3 className="mt-7 font-display text-2xl font-bold uppercase tracking-wide text-slate-100">
                    {block.t}
                  </h3>

                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
                    {block.d}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-8 h-px w-full bg-slate-800" />

                  <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    AFRIC TECH SOLUTIONS
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          VALUES
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-100 text-slate-900">
        {/* Subtle pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:40px_40px]" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHeading index="03" kicker="Principles" title="Core Values" />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.45,
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10"
              >
                {/* Top accent */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />

                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                  <Gem className="h-5 w-5 text-slate-700 transition group-hover:text-amber-500" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-wide text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {value.desc}
                </p>

                <div className="mt-6 h-px w-full bg-slate-100 transition group-hover:bg-slate-200" />

                <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
                  Principle 0{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          COMPANY ADVANTAGES / TIMELINE
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-900/90 text-slate-100">
        <div className="absolute inset-0 girder-lines opacity-20" />

        {/* Background lighting */}
        <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-slate-800/90 blur-3xl" />

        <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            index="04"
            kicker="Journey"
            title="Company Advantages"
            tone="light"
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((timeline, index) => (
              <motion.div
                key={timeline.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-7 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900 hover:shadow-2xl hover:shadow-black/30"
              >
                {/* Number background */}
                <span className="pointer-events-none absolute -right-3 -top-5 font-display text-8xl font-bold text-slate-800/40 transition group-hover:text-slate-800/70">
                  {index + 1}
                </span>

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-amber-500" />

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      Milestone
                    </span>
                  </div>

                  <span className="mt-5 block font-display text-4xl font-bold tracking-tight text-amber-400">
                    {}
                  </span>

                  <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-slate-100">
                    {timeline.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {timeline.desc}
                  </p>

                  <div className="mt-7 h-px w-full bg-slate-800" />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
                      Workforce
                    </span>

                    <span className="h-2 w-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="border-t border-slate-800 bg-slate-900">
        <CTAStrip subtitle="Partner with a manpower supplier that delivers on its promises." />
      </div>
    </div>
  );
};

export default About;
