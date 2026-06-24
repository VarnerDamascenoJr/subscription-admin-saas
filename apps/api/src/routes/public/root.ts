import type { FastifyInstance } from "fastify";

export function registerRootRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      service: "subscription-admin-saas-api",
      status: "ok",
    };
  });
}
