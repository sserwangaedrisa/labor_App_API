// src/types.ts
export type UserRole = "laborer" | "owner" | "foreman";

export interface Payment {
  id: string; // must be string
  workerId: string;
  workerName: string;
  siteName: string;
  period: string;
  amount: number;

  status: "Pending" | "Unpaid" | "Paid";
}

export type Site = {
  id: string;
  name: string;
  location: string;
  activeWorkers: number;
  dailyCost: number;
  pendingPayments: number;
  status: "Active" | "Inactive";
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  assignedSite?: string;
  isBlocked: boolean;
}
export interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  sites?: string;
  password?: string;
  cratedAt?: string;
}

export type WorkerStatus = "present" | "absent" | "pending" | "late";

export interface Worker {
  id: string | number;
  name: string;
  avatar: string;
  avatarAlt: string;
  role: string;
  todayStatus: WorkerStatus;
  hoursToday: number;
  wageRate: number;
  lastUpdated: string;
}

export type NotificationType = "info" | "warning" | "success";

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  type: NotificationType;
}

export interface NotificationBannerProps {
  notifications?: Notification[];
  onDismiss: (id: string | number) => void;
  onViewAll: () => void;
}

export interface NotificationStyle {
  bg: string;
  border: string;
  icon: string;
  iconColor: string;
}
