import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import authorizePostRequest from "../../api/authorizePostRequest";
import type {
  WorkEntry,
  WorkerPaymentData,
  SiteInfoResponse,
  workerPaymentRequestSearchObject,
} from "../../types/SharedTypes";

import {
  Calendar,
  Clock,
  Wallet,
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
  Eye,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  startOfWeek,
  isBefore,
  endOfWeek,
  isSameDay,
  isAfter,
  startOfDay,
} from "date-fns";
import Image from "./AppImage";
import toast from "react-hot-toast";
import { useAuth } from "../../app/providers";
import ConfirmationModal from "./Confirmation";
import Loading from "./Loading";

interface LaborCardProps {
  siteID?: string | null;
  workerID?: string | null;
  isOpen: boolean;
  paymentID?: string;
  workerPaymentInfo?: WorkerPaymentData | null;
  makePaymentRequestFc?: () => Promise<boolean>;
  setSelectedEntries?: Dispatch<SetStateAction<string[]>>;
  onClose: () => void;
}

interface workerRequestResponse {
  data?: WorkerPaymentData;
  success: boolean;
  message: string;
}

const LaborCard: React.FC<LaborCardProps> = ({
  isOpen,
  paymentID,
  workerPaymentInfo,
  onClose,

  siteID,
  workerID,
}) => {
  // Auth context
  const { user } = useAuth();
  const [workerData, setWorkerData] = useState<WorkerPaymentData | null>(
    workerPaymentInfo || null,
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<WorkEntry | null>(null);

  const [siteId, setSiteId] = useState<string | null>("");
  const [workerId, setWorkerId] = useState<string | null>("");

  // Payment states - FIXED: Use state for selected entries
  const [selectedLaborCardPayments, setSelectedLaborCardPayments] = useState<
    string[]
  >([]);
  const [workEntrySelection, setWorkEntrySelection] = useState<boolean>(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]); // For payments

  // confirmation
  const [paymentRequestConfirmation, setPaymentRequestConfirmation] =
    useState<boolean>(false);
  const [PAYMENTID, setPAYMENTID] = useState<string | null>(paymentID || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [includePending, setIncludePending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] =
    useState<workerPaymentRequestSearchObject>({
      siteId: siteId || "",
      paymentId: PAYMENTID || "",
      workerId: workerId || "",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ),
    });

  // change of workEntry status states
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<string>("");

  // show statusSummary states:
  const [showPAID, setShowPAID] = useState<boolean>(false);
  const [showPENDING, setShowPENDING] = useState<boolean>(false);
  const [showREJECTED, setShowREJECTED] = useState<boolean>(false);
  const [showNOTPAID, setShowNOTPAID] = useState<boolean>(false);
  const [showAPPROVED, setShowAPPROVED] = useState<boolean>(false);
  const [showREVIEW, setShowREVIEW] = useState<boolean>(false);
  const [statusToUpdate, setStatusToUpdate] = useState<string>("");

  // Refresh key states
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Use refs to track request state
  const isFetchingRef = useRef(false);
  const lastFetchKeyRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Memoize the request key to prevent unnecessary recalculations
  const requestKey = useMemo(() => {
    if (!searchQuery.siteId || !searchQuery.workerId) return "";
    return `${searchQuery.siteId}-${searchQuery.workerId}-${searchQuery.startDate?.toISOString().split("T")[0]}-${searchQuery.endDate?.toISOString().split("T")[0]}-${searchQuery.paymentId || ""}`;
  }, [
    searchQuery.siteId,
    searchQuery.workerId,
    searchQuery.startDate,
    searchQuery.endDate,
    searchQuery.paymentId,
  ]);

  // Memoize the fetch key to trigger useEffect when either requestKey or refreshTrigger changes
  const fetchKey = useMemo(() => {
    return `${requestKey}-${refreshTrigger}`;
  }, [requestKey, refreshTrigger]);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    isFetchingRef.current = false;
  }, []);

  useEffect(() => {
    if (workerPaymentInfo) {
      setWorkerData(workerPaymentInfo);
      setWorkerId(workerPaymentInfo.worker.id);
      setSiteId(workerPaymentInfo.site.id);
    }

    if (siteID && workerID) {
      setSiteId(siteID);
      setWorkerId(workerID);
    }
  }, [workerPaymentInfo]);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      setWorkerData(null);
    }
  }, [isOpen, cleanup]);

  useEffect(() => {
    setSearchQuery({
      siteId: siteId || siteID || "",
      paymentId: PAYMENTID || "",
      workerId: workerId || workerID || "",
      startDate: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
      ),
      endDate: new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ),
    });
  }, [currentMonth, siteId, siteID, workerId, PAYMENTID]);

  // Getting the work Entries for the current selected month or paymentId
  useEffect(() => {
    if (!searchQuery.siteId?.length || !searchQuery.workerId?.length) return;

    //  fetching if we're already fetching the same data
    if (isFetchingRef.current && lastFetchKeyRef.current === fetchKey) {
      return;
    }
    // Don't fetch if we already have the data
    if (workerData && lastFetchKeyRef.current === fetchKey && !refreshTrigger) {
      return;
    }
    const fetchWorkerDetails = async () => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      isFetchingRef.current = true;
      lastFetchKeyRef.current = fetchKey;
      setIsLoading(true);
      try {
        const response = await authorizePostRequest<workerRequestResponse>(
          "payments/workerPayment",
          searchQuery,
        );

        // Check if this request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (!response || !response.success) {
          toast.error(response?.message || "Failed to get the worker details");
          if (workerData) {
            setWorkerData({
              ...workerData,
              period: {
                startDate: searchQuery.startDate.toISOString(),
                endDate: searchQuery.endDate.toISOString(),
              },
              summary: {
                totalRegularHours: 0,
                totalOvertimeHours: 0,
                totalHours: 0,
                totalAmount: 0,
              },
              statusSummary: {
                PENDING: {
                  count: 0,
                  hours: 0,
                  overtime: 0,
                  amount: 0,
                  total: 0,
                },
                APPROVED: {
                  count: 0,
                  hours: 0,
                  overtime: 0,
                  amount: 0,
                  total: 0,
                },
                PAID: {
                  count: 0,
                  hours: 0,
                  overtime: 0,
                  amount: 0,
                  total: 0,
                },
                NOT_PAID: {
                  count: 0,
                  hours: 0,
                  overtime: 0,
                  amount: 0,
                  total: 0,
                },
                REJECTED: {
                  count: 0,
                  hours: 0,
                  overtime: 0,
                  total: 0,
                  amount: 0,
                },
                REVIEW: {
                  count: 0,
                  hours: 0,
                  overtime: 0,
                  total: 0,
                  amount: 0,
                },
              },
              metadata: {
                entryCount: 0,
              },
              entries: [],
            });
          } else {
            setWorkerData(null);
          }

          return;
        }

        // Only update state if the request key still matches
        if (lastFetchKeyRef.current === fetchKey && response?.data) {
          setWorkerData(response.data || null);
          // Only set currentMonth on initial load (when refreshTrigger is 0) to avoid triggering additional fetches
          if (refreshTrigger === 0) {
            setCurrentMonth(new Date(response.data.period.startDate));
          }
        }
      } catch (error: unknown) {
        const requestError = error as { name?: string; code?: string };
        if (
          requestError.name === "AbortError" ||
          requestError.code === "ERR_CANCELED"
        ) {
          return;
        }
        console.error("Error fetching worker details:", error);
        toast.error("Failed to get workers details");
        setWorkerData(null);
      } finally {
        // Only reset if this is still the current request
        if (lastFetchKeyRef.current === fetchKey) {
          isFetchingRef.current = false;
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      }
    };

    //  a small delay to prevent rapid successive calls
    timeoutRef.current = setTimeout(() => {
      fetchWorkerDetails();
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, fetchKey, searchQuery]);

  if (!isOpen) return null;

  if (!workerData) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <Loading message="Loading labor card..." />
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-600">
                Labor card details are not available for this payment.
              </p>
              <button
                onClick={onClose}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

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
  // Get status for a specific date
  const getDayStatus = (
    date: Date,
  ): "ABSENT" | "PRESENT" | "SELECTED" | "FUTURE" => {
    const entry = getEntryForDate(date);
    if (!entry) {
      const today = startOfDay(new Date());
      if (isAfter(startOfDay(date), today)) {
        return "FUTURE";
      }
      return "ABSENT";
    }
    if (selectedLaborCardPayments.includes(entry.id as string)) {
      return "SELECTED";
    }
    return "PRESENT";
  };
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
      const paymentReq = await makePaymentRequestCard();

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

  const updateEntryStatus = async () => {
    try {
      if (selectedLaborCardPayments.length <= 0) {
        toast.error("No work entries selected");
        return;
      }

      setIsLoading(true);
      const paymentReq = await makeUpdateEntryStatusRequest();

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
  const getStatusStyle = (
    status: "ABSENT" | "PRESENT" | "SELECTED" | "FUTURE",
  ) => {
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
          bgColor: "bg-blue-500 border-blue-600",
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
      case "FUTURE":
        return {
          bgColor: "bg-gray-100 border-gray-200",
          textColor: "text-gray-500",
          icon: <AlertCircle className="w-4 h-4 text-gray-400" />,
          label: "",
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
      case "APPROVED":
        return "bg-green-900";
      case "REJECTED":
        return "bg-gray-500";
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

  const handleDayClick = (date: Date) => {
    const entry = getEntryForDate(date);
    if (workEntrySelection && entry?.status === "PAID") {
      console.log(`Selected entry under ${entry.status}`);
      toast.error(`Selected entry under ${entry.status}`);
      return;
    } else if (
      workEntrySelection &&
      entry?.status === "REVIEW" &&
      user?.role === "FOREMAN"
    ) {
      console.log(`Selected entry under ${entry.status}`);
      toast.error(`Selected entry under ${entry.status}`);
      return;
    }
    if (!workEntrySelection && entry) {
      setSelectedDate(date);
      setSelectedEntry(entry);
    } else if (workEntrySelection && entry && entry.status !== "PAID") {
      toggleEntrySelection(entry.id as string);
      if (entry.status !== "NOT_PAID") {
        setIncludePending(true);
      }
    }
  };

  // Funtion that returns a boolean to show the status summary for a specific status
  const shouldShowStatusSummary = (status: string): boolean => {
    switch (status) {
      case "PAID":
        return showPAID;
      case "PENDING":
        return showPENDING;
      case "REJECTED":
        return showREJECTED;
      case "NOT_PAID":
        return showNOTPAID;
      case "APPROVED":
        return showAPPROVED;
      case "REVIEW":
        return showREVIEW;
      default:
        return false;
    }
  };

  // Function to toggle the status summary visibility
  const toggleStatusSummary = (status: string) => {
    switch (status) {
      case "PAID":
        setShowPAID(!showPAID);
        break;
      case "PENDING":
        setShowPENDING(!showPENDING);
        break;
      case "REJECTED":
        setShowREJECTED(!showREJECTED);
        break;
      case "NOT_PAID":
        setShowNOTPAID(!showNOTPAID);
        break;
      case "APPROVED":
        setShowAPPROVED(!showAPPROVED);
        break;
      case "REVIEW":
        setShowREVIEW(!showREVIEW);
        break;
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

  // PAYMENT REQUEST LOGIC

  // PAYMENT REQUEST FC
  const makePaymentRequestCard = async (): Promise<boolean> => {
    if (selectedEntries.length <= 0) {
      console.log("No entries selected for the payment");
      toast.error("No entries selected for the payment");
      return false;
    }
    setIsLoading(true);
    try {
      const request: SiteInfoResponse = await authorizePostRequest(
        "payments/worker",
        {
          entryIds: selectedEntries,
          siteId,
          workerId,
        },
      );

      if (!request.success || !request) {
        console.log(request.message || "Error while making payment request");
        toast.error("Failed to make the payment request");
        setPaymentRequestConfirmation(false);
        return false;
      }

      console.log("Payment request made successfully");

      toast.success("Payment request made successfully");
      setRefreshTrigger((prev) => prev + 1);
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Failed to make the payment request");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // STATUS UPDATE LOGIC
  const handleStatusUpdate = async () => {
    if (!selectedNewStatus) {
      toast.error("Please select a status");
      return;
    }
    if (selectedLaborCardPayments.length === 0) {
      toast.error("No work entries selected");
      return;
    }
    setStatusToUpdate(selectedNewStatus || statusToUpdate);
    await updateEntryStatus();
    setShowStatusModal(false);
    setSelectedNewStatus("");
  };

  // UPDATE ENTRY STATUS FC
  const makeUpdateEntryStatusRequest = async (): Promise<boolean> => {
    if (selectedEntries.length <= 0) {
      console.log("No entries selected for the status update");
      toast.error("No entries selected for the status update");
      return false;
    }
    setIsLoading(true);
    try {
      const request: SiteInfoResponse = await authorizePostRequest(
        `payments/updateWorkEntries/${selectedNewStatus}`,
        {
          entryIds: selectedEntries,
          siteId,
          workerId,
        },
      );

      if (!request.success || !request) {
        console.log(
          request.message || "Error while making status update request",
        );
        toast.error("Failed to make the status update request");
        setPaymentRequestConfirmation(false);
        return false;
      }

      console.log("Status update request made successfully");

      toast.success("Status update request made successfully");
      setRefreshTrigger((prev) => prev + 1);
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Failed to make the status update request");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 ${isLoading ? "cursor-not-allowed cursor-events-none" : ""}`}
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
                  {workerData.calculation.ratePerHour}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between print:hidden">
            <button
              onClick={() => {
                setPAYMENTID(null);
                previousMonth();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={() => {
                  setPAYMENTID(null);
                  goToCurrentMonth();
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Today
              </button>
            </div>
            <button
              onClick={() => {
                setPAYMENTID(null);
                nextMonth();
              }}
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
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {monthSummary.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-purple-700 font-medium">Earnings</p>
            </div>
          </div>

          {/* Entries status summaries  */}
          {workerData.statusSummary &&
            Object.keys(workerData.statusSummary).length > 0 && (
              <div key={currentMonth.toISOString()} className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-3 mb-4">
                  Payment Status Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {Object.entries(workerData.statusSummary).map(
                    ([status, data]) => {
                      const statusColor = getPaymentStatusColor(status);
                      const statusLabel =
                        status === "NOT_PAID"
                          ? "Not Paid"
                          : status.charAt(0) + status.slice(1).toLowerCase();

                      return (
                        <div
                          key={status}
                          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                          <div className={`h-1.5 w-full ${statusColor}`} />
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-800">
                                {statusLabel}
                              </h4>
                              {shouldShowStatusSummary(status) ? (
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {data.count} entry{data.count !== 1 && "s"}
                                </span>
                              ) : (
                                <div
                                  className="w-fit cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                                  onClick={() => toggleStatusSummary(status)}
                                >
                                  <Eye name="Eye" size={16} />
                                </div>
                              )}
                            </div>
                            {shouldShowStatusSummary(status) ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500">
                                    Regular Hours:
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {data.hours?.toFixed(1) || 0}h
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500">
                                    Overtime:
                                  </span>
                                  <span className="font-semibold text-orange-600">
                                    {data.overtime?.toFixed(1) || 0}h
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500">
                                    Total Hours:
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {data.total?.toFixed(1) || 0}h
                                  </span>
                                </div>
                                <div
                                  className="flex justify-between items-center text-sm cursor-pointer w-fit text-red-300"
                                  onClick={() => toggleStatusSummary(status)}
                                >
                                  <X name="X" size={32} />
                                </div>
                              </div>
                            ) : null}
                            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">
                                Amount:
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {(data.amount || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}

          {/* Calendar Grid */}

          <div className="relative">
            <h1 className="text-xl font-semibold text-gray-400 mb-4">
              Labor Card
            </h1>

            {/* Day headers – responsive text size */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
              {calendarDays.map((day, index) => {
                const entry = getEntryForDate(day);
                // const isFutureDate = isAfter(
                //   startOfDay(day),
                //   startOfDay(new Date()),
                // );
                const status = getDayStatus(day);
                const statusStyle = getStatusStyle(status);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isPastDay = isBefore(
                  startOfDay(day),
                  startOfDay(new Date()),
                );

                return (
                  <div
                    key={index}
                    onClick={() => isCurrentMonth && handleDayClick(day)}
                    className={`
            min-h-[60px] sm:min-h-[80px] md:min-h-[100px]
            p-0.5 sm:p-1 md:p-2
            rounded-lg border transition-all cursor-pointer
            ${!isCurrentMonth && "opacity-30"}
            ${isSelected && !workEntrySelection ? "ring-2 ring-blue-500 shadow-lg" : ""}
            ${statusStyle.bgColor}
            ${workEntrySelection && isCurrentMonth && entry ? "hover:scale-105 hover:shadow-md" : ""}
          `}
                  >
                    {/* Top row: day number + status icon (hidden on mobile) + payment dot */}
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`text-sm font-semibold ${!isCurrentMonth ? "text-gray-400" : statusStyle.textColor}`}
                      >
                        {format(day, "dd")}
                      </span>
                      <div className="flex items-center gap-1">
                        {isCurrentMonth && entry && (
                          <div className="hidden sm:block print:hidden">
                            {statusStyle.icon}
                          </div>
                        )}
                        {entry && isCurrentMonth && (
                          <div
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${getPaymentStatusColor(entry.status)}`}
                            title={entry.status || "Unknown"}
                          />
                        )}
                      </div>
                    </div>

                    {/* Main content: work info or absent marker */}
                    <div className="mt-1 text-xs sm:text-sm">
                      {isCurrentMonth && entry ? (
                        // Present day – show hours & overtime on one line (color coded)
                        <div className="flex flex-wrap items-baseline justify-center gap-1 sm:justify-start">
                          <span className="font-medium text-gray-800">
                            {formatHours(entry.hours || 0)}
                          </span>
                          {entry.overtime ||
                            (0 > 0 && (
                              <span className="font-medium text-orange-600">
                                +{formatHours(entry.overtime || 0)}
                              </span>
                            ))}
                        </div>
                      ) : isCurrentMonth && !entry && isPastDay ? (
                        // Absent day (past, no entry) – simple "X"
                        <div className="flex justify-center items-center h-8 sm:h-10">
                          <span className="text-red-500 font-bold text-base sm:text-lg">
                            X
                          </span>
                        </div>
                      ) : isCurrentMonth && !entry && !isPastDay ? (
                        // Future day (no entry yet) – empty placeholder
                        <div className="h-8 sm:h-10"></div>
                      ) : (
                        // Not current month – show month abbreviation
                        <div className="text-xs text-gray-400 text-center">
                          {format(day, "MMM")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
                  <>
                    {!includePending && (
                      <button
                        onClick={() => setPaymentRequestConfirmation(true)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Submit Request ({selectedLaborCardPayments.length})
                      </button>
                    )}
                    <button
                      onClick={() => setShowStatusModal(true)}
                      className="flex-1 bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Change Status ({selectedLaborCardPayments.length})
                    </button>
                  </>
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
                    {formatHours(
                      (selectedEntry.hours || 0) +
                        (selectedEntry.overtime || 0),
                    )}
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

          {/* Status Update Modal */}
          {showStatusModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
              <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Change Entry Status
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select new status for {selectedLaborCardPayments.length} work
                  entry/entries:
                </p>
                <select
                  value={selectedNewStatus}
                  onChange={(e) => {
                    setSelectedNewStatus(e.target.value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-6"
                >
                  <option value="">-- Choose status --</option>

                  {user?.role === "OWNER" && (
                    <>
                      <option value="PENDING">
                        PENDING (make payment request)
                      </option>

                      <option value="APPROVED">
                        APPROVE (Approve the entry)
                      </option>

                      <option value="REJECTED">
                        REJECT (Reject the entry)
                      </option>

                      <option value="PAID">PAY (Mark as paid)</option>
                    </>
                  )}

                  {user?.role === "FOREMAN" && (
                    <>
                      <option value="PENDING">
                        PENDING (make payment request)
                      </option>

                      <option value="NOT_PAID">
                        Reset Entry Status (Reset the entry)
                      </option>

                      <option value="REVIEW">
                        REVIEW (sending for review by admin)
                      </option>
                    </>
                  )}
                </select>{" "}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg ${isLoading ? "cursor-not-allowed cursor-events-none" : ""}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg ${isLoading ? "cursor-not-allowed cursor-events-none" : ""}`}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
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
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-900"></div>
                  <span className="text-xs text-gray-600">Approved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-xs text-gray-600">Rejected</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Under Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaborCard;
