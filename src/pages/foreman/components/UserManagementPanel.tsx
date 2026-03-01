import React, { useState } from "react";
import Icon from "../../../components/ui/AppIconl";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

/* ================= TYPES ================= */

type UserRole = "laborer" | "foreman" | "owner";
type RoleFilter = UserRole | "all";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  assignedSite?: string;
  isBlocked: boolean;
}

interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  site: string;
}

interface UserManagementPanelProps {
  users: User[];
  onCreateUser: (user: NewUser) => void;
  onBlockUser: (user: User) => void;
  onUnblockUser: (user: User) => void;
}

/* ================= COMPONENT ================= */

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({
  users,
  onCreateUser,
  onBlockUser,
  onUnblockUser,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    phone: "",
    role: "laborer",
    site: "",
  });

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "laborer", label: "Laborer" },
    { value: "foreman", label: "Foreman" },
    { value: "owner", label: "Owner" },
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

  const handleCreateUser = () => {
    if (newUser?.name && newUser?.email && newUser?.phone) {
      onCreateUser(newUser);
      setNewUser({
        name: "",
        email: "",
        phone: "",
        role: "laborer",
        site: "",
      });
      setShowCreateModal(false);
    }
  };

  const getRoleBadgeColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      laborer: "bg-primary/10 text-primary",
      foreman: "bg-accent/10 text-accent",
      owner: "bg-success/10 text-success",
    };
    return colors?.[role];
  };

  const getRoleIcon = (role: UserRole): string => {
    const icons: Record<UserRole, string> = {
      laborer: "HardHat",
      foreman: "Clipboard",
      owner: "Crown",
    };
    return icons?.[role];
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Search and Create */}
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
            onClick={() => setShowCreateModal(true)}
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
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon
                          key="color"
                          name={getRoleIcon(user?.role)}
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
                        <Icon name={getRoleIcon(user?.role)} size={12} />
                        {user?.role?.charAt(0)?.toUpperCase() +
                          user?.role?.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {user?.assignedSite || "Not assigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user?.isBlocked
                            ? "bg-destructive/10 text-destructive"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user?.isBlocked ? "bg-destructive" : "bg-success"
                          }`}
                        ></span>
                        {user?.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {user?.isBlocked ? (
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
                      name={getRoleIcon(user?.role)}
                      size={18}
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
                    user?.isBlocked
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/10 text-success"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user?.isBlocked ? "bg-destructive" : "bg-success"
                    }`}
                  ></span>
                  {user?.isBlocked ? "Blocked" : "Active"}
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
                    <Icon name={getRoleIcon(user?.role)} size={12} />
                    {user?.role?.charAt(0)?.toUpperCase() +
                      user?.role?.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Site:</span>
                  <span className="font-medium text-foreground">
                    {user?.assignedSite || "Not assigned"}
                  </span>
                </div>
              </div>

              {user?.isBlocked ? (
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
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <div className="bg-card rounded-xl shadow-elevation-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    Create New User
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
                  >
                    <Icon key="x" name="X" size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Enter full name"
                  value={newUser?.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e?.target?.value })
                  }
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser?.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e?.target?.value })
                  }
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={newUser?.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e?.target?.value })
                  }
                  required
                />

                <Select
                  label="User Role"
                  options={[
                    { value: "laborer", label: "Laborer" },
                    { value: "foreman", label: "Foreman" },
                    { value: "owner", label: "Owner" },
                  ]}
                  value={newUser?.role}
                  onChange={(value) => setNewUser({ ...newUser, role: value })}
                  required
                />

                <Select
                  label="Assign to Site"
                  options={siteOptions}
                  value={newUser?.site}
                  onChange={(value) => setNewUser({ ...newUser, site: value })}
                  placeholder="Select a site"
                />
              </div>

              <div className="p-6 border-t border-border flex gap-3">
                <Button onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPanel;
