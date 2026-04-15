import React, { useState, useEffect, useCallback } from "react";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import authorizePost from "../../../api/authorizePost";
import { toast } from "react-hot-toast"; // or your preferred toast library
import { ca } from "date-fns/locale";

/* ================= TYPES ================= */

type PaymentStatus = "PENDING" | "APPROVED" | "PAID" | "REVIEW" | "REJECTED";

interface PaymentData {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  siteName: string;
  month: number;
  year: number;
  totalHours: number;
  overtime: number;
  baseAmount: number;
  overtimePay: number;
  totalAmount: number;
  status: PaymentStatus;
  batch_id: string | null;
  approvedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface BatchSummary {
  batchId: string;
  createdAt: string;
  siteName: string;
  totalPayments: number;
  totalAmount: number;
  status: string;
  breakdown: {
    pending: number;
    approved: number;
    paid: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FilterOptions {
  status: string;
  siteId: string;
  batchId: string;
  startDate: string;
  endDate: string;
  search: string;
}

type SortField =
  | "workerName"
  | "siteName"
  | "totalAmount"
  | "status"
  | "createdAt";
type SortOrder = "asc" | "desc";

/* ================= API SERVICE ================= */

const API_BASE = "/api"; // Adjust to your API base URL

const paymentService = {
  // Get all payments with pagination, filtering, sorting
  getPayments: async (
    page: number = 1,
    limit: number = 20,
    filters: Partial<FilterOptions> = {},
    sortField: SortField = "createdAt",
    sortOrder: SortOrder = "desc",
  ): Promise<{
    success: boolean;
    message: string;
    payments: PaymentData[];
    pagination: PaginationInfo;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortField,
      sortOrder,
      ...(filters.status &&
        filters.status !== "all" && { status: filters.status }),
      ...(filters.siteId && { siteId: filters.siteId }),
      ...(filters.batchId && { batchId: filters.batchId }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.search && { search: filters.search }),
    });

    const response = await authorizePost(`payments?${params}`, {});
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch payments");
      toast.error(response.message || "Failed to load payments");
      return {
        success: false,
        message: response.message || "Failed to fetch payments",
        payments: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
    return response;
  },

  // Get all batches for a site
  getBatches: async (siteId?: string): Promise<BatchSummary[]> => {
    const params = new URLSearchParams();
    if (siteId) params.append("siteId", siteId);

    const response: {
      success: boolean;
      message: string;
      batches: BatchSummary[];
    } = await authorizePost(`payments/batches?${params}`, {});
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch batches");
      toast.error(response.message || "Failed to load batches");
      return [];
    }
    return response.batches;
  },

  // Approve a single payment
  approvePayment: async (paymentId: string): Promise<boolean> => {
    try {
      const response: {
        success: boolean;
        message: string;
      } = await authorizePost(`payments/${paymentId}/approve`, {});
      if (!response.success) {
        throw new Error("Failed to approve payment");
        toast.error(response.message || "Failed to approve payment");
        return false;
      }
      toast.success("Payment approved");
      return true;
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment");
      return false;
    }
  },

  // Approve multiple payments (batch)
  approveBatch: async (paymentIds: string[]): Promise<boolean> => {
    try {
      const response: {
        success: boolean;
        message: string;
      } = await authorizePost(`payments/approve-batch`, { paymentIds });
      if (!response.success) {
        throw new Error("Failed to approve payments");
        toast.error(response.message || "Failed to approve payments");
      }
      toast.success("Payments approved");
      return true;
    } catch (error) {
      console.error("Error approving payments:", error);
      toast.error("Failed to approve payments");
      return false;
    }
  },

  // Mark payment as paid
  markAsPaid: async (paymentId: string): Promise<boolean> => {
    const response: {
      success: boolean;
      message: string;
    } = await authorizePost(`payments/${paymentId}/paid`, {});
    if (!response.success) {
      toast.error(response.message || "Failed to mark payment as paid");
      throw new Error("Failed to mark payment as paid");
      return false;
    }
    return true;
  },

  // Mark multiple payments as paid
  markMultipleAsPaid: async (paymentIds: string[]): Promise<boolean> => {
    const response: {
      success: boolean;
      message: string;
    } = await authorizePost(`payments/mark-paid-batch`, { paymentIds });

    if (!response.success) {
      toast.error(response.message || "Failed to mark payments as paid");
      throw new Error("Failed to mark payments as paid");
    }
    if (response.success) {
      return true;
    }
    return false;
  },

  // Send payment back for review
  reviewPayment: async (
    paymentId: string,
    reviewNotes?: string,
  ): Promise<void> => {
    const response = await fetch(`${API_BASE}/payments/${paymentId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewNotes }),
    });
    if (!response.ok) throw new Error("Failed to send payment for review");
  },

  // Reject payment
  rejectPayment: async (paymentId: string, reason?: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/payments/${paymentId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error("Failed to reject payment");
  },

  // Get available sites for filtering
  getSites: async (): Promise<
    {
      id: string;
      name: string;
    }[]
  > => {
    const response: {
      success: boolean;
      message: string;
      sites: { id: string; name: string }[];
    } = await authorizePost(`sites/allSitesIdsAndNames`, {});
    if (!response.success) {
      throw new Error("Failed to fetch sites");
    }
    if (response && response.sites && response.sites.length === 0) {
      return [];
    }
    return response.sites;
  },
};

/* ================= COMPONENT ================= */

const PaymentApprovalQueue: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"payments" | "batches">("payments");
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  // Pagination
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    siteId: "",
    batchId: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // Sorting
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // UI State
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPaymentForReview, setSelectedPaymentForReview] =
    useState<PaymentData | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await paymentService.getPayments(
        pagination.page,
        pagination.limit,
        filters,
        sortField,
        sortOrder,
      );
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch payments");
        toast.error(result.message || "Failed to load payments");
      }
      setPayments(result.payments);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sortField, sortOrder]);

  // Fetch batches
  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const result = await paymentService.getBatches(
        filters.siteId || undefined,
      );
      setBatches(result);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  }, [filters.siteId]);

  // Fetch sites for filter
  const fetchSites = useCallback(async () => {
    try {
      const result = await paymentService.getSites();

      result && result.length > 0 ? setSites(result) : setSites([]);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    if (viewMode === "payments") {
      fetchPayments();
    } else {
      fetchBatches();
    }
  }, [viewMode, fetchPayments, fetchBatches]);

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(payments.map((p) => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    }
  };

  const handleBatchApprove = async () => {
    if (selectedPayments.length === 0) {
      toast.error("No payments selected");
      return;
    }

    setActionLoading("batch-approve");
    try {
      await paymentService.approveBatch(selectedPayments);
      toast.success(`Approved ${selectedPayments.length} payments`);
      setSelectedPayments([]);
      fetchPayments();
    } catch (error) {
      console.error("Error approving payments:", error);
      toast.error("Failed to approve payments");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatchMarkPaid = async () => {
    if (selectedPayments.length === 0) {
      toast.error("No payments selected");
      return;
    }

    setActionLoading("Approving a Batch");
    try {
      const results = await paymentService.markMultipleAsPaid(selectedPayments);
      if (results) {
        toast.success(`Marked ${selectedPayments.length} payments as paid`);
      }
      setSelectedPayments([]);
      fetchPayments();
    } catch (error) {
      console.error("Error marking payments as paid:", error);
      toast.error("Failed to mark payments as paid");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveSingle = async (payment: PaymentData) => {
    setActionLoading(payment.id);
    try {
      const response = await paymentService.approvePayment(payment.id);
      if (response) {
        toast.success(`Approved payment for ${payment.workerName}`);
      }
      fetchPayments();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("Failed to approve payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkPaidSingle = async (payment: PaymentData) => {
    const transactionRef = prompt("Enter transaction reference (optional):");
    setActionLoading(payment.id);
    try {
      const response = await paymentService.markAsPaid(payment.id);
      if (response) {
        toast.success(`Marked payment for ${payment.workerName} as paid`);
        fetchPayments();
      }
    } catch (error) {
      console.error("Error marking payment as paid:", error);
      toast.error("Failed to mark payment as paid");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedPaymentForReview) return;

    setActionLoading(selectedPaymentForReview.id);
    try {
      await paymentService.reviewPayment(
        selectedPaymentForReview.id,
        reviewNotes,
      );
      toast.success(
        `Sent payment for ${selectedPaymentForReview.workerName} back for review`,
      );
      setShowReviewModal(false);
      setReviewNotes("");
      setSelectedPaymentForReview(null);
      fetchPayments();
    } catch (error) {
      console.error("Error sending for review:", error);
      toast.error("Failed to send payment for review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSingle = async (payment: PaymentData) => {
    const reason = prompt("Enter rejection reason (optional):");
    setActionLoading(payment.id);
    try {
      await paymentService.rejectPayment(payment.id, reason || undefined);
      toast.success(`Rejected payment for ${payment.workerName}`);
      fetchPayments();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error("Failed to reject payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getStatusColor = (status: PaymentStatus): string => {
    const colors: Record<PaymentStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      PAID: "bg-blue-100 text-blue-800",
      REVIEW: "bg-orange-100 text-orange-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.PENDING;
  };

  const getStatusIcon = (status: PaymentStatus): string => {
    const icons: Record<PaymentStatus, string> = {
      PENDING: "Clock",
      APPROVED: "CheckCircle",
      PAID: "CreditCard",
      REVIEW: "AlertCircle",
      REJECTED: "XCircle",
    };
    return icons[status] || "Clock";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                Payment Approval Queue
              </h3>
              <p className="text-sm text-muted-foreground">
                {viewMode === "payments"
                  ? `${pagination.total} payment${pagination.total !== 1 ? "s" : ""} found`
                  : `${batches.length} batch${batches.length !== 1 ? "es" : ""} found`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={viewMode === "payments" ? "primary" : "secondary"}
                onClick={() => setViewMode("payments")}
                size="sm"
              >
                Payments
              </Button>
              <Button
                variant={viewMode === "batches" ? "primary" : "secondary"}
                onClick={() => setViewMode("batches")}
                size="sm"
              >
                Batches
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              className="px-3 py-2 border rounded-md"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
              <option value="REVIEW">Review</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              className="px-3 py-2 border rounded-md"
              value={filters.siteId}
              onChange={(e) => handleFilterChange("siteId", e.target.value)}
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="px-3 py-2 border rounded-md"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              placeholder="Start Date"
            />

            <input
              type="date"
              className="px-3 py-2 border rounded-md"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              placeholder="End Date"
            />

            <input
              type="text"
              className="px-3 py-2 border rounded-md md:col-span-2 lg:col-span-4"
              placeholder="Search by worker name or site..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>

        {/* Batch Actions */}
        {selectedPayments.length > 0 && viewMode === "payments" && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {selectedPayments.length} payment
              {selectedPayments.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleBatchApprove}
                disabled={actionLoading === "batch-approve"}
                size="sm"
              >
                {actionLoading === "batch-approve"
                  ? "Approving..."
                  : "Approve Selected"}
              </Button>
              <Button
                onClick={handleBatchMarkPaid}
                disabled={actionLoading === "batch-paid"}
                variant="success"
                size="sm"
              >
                {actionLoading === "batch-paid"
                  ? "Processing..."
                  : "Mark as Paid"}
              </Button>
              <Button
                onClick={() => setSelectedPayments([])}
                variant="secondary"
                size="sm"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payments View */}
      {viewMode === "payments" && (
        <>
          {/* Sort Bar */}
          <div className="px-4 py-2 border-b border-border bg-muted/30 flex flex-wrap gap-3 text-sm">
            <button
              onClick={() => handleSort("workerName")}
              className={`flex items-center gap-1 ${sortField === "workerName" ? "font-semibold text-primary" : ""}`}
            >
              Worker Name{" "}
              {sortField === "workerName" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("siteName")}
              className={`flex items-center gap-1 ${sortField === "siteName" ? "font-semibold text-primary" : ""}`}
            >
              Site{" "}
              {sortField === "siteName" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("totalAmount")}
              className={`flex items-center gap-1 ${sortField === "totalAmount" ? "font-semibold text-primary" : ""}`}
            >
              Amount{" "}
              {sortField === "totalAmount" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("status")}
              className={`flex items-center gap-1 ${sortField === "status" ? "font-semibold text-primary" : ""}`}
            >
              Status{" "}
              {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("createdAt")}
              className={`flex items-center gap-1 ${sortField === "createdAt" ? "font-semibold text-primary" : ""}`}
            >
              Date{" "}
              {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>

          {/* Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left w-12">
                    <Checkbox
                      checked={
                        selectedPayments.length === payments.length &&
                        payments.length > 0
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSelectAll(e.target.checked)
                      }
                      indeterminate={
                        selectedPayments.length > 0 &&
                        selectedPayments.length < payments.length
                      }
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Worker
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Site
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    CreatedAt
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Batch ID
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedPayments.includes(payment.id)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSelectPayment(payment.id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {payment.workerName}
                      </td>
                      <td className="px-4 py-3">{payment.siteName}</td>
                      <td className="px-4 py-3">{`${payment.createdAt.split("T")[0]}`}</td>
                      <td className="px-4 py-3 text-right">
                        {payment.totalHours.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatCurrency(payment.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                        >
                          <Icon name="DollarSign" size={12} />
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {payment.batch_id ? (
                          <span className="text-xs font-mono">
                            {payment.batch_id.slice(0, 8)}...
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Single
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {payment.status === "PENDING" && (
                            <Button
                              onClick={() => handleApproveSingle(payment)}
                              disabled={actionLoading === payment.id}
                              size="sm"
                              variant="primary"
                            >
                              Approve
                            </Button>
                          )}
                          {(payment.status === "PENDING" ||
                            payment.status === "APPROVED") && (
                            <Button
                              onClick={() => handleMarkPaidSingle(payment)}
                              disabled={actionLoading === payment.id}
                              size="sm"
                              variant="success"
                            >
                              Pay
                            </Button>
                          )}
                          {payment.status === "PENDING" && (
                            <>
                              <Button
                                onClick={() => {
                                  setSelectedPaymentForReview(payment);
                                  setShowReviewModal(true);
                                }}
                                disabled={actionLoading === payment.id}
                                size="sm"
                                variant="warning"
                              >
                                Review
                              </Button>
                              <Button
                                onClick={() => handleRejectSingle(payment)}
                                disabled={actionLoading === payment.id}
                                size="sm"
                                variant="danger"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No payments found
              </div>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} className="p-4 border-b border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{payment.workerName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {payment.siteName}
                      </p>
                    </div>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSelectPayment(payment.id, e.target.checked)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Period:</span>{" "}
                      {payment.month}/{payment.year}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hours:</span>{" "}
                      {payment.totalHours.toFixed(2)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>{" "}
                      {formatCurrency(payment.totalAmount)}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                      >
                        <Icon name="DollarSign" size={12} />
                        {payment.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {payment.status === "PENDING" && (
                      <Button
                        onClick={() => handleApproveSingle(payment)}
                        disabled={actionLoading === payment.id}
                        size="sm"
                      >
                        Approve
                      </Button>
                    )}
                    {(payment.status === "PENDING" ||
                      payment.status === "APPROVED") && (
                      <Button
                        onClick={() => handleMarkPaidSingle(payment)}
                        disabled={actionLoading === payment.id}
                        size="sm"
                        variant="success"
                      >
                        Pay
                      </Button>
                    )}
                    {payment.status === "PENDING" && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedPaymentForReview(payment);
                            setShowReviewModal(true);
                          }}
                          disabled={actionLoading === payment.id}
                          size="sm"
                          variant="warning"
                        >
                          Review
                        </Button>
                        <Button
                          onClick={() => handleRejectSingle(payment)}
                          disabled={actionLoading === payment.id}
                          size="sm"
                          variant="danger"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  size="sm"
                  variant="secondary"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          variant={
                            pagination.page === pageNum
                              ? "primary"
                              : "secondary"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    },
                  )}
                </div>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  size="sm"
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
              <select
                className="px-2 py-1 border rounded-md text-sm"
                value={pagination.limit}
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                    page: 1,
                  }))
                }
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          )}
        </>
      )}

      {/* Batches View */}
      {viewMode === "batches" && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Batch ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Site
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Created
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Payments
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Breakdown
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    Loading...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No batches found
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr
                    key={batch.batchId}
                    className="border-b border-border hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-sm">
                      {batch.batchId.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3">{batch.siteName}</td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(batch.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {batch.totalPayments}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(batch.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          batch.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : batch.status === "PARTIALLY_APPROVED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center text-xs">
                        <span className="text-yellow-600">
                          P: {batch.breakdown.pending}
                        </span>
                        <span className="text-green-600">
                          A: {batch.breakdown.approved}
                        </span>
                        <span className="text-blue-600">
                          PD: {batch.breakdown.paid}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => {
                            setSelectedBatch(batch.batchId);
                            setFilters((prev) => ({
                              ...prev,
                              batchId: batch.batchId,
                            }));
                            setViewMode("payments");
                          }}
                          size="sm"
                          variant="secondary"
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedPaymentForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send for Review</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Send payment for {selectedPaymentForReview.workerName} back to
              foreman for review
            </p>
            <textarea
              className="w-full px-3 py-2 border rounded-md mb-4"
              rows={4}
              placeholder="Enter review notes (optional)..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewNotes("");
                  setSelectedPaymentForReview(null);
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewSubmit}
                disabled={actionLoading === selectedPaymentForReview.id}
              >
                Submit for Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentApprovalQueue;
