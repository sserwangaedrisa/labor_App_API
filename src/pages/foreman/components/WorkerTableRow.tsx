import React from "react";
import Image from "../../../components/ui/AppImage";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import WorkerStatusBadge from "./WorkerStatusBadge";
import { useState } from "react";
import type {
  Worker,
  WorkerStatus,
  WorkEntry,
  User,
  SiteSettings,
} from "../../../types/SharedTypes";

interface WorkerTableRowProps {
  worker: Worker;
  user: User | undefined;
  recordAttendance: (data: WorkEntry) => void;
  deleteAttendance: (workEntryId: string) => void;
  currentyWorkEntryId?: string;
  siteSettings: SiteSettings;
  currentDate: Date;
  onRecordAttendance: (worker: Worker) => void;
  onViewUserDetails: (user: User) => void;
}

const WorkerTableRow: React.FC<WorkerTableRowProps> = ({
  worker,
  user,
  recordAttendance,
  deleteAttendance,
  siteSettings,
  currentDate,
  currentyWorkEntryId,
  onRecordAttendance,
  onViewUserDetails,
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const [formData, setFormData] = useState<WorkEntry>({
    date: currentDate
      ? new Date(
          new Date(currentDate).getTime() -
            new Date(currentDate).getTimezoneOffset() * 6000,
        )
      : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000),
    hours: siteSettings.maxDailyHours,
    overtime: siteSettings.overtimeRate,
    notes: "Present",
    workerId: String(worker.id),
    siteId: "",
  });

  const handleToggleAttendance = async () => {
    if (isToggling) return; // Prevent multiple clicks

    setIsToggling(true);

    try {
      if (currentyWorkEntryId) {
        // If worker is present, delete the attendance
        if (deleteAttendance) {
          await deleteAttendance(currentyWorkEntryId);
        }
      } else {
        // If worker is absent, record attendance
        await recordAttendance(formData);
      }
    } catch (error) {
      console.error("Error toggling attendance:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // Determine if worker is currently present
  const isPresent = !!currentyWorkEntryId;

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
      <td className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 md:w-12 md:h-12">
            <Image
              src={worker.avatar}
              alt={worker.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm truncate md:text-base">
              {worker.name}
            </p>
            <p className="caption text-muted-foreground text-xs truncate">
              ID: {worker.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 hidden md:table-cell md:px-6 md:py-4">
        <span className="text-sm text-foreground">{worker.role}</span>
      </td>

      <td className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <WorkerStatusBadge
            currentWorkEntryId={currentyWorkEntryId}
            status={worker.todayStatus}
          />

          {/* Toggle Button */}
          <div className="flex items-center">
            <button
              onClick={handleToggleAttendance}
              disabled={isToggling}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full 
                transition-colors focus:outline-none focus:ring-2 
                focus:ring-primary focus:ring-offset-2
                ${
                  isPresent
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 hover:bg-gray-500"
                }
                ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full 
                  bg-white transition-transform
                  ${isPresent ? "translate-x-6" : "translate-x-1"}
                `}
              />
            </button>
            <span className="ml-2 text-xs text-muted-foreground">
              {isPresent ? "Present" : "Absent"}
            </span>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell md:px-6 md:py-4">
        <span className="data-text text-sm text-foreground font-medium">
          {worker.hoursToday}h
        </span>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell md:px-6 md:py-4">
        <span className="data-text text-sm text-foreground">
          ${worker.wageRate}/day
        </span>
      </td>

      <td className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-2 justify-end">
          <Button
            onClick={() => onRecordAttendance(worker)}
            className="hidden md:inline-flex"
          >
            Record
          </Button>

          <Button
            key={currentyWorkEntryId}
            onClick={() => onRecordAttendance(worker)}
            className="md:hidden"
          >
            <Icon key="clock" name="Clock" size={18} />
          </Button>

          <Button
            key={currentyWorkEntryId}
            onClick={() => user && onViewUserDetails(user)}
          >
            <Icon key="eye" name="Eye" size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default WorkerTableRow;
