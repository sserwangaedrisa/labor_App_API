import React from "react";
import { type JSX } from "react";
import { RequestButton } from "../site/Button";

interface CTAStripProps {
  title?: string;
  subtitle?: string;
}

const CTAStrip: React.FC<CTAStripProps> = ({
  title = "Let's Build Together",
  subtitle,
}): JSX.Element => {
  return (
    <section className="bg-slate-800 text-onyx">
      <div className="mx-auto flex max-w-[120rem] flex-col items-center justify-between gap-6 px-5 py-16 md:flex-row lg:px-10">
        <div>
          <h2 className="font-display text-3xl uppercase leading-tight sm:text-4xl">
            {title}
          </h2>

          {subtitle && <p className="mt-2 max-w-xl text-onyx/70">{subtitle}</p>}
        </div>

        <RequestButton label="Request Manpower" variant="dark" />
      </div>
    </section>
  );
};

export default CTAStrip;
