// src/types.ts
export type UserRole = 'laborer' | 'owner' | 'foreman'

export interface Payment {
  id: string; // must be string
  workerId: string;
  workerName: string;
  siteName: string;
  period: string;
  amount: number;
  
  status: 'Pending' | 'Unpaid' | 'Paid';
}

export type Site = {
  id: string;
  name: string;
  location: string;
  activeWorkers: number;
  dailyCost: number;
  pendingPayments: number;
  status: 'Active' | 'Inactive';
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
  site: string;
}
