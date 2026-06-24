import type { FastifyInstance } from "fastify";
import { registerCustomerRoutes } from "./customers.js";
import { registerSubscriptionRoutes } from "./subscriptions.js";

export function registerPrivateRoutes(app: FastifyInstance) {
  registerCustomerRoutes(app);
  registerSubscriptionRoutes(app);
}
