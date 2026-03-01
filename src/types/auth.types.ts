export type UserRole = "LABORER" | "FOREMAN" | "OWNER";

export interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginErrors {
  username?: string;
  password?: string;
  role?: string;
  submit?: string;
}

export interface RoleOption {
  value: UserRole;
  label: string;
  icon: string;
  description: string;
}

export interface User {
  name: string;
  role: UserRole;
}
