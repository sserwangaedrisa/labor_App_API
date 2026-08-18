import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type JSX } from "react";

import SectionHeading from "./SectionHeading";

interface PageHeroProps {
  index: string;
  kicker: string;
  title: string;
  subtitle?: string;
  tone?: "light" | "dark";
}

const PageHero: React.FC<PageHeroProps> = ({
  index,
  kicker,
  title,
  subtitle,
  tone = "dark",
}): JSX.Element => {
  const isLight = tone === "light";

  return (
    <section
      className={`relative overflow-hidden ${
        isLight ? "bg-onyx text-titanium" : "bg-titanium text-onyx"
      }`}
    >
      {isLight && <div className="absolute inset-0 girder-lines" />}

      <div className="relative mx-auto max-w-[120rem] px-5 pb-20 pt-36 lg:px-10 lg:pb-28 lg:pt-44">
        <SectionHeading
          index={index}
          kicker={kicker}
          title={title}
          tone={tone}
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className={`mt-6 max-w-2xl text-lg ${
              isLight ? "text-titanium/70" : "text-steel"
            }`}
          >
            {subtitle}
          </motion.p>
        )}

        <div className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber">
          <Link
            to="/"
            className={isLight ? "hover:text-titanium" : "hover:text-onyx"}
          >
            Home
          </Link>

          <ArrowRight className="h-3 w-3" />

          <span className={isLight ? "text-titanium/60" : "text-steel"}>
            {kicker}
          </span>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
