/**
 * Password Hashing Utilities
 * ============================================================
 * Uses bcrypt for secure password hashing and comparison.
 */

import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a hash.
 * @param {string} password - The plaintext password.
 * @param {string} hash - The stored hashed password.
 * @returns {Promise<boolean>} True if the password matches.
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
