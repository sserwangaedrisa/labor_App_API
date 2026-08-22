import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { JSX } from "react";

import { SERVICE_CATEGORIES } from "../../../lib/siteData";
import SectionHeading from "../site/SectionHeading";

const ServicesOverview = (): JSX.Element => {
  return (
    <section className="relative overflow-hidden bg-slate-400 text-slate-100">
      <div className="absolute inset-0 girder-lines" />

      <div className="relative mx-auto max-w-[120rem] px-5 py-20 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="02"
            kicker="Services"
            title="The Talent Inventory"
            tone="light"
          />

          <Link
            to="/services"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-300"
          >
            All Services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-px bg-slate-400 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_CATEGORIES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: "-60px",
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
              className="group relative mr-2 rounded  bg-slate-500 p-6 transition-colors duration-300 hover:bg-slate-600 hover:text-white lg:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300 group-hover:text-white/70">
                  {service.code}
                </span>

                <span className="font-mono text-xs text-slate-500 group-hover:text-white/50">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl uppercase leading-tight">
                {service.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400 group-hover:text-white/80">
                {service.desc}
              </p>

              <ul className="mt-5 space-y-1.5">
                {service.roles.map((role) => (
                  <li
                    key={role}
                    className="flex items-center gap-2 font-mono text-xs text-slate-300 group-hover:text-white/90"
                  >
                    <span className="h-1 w-1 bg-cyan-300 group-hover:bg-white" />
                    {role}
                  </li>
                ))}
              </ul>

              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-300 group-hover:text-white"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
