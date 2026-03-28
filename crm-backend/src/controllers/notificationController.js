/**
 * Notification Controller
 * ============================================================
 * Handles notification retrieval and read acknowledgement.
 */

import * as notificationService from "../services/notificationService.js";

export async function getNotificationsHandler(req, res, next) {
    try {
        const unreadOnly = req.query.unread === "true";
        const data = await notificationService.getUserNotifications(req.user.id, unreadOnly);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function markNotificationReadHandler(req, res, next) {
    try {
        const data = await notificationService.markAsRead(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Notification marked as read.", data });
    } catch (error) {
        next(error);
    }
}
