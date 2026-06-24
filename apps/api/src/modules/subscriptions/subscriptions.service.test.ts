import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";

const { subscriptionsRepositoryMock } = vi.hoisted(() => ({
  subscriptionsRepositoryMock: {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    changePlan: vi.fn(),
    cancel: vi.fn(),
  },
}));

vi.mock("./subscriptions.repository.js", () => ({
  subscriptionsRepository: subscriptionsRepositoryMock,
}));

import { subscriptionsService } from "./subscriptions.service.js";

describe("subscriptionsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("normalizes page before calling the repository", async () => {
    subscriptionsRepositoryMock.list.mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    const result = await subscriptionsService.listSubscriptions({
      organizationId: "org-1",
      page: 0,
      pageSize: 25,
    });

    expect(subscriptionsRepositoryMock.list).toHaveBeenCalledWith({
      organizationId: "org-1",
      page: 1,
      pageSize: 25,
    });
    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
    });
  });

  it("rejects invalid pageSize values before repository access", async () => {
    await expect(
      subscriptionsService.listSubscriptions({
        organizationId: "org-1",
        page: 1,
        pageSize: 999,
      }),
    ).rejects.toThrow("Invalid pageSize. Allowed values are: 10, 25, 50, 100.");

    expect(subscriptionsRepositoryMock.list).not.toHaveBeenCalled();
  });

  it("maps changed plan responses", async () => {
    subscriptionsRepositoryMock.changePlan.mockResolvedValueOnce({
      id: "subscription-1",
      customerId: "customer-1",
      customer: {
        id: "customer-1",
        name: "Northwind Logistics",
      },
      planId: "plan-2",
      plan: {
        id: "plan-2",
        name: "Growth",
        code: "growth",
        billingInterval: "MONTHLY",
        priceInCents: 9900,
        currency: "USD",
      },
      status: "ACTIVE",
      startsAt: new Date("2026-06-01T00:00:00.000Z"),
      renewsAt: new Date("2026-07-01T00:00:00.000Z"),
      canceledAt: null,
      createdAt: new Date("2026-06-01T00:00:00.000Z"),
      updatedAt: new Date("2026-06-22T00:00:00.000Z"),
    });

    const result = await subscriptionsService.changeSubscriptionPlan(
      "org-1",
      "subscription-1",
      {
        planId: "plan-2",
      },
    );

    expect(subscriptionsRepositoryMock.changePlan).toHaveBeenCalledWith(
      "org-1",
      "subscription-1",
      {
        planId: "plan-2",
      },
    );
    expect(result).toEqual({
      id: "subscription-1",
      customerId: "customer-1",
      customer: {
        id: "customer-1",
        name: "Northwind Logistics",
      },
      planId: "plan-2",
      plan: {
        id: "plan-2",
        name: "Growth",
        code: "growth",
        billingInterval: "monthly",
        priceInCents: 9900,
        currency: "USD",
      },
      status: "active",
      startsAt: "2026-06-01T00:00:00.000Z",
      renewsAt: "2026-07-01T00:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-22T00:00:00.000Z",
    });
  });

  it("defaults canceledAt when canceling a subscription", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-22T10:00:00.000Z"));

    subscriptionsRepositoryMock.cancel.mockResolvedValueOnce(null);

    await subscriptionsService.cancelSubscription("org-1", "subscription-1");

    expect(subscriptionsRepositoryMock.cancel).toHaveBeenCalledWith(
      "org-1",
      "subscription-1",
      "2026-06-22T10:00:00.000Z",
    );
  });
});
