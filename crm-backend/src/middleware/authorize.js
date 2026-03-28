/**
 * Role-Based Authorization Middleware
 * ============================================================
 * Restricts route access to users with specific roles.
 * Must be used AFTER the authenticate middleware.
 */

import { AppError } from "./errorHandler.js";

/**
 * Factory function that returns middleware restricting
 * access to the specified roles.
 *
 * @param {...string} allowedRoles - Roles permitted to access the route.
 * @returns {Function} Express middleware.
 *
 * @example
 * router.get("/admin-only", authenticate, authorize("ADMIN"), controller);
 * router.get("/hr-or-admin", authenticate, authorize("ADMIN", "HR"), controller);
 */
export function authorize(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError("Authentication required.", 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError(
                    `Access denied. This action requires one of the following roles: ${allowedRoles.join(", ")}.`,
                    403
                )
            );
        }

        next();
    };
}

// Alias kept for requirement compatibility.
export const requireRole = authorize;
