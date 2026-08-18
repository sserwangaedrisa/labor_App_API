import type { JSX } from "react";
import { STATS } from "../../../lib/siteData";
import AnimatedCounter from "../site/AnimatedCounter";

const StatsSection = (): JSX.Element => {
  return (
    <section className="relative overflow-hidden bg-amber text-onyx">
      <div className="mx-auto max-w-[120rem] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid grid-cols-2 gap-px bg-onyx/15 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="relative bg-amber p-7 text-center">
              <div className="font-display text-5xl leading-none lg:text-6xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>

              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-onyx/70">
                {stat.label}
              </p>

              <span className="absolute left-3 top-3 font-mono text-[10px] text-onyx/30">
                +
              </span>

              <span className="absolute bottom-3 right-3 font-mono text-[10px] text-onyx/30">
                °
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
