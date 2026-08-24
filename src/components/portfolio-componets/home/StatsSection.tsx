import type { JSX } from "react";
import { STATS } from "../../../lib/siteData";
import AnimatedCounter from "../site/AnimatedCounter";
import SectionHeading from "../site/SectionHeading";

const StatsSection = (): JSX.Element => {
  return (
    <section className="relative overflow-hidden bg-amber text-onyx px-5 py-20 lg:px-10 lg:py-10">
      {/* Ambient glow overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_85%_70%,rgba(255,191,0,0.2),transparent_45%)]" />
      <SectionHeading title="Our stats" tone="light" />

      <div className="relative mx-auto max-w-fit px-5 py-5 lg:px-10 lg:py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/30 bg-white p-7 text-center shadow-lg shadow-amber/10 transition-all duration-300 hover:-translate-y-1 hover:border-amber/50 hover:shadow-xl hover:shadow-amber/20 lg:p-8"
            >
              {/* Decorative corner accents */}
              <span className="absolute left-3 top-3 font-mono text-[10px] text-amber/40 transition-colors group-hover:text-onyx/40">
                +
              </span>
              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-amber/40 transition-colors group-hover:text-onyx/40">
                °
              </span>

              <div className="font-display text-5xl leading-none text-amber transition-colors duration-300 group-hover:text-onyx lg:text-6xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>

              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-onyx/70 transition-colors duration-300 group-hover:text-onyx">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
