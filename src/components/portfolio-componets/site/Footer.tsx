import React from "react";
import { type JSX } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

import { COMPANY, NAV_LINKS, SERVICE_CATEGORIES } from "../../../lib/siteData";
import { openRequestModal } from "../../../lib/requestModal";

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden">
        <span className="font-display translate-y-[20%] whitespace-nowrap text-[18vw] uppercase leading-none text-white/[0.05]">
          {COMPANY.name}
        </span>
      </div>

      <div className="relative mx-auto max-w-[120rem] px-5 pb-10 pt-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-gradient-to-br from-blue-500 to-cyan-500 font-display text-lg text-white">
                A
              </span>

              <span className="font-display text-sm uppercase text-slate-100">
                {COMPANY.name}
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm text-slate-400">
              UAE-based manpower supply company delivering skilled and unskilled
              workforce for construction, warehouses, cleaning, facility
              management and industrial projects across the Emirates.
            </p>

            <button
              type="button"
              onClick={openRequestModal}
              className="mechanical-hover mt-6 inline-flex items-center gap-2 border border-blue-500/20 bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_0_#1e3a8a]"
            >
              Request Manpower
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
              Quick Links
            </h4>

            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
              Services
            </h4>

            <ul className="mt-5 space-y-3">
              {SERVICE_CATEGORIES.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services"
                    className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
              Contact
            </h4>

            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span>{COMPANY.office}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-cyan-400" />
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="hover:text-cyan-300"
                >
                  {COMPANY.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-cyan-400" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="break-all hover:text-cyan-300"
                >
                  {COMPANY.email}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span>{COMPANY.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-slate-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {COMPANY.fullName}. All rights
            reserved.
          </p>

          <div className="flex gap-6 text-xs text-slate-400">
            <Link to="/contact" className="hover:text-cyan-300">
              Privacy Policy
            </Link>

            <Link to="/contact" className="hover:text-cyan-300">
              Terms
            </Link>
            <a
              href="https://portifolio-three-smoky.vercel.app/"
              className="hover:text-cyan-300 text-sm"
            >
              Design & Developed by: Sserwanga Edirisa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
