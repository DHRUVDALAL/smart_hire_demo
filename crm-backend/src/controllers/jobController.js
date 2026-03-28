/**
 * Job Controller
 * ============================================================
 * Express request handlers for job management endpoints.
 * Delegates business logic to jobService.
 */

import * as jobService from "../services/jobService.js";

/**
 * POST /api/jobs
 * Create a new job listing.
 */
export async function createJobHandler(req, res, next) {
    try {
        const job = await jobService.createJob(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/jobs
 * List jobs with optional filters and pagination.
 */
export async function getJobsHandler(req, res, next) {
    try {
        const { status, companyId, search, page, limit } = req.query;

        const result = await jobService.getJobs({
            status,
            companyId,
            search,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
        });

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/jobs/:id
 * Get a single job by ID.
 */
export async function getJobByIdHandler(req, res, next) {
    try {
        const job = await jobService.getJobById(req.params.id);

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/jobs/:id
 * Update a job listing.
 */
export async function updateJobHandler(req, res, next) {
    try {
        const job = await jobService.updateJob(
            req.params.id,
            req.user.id,
            req.user.role,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/jobs/:id
 * Delete (close) a job listing.
 */
export async function deleteJobHandler(req, res, next) {
    try {
        const job = await jobService.deleteJob(
            req.params.id,
            req.user.id,
            req.user.role
        );

        res.status(200).json({
            success: true,
            message: "Job closed successfully",
            data: job,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/jobs/:id/applicants
 * Get all applicants for a specific job.
 */
export async function getJobApplicantsHandler(req, res, next) {
    try {
        const applicants = await jobService.getJobApplicants(
            req.params.id,
            req.user.id,
            req.user.role
        );

        res.status(200).json({
            success: true,
            data: applicants,
        });
    } catch (error) {
        next(error);
    }
}
