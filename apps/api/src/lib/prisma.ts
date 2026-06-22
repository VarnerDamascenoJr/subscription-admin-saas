import { PrismaClient } from "@prisma/client";

declare global {
  // Reuse the Prisma client in development to avoid exhausting connections
  // during hot reloads and repeated local restarts.
  var __prisma__: PrismaClient | undefined;
}

const prismaClient =
  globalThis.__prisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prismaClient;
}

export const prisma = prismaClient;
