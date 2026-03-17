export type Site = {
  id: string;
  name: string;
  location: string;
  activeWorkers: number;
  dailyCost: number;
  pendingPayments: number;
  status: "Active" | "Inactive";
};

export type verificationData = {
  userId: string;
  otp: string;
};

export interface NewUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  sites: string;
  image: File | null;
}

export type WorkerStatus = "present" | "absent" | "pending" | "late" | string;

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
  staus?: string;
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

interface MonthClose {
  id: string;
  siteId: string;
}

export interface SiteInfoResponse {
  status?: string;
  site?: Sited;
  message?: string;
}

export type UserRole = "OWNER" | "FOREMAN" | "WORKER" | "LABORER";

export type PaymentStatus = "PENDING" | "APPROVED" | "PAID";

export type MonthStatus = "OPEN" | "LOCKED";

export type Job =
  | "USER"
  | "HELPER"
  | "MASON"
  | "CARPENTER"
  | "STEEL_FIXER"
  | "FOREMAN"
  | "SITE_ADMIN"
  | "PAINTER"
  | "ELECTRICIAN"
  | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  phone?: string;
  role: UserRole;
  job?: string;
  wageRating: number;
  imageUrl?: string;
  status?: string;
  verificationCode?: string;
  verificationExpiry?: Date;
  sites?: string;
  activityLogs?: ActivityLog[];
  payments?: Payment[];
  foremanSites?: Site[];
  ownedSites?: Site[];
  assignedSites?: SiteWorker[];
  workerRecords?: WorkEntry[];

  // options for the first state
  assignedSite?: string;
  isBlocked: boolean;
}

export interface Sited {
  id: string;
  name: string;
  location: string;
  description?: string;
  ownerId?: string;
  foremanId?: string;
  createdAt: Date;
  updatedAt: Date;
  monthCloses?: MonthClose[];
  payments?: Payment[];
  foreman?: User;
  owner?: User;
  workers?: SiteWorker[];
  workEntries?: WorkEntry[];
}

export interface SiteWorker {
  id: string;

  siteId: string;
  workerId: string;

  assignedAt: Date;

  site?: Site;
  worker?: User;
}

export interface WorkEntry {
  id?: string;
  workerId: string;
  siteId: string;
  date: Date;
  hours?: number;
  overtime?: number;
  notes?: string;

  createdAt?: Date;

  site?: Site;
  worker?: User;
}

export interface MonthCloseDb {
  id: string;

  siteId: string;
  month: number;
  year: number;

  status: MonthStatus;

  lockedAt?: Date;
  createdAt: Date;

  site?: Site;
}

export interface Payment {
  id: string;
  workerId: string;
  siteId: string;
  month: number;
  year: number;
  totalHours: number;
  overtime: number;
  baseAmount: number;
  overtimePay: number;
  totalAmount: number;
  status: PaymentStatus;
  approvedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
  site?: Site;
  worker?: User;

  // options for the first state
  workerName?: string;
  siteName?: string;
  amount: number;
}

export interface Settings {
  id: string;

  overtimeRate: number;
  maxDailyHours: number;
  baseHourlyRate: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;

  userId: string;
  action: string;
  entity: string;
  entityId?: string;

  createdAt: Date;

  user?: User;
}

// Database responses

export interface SiteAttendanceInfoResponse {
  status?: string;
  message?: string;
  presentWorkers?: string[];
}
