import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Image from "../../../components/ui/AppImage";
import type { User, UserRole } from "../../../types/SharedTypes";
import Loading from "../../../components/ui/Loading";

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
  users?: User[];
  resendOtp: boolean;
  verificationData: EmailVerificationData;
  verificationResponse: HandleResendOtpResponse | null;
  onCreateUser: (newUser: FormData) => Promise<boolean>;
  onVerifyEmail: (data: EmailVerificationData) => void;
  onResendOtp: () => Promise<HandleResendOtpResponse>;
  onBlockUser: (user: User) => void;
  onUnblockUser: (user: User) => void;
  onSetResendOtp: (value: boolean) => void;
}

export const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  users,
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

  useEffect(() => {
    if (verificationData?.userId) {
      setVerificationInfo({
        ...verificationInfo,
        userId: verificationData.userId,
      });
      setEmailVerification(true);
    }
  }, [verificationData]);

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
      user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesRole = roleFilter === "all" || user?.role === roleFilter;

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
      {loading && <Loading message="Loading..." />}

      <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
              User Management
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredUsers?.length} user
              {filteredUsers?.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Button
            onClick={() => {
              toast("Create New User clicked");
              setShowCreateModal(true);
            }}
            className="w-full lg:w-auto"
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
          <div className="w-full md:w-48">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Filter by role"
            />
          </div>
        </div>
      </div>
      {/* Users List */}
      <div className="bg-card rounded-xl shadow-elevation-2 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    User
                  </span>
                </th>
                <th className="text-left px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    Contact
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    Role
                  </span>
                </th>
                <th className="text-left px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    Assigned Site
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    Status
                  </span>
                </th>
                <th className="text-center px-6 py-4">
                  <span className="text-sm font-semibold text-foreground">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr
                  key={user?.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 md:w-12 md:h-12">
                        <Image src={user.imageUrl} alt={"user"} />
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon
                          key="color"
                          name="AArrowDown"
                          size={18}
                          color="var(--color-primary)"
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
                      <p className="text-muted-foreground">{user?.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}
                      >
                        <Icon key="arrowDown" name="AArrowDown" size={12} />
                        {user.job
                          ? user?.job?.charAt(0)?.toUpperCase() +
                            user?.job?.slice(1)
                          : null}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {user?.sites || "Not assigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.status !== "Active"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status !== "Active"
                              ? "bg-destructive"
                              : "bg-success"
                          }`}
                        ></span>
                        {user.status !== "Active" ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {user.status !== "Active" ? (
                        <Button
                          onClick={() => onUnblockUser(user)}
                          className="hover:bg-success/10 hover:text-success"
                        >
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onBlockUser(user)}
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
        <div className="lg:hidden divide-y divide-border">
          {filteredUsers?.map((user) => (
            <div key={user?.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon
                      key="color"
                      name="AArrowDown"
                      color="var(--color-primary)"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {user?.id}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    user?.status !== "Active"
                      ? "bg-success/10 text-success"
                      : null
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user?.status !== "Active"
                        ? "bg-destructive"
                        : "bg-success"
                    }`}
                  ></span>
                  {user?.status !== "Active" ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    key="mail"
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
                    key="phone"
                    name="Phone"
                    size={14}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-foreground">{user?.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}
                  >
                    <Icon name="ArrowDown" key="Users" size={12} />
                    {user?.role?.charAt(0)?.toUpperCase() +
                      user?.role?.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Site:</span>
                  <span className="font-medium text-foreground">
                    {user?.sites || "Not assigned"}
                  </span>
                </div>
              </div>

              {user?.status !== "Active" ? (
                <Button onClick={() => onUnblockUser(user)}>
                  Unblock User
                </Button>
              ) : (
                <Button onClick={() => onBlockUser(user)}>Block User</Button>
              )}
            </div>
          ))}
        </div>

        {filteredUsers?.length === 0 && (
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                key="users"
                name="Users"
                size={32}
                color="var(--color-muted-foreground)"
              />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              No Users Found
            </h4>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
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
                    <Icon key="x" name="X" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Disable all inputs when loading */}
                <Input
                  label="name"
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
                  label="email"
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
                  type="password"
                  label="password"
                  placeholder="Enter password"
                  value={newUser?.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e?.target?.value })
                  }
                  disabled={loading}
                />

                <Input
                  label="phone"
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
                      label="Job"
                      disabled={loading}
                      type="text"
                      placeholder="Select the Job "
                      value={newUser?.job}
                      onChange={(e) =>
                        setNewUser({ ...newUser, job: e?.target?.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex-2">
                    <Select
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
                  label="image"
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

          {loading && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
                  <Icon key="x" name="X" size={20} />
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
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <Loading message="Submitting..." />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagementPanel;
