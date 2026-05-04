/**
 * Zod Validation Schemas
 * ============================================================
 * Centralized request body validation using Zod.
 * Each schema validates the shape and constraints of
 * incoming API data before it reaches the controller.
 */

import { z } from "zod";

// ======================== AUTH ========================

/**
 * Registration request body schema.
 */
export const registerSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .trim(),

    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must not exceed 128 characters"),

    role: z.enum(["ADMIN", "RECRUITER", "APPLICANT", "HR", "EMPLOYEE", "ACCOUNTANT"], {
        required_error: "Role is required",
        invalid_type_error:
            "Invalid role. Must be one of: ADMIN, RECRUITER, APPLICANT, HR, EMPLOYEE, ACCOUNTANT",
    }),

    phone: z.string().optional(),

    companyId: z.string().uuid("Invalid companyId format").optional(),

    companyName: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(150, "Company name must not exceed 150 characters")
        .trim()
        .optional(),

    designation: z
        .string()
        .max(120, "Designation must not exceed 120 characters")
        .trim()
        .optional(),
});

/**
 * Login request body schema.
 */
export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
});

// ======================== PROFILE ========================

/**
 * Profile update request body schema.
 * All fields are optional — only provided fields will be updated.
 */
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .trim()
        .optional(),

    phone: z
        .string()
        .max(20, "Phone number too long")
        .optional()
        .nullable(),

    alternatePhone: z
        .string()
        .max(20, "Alternate phone number too long")
        .optional()
        .nullable(),

    bio: z
        .string()
        .max(500, "Bio must not exceed 500 characters")
        .optional()
        .nullable(),

    address: z
        .string()
        .max(200, "Address must not exceed 200 characters")
        .optional()
        .nullable(),

    avatar: z
        .string()
        .url("Avatar must be a valid URL")
        .optional()
        .nullable(),

    profilePicture: z
        .string()
        .url("Profile picture must be a valid URL")
        .optional()
        .nullable(),

    // Employee-specific fields
    department: z
        .string()
        .max(120, "Department must not exceed 120 characters")
        .trim()
        .optional()
        .nullable(),

    position: z
        .string()
        .max(120, "Position must not exceed 120 characters")
        .trim()
        .optional()
        .nullable(),

    specialization: z
        .string()
        .max(200, "Specialization must not exceed 200 characters")
        .trim()
        .optional()
        .nullable(),

    // Recruiter/company-specific fields
    companyName: z
        .string()
        .min(2, "Company name must be at least 2 characters")
        .max(200, "Company name must not exceed 200 characters")
        .trim()
        .optional()
        .nullable(),

    industry: z
        .string()
        .max(200, "Industry must not exceed 200 characters")
        .trim()
        .optional()
        .nullable(),

    companySize: z
        .string()
        .max(100, "Company size must not exceed 100 characters")
        .trim()
        .optional()
        .nullable(),

    companyDescription: z
        .string()
        .max(2000, "Company description must not exceed 2000 characters")
        .trim()
        .optional()
        .nullable(),

    companyAddress: z
        .string()
        .max(300, "Company address must not exceed 300 characters")
        .trim()
        .optional()
        .nullable(),

    city: z
        .string()
        .max(120, "City must not exceed 120 characters")
        .trim()
        .optional()
        .nullable(),

    country: z
        .string()
        .max(120, "Country must not exceed 120 characters")
        .trim()
        .optional()
        .nullable(),

    // Applicant/employee shared fields
    skills: z
        .array(z.string().max(50))
        .max(30, "Cannot have more than 30 skills")
        .optional()
        .nullable(),

    experience: z
        .number()
        .int()
        .min(0, "Experience must be 0 or more")
        .max(50, "Experience cannot exceed 50 years")
        .optional()
        .nullable(),

    designation: z
        .string()
        .max(120, "Designation must not exceed 120 characters")
        .trim()
        .optional()
        .nullable(),

    education: z
        .string()
        .max(500, "Education must not exceed 500 characters")
        .optional()
        .nullable(),

    portfolio: z
        .string()
        .url("Portfolio must be a valid URL")
        .optional()
        .nullable(),
});

// ======================== JOBS ========================

/**
 * Create job request body schema.
 */
