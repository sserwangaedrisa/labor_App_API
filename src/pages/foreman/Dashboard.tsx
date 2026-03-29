import React, { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/app/providers";
import SiteHeader from "../../components/ui/SiteHeader";
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
import SiteSettingsComponent from "./components/siteSettings";
import type {
  Worker,
  Notification,
  User,
  verificationData,
} from "../../types/SharedTypes";
import * as SharedTypes from "../../types/SharedTypes";
import authorizePostRequest from "../../api/authorizePostRequest";
import { div, s } from "framer-motion/client";
import { Settings } from "lucide-react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] =
    useState<SharedTypes.User | null>();
  const [selectedUser, setSelectedUser] = useState<SharedTypes.User | null>();
  const [showAttendanceModal, setShowAttendanceModal] =
    useState<boolean>(false);

  const [siteId, setSiteId] = useState<string>("");
  const [currentUserWorkEntry, setCurrentUserWorkEntry] =
    useState<SharedTypes.WorkEntry | null>(null);
  const [showPaymentRequestCard, setShowPaymentRequestCard] =
    useState<boolean>(false);

  const [currentSettings, setCurrentSettings] =
    useState<SharedTypes.SiteSettings | null>(null);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [userModalSearchQuery, setUserModalSearchQuery] = useState<{
    workerId: string;
    siteId: string;
    startDate: Date;
    endDate: Date;
  }>({
    workerId: selectedUser ? selectedUser.id : "",
    siteId: siteId || "",
    startDate: new Date(),
    endDate: new Date(),
  });

  // payment states

  const [msg, setMsg] = useState<string>("");
  const [isErr, setIsErr] = useState<boolean>(false);
  const [verificationData, setVerificationData] = useState<{
    userId: string;
    otp: string;
  }>({ userId: "", otp: "" });
  const [verificationResponse, setVerificationResponse] =
    useState<VerifyAccountResponse | null>(null);
  const [resendOtp, setResendOtp] = useState<boolean>(false);
  const [siteActiveWorkers, setSiteActiveWorkers] = useState<
    SharedTypes.ActiveWorker[]
  >([]);

  // present workers
  const [PresentWorkers, setPresentWorker] = useState<number>(0);

  // const [siteWorkers, setSiteWorkers] = useState<SharedTypes.User[]>([]);
  const [workers, setWorkersDetatil] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [siteInfo, setSiteInfo] = useState<SharedTypes.SiteDetails>();
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

  // const [attendanceDate, setcurrentDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

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
          if (!user?.foremanSites || user.foremanSites.length === 0) {
            return;
          }
          const siteInfo =
            await authorizePostRequest<SharedTypes.SiteInfoResponse>(
              "worker/siteDetails",
              {
                foremanId: currentUser?.id,
                siteId: user?.foremanSites[0].id,
              },
            );

          if (!siteInfo.success) {
            console.log("No site info received");
            return;
          }

          if (siteInfo.data) {
            setSiteInfo(siteInfo.data);
          } else {
            console.log("No site data in site");
            toast.error("no site data found for this site");
          }

          return siteInfo;
        } catch (error) {
          console.log(error);
        }
      };

    let siteID = "";
    fetchSiteInfo();
    if (currentUser?.foremanSites?.length) {
      const foremanSites = currentUser.foremanSites as { id: string }[];
      siteID = foremanSites[0].id;
      setSiteId(siteID);
    }

    const gettingUsers = async () => {
      try {
        const response: unknown = await authorizePostRequest(
          "users/allSiteWorkers",
          { siteId: siteID },
        );

        if (!response) {
          console.log("no users found");
          toast.error("no users found for this site");
          return;
        }

        const res = response as {
          success: boolean;
          data: any;
          message: string;
          count: number | string;
        };

        if (!res.success) {
          console.log(res.message);
          toast.error(res.message);
          return;
        }

        setSiteActiveWorkers(res.data);
      } catch (error) {
        console.log("error while getting site workers", error);
      }
    };
    gettingUsers();
  }, [currentUser]);

  // setting the workers for the given search query
  useEffect(() => {
    const handleWorkerManagementSearch = () => {
      const filteredList = workers.filter((w) =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredWorkers(filteredList);
    };

    handleWorkerManagementSearch();
  }, [searchQuery, workers]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res =
        await authorizePostRequest<SharedTypes.SiteAttendanceInfoResponse>(
          "attendance/todayAttendace",
          {
            siteId,
            date: currentDate,
          },
        );

      if (!res.presentWorkers) return;

      const presentWorkers = res.presentWorkers;
      setPresentWorker(presentWorkers.length);
      if (siteActiveWorkers.length > 0) {
        const updatedWorkers = siteActiveWorkers
          .map(({ worker }) => {
            if (worker?.status !== "ACTIVE" || !worker?.isActive) {
              return null;
            }
            const workerId = worker?.id ?? "";
            const workEntry = presentWorkers.find(
              (entry) => entry.workerId === worker?.id,
            );
            const currentWorkEntryId = workEntry?.id;
            const timeWorkedToday = workEntry?.hours;
            const overtime = workEntry?.overtime;
            return {
              id: workerId,
              name: worker?.name ?? "",
              avatar: worker?.imageUrl ?? "",
              avatarAlt: worker?.name ?? "",
              role: worker?.job ?? "WORKER",
              todayStatus: currentWorkEntryId ? "present" : "absent",
              currentWorkEntryId: currentWorkEntryId ?? "",
              hoursToday:
                timeWorkedToday && overtime ? timeWorkedToday + overtime : 0,
              wageRate: worker?.wageRating ?? 0,
              lastUpdated: new Date().toISOString(),
              workEntry,
            };
          })
          .filter((worker) => worker !== null);
        setWorkersDetatil(updatedWorkers as Worker[]);

        setFilteredWorkers(updatedWorkers as Worker[]);
      }
    };

    if (siteInfo && !showAttendanceModal) {
      fetchAttendance();
    }
  }, [showAttendanceModal, currentDate, siteActiveWorkers]);

  // setting seacrh query for the selected user modal

  useEffect(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    if (!selectedUser) return;
    setUserModalSearchQuery({
      workerId: selectedUser?.id,
      endDate: new Date(),
      siteId: siteId,
      startDate: startOfMonth,
    });
  }, [selectedUser, siteId]);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const syncWorkerAttendance = (
    workerId: string,
    workEntry: SharedTypes.WorkEntry | null,
  ) => {
    const updateWorker = (worker: Worker) => {
      if (String(worker.id) !== workerId) {
        return worker;
      }

      return {
        ...worker,
        workEntry: workEntry ?? undefined,
        currentWorkEntryId: workEntry?.id ?? "",
        todayStatus: workEntry ? "present" : "absent",
        hoursToday: (workEntry?.hours ?? 0) + (workEntry?.overtime ?? 0),
        lastUpdated: new Date().toISOString(),
      };
    };

    setWorkersDetatil((prevWorkers) => prevWorkers.map(updateWorker));
    setFilteredWorkers((prevWorkers) => prevWorkers.map(updateWorker));
  };

  // Handle site settings
  const handleSettingsUpdate = (settings: SharedTypes.SiteSettings) => {
    setCurrentSettings(settings);
    console.log("Settings updated:");
  };

  //initiation for  Recording the attendace for the worker with the details different from the site setting details .
  const handleRecordAttendanced = (worker: Worker): void => {
    const selected = siteActiveWorkers?.find((w) => w.worker.id === worker.id);

    if (selected) {
      setSelectedWorker(selected.worker as User);
    }

    setShowAttendanceModal(true);
  };

  // Viewing the user details.
  const handleViewUserDetails = (user: SharedTypes.User): void => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Recording attendace fuction
  const handleRecordAttendance = async (
    attendanceData: SharedTypes.WorkEntry,
  ): Promise<SharedTypes.SiteInfoResponse> => {
    setIsSubmitting(true);
    try {
      const workEntryResponse =
        await authorizePostRequest<SharedTypes.SiteInfoResponse>(
          "attendance/record",
          { ...attendanceData, siteId },
        );

      if (!workEntryResponse) {
        console.log("No response received for attendance submission");
        toast.error("No response from server. Please try again.");
        return {};
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
        return {
          success: false,
        };
      }

      console.log("Attendance submitted successfully");
      toast.success("Attendance recorded successfully.");
      setCurrentUserWorkEntry(
        workEntryResponse.workEntry ? workEntryResponse.workEntry : null,
      );
      setShowAttendanceModal(false);
      setSelectedWorker(null);
      return workEntryResponse;
    } catch (error) {
      console.log("Error submitting attendance: ", error);
      toast.error("Failed to submit attendance. Please try again.");
      setSelectedWorker(null);
      setShowAttendanceModal(false);
      console.log("error while updating the record: ", error);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAttendance = async (id: string): Promise<boolean> => {
    try {
      const response = await authorizePostRequest<SharedTypes.SiteInfoResponse>(
        "attendance/delete",
        { id },
      );
      if (!response.success) {
        console.log(response.message);
        toast.error(response?.message || "error  while deleting record");
        return false;
      } else {
        toast.success("Successfully update");
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("error while deleting the record");
      return false;
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
    // try {
    //   const response = await authorizePostRequest("");
    // } catch (error) {
    //   console.log("error while updating attendace");
    //   toast.error("Error while recording the attendane");
    // }
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

  const handleBlockUser = async (
    userId: string,
    deactivationReason: string,
  ): Promise<boolean> => {
    console.log("Blocking user:", userId);
    try {
      const response = await authorizePostRequest<SharedTypes.SiteInfoResponse>(
        "users/blockUser",
        { userId, deactivationReason },
      );

      if (!response.success) {
        console.log(response?.message || "action incomplete: blocking user");
        toast.error(response?.message || "failed to block the user");
        return false;
      }

      console.log("user blocked successfully");
      toast.success("User blocked successfully");

      setSiteActiveWorkers((prevActiveWorkers) =>
        prevActiveWorkers.map((item) =>
          item.worker.id === userId
            ? {
                ...item,
                worker: { ...item.worker, status: "BLOCKED", isActive: false },
              }
            : item,
        ),
      );

      // Removing the user from the main workers list
      setWorkersDetatil((prevWorkers) =>
        prevWorkers.filter((worker) => worker.id !== userId),
      );

      // Removing the user from the filtered list
      setFilteredWorkers((prevFiltered) =>
        prevFiltered.filter((worker) => worker.id !== userId),
      );

      return true;
    } catch (error) {
      console.log("error while blocking user:", error);
      toast.error("Failed to block the user");
      return false;
    }
  };

  // unblocking the user and refreshing the list of the filtered workers
  const handleUnblockUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await authorizePostRequest<SharedTypes.SiteInfoResponse>(
        "users/unblockUser",
        { userId },
      );

      if (!response.success) {
        console.log(response.message || "Failed to unblock user: ");
        toast.error(response.message || "Failed to unblock user");
        return false;
      }

      console.log("user unblocked successfully");
      toast.success("User unblocked successfully");

      setSiteActiveWorkers((prevActiveWorkers) =>
        prevActiveWorkers.map((item) =>
          item.worker.id === userId
            ? {
                ...item,
                worker: { ...item.worker, status: "ACTIVE", isActive: true },
              }
            : item,
        ),
      );

      // Updating the main workers list
      setWorkersDetatil((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker.id === userId
            ? { ...worker, status: "ACTIVE", isActive: true }
            : worker,
        ),
      );

      const unblockedUser = siteActiveWorkers?.find(
        (item) => item.worker.id === userId,
      )?.worker;

      if (unblockedUser) {
        setFilteredWorkers((prevFiltered) => {
          const exists = prevFiltered.some((worker) => worker.id === userId);

          if (exists) {
            return prevFiltered.map((worker) =>
              worker.id === userId
                ? { ...worker, status: "ACTIVE", isActive: true }
                : worker,
            );
          } else {
            const newWorker: Worker = {
              id: unblockedUser.id,
              name: unblockedUser.name || "",
              avatar: unblockedUser.imageUrl || "",
              avatarAlt: unblockedUser.name || "",
              role: unblockedUser.job || "WORKER",
              todayStatus: "absent",
              currentWorkEntryId: "",
              hoursToday: 0,
              wageRate: unblockedUser.wageRating || 0,
              lastUpdated: new Date().toISOString(),
              status: "ACTIVE",
              isActive: true,
            };

            return [...prevFiltered, newWorker];
          }
        });
      }
      return true;
    } catch (error) {
      console.log("error while unblocking the user: ", error);
      toast.error("Failed to unblock the user");
      return false;
    }
  };

  const handleExportPDF = () => {
    try {
      // Creating new PDF document
      const doc = new jsPDF();

      // Adding title
      doc.setFontSize(20);
      doc.text("Site Workers Report", 14, 22);

      // Adding site info
      doc.setFontSize(12);
      doc.text(`Site: ${siteInfo?.site_name || "N/A"}`, 14, 32);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
      doc.text(`Total Workers: ${workers.length}`, 14, 44);

      // Preparing table data
      const tableColumn = [
        "Name",
        "Role",
        "Status",
        "Hours Today",
        "Wage Rate",
      ];
      const tableRows = workers.map((worker) => [
        worker.name,
        worker.role,
        worker.todayStatus === "present" ? "Present" : "Absent",
        worker.hoursToday.toString(),
        `$${worker.wageRate.toFixed(2)}`,
      ]);

      // Generating table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Adding summary at the bottom
      const presentCount = workers.filter(
        (w) => w.todayStatus === "present",
      ).length;
      const absentCount = workers.filter(
        (w) => w.todayStatus === "absent",
      ).length;
      const totalHours = workers.reduce((sum, w) => sum + w.hoursToday, 0);

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(11);
      doc.text(`Summary:`, 14, finalY);
      doc.text(`• Present: ${presentCount} workers`, 14, finalY + 7);
      doc.text(`• Absent: ${absentCount} workers`, 14, finalY + 14);
      doc.text(`• Total Hours: ${totalHours} hrs`, 14, finalY + 21);

      // Saving the PDF
      doc.save(`site-workers-${new Date().toISOString().split("T")[0]}.pdf`);

      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const handleExportExcel = () => {
    try {
      // Creating CSV content
      const headers = [
        "Name",
        "Role",
        "Status",
        "Hours Today",
        "Wage Rate",
        "Last Updated",
      ];
      const csvRows = [];

      // Adding headers
      csvRows.push(headers.join(","));

      // Adding data rows
      workers.forEach((worker) => {
        const row = [
          `"${worker.name}"`,
          `"${worker.role}"`,
          worker.todayStatus,
          worker.hoursToday,
          worker.wageRate,
          `"${new Date(worker.lastUpdated).toLocaleString()}"`,
        ];
        csvRows.push(row.join(","));
      });

      // Adding summary rows
      csvRows.push("");
      csvRows.push(`"Summary:,,"`);

      const presentCount = workers.filter(
        (w) => w.todayStatus === "present",
      ).length;
      const absentCount = workers.filter(
        (w) => w.todayStatus === "absent",
      ).length;
      const totalHours = workers.reduce((sum, w) => sum + w.hoursToday, 0);

      csvRows.push(`"Present Workers:,${presentCount}"`);
      csvRows.push(`"Absent Workers:,${absentCount}"`);
      csvRows.push(`"Total Hours:,${totalHours}"`);

      // Creating and download CSV
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `site-workers-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Excel file exported successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to export Excel file");
    }
  };

  return (
    <RoleGuard allowedRoles={["FOREMAN"]}>
      <LoadingBoundary loading={loading} fullScreen>
        <div className="min-h-screen bg-background">
          <AuthenticatedHeader />

          <main className="pt-[20px]">
            <div className=" px-4 py-6 md:px-2 md:py-8 lg:px-2 shadow shadow-xl shadow-gray-500">
              <div>{siteInfo && <SiteHeader site={siteInfo} />}</div>

              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 md:mb-8">
                <SiteOverviewCard
                  title="Total Workers"
                  value={siteActiveWorkers.length}
                  subtitle="Assigned to site"
                  iconName="Users"
                  iconColor="var(--color-primary)"
                />

                <SiteOverviewCard
                  title="Present Today"
                  value={PresentWorkers}
                  iconName="UserCheck"
                  iconColor="var(--color-success)"
                />

                <SiteOverviewCard
                  title="Total Hours"
                  value={2}
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
              </div>

              {/* payment proccessing section */}
              <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
                {/* Header with Toggle */}
                <div
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() =>
                    setShowPaymentRequestCard(!showPaymentRequestCard)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon
                        name="DollarSign"
                        size={18}
                        color="var(--color-primary)"
                      />
                    </div>
                    <div>
                      <h1 className="text-base font-semibold text-foreground">
                        Payments
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        {siteInfo?.batchpayments.length === 0
                          ? "No pending batch payment requests"
                          : `${siteInfo?.batchpayments.length || 0} batch pending request${siteInfo?.batchpayments.length !== 1 ? "s" : ""}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {siteInfo?.singleworkerpayments.length === 0
                          ? "No pending batch payment requests"
                          : `${siteInfo?.singleworkerpayments.length || 0} batch pending request${siteInfo?.singleworkerpayments.length !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {siteOverview?.pendingPayments > 0 && (
                      <div className="bg-warning/15 rounded-full px-2.5 py-0.5">
                        <span className="text-xs font-medium text-warning">
                          {siteOverview.pendingPayments}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={() => {
                        setShowPaymentRequestCard(!showPaymentRequestCard);
                      }}
                    >
                      <Icon
                        name={
                          showPaymentRequestCard ? "ChevronUp" : "ChevronDown"
                        }
                        size={20}
                      />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                {showPaymentRequestCard && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="border-t border-border pt-4">
                      <PaymentRequestCard
                        pendingRequests={siteOverview?.pendingPayments}
                        onViewHistory={handleViewPaymentHistory}
                        siteId={siteId}
                        onPaymentSuccess={() => {
                          setShowPaymentRequestCard(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* worker management */}

              <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
                <div className="p-4 border-b border-border md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-80">
                      <h2 className="text-lg font-semibold text-foreground md:text-xl">
                        Worker Management
                      </h2>
                      <p className="caption text-muted-foreground text-sm">
                        {workers?.length} Active workers assigned to your site
                      </p>
                    </div>
                    <Button
                      onClick={handleExportPDF}
                      className="hidden md:inline-flex pr-auto"
                    >
                      Export pdf file
                    </Button>
                    <Button
                      onClick={handleExportExcel}
                      className="hidden md:inline-flex pr-auto"
                    >
                      Export Excel file
                    </Button>
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

                {/* site settings  */}
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Site Configuration
                  </h1>
                  {siteInfo && (
                    <SiteSettingsComponent
                      handleSettingsUpdate={handleSettingsUpdate}
                      siteID={siteId}
                      initialDate={currentDate}
                      setCurrentDate={handleDateChange} // Pass the setter function
                    />
                  )}
                </div>

                {/* Worker table */}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell md:px-6 md:py-4">
                          WORKER
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell md:px-6 md:py-4">
                          JOB
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider md:px-6 md:py-4">
                          STATUS
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell md:px-6 md:py-4">
                          TIME WORKED
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell md:px-6 md:py-4">
                          RATE
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider md:px-6 md:py-4">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {filteredWorkers.length > 0 ? (
                        filteredWorkers.map((worker) => {
                          // ✅ Skip if worker or worker.id is undefined/null/empty
                          if (
                            !worker?.id ||
                            (worker.id as string).length === 0
                          ) {
                            return null; // Return null, not undefined
                          }

                          const userForWorker = siteActiveWorkers.find(
                            (w) => w.worker.id === worker.id, // worker.id is already a string
                          )?.worker;

                          return (
                            <WorkerTableRow
                              deleteAttendance={deleteAttendance}
                              siteSettings={
                                currentSettings || {
                                  id: "1",
                                  siteId: "",
                                  createdAt: currentDate,
                                  updatedAt: currentDate,
                                  baseHourlyRate: 0,
                                  maxDailyHours: 0,
                                  overtimeRate: 0,
                                }
                              }
                              currentDate={currentDate}
                              recordAttendance={handleRecordAttendance}
                              currentyWorkEntryId={worker.currentWorkEntryId}
                              key={worker.id}
                              user={userForWorker as User}
                              worker={worker}
                              onRecordAttendance={handleRecordAttendanced}
                              onViewUserDetails={handleViewUserDetails}
                            />
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No workers found
                          </td>
                        </tr>
                      )}
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

          {showAttendanceModal && selectedWorker && currentSettings && (
            <AttendanceModal
              worker={selectedWorker}
              currentDate={currentDate}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              siteSettings={currentSettings}
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
              searchQuery={userModalSearchQuery}
              onClose={() => {
                setShowUserModal(false);
                setSelectedUser(null);
              }}
            />
          )}
        </div>

        <div>
          <UserManagementPanel
            propsUsers={siteActiveWorkers}
            verificationData={verificationData}
            resendOtp={resendOtp}
            verificationResponse={verificationResponse}
            onVerifyEmail={handleEmailVerification}
            onResendOtp={handleResendOtp}
            onCreateUser={handleCreateUser}
            onBlockUser={handleBlockUser}
            onUnblockUser={handleUnblockUser}
            onSetResendOtp={setResendOtp}
          />
        </div>

        {/* {showUserModal && selectedUser && (
          <WorkerModal
            worker={selectedUser}
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
          />
        )} */}
      </LoadingBoundary>
    </RoleGuard>
  );
};
export default ForemanDashboard;
