/**
 * Admin Routes
 * ============================================================
 * Job approval, recruiter approval, employee approval endpoints
 */

import { Router } from "express";
import {
    getPendingJobsHandler,
    approveJobHandler,
    rejectJobHandler,
    getPendingRecruitersHandler,
    getAllRecruitersHandler,
    approveRecruiterHandler,
    rejectRecruiterHandler,
    getPendingEmployeesHandler,
    getAllEmployeesHandler,
    approveEmployeeHandler,
    rejectEmployeeHandler,
    getHiringTrendHandler,
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate, rejectJobSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

// Job approval routes
router.get("/jobs/pending", getPendingJobsHandler);
router.put("/jobs/:id/approve", approveJobHandler);
router.put("/jobs/:id/reject", validate(rejectJobSchema), rejectJobHandler);

// Recruiter approval routes
router.get("/recruiters/pending", getPendingRecruitersHandler);
router.get("/recruiters", getAllRecruitersHandler);
router.put("/recruiters/:id/approve", approveRecruiterHandler);
router.put("/recruiters/:id/reject", rejectRecruiterHandler);

// Employee approval routes
router.get("/employees/pending", getPendingEmployeesHandler);
router.get("/employees", getAllEmployeesHandler);
router.put("/employees/:id/approve", approveEmployeeHandler);
router.put("/employees/:id/reject", rejectEmployeeHandler);

// Analytics routes
router.get("/hiring-trend", getHiringTrendHandler);

export default router;
