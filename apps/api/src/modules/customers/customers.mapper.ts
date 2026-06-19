import type { Customer as PrismaCustomer, CustomerStatus as PrismaCustomerStatus } from "@prisma/client";
import type { Customer, CustomerStatus } from "./customers.types.js";

const prismaToApiCustomerStatusMap: Record<PrismaCustomerStatus, CustomerStatus> = {
  LEAD: "lead",
  ACTIVE: "active",
  PAST_DUE: "past_due",
  CHURNED: "churned",
  ARCHIVED: "archived",
};

const apiToPrismaCustomerStatusMap: Record<CustomerStatus, PrismaCustomerStatus> = {
  lead: "LEAD",
  active: "ACTIVE",
  past_due: "PAST_DUE",
  churned: "CHURNED",
  archived: "ARCHIVED",
};

export function mapCustomerStatusToApi(status: PrismaCustomerStatus): CustomerStatus {
  return prismaToApiCustomerStatusMap[status];
}

export function mapCustomerStatusToPrisma(status: CustomerStatus): PrismaCustomerStatus {
  return apiToPrismaCustomerStatusMap[status];
}

export function mapCustomerToApi(customer: PrismaCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    ...(customer.legalName ? { legalName: customer.legalName } : {}),
    email: customer.email,
    ...(customer.phone ? { phone: customer.phone } : {}),
    status: mapCustomerStatusToApi(customer.status),
    ...(customer.ownerUserId ? { ownerUserId: customer.ownerUserId } : {}),
    ...(customer.notes ? { notes: customer.notes } : {}),
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}
