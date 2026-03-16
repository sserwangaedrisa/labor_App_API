import React, { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/app/providers";
import AuthenticatedHeader from "../../components/ui/AuthenticatedHeader";
import RoleGuard from "../../components/ui/RoleGuard";
import LoadingBoundary from "../../components/ui/LoadingBoundary";
import Icon from "../../components/ui/AppIconl";
import Button from "../../components/ui/Button";
import SiteOverviewCard from "./components/SiteOverviewCard";
import WorkerTableRow from "./components/WorkerTableRow";
import AttendanceModal from "./components/AttendanceModal";
import WorkerModal from "./components/UserModal";
import PaymentRequestCard from "./components/PaymentRequest";
import { UserManagementPanel } from "./components/UserManagementPanel";
import QuickActionsPanel from "./components/QuickActions";
import NotificationBanner from "./components/NotificatonBanner";
import authorizeCreate from "../../api/authorizeCreate";
import type {
  Worker,
  Notification,
  User,
  verificationData,
} from "../../types/SharedTypes";
import * as SharedTypes from "../../types/SharedTypes";
import authorizePostRequest from "../../api/authorizePostRequest";
import { s } from "framer-motion/client";

// TYPES
interface VerifyAccountResponse {
  status: string;
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

/* =======================
   Component
======================= */

const ForemanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] =
    useState<SharedTypes.User | null>();
  const [selectedUser, setSelectedUser] = useState<SharedTypes.User | null>();
  const [showAttendanceModal, setShowAttendanceModal] =
    useState<boolean>(false);

  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [isErr, setIsErr] = useState<boolean>(false);
  const [verificationData, setVerificationData] = useState<{
    userId: string;
    otp: string;
  }>({ userId: "", otp: "" });
  const [verificationResponse, setVerificationResponse] =
    useState<VerifyAccountResponse | null>(null);
  const [resendOtp, setResendOtp] = useState<boolean>(false);
  const [siteWorker, setSiteWorkers] = useState<SharedTypes.SiteWorker[]>([]);
  const [workers, setWorkersDetatil] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [siteInfo, setSiteInfo] = useState<SharedTypes.Sited>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const { user } = useAuth();
  const currentUser = user;

  const siteOverview = {
    totalWorkers: 24,
    presentToday: 21,
    pendingAttendance: 3,
    totalHoursToday: 168,
    pendingPayments: 8,
  };

  useEffect(() => {
    const fetchSiteInfo =
      async (): Promise<SharedTypes.SiteInfoResponse | void> => {
        try {
          const siteInfo =
            await authorizePostRequest<SharedTypes.SiteInfoResponse>(
              "worker/siteDetails",
              {
                foremanId: currentUser?.id,
              },
            );

          if (!siteInfo) {
            console.log("No site info received");
            return;
          }

          if (siteInfo.site?.workers) {
            setSiteInfo(siteInfo.site);
            setSiteWorkers(siteInfo.site?.workers);
          } else {
            console.log("No workers data in site info");
          }

          return siteInfo;
        } catch (error) {
          console.log(error);
        }
      };

    fetchSiteInfo();
  }, [currentUser]);

  useEffect(() => {
    if (!siteInfo?.workers) return;

    setWorkersDetatil(
      siteInfo.workers.map(({ worker }) => ({
        id: worker?.id ?? "",
        name: worker?.name ?? "",
        avatar: worker?.imageUrl ?? "",
        avatarAlt: worker?.name ?? "",
        role: worker?.job ?? "WORKER",
        todayStatus: "absent",
        hoursToday: 0,
        wageRate: worker?.wageRating ?? 0,
        lastUpdated: new Date().toISOString(),
      })),
    );

    setFilteredWorkers(workers);
  }, [siteInfo]);

  useEffect(() => {
    const handleWorkerManagementSearch = () => {
      const filteredList = workers.filter((w) =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredWorkers(filteredList);
    };

    handleWorkerManagementSearch();
  }, [searchQuery, workers]);

  const handleRecordAttendanced = (worker: Worker): void => {
    const selected = siteInfo?.workers?.find((w) => w.workerId === worker.id);

    if (selected) {
      setSelectedWorker(selected.worker);
    }

    setShowAttendanceModal(true);
  };

  const handleViewUserDetails = (user: SharedTypes.User): void => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleRecordAttendance = async (
    attendanceData: SharedTypes.WorkEntry,
  ): Promise<void> => {
    setIsSubmitting(true);
    try {
      const workEntryResponse =
        await authorizePostRequest<SharedTypes.SiteInfoResponse>(
          "attendance/record",
          { ...attendanceData, siteId: siteInfo?.id ?? "" },
        );

      if (!workEntryResponse) {
        console.log("No response received for attendance submission");
        toast.error("No response from server. Please try again.");
        return;
      }

      if (workEntryResponse.status !== "success") {
        console.log(
          "Attendance submission failed: ",
          workEntryResponse.message,
        );
        toast.error(
          workEntryResponse.message ||
            "Failed to submit attendance. Please try again.",
        );
        return;
      }

      console.log("Attendance submitted successfully");
      toast.success("Attendance recorded successfully.");

      setShowAttendanceModal(false);
      setSelectedWorker(null);
    } catch (error) {
      console.log("Error submitting attendance: ", error);
      toast.error("Failed to submit attendance. Please try again.");
      setSelectedWorker(null);
      setShowAttendanceModal(false);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleDismissNotification = (id: string | number): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleViewAllNotifications = (): void => {
    console.log("View all notifications");
  };

  const handleCreateUser = async (userData: FormData): Promise<boolean> => {
    try {
      const response = await authorizeCreate("users/register", userData);

      if (response.status === "success") {
        setVerificationData({ ...verificationData, userId: response.userId });
        setMsg(response.message);
        setIsErr(false);
        toast.success(response.message);

        return true;
      }

      if (response.status !== "success") {
        console.log("register new user response: ", response);
        setMsg(response.message);
        setIsErr(false);
        toast.error(response.message);
        toast.success("its itsss  ");
        return false;
      }

      if (!response || !response.userId) {
        toast.error("Invalid response from server. Please try again.");
        throw new Error("Invalid response from server");
        return false;
      }

      return false;
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user. Please try again.");
      setIsErr(true);
      setMsg("Failed to create user. Please try again.");
      return false;
    }
  };

  const handleEmailVerification = async (data: verificationData) => {
    try {
      const response = await authorizePostRequest<VerifyAccountResponse>(
        "users/verify-account",
        data,
      );

      setVerificationResponse(response);

      if (response.status === "success") {
        console.log("Email verified successfully");
        toast.success(response.message);
        setVerificationData({ userId: "", otp: "" });
        setResendOtp(false);
        setVerificationResponse(null);
      }

      if (response.status === "expired") {
        console.log("OTP expired");
        setVerificationData({ ...data, otp: "" });
        setResendOtp(true);
        toast.error(response.message);
      }

      // Any other failure case
      if (response.status !== "success" && response.status !== "expired") {
        console.log("Email verification failed");
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Verification failed. Please try again.");
      setVerificationResponse({
        status: "error",
        message: "Verification failed. Please try again.",
      });
    }
  };

  const handleResendOtp: () => Promise<VerifyAccountResponse> = async () => {
    try {
      const response = await authorizePostRequest<VerifyAccountResponse>(
        "users/resend-otp",
        { userId: verificationData.userId },
      );
      if (response.status === "success") {
        toast.success(
          "OTP resent successfully, check your email for the new otp.",
        );
        console.log("response: ", response);
        setResendOtp(false);
        setVerificationResponse(null);
        return response;
      }
      if (response.status !== "success") {
        console.log("response: ", response);
      }

      toast.error(response.message);
      return response;
    } catch (error) {
      console.log(error);
      toast.error("Failed to resend OTP. Please try again.");
      return {
        status: "error",
        message: "Failed to resend OTP. Please try again.",
      };
    }
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

  return (
    <RoleGuard allowedRoles={["FOREMAN"]}>
      <LoadingBoundary loading={loading} fullScreen>
        <div className="min-h-screen bg-background">
          <AuthenticatedHeader />

          <main className="pt-[60px]">
            <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
                    Foreman Dashboard
                  </h1>
                  <Button
                    onClick={() => handleRecordAttendanced(workers?.[0])}
                    className="hidden sm:inline-flex"
                  >
                    Record Attendance
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground md:text-base">
                  {currentUser?.assignedSite} • Today:{" "}
                  {new Date()?.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <NotificationBanner
                notifications={notifications}
                onDismiss={handleDismissNotification}
                onViewAll={handleViewAllNotifications}
              />

              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 md:mb-8">
                <SiteOverviewCard
                  title="Total Workers"
                  value={siteOverview?.totalWorkers}
                  subtitle="Assigned to site"
                  iconName="Users"
                  iconColor="var(--color-primary)"
                />

                <SiteOverviewCard
                  title="Present Today"
                  value={siteOverview?.presentToday}
                  subtitle={`${siteOverview?.pendingAttendance} pending`}
                  iconName="UserCheck"
                  iconColor="var(--color-success)"
                  trend={{
                    value: "+3",
                    label: "vs yesterday",
                    isPositive: true,
                  }}
                />

                <SiteOverviewCard
                  title="Total Hours"
                  value={siteOverview?.totalHoursToday}
                  subtitle="Logged today"
                  iconName="Clock"
                  iconColor="var(--color-accent)"
                />

                <SiteOverviewCard
                  title="Pending Payments"
                  value={siteOverview?.pendingPayments}
                  subtitle="Workers awaiting"
                  iconName="DollarSign"
                  iconColor="var(--color-warning)"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3 md:mb-8">
                <div className="lg:col-span-2">
                  <QuickActionsPanel
                    onBulkAttendance={handleBulkAttendance}
                    onViewReports={handleViewReports}
                    onSiteSettings={handleSiteSettings}
                  />
                </div>
                <div>
                  <PaymentRequestCard
                    pendingRequests={siteOverview?.pendingPayments}
                    onSubmitRequest={handleSubmitPaymentRequest}
                    onViewHistory={handleViewPaymentHistory}
                  />
                </div>
              </div>

              {/* worker management */}

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
                    <Button className="hidden md:inline-flex">Export</Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1 relative">
                      <Icon
                        key="search"
                        name="Search"
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />

                      <input
                        type="text"
                        placeholder="Search workers..."
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </div>
                    <Button>Filter</Button>
                  </div>
                </div>

                {/* Worker table */}

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
                      {filteredWorkers?.map((worker) => {
                        const userForWorker = siteInfo?.workers?.find(
                          (w) => w.workerId === worker.id,
                        )?.worker;
                        return (
                          <WorkerTableRow
                            key={worker?.id}
                            user={userForWorker}
                            worker={worker}
                            onRecordAttendance={handleRecordAttendanced}
                            onViewUserDetails={handleViewUserDetails}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-border flex items-center justify-between md:p-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {workers?.length} of {workers?.length} workers
                  </p>
                  <div className="flex gap-2">
                    <Button disabled>
                      <Icon key="cheveronLeft" name="ChevronLeft" size={16} />
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <Icon key="chevronRight" name="ChevronRight" size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                iconName="Plus"
                onClick={() => handleRecordAttendanced(workers?.[0])}
                className="fixed bottom-6 right-6 sm:hidden shadow-elevation-4 rounded-full w-14 h-14 p-0"
              >
                <span className="sr-only">Record Attendance</span>
              </Button>
            </div>
          </main>

          {showAttendanceModal && selectedWorker && (
            <AttendanceModal
              worker={selectedWorker}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              onClose={() => {
                setShowAttendanceModal(false);
                setSelectedWorker(null);
              }}
              onSubmit={handleRecordAttendance}
            />
          )}

          {showUserModal && selectedUser && (
            <WorkerModal
              isOpen={showUserModal}
              worker={selectedUser}
              onClose={() => {
                setShowUserModal(false);
              }}
            />
          )}
        </div>

        <div>
          <UserManagementPanel
            verificationData={verificationData}
            resendOtp={resendOtp}
            verificationResponse={verificationResponse}
            onVerifyEmail={handleEmailVerification}
            onResendOtp={handleResendOtp}
            onCreateUser={handleCreateUser}
            onBlockUser={handleBlockUser}
            onUnblockUser={handleUnblockUser}
            users={[]}
            onSetResendOtp={setResendOtp}
          />
        </div>

        {showUserModal && selectedUser && (
          <WorkerModal
            worker={selectedUser}
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
          />
        )}
      </LoadingBoundary>
    </RoleGuard>
  );
};
export default ForemanDashboard;
