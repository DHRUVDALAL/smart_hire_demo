/**
 * Server Entry Point
 * ============================================================
 * Loads environment variables, imports the Express app,
 * and starts the HTTP server.
 */

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5001;
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL || `http://0.0.0.0:${PORT}`)
    .replace(/\/+$/, "");

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
