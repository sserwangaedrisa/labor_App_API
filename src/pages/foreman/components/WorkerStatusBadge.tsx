import React from "react";

type WorkerStatus = "present" | "absent" | "pending" | "late" | string;

interface WorkerStatusBadgeProps {
  status: WorkerStatus;
}

interface StatusConfig {
  label: string;
  className: string;
}

const WorkerStatusBadge: React.FC<WorkerStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<WorkerStatus, StatusConfig> = {
    present: {
      label: "Present",
      className: "bg-success/10 text-success border-success/20",
    },
    absent: {
      label: "Absent",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    pending: {
      label: "Pending",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    late: {
      label: "Late Entry",
      className: "bg-accent/10 text-accent border-accent/20",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.className} md:px-3 md:text-sm`}
    >
      {config.label}
    </span>
  );
};

export default WorkerStatusBadge;
