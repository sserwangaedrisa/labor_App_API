// LaborCard.tsx - Fixed Version

import React, { useState, useEffect } from "react";
import type {
  WorkEntry,
  WorkerPaymentData,
  SiteInfoResponse,
} from "../../types/SharedTypes";

import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  X,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getDay,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from "date-fns";
import Image from "./AppImage";
import toast from "react-hot-toast";
import { useAuth } from "../../app/providers";
import ConfirmationModal from "./Confirmation";
import Loading from "./Loading";

interface LaborCardProps {
  setSelectedEntries: React.Dispatch<React.SetStateAction<string[]>>;
  isOpen: boolean;
  makePaymentRequestFc: () => Promise<boolean>;
  workerData: WorkerPaymentData | null;
  onClose: () => void;
}

const LaborCard: React.FC<LaborCardProps> = ({
  isOpen,
  workerData,
  makePaymentRequestFc,
  setSelectedEntries,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<WorkEntry | null>(null);

  // Payment states - FIXED: Use state for selected entries
  const [selectedLaborCardPayments, setSelectedLaborCardPayments] = useState<
    string[]
  >([]);
  const [workEntrySelection, setWorkEntrySelection] = useState<boolean>(false);

  // confirmation
  const [paymentRequestConfirmation, setPaymentRequestConfirmation] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // set user context
  const { user } = useAuth();

  if (!isOpen || !workerData) return null;

  // Get all days in the current month view (including previous/next month days for grid)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const entriesByDate = new Map<string, WorkEntry>();
  workerData.entries.forEach((entry) => {
    const dateKey = format(new Date(entry.date), "yyyy-MM-dd");
    entriesByDate.set(dateKey, entry);
  });

  // Get entry for a specific date
  const getEntryForDate = (date: Date): WorkEntry | null => {
    const dateKey = format(date, "yyyy-MM-dd");
    return entriesByDate.get(dateKey) || null;
  };

  // Get status for a specific date - FIXED: Check if entry ID is in selectedLaborCardPayments
  const getDayStatus = (date: Date): "ABSENT" | "PRESENT" | "SELECTED" => {
    const entry = getEntryForDate(date);
    if (!entry) {
      return "ABSENT";
    }

    //  Check if this entry ID is in the selectedLaborCardPayments array
    if (selectedLaborCardPayments.includes(entry.id as string)) {
      return "SELECTED";
    }
    return "PRESENT";
  };

  // Format hours display
  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  //  Function to toggle entry selection
  const toggleEntrySelection = (entryId: string) => {
    setSelectedLaborCardPayments((prev) => {
      if (prev.includes(entryId)) {
        const newSelection = prev.filter((id) => id !== entryId);
        setSelectedEntries(newSelection);
        return newSelection;
      } else {
        const newSelection = [...prev, entryId];
        setSelectedEntries(newSelection);
        return newSelection;
      }
    });
  };

  const clearSelections = () => {
    setSelectedLaborCardPayments([]);
    setSelectedEntries([]);
  };

  const makePaymentRequest = async () => {
    try {
      if (selectedLaborCardPayments.length <= 0) {
        toast.error("No work entries selected");
        return;
      }

      setIsLoading(true);
      const paymentReq = await makePaymentRequestFc();

      if (paymentReq) {
        clearSelections();
        setWorkEntrySelection(false);
      }
    } catch (error) {
      console.error("Payment request error:", error);
    } finally {
      setIsLoading(false);
      setPaymentRequestConfirmation(false);
    }
  };

  // Get status color and icon - FIXED: Added SELECTED style
  const getStatusStyle = (status: "ABSENT" | "PRESENT" | "SELECTED") => {
    switch (status) {
      case "PRESENT":
        return {
          bgColor: "bg-green-50 border-green-200 hover:bg-green-100",
          textColor: "text-green-700",
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          label: "Present",
        };
      case "SELECTED":
        return {
          bgColor: "bg-blue-500 border-blue-600", // Changed to blue for selected
          textColor: "text-white",
          icon: <CheckCircle className="w-4 h-4 text-white" />,
          label: "Selected",
        };
      case "ABSENT":
        return {
          bgColor: "bg-red-50 border-red-200 hover:bg-red-100",
          textColor: "text-red-700",
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          label: "Absent",
        };
      default:
        return {
          bgColor: "bg-gray-50 border-gray-200 hover:bg-gray-100",
          textColor: "text-gray-500",
          icon: <AlertCircle className="w-4 h-4 text-gray-400" />,
          label: "No Data",
        };
    }
  };

  // setting payment status badge
  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "REVIEW":
        return "bg-blue-500";
      case "NOT_PAID":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
    setSelectedDate(null);
    setSelectedEntry(null);
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    const entry = getEntryForDate(date);

    if (!workEntrySelection && entry) {
      setSelectedDate(date);
      setSelectedEntry(entry);
    } else if (
      (workEntrySelection && entry?.status === "PAID") ||
      (workEntrySelection && entry?.status === "PENDING")
    ) {
      console.log(`Selected entry under ${entry.status}`);
      toast.error(`Selected entry under ${entry.status}`);
      return;
    } else if (workEntrySelection && entry) {
      toggleEntrySelection(entry.id as string);
    }
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Download as PDF (using browser print to PDF)
  const handleDownload = () => {
    window.print();
  };

  const cancelSelectionMode = () => {
    setWorkEntrySelection(false);
    clearSelections();
  };

  const monthSummary = {
    daysWorked: workerData.metadata.entryCount,
    totalHours: workerData.summary.totalHours,
    totalOvertime: workerData.summary.totalOvertimeHours,
    totalEarnings: workerData.summary.totalAmount,
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl transition-all print:shadow-none print:max-h-none print:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl print:bg-gray-100 print:text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white">
                <Image
                  src={
                    workerData.worker.imageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={workerData.worker.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white print:text-black">
                  Labor Card - {workerData.worker.name}
                </h2>
                <p className="text-blue-100 print:text-gray-600">
                  {workerData.site.name} •{" "}
                  {format(new Date(workerData.period.startDate), "MMM yyyy")}
                </p>
                {workEntrySelection && (
                  <p className="text-yellow-200 text-sm mt-1">
                    Selection Mode: {selectedLaborCardPayments.length} entries
                    selected
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Worker Info Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{workerData.worker.email}</p>
              </div>
            </div>
            {workerData.worker.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">
                    {workerData.worker.phone}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Rate per Hour</p>
                <p className="text-sm font-medium">
                  ${workerData.calculation.ratePerHour}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between print:hidden">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={goToCurrentMonth}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Today
              </button>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Month Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {monthSummary.daysWorked}
              </p>
              <p className="text-xs text-blue-700 font-medium">Days Worked</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatHours(monthSummary.totalHours)}
              </p>
              <p className="text-xs text-green-700 font-medium">Total Hours</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {formatHours(monthSummary.totalOvertime)}
              </p>
              <p className="text-xs text-orange-700 font-medium">Overtime</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">
                ${monthSummary.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-purple-700 font-medium">Earnings</p>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="relative">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const entry = getEntryForDate(day);
                const status = getDayStatus(day);
                const statusStyle = getStatusStyle(status);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <div
                    key={index}
                    onClick={() => isCurrentMonth && handleDayClick(day)}
                    className={`
                      min-h-[100px] p-2 rounded-lg border transition-all cursor-pointer
                      ${!isCurrentMonth && "opacity-30"}
                      ${isSelected && !workEntrySelection ? "ring-2 ring-blue-500 shadow-lg" : ""}
                      ${statusStyle.bgColor}
                      ${workEntrySelection && isCurrentMonth && entry ? "hover:scale-105 hover:shadow-md" : ""}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`
                        text-sm font-semibold
                        ${!isCurrentMonth ? "text-gray-400" : statusStyle.textColor}
                      `}
                      >
                        {format(day, "dd")}
                      </span>
                      {isCurrentMonth && entry && (
                        <div className="print:hidden">{statusStyle.icon}</div>
                      )}

                      {entry && isCurrentMonth && (
                        <div className="mt-1">
                          <div
                            className={`w-3 h-3 rounded-full ${getPaymentStatusColor(entry.status)}`}
                            title={entry.status || "Unknown"}
                          />
                        </div>
                      )}
                    </div>

                    {entry && isCurrentMonth && (
                      <div className="mt-1 space-y-0.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Hours:</span>
                          <span className="font-medium text-gray-800">
                            {formatHours(entry.hours || 0)}
                          </span>
                        </div>
                        {entry?.overtime && entry?.overtime > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-orange-600">OT:</span>
                            <span className="font-medium text-orange-700">
                              {formatHours(entry?.overtime || 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {!entry && isCurrentMonth && (
                      <div className="mt-2 text-xs text-red-600 text-center">
                        Absent
                      </div>
                    )}

                    {!isCurrentMonth && (
                      <div className="mt-2 text-xs text-gray-400 text-center">
                        {format(day, "MMM")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <Loading
                transparent
                message="Making payment request..."
                overlay={true}
              />
            )}
          </div>

          <div className="flex gap-3">
            {!workEntrySelection && user?.role !== "LABORER" && (
              <button
                onClick={() => setWorkEntrySelection(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Payment Selection
              </button>
            )}

            {workEntrySelection && (
              <>
                <button
                  onClick={cancelSelectionMode}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel Selection
                </button>

                {selectedLaborCardPayments.length > 0 && (
                  <button
                    onClick={() => setPaymentRequestConfirmation(true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Submit Request ({selectedLaborCardPayments.length})
                  </button>
                )}
              </>
            )}
          </div>

          {/* Selected Day Details */}
          {selectedDate && selectedEntry && !workEntrySelection && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 print:bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-3">
                Details for {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Regular Hours</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatHours(selectedEntry.hours || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Overtime Hours</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatHours(selectedEntry.overtime || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Hours</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatHours(selectedEntry.totalHours || 0)}
                  </p>
                </div>
              </div>
              {selectedEntry.notes && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">Notes:</p>
                  <p className="text-sm text-gray-700">{selectedEntry.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Modal */}
          {paymentRequestConfirmation && (
            <ConfirmationModal
              title="Payment Request"
              onConfirm={makePaymentRequest}
              onCancel={() => setPaymentRequestConfirmation(false)}
              description={`Are you sure you want to submit payment request for ${selectedLaborCardPayments.length} work entry/entries? This action cannot be undone.`}
              confirmButtonText="Submit Request"
              danger={false}
            />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-xs text-gray-600">
                Present (with entry)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs text-white bg-blue-500 px-2 py-0.5 rounded">
                Selected for Payment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-xs text-gray-600">Absent (no entry)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">Outside Period</span>
            </div>
            <div className="border-l border-gray-200 pl-4 ml-2">
              <span className="text-xs font-semibold text-gray-700 mr-2">
                Payment Status:
              </span>
              <div className="flex gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Paid</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">Not Paid</span>
                </div>
                {(user?.role === "FOREMAN" || user?.role === "OWNER") && (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">Under Review</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborCard;
