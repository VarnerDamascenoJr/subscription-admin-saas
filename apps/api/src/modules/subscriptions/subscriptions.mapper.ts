import type { Prisma } from "@prisma/client";
import { mapBillingIntervalToDomain } from "../../lib/domain/plan.js";
import {
  mapSubscriptionStatusToDomain,
  mapSubscriptionStatusToPrisma,
} from "../../lib/domain/subscription-status.js";
import type { Subscription } from "./subscriptions.types.js";

export { mapSubscriptionStatusToPrisma } from "../../lib/domain/subscription-status.js";

export const subscriptionDetailsInclude = {
  customer: {
    select: {
      id: true,
      name: true,
    },
  },
  plan: {
    select: {
      id: true,
      name: true,
      code: true,
      billingInterval: true,
      priceInCents: true,
      currency: true,
    },
  },
} satisfies Prisma.SubscriptionInclude;

export type PrismaSubscriptionRecord = Prisma.SubscriptionGetPayload<{
  include: typeof subscriptionDetailsInclude;
}>;

export function mapSubscriptionToApi(subscription: PrismaSubscriptionRecord): Subscription {
  return {
    id: subscription.id,
    customerId: subscription.customerId,
    customer: {
      id: subscription.customer.id,
      name: subscription.customer.name,
    },
    planId: subscription.planId,
    plan: {
      id: subscription.plan.id,
      name: subscription.plan.name,
      code: subscription.plan.code,
      billingInterval: mapBillingIntervalToDomain(subscription.plan.billingInterval),
      priceInCents: subscription.plan.priceInCents,
      currency: subscription.plan.currency,
    },
    status: mapSubscriptionStatusToDomain(subscription.status),
    startsAt: subscription.startsAt.toISOString(),
    ...(subscription.renewsAt ? { renewsAt: subscription.renewsAt.toISOString() } : {}),
    ...(subscription.canceledAt ? { canceledAt: subscription.canceledAt.toISOString() } : {}),
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
  };
}
