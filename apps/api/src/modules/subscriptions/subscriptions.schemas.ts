import { z } from "zod";
import { SUBSCRIPTION_STATUSES } from "../../lib/domain/subscription-status.js";
import { ALLOWED_PAGE_SIZES } from "../../lib/utils/pagination.js";

export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);

export const subscriptionIdParamsSchema = z.object({
  subscriptionId: z.string().uuid(),
});

export const listSubscriptionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .refine((value) => ALLOWED_PAGE_SIZES.includes(value as (typeof ALLOWED_PAGE_SIZES)[number]), {
      message: `Invalid pageSize. Allowed values are: ${ALLOWED_PAGE_SIZES.join(", ")}.`,
    })
    .default(25),
  search: z.string().trim().min(1).optional(),
  status: subscriptionStatusSchema.optional(),
  customerId: z.string().uuid().optional(),
  planId: z.string().uuid().optional(),
});

export const createSubscriptionBodySchema = z
  .object({
    customerId: z.string().uuid(),
    planId: z.string().uuid(),
    startsAt: z.string().datetime(),
    renewsAt: z.string().datetime().optional(),
  })
  .refine(
    (value) =>
      value.renewsAt === undefined || new Date(value.renewsAt) >= new Date(value.startsAt),
    {
      message: "renewsAt must be greater than or equal to startsAt.",
      path: ["renewsAt"],
    },
  );

export const changeSubscriptionPlanBodySchema = z.object({
  planId: z.string().uuid(),
});

export const cancelSubscriptionBodySchema = z.object({
  canceledAt: z.string().datetime().optional(),
});
