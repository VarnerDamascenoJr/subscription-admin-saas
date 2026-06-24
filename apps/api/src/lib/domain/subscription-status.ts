import type { SubscriptionStatus as PrismaSubscriptionStatus } from "@prisma/client";

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CANCELED: "canceled",
} as const;

export const SUBSCRIPTION_STATUSES = [
  SUBSCRIPTION_STATUS.ACTIVE,
  SUBSCRIPTION_STATUS.PAST_DUE,
  SUBSCRIPTION_STATUS.CANCELED,
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Active",
  past_due: "Past due",
  canceled: "Canceled",
};

const prismaToDomainSubscriptionStatusMap: Record<PrismaSubscriptionStatus, SubscriptionStatus> = {
  ACTIVE: SUBSCRIPTION_STATUS.ACTIVE,
  PAST_DUE: SUBSCRIPTION_STATUS.PAST_DUE,
  CANCELED: SUBSCRIPTION_STATUS.CANCELED,
};

const domainToPrismaSubscriptionStatusMap: Record<SubscriptionStatus, PrismaSubscriptionStatus> = {
  [SUBSCRIPTION_STATUS.ACTIVE]: "ACTIVE",
  [SUBSCRIPTION_STATUS.PAST_DUE]: "PAST_DUE",
  [SUBSCRIPTION_STATUS.CANCELED]: "CANCELED",
};

export function mapSubscriptionStatusToDomain(
  value: PrismaSubscriptionStatus,
): SubscriptionStatus {
  return prismaToDomainSubscriptionStatusMap[value];
}

export function mapSubscriptionStatusToPrisma(
  value: SubscriptionStatus,
): PrismaSubscriptionStatus {
  return domainToPrismaSubscriptionStatusMap[value];
}
