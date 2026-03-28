/**
 * Interview Service
 * ============================================================
 * Handles interview scheduling and tracking workflow.
 */

import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import * as notificationService from "./notificationService.js";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";

export async function scheduleInterview(recruiterId, payload) {
    const recruiter = await prisma.user.findUnique({
        where: { id: recruiterId },
        select: { id: true, role: true, companyId: true, name: true },
    });

    if (!recruiter) {
        throw new AppError("Recruiter not found.", 404);
    }

    if (recruiter.role !== "RECRUITER") {
        throw new AppError("Only recruiters can schedule interviews.", 403);
    }

    const application = await prisma.application.findUnique({
        where: { id: payload.applicationId },
        include: {
            applicant: { select: { id: true, name: true } },
            job: { select: { id: true, title: true, companyId: true } },
        },
    });

    if (!application) {
        throw new AppError("Application not found.", 404);
    }

    // Validate recruiter owns the job via company ownership.
    if (!recruiter.companyId || recruiter.companyId !== application.job.companyId) {
        throw new AppError("You can only schedule interviews for your own company jobs.", 403);
    }

    const interview = await prisma.interview.create({
        data: {
            applicationId: payload.applicationId,
            scheduledAt: new Date(payload.scheduledAt),
            mode: payload.mode,
            meetingLink: payload.meetingLink || null,
            location: payload.location || null,
            createdBy: recruiterId,
            status: "SCHEDULED",
        },
        include: {
            application: {
                select: {
                    id: true,
                    applicantId: true,
                    job: { select: { id: true, title: true } },
                },
            },
            createdByUser: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    await prisma.application.update({
        where: { id: payload.applicationId },
        data: { status: "INTERVIEW" },
    });

    // Notify applicant
    await notificationService.createNotification(
        application.applicantId,
        "Interview Scheduled",
        `Interview scheduled for \"${application.job.title}\" on ${new Date(payload.scheduledAt).toLocaleString()}.`
    );

    // Notify internal employees
    const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE", isActive: true },
        select: { id: true },
    });

    await notificationService.notifyInterviewScheduledForEmployees(
        employees.map((e) => e.id),
        application.job.title,
        application.applicant.name,
        new Date(payload.scheduledAt).toLocaleString()
    );

    // Simulated WhatsApp to applicant
    await sendWhatsAppMessage({
        triggeredBy: recruiterId,
        targetUserId: application.applicantId,
        message: `Interview scheduled for ${application.job.title} on ${new Date(payload.scheduledAt).toLocaleString()}`,
    });

    await prisma.activityLog.create({
        data: {
            userId: recruiterId,
            action: "SCHEDULE_INTERVIEW",
            entity: "Interview",
            entityId: interview.id,
            details: JSON.stringify({ applicationId: payload.applicationId }),
        },
    });

    return interview;
}

export async function getInterviewsByApplication(applicationId, user) {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            job: { select: { companyId: true } },
        },
    });

    if (!application) {
        throw new AppError("Application not found.", 404);
    }

    // Access control
    if (user.role === "APPLICANT" && application.applicantId !== user.id) {
        throw new AppError("Access denied.", 403);
    }

    if (user.role === "RECRUITER") {
        const recruiter = await prisma.user.findUnique({
            where: { id: user.id },
            select: { companyId: true },
        });

        if (!recruiter?.companyId || recruiter.companyId !== application.job.companyId) {
            throw new AppError("Access denied.", 403);
        }
    }

    return prisma.interview.findMany({
        where: { applicationId },
        include: {
            createdByUser: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { scheduledAt: "asc" },
    });
}

export async function updateInterview(interviewId, user, payload) {
    const interview = await prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
            application: {
                include: {
                    job: { select: { companyId: true, title: true } },
                },
            },
        },
    });

    if (!interview) {
        throw new AppError("Interview not found.", 404);
    }

    if (user.role !== "ADMIN") {
        if (user.role !== "RECRUITER") {
            throw new AppError("Only recruiters or admins can update interviews.", 403);
        }

        const recruiter = await prisma.user.findUnique({
            where: { id: user.id },
            select: { companyId: true },
        });

        if (!recruiter?.companyId || recruiter.companyId !== interview.application.job.companyId) {
            throw new AppError("Access denied.", 403);
        }
    }

    const updated = await prisma.interview.update({
        where: { id: interviewId },
        data: {
            ...(payload.scheduledAt && { scheduledAt: new Date(payload.scheduledAt) }),
            ...(payload.mode && { mode: payload.mode }),
            ...(Object.prototype.hasOwnProperty.call(payload, "meetingLink") && { meetingLink: payload.meetingLink }),
            ...(Object.prototype.hasOwnProperty.call(payload, "location") && { location: payload.location }),
            ...(payload.status && { status: payload.status }),
        },
    });

    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "UPDATE_INTERVIEW",
            entity: "Interview",
            entityId: interviewId,
            details: JSON.stringify(payload),
        },
    });

    return updated;
}
