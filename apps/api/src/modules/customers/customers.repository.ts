import { prisma } from "../../lib/prisma.js";
import { normalizePage, normalizePageSize } from "../../lib/utils/pagination.js";
import { mapCustomerStatusToPrisma } from "./customers.mapper.js";
import type {
  CreateCustomerInput,
  CustomersListFilters,
  CustomerStatus,
  UpdateCustomerInput,
} from "./customers.types.js";

function buildStatusFilter(status?: CustomerStatus) {
  return status ? { status: mapCustomerStatusToPrisma(status) } : {};
}

function buildSearchFilter(search?: string) {
  if (!search) {
    return {};
  }

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" as const } },
      { legalName: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
    ],
  };
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  );
}

async function ensureOwnerUserBelongsToOrganization(
  organizationId: string,
  ownerUserId?: string,
) {
  if (!ownerUserId) {
    return;
  }

  const ownerUser = await prisma.user.findFirst({
    where: {
      id: ownerUserId,
      organizationId,
    },
    select: {
      id: true,
    },
  });

  if (!ownerUser) {
    throw new Error("Customer owner must belong to the same organization.");
  }
}

export const customersRepository = {
  async list(filters: CustomersListFilters) {
    const { organizationId, page, pageSize, search, status } = filters;
    const normalizedPage = normalizePage(page);
    const normalizedPageSize = normalizePageSize(pageSize);
    const skip = (normalizedPage - 1) * normalizedPageSize;

    const where = {
      organizationId,
      ...buildStatusFilter(status),
      ...buildSearchFilter(search),
    };

    const [items, total] = await prisma.$transaction([
      prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: normalizedPageSize,
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, total };
  },

  async findById(organizationId: string, customerId: string) {
    return prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId,
      },
    });
  },

  async create(organizationId: string, input: CreateCustomerInput) {
    await ensureOwnerUserBelongsToOrganization(organizationId, input.ownerUserId);

    return prisma.customer.create({
      data: {
        organizationId,
        name: input.name,
        email: input.email,
        status: "LEAD",
        ...stripUndefined({
          legalName: input.legalName,
          phone: input.phone,
          ownerUserId: input.ownerUserId,
        }),
      },
    });
  },

  async update(organizationId: string, customerId: string, input: UpdateCustomerInput) {
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId,
      },
    });

    if (!existingCustomer) {
      return null;
    }

    await ensureOwnerUserBelongsToOrganization(organizationId, input.ownerUserId);

    return prisma.customer.update({
      where: {
        id: existingCustomer.id,
      },
      data: stripUndefined({
        name: input.name,
        legalName: input.legalName,
        email: input.email,
        phone: input.phone,
        ownerUserId: input.ownerUserId,
        notes: input.notes,
        status: input.status ? mapCustomerStatusToPrisma(input.status) : undefined,
      }),
    });
  },
};
