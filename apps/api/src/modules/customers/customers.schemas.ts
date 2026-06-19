import { z } from "zod";
import { ALLOWED_PAGE_SIZES } from "../../lib/utils/pagination.js";

export const customerStatusSchema = z.enum([
  "lead",
  "active",
  "past_due",
  "churned",
  "archived",
]);

export const customerIdParamsSchema = z.object({
  customerId: z.string().uuid(),
});

export const listCustomersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((value) => ALLOWED_PAGE_SIZES.includes(value as (typeof ALLOWED_PAGE_SIZES)[number]), {
      message: `Invalid pageSize. Allowed values are: ${ALLOWED_PAGE_SIZES.join(', ')}.`,
    })
    .default(25),
  search: z.string().trim().min(1).optional(),
  status: customerStatusSchema.optional(),
});

export const createCustomerBodySchema = z.object({
  name: z.string().trim().min(1).max(255),
  legalName: z.string().trim().min(1).max(255).optional(),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1).max(50).optional(),
  ownerUserId: z.string().uuid().optional(),
});

export const updateCustomerBodySchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    legalName: z.string().trim().min(1).max(255).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().min(1).max(50).optional(),
    status: customerStatusSchema.optional(),
    ownerUserId: z.string().uuid().optional(),
    notes: z.string().trim().min(1).max(2000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });
