import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { RequestButton } from "../site/Button";

const CTASection: React.FC = (): JSX.Element => {
  return (
    <section className="relative bg-onyx text-titanium overflow-hidden">
      <div className="absolute inset-0 girder-lines" />

      <div className="relative mx-auto max-w-[120rem] px-5 lg:px-10 py-24 lg:py-36 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-amber"
        >
          Ready When You Are
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.95]"
        >
          Need Workers
          <br />
          <span className="text-amber">Immediately?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-6 mx-auto max-w-xl text-lg text-titanium/70"
        >
          Get manpower deployed quickly anywhere in the UAE — skilled, vetted,
          and ready to work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-9 flex justify-center"
        >
          <RequestButton label="Request Manpower" />
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
