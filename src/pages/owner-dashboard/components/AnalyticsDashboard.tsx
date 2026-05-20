import React, { useState, useEffect, useCallback } from "react";
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

// Matches GET /report/summaries response
interface SiteSummary {
  siteId: string;
  siteName: string;
  location: string | null;
  paymentSummary: Record<string, number>;
  totalPaymentAmount: number;
  workEntrySummary: Record<string, number>;
}

// Matches GET /report/company
interface CompanyReport {
  dateRange: { startDate: string; endDate: string };
  summary: {
    totalHours: number;
    totalOvertime: number;
    uniqueWorkers: number;
    uniqueSites: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
  };
  siteBreakdown: Array<{
    siteId: string;
    siteName: string;
    totalHours: number;
    totalOvertime: number;
    uniqueWorkers: number;
  }>;
}

// Matches GET /report/site/:siteId
interface SiteReport {
  site: { id: string; name: string; location: string | null };
  dateRange: { startDate: string; endDate: string };
  summary: {
    totalHours: number;
    totalOvertime: number;
    uniqueWorkers: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
  };
  workerBreakdown: Array<{
    workerId: string;
    workerName: string;
    totalHours: number;
    totalOvertime: number;
    entriesCount: number;
  }>;
}

// Matches GET /report/workers-summary
interface WorkersSummaryResponse {
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
    totalOvertime: number;
    sitesWorkedCount: number;
    sitesWorked: string[];
    workEntriesCount: number;
    paymentSummary: {
      PAID: number;
      PENDING: number;
      APPROVED: number;
      REVIEW: number;
      REJECTED: number;
    };
  }>;
}

interface AnalyticsDashboardProps {
  initialSiteId?: string;
}

/* ================= COMPONENT ================= */

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  initialSiteId,
}) => {
  const { user } = useAuth();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const endDate = new Date(year, month, 0); // last day of month
    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    };
  }, []);

  // Fetch sites using the summaries endpoint (no date needed)
  const fetchSites = useCallback(async () => {
    if (role === "OWNER") {
      try {
        const response = await authorizePost("report/summaries", {});
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
      // For foreman we still need site name, we can fetch from summaries or assume
      try {
        const response = await authorizePost("report/summaries", {});
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
  }, [role, userSiteId, selectedSiteId]);

  // Main data fetching
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { startDate, endDate } = getMonthDateRange(selectedMonth);
    const queryParams = { startDate, endDate };

    try {
      if (role === "OWNER" && selectedSiteId === "all") {
        // Company report
        const companyData = await authorizePost("report/company", queryParams);
        setCompanyReport(companyData);
        setSiteReport(null);

        // Workers summary (all sites)
        const workersData = await authorizePost(
          "report/workers-summary",
          queryParams,
        );
        setWorkersSummary(workersData);
      } else {
        // Site-specific
        const siteId = role === "FOREMAN" ? userSiteId : selectedSiteId;
        if (siteId && siteId !== "all") {
          const siteData = await authorizePost(
            `report/site/${siteId}`,
            queryParams,
          );
          setSiteReport(siteData);
          setCompanyReport(null);

          const workersData = await authorizePost("report/workers-summary", {
            ...queryParams,
            siteId,
          });
          setWorkersSummary(workersData);
        } else if (role === "OWNER" && selectedSiteId === "all") {
          // Already handled above
        } else {
          throw new Error("No valid site selected");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedSiteId, role, userSiteId, getMonthDateRange]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  //  chart data from companyReport or siteReport
  const getBreakdownData = () => {
    if (companyReport?.siteBreakdown) {
      return companyReport.siteBreakdown.map((site) => ({
        name: site.siteName,
        hours: site.totalHours,
        workers: site.uniqueWorkers,
        cost: site.totalHours * 20, // rough estimate; backend doesn't provide cost per hour
      }));
    }
    if (siteReport?.workerBreakdown) {
      return siteReport.workerBreakdown.map((w) => ({
        name: w.workerName,
        hours: w.totalHours,
        entries: w.entriesCount,
        cost: w.totalHours * 20,
      }));
    }
    return [];
  };

  // Top workers from workersSummary
  const getTopWorkers = () => {
    if (workersSummary?.workers) {
      return workersSummary.workers
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, 5)
        .map((w) => ({
          name: w.workerName,
          hours: w.totalHours,
          site: w.sitesWorkedCount > 1 ? "Multiple sites" : "Single site",
        }));
    }
    return [];
  };

  // Metrics from current data
  const metrics = (() => {
    const summary = companyReport?.summary || siteReport?.summary;
    if (summary) {
      return {
        totalCost: summary.totalPaidAmount + summary.totalPendingAmount,
        totalHours: summary.totalHours,
        avgDailyCost: summary.totalPaidAmount / 30, // rough
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="font-semibold">Error loading data</p>
        <p className="text-sm">{error}</p>
        <Button onClick={fetchAnalytics} className="mt-4">
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Analytics & Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Workforce cost and productivity analysis
            </p>
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
            ${metrics.totalCost.toLocaleString()}
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
            {metrics.totalHours.toLocaleString()} hrs
          </h4>
          <span className="text-xs text-gray-400">regular + overtime</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Avg Daily Cost</p>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">
            ${metrics.avgDailyCost.toLocaleString()}
          </h4>
          <span className="text-xs text-gray-400">based on 30 days</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Active Workers</p>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mt-2">
            {metrics.activeWorkers}
          </h4>
          <span className="text-xs text-gray-400">unique workers</span>
        </div>
      </div>

      {/* Chart: Cost Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {companyReport ? "Cost by Site" : "Cost by Worker"}
        </h3>
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
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Bar dataKey="cost" fill="#3b82f6" name="Labor Cost (est.)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Workers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Top Workers by Hours
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Site
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getTopWorkers().map((worker, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {worker.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {worker.site}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {worker.hours} hrs
                  </td>
                </tr>
              ))}
              {getTopWorkers().length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-6">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Summary Table (Detailed) */}
      {workersSummary && workersSummary.workers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Worker Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Worker
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
                    Approved
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sites
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workersSummary.workers.map((worker) => (
                  <tr key={worker.workerId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {worker.workerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {worker.totalHours}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {worker.totalOvertime}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600">
                      {worker.paymentSummary.PAID}
                    </td>
                    <td className="px-4 py-3 text-sm text-yellow-600">
                      {worker.paymentSummary.PENDING}
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600">
                      {worker.paymentSummary.APPROVED}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {worker.sitesWorkedCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
