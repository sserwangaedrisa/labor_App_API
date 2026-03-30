import { useState } from "react";

type Site = {
  site_id: string;
  site_name: string;
  site_description: string | null;
  site_location: string;
  site_created_at: string;
};

type Props = {
  site: Site;
};

const formatSiteName = (name: string) =>
  name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getDaysSince = (iso: string) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

const SiteHeader: React.FC<Props> = ({ site }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(site.site_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const [firstName, ...rest] = formatSiteName(site.site_name).split(" ");

  return (
    <div className="bg-slate-500 p-6 sm:p-8 shadow-[0_5px_5px_-2px_rgba(0,0,0,0.4)] mb-5">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-slate-500">
            Buildforce / Sites /{" "}
            <span className="text-amber-400">
              {formatSiteName(site.site_name)}
            </span>
          </span>

          <span className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Active
          </span>
        </div>

        <div className="bg-slate-600 border border-slate-600 rounded-xl p-6 space-y-5">
          <div>
            <p className="text-l font-mono text-amber-400 uppercase tracking-widest mb-2">
              Construction Site
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {firstName}{" "}
              <span className="text-amber-400">{rest.join(" ")}</span>
            </h1>

            <p className="text-slate-400  mt-2 max-w-md">
              {site.site_description}
            </p>
          </div>
          {/* Info */}
          <div className="flex flex-wrap gap-6 border-t border-slate-700 pt-4 text-sm">
            <div>
              <p className="text-slate-500  font-mono uppercase">Location</p>
              <p className="text-white font-medium">{site.site_location}</p>
            </div>

            <div>
              <p className="text-slate-500 text-l font-mono uppercase">
                Created
              </p>
              <p className="text-white font-medium">
                {formatDate(site.site_created_at)}
              </p>
            </div>

            <div>
              <p className="text-slate-500  font-mono uppercase">
                Days Running
              </p>
              <p className="text-white font-medium">
                {getDaysSince(site.site_created_at)} days
              </p>
            </div>

            <div>
              <p className="text-slate-500  font-mono uppercase">Site ID</p>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-mono">
                  {site.site_id.slice(0, 8)}…{site.site_id.slice(-5)}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-amber-400 hover:underline"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
