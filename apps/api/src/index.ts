import { createApp } from "./app.js";
import { env } from "./config/env.js";

async function bootstrap() {
  const app = createApp();

  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
    app.log.info(`API listening on port ${env.API_PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void bootstrap();
