import React, { useState, useEffect, useCallback } from "react";
import Image from "../../../components/ui/AppImage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import { useAuth } from "../../../../src/app/providers";
import toast from "react-hot-toast";
import authorizePost from "../../../api/authorizePost";

/* ================= TYPES ================= */

type Role = "OWNER" | "FOREMAN" | "WORKER" | "LABORER";

interface Site {
  id: string;
  name: string;
  location?: string;
}

interface SiteSummary {
  siteId: string;
  siteName: string;
  location: string | null;
  paymentSummary: Record<string, number>;
  totalPaymentAmount: number;
  workEntrySummary: Record<string, number>;
}

export interface CompanyReport {
  success: boolean;
  message: string;
  dateRange: { startDate: string; endDate: string };
  summary: {
    totalHours: number;
    totalOvertime: number;
    uniqueWorkers: number;
    uniqueSites: number;
    totalPaidAmount: {
      count: number;
      amount: number;
    };
    totalApprovedAmount: {
      count: number;
      amount: number;
    };
    totalRejectedAmount: {
      count: number;
      amount: number;
    };
    totalPendingAmount: {
      count: number;
      amount: number;
    };
    totalReviewAmount: {
      count: number;
      amount: number;
    };
  };
  siteBreakdown: Array<{
    siteId: string;
    siteName: string;
    totalHours: number;
    totalOvertime: number;
    uniqueWorkers: number;
  }>;
}

export interface SiteReport {
  success: boolean;
  message: string;
  site: { id: string; name: string; location: string | null };
  dateRange: { startDate: string; endDate: string };
  summary: {
    totalHours: number;
    totalOvertime: number;
    uniqueWorkers: number;
    paymentBreakdown: {
      paid: { count: number; amount: number };
      approved: { count: number; amount: number };
      pending: { count: number; amount: number };
      rejected: { count: number; amount: number };
      review: { count: number; amount: number };
    };
  };
  workerBreakdown: Array<{
    workerId: string;
    workerName: string;
    totalHours: number;
    totalOvertime: number;
    entriesCount: number;
  }>;
}

