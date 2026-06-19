import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("API app", () => {
  let app = createApp();

  afterEach(async () => {
    await app.close();
    app = createApp();
  });

  it("returns service status on root route", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      service: "subscription-admin-saas-api",
      status: "ok",
    });
  });

  it("returns health payload", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
    });
    expect(typeof response.json().timestamp).toBe("string");
  });
});
