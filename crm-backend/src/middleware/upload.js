/**
 * File Upload Middleware
 * ============================================================
 * Configures multer for handling file uploads.
 */

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads/resumes");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename: userId_timestamp_originalname
        const userId = req.user?.id || "unknown";
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
        const filename = `${userId}_${timestamp}_${basename}${ext}`;
        cb(null, filename);
    },
});

// File filter for resume uploads
const resumeFileFilter = (_req, file, cb) => {
    const allowedMimes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and Word documents are allowed"), false);
    }
};

// Resume upload middleware (single file, max 5MB)
export const uploadResume = multer({
    storage,
    fileFilter: resumeFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).single("resume");

// Error handler wrapper
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size must be less than 5MB",
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "File upload failed",
        });
    }
    next();
};
