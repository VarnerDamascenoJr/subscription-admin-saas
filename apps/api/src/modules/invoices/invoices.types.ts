export type InvoiceStatus = "draft" | "open" | "paid" | "overdue" | "void";

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
