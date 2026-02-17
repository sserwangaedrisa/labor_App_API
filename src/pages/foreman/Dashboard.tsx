// import Sidebar from "../../components/layout/Slidebar";
// import Header from "../../components/layout/Header";
// import Card from "../../components/ui/Card";
// import SiteCostChart from "../../components/charts/SiteCostChart";
// import { useAuth } from "../../app/providers";

// const ForemanDashboard = () => {
//   const { user } = useAuth();

//   // Dummy site summary data
//   const siteSummary = {
//     siteName: "Site A",
//     totalWorkers: 12,
//     totalHours: 96,
//     totalCost: 1200,
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         <Header />

//         <main className="p-6 bg-gray-100 flex-1 overflow-auto">
//           <h1 className="text-3xl font-bold mb-6">
//             Foreman Dashboard - {user?.name}
//           </h1>

//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <Card>
//               <h3 className="font-semibold">Workers Assigned</h3>
//               <p>{siteSummary.totalWorkers}</p>
//             </Card>
//             <Card>
//               <h3 className="font-semibold">Total Hours</h3>
//               <p>{siteSummary.totalHours}</p>
//             </Card>
//             <Card>
//               <h3 className="font-semibold">Site Cost</h3>
//               <p>${siteSummary.totalCost}</p>
//             </Card>
//           </div>

//           <Card>
//             <h2 className="text-xl font-semibold mb-4">Site Cost Chart</h2>
//             <SiteCostChart data={[120, 150, 100, 200, 80, 170]} />
//           </Card>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ForemanDashboard;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "../../components/ui/AuthenticatedHeader";
import RoleGuard from "../../components/ui/RoleGuard";
import LoadingBoundary from "../../components/ui/LoadingBoundary";
import Icon from "../../components/ui/AppIconl";
import Button from "../../components/ui/Button";
import SiteOverviewCard from "./components/SiteOverviewCard";
import WorkerTableRow from "./components/WorkerTableRow";
import AttendanceModal from "./components/AttendanceModal";
import PaymentRequestCard from "./components/PaymentRequest";
import QuickActionsPanel from "./components/QuickActions";
import NotificationBanner from "./components/NotificatonBanner";
import { getUser } from "../../utils/mockAuth";
import { User } from "lucide-react";

/* =======================
   Type Definitions
======================= */

interface Notification {
  id: number;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
}

interface Worker {
  id: string;
  name: string;
  avatar: string;
  avatarAlt: string;
  role: string;
  todayStatus: "present" | "absent" | "pending";
  hoursToday: number;
  wageRate: number;
  lastUpdated: string;
}

interface AttendanceData {
  [key: string]: unknown;
}

/* =======================
   Component
======================= */

const ForemanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | undefined>();
  const [showAttendanceModal, setShowAttendanceModal] =
    useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "warning",
      title: "Late Submission Alert",
      message:
        "You have 3 attendance entries from yesterday that need to be submitted. Late entries will be flagged for owner review.",
    },
    {
      id: 2,
      type: "success",
      title: "Payment Request Approved",
      message:
        "Your payment request for 15 workers has been approved by the site owner. Payments will be processed within 24 hours.",
    },
  ]);

  const currentUser = getUser();

  const siteOverview = {
    totalWorkers: 24,
    presentToday: 21,
    pendingAttendance: 3,
    totalHoursToday: 168,
    pendingPayments: 8,
  };

  const workers: Worker[] = [
    {
      id: "W001",
      name: "Robert Johnson",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_19b49695f-1763293153611.png",
      avatarAlt:
        "Professional headshot of African American man with short black hair wearing blue work shirt",
      role: "Mason",
      todayStatus: "present",
      hoursToday: 8,
      wageRate: 120,
      lastUpdated: "2026-01-26 09:30 AM",
    },
    {
      id: "W002",
      name: "Maria Garcia",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_129aa8ebc-1763299616245.png",
      avatarAlt:
        "Professional headshot of Hispanic woman with long brown hair wearing yellow safety vest",
      role: "Carpenter",
      todayStatus: "present",
      hoursToday: 7.5,
      wageRate: 110,
      lastUpdated: "2026-01-26 10:15 AM",
    },
    {
      id: "W003",
      name: "David Chen",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1b41c284a-1763295621343.png",
      avatarAlt:
        "Professional headshot of Asian man with short black hair wearing orange hard hat",
      role: "Electrician",
      todayStatus: "present",
      hoursToday: 8,
      wageRate: 130,
      lastUpdated: "2026-01-26 08:45 AM",
    },
    {
      id: "W004",
      name: "Sarah Williams",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1b400cc53-1763300240792.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with blonde hair wearing white hard hat",
      role: "Plumber",
      todayStatus: "pending",
      hoursToday: 0,
      wageRate: 115,
      lastUpdated: "Not recorded today",
    },
    {
      id: "W005",
      name: "Michael Brown",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1c7c570ac-1763296079697.png",
      avatarAlt:
        "Professional headshot of African American man with gray beard wearing red safety vest",
      role: "Welder",
      todayStatus: "present",
      hoursToday: 8,
      wageRate: 125,
      lastUpdated: "2026-01-26 09:00 AM",
    },
    {
      id: "W006",
      name: "Jennifer Lee",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1916e8edb-1763295990360.png",
      avatarAlt:
        "Professional headshot of Asian woman with short black hair wearing blue work uniform",
      role: "Painter",
      todayStatus: "present",
      hoursToday: 7,
      wageRate: 100,
      lastUpdated: "2026-01-26 11:00 AM",
    },
    {
      id: "W007",
      name: "Carlos Rodriguez",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1650ed24b-1763296439337.png",
      avatarAlt:
        "Professional headshot of Hispanic man with mustache wearing yellow hard hat",
      role: "Laborer",
      todayStatus: "absent",
      hoursToday: 0,
      wageRate: 90,
      lastUpdated: "Marked absent",
    },
    {
      id: "W008",
      name: "Emily Davis",
      avatar:
        "https://img.rocket.new/generatedImages/rocket_gen_img_1a90aacde-1763301697203.png",
      avatarAlt:
        "Professional headshot of Caucasian woman with red hair wearing green safety vest",
      role: "Forklift Operator",
      todayStatus: "present",
      hoursToday: 8,
      wageRate: 105,
      lastUpdated: "2026-01-26 08:30 AM",
    },
  ];

  const handleLogout = (): void => {
    navigate("/login");
  };

  const handleRecordAttendance = (worker: Worker): void => {
    setSelectedWorker(worker);
    setShowAttendanceModal(true);
  };

  const handleViewDetails = (worker: Worker): void => {
    console.log("View worker details:", worker);
  };

  const handleSubmitAttendance = (attendanceData: AttendanceData): void => {
    console.log("Attendance submitted:", attendanceData);
    setShowAttendanceModal(false);
    setSelectedWorker(undefined);
  };

  const handleSubmitPaymentRequest = (): void => {
    console.log("Submit payment request for pending workers");
  };

  const handleViewPaymentHistory = (): void => {
    console.log("View payment history");
  };

  const handleBulkAttendance = (): void => {
    console.log("Open bulk attendance entry");
  };

  const handleViewReports = (): void => {
    console.log("View site reports");
  };

  const handleSiteSettings = (): void => {
    console.log("Open site settings");
  };

  const handleDismissNotification = (id: number): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleViewAllNotifications = (): void => {
    console.log("View all notifications");
  };

  return (
    <RoleGuard allowedRoles={["foreman"]} currentUser={currentUser}>
      <LoadingBoundary loading={loading} fullScreen>
        <div className="min-h-screen bg-background">
          <AuthenticatedHeader user={currentUser} onLogout={handleLogout} />
          
          <main className="pt-[60px]">
            <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
                    Foreman Dashboard
                  </h1>
                  <Button
                    variant="default"
                    size="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => handleRecordAttendance(workers?.[0])}
                    className="hidden sm:inline-flex">

                    Record Attendance
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground md:text-base">
                  {currentUser?.assignedSite} • Today: {new Date()?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <NotificationBanner
                notifications={notifications}
                onDismiss={handleDismissNotification}
                onViewAll={handleViewAllNotifications} />


              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 md:mb-8">
                <SiteOverviewCard
                  title="Total Workers"
                  value={siteOverview?.totalWorkers}
                  subtitle="Assigned to site"
                  iconName="Users"
                  iconColor="var(--color-primary)"
                  trend={null} />

                <SiteOverviewCard
                  title="Present Today"
                  value={siteOverview?.presentToday}
                  subtitle={`${siteOverview?.pendingAttendance} pending`}
                  iconName="UserCheck"
                  iconColor="var(--color-success)"
                  trend={{ value: '+3', label: 'vs yesterday', isPositive: true }} />

                <SiteOverviewCard
                  title="Total Hours"
                  value={siteOverview?.totalHoursToday}
                  subtitle="Logged today"
                  iconName="Clock"
                  iconColor="var(--color-accent)"
                  trend={null} />

                <SiteOverviewCard
                  title="Pending Payments"
                  value={siteOverview?.pendingPayments}
                  subtitle="Workers awaiting"
                  iconName="DollarSign"
                  iconColor="var(--color-warning)"
                  trend={null} />

              </div>

              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3 md:mb-8">
                <div className="lg:col-span-2">
                  <QuickActionsPanel
                    onBulkAttendance={handleBulkAttendance}
                    onViewReports={handleViewReports}
                    onSiteSettings={handleSiteSettings} />

                </div>
                <div>
                  <PaymentRequestCard
                    pendingRequests={siteOverview?.pendingPayments}
                    onSubmitRequest={handleSubmitPaymentRequest}
                    onViewHistory={handleViewPaymentHistory} />

                </div>
              </div>

              <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
                <div className="p-4 border-b border-border md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground md:text-xl">
                        Worker Management
                      </h2>
                      <p className="caption text-muted-foreground text-sm">
                        {workers?.length} workers assigned to your site
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="default"
                      iconName="Download"
                      iconPosition="left"
                      className="hidden md:inline-flex">

                      Export
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1 relative">
                      <Icon
                        name="Search"
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                      <input
                        type="text"
                        placeholder="Search workers..."
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth" />

                    </div>
                    <Button
                      variant="outline"
                      size="default"
                      iconName="Filter"
                      iconPosition="left">

                      Filter
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider md:px-6 md:py-4">
                          Worker
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell md:px-6 md:py-4">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider md:px-6 md:py-4">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell md:px-6 md:py-4">
                          Hours Today
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell md:px-6 md:py-4">
                          Wage Rate
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider md:px-6 md:py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {workers?.map((worker) =>
                      <WorkerTableRow
                        key={worker?.id}
                        worker={worker}
                        onRecordAttendance={handleRecordAttendance}
                        onViewDetails={handleViewDetails} />

                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-border flex items-center justify-between md:p-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {workers?.length} of {workers?.length} workers
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Icon name="ChevronLeft" size={16} />
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Icon name="ChevronRight" size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                onClick={() => handleRecordAttendance(workers?.[0])}
                className="fixed bottom-6 right-6 sm:hidden shadow-elevation-4 rounded-full w-14 h-14 p-0">

                <span className="sr-only">Record Attendance</span>
              </Button>
            </div>
          </main>

          {showAttendanceModal && selectedWorker &&
          <AttendanceModal
            worker={selectedWorker}
            onClose={() => {
              setShowAttendanceModal(false);
              setSelectedWorker();
            }}
            onSubmit={handleSubmitAttendance} />

          }
        </div>
      </LoadingBoundary>
    </RoleGuard>);

};

export default ForemanDashboard;
