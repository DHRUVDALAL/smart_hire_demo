/**
 * Job Service
 * ============================================================
 * Business logic for job CRUD operations.
 * Recruiters create/manage jobs; applicants browse them.
 */

import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import { sendEmail, templates } from "./emailService.js";

const PUBLIC_EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];

function normalizeEmploymentType(value) {
    const normalized = String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

    return PUBLIC_EMPLOYMENT_TYPES.includes(normalized) ? normalized : null;
}

function formatEmploymentType(value) {
    const normalized = normalizeEmploymentType(value);
    if (!normalized) return "Full-time";
    return normalized
        .split("_")
        .map((chunk) => `${chunk.slice(0, 1)}${chunk.slice(1).toLowerCase()}`)
        .join("-");
}

function shortenDescription(value, maxLength = 180) {
    const text = String(value || "").trim();
    if (!text) return "No description provided.";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function mapPublicJob(job) {
    const companyName = String(job?.company?.name || "Company");
    const industry = String(job?.company?.industry || "").trim();
    const employmentType = formatEmploymentType(job?.type);
    const locationParts = [job?.location, job?.locality]
        .map((part) => String(part || "").trim())
        .filter(Boolean);

    return {
        id: job.id,
        title: job.title,
        company: companyName,
        location: locationParts.length ? locationParts.join(" • ") : "Location not specified",
        salary: job.salaryRange || "Competitive",
        employmentType,
        shortDescription: shortenDescription(job.description),
        createdAt: job.createdAt,
        category: industry || employmentType,
    };
}

/**
 * Create a new job listing.
 *
 * @param {string} userId - The recruiter's user ID.
 * @param {object} data - Validated job data.
 * @returns {Promise<object>} The created job.
 */
export async function createJob(userId, data) {
    // Find the user and their company
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, companyId: true, role: true, recruiter: true },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    if (!user.companyId) {
        throw new AppError("You must be associated with a company to post jobs.", 400);
    }

    // Check if recruiter is approved
    if (user.role === "RECRUITER" && user.recruiter && !user.recruiter.isApproved) {
        throw new AppError("Your company profile is pending admin approval. You cannot post jobs yet.", 403);
    }

    const job = await prisma.job.create({
        data: {
            ...data,
            companyId: user.companyId,
            status: user.role === "RECRUITER" ? "PENDING" : (data.status || "PENDING"),
        },
        include: {
            company: {
                select: { id: true, name: true, logo: true },
            },
        },
    });

    // Optional job alerts (disabled by default)
    try {
        if (process.env.JOB_ALERTS_ENABLED === "true") {
            const recipients = await prisma.user.findMany({
                where: { role: "APPLICANT", isActive: true },
                select: { email: true },
                take: 50,
            });

            for (const r of recipients) {
                void sendEmail(r.email, "New Job Posted", templates.newJobPosted(job.title));
            }
        }
    } catch (err) {
        console.error("Email failed:", err?.message || err);
    }

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId,
            action: "CREATE_JOB",
            entity: "Job",
            entityId: job.id,
            details: JSON.stringify({ title: job.title }),
        },
    });

    return job;
}

/**
 * Get jobs with optional filters and pagination.
 *
 * @param {object} options - Query options.
 * @param {string} [options.status] - Filter by job status.
 * @param {string} [options.companyId] - Filter by company.
 * @param {string} [options.search] - Search in title/description.
 * @param {number} [options.page=1] - Page number.
 * @param {number} [options.limit=10] - Items per page.
 * @returns {Promise<{jobs: object[], total: number, page: number, totalPages: number}>}
 */
