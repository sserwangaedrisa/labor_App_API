import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";

// Define types for your user object
export type Role = "LABORER" | "FOREMAN" | "OWNER";

export interface User {
  id: string;
  name: string;
  phone?: string;
  role: Role;
  status?: string;
  siteId?: string;
  assignedSite?: string;
  isBlocked?: boolean;
  email?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (user: User, tokens: Tokens) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const Providers = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (u: User, tokens: Tokens) => {
    setUser(u);
    // Save to localStorage for persistence
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("accessToken", JSON.stringify(tokens.accessToken));
    localStorage.setItem("refreshToken", JSON.stringify(tokens.refreshToken));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.getItem("token") ? localStorage.removeItem("token") : null;
  };

  const isAuthenticated = !!user;

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
