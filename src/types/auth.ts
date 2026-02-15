export type Role = "laborer" | "foreman" | "owner";

export interface User {
  id: string;
  name: string;
  phone?: string;
  role: Role;
  siteId?: string; // optional, if assigned to a site
  email?: string;
}
