/**
 * Notification Routes
 * ============================================================
 * GET /api/notifications
 * PUT /api/notifications/:id/read
 */

import { Router } from "express";
import {
    getNotificationsHandler,
    markNotificationReadHandler,
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", getNotificationsHandler);
router.put("/:id/read", markNotificationReadHandler);

export default router;
