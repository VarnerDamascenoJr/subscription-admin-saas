import { PLAN_STATUS } from "../../lib/domain/plan.js";
import { prisma } from "../../lib/prisma.js";
import { normalizePage, normalizePageSize } from "../../lib/utils/pagination.js";
import {
  mapSubscriptionStatusToPrisma,
  subscriptionDetailsInclude,
} from "./subscriptions.mapper.js";
import type {
  ChangeSubscriptionPlanInput,
  CreateSubscriptionInput,
  SubscriptionStatus,
  SubscriptionsListFilters,
} from "./subscriptions.types.js";

function buildStatusFilter(status?: SubscriptionStatus) {
  return status ? { status: mapSubscriptionStatusToPrisma(status) } : {};
}

function buildSearchFilter(search?: string) {
  if (!search) {
    return {};
  }

  return {
    OR: [
      {
        customer: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
      {
        plan: {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
      {
        plan: {
          code: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      },
    ],
  };
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  );
}

async function ensureCustomerBelongsToOrganization(
  organizationId: string,
  customerId: string,
) {
  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new Error("Subscription customer must belong to the same organization.");
  }
}

async function ensurePlanBelongsToOrganization(
  organizationId: string,
  planId: string,
) {
  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      organizationId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  if (!plan) {
    throw new Error("Subscription plan must be active and belong to the same organization.");
  }
}

async function ensureCustomerHasNoActiveSubscription(
  organizationId: string,
  customerId: string,
) {
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      organizationId,
      customerId,
      status: {
        not: "CANCELED",
      },
    },
    select: {
      id: true,
    },
  });

  if (existingSubscription) {
    throw new Error("Customer already has an active subscription.");
  }
}

export const subscriptionsRepository = {
  async list(filters: SubscriptionsListFilters) {
    const { organizationId, page, pageSize, search, status, customerId, planId } = filters;
    const normalizedPage = normalizePage(page);
    const normalizedPageSize = normalizePageSize(pageSize);
    const skip = (normalizedPage - 1) * normalizedPageSize;

    const where = {
      organizationId,
      ...buildStatusFilter(status),
      ...buildSearchFilter(search),
      ...stripUndefined({
        customerId,
        planId,
      }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.subscription.findMany({
        where,
        include: subscriptionDetailsInclude,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: normalizedPageSize,
      }),
      prisma.subscription.count({ where }),
    ]);

    return { items, total };
  },

  async findById(organizationId: string, subscriptionId: string) {
    return prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        organizationId,
      },
      include: subscriptionDetailsInclude,
    });
  },

  async create(organizationId: string, input: CreateSubscriptionInput) {
    await ensureCustomerBelongsToOrganization(organizationId, input.customerId);
    await ensurePlanBelongsToOrganization(organizationId, input.planId);
    await ensureCustomerHasNoActiveSubscription(organizationId, input.customerId);

    return prisma.subscription.create({
      data: {
        organizationId,
        customerId: input.customerId,
        planId: input.planId,
        status: "ACTIVE",
        startsAt: new Date(input.startsAt),
        ...stripUndefined({
          renewsAt: input.renewsAt ? new Date(input.renewsAt) : undefined,
        }),
      },
      include: subscriptionDetailsInclude,
    });
  },

  async changePlan(
    organizationId: string,
    subscriptionId: string,
    input: ChangeSubscriptionPlanInput,
  ) {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        organizationId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingSubscription) {
      return null;
    }

    if (existingSubscription.status === "CANCELED") {
      throw new Error("Canceled subscriptions cannot change plans.");
    }

    await ensurePlanBelongsToOrganization(organizationId, input.planId);

    return prisma.subscription.update({
      where: {
        id: existingSubscription.id,
      },
      data: {
        planId: input.planId,
      },
      include: subscriptionDetailsInclude,
    });
  },

  async cancel(organizationId: string, subscriptionId: string, canceledAt: string) {
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        organizationId,
      },
      include: subscriptionDetailsInclude,
    });

    if (!existingSubscription) {
      return null;
    }

    if (existingSubscription.status === "CANCELED") {
      return existingSubscription;
    }

    return prisma.subscription.update({
      where: {
        id: existingSubscription.id,
      },
      data: {
        status: "CANCELED",
        canceledAt: new Date(canceledAt),
      },
      include: subscriptionDetailsInclude,
    });
  },
};
