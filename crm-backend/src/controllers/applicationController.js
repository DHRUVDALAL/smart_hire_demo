/**
 * Application Controller
 * ============================================================
 * Express request handlers for job application endpoints.
 * Delegates business logic to applicationService.
 */

import * as applicationService from "../services/applicationService.js";

/**
 * POST /api/applications
 * Apply to a job.
 */
export async function applyHandler(req, res, next) {
    try {
        const application = await applicationService.applyToJob(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/applications/my
 * Get all applications for the authenticated applicant.
 */
export async function getMyApplicationsHandler(req, res, next) {
    try {
        const applications = await applicationService.getMyApplications(
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/applications/:id
 * Get a single application by ID.
 */
export async function getApplicationByIdHandler(req, res, next) {
    try {
        const application = await applicationService.getApplicationById(
            req.params.id,
            req.user.id,
            req.user.role
        );

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/applications
 * Role-based list of applications.
 */
export async function listApplicationsHandler(req, res, next) {
    try {
        const { status } = req.query;
        const data = await applicationService.listApplications(
            req.user.id,
            req.user.role,
            { status }
        );

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/applications/:id/status
 * Update application status with role-based transition rules.
 */
export async function updateApplicationStatusHandler(req, res, next) {
    try {
        const data = await applicationService.updateApplicationStatus(
            req.params.id,
            req.user.id,
            req.user.role,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
}
