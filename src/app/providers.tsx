import {  createContext, useContext, useState } from "react";

import type { ReactNode } from "react";

// Define types for your user object
export type Role = "laborer" | "foreman" | "owner";

export interface User {
  id: string;
  name: string;
  phone?: string;
  role: Role;
  siteId?: string;
  assignedSite?: string;
  isBlocked?: boolean // optional: if user is assigned to a site
  email?: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const Providers = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => {
    setUser(u);
    // Save to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!user;

  // Load user from localStorage on mount
  // Optional: can wrap in useEffect for actual persistence
  if (!user) {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside Providers");
  return context;
};
