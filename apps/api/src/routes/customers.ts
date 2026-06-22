import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import {
  createCustomerBodySchema,
  customerIdParamsSchema,
  listCustomersQuerySchema,
  updateCustomerBodySchema,
} from "../modules/customers/customers.schemas.js";
import { customersService } from "../modules/customers/customers.service.js";

const organizationHeadersSchema = z.object({
  "x-organization-id": z.string().uuid(),
});

function omitUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  );
}

function getOrganizationId(request: FastifyRequest, reply: FastifyReply) {
  const parsedHeaders = organizationHeadersSchema.safeParse(request.headers);

  if (!parsedHeaders.success) {
    reply.status(400).send({
      message:
        "Organization is not configured for this request. Provide a valid x-organization-id header.",
      issues: parsedHeaders.error.issues,
    });
    return null;
  }

  return parsedHeaders.data["x-organization-id"];
}

export function registerCustomerRoutes(app: FastifyInstance) {
  app.get("/customers", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedQuery = listCustomersQuerySchema.safeParse(request.query);

    if (!parsedQuery.success) {
      return reply.status(400).send({
        message: "Invalid customers query parameters.",
        issues: parsedQuery.error.issues,
      });
    }

    const result = await customersService.listCustomers({
      organizationId,
      page: parsedQuery.data.page,
      pageSize: parsedQuery.data.pageSize,
      ...(parsedQuery.data.search ? { search: parsedQuery.data.search } : {}),
      ...(parsedQuery.data.status ? { status: parsedQuery.data.status } : {}),
    });

    return reply.status(200).send(result);
  });

  app.get("/customers/:customerId", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedParams = customerIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return reply.status(400).send({
        message: "Invalid customer route parameters.",
        issues: parsedParams.error.issues,
      });
    }

    const customer = await customersService.getCustomerById(
      organizationId,
      parsedParams.data.customerId,
    );

    if (!customer) {
      return reply.status(404).send({
        message: "Customer not found.",
      });
    }

    return reply.status(200).send(customer);
  });

  app.post("/customers", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedBody = createCustomerBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid customer payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const customer = await customersService.createCustomer(organizationId, {
        name: parsedBody.data.name,
        email: parsedBody.data.email,
        ...(parsedBody.data.legalName ? { legalName: parsedBody.data.legalName } : {}),
        ...(parsedBody.data.phone ? { phone: parsedBody.data.phone } : {}),
        ...(parsedBody.data.ownerUserId ? { ownerUserId: parsedBody.data.ownerUserId } : {}),
      });

      return reply.status(201).send(customer);
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Failed to create customer.",
      });
    }
  });

  app.patch("/customers/:customerId", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedParams = customerIdParamsSchema.safeParse(request.params);
    const parsedBody = updateCustomerBodySchema.safeParse(request.body);

    if (!parsedParams.success) {
      return reply.status(400).send({
        message: "Invalid customer route parameters.",
        issues: parsedParams.error.issues,
      });
    }

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid customer payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const customer = await customersService.updateCustomer(
        organizationId,
        parsedParams.data.customerId,
        omitUndefined(parsedBody.data) as import("../modules/customers/customers.types.js").UpdateCustomerInput,
      );

      if (!customer) {
        return reply.status(404).send({
          message: "Customer not found.",
        });
      }

      return reply.status(200).send(customer);
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Failed to update customer.",
      });
    }
  });

  app.post("/customers/:customerId/archive", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedParams = customerIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return reply.status(400).send({
        message: "Invalid customer route parameters.",
        issues: parsedParams.error.issues,
      });
    }

    const customer = await customersService.archiveCustomer(
      organizationId,
      parsedParams.data.customerId,
    );

    if (!customer) {
      return reply.status(404).send({
        message: "Customer not found.",
      });
    }

    return reply.status(200).send(customer);
  });
}
