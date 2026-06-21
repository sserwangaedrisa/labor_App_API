import React from "react";
import Icon from "../../../components/ui/AppIconl";

/* ================= TYPES ================= */

type TrendDirection = "up" | "down";

interface MetricCardProps {
  title: string;
  value: string | number;
  iconName: string;
  trend?: TrendDirection;
  trendValue?: string | number;
  trendPeriod?: string; // Customize comparison period (e.g., "vs yesterday", "vs last week")
  iconBgColor?: string;
  iconColor?: string;
  progress?: number; // 0-100 for progress bar (e.g., attendance rate)
  progressLabel?: string; // Label for the progress bar
  extraInfo?: string; // Additional context (e.g., "Out of 57 total workforce")
  className?: string;
}

/* ================= COMPONENT ================= */

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  iconName,
  trend,
  trendValue,
  trendPeriod = "vs last month",
  iconBgColor = "bg-gray-100 dark:bg-gray-800",
  iconColor = "var(--color-foreground)", // or a specific gray like '#4B5563'
  progress,
  progressLabel,
  extraInfo,
  className = "",
}) => {
  // Determine progress bar color - using professional, muted tones
  const getProgressColor = () => {
    if (progress === undefined) return "";
    if (progress >= 80) return "bg-emerald-500 dark:bg-emerald-400";
    if (progress >= 60) return "bg-amber-500 dark:bg-amber-400";
    return "bg-rose-400 dark:bg-rose-500";
  };

  return (
    <div
      className={`
        relative group bg-white-200/80 dark:bg-gray-900/90 
        rounded-2xl p-5 md:p-6 
        shadow-sm hover:shadow-md transition-all duration-300 
        border border-gray-200/10 dark:border-gray-800
        hover:border-gray-300/100 dark:hover:border-gray-700
        ${className}
      `}
    >
      {/* Subtle accent line - now using neutral gray */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        {/* Left: Title & Value */}
        <div className="flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {title}
          </p>
          <h3 className="text-3xl md:text-4xl lg:text-4xl font-semibold text-gray-900/80 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* Right: Icon with neutral background */}
        <div
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-2xl 
            flex items-center justify-center flex-shrink-0
            ${iconBgColor}
          `}
        >
          <Icon
            name={iconName as keyof typeof Icon}
            size={24}
            color={iconColor}
            className="md:w-7 md:h-7 transition-transform group-hover:scale-105 duration-200"
          />
        </div>
      </div>

      {/* Trend Indicator - Professional muted colors */}
      {trend && trendValue && (
        <div className="flex items-center gap-1.5 mb-3">
          <div
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${
                trend === "up"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
              }
            `}
          >
            <Icon
              name={trend === "up" ? "TrendingUp" : "TrendingDown"}
              size={12}
              color={trend === "up" ? "currentColor" : "currentColor"}
            />
            <span>{trendValue}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {trendPeriod}
          </span>
        </div>
      )}

      {/* Progress Bar Section - Clean and subtle */}
      {progress !== undefined && (
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            {progressLabel && (
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {progressLabel}
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400 font-mono">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {/* Extra Info Line */}
      {extraInfo && (
        <div className="mt-3 pt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Icon name="Info" size={12} color="currentColor" />
            {extraInfo}
          </p>
        </div>
      )}

      {/* Subtle ring for depth */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-black/5 dark:ring-white/5" />
    </div>
  );
};

export default MetricCard;
