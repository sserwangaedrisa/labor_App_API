import React, { createContext, useContext, useState } from "react";
import type { WorkerPaymentData } from "../types/SharedTypes";

import type { ReactNode } from "react";
import { number } from "framer-motion";

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
  imageUrl?: string;
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
  siteOrCampanyOverview: {
    TotolPayments: { count: number; amount: number };
    PendingPayments: { count: number; amount: number };
    ApprovedPayments: { count: number; amount: number };
    RejectedPayments: { count: number; amount: number };
    PaidPayments: { count: number; amount: number };
    ReviewPayments: { count: number; amount: number };
    TotalNumberOfSites: number;
    TotalWorkers: number;
    TotalHours: number;
  };
  setSiteOrCampanyOverview: React.Dispatch<
    React.SetStateAction<{
      TotolPayments: { count: number; amount: number };
      PendingPayments: { count: number; amount: number };
      ApprovedPayments: { count: number; amount: number };
      RejectedPayments: { count: number; amount: number };
      PaidPayments: { count: number; amount: number };
      ReviewPayments: { count: number; amount: number };
      TotalNumberOfSites: number;
      TotalWorkers: number;
      TotalHours: number;
    }>
  >;
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
  const [siteOrCampanyOverview, setSiteOrCampanyOverview] = useState<{
    TotolPayments: { count: number; amount: number };
    PendingPayments: { count: number; amount: number };
    ApprovedPayments: { count: number; amount: number };
    RejectedPayments: { count: number; amount: number };
    PaidPayments: { count: number; amount: number };
    ReviewPayments: { count: number; amount: number };
    TotalNumberOfSites: number;
    TotalWorkers: number;
    TotalHours: number;
  }>({
    TotolPayments: { count: 0, amount: 0 },
    PendingPayments: { count: 0, amount: 0 },
    ApprovedPayments: { count: 0, amount: 0 },
    RejectedPayments: { count: 0, amount: 0 },
    PaidPayments: { count: 0, amount: 0 },
    ReviewPayments: { count: 0, amount: 0 },
    TotalNumberOfSites: 0,
    TotalWorkers: 0,
    TotalHours: 0,
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
    setSiteOrCampanyOverview({
      TotolPayments: { count: 0, amount: 0 },
      PendingPayments: { count: 0, amount: 0 },
      ApprovedPayments: { count: 0, amount: 0 },
      RejectedPayments: { count: 0, amount: 0 },
      PaidPayments: { count: 0, amount: 0 },
      ReviewPayments: { count: 0, amount: 0 },
      TotalNumberOfSites: 0,
      TotalWorkers: 0,
      TotalHours: 0,
    });
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
        setSiteOrCampanyOverview,
        siteOrCampanyOverview,
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
