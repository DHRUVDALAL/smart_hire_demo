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
import { AppError, errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const importedRouteModules = [
    "authRoutes",
    "profileRoutes",
    "jobRoutes",
    "applicationRoutes",
    "reviewRoutes",
    "adminRoutes",
    "interviewRoutes",
    "notificationRoutes",
];
const mountedRoutes = [];

function joinPaths(basePath, routePath) {
    const normalizedBase = String(basePath || "").replace(/\/+$/, "");
    const normalizedRoute = String(routePath || "").replace(/^\/+/, "");
    if (!normalizedBase) return `/${normalizedRoute}`.replace(/\/{2,}/g, "/");
    if (!normalizedRoute) return normalizedBase;
    return `${normalizedBase}/${normalizedRoute}`.replace(/\/{2,}/g, "/");
}

function mountRouter(mountPath, moduleName, router) {
    app.use(mountPath, router);

    console.log(`[startup][mount] ${moduleName} mounted at ${mountPath}`);

    if (!Array.isArray(router?.stack)) {
        mountedRoutes.push({ module: moduleName, method: "USE", path: mountPath });
        return;
    }

    const discovered = router.stack
        .filter((layer) => layer?.route?.path)
        .flatMap((layer) => {
            const methods = Object.keys(layer.route.methods || {})
                .filter((method) => layer.route.methods[method])
                .map((method) => method.toUpperCase());
            const fullPath = joinPaths(mountPath, layer.route.path);
            return methods.map((method) => ({ module: moduleName, method, path: fullPath }));
        });

    if (!discovered.length) {
        mountedRoutes.push({ module: moduleName, method: "USE", path: mountPath });
        return;
    }

    discovered.forEach((route) => {
        mountedRoutes.push(route);
        console.log(`[startup][route] ${route.method} ${route.path}`);
    });
}

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }

        if (!ALLOWED_ORIGINS.length && process.env.NODE_ENV !== "production") {
            callback(null, true);
            return;
        }

        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new AppError(`CORS blocked for origin: ${origin}`, 403));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// ======================== GLOBAL MIDDLEWARE ========================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
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
mountedRoutes.push({ module: "core", method: "GET", path: "/health" });

// ======================== API ROUTES ========================

mountRouter("/api/auth", "authRoutes", authRoutes);
mountRouter("/api/profile", "profileRoutes", profileRoutes);
mountRouter("/api/jobs", "jobRoutes", jobRoutes);
mountRouter("/api/applications", "applicationRoutes", applicationRoutes);
mountRouter("/api/reviews", "reviewRoutes", reviewRoutes);
mountRouter("/api/admin", "adminRoutes", adminRoutes);
mountRouter("/api/interviews", "interviewRoutes", interviewRoutes);
mountRouter("/api/notifications", "notificationRoutes", notificationRoutes);

// Temporary deployment-debug endpoint
app.get("/debug/routes", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Mounted routes debug information",
        data: {
            cwd: process.cwd(),
            nodeVersion: process.version,
            render: {
                isRender: Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID),
                serviceName: process.env.RENDER_SERVICE_NAME || null,
                serviceId: process.env.RENDER_SERVICE_ID || null,
                gitCommit: process.env.RENDER_GIT_COMMIT || null,
            },
            importedRouteModules,
            routeCount: mountedRoutes.length,
            routes: mountedRoutes,
        },
    });
});
mountedRoutes.push({ module: "core", method: "GET", path: "/debug/routes" });

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
export { importedRouteModules, mountedRoutes };
