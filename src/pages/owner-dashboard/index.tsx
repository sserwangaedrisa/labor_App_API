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
// import type { User } from '../../app/providers';
import type { Payment, Site, User, NewUser } from "../../types/SharedTypes";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  // create site modal state
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<string | null>(null);

  const mockSites: Site[] = [
    {
      id: "site-001",
      name: "Downtown Plaza Construction",
      location: "123 Main Street, Downtown",
      activeWorkers: 45,
      dailyCost: 12500,
      pendingPayments: 38750,
      status: "Active",
    },
    {
      id: "site-002",
      name: "Riverside Towers Project",
      location: "456 River Road, Riverside",
      activeWorkers: 32,
      dailyCost: 9800,
      pendingPayments: 29400,
      status: "Active",
    },
    {
      id: "site-003",
      name: "Industrial Park Development",
      location: "789 Industrial Ave, West Side",
      activeWorkers: 28,
      dailyCost: 8400,
      pendingPayments: 16800,
      status: "Active",
    },
    {
      id: "site-004",
      name: "Suburban Housing Complex",
      location: "321 Suburban Lane, North District",
      activeWorkers: 18,
      dailyCost: 5600,
      pendingPayments: 11200,
      status: "Inactive",
    },
  ];

  const mockPayments: Payment[] = [
    {
      id: "pay-001",
      workerId: "LAB001",
      workerName: "Michael Rodriguez",
      siteName: "Downtown Plaza Construction",
      period: "01/20/2026 - 01/26/2026",
      amount: 1750,
      status: "Pending",
    },
    {
      id: "pay-002",
      workerId: "LAB002",
      workerName: "Sarah Johnson",
      siteName: "Riverside Towers Project",
      period: "01/20/2026 - 01/26/2026",
      amount: 1680,
      status: "Pending",
    },
    {
      id: "pay-003",
      workerId: "LAB003",
      workerName: "David Chen",
      siteName: "Industrial Park Development",
      period: "01/20/2026 - 01/26/2026",
      amount: 1820,
      status: "Unpaid",
    },
    {
      id: "pay-004",
      workerId: "LAB004",
      workerName: "Maria Garcia",
      siteName: "Downtown Plaza Construction",
      period: "01/20/2026 - 01/26/2026",
      amount: 1540,
      status: "Pending",
    },
    {
      id: "pay-005",
      workerId: "LAB005",
      workerName: "James Wilson",
      siteName: "Suburban Housing Complex",
      period: "01/20/2026 - 01/26/2026",
      amount: 1400,
      status: "Unpaid",
    },
  ];

  const mockUsers: User[] = [
    {
      id: "LAB001",
      name: "Michael Rodriguez",
      email: "michael.rodriguez@email.com",
      phone: "+1 (555) 123-4567",
      role: "laborer",
      assignedSite: "Downtown Plaza Construction",
      isBlocked: false,
    },
    {
      id: "LAB002",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 234-5678",
      role: "laborer",
      assignedSite: "Riverside Towers Project",
      isBlocked: false,
    },
    {
      id: "FOR001",
      name: "David Chen",
      email: "david.chen@email.com",
      phone: "+1 (555) 345-6789",
      role: "foreman",
      assignedSite: "Industrial Park Development",
      isBlocked: false,
    },
    {
      id: "LAB003",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1 (555) 456-7890",
      role: "laborer",
      assignedSite: "Downtown Plaza Construction",
      isBlocked: true,
    },
    {
      id: "FOR002",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 567-8901",
      role: "foreman",
      assignedSite: "Riverside Towers Project",
      isBlocked: false,
    },
  ];

  const mockAnalytics = {
    monthly: {
      totalCost: 456800,
      totalHours: 18272,
      avgDailyCost: 15227,
      activeWorkers: 123,
      siteBreakdown: [
        { name: "Downtown Plaza Construction", cost: 187500, workers: 45 },
        { name: "Riverside Towers Project", cost: 147000, workers: 32 },
        { name: "Industrial Park Development", cost: 84000, workers: 28 },
        { name: "Suburban Housing Complex", cost: 38300, workers: 18 },
      ],
      monthlyTrend: [
        { month: "Jul", cost: 398500 },
        { month: "Aug", cost: 412300 },
        { month: "Sep", cost: 435600 },
        { month: "Oct", cost: 428900 },
        { month: "Nov", cost: 445200 },
        { month: "Dec", cost: 456800 },
      ],
      topWorkers: [
        { name: "Michael Rodriguez", site: "Downtown Plaza", hours: 248 },
        { name: "Sarah Johnson", site: "Riverside Towers", hours: 242 },
        { name: "David Chen", site: "Industrial Park", hours: 236 },
        { name: "Maria Garcia", site: "Downtown Plaza", hours: 228 },
        { name: "James Wilson", site: "Suburban Complex", hours: 220 },
      ],
    },
  };

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
    { id: "overview", label: "Site Overview", icon: "LayoutDashboard" },
    { id: "payments", label: "Payment Processing", icon: "DollarSign" },
    { id: "users", label: "User Management", icon: "Users" },
    { id: "analytics", label: "Analytics & Reports", icon: "BarChart3" },
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
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                  Owner Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive system administration and company-wide analytics
                </p>
              </div>

              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <MetricCard
                  title="Total Active Workers"
                  value="123"
                  iconName="Users"
                  trend="up"
                  trendValue="+15"
                  iconBgColor="bg-primary/10"
                  iconColor="var(--color-primary)"
                />
                <MetricCard
                  title="Pending Payments"
                  value="$96,150"
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
                  title="System Alerts"
                  value="7"
                  iconName="AlertCircle"
                  trend={undefined}
                  trendValue={undefined}
                  iconBgColor="bg-destructive/10"
                  iconColor="var(--color-destructive)"
                />
              </div>

              {/* Tabs Navigation */}
              <div className="bg-card rounded-xl shadow-elevation-2 mb-6 md:mb-8 overflow-hidden">
                <div className="border-b border-border overflow-x-auto">
                  <div className="flex min-w-max lg:min-w-0">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-smooth border-b-2 flex-shrink-0 ${
                          activeTab === tab?.id
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        }`}
                      >
                        <Icon
                          key="arrowdown"
                          name="AArrowDown"
                          size={18}
                          className="md:w-5 md:h-5"
                        />
                        <span className="whitespace-nowrap">{tab?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="transition-smooth">
                {activeTab === "overview" && (
                  <SiteOverviewTable
                    sites={mockSites}
                    onViewDetails={handleViewSiteDetails}
                    onManageWorkers={handleManageWorkers}
                  />
                )}

                {activeTab === "payments" && <PaymentApprovalQueue />}

                {activeTab === "users" && <UserManagementPanel />}

                {activeTab === "analytics" && (
                  <AnalyticsDashboard
                    analyticsData={mockAnalytics}
                    onExportPDF={handleExportPDF}
                    onExportExcel={handleExportExcel}
                  />
                )}
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
