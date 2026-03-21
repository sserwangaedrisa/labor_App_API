import React from "react";
import Image from "../../../components/ui/AppImage";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import WorkerStatusBadge from "./WorkerStatusBadge";
import { useState, useEffect } from "react";
import type {
  Worker,
  WorkerStatus,
  WorkEntry,
  SiteInfoResponse,
  User,
  SiteSettings,
} from "../../../types/SharedTypes";
import toast from "react-hot-toast";

interface WorkerTableRowProps {
  worker: Worker;
  user: User | undefined;
  recordAttendance: (data: WorkEntry) => Promise<SiteInfoResponse>;
  deleteAttendance: (workEntryId: string) => Promise<boolean>;
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

  // Sync local state with props when worker changes
  const [currentAttendance, setCurrentAttendance] = useState<WorkEntry | null>(
    worker?.workEntry ?? null,
  );
  const [isPresent, setIsPresent] = useState<boolean>(!!worker?.workEntry);

  // Update formData when dependencies change
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
    siteId: "", // Use the siteId prop
  });

  // Sync local state when worker prop changes (important for parent updates)
  useEffect(() => {
    setCurrentAttendance(worker?.workEntry ?? null);
    setIsPresent(!!worker?.workEntry);
  }, [worker?.workEntry]); // Re-run when workEntry changes from parent

  // Update formData when siteSettings or currentDate changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: currentDate
        ? new Date(
            new Date(currentDate).getTime() -
              new Date(currentDate).getTimezoneOffset() * 6000,
          )
        : new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000,
          ),
      hours: siteSettings.maxDailyHours,
      overtime: siteSettings.overtimeRate,
    }));
  }, [siteSettings, currentDate]);

  console.log(`${worker.name} is ${isPresent ? "present" : "absent"}`);

  const handleToggleAttendance = async () => {
    console.log("button clicked for", worker.name);
    console.log("current state:", { isPresent, currentAttendance });

    if (isToggling) return;
    setIsToggling(true);

    try {
      // If currently present, delete attendance
      if (isPresent && currentAttendance?.id) {
        console.log("Deleting attendance:", currentAttendance.id);

        const res = await deleteAttendance(currentAttendance.id);
        if (!res) {
          console.log("Failed to delete record");
          toast.error("Error while deleting attendance");
          return;
        }

        // Update local state
        setCurrentAttendance(null);
        setIsPresent(false);
        toast.success("Attendance removed successfully");
      }
      // If absent, create attendance
      else {
        console.log("Creating attendance with data:", formData);

        const response = await recordAttendance(formData);
        if (!response.success) {
          toast.error(response.message || "Failed to record attendance");
          return;
        }

        // Update local state with the new work entry
        if (response.workEntry) {
          setCurrentAttendance(response.workEntry);
          setIsPresent(true);
          toast.success("Attendance recorded successfully");
        } else {
          toast.error("No work entry returned");
        }
      }
    } catch (error) {
      console.error("Error toggling attendance:", error);
      toast.error("An error occurred while updating attendance");
    } finally {
      setIsToggling(false);
    }
  };

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
        <span className="text-sm text-foreground">{user?.job}</span>
      </td>

      <td className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <WorkerStatusBadge
            currentWorkEntryId={currentAttendance?.id}
            status={currentAttendance ? "present" : "absent"}
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
          {currentAttendance ? currentAttendance.hours : 0} h
        </span>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell md:px-6 md:py-4">
        <span className="data-text text-sm text-foreground">
          AED {user?.wageRating}/Hour
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

          <Button onClick={() => user && onViewUserDetails(user)}>
            <Icon key="eye" name="Eye" size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default WorkerTableRow;
