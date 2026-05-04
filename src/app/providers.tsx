import { createContext, useContext, useState } from "react";
import type { WorkerPaymentData } from "../types/SharedTypes";

import type { ReactNode } from "react";

// Define types for your user object
export type Role = "LABORER" | "FOREMAN" | "OWNER";

interface ForemanSite {
  id?: string;
}

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
  foremanSites?: ForemanSite[];
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
  selectedWorkerPaymentData: WorkerPaymentData | null;
  setSelectedWorkerPaymentData: React.Dispatch<
    React.SetStateAction<WorkerPaymentData | null>
  >;
  siteId: string | null;
  setSiteId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedWorkerId: string | null;
  setSelectedWorkerId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const Providers = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [selectedWorkerPaymentData, setSelectedWorkerPaymentData] =
    useState<WorkerPaymentData | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

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
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        selectedWorkerPaymentData,
        setSelectedWorkerPaymentData,
        siteId,
        setSiteId,
        selectedWorkerId,
        setSelectedWorkerId,
      }}
    >
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
