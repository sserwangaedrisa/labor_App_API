import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { type JSX } from "react";

import { COMPANY, NAV_LINKS } from "../../../lib/siteData";
import { RequestButton } from "../site/Button";

const Navbar: React.FC = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-white/10 bg-onyx text-titanium"
            : "bg-transparent text-titanium"
        }`}
      >
        <div className="mx-auto max-w-[120rem] px-5 lg:px-10">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-amber font-display text-lg text-onyx">
                A
              </span>

              <span className="font-display text-sm uppercase leading-none tracking-tight sm:text-base">
                {COMPANY.name}
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const active =
                  location.pathname === link.to ||
                  (link.to !== "/" && location.pathname.startsWith(link.to));

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      active
                        ? "text-amber"
                        : "text-titanium/70 hover:text-titanium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <RequestButton label="Request Manpower" />
              </div>

              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="grid h-11 w-11 place-items-center border border-titanium/30 lg:hidden"
              >
                {open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="girder-lines fixed inset-0 z-40 bg-onyx"
          >
            <div className="flex h-full flex-col justify-center px-8">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index + 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="font-mono text-xs text-amber/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-display text-4xl uppercase text-stroke transition-colors duration-200 group-hover:text-amber group-hover:[-webkit-text-stroke:0] sm:text-6xl">
                      {link.label}
                    </span>

                    <ArrowUpRight className="h-6 w-6 text-amber opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10"
              >
                <RequestButton label="Request Manpower" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
