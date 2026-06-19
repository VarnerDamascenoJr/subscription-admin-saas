import { beforeEach, describe, expect, it, vi } from "vitest";

const { customersRepositoryMock } = vi.hoisted(() => ({
  customersRepositoryMock: {
    list: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("./customers.repository.js", () => ({
  customersRepository: customersRepositoryMock,
}));

import { customersService } from "./customers.service.js";

describe("customersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes page before calling the repository", async () => {
    customersRepositoryMock.list.mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    const result = await customersService.listCustomers({
      organizationId: "org-1",
      page: 0,
      pageSize: 25,
    });

    expect(customersRepositoryMock.list).toHaveBeenCalledWith({
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
      customersService.listCustomers({
        organizationId: "org-1",
        page: 1,
        pageSize: 999,
      }),
    ).rejects.toThrow("Invalid pageSize. Allowed values are: 10, 25, 50, 100.");

    expect(customersRepositoryMock.list).not.toHaveBeenCalled();
  });

  it("maps archived customer responses when archive is requested", async () => {
    customersRepositoryMock.update.mockResolvedValueOnce({
      id: "customer-1",
      name: "Northwind Logistics",
      legalName: null,
      email: "ops@northwind-logistics.com",
      phone: null,
      status: "ARCHIVED",
      ownerUserId: null,
      notes: null,
      createdAt: new Date("2026-06-01T00:00:00.000Z"),
      updatedAt: new Date("2026-06-02T00:00:00.000Z"),
    });

    const result = await customersService.archiveCustomer("org-1", "customer-1");

    expect(customersRepositoryMock.update).toHaveBeenCalledWith("org-1", "customer-1", {
      status: "archived",
    });
    expect(result).toEqual({
      id: "customer-1",
      name: "Northwind Logistics",
      email: "ops@northwind-logistics.com",
      status: "archived",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z",
    });
  });
});
