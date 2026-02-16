import type { User, UserRole } from "../types/auth.types";

const STORAGE_KEY = "user";

export const mockCredentials: {
  username: string;
  password: string;
  role: UserRole;
}[] = [
  { username: "labor1", password: "123456", role: "laborer" },
  { username: "foreman1", password: "123456", role: "foreman" },
  { username: "owner1", password: "123456", role: "owner" },
];

export const authenticateUser = (
  username: string,
  password: string,
  role: UserRole
): User | null => {
  const user = mockCredentials.find(
    (cred) =>
      cred.username === username &&
      cred.password === password &&
      cred.role === role
  );

  if (!user) return null;

  // remove password before returning
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEY);
  return userStr ? (JSON.parse(userStr) as User) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getDashboardRoute = (role: UserRole): string => {
  const routes: Record<UserRole, string> = {
    laborer: "/laborer-dashboard",
    foreman: "/foreman-dashboard",
    owner: "/owner-dashboard",
  };

  return routes[role] ?? "/login";
};

export default {
  mockCredentials,
  authenticateUser,
  saveUser,
  getUser,
  removeUser,
  getDashboardRoute,
};