export const createJobSchema = z.object({
    title: z
        .string({ required_error: "Job title is required" })
        .min(2, "Title must be at least 2 characters")
        .max(200, "Title must not exceed 200 characters")
        .trim(),

    description: z
        .string({ required_error: "Job description is required" })
        .min(10, "Description must be at least 10 characters")
        .max(5000, "Description must not exceed 5000 characters")
        .trim(),

    location: z.string().max(200).trim().optional().nullable(),

    locality: z.string().max(200).trim().optional().nullable(),

    type: z
        .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
        .optional(),

    salaryRange: z.string().max(100).optional().nullable(),

    salaryMin: z.number().int().min(0).optional().nullable(),

    salaryMax: z.number().int().min(0).optional().nullable(),

    skills: z.array(z.string().max(50)).max(20).optional(),

    status: z
        .enum(["DRAFT", "PENDING", "PENDING_APPROVAL", "ACTIVE", "PAUSED", "CLOSED"])
        .optional(),

    expiresAt: z.string().datetime().optional().nullable(),
});

/**
 * Update job request body schema — all fields optional.
 */
export const updateJobSchema = createJobSchema.partial();

// ======================== APPLICATIONS ========================

/**
 * Create application request body schema.
 */
export const createApplicationSchema = z.object({
    jobId: z
        .string({ required_error: "Job ID is required" })
        .uuid("Invalid Job ID format"),

    coverLetter: z.string().max(2000).optional().nullable(),

    resumeUrl: z.string().url("Resume URL must be valid").optional().nullable(),
});

export const updateApplicationStatusSchema = z.object({
    status: z.enum([
        "APPLIED",
        "REVIEWED",
        "APPROVED",
        "REJECTED",
        "INTERVIEW",
        "HOLD",
        "ACCEPTED",
        "REJECTED_FINAL",
    ], {
        required_error: "Status is required",
    }),
    notes: z.string().max(2000).optional().nullable(),
});

// ======================== REVIEWS ========================

/**
 * Create review (interview feedback) request body schema.
 */
export const createReviewSchema = z.object({
    applicationId: z
        .string({ required_error: "Application ID is required" })
        .uuid("Invalid Application ID format"),

    technicalRating: z.number().int().min(1).max(5).optional().nullable(),

    communicationRating: z.number().int().min(1).max(5).optional().nullable(),

    rating: z.number().int().min(1).max(5).optional().nullable(),

    notes: z.string().max(2000).optional().nullable(),

    decision: z
        .enum(["APPROVE", "REJECT", "HOLD"])
        .optional()
        .nullable(),

    stage: z.string().max(100).optional().nullable(),
});

// ======================== INTERVIEWS ========================

export const createInterviewSchema = z.object({
    applicationId: z
        .string({ required_error: "Application ID is required" })
        .uuid("Invalid Application ID format"),
    scheduledAt: z
        .string({ required_error: "scheduledAt is required" })
        .datetime("scheduledAt must be a valid ISO datetime"),
    mode: z.enum(["ONLINE", "OFFLINE"], {
        required_error: "Interview mode is required",
    }),
    meetingLink: z.string().max(500).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
}).superRefine((body, ctx) => {
    const mode = String(body.mode || "").toUpperCase();

    if (mode === "ONLINE") {
        if (!body.meetingLink || !String(body.meetingLink).trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["meetingLink"],
                message: "meetingLink is required for ONLINE interviews",
            });
        }
    }

    if (mode === "OFFLINE") {
        if (!body.location || !String(body.location).trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["location"],
                message: "location is required for OFFLINE interviews",
            });
        }
    }
});

export const updateInterviewSchema = z.object({
    scheduledAt: z.string().datetime().optional(),
    mode: z.enum(["ONLINE", "OFFLINE"]).optional(),
    meetingLink: z.string().max(500).optional().nullable(),
    location: z.string().max(200).optional().nullable(),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
}).refine((body) => Object.keys(body).length > 0, {
    message: "At least one field is required for update",
});

// ======================== ADMIN ========================

export const rejectJobSchema = z.object({
    reason: z.string().max(500).optional(),
});

// ======================== HELPERS ========================

/**
 * Validate request body against a Zod schema.
 * Returns a middleware function for Express.
 *
 * @param {z.ZodSchema} schema - The Zod schema to validate against.
 * @returns {Function} Express middleware.
 */
export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        // Replace req.body with the parsed (cleaned) data
        req.body = result.data;
        next();
    };
}
