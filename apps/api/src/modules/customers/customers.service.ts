import { normalizePage, normalizePageSize } from "../../lib/utils/pagination.js";
import { mapCustomerToApi } from "./customers.mapper.js";
import { customersRepository } from "./customers.repository.js";
import type {
  CreateCustomerInput,
  CustomersListFilters,
  CustomersListResult,
  UpdateCustomerInput,
} from "./customers.types.js";

export const customersService = {
  async listCustomers(filters: CustomersListFilters): Promise<CustomersListResult> {
    const normalizedFilters = {
      ...filters,
      page: normalizePage(filters.page),
      pageSize: normalizePageSize(filters.pageSize),
    };

    const { items, total } = await customersRepository.list(normalizedFilters);

    return {
      items: items.map(mapCustomerToApi),
      total,
      page: normalizedFilters.page,
      pageSize: normalizedFilters.pageSize,
    };
  },

  async getCustomerById(organizationId: string, customerId: string) {
    const customer = await customersRepository.findById(organizationId, customerId);

    return customer ? mapCustomerToApi(customer) : null;
  },

  async createCustomer(organizationId: string, input: CreateCustomerInput) {
    const customer = await customersRepository.create(organizationId, input);

    return mapCustomerToApi(customer);
  },

  async updateCustomer(organizationId: string, customerId: string, input: UpdateCustomerInput) {
    const customer = await customersRepository.update(organizationId, customerId, input);

    return customer ? mapCustomerToApi(customer) : null;
  },

  async archiveCustomer(organizationId: string, customerId: string) {
    const customer = await customersRepository.update(organizationId, customerId, {
      status: "archived",
    });

    return customer ? mapCustomerToApi(customer) : null;
  },
};
