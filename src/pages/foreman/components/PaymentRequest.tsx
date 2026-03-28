import React, { useState, useEffect } from "react";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import Loading from "../../../components/ui/Loading";
import ConfirmationModal from "../../../components/ui/Confirmation";
import authorizePostRequest from "../../../api/authorizePostRequest";
import toast from "react-hot-toast";

interface WorkEntry {
  id: string;
  date: string;
  hours: number;
  overtime: number;
  totalHours: number;
  amount: number;
}

interface WorkerPayment {
  worker: {
    id: string;
    name: string;
    wageRating: number;
    role: string;
    job: string;
    isActive: boolean;
  };
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  totalAmount: number;
  entryCount: number;
  entries?: WorkEntry[];
}

interface PaymentSummaryData {
  success: boolean;
  site: {
    id: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  calculation: {
    formula: string;
    description: string;
  };
  summary: {
    totalWorkers: number;
    totalEntries: number;
    totalHours: number;
    totalAmount: number;
  };
  message: string;
  workers: WorkerPayment[];
  warning?: string;
}

interface PaymentRequestCardProps {
  siteId: string;
  pendingRequests?: number;
  onViewHistory: () => void;
  onPaymentSuccess?: () => void;
}

const PaymentRequestCard: React.FC<PaymentRequestCardProps> = ({
  siteId,
  pendingRequests = 0,
  onViewHistory,
  onPaymentSuccess,
}) => {
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    return firstDay.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [paymentSummary, setPaymentSummary] =
    useState<PaymentSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initiatingPayment, setInitiatingPayment] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isCustomRange, setIsCustomRange] = useState<boolean>(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] =
    useState<boolean>(false);

  const getFirstDayOfCurrentMonth = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    return firstDay.toISOString().split("T")[0];
  };

  const getCurrentDate = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  const validateDateRange = (start: string, end: string): boolean => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 31) {
      setDateError(
        `Date range cannot exceed 31 days. Selected range: ${diffDays} days.`,
      );
      return false;
    }

    if (startDateObj > endDateObj) {
      setDateError("Start date cannot be after end date");
      return false;
    }

    setDateError(null);
    return true;
  };

  const fetchPaymentSummary = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (!validateDateRange(startDate, endDate)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: PaymentSummaryData = await authorizePostRequest(
        "payments/site",
        { siteId, endDate, startDate },
      );

      if (data.success) {
        setPaymentSummary(data);
        console.log("Payment summery got successfully");
      } else {
        setError(data.message || "Failed to fetch payment summary");
        console.log(data.message || "Error while getting the payment summary");
        toast.error(data.message || "Failed the payment summary");
        setPaymentSummary(null);
      }
    } catch (err) {
      console.error("Error fetching payment summary:", err);
      setError("Network error. Please try again.");
      setPaymentSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (siteId && !hasLoadedInitialData) {
  //     const firstDay = getFirstDayOfCurrentMonth();
  //     const today = getCurrentDate();
  //     setStartDate(firstDay);
  //     setEndDate(today);
  //     fetchPaymentSummary();
  //     setHasLoadedInitialData(true);
  //   }
  // }, [siteId]);

  const handleDateRangeChange = () => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        setError("Start date cannot be after end date");
        return;
      }
      setIsCustomRange(true);
      fetchPaymentSummary();
    }
  };

  const handleResetToDefaultRange = () => {
    setStartDate(getFirstDayOfCurrentMonth());
    setEndDate(getCurrentDate());
    setIsCustomRange(false);
    setPaymentSummary(null);
    setError(null);
  };

  const initiatePaymentRequest = async () => {
    setInitiatingPayment(true);

    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        await fetchPaymentSummary();

        setTimeout(() => {
          setShowConfirmationModal(false);
          setPaymentSuccess(false);
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initiate payment",
      );
      setShowConfirmationModal(false);
    } finally {
      setInitiatingPayment(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("AED", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <>
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center md:w-12 md:h-12">
              <Icon
                key="dollarSign"
                name="DollarSign"
                size={20}
                color="var(--color-warning)"
                className="md:w-6 md:h-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground md:text-xl">
                Payment Requests
              </h3>
              <p className="caption text-muted-foreground text-xs md:text-sm">
                Submit completed timesheet
              </p>
            </div>
          </div>
        </div>

        {/* Date Range Selection Section */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Payment Period
            </label>
            {isCustomRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToDefaultRange}
                className="text-xs"
              >
                Reset to Current Month
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDateRangeChange}
              className="flex-1"
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              View Summary
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loading size="lg" message="Calculating payment summary..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Icon
                name="AlertCircle"
                size={20}
                color="var(--color-destructive)"
              />
              <div className="flex-1">
                <p className="text-sm text-destructive font-medium">Error</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchPaymentSummary}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Summary Section */}
        {paymentSummary && !loading && (
          <>
            {/* Warning for inactive workers */}
            {paymentSummary.warning && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Icon
                    name="AlertTriangle"
                    size={18}
                    color="var(--color-warning)"
                  />
                  <p className="text-xs text-foreground">
                    {paymentSummary.warning}
                  </p>
                </div>
              </div>
            )}

            {/* Period Information */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Payment Period
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(paymentSummary.period.startDate)} -{" "}
                  {formatDate(paymentSummary.period.endDate)}
                </span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Workers</p>
                <p className="text-xl font-semibold text-foreground">
                  {paymentSummary.summary.totalWorkers}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Entries</p>
                <p className="text-xl font-semibold text-foreground">
                  {paymentSummary.summary.totalEntries}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Hours
                </p>
                <p className="text-xl font-semibold text-foreground">
                  {paymentSummary.summary.totalHours.toFixed(2)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Amount
                </p>
                <p className="text-xl font-semibold text-primary">
                  {formatCurrency(paymentSummary.summary.totalAmount)}
                </p>
              </div>
            </div>

            {/* Workers List - Collapsible/Accordion Style */}
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
              <p className="text-sm font-medium text-foreground mb-2">
                Worker Details
              </p>
              {paymentSummary.workers.map((worker) => (
                <details
                  key={worker.worker.id}
                  className="group bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {worker.worker.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {worker.worker.job} • {worker.entryCount} entries
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency(worker.totalAmount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {worker.totalHours} hrs
                          </p>
                        </div>
                      </div>
                    </div>
                    <Icon
                      name="ChevronDown"
                      size={18}
                      className="ml-3 transition-transform group-open:rotate-180"
                    />
                  </summary>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">
                          Regular Hours:
                        </span>
                        <span className="ml-2 text-foreground font-medium">
                          {worker.regularHours.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Overtime Hours:
                        </span>
                        <span className="ml-2 text-foreground font-medium">
                          {worker.overtimeHours.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Wage Rating:
                        </span>
                        <span className="ml-2 text-foreground font-medium">
                          {formatCurrency(worker.worker.wageRating)}/hr
                        </span>
                      </div>
                    </div>

                    {/* Individual entries for this worker */}
                    <div className="space-y-1 mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Daily Breakdown:
                      </p>
                      {worker.entries && worker.entries.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {worker.entries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0"
                            >
                              <span className="text-muted-foreground">
                                {formatDate(entry.date)}
                              </span>
                              <span className="text-foreground">
                                {entry.totalHours.toFixed(2)} hrs
                              </span>
                              <span className="text-primary font-medium">
                                {formatCurrency(entry.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row mt-4">
              <Button
                onClick={() => setShowConfirmationModal(true)}
                disabled={paymentSummary.summary.totalWorkers === 0}
                className="flex-1"
              >
                <Icon name="Send" size={18} className="mr-2" />
                Initiate Payment Request
              </Button>
              <Button
                onClick={onViewHistory}
                variant="outline"
                className="sm:w-auto"
              >
                View History
              </Button>
            </div>
          </>
        )}

        {/* No Data State */}
        {!paymentSummary &&
          !loading &&
          !error &&
          startDate &&
          endDate &&
          error && (
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Icon
                name="Calendar"
                size={48}
                className="mx-auto mb-3 opacity-50"
              />
              <p className="text-muted-foreground">
                No work entries found for the selected period
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try selecting a different date range
              </p>
            </div>
          )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={() => initiatePaymentRequest()}
          title="Confirm Payment Request"
        />
      )}
    </>
  );
};

export default PaymentRequestCard;
