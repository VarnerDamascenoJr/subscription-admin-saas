import type { Customer as PrismaCustomer } from "@prisma/client";
import {
  mapCustomerStatusToDomain,
  mapCustomerStatusToPrisma,
} from "../../lib/domain/customer-status.js";
import type { Customer } from "./customers.types.js";

export { mapCustomerStatusToPrisma } from "../../lib/domain/customer-status.js";

export function mapCustomerToApi(customer: PrismaCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    ...(customer.legalName ? { legalName: customer.legalName } : {}),
    email: customer.email,
    ...(customer.phone ? { phone: customer.phone } : {}),
    status: mapCustomerStatusToDomain(customer.status),
    ...(customer.ownerUserId ? { ownerUserId: customer.ownerUserId } : {}),
    ...(customer.notes ? { notes: customer.notes } : {}),
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}
