/**
 * Server Entry Point
 * ============================================================
 * Loads environment variables, imports the Express app,
 * and starts the HTTP server.
 */

import "dotenv/config";
import app from "./app.js";
import prisma from "./utils/prisma.js";

const PORT = process.env.PORT || 10000;
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL || `http://0.0.0.0:${PORT}`)
    .replace(/\/+$/, "");

console.log("Auth routes mounted at /api/auth");

try {
    await prisma.$connect();
    console.log("Prisma connected to PostgreSQL");
} catch (error) {
    console.error("Prisma failed to connect:", error?.message || error);
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`\n🚀 Smart Hire CRM Backend`);
    console.log(`   Environment    : ${process.env.NODE_ENV || "development"}`);
    console.log(`   Server         : ${PUBLIC_BASE_URL}`);
    console.log(`   Health         : ${PUBLIC_BASE_URL}/health`);
    console.log(`   Auth           : ${PUBLIC_BASE_URL}/api/auth`);
    console.log(`   Profile        : ${PUBLIC_BASE_URL}/api/profile`);
    console.log(`   Jobs           : ${PUBLIC_BASE_URL}/api/jobs`);
    console.log(`   Applications   : ${PUBLIC_BASE_URL}/api/applications`);
    console.log(`   Reviews        : ${PUBLIC_BASE_URL}/api/reviews\n`);
});
