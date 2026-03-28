/**
 * Profile Controller
 * ============================================================
 * Express request handlers for profile endpoints.
 * Delegates business logic to profileService.
 */

import * as profileService from "../services/profileService.js";

/**
 * GET /api/profile
 * Get the authenticated user's profile.
 */
export async function getProfileHandler(req, res, next) {
    try {
        const profile = await profileService.getProfile(req.user.id);

        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/profile
 * Update the authenticated user's profile.
 */
export async function updateProfileHandler(req, res, next) {
    try {
        const updatedProfile = await profileService.updateProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/profile/resume
 * Upload a resume file for the authenticated user.
 */
export async function uploadResumeHandler(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Create the URL path for the uploaded file
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;

        // Update the applicant's resume URL in the database
        const updatedProfile = await profileService.updateResumeUrl(req.user.id, resumeUrl);

        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            data: {
                resumeUrl,
                ...updatedProfile,
            },
        });
    } catch (error) {
        next(error);
    }
}
