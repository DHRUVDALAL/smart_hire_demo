/**
 * Application Service
 * ============================================================
 * Business logic for job applications.
 * Applicants apply to jobs and track their applications.
 */

import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import * as notificationService from "./notificationService.js";
import { sendEmail, templates } from "./emailService.js";

/**
 * Apply to a job.
 *
 * @param {string} applicantId - The applicant's user ID.
 * @param {object} data - Validated application data.
 * @param {string} data.jobId - The job ID.
 * @param {string} [data.coverLetter] - Optional cover letter.
 * @param {string} [data.resumeUrl] - Optional resume URL.
 * @returns {Promise<object>} The created application.
 */
export async function applyToJob(applicantId, data) {
    // Verify user is an applicant
    const user = await prisma.user.findUnique({
        where: { id: applicantId },
        select: { id: true, role: true, name: true, email: true },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    if (user.role !== "APPLICANT") {
        throw new AppError("Only applicants can apply to jobs.", 403);
    }

    // Verify job exists and is active
    const job = await prisma.job.findUnique({
        where: { id: data.jobId },
        select: { id: true, title: true, status: true, companyId: true },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    if (job.status !== "ACTIVE") {
        throw new AppError("This job is not currently accepting applications.", 400);
    }

    // Check if already applied
    const existing = await prisma.application.findUnique({
        where: {
            applicantId_jobId: {
                applicantId,
                jobId: data.jobId,
            },
        },
    });

    if (existing) {
        throw new AppError("You have already applied to this job.", 409);
    }

    // Create the application
    const application = await prisma.application.create({
        data: {
            applicantId,
            jobId: data.jobId,
            coverLetter: data.coverLetter || null,
            resumeUrl: data.resumeUrl || null,
            status: "APPLIED",
        },
        include: {
            job: {
                select: { id: true, title: true, companyId: true, company: { select: { name: true } } },
            },
        },
    });

    // Send notifications
    try {
        await notificationService.notifyApplicationSubmitted({
            ...application,
            applicantId,
            job,
        });
    } catch (err) {
        console.error("Failed to send notification:", err.message);
    }

    // Email (best-effort)
    try {
        void sendEmail(
            user.email,
            "Application Submitted",
            templates.applicationSubmitted(user.name, job.title)
        );
    } catch (err) {
        console.error("Email failed:", err?.message || err);
    }

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId: applicantId,
            action: "APPLY_TO_JOB",
            entity: "Application",
            entityId: application.id,
            details: JSON.stringify({ jobId: data.jobId, jobTitle: job.title }),
        },
    });

    return application;
}

/**
 * Get all applications for the current applicant.
 *
 * @param {string} applicantId - The applicant's user ID.
 * @returns {Promise<object[]>} Array of applications with job details.
 */
export async function getMyApplications(applicantId) {
    return prisma.application.findMany({
        where: { applicantId },
        include: {
            job: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    location: true,
                    salaryRange: true,
                    salaryMin: true,
                    salaryMax: true,
                    skills: true,
                    type: true,
                    status: true,
                    createdAt: true,
                    company: {
                        select: { id: true, name: true, logo: true },
                    },
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
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Get a single application by ID.
 * Access control: applicant sees own, recruiters/HR/admin see all.
 *
 * @param {string} applicationId - The application ID.
 * @param {string} userId - The requesting user's ID.
 * @param {string} userRole - The requesting user's role.
 * @returns {Promise<object>} The application with full details.
 */
export async function getApplicationById(applicationId, userId, userRole) {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            applicant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    profilePicture: true,
                    bio: true,
                    applicant: {
                        select: {
                            education: true,
                            experienceYears: true,
                            skills: true,
                            resumeUrl: true,
                            portfolio: true,
                        },
                    },
                },
            },
            job: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    location: true,
                    salaryRange: true,
                    status: true,
                    companyId: true,
                    company: {
                        select: { id: true, name: true, logo: true },
                    },
                },
            },
            interviewFeedback: {
                include: {
                    reviewer: {
                        select: { id: true, name: true, role: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!application) {
        throw new AppError("Application not found.", 404);
    }

    // Access control
    if (userRole === "APPLICANT") {
        if (application.applicantId !== userId) {
            throw new AppError("Access denied.", 403);
        }
    }

    if (userRole === "RECRUITER") {
        const recruiter = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!recruiter?.companyId || recruiter.companyId !== application.job.companyId) {
            throw new AppError("Access denied.", 403);
        }
    }

    return application;
}

/**
 * List applications with role-based visibility.
 * - HR/EMPLOYEE/ADMIN: all applications
 * - RECRUITER: only applications from recruiter's company
 */
export async function listApplications(userId, userRole, options = {}) {
    // Check if employee is approved
    if (userRole === "EMPLOYEE") {
        const employee = await prisma.employee.findUnique({
            where: { userId },
        });
        
        if (employee && !employee.isApproved) {
            throw new AppError("Your profile is awaiting admin approval. You cannot access applications yet.", 403);
        }
    }

    const where = {};

    if (options.status) {
        where.status = options.status;
    }

    if (userRole === "RECRUITER") {
        const recruiter = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!recruiter?.companyId) {
            return [];
        }

        where.job = { companyId: recruiter.companyId };
    }

    return prisma.application.findMany({
        where,
        include: {
            applicant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    bio: true,
                    address: true,
                    applicant: {
                        select: {
                            resumeUrl: true,
                            skills: true,
                            experienceYears: true,
                            education: true,
                            designation: true,
                        },
                    },
                },
            },
            job: {
                select: {
                    id: true,
                    title: true,
                    companyId: true,
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            interviews: {
                select: {
                    id: true,
                    status: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Update application status with role-based transition policy.
 */
export async function updateApplicationStatus(applicationId, userId, userRole, payload) {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            job: {
                select: {
                    title: true,
                    companyId: true,
                },
            },
            applicant: {
                select: { id: true },
            },
        },
    });

    if (!application) {
        throw new AppError("Application not found.", 404);
    }

    const requestedStatus = String(payload.status || "").toUpperCase();

    const reviewerAllowed = ["APPROVED", "REJECTED", "REVIEWED", "HOLD"];

    const currentStatus = String(application.status || "").toUpperCase();
    const recruiterAllowedBase = ["INTERVIEW", "HOLD", "ACCEPTED", "REJECTED_FINAL"];
    const recruiterAllowed =
        currentStatus === "HOLD"
            ? [...recruiterAllowedBase, "APPROVED", "REVIEWED"]
            : recruiterAllowedBase;

    if (["HR", "EMPLOYEE", "ADMIN"].includes(userRole)) {
        if (!reviewerAllowed.includes(requestedStatus)) {
            throw new AppError("This status transition is not allowed for your role.", 403);
        }
    } else if (userRole === "RECRUITER") {
        const recruiter = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true },
        });

        if (!recruiter?.companyId || recruiter.companyId !== application.job.companyId) {
            throw new AppError("Access denied.", 403);
        }

        if (!recruiterAllowed.includes(requestedStatus)) {
            throw new AppError(
                "Recruiter can only move candidates to INTERVIEW, HOLD, ACCEPTED, REJECTED_FINAL (and can revert HOLD to APPROVED/REVIEWED).",
                403
            );
        }

        if (!["APPROVED", "INTERVIEW", "HOLD"].includes(currentStatus)) {
            throw new AppError("Recruiter can only process approved/active pipeline candidates.", 400);
        }
    } else {
        throw new AppError("You are not allowed to update application status.", 403);
    }

    const updated = await prisma.application.update({
        where: { id: applicationId },
        data: {
            status: requestedStatus,
            notes: payload.notes ?? application.notes,
        },
        include: {
            applicant: {
                select: { id: true, name: true, email: true },
            },
            job: {
                select: { id: true, title: true },
            },
        },
    });

    // Keep applicant informed through in-app notifications.
    const messageByStatus = {
        REVIEWED: `Your application for "${application.job.title}" has been reviewed.`,
        APPROVED: `Great news! Your application for "${application.job.title}" has been approved for recruiter review.`,
        REJECTED: `Your application for "${application.job.title}" was not selected in initial screening.`,
        INTERVIEW: `You have moved to interview stage for "${application.job.title}".`,
        HOLD: `Your application for "${application.job.title}" is currently on hold.`,
        ACCEPTED: `Congratulations! You have been accepted for "${application.job.title}".`,
        REJECTED_FINAL: `Your application for "${application.job.title}" has been closed after final review.`,
    };

    const notificationMessage = messageByStatus[requestedStatus];
    if (notificationMessage) {
        await notificationService.createNotification(
            application.applicant.id,
            "Application Status Updated",
            notificationMessage
        );
    }

    await prisma.activityLog.create({
        data: {
            userId,
            action: "UPDATE_APPLICATION_STATUS",
            entity: "Application",
            entityId: applicationId,
            details: JSON.stringify({
                from: application.status,
                to: requestedStatus,
            }),
        },
    });

    // Applicant email updates (best-effort)
    try {
        if (requestedStatus === "APPROVED") {
            void sendEmail(
                updated.applicant.email,
                "Application Approved",
                templates.applicationApproved(updated.applicant.name, updated.job.title)
            );
        }

        if (requestedStatus === "REJECTED" || requestedStatus === "REJECTED_FINAL") {
            void sendEmail(
                updated.applicant.email,
                "Application Update",
                templates.applicationRejected(updated.applicant.name, updated.job.title)
            );
        }
    } catch (err) {
        console.error("Email failed:", err?.message || err);
    }

    return updated;
}
