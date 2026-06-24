import type { FastifyInstance } from "fastify";
import { registerHealthRoutes } from "./health.js";
import { registerRootRoutes } from "./root.js";

export function registerPublicRoutes(app: FastifyInstance) {
  registerRootRoutes(app);
  registerHealthRoutes(app);
}
