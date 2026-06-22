import type { CustomerStatus as PrismaCustomerStatus } from "@prisma/client";

export const CUSTOMER_STATUS = {
  LEAD: "lead",
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CHURNED: "churned",
  ARCHIVED: "archived",
} as const;

export const CUSTOMER_STATUSES = [
  CUSTOMER_STATUS.LEAD,
  CUSTOMER_STATUS.ACTIVE,
  CUSTOMER_STATUS.PAST_DUE,
  CUSTOMER_STATUS.CHURNED,
  CUSTOMER_STATUS.ARCHIVED,
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  lead: "Lead",
  active: "Active",
  past_due: "Past due",
  churned: "Churned",
  archived: "Archived",
};

const prismaToDomainCustomerStatusMap: Record<PrismaCustomerStatus, CustomerStatus> = {
  LEAD: CUSTOMER_STATUS.LEAD,
  ACTIVE: CUSTOMER_STATUS.ACTIVE,
  PAST_DUE: CUSTOMER_STATUS.PAST_DUE,
  CHURNED: CUSTOMER_STATUS.CHURNED,
  ARCHIVED: CUSTOMER_STATUS.ARCHIVED,
};

const domainToPrismaCustomerStatusMap: Record<CustomerStatus, PrismaCustomerStatus> = {
  [CUSTOMER_STATUS.LEAD]: "LEAD",
  [CUSTOMER_STATUS.ACTIVE]: "ACTIVE",
  [CUSTOMER_STATUS.PAST_DUE]: "PAST_DUE",
  [CUSTOMER_STATUS.CHURNED]: "CHURNED",
  [CUSTOMER_STATUS.ARCHIVED]: "ARCHIVED",
};

export function mapCustomerStatusToDomain(status: PrismaCustomerStatus): CustomerStatus {
  return prismaToDomainCustomerStatusMap[status];
}

export function mapCustomerStatusToPrisma(status: CustomerStatus): PrismaCustomerStatus {
  return domainToPrismaCustomerStatusMap[status];
}
