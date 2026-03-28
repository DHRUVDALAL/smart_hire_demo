/**
 * Review Controller
 * ============================================================
 * Express request handlers for interview feedback/review endpoints.
 * Delegates business logic to reviewService.
 */

import * as reviewService from "../services/reviewService.js";

/**
 * POST /api/reviews
 * Add interview feedback for an application.
 */
export async function addReviewHandler(req, res, next) {
    try {
        const review = await reviewService.addReview(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: review,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/reviews/:applicationId
 * Get all reviews for a specific application.
 */
export async function getReviewsHandler(req, res, next) {
    try {
        const reviews = await reviewService.getReviewsByApplication(
            req.params.applicationId
        );

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        next(error);
    }
}
