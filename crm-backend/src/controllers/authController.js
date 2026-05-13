/**
 * Auth Controller
 * ============================================================
 * Express request handlers for authentication endpoints.
 * Delegates business logic to authService.
 */

import * as authService from "../services/authService.js";

/**
 * POST /api/auth/register
 * Register a new user.
 */
export async function registerHandler(req, res, next) {
    try {
        const { user, token } = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/login
 * Log in an existing user.
 */
export async function loginHandler(req, res, next) {
    try {
        const { user, token } = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/auth/me
 * Get the currently authenticated user.
 */
export async function getMeHandler(req, res, next) {
    try {
        const user = await authService.getMe(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
