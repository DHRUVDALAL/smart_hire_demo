/**
 * Job Routes
 * ============================================================
 * POST   /api/jobs              — Create a new job listing
 * GET    /api/jobs              — List jobs (with filters)
 * GET    /api/jobs/:id          — Get job details
 * PUT    /api/jobs/:id          — Update a job
 * DELETE /api/jobs/:id          — Close/delete a job
 * GET    /api/jobs/:id/applicants — View applicants for a job
 */

import { Router } from "express";
import {
    createJobHandler,
    getJobsHandler,
    getJobByIdHandler,
    updateJobHandler,
    deleteJobHandler,
    getJobApplicantsHandler,
} from "../controllers/jobController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate, createJobSchema, updateJobSchema } from "../utils/validators.js";

const router = Router();

// Public: browse jobs
router.get("/", getJobsHandler);
router.get("/:id", getJobByIdHandler);

// Protected: recruiter/admin job management
router.post(
    "/",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(createJobSchema),
    createJobHandler
);

router.put(
    "/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(updateJobSchema),
    updateJobHandler
);

router.delete(
    "/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    deleteJobHandler
);

// Protected: view applicants for a job
router.get(
    "/:id/applicants",
    authenticate,
    authorize("RECRUITER", "ADMIN", "HR", "EMPLOYEE"),
    getJobApplicantsHandler
);

export default router;
