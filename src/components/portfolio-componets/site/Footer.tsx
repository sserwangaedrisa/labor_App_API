import React from "react";
import { type JSX } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

import { COMPANY, NAV_LINKS, SERVICE_CATEGORIES } from "../../../lib/siteData";
import { openRequestModal } from "../../../lib/requestModal";

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className="relative overflow-hidden bg-onyx text-titanium">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden">
        <span className="font-display translate-y-[20%] whitespace-nowrap text-[18vw] uppercase leading-none text-titanium/[0.04]">
          {COMPANY.name}
        </span>
      </div>

      <div className="relative mx-auto max-w-[120rem] px-5 pb-10 pt-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-amber font-display text-lg text-onyx">
                A
              </span>

              <span className="font-display text-sm uppercase">
                {COMPANY.name}
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm text-titanium/60">
              UAE-based manpower supply company delivering skilled and unskilled
              workforce for construction, warehouses, cleaning, facility
              management and industrial projects across the Emirates.
            </p>

            <button
              type="button"
              onClick={openRequestModal}
              className="mechanical-hover mt-6 inline-flex items-center gap-2 border border-onyx/10 bg-amber px-6 py-3 text-xs font-bold uppercase tracking-wider text-onyx shadow-[3px_3px_0_0_hsl(var(--titanium)/0.2)]"
            >
              Request Manpower
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber/80">
              Quick Links
            </h4>

            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-titanium/70 transition-colors hover:text-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber/80">
              Services
            </h4>

            <ul className="mt-5 space-y-3">
              {SERVICE_CATEGORIES.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services"
                    className="text-sm text-titanium/70 transition-colors hover:text-amber"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-amber/80">
              Contact
            </h4>

            <ul className="mt-5 space-y-4 text-sm text-titanium/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <span>{COMPANY.office}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-amber" />
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="hover:text-amber"
                >
                  {COMPANY.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-amber" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="break-all hover:text-amber"
                >
                  {COMPANY.email}
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <span>{COMPANY.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-titanium/50">
            © {new Date().getFullYear()} {COMPANY.fullName}. All rights
            reserved.
          </p>

          <div className="flex gap-6 text-xs text-titanium/50">
            <Link to="/contact" className="hover:text-amber">
              Privacy Policy
            </Link>

            <Link to="/contact" className="hover:text-amber">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
