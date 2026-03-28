/**
 * Notification Service
 * ============================================================
 * Handles creation and delivery of in-app notifications.
 * Called internally by other services when key events occur.
 */

import prisma from "../utils/prisma.js";

/**
 * Create a notification for a user.
 *
 * @param {string} userId - The recipient user ID.
 * @param {string} title - Short notification title.
 * @param {string} message - Detailed notification message.
 * @returns {Promise<object>} The created notification.
 */
export async function createNotification(userId, title, message) {
    return prisma.notification.create({
        data: { userId, title, message },
    });
}

/**
 * Notify when a candidate submits an application.
 *
 * @param {object} application - The application record (with job and applicant).
 */
export async function notifyApplicationSubmitted(application) {
    // Notify the applicant
    await createNotification(
        application.applicantId,
        "Application Submitted",
        `Your application for "${application.job?.title || "a position"}" has been submitted successfully.`
    );

    // Notify recruiters/company users about new application
    if (application.job?.companyId) {
        const companyUsers = await prisma.user.findMany({
            where: {
                companyId: application.job.companyId,
                role: { in: ["RECRUITER", "HR"] },
                isActive: true,
            },
            select: { id: true },
        });

        for (const user of companyUsers) {
            await createNotification(
                user.id,
                "New Application Received",
                `A new application has been received for "${application.job.title}".`
            );
        }
    }
}

/**
 * Notify when a candidate is shortlisted.
 *
 * @param {string} applicantId - The applicant's user ID.
 * @param {string} jobTitle - The job title.
 */
export async function notifyShortlisted(applicantId, jobTitle) {
    await createNotification(
        applicantId,
        "You've Been Shortlisted!",
        `Congratulations! You have been shortlisted for "${jobTitle}".`
    );
}

/**
 * Notify when an interview is scheduled.
 *
 * @param {string} applicantId - The applicant's user ID.
 * @param {string} jobTitle - The job title.
 */
export async function notifyInterviewScheduled(applicantId, jobTitle) {
    await createNotification(
        applicantId,
        "Interview Scheduled",
        `An interview has been scheduled for your application to "${jobTitle}". Check your email for details.`
    );
}

/**
 * Notify recruiters that a job was approved by admin.
 *
 * @param {string[]} recruiterIds - Recruiter user IDs.
 * @param {string} jobTitle - The job title.
 */
export async function notifyJobApproved(recruiterIds, jobTitle) {
    for (const recruiterId of recruiterIds) {
        await createNotification(
            recruiterId,
            "Job Approved",
            `Your job \"${jobTitle}\" has been approved and is now active.`
        );
    }
}

/**
 * Notify internal employees when interview is scheduled.
 *
 * @param {string[]} employeeIds - Employee user IDs.
 * @param {string} jobTitle - Job title.
 * @param {string} candidateName - Candidate name.
 * @param {string} scheduleText - Human-readable datetime.
 */
export async function notifyInterviewScheduledForEmployees(employeeIds, jobTitle, candidateName, scheduleText) {
    for (const employeeId of employeeIds) {
        await createNotification(
            employeeId,
            "Interview Scheduled",
            `Interview scheduled for ${candidateName} (${jobTitle}) on ${scheduleText}.`
        );
    }
}

/**
 * Notify when an application is rejected.
 *
 * @param {string} applicantId - The applicant's user ID.
 * @param {string} jobTitle - The job title.
 */
export async function notifyRejected(applicantId, jobTitle) {
    await createNotification(
        applicantId,
        "Application Update",
        `We regret to inform you that your application for "${jobTitle}" was not successful. Keep exploring other opportunities!`
    );
}

/**
 * Get all notifications for a user.
 *
 * @param {string} userId - The user ID.
 * @param {boolean} [unreadOnly=false] - Only return unread notifications.
 * @returns {Promise<object[]>} Array of notifications.
 */
export async function getUserNotifications(userId, unreadOnly = false) {
    return prisma.notification.findMany({
        where: {
            userId,
            ...(unreadOnly && { isRead: false }),
        },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}

/**
 * Mark a notification as read.
 *
 * @param {string} notificationId - The notification ID.
 * @param {string} userId - The user ID (for ownership verification).
 * @returns {Promise<object>} The updated notification.
 */
export async function markAsRead(notificationId, userId) {
    return prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
    });
}

/**
 * Mark all notifications as read for a user.
 *
 * @param {string} userId - The user ID.
 */
export async function markAllAsRead(userId) {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
}
