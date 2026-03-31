import React from "react";
import Icon from "../../../components/ui/AppIconl";

interface QuickActionsPanelProps {
  onBulkAttendance: () => void;
  onViewReports: () => void;
  onSiteSettings: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onBulkAttendance,
  onViewReports,
  onSiteSettings,
}) => {
  const actions = [
    {
      id: "attendance",
      label: "Record Attendance",
      description: "Mark workers present or absent",
      iconName: "UserCheck",
      iconColor: "blue",
      gradient: "from-blue-500 to-blue-50",
      badge: "New",
      onClick: onBulkAttendance,
    },
    {
      id: "reports",
      label: "Analytics & Reports",
      description: "View insights and metrics",
      iconName: "BarChart3",
      iconColor: "gray",
      gradient: "from-emerald-300 to-emerald-10",
      onClick: onViewReports,
    },
    {
      id: "settings",
      label: "Site-Configuration",
      description: "Manage site preferences",
      iconName: "Settings",
      iconColor: "purple",
      gradient: "from-purple-300 to-purple-10",
      onClick: onSiteSettings,
    },
  ];

  return (
    // Add isolation and ensure lower stacking context
    <div className="isolate z-0 flex items-center justify-center mx-5 mb-5">
      <div className="w-full">
        <div className="bg-gradient-to-br from-slate-400 to-slate-300 rounded-2xl shadow-xl p-5 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
                <Icon name="Zap" size={22} color="orange" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-center text-white">
                  Quick Actions
                </h3>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-xs text-blue-300">
              <Icon name="Command" size={12} color="orange" />
              <span>+ K</span>
            </div>
          </div>

          {/* Actions Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action, index) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className="group relative overflow-hidden rounded-xl bg-white/10 transition-all duration-300 hover:shadow-xl hover:bg-white/10 hover:cursor-pointer focus-ring"
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
                      backgroundColor: "gray",
                      boxShadow: `inset 0 0 0 1px ${action.iconColor}40`,
                    }}
                  >
                    <Icon
                      name="Bold"
                      size={22}
                      color="orange"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-l group-hover:text-primary transition-colors">
                        {action.label}
                      </p>
                      {action.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary/20 text-primary">
                          {action.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="opacity-40 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
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
                    <div className="absolute inset-0 bg-white/20 rounded-xl" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
