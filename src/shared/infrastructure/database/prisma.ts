import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    errorFormat: "pretty",
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : process.env.NODE_ENV === "test"
          ? undefined
          : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
