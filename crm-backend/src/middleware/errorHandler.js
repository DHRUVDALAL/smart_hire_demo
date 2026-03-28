/**
 * Global Error Handler Middleware
 * ============================================================
 * Custom AppError class for operational errors and a
 * centralized Express error handler for consistent API responses.
 */

/**
 * Custom error class for operational/expected errors.
 * Throw this from controllers or services to return a
 * clean JSON error response with the correct HTTP status.
 */
export class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message.
     * @param {number} statusCode - HTTP status code (default 500).
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Express error-handling middleware.
 * Must have 4 parameters to be recognized by Express as an error handler.
 */
export function errorHandler(err, req, res, _next) {
    // Default values
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : "Internal server error";

    // Log unexpected errors in development
    if (!err.isOperational) {
        console.error("❌ UNEXPECTED ERROR:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
}
