import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { subscriptionsServiceMock } = vi.hoisted(() => ({
  subscriptionsServiceMock: {
    listSubscriptions: vi.fn(),
    getSubscriptionById: vi.fn(),
    createSubscription: vi.fn(),
    changeSubscriptionPlan: vi.fn(),
    cancelSubscription: vi.fn(),
  },
}));

vi.mock("../modules/subscriptions/subscriptions.service.js", () => ({
  subscriptionsService: subscriptionsServiceMock,
}));

import { createApp } from "../app.js";

const organizationId = "11111111-1111-1111-1111-111111111111";
const subscriptionId = "44444444-4444-4444-4444-444444444444";
const customerId = "33333333-3333-3333-3333-333333333333";
const planId = "55555555-5555-5555-5555-555555555555";

describe("subscription routes", () => {
  let app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await app.close();
    app = createApp();
  });

  it("rejects requests without a valid organization header", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/subscriptions",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      message:
        "Organization is not configured for this request. Provide a valid x-organization-id header.",
    });
    expect(subscriptionsServiceMock.listSubscriptions).not.toHaveBeenCalled();
  });

  it("lists subscriptions with validated query params", async () => {
    subscriptionsServiceMock.listSubscriptions.mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
    });

    const response = await app.inject({
      method: "GET",
      url: `/subscriptions?page=1&pageSize=25&status=active&search=northwind&customerId=${customerId}&planId=${planId}`,
      headers: {
        "x-organization-id": organizationId,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(subscriptionsServiceMock.listSubscriptions).toHaveBeenCalledWith({
      organizationId,
      page: 1,
      pageSize: 25,
      status: "active",
      search: "northwind",
      customerId,
      planId,
    });
  });

  it("returns 404 when the subscription is missing", async () => {
    subscriptionsServiceMock.getSubscriptionById.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: "GET",
      url: `/subscriptions/${subscriptionId}`,
      headers: {
        "x-organization-id": organizationId,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Subscription not found.",
    });
  });

  it("creates a subscription with validated payload", async () => {
    subscriptionsServiceMock.createSubscription.mockResolvedValueOnce({
      id: subscriptionId,
      customerId,
      customer: {
        id: customerId,
        name: "Northwind Logistics",
      },
      planId,
      plan: {
        id: planId,
        name: "Growth",
        code: "growth",
        billingInterval: "monthly",
        priceInCents: 9900,
        currency: "USD",
      },
      status: "active",
      startsAt: "2026-06-22T00:00:00.000Z",
      createdAt: "2026-06-22T00:00:00.000Z",
      updatedAt: "2026-06-22T00:00:00.000Z",
    });

    const response = await app.inject({
      method: "POST",
      url: "/subscriptions",
      headers: {
        "x-organization-id": organizationId,
      },
      payload: {
        customerId,
        planId,
        startsAt: "2026-06-22T00:00:00.000Z",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(subscriptionsServiceMock.createSubscription).toHaveBeenCalledWith(organizationId, {
      customerId,
      planId,
      startsAt: "2026-06-22T00:00:00.000Z",
    });
  });

  it("changes the subscription plan", async () => {
    subscriptionsServiceMock.changeSubscriptionPlan.mockResolvedValueOnce({
      id: subscriptionId,
      customerId,
      customer: {
        id: customerId,
        name: "Northwind Logistics",
      },
      planId,
      plan: {
        id: planId,
        name: "Growth",
        code: "growth",
        billingInterval: "monthly",
        priceInCents: 9900,
        currency: "USD",
      },
      status: "active",
      startsAt: "2026-06-22T00:00:00.000Z",
      createdAt: "2026-06-22T00:00:00.000Z",
      updatedAt: "2026-06-23T00:00:00.000Z",
    });

    const response = await app.inject({
      method: "POST",
      url: `/subscriptions/${subscriptionId}/change-plan`,
      headers: {
        "x-organization-id": organizationId,
      },
      payload: {
        planId,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(subscriptionsServiceMock.changeSubscriptionPlan).toHaveBeenCalledWith(
      organizationId,
      subscriptionId,
      {
        planId,
      },
    );
  });

  it("cancels a subscription with an optional empty body", async () => {
    subscriptionsServiceMock.cancelSubscription.mockResolvedValueOnce({
      id: subscriptionId,
      customerId,
      customer: {
        id: customerId,
        name: "Northwind Logistics",
      },
      planId,
      plan: {
        id: planId,
        name: "Growth",
        code: "growth",
        billingInterval: "monthly",
        priceInCents: 9900,
        currency: "USD",
      },
      status: "canceled",
      startsAt: "2026-06-22T00:00:00.000Z",
      canceledAt: "2026-06-23T00:00:00.000Z",
      createdAt: "2026-06-22T00:00:00.000Z",
      updatedAt: "2026-06-23T00:00:00.000Z",
    });

    const response = await app.inject({
      method: "POST",
      url: `/subscriptions/${subscriptionId}/cancel`,
      headers: {
        "x-organization-id": organizationId,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(subscriptionsServiceMock.cancelSubscription).toHaveBeenCalledWith(
      organizationId,
      subscriptionId,
      {},
    );
  });
});
