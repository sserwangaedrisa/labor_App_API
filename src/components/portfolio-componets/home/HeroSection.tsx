import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Image } from "../ui/image";
import { COMPANY, IMAGES } from "../../../lib/siteData";
import Button, { RequestButton } from "../site/Button";

const HeroSection: React.FC = (): JSX.Element => {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-slate-900 text-slate-100">
      <div className="absolute inset-0">
        <Image
          src={IMAGES.hero}
          alt="UAE construction site at dusk with workers in high-visibility gear"
          objectFit="fill"
          className="h-full w-full object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent" />

        <div className="absolute inset-0 girder-lines" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[120rem] items-end px-5 pb-16 pt-32 lg:px-10">
        <div className="w-full lg:max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="font-mono text-xs text-cyan-300">UAE</span>

            <span className="h-px w-10 bg-cyan-300" />

            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
              Manpower Supply · {COMPANY.fullName}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="mt-5 font-display text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl"
          >
            Reliable Manpower
            <br />
            Supply Across
            <br />
            <span className="text-cyan-300">the UAE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.25,
            }}
            className="mt-7 max-w-xl text-lg text-slate-300"
          >
            {COMPANY.fullName} provides skilled and unskilled manpower for
            construction, warehouses, cleaning, facility management, logistics
            and industrial projects across the United Arab Emirates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <RequestButton label="Request Manpower" />

            <Button to="/contact" variant="ghostLight">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 right-5 hidden items-end gap-4 pb-8 md:flex lg:right-10">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 [writing-mode:vertical-rl] rotate-180">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
