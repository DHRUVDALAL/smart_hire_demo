/**
 * Server Entry Point
 * ============================================================
 * Loads environment variables, imports the Express app,
 * and starts the HTTP server.
 */

import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`\n🚀 Smart Hire CRM Backend`);
    console.log(`   Environment    : ${process.env.NODE_ENV || "development"}`);
    console.log(`   Server         : http://localhost:${PORT}`);
    console.log(`   Health         : http://localhost:${PORT}/health`);
    console.log(`   Auth           : http://localhost:${PORT}/api/auth`);
    console.log(`   Profile        : http://localhost:${PORT}/api/profile`);
    console.log(`   Jobs           : http://localhost:${PORT}/api/jobs`);
    console.log(`   Applications   : http://localhost:${PORT}/api/applications`);
    console.log(`   Reviews        : http://localhost:${PORT}/api/reviews\n`);
});
