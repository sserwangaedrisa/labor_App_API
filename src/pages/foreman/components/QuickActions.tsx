import React from "react";
import Icon from "../../../components/ui/AppIconl";

interface QuickActionsPanelProps {
  onBulkAttendance: () => void;
  onViewReports: () => void;
  onSiteSettings: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  description: string;
  iconName: string;
  iconColor: string;
  gradient: string;
  badge?: string;
  onClick: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onBulkAttendance,
  onViewReports,
  onSiteSettings,
}) => {
  const actions: ActionItem[] = [
    {
      id: "attendance",
      label: "Record Attendance",
      description: "Mark workers present or absent",
      iconName: "UserCheck",
      iconColor: "var(--color-primary)",
      gradient: "from-blue-500/10 to-blue-500/5",
      badge: "New",
      onClick: onBulkAttendance,
    },
    {
      id: "reports",
      label: "Analytics & Reports",
      description: "View insights and metrics",
      iconName: "BarChart3",
      iconColor: "var(--color-success)",
      gradient: "from-emerald-500/10 to-emerald-500/5",
      onClick: onViewReports,
    },
    {
      id: "settings",
      label: "Site Configuration",
      description: "Manage site preferences",
      iconName: "Settings",
      iconColor: "var(--color-secondary)",
      gradient: "from-purple-500/10 to-purple-500/5",
      onClick: onSiteSettings,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-card to-card/95 rounded-2xl shadow-elevation-3 p-5 md:p-6 border border-border/50">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Icon
              name="Zap"
              size={22}
              color="var(--color-primary)"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Frequently used tools
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/30 text-xs text-muted-foreground">
          <Icon name="Command" size={12} />
          <span>+ K</span>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:border-transparent focus-ring"
            style={{
              animation: `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`,
            }}
          >
            {/* Animated Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Content */}
            <div className="relative p-4 flex items-start gap-3">
              {/* Icon Container */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  backgroundColor: `${action.iconColor}15`,
                  boxShadow: `inset 0 0 0 1px ${action.iconColor}25`,
                }}
              >
                <Icon
                  name="Box"
                  size={22}
                  color={action.iconColor}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  {action.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {action.description}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <Icon
                  name="ArrowRight"
                  size={16}
                  color="var(--color-primary)"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Ripple Effect Container */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-100">
                <div className="absolute inset-0 bg-white/10 rounded-xl" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Ready for action</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {actions.length} shortcuts available
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your global styles file (e.g., globals.css or index.css)
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

export default QuickActionsPanel;
