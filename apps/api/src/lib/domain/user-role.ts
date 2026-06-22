export const USER_ROLE = {
  ADMIN: "admin",
  MANAGER: "manager",
  SUPPORT: "support",
  VIEWER: "viewer",
} as const;

export const USER_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.MANAGER,
  USER_ROLE.SUPPORT,
  USER_ROLE.VIEWER,
] as const;

export type UserRole = (typeof USER_ROLES)[number];
