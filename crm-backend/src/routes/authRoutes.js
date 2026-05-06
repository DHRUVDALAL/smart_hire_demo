/**
 * Auth Routes
 * ============================================================
 * POST /api/auth/register  — Create a new user account
 * POST /api/auth/login     — Authenticate and receive JWT
 */

import express from "express";
import { registerHandler, loginHandler, getMeHandler } from "../controllers/authController.js";
import { validate, registerSchema, loginSchema } from "../utils/validators.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);
router.get("/me", authenticate, getMeHandler);

export default router;
