import React from "react";
import { motion } from "framer-motion";
import type { JSX } from "react";

interface SectionHeadingProps {
  index?: string;
  kicker?: string;
  title: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  kicker,
  title,
  align = "left",
  tone = "dark",
}): JSX.Element => {
  const isLight = tone === "light";

  return (
    <div
      className={`flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <div className="flex items-center gap-3">
        {index && <span className="font-mono text-xs text-amber">{index}</span>}

        {kicker && (
          <span
            className={`font-mono text-xs uppercase tracking-[0.2em] ${
              isLight ? "text-titanium/60" : "text-steel"
            }`}
          >
            {kicker}
          </span>
        )}

        <span className="h-px w-10 bg-amber" />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{
          once: true,
          margin: "-80px",
        }}
        transition={{
          duration: 0.5,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        className={`font-display text-4xl uppercase leading-[0.95] sm:text-5xl lg:text-6xl ${
          isLight ? "text-titanium" : "text-onyx"
        }`}
      >
        {title}
      </motion.h2>
    </div>
  );
};

export default SectionHeading;
