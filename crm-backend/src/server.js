/**
 * Server Entry Point
 * ============================================================
 * Loads environment variables, imports the Express app,
 * and starts the HTTP server.
 */

import "dotenv/config";
import app, { importedRouteModules, mountedRoutes } from "./app.js";
import prisma from "./utils/prisma.js";

const PORT = process.env.PORT || 10000;
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL || `http://0.0.0.0:${PORT}`)
    .replace(/\/+$/, "");

function describeSecret(name) {
    const value = process.env[name];
    return value ? `set(length=${value.length})` : "missing";
}

function describeOptional(name) {
    const value = process.env[name];
    return value ? value : "missing";
}

function describeDatabaseUrl(rawUrl) {
    if (!rawUrl) return "missing";
    try {
        const parsed = new URL(rawUrl);
        const dbName = parsed.pathname.replace(/^\/+/, "") || "(none)";
        const port = parsed.port || "(default)";
        return `${parsed.protocol}//${parsed.hostname}:${port}/${dbName}`;
    } catch {
        return "set(unparseable)";
    }
}

const isRender = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID);

console.log("\n[startup] ===== Smart Hire CRM boot diagnostics =====");
console.log(`[startup] cwd: ${process.cwd()}`);
console.log(`[startup] entry file: ${new URL(import.meta.url).pathname}`);
console.log(`[startup] render detected: ${isRender}`);
console.log(`[startup] render service: ${process.env.RENDER_SERVICE_NAME || "unknown"}`);
console.log(`[startup] render service id: ${process.env.RENDER_SERVICE_ID || "unknown"}`);
console.log(`[startup] render git commit: ${process.env.RENDER_GIT_COMMIT || "unknown"}`);
console.log(`[startup] env NODE_ENV: ${describeOptional("NODE_ENV")}`);
console.log(`[startup] env PORT: ${describeOptional("PORT")}`);
console.log(`[startup] env CORS_ORIGIN: ${describeOptional("CORS_ORIGIN")}`);
console.log(`[startup] env PUBLIC_BASE_URL: ${describeOptional("PUBLIC_BASE_URL")}`);
console.log(`[startup] env DATABASE_URL: ${describeDatabaseUrl(process.env.DATABASE_URL)}`);
console.log(`[startup] env JWT_SECRET: ${describeSecret("JWT_SECRET")}`);
console.log(`[startup] imported route modules: ${importedRouteModules.join(", ")}`);
mountedRoutes.forEach((route) => {
    console.log(`[startup] mounted route: ${route.method} ${route.path} (${route.module})`);
});
console.log("[startup] ===========================================\n");

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
