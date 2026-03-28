/**
 * Admin Controller
 * ============================================================
 * Handles admin-only approval workflow endpoints.
 */

import * as adminService from "../services/adminService.js";

export async function getPendingJobsHandler(_req, res, next) {
    try {
        const data = await adminService.getPendingJobs();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function approveJobHandler(req, res, next) {
    try {
        const data = await adminService.approveJob(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Job approved.", data });
    } catch (error) {
        next(error);
    }
}

export async function rejectJobHandler(req, res, next) {
    try {
        const data = await adminService.rejectJob(req.params.id, req.user.id, req.body?.reason);
        res.status(200).json({ success: true, message: "Job rejected.", data });
    } catch (error) {
        next(error);
    }
}

// ========== RECRUITER HANDLERS ==========

export async function getPendingRecruitersHandler(_req, res, next) {
    try {
        const data = await adminService.getPendingRecruiters();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getAllRecruitersHandler(_req, res, next) {
    try {
        const data = await adminService.getAllRecruiters();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function approveRecruiterHandler(req, res, next) {
    try {
        const data = await adminService.approveRecruiter(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Recruiter approved.", data });
    } catch (error) {
        next(error);
    }
}

export async function rejectRecruiterHandler(req, res, next) {
    try {
        const data = await adminService.rejectRecruiter(req.params.id, req.user.id, req.body?.reason);
        res.status(200).json({ success: true, message: "Recruiter rejected.", data });
    } catch (error) {
        next(error);
    }
}

// ========== EMPLOYEE HANDLERS ==========

export async function getPendingEmployeesHandler(_req, res, next) {
    try {
        const data = await adminService.getPendingEmployees();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function getAllEmployeesHandler(_req, res, next) {
    try {
        const data = await adminService.getAllEmployees();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function approveEmployeeHandler(req, res, next) {
    try {
        const data = await adminService.approveEmployee(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Employee approved.", data });
    } catch (error) {
        next(error);
    }
}

export async function rejectEmployeeHandler(req, res, next) {
    try {
        const data = await adminService.rejectEmployee(req.params.id, req.user.id, req.body?.reason);
        res.status(200).json({ success: true, message: "Employee rejected.", data });
    } catch (error) {
        next(error);
    }
}

// ========== HIRING TREND HANDLER ==========

export async function getHiringTrendHandler(_req, res, next) {
    try {
        const data = await adminService.getHiringTrend();
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}
