import type { CustomerStatus } from "../../lib/domain/customer-status.js";

export type { CustomerStatus } from "../../lib/domain/customer-status.js";

export interface CustomersListFilters {
  organizationId: string;
  page: number;
  pageSize: number;
  search?: string;
  status?: CustomerStatus;
}

export interface Customer {
  id: string;
  name: string;
  legalName?: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
  ownerUserId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  name: string;
  legalName?: string;
  email: string;
  phone?: string;
  ownerUserId?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  legalName?: string;
  email?: string;
  phone?: string;
  status?: CustomerStatus;
  ownerUserId?: string;
  notes?: string;
}

export interface CustomersListResult {
  items: Customer[];
  total: number;
  page: number;
  pageSize: number;
}
