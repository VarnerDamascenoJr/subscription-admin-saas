import type {
  BillingInterval as PrismaBillingInterval,
  PlanStatus as PrismaPlanStatus,
} from "@prisma/client";

export const BILLING_INTERVAL = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export const BILLING_INTERVALS = [BILLING_INTERVAL.MONTHLY, BILLING_INTERVAL.YEARLY] as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[number];

const prismaToDomainBillingIntervalMap: Record<PrismaBillingInterval, BillingInterval> = {
  MONTHLY: BILLING_INTERVAL.MONTHLY,
  YEARLY: BILLING_INTERVAL.YEARLY,
};

const domainToPrismaBillingIntervalMap: Record<BillingInterval, PrismaBillingInterval> = {
  [BILLING_INTERVAL.MONTHLY]: "MONTHLY",
  [BILLING_INTERVAL.YEARLY]: "YEARLY",
};

export function mapBillingIntervalToDomain(value: PrismaBillingInterval): BillingInterval {
  return prismaToDomainBillingIntervalMap[value];
}

export function mapBillingIntervalToPrisma(value: BillingInterval): PrismaBillingInterval {
  return domainToPrismaBillingIntervalMap[value];
}

export const PLAN_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export const PLAN_STATUSES = [PLAN_STATUS.DRAFT, PLAN_STATUS.ACTIVE, PLAN_STATUS.ARCHIVED] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];

const prismaToDomainPlanStatusMap: Record<PrismaPlanStatus, PlanStatus> = {
  DRAFT: PLAN_STATUS.DRAFT,
  ACTIVE: PLAN_STATUS.ACTIVE,
  ARCHIVED: PLAN_STATUS.ARCHIVED,
};

const domainToPrismaPlanStatusMap: Record<PlanStatus, PrismaPlanStatus> = {
  [PLAN_STATUS.DRAFT]: "DRAFT",
  [PLAN_STATUS.ACTIVE]: "ACTIVE",
  [PLAN_STATUS.ARCHIVED]: "ARCHIVED",
};

export function mapPlanStatusToDomain(value: PrismaPlanStatus): PlanStatus {
  return prismaToDomainPlanStatusMap[value];
}

export function mapPlanStatusToPrisma(value: PlanStatus): PrismaPlanStatus {
  return domainToPrismaPlanStatusMap[value];
}