export async function getJobs({ status, companyId, search, page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const where = {};

    if (status) {
        where.status = status;
    }

    if (companyId) {
        where.companyId = companyId;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    const [jobs, total] = await Promise.all([
        prisma.job.findMany({
            where,
            include: {
                company: {
                    select: { id: true, name: true, logo: true, location: true },
                },
                _count: {
                    select: { applications: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.job.count({ where }),
    ]);

    return {
        jobs,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

/**
 * Public-safe job feed.
 * Returns only ACTIVE jobs with sanitized fields for unauthenticated browsing.
 */
export async function getPublicJobs({
    search,
    location,
    category,
    employmentType,
    page = 1,
    limit = 9,
} = {}) {
    const safePage = Number.isFinite(page) ? Math.max(1, page) : 1;
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 24) : 9;
    const skip = (safePage - 1) * safeLimit;

    const where = {
        status: "ACTIVE",
        AND: [],
    };

    const trimmedSearch = String(search || "").trim();
    if (trimmedSearch) {
        where.AND.push({
            OR: [
                { title: { contains: trimmedSearch, mode: "insensitive" } },
                { description: { contains: trimmedSearch, mode: "insensitive" } },
                { skills: { has: trimmedSearch } },
                { company: { name: { contains: trimmedSearch, mode: "insensitive" } } },
            ],
        });
    }

    const trimmedLocation = String(location || "").trim();
    if (trimmedLocation) {
        where.AND.push({
            OR: [
                { location: { contains: trimmedLocation, mode: "insensitive" } },
                { locality: { contains: trimmedLocation, mode: "insensitive" } },
            ],
        });
    }

    const normalizedEmploymentType = normalizeEmploymentType(employmentType);
    if (normalizedEmploymentType) {
        where.AND.push({ type: normalizedEmploymentType });
    }

    const trimmedCategory = String(category || "").trim();
    if (trimmedCategory) {
        const categoryType = normalizeEmploymentType(trimmedCategory);
        where.AND.push({
            OR: [
                { company: { industry: { contains: trimmedCategory, mode: "insensitive" } } },
                ...(categoryType ? [{ type: categoryType }] : []),
            ],
        });
    }

    if (!where.AND.length) {
        delete where.AND;
    }

    const [jobs, total, locationRows, categoryRows] = await Promise.all([
        prisma.job.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: safeLimit,
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                locality: true,
                salaryRange: true,
                type: true,
                createdAt: true,
                company: {
                    select: {
                        name: true,
                        industry: true,
                    },
                },
            },
        }),
        prisma.job.count({ where }),
        prisma.job.findMany({
            where: {
                status: "ACTIVE",
                location: { not: null },
            },
            select: { location: true },
            distinct: ["location"],
            orderBy: { location: "asc" },
            take: 100,
        }),
        prisma.job.findMany({
            where: { status: "ACTIVE" },
            select: {
                type: true,
                company: {
                    select: { industry: true },
                },
            },
            take: 300,
        }),
    ]);

    const publicJobs = jobs.map(mapPublicJob);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    const categories = Array.from(
        new Set(
            categoryRows
                .map((row) => {
                    const industry = String(row?.company?.industry || "").trim();
                    return industry || formatEmploymentType(row?.type);
                })
                .filter(Boolean)
        )
    ).sort((a, b) => a.localeCompare(b));

    return {
        jobs: publicJobs,
        total,
        page: safePage,
        totalPages,
        hasNextPage: safePage < totalPages,
        filters: {
            locations: locationRows
                .map((row) => String(row.location || "").trim())
                .filter(Boolean),
            categories,
            employmentTypes: PUBLIC_EMPLOYMENT_TYPES.map(formatEmploymentType),
        },
    };
}

export async function getPublicJobById(jobId) {
    const job = await prisma.job.findFirst({
        where: {
            id: jobId,
            status: "ACTIVE",
        },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            locality: true,
            salaryRange: true,
            type: true,
            createdAt: true,
            company: {
                select: {
                    name: true,
                    industry: true,
                },
            },
        },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    return mapPublicJob(job);
}

/**
 * Get a single job by ID with full details.
 *
 * @param {string} jobId - The job ID.
 * @returns {Promise<object>} The job with company and application count.
 */
export async function getJobById(jobId) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            company: {
                select: { id: true, name: true, logo: true, website: true, location: true, industry: true },
            },
            _count: {
                select: { applications: true },
            },
        },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    return job;
}

/**
 * Update a job listing.
 * Only the job's company members (recruiters) or admins can update.
 *
 * @param {string} jobId - The job ID.
 * @param {string} userId - The requesting user's ID.
 * @param {string} userRole - The requesting user's role.
 * @param {object} data - Validated update data.
 * @returns {Promise<object>} The updated job.
 */
export async function updateJob(jobId, userId, userRole, data) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { id: true, companyId: true, status: true, title: true },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    // Authorization: must belong to the same company or be admin
    if (userRole !== "ADMIN") {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!user?.companyId || user.companyId !== job.companyId) {
            throw new AppError("You can only update jobs from your own company.", 403);
        }
    }

    const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data,
        include: {
            company: {
                select: { id: true, name: true, logo: true },
            },
        },
    });

    // Admin job status emails (best-effort)
    try {
        const newStatus = Object.prototype.hasOwnProperty.call(data, "status")
            ? String(data.status || "").toUpperCase()
            : null;
        const prevStatus = String(job.status || "").toUpperCase();

        if (userRole === "ADMIN" && newStatus && newStatus !== prevStatus) {
            const recruiters = await prisma.user.findMany({
                where: {
                    companyId: job.companyId,
                    role: "RECRUITER",
                    isActive: true,
                },
                select: { name: true, email: true },
            });

            for (const r of recruiters) {
                if (newStatus === "ACTIVE") {
                    void sendEmail(
                        r.email,
                        "Job Posting Approved",
                        templates.jobPostingApproved(r.name || "Recruiter", job.title)
                    );
                }

                if (newStatus === "HOLD") {
                    void sendEmail(
                        r.email,
                        "Job Posting On Hold",
                        templates.jobPostingOnHold(r.name || "Recruiter", job.title)
                    );
                }
            }
        }
    } catch (err) {
        console.error("Email failed:", err?.message || err);
    }

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId,
            action: "UPDATE_JOB",
            entity: "Job",
            entityId: jobId,
            details: JSON.stringify(Object.keys(data)),
        },
    });

    return updatedJob;
}

