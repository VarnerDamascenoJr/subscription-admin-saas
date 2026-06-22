import type { UserRole } from "../../lib/domain/user-role.js";

export type { UserRole } from "../../lib/domain/user-role.js";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
