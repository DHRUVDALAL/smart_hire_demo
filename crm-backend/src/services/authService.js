/**
 * Auth Service
 * ============================================================
 * Business logic for user registration and login.
 * Handles password hashing, duplicate checks, and token generation.
 */

import prisma from "../utils/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmail, templates } from "./emailService.js";

/**
 * Register a new user.
 *
 * @param {object} data - Validated registration data.
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.role
 * @param {string} [data.phone]
 * @returns {Promise<{user: object, token: string}>}
 */
export async function register({ name, email, password, role, phone, companyId, companyName, designation }) {
    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError("An account with this email already exists.", 409);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    let resolvedCompanyId = null;
    let resolvedCompanyName = null;

    // Recruiters must belong to a company; use existing companyId or create one.
    if (role === "RECRUITER") {
        if (companyId) {
            const existingCompany = await prisma.company.findUnique({
                where: { id: companyId },
                select: { id: true, name: true },
            });

            if (!existingCompany) {
                throw new AppError("Provided companyId does not exist.", 400);
            }

            resolvedCompanyId = existingCompany.id;
            resolvedCompanyName = existingCompany.name;
        } else if (companyName) {
            const newCompany = await prisma.company.create({
                data: { name: companyName },
                select: { id: true, name: true },
            });
            resolvedCompanyId = newCompany.id;
            resolvedCompanyName = newCompany.name;
        } else {
            throw new AppError("Recruiter registration requires companyId or companyName.", 400);
        }
    }

    // Create the user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone: phone || null,
            companyId: resolvedCompanyId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            companyId: true,
            avatar: true,
            bio: true,
            address: true,
            isActive: true,
            createdAt: true,
        },
    });

    if (role === "RECRUITER") {
        await prisma.recruiter.create({
            data: {
                userId: user.id,
                companyId: user.companyId,
                designation: designation || "Recruiter",
            },
        });

        // Email admin about new recruiter signup (best-effort)
        try {
            const adminTo = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
            if (adminTo) {
                void sendEmail(
                    adminTo,
                    "New Recruiter Registration",
                    templates.newRecruiterSignupAdmin(
                        user.name,
                        resolvedCompanyName || companyName || "(Unknown)",
                        user.email
                    )
                );
            }
        } catch (err) {
            console.error("Email failed:", err?.message || err);
        }
    }

    // If the user is an internal role, create an Employee record
    if (["HR", "ADMIN", "EMPLOYEE", "ACCOUNTANT"].includes(role)) {
        await prisma.employee.create({
            data: {
                userId: user.id,
                department:
                    role === "HR" ? "Human Resources" :
                    role === "ACCOUNTANT" ? "Finance" :
                    role === "EMPLOYEE" ? "Operations" :
                    "Administration",
                position: role,
            },
        });
    }

    // If the user is an applicant, create an Applicant profile
    if (role === "APPLICANT") {
        await prisma.applicant.create({
            data: { userId: user.id },
        });
    }

    // Generate JWT
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "REGISTER",
            entity: "User",
            entityId: user.id,
            details: JSON.stringify({ role }),
        },
    });

    return { user, token };
}

/**
 * Log in an existing user.
 *
 * @param {object} data - Validated login data.
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login({ email, password }) {
    // Find user by email with related approval data
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            recruiter: {
                select: { isApproved: true },
            },
            employee: {
                select: { isApproved: true },
            },
        },
    });

    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }

    // Check if the account is active
    if (!user.isActive) {
        throw new AppError("Your account has been deactivated. Contact support.", 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password.", 401);
    }

    // Generate JWT
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
        },
    });

    // Return user data (without password) with approval status
    const { password: _, recruiter, employee, ...userWithoutPassword } = user;
    
    // Add isApproved at top level for easier frontend access
    const isApproved = recruiter?.isApproved ?? employee?.isApproved ?? true;

    return { 
        user: {
            ...userWithoutPassword,
            isApproved,
        }, 
        token 
    };
}

/**
 * Get the currently authenticated user's details.
 *
 * @param {string} userId - The authenticated user's ID.
 * @returns {Promise<object>} The user profile data.
 */
export async function getMe(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            profilePicture: true,
            avatar: true,
            bio: true,
            address: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    website: true,
                    industry: true,
                    logo: true,
                },
            },
            employee: {
                select: {
                    id: true,
                    department: true,
                    position: true,
                    isActive: true,
                    isApproved: true,
                    joinedAt: true,
                },
            },
            recruiter: {
                select: {
                    id: true,
                    designation: true,
                    verified: true,
                    isApproved: true,
                    companyId: true,
                },
            },
            applicant: {
                select: {
                    id: true,
                    education: true,
                    experienceYears: true,
                    skills: true,
                    resumeUrl: true,
                    portfolio: true,
                },
            },
            _count: {
                select: {
                    applications: true,
                    activityLogs: true,
                    notifications: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    // Add isApproved at top level for easier frontend access
    const isApproved = user.recruiter?.isApproved ?? user.employee?.isApproved ?? true;

    return {
        ...user,
        isApproved,
    };
}
