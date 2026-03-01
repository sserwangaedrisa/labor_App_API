import type { UserRole } from "../types/auth.types";

export const getDashboardRoute = (role: UserRole): string => {
  const routes: Record<UserRole, string> = {
    LABORER: "/laborer",
    FOREMAN: "/foreman/dashboard",
    OWNER: "/owner/dashboard",
  };

  return routes[role] ?? "/login";
};

export default {
  getDashboardRoute,
};
