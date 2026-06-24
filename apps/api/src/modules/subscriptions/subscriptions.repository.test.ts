import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(),
    subscription: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    customer: {
      findFirst: vi.fn(),
    },
    plan: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

import { subscriptionsRepository } from "./subscriptions.repository.js";

describe("subscriptionsRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes page to avoid negative skip values", async () => {
    prismaMock.subscription.findMany.mockReturnValueOnce("findMany-call");
    prismaMock.subscription.count.mockReturnValueOnce("count-call");
    prismaMock.$transaction.mockResolvedValueOnce([[], 0]);

    await subscriptionsRepository.list({
      organizationId: "org-1",
      page: 0,
      pageSize: 10,
    });

    expect(prismaMock.subscription.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
  });

  it("rejects invalid pageSize values even outside HTTP validation", async () => {
    await expect(
      subscriptionsRepository.list({
        organizationId: "org-1",
        page: 1,
        pageSize: 999,
      }),
    ).rejects.toThrow("Invalid pageSize. Allowed values are: 10, 25, 50, 100.");
  });

  it("rejects creation when the customer belongs to another organization", async () => {
    prismaMock.customer.findFirst.mockResolvedValueOnce(null);

    await expect(
      subscriptionsRepository.create("org-1", {
        customerId: "customer-2",
        planId: "plan-1",
        startsAt: "2026-06-22T00:00:00.000Z",
      }),
    ).rejects.toThrow("Subscription customer must belong to the same organization.");

    expect(prismaMock.subscription.create).not.toHaveBeenCalled();
  });

  it("rejects creation when the plan is not active in the same organization", async () => {
    prismaMock.customer.findFirst.mockResolvedValueOnce({ id: "customer-1" });
    prismaMock.plan.findFirst.mockResolvedValueOnce(null);

    await expect(
      subscriptionsRepository.create("org-1", {
        customerId: "customer-1",
        planId: "plan-2",
        startsAt: "2026-06-22T00:00:00.000Z",
      }),
    ).rejects.toThrow("Subscription plan must be active and belong to the same organization.");

    expect(prismaMock.subscription.create).not.toHaveBeenCalled();
  });

  it("rejects creation when the customer already has a non-canceled subscription", async () => {
    prismaMock.customer.findFirst.mockResolvedValueOnce({ id: "customer-1" });
    prismaMock.plan.findFirst.mockResolvedValueOnce({ id: "plan-1" });
    prismaMock.subscription.findFirst.mockResolvedValueOnce({ id: "subscription-1" });

    await expect(
      subscriptionsRepository.create("org-1", {
        customerId: "customer-1",
        planId: "plan-1",
        startsAt: "2026-06-22T00:00:00.000Z",
      }),
    ).rejects.toThrow("Customer already has an active subscription.");

    expect(prismaMock.subscription.create).not.toHaveBeenCalled();
  });

  it("rejects plan changes for canceled subscriptions", async () => {
    prismaMock.subscription.findFirst.mockResolvedValueOnce({
      id: "subscription-1",
      status: "CANCELED",
    });

    await expect(
      subscriptionsRepository.changePlan("org-1", "subscription-1", {
        planId: "plan-2",
      }),
    ).rejects.toThrow("Canceled subscriptions cannot change plans.");

    expect(prismaMock.subscription.update).not.toHaveBeenCalled();
  });
});
