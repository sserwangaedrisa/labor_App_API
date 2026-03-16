import React from "react";
import Image from "../../../components/ui/AppImage";
import type { User } from "../../../types/SharedTypes";
interface WorkerModalProps {
  worker: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const WorkerModal: React.FC<WorkerModalProps> = ({
  worker,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !worker) return null;

  // Calculate days worked this month and overtime
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const workThisMonth =
    worker.workerRecords?.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    }) || [];

  const daysWorked = workThisMonth.length;
  const totalOvertime = workThisMonth.reduce(
    (sum, entry) => sum + (entry.overtime || 0),
    0,
  );

  // Safe calculation with fallback for wageRating
  const wageRate = worker.wageRating || 0;
  const totalEarnings = workThisMonth.reduce(
    (sum, entry) =>
      sum + ((entry.hours || 0) + (entry.overtime || 0)) * wageRate,
    0,
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[340px] rounded-2xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-2xl p-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Worker Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow">
            <Image
              src={worker?.imageUrl || "/avatar.png"}
              alt={worker?.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">{worker?.name}</h2>
            <p className="text-sm text-gray-600">{worker?.job || "Worker"}</p>
          </div>
        </div>

        {/* Worker Info */}
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Email:</span> {worker?.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {worker?.phone || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {worker?.status || "Active"}
          </p>
          <p>
            <span className="font-semibold">Assigned Site:</span>{" "}
            {worker?.assignedSite || "None"}
          </p>
        </div>

        <hr className="my-4 border-gray-300/50" />

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/60 rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500">Days Worked</p>
            <p className="font-bold text-gray-800">{daysWorked}</p>
          </div>

          <div className="bg-white/60 rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500">Overtime</p>
            <p className="font-bold text-gray-800">{totalOvertime} hrs</p>
          </div>

          <div className="col-span-2 bg-green-50 rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-500">Money Owed</p>
            <p className="font-bold text-green-600 text-lg">
              ${totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WorkerModal;
