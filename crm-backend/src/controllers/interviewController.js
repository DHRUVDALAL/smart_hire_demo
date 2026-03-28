/**
 * Interview Controller
 * ============================================================
 * Handles interview scheduling endpoints.
 */

import * as interviewService from "../services/interviewService.js";

export async function scheduleInterviewHandler(req, res, next) {
    try {
        const data = await interviewService.scheduleInterview(req.user.id, req.body);
        res.status(201).json({ success: true, message: "Interview scheduled.", data });
    } catch (error) {
        next(error);
    }
}

export async function getInterviewsHandler(req, res, next) {
    try {
        const data = await interviewService.getInterviewsByApplication(req.params.applicationId, req.user);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

export async function updateInterviewHandler(req, res, next) {
    try {
        const data = await interviewService.updateInterview(req.params.id, req.user, req.body);
        res.status(200).json({ success: true, message: "Interview updated.", data });
    } catch (error) {
        next(error);
    }
}
