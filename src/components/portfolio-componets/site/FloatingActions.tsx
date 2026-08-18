import React, { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { COMPANY } from "../../../lib/siteData";
import type { JSX } from "react";

const FloatingActions: React.FC = (): JSX.Element => {
  const [showTop, setShowTop] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => {
      setShowTop(window.scrollY > 600);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="mechanical-hover grid h-11 w-11 place-items-center border border-onyx bg-onyx text-titanium shadow-[3px_3px_0_0_hsl(var(--amber))]"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <a
        href={`https://wa.me/${COMPANY.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="mechanical-hover grid h-14 w-14 place-items-center border border-onyx bg-amber text-onyx shadow-[3px_3px_0_0_hsl(var(--onyx))]"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export default FloatingActions;
