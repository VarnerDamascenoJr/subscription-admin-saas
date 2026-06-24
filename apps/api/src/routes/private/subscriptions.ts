import type { FastifyInstance } from "fastify";
import {
  cancelSubscriptionBodySchema,
  changeSubscriptionPlanBodySchema,
  createSubscriptionBodySchema,
  listSubscriptionsQuerySchema,
  subscriptionIdParamsSchema,
} from "../../modules/subscriptions/subscriptions.schemas.js";
import { subscriptionsService } from "../../modules/subscriptions/subscriptions.service.js";
import { getOrganizationId } from "./organization.js";

export function registerSubscriptionRoutes(app: FastifyInstance) {
  app.get("/subscriptions", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedQuery = listSubscriptionsQuerySchema.safeParse(request.query);

    if (!parsedQuery.success) {
      return reply.status(400).send({
        message: "Invalid subscriptions query parameters.",
        issues: parsedQuery.error.issues,
      });
    }

    const result = await subscriptionsService.listSubscriptions({
      organizationId,
      page: parsedQuery.data.page,
      pageSize: parsedQuery.data.pageSize,
      ...(parsedQuery.data.search ? { search: parsedQuery.data.search } : {}),
      ...(parsedQuery.data.status ? { status: parsedQuery.data.status } : {}),
      ...(parsedQuery.data.customerId ? { customerId: parsedQuery.data.customerId } : {}),
      ...(parsedQuery.data.planId ? { planId: parsedQuery.data.planId } : {}),
    });

    return reply.status(200).send(result);
  });

  app.get("/subscriptions/:subscriptionId", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedParams = subscriptionIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return reply.status(400).send({
        message: "Invalid subscription route parameters.",
        issues: parsedParams.error.issues,
      });
    }

    const subscription = await subscriptionsService.getSubscriptionById(
      organizationId,
      parsedParams.data.subscriptionId,
    );

    if (!subscription) {
      return reply.status(404).send({
        message: "Subscription not found.",
      });
    }

    return reply.status(200).send(subscription);
  });

  app.post("/subscriptions", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedBody = createSubscriptionBodySchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid subscription payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const subscription = await subscriptionsService.createSubscription(organizationId, {
        customerId: parsedBody.data.customerId,
        planId: parsedBody.data.planId,
        startsAt: parsedBody.data.startsAt,
        ...(parsedBody.data.renewsAt ? { renewsAt: parsedBody.data.renewsAt } : {}),
      });

      return reply.status(201).send(subscription);
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Failed to create subscription.",
      });
    }
  });

  app.post("/subscriptions/:subscriptionId/change-plan", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedParams = subscriptionIdParamsSchema.safeParse(request.params);
    const parsedBody = changeSubscriptionPlanBodySchema.safeParse(request.body);

    if (!parsedParams.success) {
      return reply.status(400).send({
        message: "Invalid subscription route parameters.",
        issues: parsedParams.error.issues,
      });
    }

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid subscription payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const subscription = await subscriptionsService.changeSubscriptionPlan(
        organizationId,
        parsedParams.data.subscriptionId,
        {
          planId: parsedBody.data.planId,
        },
      );

      if (!subscription) {
        return reply.status(404).send({
          message: "Subscription not found.",
        });
      }

      return reply.status(200).send(subscription);
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Failed to change subscription plan.",
      });
    }
  });

  app.post("/subscriptions/:subscriptionId/cancel", async (request, reply) => {
    const organizationId = getOrganizationId(request, reply);

    if (!organizationId) {
      return reply;
    }

    const parsedParams = subscriptionIdParamsSchema.safeParse(request.params);
    const parsedBody = cancelSubscriptionBodySchema.safeParse(request.body ?? {});

    if (!parsedParams.success) {
      return reply.status(400).send({
        message: "Invalid subscription route parameters.",
        issues: parsedParams.error.issues,
      });
    }

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid subscription payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const subscription = await subscriptionsService.cancelSubscription(
        organizationId,
        parsedParams.data.subscriptionId,
        {
          ...(parsedBody.data.canceledAt ? { canceledAt: parsedBody.data.canceledAt } : {}),
        },
      );

      if (!subscription) {
        return reply.status(404).send({
          message: "Subscription not found.",
        });
      }

      return reply.status(200).send(subscription);
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Failed to cancel subscription.",
      });
    }
  });
}
