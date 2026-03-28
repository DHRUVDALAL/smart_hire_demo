/**
 * Profile Routes
 * ============================================================
 * GET  /api/profile        — Get authenticated user's profile
 * PUT  /api/profile        — Update authenticated user's profile
 * POST /api/profile/resume — Upload resume for applicant
 *
 * All routes require authentication.
 */

import { Router } from "express";
import { getProfileHandler, updateProfileHandler, uploadResumeHandler } from "../controllers/profileController.js";
import { authenticate } from "../middleware/auth.js";
import { validate, updateProfileSchema } from "../utils/validators.js";
import { uploadResume, handleUploadError } from "../middleware/upload.js";

const router = Router();

// All profile routes require authentication
router.use(authenticate);

router.get("/", getProfileHandler);
router.put("/", validate(updateProfileSchema), updateProfileHandler);
router.post("/resume", uploadResume, handleUploadError, uploadResumeHandler);

export default router;
