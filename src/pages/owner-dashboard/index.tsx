import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "../../components/ui/AuthenticatedHeader";
import RoleGuard from "../../components/ui/RoleGuard";
import LoadingBoundary from "../../components/ui/LoadingBoundary";
import MetricCard from "./components/MetricCard";
import SiteModal from "./components/CreateSite";
import SiteOverviewTable from "./components/SiteOverviewTable";
import PaymentApprovalQueue from "./components/PaymentApprovalQueue";
import UserManagementPanel from "./components/UserManagementPanel";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Icon from "../../components/ui/AppIconl";
import Button from "../../components/ui/Button";
import { useAuth } from "../../app/providers";
import authorizePost from "../../api/authorizePost";
import type {
  SiteReport,
  CompanyReport,
} from "./components/AnalyticsDashboard";
import type { Payment, Site, User, NewUser } from "../../types/SharedTypes";
import toast from "react-hot-toast";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  // create site modal state
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<string | null>(null);

  // overview states
  const [siteOrCampanyOverview, setSiteOrCampanyOverview] = useState<{
    TotolPayments: { count: number; amount: number };
    PendingPayments: { count: number; amount: number };
    ApprovedPayments: { count: number; amount: number };
    RejectedPayments: { count: number; amount: number };
    PaidPayments: { count: number; amount: number };
    ReviewPayments: { count: number; amount: number };
    TotalNumberOfSites: number;
    TotalWorkers: number;
    TotalHours: number;
  }>({
    TotolPayments: { count: 0, amount: 0 },
    PendingPayments: { count: 0, amount: 0 },
    ApprovedPayments: { count: 0, amount: 0 },
    RejectedPayments: { count: 0, amount: 0 },
    PaidPayments: { count: 0, amount: 0 },
    ReviewPayments: { count: 0, amount: 0 },
    TotalNumberOfSites: 0,
    TotalWorkers: 0,
    TotalHours: 0,
  });

  const getCompany_report = async (queryParams: {
    startDate: string;
    endDate: string;
  }): Promise<CompanyReport | undefined> => {
    try {
      const companyData: CompanyReport = await authorizePost(
        "report/company",
        queryParams,
      );
      if (!companyData.success) {
        console.log(
          companyData.message || "Failed to get the Overview information",
        );
        toast.error(
          companyData.message || "Failed to get the Overview information",
        );
        setSiteOrCampanyOverview({
          TotolPayments: { count: 0, amount: 0 },
          PendingPayments: { count: 0, amount: 0 },
          ApprovedPayments: { count: 0, amount: 0 },
          RejectedPayments: { count: 0, amount: 0 },
          PaidPayments: { count: 0, amount: 0 },
          ReviewPayments: { count: 0, amount: 0 },
          TotalNumberOfSites: 0,
          TotalWorkers: 0,
          TotalHours: 0,
        });
        return companyData;
      }
      setSiteOrCampanyOverview((prev) => ({
        ...prev,
        PendingPayments: companyData.summary.totalPendingAmount,
        PaidPayments: companyData.summary.totalPaidAmount,
        ApprovedPayments: companyData.summary.totalApprovedAmount,
        RejectedPayments: companyData.summary.totalRejectedAmount,
        ReviewPayments: companyData.summary.totalReviewAmount,
        TotalWorkers: companyData.summary.uniqueWorkers,
        TotalNumberOfSites: companyData.summary.uniqueSites,
        TotalHours:
          companyData.summary.totalHours + companyData.summary.totalOvertime,
      }));
      return companyData;
    } catch (error) {
      console.log(error);
      toast.error("An error occured during company overview update");
    }
  };

  const getSite_report = async (
    queryParams: { startDate: string; endDate: string },
    siteId: string,
  ): Promise<SiteReport | undefined> => {
    try {
      const siteData: SiteReport = await authorizePost(
        `report/site/${siteId}`,
        queryParams,
      );
      if (!siteData.success) {
        setSiteOrCampanyOverview({
          TotolPayments: { count: 0, amount: 0 },
          PendingPayments: { count: 0, amount: 0 },
          ApprovedPayments: { count: 0, amount: 0 },
          RejectedPayments: { count: 0, amount: 0 },
          PaidPayments: { count: 0, amount: 0 },
          ReviewPayments: { count: 0, amount: 0 },
          TotalNumberOfSites: 0,
          TotalWorkers: 0,
          TotalHours: 0,
        });
        console.log(siteData.message || "Failed to Fetch site data");
        toast.error(siteData.message || "Failed to Fetch site data");
        return siteData;
      }
      setSiteOrCampanyOverview((prev) => ({
        ...prev,
        PendingPayments: siteData.summary.paymentBreakdown.pending,
        PaidPayments: siteData.summary.paymentBreakdown.paid,
        ApprovedPayments: siteData.summary.paymentBreakdown.approved,
        RejectedPayments: siteData.summary.paymentBreakdown.rejected,
        ReviewPayments: siteData.summary.paymentBreakdown.review,
        TotalWorkers: siteData.summary.uniqueWorkers,
        TotalHours:
          siteData.summary.totalHours + siteData.summary.totalOvertime,
      }));

      return siteData;
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch site data");
    }
  };

  // context states
  // const { user, setSiteOrCampanyOverview, siteOrCampanyOverview } = useAuth();

  // creating site functions
  const handleCreateSite = () => {
    setEditingSite(null);
    setIsSiteModalOpen(true);
  };

  const handleEditSite = (site) => {
    setEditingSite(site);
    setIsSiteModalOpen(true);
  };

  const handleViewSiteDetails = (site: Site) => {
    console.log("Viewing site details:", site);
  };

  const handleManageWorkers = (site: Site) => {
    console.log("Managing workers for site:", site);
  };

  const handleApprovePayment = (payment: Payment) => {
    console.log("Approving payment:", payment);
  };

  const handleRejectPayment = (payment: Payment) => {
    console.log("Rejecting payment:", payment);
  };

  const handleCreateUser = (userData: NewUser) => {
    console.log("Creating user:", userData);
  };

  const handleBlockUser = (user: User) => {
    console.log("Blocking user:", user);
  };

  const handleUnblockUser = (user: User) => {
    console.log("Unblocking user:", user);
  };

  const handleExportPDF = () => {
    console.log("Exporting analytics as PDF");
  };

  const handleExportExcel = () => {
    console.log("Exporting analytics as Excel");
  };

  const tabs = [
    { id: "analytics", label: "Analytics & Reports", icon: "BarChart3" },
    { id: "payments", label: "Payment Processing", icon: "DollarSign" },
    { id: "users", label: "User Management", icon: "Users" },
  ];
  return (
    <RoleGuard allowedRoles={["OWNER"]}>
      <LoadingBoundary loading={loading} fullScreen>
        <div className="min-h-screen bg-background">
          <AuthenticatedHeader />

          <main className="pt-[60px] lg:pt-[60px]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
              {/* Page Header */}
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-orange-400/50 mb-2">
                  Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground"></p>
              </div>

              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <MetricCard
                  title="Total Active Workers"
                  value={siteOrCampanyOverview.TotalWorkers}
                  iconName="Users"
                  iconBgColor="bg-primary/10"
                  iconColor="var(--color-primary)"
                />
                <MetricCard
                  title="Total Number of sites"
                  value={siteOrCampanyOverview.TotalNumberOfSites}
                  iconName="Users"
                  iconBgColor="bg-primary/10"
                  iconColor="var(--color-primary)"
                />
                <MetricCard
                  title="Pending Payments"
                  value={`${siteOrCampanyOverview.PendingPayments.amount} / ${siteOrCampanyOverview.PendingPayments.count}`}
                  iconName="Clock"
                  trend="down"
                  trendValue="-8.2%"
                  iconBgColor="bg-warning/10"
                  iconColor="var(--color-warning)"
                />
                <MetricCard
                  title="Total Site Costs"
                  value="$456,800"
                  iconName="DollarSign"
                  trend="up"
                  trendValue="+12.5%"
                  iconBgColor="bg-success/10"
                  iconColor="var(--color-success)"
                />
                <MetricCard
                  title="Total-Paid Ammount"
                  value={`${siteOrCampanyOverview.PaidPayments.amount} / ${siteOrCampanyOverview.PaidPayments.count}`}
                  iconName="Tick"
                  trend={undefined}
                  trendValue={undefined}
                  iconBgColor="bg-destructive/10"
                  iconColor="var(--color-destructive)"
                />
                <MetricCard
                  title="Total-Rejected Ammount"
                  value={`${siteOrCampanyOverview.RejectedPayments.amount} / ${siteOrCampanyOverview.RejectedPayments.count}`}
                  iconName="Tick"
                  trend={undefined}
                  trendValue={undefined}
                  iconBgColor="bg-destructive/10"
                  iconColor="var(--color-destructive)"
                />
                <MetricCard
                  title="Total-Reviewed Ammount"
                  value={`${siteOrCampanyOverview.ReviewPayments.amount} / ${siteOrCampanyOverview.ReviewPayments.count}`}
                  iconName="Tick"
                  trend={undefined}
                  trendValue={undefined}
                  iconBgColor="bg-destructive/10"
                  iconColor="var(--color-destructive)"
                />
                <MetricCard
                  title="Total-Approved Ammount"
                  value={`${siteOrCampanyOverview.ApprovedPayments.amount} / ${siteOrCampanyOverview.ApprovedPayments.count}`}
                  iconName="Tick"
                  trend={undefined}
                  trendValue={undefined}
                  iconBgColor="bg-destructive/10"
                  iconColor="var(--color-destructive)"
                />
              </div>

              {/* Tabs Navigation - Full width, equal columns */}
              <div className="bg-card rounded-xl shadow-elevation-2 mb-6 md:mb-8 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-border">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
          flex items-center justify-center gap-2 px-4 py-3 md:py-4 text-sm md:text-base font-medium
          transition-all duration-200
          ${
            activeTab === tab.id
              ? "bg-gray-900/10 text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-b-2 border-transparent"
          }
        `}
                    >
                      <Icon
                        name={tab.icon}
                        size={18}
                        className="md:w-5 md:h-5"
                      />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Tab Content */}
              <div className="transition-smooth">
                {activeTab === "analytics" && (
                  <AnalyticsDashboard
                    getCompanyReport={getCompany_report}
                    getSiteReport={getSite_report}
                  />
                )}

                {activeTab === "payments" && <PaymentApprovalQueue />}

                {activeTab === "users" && <UserManagementPanel />}
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-8 md:mt-12 bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={handleCreateSite}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Create New Site
                  </button>
                  <Button>Add New User</Button>
                  <Button>Generate Report</Button>
                  <Button>System Settings</Button>
                </div>
              </div>

              {/* Site Modal */}
              <SiteModal
                isOpen={isSiteModalOpen}
                onClose={() => setIsSiteModalOpen(false)}
                siteId={editingSite ? editingSite : undefined}
              />
            </div>
          </main>
        </div>
      </LoadingBoundary>
    </RoleGuard>
  );
};

export default OwnerDashboard;
