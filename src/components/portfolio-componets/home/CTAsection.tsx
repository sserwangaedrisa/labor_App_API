import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { RequestButton } from "../site/Button";

const CTASection: React.FC = (): JSX.Element => {
  return (
    <section className="relative bg-white/20 text-titanium overflow-hidden">
      {/* ─── Animated gradient mesh background ─── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-30%] left-[-20%] h-[70rem] w-[70rem] rounded-full bg-amber/10 blur-[160px] animate-pulse-slow" />
        <div className="absolute bottom-[-30%] right-[-20%] h-[60rem] w-[60rem] rounded-full bg-amber/5 blur-[140px] animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] w-[50rem] rounded-full bg-amber/5 blur-[120px]" />
      </div>

      {/* ─── Subtle grid overlay ─── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* ─── Floating decorative shapes ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-12 right-12 h-24 w-24 rounded-full border border-amber/20 bg-amber/5 blur-sm hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-20 left-12 h-16 w-16 rounded-full border border-amber/20 bg-amber/5 blur-sm hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
        className="absolute top-1/3 left-1/4 h-10 w-10 rounded-full border border-amber/10 bg-amber/5 blur-sm hidden lg:block"
      />

      {/* ─── Subtle top accent line ─── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="relative mx-auto max-w-[120rem] px-5 lg:px-10 py-10 lg:py-10 text-center">
        {/* ─── Badge ─── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-5 py-1.5 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white/10" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber/80">
            Ready When You Are
          </span>
        </motion.div>

        {/* ─── Heading ─── */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-6 font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl uppercase leading-[0.9] tracking-tight"
        >
          Need Workers
          <br />
          <span className="relative inline-block text-amber">
            Immediately?
            <span className="absolute -bottom-2 left-0 right-0 h-1 w-full rounded-full bg-gradient-to-r from-amber/0 via-amber/40 to-amber/0 blur-sm" />
          </span>
        </motion.h2>

        {/* ─── Description ─── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-titanium/60 leading-relaxed"
        >
          Get manpower deployed quickly anywhere in the UAE — skilled, vetted,
          and ready to work.
        </motion.p>

        {/* ─── CTA Button ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex justify-center"
        >
          <RequestButton label="Request Manpower" />
        </motion.div>

        {/* ─── Trust indicator ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-titanium/40 font-mono tracking-widest uppercase"
        >
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-amber/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Verified Talent
          </span>
          <span className="hidden sm:inline text-titanium/20">•</span>
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-amber/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            24hr Deployment
          </span>
          <span className="hidden sm:inline text-titanium/20">•</span>
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-amber/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            UAE-Wide
          </span>
        </motion.div>
      </div>

      {/* ─── Bottom accent line ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

      <style>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes pulse-slower {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.08); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
          }
          .animate-pulse-slower {
            animation: pulse-slower 12s ease-in-out infinite;
          }
        `}</style>
    </section>
  );
};

export default CTASection;
