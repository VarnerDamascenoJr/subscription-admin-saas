import { normalizePage, normalizePageSize } from "../../lib/utils/pagination.js";
import { mapSubscriptionToApi } from "./subscriptions.mapper.js";
import { subscriptionsRepository } from "./subscriptions.repository.js";
import type {
  CancelSubscriptionInput,
  ChangeSubscriptionPlanInput,
  CreateSubscriptionInput,
  SubscriptionsListFilters,
  SubscriptionsListResult,
} from "./subscriptions.types.js";

export const subscriptionsService = {
  async listSubscriptions(filters: SubscriptionsListFilters): Promise<SubscriptionsListResult> {
    const normalizedFilters = {
      ...filters,
      page: normalizePage(filters.page),
      pageSize: normalizePageSize(filters.pageSize),
    };

    const { items, total } = await subscriptionsRepository.list(normalizedFilters);

    return {
      items: items.map(mapSubscriptionToApi),
      total,
      page: normalizedFilters.page,
      pageSize: normalizedFilters.pageSize,
    };
  },

  async getSubscriptionById(organizationId: string, subscriptionId: string) {
    const subscription = await subscriptionsRepository.findById(organizationId, subscriptionId);

    return subscription ? mapSubscriptionToApi(subscription) : null;
  },

  async createSubscription(organizationId: string, input: CreateSubscriptionInput) {
    const subscription = await subscriptionsRepository.create(organizationId, input);

    return mapSubscriptionToApi(subscription);
  },

  async changeSubscriptionPlan(
    organizationId: string,
    subscriptionId: string,
    input: ChangeSubscriptionPlanInput,
  ) {
    const subscription = await subscriptionsRepository.changePlan(
      organizationId,
      subscriptionId,
      input,
    );

    return subscription ? mapSubscriptionToApi(subscription) : null;
  },

  async cancelSubscription(
    organizationId: string,
    subscriptionId: string,
    input: CancelSubscriptionInput = {},
  ) {
    const canceledAt = input.canceledAt ?? new Date().toISOString();
    const subscription = await subscriptionsRepository.cancel(
      organizationId,
      subscriptionId,
      canceledAt,
    );

    return subscription ? mapSubscriptionToApi(subscription) : null;
  },
};
