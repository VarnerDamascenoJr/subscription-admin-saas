import type { BillingInterval, PlanStatus } from "../../lib/domain/plan.js";

export type { BillingInterval, PlanStatus } from "../../lib/domain/plan.js";

export interface Plan {
  id: string;
  name: string;
  code: string;
  description?: string;
  priceInCents: number;
  currency: string;
  billingInterval: BillingInterval;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanInput {
  name: string;
  code: string;
  description?: string;
  priceInCents: number;
  currency: string;
  billingInterval: BillingInterval;
}
