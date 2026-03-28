/**
 * JWT Utilities
 * ============================================================
 * Provides token generation and verification helpers
 * using the jsonwebtoken library.
 */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate a signed JWT token for a user.
 * @param {object} payload - Data to encode (id, email, role).
 * @returns {string} Signed JWT string.
 */
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT to verify.
 * @returns {object} Decoded payload.
 * @throws {Error} If token is invalid or expired.
 */
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
