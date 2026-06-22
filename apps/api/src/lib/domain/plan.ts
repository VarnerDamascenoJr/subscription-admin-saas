export const BILLING_INTERVAL = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export const BILLING_INTERVALS = [BILLING_INTERVAL.MONTHLY, BILLING_INTERVAL.YEARLY] as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const PLAN_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export const PLAN_STATUSES = [PLAN_STATUS.DRAFT, PLAN_STATUS.ACTIVE, PLAN_STATUS.ARCHIVED] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];
