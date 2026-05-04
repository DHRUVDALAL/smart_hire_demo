/**
 * Email Service
 * ============================================================
 * Centralized, safe email utility for notifications.
 * - Uses Nodemailer + Gmail (App Password)
 * - Never throws to callers (email failure must not break APIs)
 */

import nodemailer from "nodemailer";

function isEmailEnabled() {
    return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

function getFromAddress() {
    const fromEmail = process.env.EMAIL_USER;
    return fromEmail ? `Recruitment Portal <${fromEmail}>` : "Recruitment Portal";
}

let cachedTransporter = null;

function getTransporter() {
    if (!isEmailEnabled()) return null;
    if (cachedTransporter) return cachedTransporter;

    cachedTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    return cachedTransporter;
}

export async function sendEmail(to, subject, html) {
    try {
        const transporter = getTransporter();
        if (!transporter) return false;
        if (!to) return false;

        await transporter.sendMail({
            from: getFromAddress(),
            to,
            subject,
            html,
        });

        return true;
    } catch (err) {
        console.error("Email sending failed:", err?.message || err);
        return false;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function layout(title, bodyHtml) {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2 style="margin: 0 0 12px 0;">${escapeHtml(title)}</h2>
        ${bodyHtml}
        <hr style="margin: 18px 0; border: none; border-top: 1px solid #eee;" />
        <p style="margin: 0; color: #555; font-size: 13px;">Best Regards,<br/>Recruitment Team</p>
      </div>
    `;
}

export const templates = {
    applicationSubmitted(name, jobTitle) {
        return layout(
            "Application Submitted",
            `
            <p>Hello ${escapeHtml(name)},</p>
            <p>Your application for <b>${escapeHtml(jobTitle)}</b> has been successfully submitted.</p>
            <p>Our recruitment team will review your profile.</p>
          `
        );
    },

    applicationApproved(name, jobTitle) {
        return layout(
            "Application Approved",
            `
            <p>Hello ${escapeHtml(name)},</p>
            <p>Your application for <b>${escapeHtml(jobTitle)}</b> has been approved.</p>
            <p>The recruiter may contact you soon for the interview.</p>
          `
        );
    },

    applicationRejected(name, jobTitle) {
        return layout(
            "Application Update",
            `
            <p>Hello ${escapeHtml(name)},</p>
            <p>Thank you for applying for <b>${escapeHtml(jobTitle)}</b>.</p>
            <p>Unfortunately we are moving forward with other candidates.</p>
          `
        );
    },

    interviewScheduled(name, jobTitle, date, time, meetingLink, location) {
        const linkHtml = meetingLink
            ? `<p>Meeting Link: <a href="${escapeHtml(meetingLink)}">${escapeHtml(meetingLink)}</a></p>`
            : "";
        const locationHtml = location ? `<p>Location: ${escapeHtml(location)}</p>` : "";

        return layout(
            "Interview Scheduled",
            `
            <p>Hello ${escapeHtml(name)},</p>
            <p>Your interview for <b>${escapeHtml(jobTitle)}</b> has been scheduled.</p>
            <p>Date: ${escapeHtml(date)}</p>
            <p>Time: ${escapeHtml(time)}</p>
            ${linkHtml}
            ${locationHtml}
          `
        );
    },

    recruiterProfileApproved(name) {
        return layout(
            "Recruiter Profile Approved",
            `
            <p>Hello ${escapeHtml(name)},</p>
            <p>Your recruiter profile has been approved.</p>
            <p>You can now start posting jobs on the platform.</p>
          `
        );
    },

    jobPostingApproved(recruiterName, jobTitle) {
        return layout(
            "Job Posting Approved",
            `
            <p>Hello ${escapeHtml(recruiterName)},</p>
            <p>Your job posting <b>“${escapeHtml(jobTitle)}”</b> has been approved and is now live on the platform.</p>
          `
        );
    },

    jobPostingOnHold(recruiterName, jobTitle) {
        return layout(
            "Job Posting On Hold",
            `
            <p>Hello ${escapeHtml(recruiterName)},</p>
            <p>Your job posting <b>“${escapeHtml(jobTitle)}”</b> has been temporarily placed on hold by the admin.</p>
            <p>Please contact support for details.</p>
          `
        );
    },

    newRecruiterSignupAdmin(recruiterName, companyName, email) {
        return layout(
            "New Recruiter Registration",
            `
            <p>A new recruiter has registered and submitted their profile for approval.</p>
            <p><b>Recruiter Name:</b> ${escapeHtml(recruiterName)}</p>
            <p><b>Company Name:</b> ${escapeHtml(companyName)}</p>
            <p><b>Email:</b> ${escapeHtml(email)}</p>
          `
        );
    },

    newJobPosted(jobTitle) {
        return layout(
            "New Job Posted",
            `
            <p>Hello,</p>
            <p>A new job <b>“${escapeHtml(jobTitle)}”</b> has been posted.</p>
            <p>Visit the portal to apply.</p>
          `
        );
    },
};
