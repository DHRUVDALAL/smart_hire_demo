/**
 * Review Routes
 * ============================================================
 * POST /api/reviews                  — Add interview feedback
 * GET  /api/reviews/:applicationId   — Get reviews for an application
 *
 * All routes require authentication.
 */

import { Router } from "express";
import {
    addReviewHandler,
    getReviewsHandler,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate, createReviewSchema } from "../utils/validators.js";

const router = Router();

// All review routes require authentication
router.use(authenticate);

// Employees/HR/Admin/Recruiter can add reviews
router.post(
    "/",
    authorize("EMPLOYEE", "HR", "ADMIN", "RECRUITER"),
    validate(createReviewSchema),
    addReviewHandler
);

// Employees/HR/Admin/Recruiter can view reviews for an application
router.get(
    "/:applicationId",
    authorize("EMPLOYEE", "HR", "ADMIN", "RECRUITER"),
    getReviewsHandler
);

export default router;
