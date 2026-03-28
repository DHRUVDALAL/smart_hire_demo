/**
 * Application Routes
 * ============================================================
 * POST /api/applications       — Apply to a job
 * GET  /api/applications/my    — Get my applications (applicant)
 * GET  /api/applications/:id   — Get application details
 *
 * All routes require authentication.
 */

import { Router } from "express";
import {
    applyHandler,
    getMyApplicationsHandler,
    getApplicationByIdHandler,
    listApplicationsHandler,
    updateApplicationStatusHandler,
} from "../controllers/applicationController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import {
    validate,
    createApplicationSchema,
    updateApplicationStatusSchema,
} from "../utils/validators.js";

const router = Router();

// All application routes require authentication
router.use(authenticate);

// Applicant: submit an application
router.post(
    "/",
    authorize("APPLICANT"),
    validate(createApplicationSchema),
    applyHandler
);

// Applicant: view own applications
router.get(
    "/my",
    authorize("APPLICANT"),
    getMyApplicationsHandler
);

router.get(
    "/",
    authorize("RECRUITER", "ADMIN", "HR", "EMPLOYEE"),
    listApplicationsHandler
);

router.put(
    "/:id/status",
    authorize("RECRUITER", "ADMIN", "HR", "EMPLOYEE"),
    validate(updateApplicationStatusSchema),
    updateApplicationStatusHandler
);

// Any authenticated user can view an application (service-level access control)
router.get("/:id", getApplicationByIdHandler);

export default router;
