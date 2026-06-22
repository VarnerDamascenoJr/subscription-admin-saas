import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { customersServiceMock } = vi.hoisted(() => ({
  customersServiceMock: {
    listCustomers: vi.fn(),
    getCustomerById: vi.fn(),
    createCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    archiveCustomer: vi.fn(),
  },
}));

vi.mock("../modules/customers/customers.service.js", () => ({
  customersService: customersServiceMock,
}));

import { createApp } from "../app.js";

const organizationId = "11111111-1111-1111-1111-111111111111";
const customerId = "33333333-3333-3333-3333-333333333333";

describe("customer routes", () => {
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
      url: "/customers",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      message:
        "Organization is not configured for this request. Provide a valid x-organization-id header.",
    });
    expect(customersServiceMock.listCustomers).not.toHaveBeenCalled();
  });

  it("lists customers with validated query params", async () => {
    customersServiceMock.listCustomers.mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
    });

    const response = await app.inject({
      method: "GET",
      url: "/customers?page=1&pageSize=25&status=active&search=northwind",
      headers: {
        "x-organization-id": organizationId,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(customersServiceMock.listCustomers).toHaveBeenCalledWith({
      organizationId,
      page: 1,
      pageSize: 25,
      status: "active",
      search: "northwind",
    });
  });

  it("rejects invalid pageSize values", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/customers?page=1&pageSize=15",
      headers: {
        "x-organization-id": organizationId,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      message: "Invalid customers query parameters.",
    });
    expect(customersServiceMock.listCustomers).not.toHaveBeenCalled();
  });

  it("creates a customer with validated payload", async () => {
    customersServiceMock.createCustomer.mockResolvedValueOnce({
      id: customerId,
      name: "Northwind Logistics",
      email: "ops@northwind-logistics.com",
      status: "lead",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    });

    const response = await app.inject({
      method: "POST",
      url: "/customers",
      headers: {
        "x-organization-id": organizationId,
      },
      payload: {
        name: "Northwind Logistics",
        email: "ops@northwind-logistics.com",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(customersServiceMock.createCustomer).toHaveBeenCalledWith(organizationId, {
      name: "Northwind Logistics",
      email: "ops@northwind-logistics.com",
    });
  });

  it("returns 404 when updating a missing customer", async () => {
    customersServiceMock.updateCustomer.mockResolvedValueOnce(null);

    const response = await app.inject({
      method: "PATCH",
      url: `/customers/${customerId}`,
      headers: {
        "x-organization-id": organizationId,
      },
      payload: {
        notes: "Updated note",
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Customer not found.",
    });
  });

  it("archives a customer", async () => {
    customersServiceMock.archiveCustomer.mockResolvedValueOnce({
      id: customerId,
      name: "Northwind Logistics",
      email: "ops@northwind-logistics.com",
      status: "archived",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z",
    });

    const response = await app.inject({
      method: "POST",
      url: `/customers/${customerId}/archive`,
      headers: {
        "x-organization-id": organizationId,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(customersServiceMock.archiveCustomer).toHaveBeenCalledWith(
      organizationId,
      customerId,
    );
  });
});
