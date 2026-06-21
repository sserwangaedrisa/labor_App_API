import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import authorizeCreate from "../../../api/authorizeCreate";
import authorizeGetRequest from "../../../api/authorizeGetRequest";
import authorizePostRequest from "../../../api/authorizePostRequest";

import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Image from "../../../components/ui/AppImage";
import type { UserRole, User } from "../../../types/SharedTypes";
import Loading from "../../../components/ui/Loading";

/* ================= TYPES ================= */

interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  sites?: string[];
  wageRating: number | string;
  verificationCode?: string;
  job: string;
  image?: File | null;
}

interface EmailVerificationData {
  userId: string;
  otp: string;
}

interface VerifyAccountResponse {
  status: string;
  message: string;
  userId?: string;
}

interface PaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  startIndex?: number;
  endIndex?: number;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  message: string;
  count: number;
  pagination: PaginationMetadata;
}

/* ================= MAIN COMPONENT ================= */

export const UserManagementPanel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [resendOtp, setResendOtp] = useState<boolean>(false);
  const [verificationResponse, setVerificationResponse] =
    useState<VerifyAccountResponse | null>(null);

  const [verificationInfo, setVerificationInfo] =
    useState<EmailVerificationData>({
      userId: "",
      otp: "",
    });

  const [verificationData, setVerificationData] =
    useState<EmailVerificationData>({
      userId: "",
      otp: "",
    });

  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "LABORER",
    wageRating: "",
    sites: [],
    verificationCode: "",
    job: "",
    image: null,
  });

  const [activeWorkers, setActiveWorkers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  });

  // Filter and sort state
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    sortBy: "name",
    sortOrder: "asc" as "asc" | "desc",
  });

  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deactivationReason, setDeactivationReason] = useState<string>("");
  const [deactivationReasonError, setDeactivationReasonError] =
    useState<string>("");

  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);

  if (!activeWorkers || activeWorkers.length === 0) {
    console.log("No active workers found");
  }

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await authorizeGetRequest<{
          success: boolean;
          data: { id: string; name: string }[];
          message: string;
        }>("sites/allSitesIdsAndNames");

        if (response.success) {
          setSites(response.data);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    fetchSites();
  }, []);

  const jobOptions = [
    { value: "HELPER", label: "Helper" },
    { value: "MASON", label: "Mason" },
    { value: "STEEL_FIXER", label: "Steel Fixer" },
    { value: "PAINTER", label: "Painter" },
    { value: "ELECTRICIAN", label: "Electrician" },
    { value: "SITE_ADMIN", label: "Site Admin" },
    { value: "ADMIN", label: "Admin" },
  ];

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "OWNER", label: "Owner" },
    { value: "FOREMAN", label: "Foreman" },
    { value: "WORKER", label: "Worker" },
    { value: "LABORER", label: "Laborer" },
    { value: "HELPER", label: "Helper" },
    { value: "MASON", label: "Mason" },
    { value: "STEEL_FIXER", label: "Steel Fixer" },
    { value: "PAINTER", label: "Painter" },
    { value: "ELECTRICIAN", label: "Electrician" },
    { value: "SITE_ADMIN", label: "Site Admin" },
    { value: "ADMIN", label: "Admin" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "BLOCKED", label: "Blocked" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  // Fetch users with pagination and filters
  const fetchUsers = async (
    page: number = 1,
    limit: number = pagination.itemsPerPage,
    additionalFilters?: Partial<typeof filters>,
  ) => {
    try {
      setLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit ? limit.toString() : "10",
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      // Add search filter
      const searchValue =
        additionalFilters?.search !== undefined
          ? additionalFilters.search
          : filters.search;
      if (searchValue) {
        queryParams.append("search", searchValue);
      }

      // Add role filter
      const roleValue =
        additionalFilters?.role !== undefined
          ? additionalFilters.role
          : filters.role;
      if (roleValue && roleValue !== "all") {
        queryParams.append("role", roleValue);
      }

      // Add status filter
      const statusValue =
        additionalFilters?.status !== undefined
          ? additionalFilters.status
          : filters.status;
      if (statusValue && statusValue !== "all") {
        queryParams.append("status", statusValue);
      }
      console.log("Fetching users with params:", queryParams.toString());

      const response = await authorizeGetRequest<UsersResponse>(
        `users/allUsers?${queryParams.toString()}`,
      );

      if (!response) {
        console.log("no users found");
        toast.error("No users found");
        return;
      }

      if (!response.success) {
        console.log(response.message);
        toast.error(response.message);
        return;
      }

      // Update state with paginated data
      setActiveWorkers(response.data);
      setUsers(response.data);
      setPagination(response.pagination);

      return response;
    } catch (error) {
      console.log("error while getting users", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Load next page
  const loadNextPage = async () => {
    if (pagination.hasNextPage && !loading && !loadingMore) {
      setLoadingMore(true);
      await fetchUsers(pagination.currentPage + 1, pagination.itemsPerPage);
      setLoadingMore(false);
    }
  };

  // Load previous page
  const loadPrevPage = async () => {
    if (pagination.hasPrevPage && !loading && !loadingMore) {
      setLoadingMore(true);
      await fetchUsers(pagination.currentPage - 1, pagination.itemsPerPage);
      setLoadingMore(false);
    }
  };

  // Change page size
  const changePageSize = async (newLimit: number) => {
    setLoading(true);
    await fetchUsers(1, newLimit);
    setLoading(false);
  };

  // Apply filters
  const applyFilters = async (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await fetchUsers(1, pagination.itemsPerPage, newFilters);
  };

  // Handle search with debounce
  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm });

    // Debounce search
    const timeoutId = setTimeout(() => {
      applyFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle role filter
  const handleRoleFilter = (role: string) => {
    applyFilters({ role: role === "all" ? "" : role });
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    applyFilters({ status: status === "all" ? "" : status });
  };

  // Handle sorting
  const handleSort = (sortBy: string) => {
    const newSortOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    applyFilters({ sortBy, sortOrder: newSortOrder });
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers(1, 10);
  }, []);

  useEffect(() => {
    if (verificationData?.userId) {
      setVerificationInfo({
        ...verificationInfo,
        userId: verificationData.userId,
      });
      setEmailVerification(true);
    }
  }, [verificationData]);

  // Create User Function
  const handleCreateUserAPI = async (userData: FormData): Promise<boolean> => {
    try {
      const response = await authorizeCreate("users/register", userData);

      if (response.status === "success") {
        setVerificationData({ ...verificationData, userId: response.userId });
        toast.success(response.message);
        return true;
      }

      toast.error(response.message);
      return false;
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user. Please try again.");
      return false;
    }
  };

  // Email Verification Function
  const handleEmailVerificationAPI = async (data: EmailVerificationData) => {
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
        setEmailVerification(false);
        // Refresh user list after successful verification
        await fetchUsers(pagination.currentPage, pagination.itemsPerPage);
      } else if (response.status === "expired") {
        console.log("OTP expired");
        setVerificationData({ ...data, otp: "" });
        setResendOtp(true);
        toast.error(response.message);
      } else {
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

  // Resend OTP Function
  const handleResendOtpAPI = async (): Promise<VerifyAccountResponse> => {
    try {
      const response = await authorizePostRequest<VerifyAccountResponse>(
        "users/resend-otp",
        { userId: verificationData.userId },
      );

      if (response.status === "success") {
        toast.success(
          "OTP resent successfully, check your email for the new otp.",
        );
        setResendOtp(false);
        setVerificationResponse(null);
        return response;
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

  // Block User Function
  const handleBlockUserAPI = async (
    userId: string,
    deactivationReason: string,
  ): Promise<boolean> => {
    try {
      const response = await authorizePostRequest<{
        success: boolean;
        message: string;
      }>("users/blockUser", { userId, deactivationReason });

      if (!response.success) {
        toast.error(response?.message || "Failed to block the user");
        return false;
      }

      toast.success("User blocked successfully");
      return true;
    } catch (error) {
      console.log("error while blocking user:", error);
      toast.error("Failed to block the user");
      return false;
    }
  };

  // Unblock User Function
  const handleUnblockUserAPI = async (userId: string): Promise<boolean> => {
    try {
      const response = await authorizePostRequest<{
        success: boolean;
        message: string;
      }>("users/unblockUser", { userId });

      if (!response.success) {
        toast.error(response.message || "Failed to unblock user");
        return false;
      }

      toast.success("User unblocked successfully");
      return true;
    } catch (error) {
      console.log("error while unblocking the user: ", error);
      toast.error("Failed to unblock the user");
      return false;
    }
  };

  // Create User Handler
  const handleCreateUser = async () => {
    if (!newUser?.name || !newUser?.email || !newUser?.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone);
      formData.append("role", newUser.role);
      formData.append("password", newUser.password);
      formData.append("wageRating", String(newUser.wageRating));
      formData.append("job", newUser.job);
      if (newUser.sites && newUser.sites.length > 0) {
        newUser.sites.forEach((site) => {
          formData.append("sites", site);
        });
      }
      if (newUser.image) {
        formData.append("image", newUser.image);
      }

      const success = await handleCreateUserAPI(formData);

      if (success) {
        setNewUser({
          name: "",
          password: "",
          email: "",
          wageRating: "",
          phone: "",
          role: "LABORER",
          job: "",
          sites: [],
          verificationCode: "",
          image: null,
        });
        setShowCreateModal(false);
        setEmailVerification(true);
      }
    } catch (error) {
      console.log("error while creating user", error);
      toast.error("Error while creating user");
    } finally {
      setLoading(false);
    }
  };

  // Email Verification Handler
  const handleEmailVerification = async () => {
    if (!verificationInfo.otp) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      await handleEmailVerificationAPI(verificationInfo);
    } catch (error) {
      console.log("error while verifying email: ", error);
      toast.error("Error while verifying email");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (!verificationData.userId) {
      toast.error("No user ID found");
      return;
    }

    setLoading(true);
    try {
      const response = await handleResendOtpAPI();
      if (response.status === "success") {
        setResendOtp(false);
        setEmailVerification(true);
      }
    } catch (error) {
      console.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Block User Handler
  const handleBlockClick = (user: User) => {
    setSelectedUser(user);
    setDeactivationReasonError("");
    setDeactivationReason("");
    setShowBlockModal(true);
  };

  // Confirm Block Handler
  const handleConfirmBlock = async () => {
    if (!deactivationReason.trim()) {
      setDeactivationReasonError("Please provide a reason for deactivation");
      return;
    }

    if (deactivationReason.trim().length < 5) {
      setDeactivationReasonError(
        "Please provide a more detailed reason (min 5 characters)",
      );
      return;
    }

    setLoading(true);
    try {
      const userId = selectedUser?.id;
      if (!userId) return;

      const response = await handleBlockUserAPI(userId, deactivationReason);

      if (response) {
        setShowBlockModal(false);
        setSelectedUser(null);
        // Refresh current page after blocking
        await fetchUsers(pagination.currentPage, pagination.itemsPerPage);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user");
    } finally {
      setLoading(false);
    }
  };

  // Unblock User Handler
  const handleUnBlock = async (userId: string) => {
    setLoading(true);
    try {
      const unblocked = await handleUnblockUserAPI(userId);
      if (unblocked) {
        // Refresh current page after unblocking
        await fetchUsers(pagination.currentPage, pagination.itemsPerPage);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Error occurred while unblocking user");
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const getRoleBadgeColor = (job: string): string => {
    const colors: Record<string, string> = {
      USER: "bg-gray-100 text-gray-700",
      HELPER: "bg-yellow-100 text-yellow-700",
      LABORER: "bg-orange-100 text-orange-700",
      MASON: "bg-amber-200 text-amber-900",
      STEEL_FIXER: "bg-slate-300 text-slate-900",
      PAINTER: "bg-pink-100 text-pink-700",
      ELECTRICIAN: "bg-blue-100 text-blue-700",
      FOREMAN: "bg-purple-100 text-purple-700",
      SITE_ADMIN: "bg-indigo-100 text-indigo-700",
      ADMIN: "bg-red-100 text-red-700",
    };

    return colors[job] || "bg-gray-100 text-gray-600";
  };

  // Pagination Controls Component
  const PaginationControls = () => (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={loadPrevPage}
          disabled={!pagination.hasPrevPage || loading || loadingMore}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Previous
        </Button>
        <Button
          onClick={loadNextPage}
          disabled={!pagination.hasNextPage || loading || loadingMore}
          className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next
        </Button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {pagination.startIndex ||
                (pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}
            </span>{" "}
            of <span className="font-medium">{pagination.totalItems}</span>{" "}
            results
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Page size selector */}
          <select
            value={pagination.itemsPerPage}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md"
            disabled={loading}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <Button
              onClick={loadPrevPage}
              disabled={!pagination.hasPrevPage || loading}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => fetchUsers(pageNum, pagination.itemsPerPage)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      pagination.currentPage === pageNum
                        ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}

            <Button
              onClick={loadNextPage}
              disabled={!pagination.hasNextPage || loading}
              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              Next
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-6xl md:text-xl font-semibold  text-orange-500 mb-1">
              User Management
            </h3>
            <p className="text-lg text-muted-foreground">
              {pagination.totalItems} user
              {pagination.totalItems !== 1 ? "s" : ""} found
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full lg:w-auto cursor-pointer text-lg bg-green-500/50 hover:bg-green-500/30"
          >
            Create New User
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by name, email, or ID..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={roleOptions}
              value={filters.role || "all"}
              onChange={(value) => handleRoleFilter(value)}
              placeholder="Filter by role"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={statusOptions}
              value={filters.status || "all"}
              onChange={(value) => handleStatusFilter(value)}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>

      {/* Users List - Table View */}
      <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto mb-5 mx-5 border rounded-lg bg-slate-300">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th
                  className="text-left px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <span className="text-xl font-bold text-foreground">
                    User{" "}
                    {filters.sortBy === "name" &&
                      (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </span>
                </th>
                <th className="text-left px-6 py-4">
                  <span className="text-xl font-bold text-foreground">
                    Contact
                  </span>
                </th>
                <th
                  className="text-center px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("job")}
                >
                  <span className="text-xl font-bold text-foreground">
                    Role{" "}
                    {filters.sortBy === "job" &&
                      (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </span>
                </th>
                <th
                  className="text-left px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <span className="text-xl font-bold text-foreground">
                    Since{" "}
                    {filters.sortBy === "createdAt" &&
                      (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="text-sm font-bold text-foreground">
                    Status
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="text-xl font-bold text-foreground">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => {
                if (!user) {
                  console.error("Invalid user data:", user);
                  return null;
                }
                return (
                  <tr
                    key={user?.id}
                    className="border-b border-border hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={user?.imageUrl || undefined}
                            alt={user.name || "user"}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user?.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-foreground">{user?.email}</p>
                        <p className="text-muted-foreground">
                          {user?.phone || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.job || "")}`}
                        >
                          <Icon name="AArrowDown" size={12} />
                          {user.job
                            ? user.job.charAt(0).toUpperCase() +
                              user.job.slice(1).toLowerCase()
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {user?.createdAt
                          ? new Date(user.createdAt).toISOString().split("T")[0]
                          : "Not available"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            user.status !== "ACTIVE"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-success/10 text-success"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status !== "ACTIVE"
                                ? "bg-purple-700"
                                : "bg-purple-700/20"
                            }`}
                          ></span>
                          {user.status !== "ACTIVE" ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.status !== "ACTIVE" ? (
                          <Button
                            onClick={() => handleUnBlock(user.id)}
                            className="hover:bg-success/10 hover:text-success"
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleBlockClick(user)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-border mb-10 mx-5">
          {users?.map((user) => (
            <div
              key={user?.id}
              className="p-4 bg-slate-300 mb-3 border rounded-lg"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 md:w-12 md:h-12">
                    <Image
                      src={user.imageUrl || undefined}
                      alt={user.name || "user"}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate text-xl">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {user?.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    user?.status !== "ACTIVE"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/10 text-success"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user?.status !== "ACTIVE"
                        ? "bg-destructive"
                        : "bg-success"
                    }`}
                  ></span>
                  {user?.status !== "ACTIVE" ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    name="Mail"
                    size={14}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-foreground truncate">
                    {user?.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    name="Phone"
                    size={14}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-foreground">
                    {user?.phone || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.job || "")}`}
                  >
                    <Icon name="ArrowDown" size={12} />
                    {user?.job
                      ? user.job.charAt(0).toUpperCase() +
                        user.job.slice(1).toLowerCase()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wage Rating:</span>
                  <span className="font-medium text-foreground">
                    {user?.wageRating || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Since:</span>
                  <span className="font-medium text-foreground">
                    {user?.createdAt
                      ? new Date(user.createdAt).toISOString().split("T")[0]
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {user?.status !== "ACTIVE" ? (
                  <Button
                    onClick={() => handleUnBlock(user.id)}
                    className="flex-1"
                  >
                    Unblock User
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleBlockClick(user)}
                    className="flex-1"
                  >
                    Block User
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <Loading message="Loading more..." />
          </div>
        )}

        {/* Empty State */}
        {users?.length === 0 && !loading && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                name="Users"
                size={32}
                color="var(--color-muted-foreground)"
              />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">
              No Users Found
            </h4>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && users?.length > 0 && <PaginationControls />}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl shadow-blue-500/50">
              <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    Create New User
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
                    disabled={loading}
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-foreground border-b border-border pb-2">
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="user-name"
                      name="name"
                      label="Full Name *"
                      type="text"
                      placeholder="Enter full name"
                      value={newUser?.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e?.target?.value })
                      }
                      required
                      disabled={loading}
                    />

                    <Input
                      id="user-email"
                      name="email"
                      label="Email Address *"
                      type="email"
                      placeholder="Enter email address"
                      value={newUser?.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e?.target?.value })
                      }
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="user-password"
                      name="password"
                      type="password"
                      label="Password *"
                      placeholder="Enter password"
                      value={newUser?.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e?.target?.value })
                      }
                      required
                      disabled={loading}
                    />

                    <Input
                      id="user-phone"
                      name="phone"
                      label="Phone Number *"
                      type="tel"
                      placeholder="Enter phone number"
                      value={newUser?.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e?.target?.value })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Role and Job Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-foreground border-b border-border pb-2">
                    Role & Job Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border boder-gray-300 rounded-md">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        System Role *
                      </label>
                      <Select
                        id="user-role"
                        name="role"
                        options={roleOptions}
                        value={newUser?.role}
                        onChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                        placeholder="Select system role"
                        disabled={loading}
                        className="text-bold"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Determines system access level
                      </p>
                    </div>

                    <div className="border boder-gray-300 rounded-md">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Job Title *
                      </label>
                      <Select
                        id="user-job"
                        name="job"
                        options={jobOptions}
                        value={newUser?.job}
                        onChange={(value) =>
                          setNewUser({ ...newUser, job: value })
                        }
                        placeholder="Select job title"
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Specific job role for site work
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      id="user-wage-rating"
                      name="wageRating"
                      label="Wage Rating ($/hour) *"
                      type="number"
                      placeholder="Enter hourly wage rate"
                      value={newUser.wageRating}
                      step={0.5}
                      onChange={(e) =>
                        setNewUser({ ...newUser, wageRating: e?.target?.value })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Site Assignment Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-foreground border-b border-border pb-2">
                    Site Assignment
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Assign to Sites *
                    </label>
                    {sites.length > 0 ? (
                      <div className="space-y-2 border border-border rounded-lg p-4 max-h-48 overflow-y-auto">
                        {sites.map((site) => (
                          <label
                            key={site.id}
                            className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              value={site.id}
                              checked={
                                newUser.sites?.includes(site.id) || false
                              }
                              onChange={(e) => {
                                const siteId = e.target.value;
                                const currentSites = newUser.sites || [];

                                if (e.target.checked) {
                                  // Add site ID to array
                                  setNewUser({
                                    ...newUser,
                                    sites: [...currentSites, siteId],
                                  });
                                } else {
                                  // Remove site ID from array
                                  setNewUser({
                                    ...newUser,
                                    sites: currentSites.filter(
                                      (id) => id !== siteId,
                                    ),
                                  });
                                }

                                console.log(
                                  "New user state after site change:",
                                  newUser,
                                );
                              }}
                              disabled={loading}
                              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />{" "}
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {site.name}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 border border-dashed border-border rounded-lg">
                        <p className="text-muted-foreground">
                          No sites available
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            // Navigate to create site or refresh sites
                            toast.error("Please create a site first");
                          }}
                        >
                          Create Site
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Select one or more sites to assign this user to
                    </p>
                  </div>

                  {/* Display selected sites count */}
                  {newUser.sites && newUser.sites.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">Selected Sites:</span>{" "}
                        {newUser.sites.length} site(s) selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Profile Image Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-foreground border-b border-border pb-2">
                    Profile Image
                  </h4>

                  <div className="flex items-center gap-4">
                    {newUser.image && (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(newUser.image)}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                        />
                        <button
                          onClick={() =>
                            setNewUser({ ...newUser, image: null })
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <Input
                      id="user-image"
                      name="image"
                      label={newUser.image ? "Change Image" : "Upload Image"}
                      type="file"
                      accept="image/*"
                      placeholder="Upload profile image"
                      onChange={(e) => {
                        if (e?.target?.files && e?.target?.files?.[0]) {
                          setNewUser({
                            ...newUser,
                            image: e.target.files?.[0],
                          });
                        }
                      }}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border flex gap-3 sticky bottom-0 bg-card">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={loading || !newUser.sites?.length}
                  className="flex-1"
                >
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Email Verification Modal */}
      {emailVerification && (
        <>
          <div
            className="fixed inset-0 bg-gray-200/70 z-40 backdrop-blur-sm"
            onClick={() => setEmailVerification(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 border border-orange-300">
            <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl shadow-blue-500/50">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  Email Verification
                </h3>
                <button
                  onClick={() => setEmailVerification(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="px-6 py-10 flex flex-col items-center gap-6">
                <p className="text-foreground text-lg text-center font-medium">
                  Please enter the verification code sent to your email
                </p>

                {verificationResponse && (
                  <p
                    className={`text-sm text-center ${
                      verificationResponse.status === "expired"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {verificationResponse.message}
                  </p>
                )}

                <div className="w-full">
                  <label className="block mb-2 text-sm text-muted-foreground">
                    Verification Code
                  </label>
                  <Input
                    label="verificationCode"
                    type="text"
                    placeholder="Enter code here"
                    value={verificationInfo.otp}
                    onChange={(e) => {
                      setVerificationInfo({
                        ...verificationInfo,
                        otp: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-3">
                <Button onClick={() => setEmailVerification(false)}>
                  Cancel
                </Button>
                {resendOtp && (
                  <Button onClick={handleResendOtp}>Resend OTP</Button>
                )}
                {!resendOtp && (
                  <Button onClick={handleEmailVerification}>Submit</Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Block User Modal */}
      {showBlockModal && selectedUser && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal"
            onClick={() => setShowBlockModal(false)}
          />
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl shadow-red-500/50">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    Block User
                  </h3>
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
                    disabled={loading}
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                      <Icon
                        name="User"
                        size={24}
                        color="var(--color-destructive)"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedUser.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Icon
                      name="AlertTriangle"
                      size={18}
                      color="var(--color-destructive)"
                      className="mt-0.5"
                    />
                    <p className="text-sm text-destructive">
                      This action will deactivate the user account. The user
                      will not be able to access the system until unblocked.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Deactivation Reason{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="deactivation-reason"
                    name="deactivationReason"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-destructive/50 bg-background text-foreground"
                    placeholder="Please provide a reason for deactivating this user (e.g., policy violation, performance issues, etc.)"
                    value={deactivationReason}
                    onChange={(e) => {
                      setDeactivationReason(e.target.value);
                    }}
                    disabled={loading}
                  />
                  {deactivationReasonError && (
                    <p className="text-sm text-destructive">
                      {deactivationReasonError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Required (min 5 characters)
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-border flex gap-3">
                <Button
                  onClick={() => setShowBlockModal(false)}
                  disabled={loading}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBlock}
                  disabled={loading}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {loading ? "Blocking..." : "Block User"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Global Loading Overlay */}
      {loading && !loadingMore && (
        <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Loading message="Processing..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPanel;
