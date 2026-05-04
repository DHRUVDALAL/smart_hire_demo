/**
 * Profile Service
 * ============================================================
 * Business logic for fetching and updating the
 * authenticated user's profile.
 */

import prisma from "../utils/prisma.js";
import { AppError } from "../middleware/errorHandler.js";

/**
 * Get the profile of the currently authenticated user.
 * Includes related data based on role.
 *
 * @param {string} userId - The authenticated user's ID.
 * @returns {Promise<object>} The user profile.
 */
export async function getProfile(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            avatar: true,
            bio: true,
            address: true,
            department: true,
            experienceYears: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    website: true,
                    industry: true,
                    logo: true,
                    description: true,
                    location: true,
                    size: true,
                },
            },
            employee: {
                select: {
                    id: true,
                    department: true,
                    position: true,
                    experience: true,
                    specialization: true,
                    skills: true,
                    isActive: true,
                    isApproved: true,
                    joinedAt: true,
                },
            },
            recruiter: {
                select: {
                    id: true,
                    designation: true,
                    verified: true,
                    isApproved: true,
                    companyId: true,
                },
            },
            applicant: {
                select: {
                    id: true,
                    education: true,
                    experienceYears: true,
                    skills: true,
                    resumeUrl: true,
                    portfolio: true,
                    address: true,
                    profilePhoto: true,
                    alternatePhone: true,
                    designation: true,
                },
            },
            _count: {
                select: {
                    applications: true,
                    activityLogs: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    // Flatten applicant data into the response for easier frontend access
    const profile = {
        ...user,
        // Include applicant-specific fields at top level for convenience
        skills: user.applicant?.skills || user.employee?.skills || [],
        experience: user.applicant?.experienceYears ?? user.employee?.experience ?? user.experienceYears,
        resumeUrl: user.applicant?.resumeUrl,
        education: user.applicant?.education,
        portfolio: user.applicant?.portfolio,
        alternatePhone: user.applicant?.alternatePhone,
        designation: user.applicant?.designation,
        // Include employee-specific fields at top level
        department: user.employee?.department ?? user.department,
        position: user.employee?.position,
        specialization: user.employee?.specialization,
        // Include approval status for role-based access control
        isApproved: user.recruiter?.isApproved ?? user.employee?.isApproved ?? true,
    };

    return profile;
}

/**
 * Update the profile of the currently authenticated user.
 *
 * @param {string} userId - The authenticated user's ID.
 * @param {object} data - Validated update data.
 * @returns {Promise<object>} The updated user profile.
 */
export async function updateProfile(userId, data) {
    // Ensure user exists
    const existing = await prisma.user.findUnique({
        where: { id: userId },
        include: { applicant: true, employee: true, recruiter: true },
    });

    if (!existing) {
        throw new AppError("User not found.", 404);
    }

    // Separate user fields from role-specific fields
    const {
        skills,
        experience,
        education,
        portfolio,
        designation,
        alternatePhone,
        department,
        position,
        specialization,
        companyName,
        industry,
        companySize,
        companyDescription,
        companyAddress,
        city,
        country,
        ...userFields
    } = data;

    // Filter userFields to only include fields that exist in the User model
    const validUserFields = {};
    const allowedUserFields = ['name', 'phone', 'bio', 'address', 'avatar', 'profilePicture'];
    
    // Admin users can also update department and experienceYears directly on User model
    if (existing.role === 'ADMIN') {
        allowedUserFields.push('department', 'experienceYears');
        // Map 'experience' to 'experienceYears' for admin
        if (experience !== undefined) {
            validUserFields.experienceYears = experience;
        }
    }
    
    for (const field of allowedUserFields) {
        if (userFields[field] !== undefined) {
            validUserFields[field] = userFields[field];
        }
    }

    // Update user fields
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: validUserFields,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            avatar: true,
            bio: true,
            address: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // Update applicant fields if user is an applicant
    if (existing.role === "APPLICANT") {
        const applicantData = {};
        if (skills !== undefined) applicantData.skills = skills || [];
        if (experience !== undefined) applicantData.experienceYears = experience;
        if (education !== undefined) applicantData.education = education;
        if (portfolio !== undefined) applicantData.portfolio = portfolio;
        if (alternatePhone !== undefined) applicantData.alternatePhone = alternatePhone;
        if (designation !== undefined) applicantData.designation = designation;

        if (Object.keys(applicantData).length > 0) {
            if (existing.applicant) {
                // Update existing applicant record
                await prisma.applicant.update({
                    where: { userId },
                    data: applicantData,
                });
            } else {
                // Create applicant record if it doesn't exist
                await prisma.applicant.create({
                    data: {
                        userId,
                        ...applicantData,
                    },
                });
            }
        }
    }

    // Update employee fields if user is an employee
    if (existing.role === "EMPLOYEE") {
        const employeeData = {};
        if (skills !== undefined) employeeData.skills = skills || [];
        if (experience !== undefined) employeeData.experience = experience;
        if (department !== undefined) employeeData.department = department;
        if (position !== undefined) employeeData.position = position;
        if (specialization !== undefined) employeeData.specialization = specialization;

        if (Object.keys(employeeData).length > 0) {
            if (existing.employee) {
                // Update existing employee record
                await prisma.employee.update({
                    where: { userId },
                    data: employeeData,
                });
            } else {
                // Create employee record if it doesn't exist
                await prisma.employee.create({
                    data: {
                        userId,
                        ...employeeData,
                    },
                });
            }
        }
    }

    // Update recruiter/company fields if user is a recruiter
    if (existing.role === "RECRUITER" && existing.recruiter?.companyId) {
        const companyData = {};
        if (companyName !== undefined) companyData.name = companyName;
        if (industry !== undefined) companyData.industry = industry;
        if (companySize !== undefined) companyData.size = companySize;
        if (companyDescription !== undefined) companyData.description = companyDescription;

        if (companyAddress !== undefined || city !== undefined || country !== undefined) {
            const parts = [companyAddress, city, country]
                .map(v => (typeof v === "string" ? v.trim() : ""))
                .filter(Boolean);
            companyData.location = parts.length ? parts.join(", ") : null;
        }

        if (Object.keys(companyData).length > 0) {
            await prisma.company.update({
                where: { id: existing.recruiter.companyId },
                data: companyData,
            });
        }
    }

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId,
            action: "UPDATE_PROFILE",
            entity: "User",
            entityId: userId,
            details: JSON.stringify(Object.keys(data)),
        },
    });

    return updatedUser;
}

/**
 * Update the resume URL for an applicant.
 *
 * @param {string} userId - The authenticated user's ID.
 * @param {string} resumeUrl - The URL/path to the uploaded resume.
 * @returns {Promise<object>} The updated applicant record.
 */
export async function updateResumeUrl(userId, resumeUrl) {
    // Ensure user exists and is an applicant
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { applicant: true },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    if (user.role !== "APPLICANT") {
        throw new AppError("Only applicants can upload resumes.", 403);
    }

    // Create applicant record if it doesn't exist
    if (!user.applicant) {
        await prisma.applicant.create({
            data: {
                userId,
                resumeUrl,
            },
        });
    } else {
        // Update existing applicant record
        await prisma.applicant.update({
            where: { userId },
            data: { resumeUrl },
        });
    }

    // Log the activity
    await prisma.activityLog.create({
        data: {
            userId,
            action: "UPLOAD_RESUME",
            entity: "Applicant",
            entityId: userId,
            details: JSON.stringify({ resumeUrl }),
        },
    });

    return { resumeUrl };
}
