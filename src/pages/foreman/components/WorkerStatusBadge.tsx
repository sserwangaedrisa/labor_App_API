import React from "react";

type WorkerStatus = "present" | "absent" | "pending" | "late" | string;

interface WorkerStatusBadgeProps {
  status: WorkerStatus;
  currentWorkEntryId?: string; // Made optional if not always needed
}

interface StatusConfig {
  label: string;
  className: string;
}

const WorkerStatusBadge: React.FC<WorkerStatusBadgeProps> = ({ status }) => {
  // Use a function to get the config based on status
  const getStatusConfig = (status: WorkerStatus): StatusConfig => {
    switch (status) {
      case "present":
        return {
          label: "Present",
          className:
            "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        };
      case "absent":
        return {
          label: "Absent",
          className:
            "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        };
      case "late":
        return {
          label: "Late Entry",
          className:
            "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        };
      case "pending":
      default:
        return {
          label: "Pending",
          className:
            "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.className} md:px-3 md:text-sm`}
    >
      {config.label}
    </span>
  );
};

export default WorkerStatusBadge;
