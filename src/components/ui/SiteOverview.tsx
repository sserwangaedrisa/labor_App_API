import React from "react";
import { Users, UserCheck, Clock, DollarSign } from "lucide-react";
import * as SharedTypes from "../../types/SharedTypes";

interface SiteOverviewProps {
  siteInfo?: SharedTypes.SiteDetails;
  siteActiveWorkers: number;
  PresentWorkers: number;
}

const SiteOverviewStats: React.FC<SiteOverviewProps> = ({
  siteInfo,
  siteActiveWorkers,
  PresentWorkers,
}) => {
  const stats = [
    {
      id: 1,
      title: "Total Workers",
      value: siteActiveWorkers || 0,
      subtitle: "Assigned to site",
      icon: Users,
      iconColor: "var(--color-primary)",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      id: 2,
      title: "Present Today",
      value: PresentWorkers || 0,
      icon: UserCheck,
      iconColor: "var(--color-success)",
      bgColor: "rgba(34, 197, 94, 0.1)", // Green tint
    },

    {
      id: 3,
      title: "Pending Payments",
      value:
        (siteInfo?.batchpayments?.length || 0) +
        (siteInfo?.singleworkerpayments?.length || 0),
      subtitle: "Workers awaiting",
      icon: DollarSign,
      iconColor: "var(--color-warning)",
      bgColor: "rgba(245, 158, 11, 0.1)", // Orange tint
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mb-8 bg-gray-300 shadow shadow-md py-10 mb-5 px-10">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-gray-200"
          >
            <div className="flex items-start justify-between ">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value?.toLocaleString() || 0}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                )}
              </div>

              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon
                  size={20}
                  style={{ color: stat.iconColor }}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SiteOverviewStats;
