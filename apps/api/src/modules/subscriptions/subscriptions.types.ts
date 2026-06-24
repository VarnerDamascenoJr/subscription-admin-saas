import type { BillingInterval } from "../../lib/domain/plan.js";
import type { SubscriptionStatus } from "../../lib/domain/subscription-status.js";

export type { BillingInterval } from "../../lib/domain/plan.js";
export type { SubscriptionStatus } from "../../lib/domain/subscription-status.js";

export interface SubscriptionsListFilters {
  organizationId: string;
  page: number;
  pageSize: number;
  search?: string;
  status?: SubscriptionStatus;
  customerId?: string;
  planId?: string;
}

export interface SubscriptionCustomerSummary {
  id: string;
  name: string;
}

export interface SubscriptionPlanSummary {
  id: string;
  name: string;
  code: string;
  billingInterval: BillingInterval;
  priceInCents: number;
  currency: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customer: SubscriptionCustomerSummary;
  planId: string;
  plan: SubscriptionPlanSummary;
  status: SubscriptionStatus;
  startsAt: string;
  renewsAt?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionInput {
  customerId: string;
  planId: string;
  startsAt: string;
  renewsAt?: string;
}

export interface ChangeSubscriptionPlanInput {
  planId: string;
}

export interface CancelSubscriptionInput {
  canceledAt?: string;
}

export interface SubscriptionsListResult {
  items: Subscription[];
  total: number;
  page: number;
  pageSize: number;
}