interface WorkersSummaryResponse {
  success: boolean;
  message: string;
  dateRange: { startDate: string; endDate: string };
  filters: { siteId: string | null };
  overallTotals: {
    totalHours: number;
    totalOvertime: number;
    totalWorkers: number;
    totalWorkEntries: number;
  };
  workers: Array<{
    workerId: string;
    workerName: string;
    workerEmail: string;
    workerRole: string;
    workerPhone: string | null;
    wageRating: number | null;
    totalHours: number;
    imageUrl: string | null;
    totalOvertime: number;
    sitesWorkedCount: number;
    sitesWorked: string[];
    workEntriesCount: number;
    paymentSummary: {
      PAID: { count: number; amount: number };
      PENDING: { count: number; amount: number };
      APPROVED: { count: number; amount: number };
      REVIEW: { count: number; amount: number };
      REJECTED: { count: number; amount: number };
    };
  }>;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

interface AnalyticsDashboardProps {
  initialSiteId?: string;
  getSiteReport?: (
    queryParams: { startDate: string; endDate: string },
    siteId: string,
  ) => Promise<SiteReport | undefined>;
  getCompanyReport?: (queryParams: {
    startDate: string;
    endDate: string;
  }) => Promise<CompanyReport | undefined>;
}

/* ================= COMPONENT ================= */

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  initialSiteId,
  getCompanyReport,
  getSiteReport,
}) => {
  const { user, setSiteOrCampanyOverview, siteOrCampanyOverview } = useAuth();
  const role = user?.role as Role;
  const userSiteId = user?.siteId || initialSiteId;

  // State
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedSiteId, setSelectedSiteId] = useState<string>(
    userSiteId || "all",
  );
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mainLoading, setMainLoading] = useState(true); // For KPIs & chart
  const [tableLoading, setTableLoading] = useState(false); // For workers table

  // Pagination & search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [companyReport, setCompanyReport] = useState<CompanyReport | null>(
    null,
  );
  const [siteReport, setSiteReport] = useState<SiteReport | null>(null);
  const [workersSummary, setWorkersSummary] =
    useState<WorkersSummaryResponse | null>(null);

  // Helper: get first and last day of selected month
  const getMonthDateRange = useCallback((yearMonth: string) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }, []);

  // Fetch sites using the summaries endpoint
  const fetchSites = useCallback(async () => {
    if (role === "OWNER") {
      const { startDate, endDate } = getMonthDateRange(selectedMonth);
      try {
        const response = await authorizePost("report/summaries", {
          startDate,
          endDate,
        });
        const siteSummaries: SiteSummary[] = response.data;
        const siteList = siteSummaries.map((s) => ({
          id: s.siteId,
          name: s.siteName,
          location: s.location || undefined,
        }));
        setSites(siteList);
        if (!selectedSiteId || selectedSiteId === "all")
          setSelectedSiteId("all");
      } catch (err) {
        console.error("Failed to fetch sites", err);
        toast.error("Could not load site list");
      }
    } else if (role === "FOREMAN" && userSiteId) {
      try {
        const { startDate, endDate } = getMonthDateRange(selectedMonth);
        const response = await authorizePost("report/summaries", {
          startDate,
          endDate,
        });
        const siteSummaries: SiteSummary[] = response.data;
        const mySite = siteSummaries.find((s) => s.siteId === userSiteId);
        if (mySite) {
          setSites([
            {
              id: mySite.siteId,
              name: mySite.siteName,
              location: mySite.location || undefined,
            },
          ]);
          setSelectedSiteId(userSiteId);
        }
      } catch (err) {
        console.error("Failed to fetch foreman site", err);
      }
    }
  }, [role, userSiteId, selectedSiteId, selectedMonth, getMonthDateRange]);

  // Fetch main analytics (company/site report) - used for KPIs and charts
  const fetchMainAnalytics = useCallback(async () => {
    setMainLoading(true);
    const { startDate, endDate } = getMonthDateRange(selectedMonth);
    const queryParams = { startDate, endDate };

    try {
      if (role === "OWNER" && selectedSiteId === "all" && getCompanyReport) {
        const companyData = await getCompanyReport(queryParams);
        setCompanyReport(companyData ? companyData : null);
        setSiteReport(null);
        // setSiteOrCampanyOverview((prev) => ({
        //   ...prev,
        //   PendingPayments: companyData.summary.totalPendingAmount,
        //   PaidPayments: companyData.summary.totalPaidAmount,
        //   ApprovedPayments: companyData.summary.totalApprovedAmount,
        //   RejectedPayments: companyData.summary.totalRejectedAmount,
        //   ReviewPayments: companyData.summary.totalReviewAmount,
        //   TotalWorkers: companyData.summary.uniqueWorkers,
        //   TotalNumberOfSites: companyData.summary.uniqueSites,
        //   TotalHours:
        //     companyData.summary.totalHours + companyData.summary.totalOvertime,
        // }));
      } else {
        const siteId = role === "FOREMAN" ? userSiteId : selectedSiteId;
        if (siteId && siteId !== "all" && getSiteReport) {
          const siteData = await getSiteReport(queryParams, selectedSiteId);
          setSiteReport(siteData ? siteData : null);
          setCompanyReport(null);
          // setSiteOrCampanyOverview((prev) => ({
          //   ...prev,
          //   PendingPayments: siteData.summary.paymentBreakdown.pending,
          //   PaidPayments: siteData.summary.paymentBreakdown.paid,
          //   ApprovedPayments: siteData.summary.paymentBreakdown.approved,
          //   RejectedPayments: siteData.summary.paymentBreakdown.rejected,
          //   ReviewPayments: siteData.summary.paymentBreakdown.review,
          //   TotalWorkers: siteData.summary.uniqueWorkers,
          //   TotalHours:
          //     siteData.summary.totalHours + siteData.summary.totalOvertime,
          // }));
        } else if (role === "OWNER" && selectedSiteId === "all") {
        } else {
          throw new Error("No valid site selected");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load main analytics");
      console.error(err);
    } finally {
      setMainLoading(false);
    }
  }, [selectedMonth, selectedSiteId, role, userSiteId, getMonthDateRange]);

  // Fetch workers summary (supports search, pagination)
  const fetchWorkersSummary = useCallback(async () => {
    setTableLoading(true);
    const { startDate, endDate } = getMonthDateRange(selectedMonth);
    const queryParams: any = { startDate, endDate, page, limit };

    if (searchTerm) {
      queryParams.search = searchTerm;
    }

    if (role === "OWNER" && selectedSiteId !== "all") {
      queryParams.siteId = selectedSiteId;
    } else if (role === "FOREMAN" && userSiteId) {
      queryParams.siteId = userSiteId;
    }

    try {
      const workersData = await authorizePost(
        "report/workers-summary",
        queryParams,
      );
      setWorkersSummary(workersData);
    } catch (err: any) {
      toast.error(err.message || "Failed to load workers data");
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  }, [
    selectedMonth,
    selectedSiteId,
    role,
    userSiteId,
    page,
    limit,
    searchTerm,
    getMonthDateRange,
  ]);

  // Combined load for initial or major changes (month/site)
  const loadDashboardData = useCallback(async () => {
    setError(null);
    await fetchMainAnalytics();
    await fetchWorkersSummary();
  }, [fetchMainAnalytics, fetchWorkersSummary]);

  // Fetch sites on month change
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Reload everything when month or site (for owner) changes
  useEffect(() => {
    setPage(1);
    loadDashboardData();
  }, [loadDashboardData, selectedMonth, selectedSiteId]);

  // Reload workers only when searchTerm, page, or limit changes
  useEffect(() => {
    if (!mainLoading) {
      fetchWorkersSummary();
    }
  }, [searchTerm, page, limit]);

  const formatReportStatus = (status: string) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Chart data from companyReport or siteReport
  const getBreakdownData = () => {
    if (companyReport?.siteBreakdown) {
      return companyReport.siteBreakdown.map((site) => ({
        name: site.siteName,
        hours: site.totalHours + site.totalOvertime,
        workers: site.uniqueWorkers,
        cost: site.totalHours * 10,
        TotalHours: site.totalHours + site.totalOvertime,
      }));
    }

    if (siteReport?.summary.paymentBreakdown) {
      return Object.entries(siteReport.summary.paymentBreakdown).map(
        ([status, breakdown]) => ({
          name: formatReportStatus(status),
          count: breakdown.count,
          amount: breakdown.amount,
        }),
      );
    }

    return [];
  };

  // Top workers (client-side – based on currently loaded workers)
  const getTopWorkersByHours = () => {
    if (!workersSummary?.workers) return [];
    return [...workersSummary.workers]
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 5);
  };

  const getTopWorkersByCost = () => {
    if (!workersSummary?.workers) return [];
    return [...workersSummary.workers]
      .sort((a, b) => {
        const costA = Object.values(a.paymentSummary).reduce(
          (sum, s) => sum + s.amount,
          0,
        );
        const costB = Object.values(b.paymentSummary).reduce(
          (sum, s) => sum + s.amount,
          0,
        );
        return costB - costA;
      })
      .slice(0, 5);
  };

  // Metrics from current data (show placeholders when loading)
  const metrics = (() => {
    if (mainLoading) {
      return { totalCost: 0, totalHours: 0, avgDailyCost: 0, activeWorkers: 0 };
    }
    if (companyReport?.summary) {
      const summary = companyReport.summary;
      return {
        totalPaymentsCost:
          summary.totalPaidAmount.amount +
          summary.totalPendingAmount.amount +
          summary.totalApprovedAmount.amount +
          summary.totalRejectedAmount.amount +
          summary.totalReviewAmount.amount,
        totalHours: summary.totalHours,
        avgDailyCost: summary.totalPaidAmount / 30,
        activeWorkers: summary.uniqueWorkers,
      };
    }

    if (siteReport?.summary) {
      const summary = siteReport.summary;
      const totalAmount = Object.values(summary.paymentBreakdown).reduce(
        (sum, status) => sum + status.amount,
        0,
      );
      return {
        totalCost: totalAmount,
        totalHours: summary.totalHours,
        avgDailyCost: totalAmount / 30,
        activeWorkers: summary.uniqueWorkers,
      };
    }

    return { totalCost: 0, totalHours: 0, avgDailyCost: 0, activeWorkers: 0 };
  })();

  // Export handlers (stubs)
  const handleExportPDF = () => alert("Export PDF - implement with react-pdf");
  const handleExportExcel = () => alert("Export Excel - implement with xlsx");

  // Role‑based site selector options
  const siteOptions = (() => {
    if (role === "FOREMAN") return [{ value: userSiteId!, label: "My Site" }];
    return [
      { value: "all", label: "All Sites" },
      ...sites.map((site) => ({ value: site.id, label: site.name })),
    ];
  })();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-semibold">Error loading data</p>
        <p className="text-sm">{error}</p>
        <Button onClick={loadDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-background min-h-screen">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Analytics & Reports
            </h1>
            {mainLoading && (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <Select
            options={siteOptions}
            value={selectedSiteId}
            onChange={(val) => setSelectedSiteId(val)}
            placeholder="Select site"
            disabled={role === "FOREMAN"}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Labor Cost
            </p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">
            {mainLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 inline" />
            ) : (
              `$${metrics ? metrics?.totalCost?.toLocaleString() : 0}`
            )}
          </h4>
          <span className="text-xs text-gray-400">this period</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Hours Worked
            </p>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">
            {mainLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 inline" />
            ) : (
              `${metrics.totalHours.toLocaleString()} hrs`
            )}
          </h4>
          <span className="text-xs text-gray-400">regular + overtime</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Avg Daily Cost</p>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">
            {mainLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 inline" />
            ) : (
              `$${metrics.avgDailyCost.toLocaleString()}`
            )}
          </h4>
          <span className="text-xs text-gray-400">based on 30 days</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Active Workers</p>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">
            {mainLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 inline" />
            ) : (
              metrics.activeWorkers
            )}
          </h4>
          <span className="text-xs text-gray-400">unique workers</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {companyReport ? "Cost by Site" : "Payment Status Breakdown"}
          </h3>
          {mainLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          )}
        </div>
        {mainLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getBreakdownData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis yAxisId="left" />
              {siteReport && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
              )}
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Count") return [value, name];
                  return [`$${Number(value).toLocaleString()}`, name];
                }}
              />
              <Legend />
              {companyReport ? (
                <Bar dataKey="cost" fill="#3b82f6" name="Labor Cost (est.)" />
              ) : (
                <>
                  <Bar
                    yAxisId="left"
                    dataKey="amount"
                    fill="#3b82f6"
                    name="Amount"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="count"
                    fill="#10b981"
                    name="Count"
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Workers Sections - show spinners while tableLoading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top by Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              ⏱️ Top Workers by Hours
            </h3>
            {tableLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </div>
          {getTopWorkersByHours().length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data available</p>
          ) : (
            <div className="space-y-3">
              {getTopWorkersByHours().map((worker, idx) => (
                <div
                  key={worker.workerId}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src={worker.imageUrl || ""}
                        alt={worker.workerName}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {worker.workerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {worker.totalHours} hrs
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-600">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top by Cost */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              💰 Top Workers by Cost
            </h3>
            {tableLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </div>
          {getTopWorkersByCost().length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data available</p>
          ) : (
            <div className="space-y-3">
              {getTopWorkersByCost().map((worker, idx) => {
                const totalCost = Object.values(worker.paymentSummary).reduce(
                  (sum, s) => sum + s.amount,
                  0,
                );
                return (
                  <div
                    key={worker.workerId}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <Image
                          src={worker.imageUrl || ""}
                          alt={worker.workerName}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {worker.workerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${totalCost.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Worker Summary Table with Search & Pagination */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Worker Summary
            </h3>
            {tableLoading && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
              style={{ cursor: tableLoading ? "progress" : "auto" }}
            />
          </div>
        </div>
        {workersSummary && workersSummary.workers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Avatar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Worker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Overtime
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pending
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Review
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rejected
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Approved
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Overall Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sites
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workersSummary.workers.map((worker) => {
                  const totalCost = Object.values(worker.paymentSummary).reduce(
                    (sum, s) => sum + s.amount,
                    0,
                  );
                  return (
                    <tr key={worker.workerId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={worker.imageUrl || ""}
                            alt={worker.workerName}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {worker.workerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {worker.wageRating ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {worker.totalHours}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {worker.totalOvertime}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600">
                        {worker.paymentSummary.PAID.count} / $
                        {worker.paymentSummary.PAID.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-yellow-600">
                        {worker.paymentSummary.PENDING.count} / $
                        {worker.paymentSummary.PENDING.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        {worker.paymentSummary.REVIEW.count} / $
                        {worker.paymentSummary.REVIEW.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        {worker.paymentSummary.REJECTED.count} / $
                        {worker.paymentSummary.REJECTED.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        {worker.paymentSummary.APPROVED.count} / $
                        {worker.paymentSummary.APPROVED.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600">
                        ${totalCost.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {worker.sitesWorkedCount}
                      </td>
                    </tr>
                  );
                })}
                {workersSummary.workers.length === 0 && (
                  <tr>
                    <td colSpan={12} className="text-center text-gray-400 py-6">
                      No workers match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              disabled={tableLoading}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Page {workersSummary ? workersSummary.pagination.currentPage : 1}{" "}
              of {workersSummary ? workersSummary.pagination.totalPages : 1}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || tableLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      workersSummary ? workersSummary.pagination.totalPages : 1,
                      p + 1,
                    ),
                  )
                }
                disabled={
                  page === workersSummary?.pagination.totalPages || tableLoading
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
