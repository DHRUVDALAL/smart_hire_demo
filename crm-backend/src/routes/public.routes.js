import { Router } from "express";
import { getPublicJobsHandler, getPublicJobByIdHandler } from "../controllers/jobController.js";

const router = Router();

router.get("/jobs", getPublicJobsHandler);
router.get("/jobs/:id", getPublicJobByIdHandler);

export default router;
