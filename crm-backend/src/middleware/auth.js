/**
 * Authentication Middleware
 * ============================================================
 * Validates the JWT from the Authorization header and
 * attaches the decoded user payload to req.user.
 */

import { verifyToken as verifyJwtToken } from "../utils/jwt.js";
import { AppError } from "./errorHandler.js";

/**
 * Middleware: Verify JWT token.
 * Expects header: Authorization: Bearer <token>
 *
 * On success, sets req.user = { id, email, role }.
 * On failure, throws 401 AppError.
 */
export function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication required. Please provide a valid token.", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyJwtToken(token);

        // Attach user payload to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error.name === "TokenExpiredError") {
            next(new AppError("Token has expired. Please log in again.", 401));
        } else if (error.name === "JsonWebTokenError") {
            next(new AppError("Invalid token. Please log in again.", 401));
        } else {
            next(new AppError("Authentication failed.", 401));
        }
    }
}

// Alias kept for requirement compatibility.
export const verifyToken = authenticate;
