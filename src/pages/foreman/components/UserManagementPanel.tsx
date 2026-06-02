import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Image from "../../../components/ui/AppImage";
import type { ActiveWorker, User, UserRole } from "../../../types/SharedTypes";
import Loading from "../../../components/ui/Loading";
import type { RoleOption } from "../../../types/auth.types";

/* ================= TYPES ================= */

// type UserRole = "LABORER" | "FOREMAN" | "OWNER";
type RoleFilter = UserRole | "all";

interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  sites?: string;
  wageRating: number | string;
  verificationCode?: string;
  job: string;
  image?: File | null;
}

interface EmailVerificationData {
  userId: string;
  otp: string;
}

interface HandleResendOtpResponse {
  status: string;
  message: string;
}

interface UserManagementPanelProps {
  propsUsers?: ActiveWorker[];
  resendOtp: boolean;
  verificationData: EmailVerificationData;
  verificationResponse: HandleResendOtpResponse | null;
  onCreateUser: (newUser: FormData) => Promise<boolean>;
  onVerifyEmail: (data: EmailVerificationData) => void;
  onResendOtp: () => Promise<HandleResendOtpResponse>;
  onBlockUser: (userId: string, deactivationReason: string) => Promise<boolean>;
  onUnblockUser: (userId: string) => Promise<boolean>;
  onSetResendOtp: (value: boolean) => void;
}

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  propsUsers,
  resendOtp,
  verificationData,
  verificationResponse,
  onCreateUser,
  onBlockUser,
  onUnblockUser,
  onVerifyEmail,
  onResendOtp,
  onSetResendOtp,
}) => {
  const [loading, SetLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [verificationInfo, setVerificationInfo] = useState<{
    userId: string;
    otp: string;
  }>({
    userId: verificationData.userId,
    otp: "",
  });
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "LABORER",
    wageRating: "",
    sites: "",
    verificationCode: "",
    job: "",
    image: null,
  });

  const [users, setUsers] = useState<ActiveWorker[]>([]);
  // Blocking user states

  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ActiveWorker | null>(null);
  const [deactivationReason, setDeactivationReason] =
    useState<string>("Miss_behaving");
  const [deactivationReasonError, setDeactivationReasonError] =
    useState<string>("");

  useEffect(() => {
    if (verificationData?.userId) {
      setVerificationInfo({
        ...verificationInfo,
        userId: verificationData.userId,
      });
      setEmailVerification(true);
    }
  }, [verificationData]);

  useEffect(() => {
    if (propsUsers) {
      setUsers(propsUsers);
    }
  }, [propsUsers]);

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

  const siteOptions = [
    { value: "downtown-plaza", label: "Downtown Plaza Construction" },
    { value: "riverside-towers", label: "Riverside Towers Project" },
    { value: "industrial-park", label: "Industrial Park Development" },
    { value: "suburban-complex", label: "Suburban Housing Complex" },
  ];

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user?.worker.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.worker.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.worker.id?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user?.worker.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async () => {
    if (newUser?.name && newUser?.email && newUser?.phone) {
      SetLoading(true);

      try {
        const formData = new FormData();
        formData.append("name", newUser.name);
        formData.append("email", newUser.email);
        formData.append("phone", newUser.phone);
        formData.append("role", newUser.role);
        formData.append("password", newUser.password);
        formData.append("wageRating", String(newUser.wageRating));
        formData.append("job", newUser.job);
        if (newUser.image) {
          formData.append("image", newUser.image);
        }

        const success = await onCreateUser(formData);

        if (success) {
          setNewUser({
            name: "",
            password: "",
            email: "",
            wageRating: "",
            phone: "",
            role: "LABORER",
            job: "",
            sites: "",
            verificationCode: "",
          });

          setShowCreateModal(false);
          setEmailVerification(true);
        }
      } catch (error) {
        console.log("error while creating user", error);
        toast.error("error while creating user");
      } finally {
        SetLoading(false);
      }
    }
  };

  const handleEmailVerification = async () => {
    if (!verificationInfo.otp) {
      alert("Please enter the verification code");
      return;
    }
    try {
      onVerifyEmail(verificationInfo);
      SetLoading(true);
    } catch (error) {
      console.log("error while verifying email: ", error);
      toast.error("Error while verifying email");
    } finally {
      SetLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!verificationInfo.userId) {
      return;
    }
    SetLoading(true);
    try {
      const response = await onResendOtp();
      if (response.status === "success") {
        onSetResendOtp(false);
        setEmailVerification(true);
      }
    } catch (error) {
      console.error("Failed to resend OTP. Please try again.");
    } finally {
      SetLoading(false);
    }
  };

  // blocking user functions
  const handleBlockClick = (user: ActiveWorker) => {
    setSelectedUser(user);
    setDeactivationReasonError("");
    setDeactivationReason("");
    setShowBlockModal(true);
  };

  // blocking user confirmantion

  const handleConfirmBlock = async () => {
    if (!deactivationReason.trim()) {
      setDeactivationReasonError("Please provide a reason for deactivation");
      return;
    }

    if (deactivationReason.trim().length <= 0) {
      setDeactivationReasonError("Please provide a more detailed reason ");
      return;
    }

    SetLoading(true);
    try {
      const userId = selectedUser?.worker.id;
      if (!userId) return;
      const response = await onBlockUser(userId, deactivationReason);
      if (response) {
        setUsers((prev) =>
          prev.map((u) =>
            u.worker.id === userId
              ? {
                  ...u,
                  worker: {
                    ...u.worker,
                    status: "BLOCKED",
                    isActive: false,
                  },
                }
              : u,
          ),
        );
        setShowBlockModal(false);
        setSelectedUser(null);
      } else {
        setShowBlockModal(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user");
    } finally {
      SetLoading(false);
    }
  };

  const handleUnBlock = async (userId: string) => {
    console.log("handleUnBlock called with userId:", userId); // Add this log
    SetLoading(true);
    try {
      console.log("Attempting to unblock user:", userId);
      const unblocked = await onUnblockUser(userId);
      console.log("Unblock response:", unblocked);

      if (unblocked) {
        setUsers((prev) =>
          prev.map((u) =>
            u.worker.id === userId
              ? {
                  ...u,
                  worker: {
                    ...u.worker,
                    status: "ACTIVE",
                    isActive: true,
                  },
                }
              : u,
          ),
        );
        toast.success("User unblocked successfully");
      } else {
        toast.error("Failed to unblock user");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Error occurred while unblocking user");
    } finally {
      SetLoading(false);
    }
  };
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

  const getRoleIcon = (job: string): string => {
    const icons: Record<string, string> = {
      USER: "User",
      HELPER: "UserPlus",
      LABORER: "HardHat",
      MASON: "Hammer",
      STEEL_FIXER: "Wrench",
      PAINTER: "Paintbrush",
      ELECTRICIAN: "Zap",
      FOREMAN: "ClipboardList",
      SITE_ADMIN: "Settings",
      ADMIN: "ShieldCheck",
    };

    return icons[job] || "User";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* loading component */}
      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground text-orange-500 mb-1">
              User Management
            </h1>
            <p className="text-lg text-muted-foreground">
              {filteredUsers?.length} user
              {filteredUsers?.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Button
            onClick={() => {
              toast("Create New User clicked");
              setShowCreateModal(true);
            }}
            className="w-full lg:w-auto cursor-pointer text-lg bg-green-500/50 hover:bg-green-500/30"
          >
            Create New User
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
            />
          </div>
          <div className="w-full md:w-48 ">
            {/* Fixed Select component usage */}
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as RoleFilter)}
              placeholder="Filter by role"
            />
          </div>
        </div>
      </div>
      {/* Users List */}
      <div className="bg-card  rounded-xl shadow-elevation-2 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto mb-10 mx-5 border rounded-lg bg-slate-300 ">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4">
                  <span className="text-xl font-bold text-foreground">
                    User
                  </span>
                </th>
                <th className="text-left px-6 py-4">
                  <span className="text-xl font-bold text-foreground">
                    Contact
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="text-xl font-bold text-foreground">
                    Role
                  </span>
                </th>
                <th className="text-left px-6 py-4">
                  <span className="text-xl font-bold text-foreground">
                    Since
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
              {filteredUsers?.map((user) => (
                <tr
                  key={user?.worker.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ">
                        <Image
                          src={user.worker?.imageUrl || undefined}
                          alt={user.worker?.name || "user"}
                        />
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon
                          key="arrowDown"
                          name="AArrowDown"
                          size={18}
                          color="var(--color-primary)"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user?.worker.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {user?.worker.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-foreground">{user?.worker.email}</p>
                      <p className="text-muted-foreground">
                        {user?.worker.phone || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.worker.job || "")}`}
                      >
                        {/* Removed duplicate key prop */}
                        <Icon key="arroown" name="AArrowDown" size={12} />
                        {user.worker.job
                          ? user.worker.job.charAt(0).toUpperCase() +
                            user.worker.job.slice(1).toLowerCase()
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {user?.assignedAt
                        ? new Date(user.assignedAt).toISOString().split("T")[0]
                        : "Not assigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.worker.status !== "ACTIVE"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.worker.status !== "ACTIVE"
                              ? "bg-destructive"
                              : "bg-success"
                          }`}
                        ></span>
                        {user.worker.status !== "ACTIVE" ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {user.worker.status !== "ACTIVE" ? (
                        <Button
                          onClick={() => handleUnBlock(user.worker.id)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-border mb-10 mx-5">
          {filteredUsers?.map((user) => (
            <div
              key={user?.worker.id}
              className="p-4 bg-slate-300 mb-3 border rounded-lg "
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon key="arrow" name="AArrowDown" color="orange" />
                  </div>
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 md:w-12 md:h-12">
                    <Image
                      src={user.worker?.imageUrl || undefined}
                      alt={user.worker?.name || "user"}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground truncate text-xl">
                      {user?.worker.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {user?.worker.id}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    user?.worker.status !== "ACTIVE"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/10 text-success"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user?.worker.status !== "ACTIVE"
                        ? "bg-destructive"
                        : "bg-success"
                    }`}
                  ></span>
                  {user?.worker.status !== "ACTIVE" ? "Blocked" : "Active"}
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
                    {user?.worker.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    name="Phone"
                    size={14}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-foreground">
                    {user?.worker.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.worker.job || "")}`}
                  >
                    {/* Removed duplicate key prop */}
                    <Icon name="ArrowDown" size={12} />
                    {user?.worker.job
                      ? user.worker.job.charAt(0).toUpperCase() +
                        user.worker.job.slice(1).toLowerCase()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wage Rating:</span>
                  <span className="font-medium text-foreground">
                    {user?.worker.wageRating || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {user?.worker.status !== "ACTIVE" ? (
                  <Button
                    onClick={() => handleUnBlock(user.worker.id)}
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
        {filteredUsers?.length === 0 && (
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
      </div>
      {/* Create User Modal */}
      {showCreateModal && (
        <>
          {/* Fixed overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl shadow-blue-500/50">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    Create New User
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
                    disabled={loading} // Disable when loading
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Disable all inputs when loading */}
                <Input
                  id="user-name"
                  name="name"
                  label="Name"
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
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser?.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e?.target?.value })
                  }
                  required
                  disabled={loading}
                />
                <Input
                  id="user-password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  value={newUser?.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e?.target?.value })
                  }
                  disabled={loading}
                />
                <Input
                  id="user-phone"
                  name="phone"
                  label="Phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={newUser?.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e?.target?.value })
                  }
                  required
                  disabled={loading}
                />
                <div className="flex flex-row w-full gap-0">
                  <div className="flex-4">
                    <Input
                      id="user-job"
                      name="job"
                      label="Job"
                      disabled={loading}
                      type="text"
                      placeholder="Select the Job"
                      value={newUser?.job}
                      onChange={(e) =>
                        setNewUser({ ...newUser, job: e?.target?.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex-2">
                    <Select
                      id="user-job-select"
                      name="jobSelect"
                      label=""
                      options={roleOptions}
                      value={newUser?.job}
                      onChange={(value) =>
                        setNewUser({ ...newUser, job: value })
                      }
                      placeholder="Select"
                      disabled={loading}
                    />
                  </div>
                </div>
                <Input
                  id="user-wage-rating"
                  name="wageRating"
                  label="Wage Rating"
                  type="number"
                  placeholder="Enter the wage rating"
                  value={newUser.wageRating}
                  step={0.5}
                  onChange={(e) =>
                    setNewUser({ ...newUser, wageRating: e?.target?.value })
                  }
                  required
                  disabled={loading}
                />
                <Input
                  id="user-image"
                  name="image"
                  label="Image"
                  type="file"
                  accept="image/*"
                  placeholder="Upload profile image"
                  onChange={(e) => {
                    if (e?.target?.files && e?.target?.files?.[0]) {
                      setNewUser({ ...newUser, image: e.target.files?.[0] });
                    }
                  }}
                  disabled={loading}
                />
              </div>

              <div className="p-6 border-t border-border flex gap-3">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </div>
          </div>

          {loading && !showBlockModal && (
            <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <Loading message="Creating user..." />
              </div>
            </div>
          )}
        </>
      )}
      {/* ================= EMAIL VERIFICATION MODAL ================= */}
      {emailVerification && (
        <>
          {/* Light gray overlay */}
          <div
            className="fixed inset-0 bg-gray-200/70 z-40 backdrop-blur-sm"
            onClick={() => setEmailVerification(false)}
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 border  border-orange-300">
            <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl shadow-blue-500/50">
              {/* Header */}
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

              {/* Body */}
              <div className="px-6 py-10 flex flex-col items-center gap-6">
                <p className="text-foreground text-lg text-center font-medium">
                  Please enter the verification code sent to your email
                </p>

                {verificationResponse && (
                  <p
                    className={`text-sm text-center text-orange-800 ${verificationResponse.status === "expired" ? "text-destructive" : "text-muted-foreground"}`}
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
                      console.log("verificationInfo", verificationInfo);
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
                  <Button onClick={handleResendOtp}>ResendOtp</Button>
                )}

                {!resendOtp && (
                  <Button onClick={handleEmailVerification}>Submit</Button>
                )}
              </div>
            </div>
          </div>
          {loading && (
            <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <Loading message="Submitting..." />
              </div>
            </div>
          )}
        </>
      )}
      {loading && (
        <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Loading message="Processing..." />
          </div>
        </div>
      )}{" "}
      {/* Block User Modal */}
      {showBlockModal && selectedUser && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal"
            onClick={() => setShowBlockModal(false)}
          />

          {/* Modal container */}
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
                {/* User Information */}
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
                        {selectedUser.worker.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.worker.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
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

                {/* Deactivation Reason */}
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
                  <p className="text-xs text-muted-foreground">Required</p>
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

          {loading && (
            <div className="fixed inset-0 z-[30] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <Loading message="Blocking user..." />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagementPanel;
