export const INVOICE_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  PAID: "paid",
  OVERDUE: "overdue",
  VOID: "void",
} as const;

export const INVOICE_STATUSES = [
  INVOICE_STATUS.DRAFT,
  INVOICE_STATUS.OPEN,
  INVOICE_STATUS.PAID,
  INVOICE_STATUS.OVERDUE,
  INVOICE_STATUS.VOID,
] as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
