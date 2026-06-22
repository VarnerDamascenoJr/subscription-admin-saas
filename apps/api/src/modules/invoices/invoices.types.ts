import type { InvoiceStatus } from "../../lib/domain/invoice-status.js";

export type { InvoiceStatus } from "../../lib/domain/invoice-status.js";

export interface Invoice {
  id: string;
  customerId: string;
  subscriptionId?: string;
  status: InvoiceStatus;
  amountInCents: number;
  currency: string;
  dueAt: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
