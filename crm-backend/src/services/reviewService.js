/**
 * Review Service
 * ============================================================
 * Business logic for interview feedback and candidate reviews.
 * Employees/HR review candidates and provide feedback.
 */

import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import * as notificationService from "./notificationService.js";

/**
 * Add interview feedback / review for an application.
 *
 * @param {string} reviewerId - The reviewer's user ID.
 * @param {object} data - Validated review data.
 * @returns {Promise<object>} The created interview feedback.
 */
export async function addReview(reviewerId, data) {
    // Verify the application exists
    const application = await prisma.application.findUnique({
        where: { id: data.applicationId },
        include: {
            job: { select: { id: true, title: true } },
            applicant: { select: { id: true, name: true } },
        },
    });

    if (!application) {
        throw new AppError("Application not found.", 404);
    }

    // Create the feedback
    const feedback = await prisma.interviewFeedback.create({
        data: {
            applicationId: data.applicationId,
            reviewerId,
            rating: data.rating || null,
            technicalRating: data.technicalRating || null,
            communicationRating: data.communicationRating || null,
            notes: data.notes || null,
            decision: data.decision || null,
            stage: data.stage || null,
        },
        include: {
            reviewer: {
                select: { id: true, name: true, role: true },
            },
            application: {
                select: {
                    id: true,
                    status: true,
                    applicantId: true,
                    job: { select: { id: true, title: true } },
                },
            },
        },
    });

    // Update application status based on decision
    if (data.decision) {
        let newStatus;
        switch (data.decision) {
            case "APPROVE":
                newStatus = "APPROVED";
                break;
            case "REJECT":
                newStatus = "REJECTED";
                break;
            case "HOLD":
                newStatus = "HOLD";
                break;
        }

        if (newStatus) {
            await prisma.application.update({
                where: { id: data.applicationId },
                data: { status: newStatus },
            });

            // Send notifications based on decision
            try {
                const jobTitle = application.job?.title || "a position";

                if (newStatus === "APPROVED") {
                    await notificationService.notifyShortlisted(
                        application.applicantId,
                        jobTitle
                    );
                } else if (newStatus === "REJECTED") {
                    await notificationService.notifyRejected(
                        application.applicantId,
                        jobTitle
                    );
                }
            } catch (err) {
                console.error("Failed to send notification:", err.message);
            }
        }
    }

    if (!data.decision) {
        await prisma.application.update({
            where: { id: data.applicationId },
            data: { status: "REVIEWED" },
        });
    }

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId: reviewerId,
            action: "ADD_REVIEW",
            entity: "InterviewFeedback",
            entityId: feedback.id,
            details: JSON.stringify({
                applicationId: data.applicationId,
                decision: data.decision,
            }),
        },
    });

    return feedback;
}

/**
 * Get all reviews/feedback for a specific application.
 *
 * @param {string} applicationId - The application ID.
 * @returns {Promise<object[]>} Array of interview feedback records.
 */
export async function getReviewsByApplication(applicationId) {
    // Verify the application exists
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { id: true },
    });

    if (!application) {
        throw new AppError("Application not found.", 404);
    }

    return prisma.interviewFeedback.findMany({
        where: { applicationId },
        include: {
            reviewer: {
                select: { id: true, name: true, role: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}
