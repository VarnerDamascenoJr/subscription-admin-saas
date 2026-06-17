export type CustomerStatus = "lead" | "active" | "past_due" | "churned" | "archived";

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
