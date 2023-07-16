import { PrismaClient } from "@prisma/client";
import "server-only";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

/**
 * The code initializes the Prisma client, `prisma`, based on the environment.
 * In production, a new PrismaClient instance is created.
 * In development, it checks if `global.cachedPrisma` is defined.
 * If not, it creates a new PrismaClient instance and assigns it to `global.cachedPrisma`.
 * Finally, `prisma` is set to `global.cachedPrisma`.
 */

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

/**
 * The `db` object exports the initialized Prisma client, `prisma`.
 * It can be used to interact with the database using Prisma's query API.
 */
export const db = prisma;