/**
 * Delete (or close) a job listing.
 *
 * @param {string} jobId - The job ID.
 * @param {string} userId - The requesting user's ID.
 * @param {string} userRole - The requesting user's role.
 * @returns {Promise<object>} The closed job.
 */
export async function deleteJob(jobId, userId, userRole) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { id: true, companyId: true },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    // Authorization: must belong to the same company or be admin
    if (userRole !== "ADMIN") {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!user?.companyId || user.companyId !== job.companyId) {
            throw new AppError("You can only delete jobs from your own company.", 403);
        }
    }

    // Soft delete — set status to CLOSED
    const closedJob = await prisma.job.update({
        where: { id: jobId },
        data: { status: "CLOSED" },
    });

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId,
            action: "DELETE_JOB",
            entity: "Job",
            entityId: jobId,
        },
    });

    return closedJob;
}

/**
 * Get applicants for a specific job (recruiter view).
 *
 * @param {string} jobId - The job ID.
 * @param {string} userId - The requesting user's ID.
 * @param {string} userRole - The requesting user's role.
 * @returns {Promise<object[]>} Array of applications with applicant details.
 */
export async function getJobApplicants(jobId, userId, userRole) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { id: true, companyId: true },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    // Authorization: must belong to the same company or be admin/HR/employee
    if (!["ADMIN", "HR", "EMPLOYEE"].includes(userRole)) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!user?.companyId || user.companyId !== job.companyId) {
            throw new AppError("Access denied.", 403);
        }
    }

    return prisma.application.findMany({
        where: { jobId },
        include: {
            applicant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    profilePicture: true,
                },
            },
            interviewFeedback: {
                select: {
                    id: true,
                    rating: true,
                    technicalRating: true,
                    communicationRating: true,
                    decision: true,
                    stage: true,
                    reviewer: {
                        select: { id: true, name: true },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}
