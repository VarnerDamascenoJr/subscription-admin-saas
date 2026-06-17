export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "canceled";

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
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
}

export interface ChangeSubscriptionPlanInput {
  subscriptionId: string;
  nextPlanId: string;
  effectiveAt: string;
}
