import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const COMPANY = { name: "Atlas Manpower" };

const NAV_LINKS = [
  { label: "Services", to: "/services" },
  { label: "Industries", to: "/industries" },
  { label: "About", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');`;

function RequestButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#f2a93d] text-[#0a0c0e] text-xs font-semibold uppercase tracking-[0.1em] border-none cursor-pointer transition-all duration-200 hover:bg-[#e7e9ea] hover:-translate-y-px [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]"
    >
      {label}
      <ArrowUpRight
        size={14}
        strokeWidth={2.5}
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [activeTo, setActiveTo] = useState("/services");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${"bg-[rgba(10,12,14,0.86)] backdrop-blur-md border-[rgba(231,233,234,0.12)] shadow-lg"}`;

  return (
    <div className=" bg-[#0a0c0e] text-[#e7e9ea] font-['Inter']">
      <style>{FONT_IMPORT}</style>

      <header className={headerClasses}>
        <div className="max-w-[100rem] mx-auto px-6 lg:px-10">
          <div className="h-20 flex items-center justify-between">
            <a
              href="#"
              className="flex items-center gap-3 text-current no-underline"
              onClick={(e) => e.preventDefault()}
            >
              <span className="h-9 w-9 grid place-items-center bg-[#f2a93d] text-[#0a0c0e] font-['Oswald'] font-bold text-lg tracking-wide shadow-[inset_0_0_0_1px_rgba(10,12,14,0.25)]">
                A
              </span>
              <span className="font-['Oswald'] font-semibold text-sm uppercase tracking-[0.14em] leading-none whitespace-nowrap">
                {COMPANY.name}
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.to}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTo(link.to);
                  }}
                  className={`relative px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] no-underline transition-colors duration-200 ${
                    activeTo === link.to
                      ? "text-[#f2a93d]"
                      : "text-[rgba(231,233,234,0.62)] hover:text-[#e7e9ea]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-4 right-4 bottom-1.5 h-px bg-[#f2a93d] origin-left transition-transform duration-300 ${
                      activeTo === link.to ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <RequestButton label="Request Manpower" />
              </div>
              <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                aria-label="Toggle menu"
                className="grid place-items-center h-11 w-11 border border-[rgba(231,233,234,0.25)] bg-transparent text-[#e7e9ea] cursor-pointer transition-colors duration-200 hover:border-[#f2a93d] lg:hidden"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#0a0c0e] transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="h-1 w-full bg-[repeating-linear-gradient(-45deg,#f2a93d_0_10px,#15181b_10px_20px)]" />
        <div className="h-[calc(100%-4px)] flex flex-col justify-center px-8">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.to}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTo(link.to);
                setOpen(false);
              }}
              className={`group flex items-baseline gap-4 py-2.5 no-underline text-[#e7e9ea] transition-all duration-300 ${
                open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`}
              style={{
                transitionDelay: open ? `${0.08 * index + 0.1}s` : "0s",
              }}
            >
              <span className="font-['IBM_Plex_Mono'] text-xs text-[rgba(242,169,61,0.6)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-['Oswald'] text-4xl sm:text-6xl font-semibold uppercase text-transparent [-webkit-text-stroke:1.5px_#e7e9ea] transition-all duration-200 group-hover:text-[#f2a93d] group-hover:[-webkit-text-stroke:0px]">
                {link.label}
              </span>
              <ArrowUpRight
                className="opacity-0 transition-opacity duration-200 text-[#f2a93d] group-hover:opacity-100"
                size={22}
              />
            </a>
          ))}

          <div
            className={`mt-9 transition-all duration-300 delay-300 ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <RequestButton label="Request Manpower" />
          </div>
        </div>
      </div>
    </div>
  );
}
