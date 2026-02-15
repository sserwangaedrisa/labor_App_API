export type UserRole = 'laborer' | 'foreman' | 'owner';

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
  username: string;
  role: UserRole;
}
