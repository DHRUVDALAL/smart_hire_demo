/**
 * Prisma Client Singleton
 * ============================================================
 * Ensures a single PrismaClient instance is reused across
 * the application, preventing connection pool exhaustion.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export default prisma;
