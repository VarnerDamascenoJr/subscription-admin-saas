import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(),
    customer: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: prismaMock,
}));

import { customersRepository } from "./customers.repository.js";

describe("customersRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes page to avoid negative skip values", async () => {
    prismaMock.customer.findMany.mockReturnValueOnce("findMany-call");
    prismaMock.customer.count.mockReturnValueOnce("count-call");
    prismaMock.$transaction.mockResolvedValueOnce([[], 0]);

    await customersRepository.list({
      organizationId: "org-1",
      page: 0,
      pageSize: 10,
    });

    expect(prismaMock.customer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
      }),
    );
  });

  it("rejects invalid pageSize values even outside HTTP validation", async () => {
    await expect(
      customersRepository.list({
        organizationId: "org-1",
        page: 1,
        pageSize: 999,
      }),
    ).rejects.toThrow("Invalid pageSize. Allowed values are: 10, 25, 50, 100.");
  });

  it("filters the lookup by organization and customer id", async () => {
    prismaMock.customer.findFirst.mockResolvedValueOnce(null);

    await customersRepository.findById("org-1", "customer-1");

    expect(prismaMock.customer.findFirst).toHaveBeenCalledWith({
      where: {
        id: "customer-1",
        organizationId: "org-1",
      },
    });
  });

  it("rejects customer creation when ownerUserId belongs to another organization", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    await expect(
      customersRepository.create("org-1", {
        name: "Northwind Logistics",
        email: "ops@northwind-logistics.com",
        ownerUserId: "user-2",
      }),
    ).rejects.toThrow("Customer owner must belong to the same organization.");

    expect(prismaMock.customer.create).not.toHaveBeenCalled();
  });

  it("rejects customer update when ownerUserId belongs to another organization", async () => {
    prismaMock.customer.findFirst.mockResolvedValueOnce({ id: "customer-1" });
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    await expect(
      customersRepository.update("org-1", "customer-1", {
        ownerUserId: "user-2",
      }),
    ).rejects.toThrow("Customer owner must belong to the same organization.");

    expect(prismaMock.customer.update).not.toHaveBeenCalled();
  });
});
