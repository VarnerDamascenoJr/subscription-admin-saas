import Fastify from "fastify";
import { registerPrivateRoutes } from "./routes/private/index.js";
import { registerPublicRoutes } from "./routes/public/index.js";

export function createApp() {
  const app = Fastify({
    logger: true,
  });

  registerPublicRoutes(app);
  registerPrivateRoutes(app);

  return app;
}
