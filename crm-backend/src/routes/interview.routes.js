/**
 * Interview Routes
 * ============================================================
 * POST /api/interviews                  — Schedule interview (recruiter only)
 * GET  /api/interviews/:applicationId   — List interviews for an application
 * PUT  /api/interviews/:id              — Update interview
 */

import { Router } from "express";
import {
    scheduleInterviewHandler,
    getInterviewsHandler,
    updateInterviewHandler,
} from "../controllers/interviewController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import {
    validate,
    createInterviewSchema,
    updateInterviewSchema,
} from "../utils/validators.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    authorize("RECRUITER"),
    validate(createInterviewSchema),
    scheduleInterviewHandler
);

router.get(
    "/:applicationId",
    authorize("RECRUITER", "APPLICANT", "EMPLOYEE", "HR", "ADMIN"),
    getInterviewsHandler
);

router.put(
    "/:id",
    authorize("RECRUITER", "ADMIN"),
    validate(updateInterviewSchema),
    updateInterviewHandler
);

export default router;
