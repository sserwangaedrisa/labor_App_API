import { motion } from "framer-motion";

interface PageHeroProps {
  index: string;
  kicker: string;
  title: string;
  subtitle: string;
  tone?: "light" | "dark";
  /** Optional background image URL (if not provided, uses the default) */
  bgImage?: string;
}

export default function PageHero({
  index,
  kicker,
  title,
  subtitle,
  tone = "light",
  bgImage,
}: PageHeroProps): React.JSX.Element {
  const isDark = tone === "dark";

  // Default image: place your image in the public/images folder
  // e.g., public/images/services-bg.png
  const defaultImage = "src/assets/servicesBg.png";
  const backgroundImage = bgImage || defaultImage;

  return (
    <section
      className={`
        relative overflow-hidden border-b mt-20 shadow-md shadow-orange-500/30 
        isDark
          ? "border-white/[0.08] bg-onyx text-titanium"
          : "border-onyx/[0.08] bg-titanium text-onyx"
      }
      `}
    >
      {/* ─── Background Image ─── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          // Fallback background colour in case the image does not load
          backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
        }}
      />

      {/* ─── Image Overlay ─── */}
      <div
        className={`absolute inset-0 z-0 ${
          isDark ? "bg-onyx/70" : "bg-titanium/70"
        }`}
      />

      {/* ─── Background Grid ─── */}
      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          z-0
          opacity-[0.035]
          ${
            isDark
              ? "bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]"
              : "bg-[linear-gradient(rgba(0,0,0,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.8)_1px,transparent_1px)]"
          }
          bg-[size:70px_70px]
        `}
      />

      {/* ─── Decorative Glow ─── */}
      {isDark && (
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            z-0
            h-96
            w-96
            rounded-full
            bg-amber/10
            blur-3xl
          "
        />
      )}

      {/* ─── Content ─── */}
      <div className="relative z-10 mx-auto max-w-[120rem] px-5 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          {/* Index */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <span
                className={`
                  h-px
                  w-8
                  ${isDark ? "bg-amber" : "bg-onyx/30"}
                `}
              />
              <span
                className={`
                  font-mono
                  text-xs
                  tracking-[0.2em]
                  ${isDark ? "text-amber" : "text-steel"}
                `}
              >
                {index}
              </span>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-10">
            {/* Kicker */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`
                mb-5
                font-mono
                text-xs
                uppercase
                tracking-[0.25em]
                ${isDark ? "text-amber" : "text-steel"}
              `}
            >
              {kicker}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={`
                max-w-5xl
                text-5xl
                font-semibold
                leading-[0.95]
                tracking-tight
                sm:text-6xl
                lg:text-8xl
                ${isDark ? "text-titanium" : "text-onyx"}
              `}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="
                mt-8
                max-w-2xl
                text-base
                leading-7
                text-steel
                sm:text-lg
              "
            >
              {subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ─── Bottom Accent ─── */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "96px" }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-0 left-0 z-20 h-1 bg-amber"
      />
    </section>
  );
}
