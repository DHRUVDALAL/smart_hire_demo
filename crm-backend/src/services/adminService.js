/**
 * Admin Service
 * ============================================================
 * Handles job approval workflow and admin-specific actions.
 */

import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";
import * as notificationService from "./notificationService.js";

export async function getPendingJobs() {
    return prisma.job.findMany({
        where: {
            status: { in: ["PENDING", "PENDING_APPROVAL"] },
        },
        include: {
            company: {
                select: { id: true, name: true, location: true },
            },
            _count: {
                select: { applications: true },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function approveJob(jobId, adminId) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            company: {
                select: { id: true, name: true },
            },
        },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    const updated = await prisma.job.update({
        where: { id: jobId },
        data: { status: "ACTIVE" },
        include: {
            company: {
                select: { id: true, name: true },
            },
        },
    });

    const recruiters = await prisma.user.findMany({
        where: {
            companyId: updated.companyId,
            role: "RECRUITER",
            isActive: true,
        },
        select: { id: true },
    });

    await notificationService.notifyJobApproved(
        recruiters.map((r) => r.id),
        updated.title
    );

    await prisma.activityLog.create({
        data: {
            userId: adminId,
            action: "APPROVE_JOB",
            entity: "Job",
            entityId: jobId,
            details: JSON.stringify({ previousStatus: job.status, newStatus: "ACTIVE" }),
        },
    });

    return updated;
}

export async function rejectJob(jobId, adminId, reason) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
    });

    if (!job) {
        throw new AppError("Job not found.", 404);
    }

    const updated = await prisma.job.update({
        where: { id: jobId },
        data: { status: "CLOSED" },
        include: {
            company: {
                select: { id: true, name: true },
            },
        },
    });

    const recruiters = await prisma.user.findMany({
        where: {
            companyId: updated.companyId,
            role: "RECRUITER",
            isActive: true,
        },
        select: { id: true },
    });

    for (const recruiter of recruiters) {
        await notificationService.createNotification(
            recruiter.id,
            "Job Rejected",
            `Your job \"${updated.title}\" was rejected.${reason ? ` Reason: ${reason}` : ""}`
        );
    }

    await prisma.activityLog.create({
        data: {
            userId: adminId,
            action: "REJECT_JOB",
            entity: "Job",
            entityId: jobId,
            details: JSON.stringify({ reason: reason || null }),
        },
    });

    return updated;
}

// ========== RECRUITER APPROVAL FUNCTIONS ==========

export async function getPendingRecruiters() {
    return prisma.recruiter.findMany({
        where: {
            isApproved: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            },
            company: {
                select: {
                    id: true,
                    name: true,
                    industry: true,
                    description: true,
                    location: true,
                    website: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function getAllRecruiters() {
    return prisma.recruiter.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    isActive: true,
                    createdAt: true,
                },
            },
            company: {
                select: {
                    id: true,
                    name: true,
                    industry: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function approveRecruiter(recruiterId, adminId) {
    const recruiter = await prisma.recruiter.findUnique({
        where: { id: recruiterId },
        include: { user: true, company: true },
    });

    if (!recruiter) {
        throw new AppError("Recruiter not found.", 404);
    }

    const updated = await prisma.recruiter.update({
        where: { id: recruiterId },
        data: { isApproved: true, verified: true },
        include: {
            user: { select: { id: true, name: true, email: true } },
            company: { select: { name: true } },
        },
    });

    await notificationService.createNotification(
        recruiter.userId,
        "Account Approved",
        `Your company "${recruiter.company.name}" has been approved. You can now post jobs.`
    );

    await prisma.activityLog.create({
        data: {
            userId: adminId,
            action: "APPROVE_RECRUITER",
            entity: "Recruiter",
            entityId: recruiterId,
            details: JSON.stringify({ companyName: recruiter.company.name }),
        },
    });

    return updated;
}

export async function rejectRecruiter(recruiterId, adminId, reason) {
    const recruiter = await prisma.recruiter.findUnique({
        where: { id: recruiterId },
        include: { user: true, company: true },
    });

    if (!recruiter) {
        throw new AppError("Recruiter not found.", 404);
    }

    await notificationService.createNotification(
        recruiter.userId,
        "Account Rejected",
        `Your company registration was rejected.${reason ? ` Reason: ${reason}` : ""}`
    );

    await prisma.activityLog.create({
        data: {
            userId: adminId,
            action: "REJECT_RECRUITER",
            entity: "Recruiter",
            entityId: recruiterId,
            details: JSON.stringify({ reason: reason || null }),
        },
    });

    return recruiter;
}

// ========== EMPLOYEE APPROVAL FUNCTIONS ==========

export async function getPendingEmployees() {
    return prisma.employee.findMany({
        where: {
            isApproved: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function getAllEmployees() {
    return prisma.employee.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    isActive: true,
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function approveEmployee(employeeId, adminId) {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: { user: true },
    });

    if (!employee) {
        throw new AppError("Employee not found.", 404);
    }

    const updated = await prisma.employee.update({
        where: { id: employeeId },
        data: { isApproved: true },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });

    await notificationService.createNotification(
        employee.userId,
        "Account Approved",
        "Your employee account has been approved. You can now access candidate screening."
    );

    await prisma.activityLog.create({
        data: {
            userId: adminId,
            action: "APPROVE_EMPLOYEE",
            entity: "Employee",
            entityId: employeeId,
            details: JSON.stringify({ employeeName: employee.user.name }),
        },
    });

    return updated;
}

export async function rejectEmployee(employeeId, adminId, reason) {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: { user: true },
    });

    if (!employee) {
        throw new AppError("Employee not found.", 404);
    }

    await notificationService.createNotification(
        employee.userId,
        "Account Rejected",
        `Your employee account registration was rejected.${reason ? ` Reason: ${reason}` : ""}`
    );

    await prisma.activityLog.create({
        data: {
            userId: adminId,
            action: "REJECT_EMPLOYEE",
            entity: "Employee",
            entityId: employeeId,
            details: JSON.stringify({ reason: reason || null }),
        },
    });

    return employee;
}

// ========== HIRING TREND FUNCTION ==========

export async function getHiringTrend() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const hiredApplications = await prisma.application.findMany({
        where: {
            status: { in: ["ACCEPTED", "HIRED"] },
            updatedAt: { gte: sixMonthsAgo },
        },
        select: {
            updatedAt: true,
        },
    });

    // Group by month
    const monthCounts = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthCounts[key] = { month: monthNames[date.getMonth()], year: date.getFullYear(), hires: 0 };
    }

    // Count hires per month
    hiredApplications.forEach((app) => {
        const date = new Date(app.updatedAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (monthCounts[key]) {
            monthCounts[key].hires++;
        }
    });

    return Object.values(monthCounts);
}
