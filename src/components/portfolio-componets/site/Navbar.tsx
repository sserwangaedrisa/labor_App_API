import { useEffect, useState } from "react";
import type { JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { COMPANY, NAV_LINKS } from "../../../lib/siteData";
import { RequestButton } from "../site/Button";

export default function Navbar(): JSX.Element {
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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "bg-slate-900 text-slate-200 border-b border-slate-700/50"
            : "bg-transparent text-slate-100"
        }`}
      >
        <div className="mx-auto max-w-[120rem] px-5 lg:px-10">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-display text-lg">
                A
              </span>

              <span className="font-display text-sm sm:text-base uppercase leading-none tracking-tight text-slate-100">
                {COMPANY.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
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
                        ? "text-cyan-300"
                        : "text-slate-300/70 hover:text-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Request Button */}
              <div className="hidden sm:block">
                <RequestButton label="Request Manpower" />
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setOpen((value: boolean) => !value)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="lg:hidden grid h-11 w-11 place-items-center border border-slate-400/30"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-900 girder-lines"
          >
            <div className="flex h-full flex-col justify-center px-8">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08 * index + 0.1,
                  }}
                >
                  <Link
                    to={link.to}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="font-mono text-xs text-cyan-300/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-display text-4xl sm:text-6xl uppercase text-stroke transition-colors duration-200 group-hover:text-cyan-300 group-hover:[-webkit-text-stroke:0]">
                      {link.label}
                    </span>

                    <ArrowUpRight className="h-6 w-6 text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Request Button */}
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
}
