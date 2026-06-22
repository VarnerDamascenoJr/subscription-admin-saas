import Fastify from "fastify";
import { registerCustomerRoutes } from "./routes/customers.js";
import { registerHealthRoutes } from "./routes/health.js";

export function createApp() {
  const app = Fastify({
    logger: true,
  });

  app.get("/", async () => {
    return {
      service: "subscription-admin-saas-api",
      status: "ok",
    };
  });

  registerHealthRoutes(app);
  registerCustomerRoutes(app);

  return app;
}
