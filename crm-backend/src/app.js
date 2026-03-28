/**
 * Express Application
 * ============================================================
 * Configures middleware, mounts routes, and sets up
 * the global error handler.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ======================== GLOBAL MIDDLEWARE ========================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// HTTP request logging (skip in test)
if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
}

// ======================== STATIC FILES ========================

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ======================== HEALTH CHECK ========================

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "CRM Backend Running 🚀",
        timestamp: new Date().toISOString(),
    });
});

// ======================== API ROUTES ========================

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/notifications", notificationRoutes);

// ======================== 404 HANDLER ========================

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ======================== ERROR HANDLER ========================

app.use(errorHandler);

export default app;