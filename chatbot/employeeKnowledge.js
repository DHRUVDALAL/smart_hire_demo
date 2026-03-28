/**
 * SmartHire Employee Portal Knowledge Base
 * ============================================================
 * 50 knowledge entries for employee screening-specific questions.
 */

const employeeKnowledge = [
  // ==================== SCREENING PROCESS ====================
  {
    keywords: ["screen candidates", "screening", "review candidates", "candidate review"],
    answer: "Go to 'Candidate Screening' in the navigation. View all applications awaiting review. Click any to see details and take action."
  },
  {
    keywords: ["screening workflow", "how screening works", "screening process"],
    answer: "Workflow: View application → Review profile & resume → Evaluate skills → Make decision (Approve/Reject/Hold). Simple and efficient."
  },
  {
    keywords: ["candidate list", "view candidates", "pending candidates"],
    answer: "Candidate Screening shows all applications pending review. Filter by job, status, or date. Click to review each one."
  },
  {
    keywords: ["filter candidates", "search candidates", "find applicant"],
    answer: "Use filters: by job title, application date, skills, or status. Sort columns by clicking headers. Find candidates quickly."
  },
  {
    keywords: ["candidate profile", "view applicant", "applicant details"],
    answer: "Click any candidate to view full profile: contact info, resume, skills, experience, education, and cover letter."
  },
  {
    keywords: ["view resume", "see resume", "download resume"],
    answer: "In candidate profile, click on the resume to view or download. Review carefully before making screening decisions."
  },
  {
    keywords: ["candidate skills", "check skills", "skill match"],
    answer: "Candidate skills are listed in their profile. Compare with job requirements to assess fit. Skills help quick evaluation."
  },
  {
    keywords: ["candidate experience", "work history", "background check"],
    answer: "Review candidate's work experience in their profile. Check relevance to the role, tenure, and achievements."
  },

  // ==================== SCREENING ACTIONS ====================
  {
    keywords: ["approve candidate", "accept candidate", "shortlist candidate"],
    answer: "Click 'Approve' on a candidate you want to shortlist. They move forward to recruiter for interview scheduling."
  },
  {
    keywords: ["reject candidate", "decline candidate", "reject applicant"],
    answer: "Click 'Reject' if candidate doesn't meet requirements. Optionally add reason. They're notified and removed from pipeline."
  },
  {
    keywords: ["hold candidate", "maybe candidate", "save for later"],
    answer: "Click 'Hold' to keep candidate for later consideration. They stay in system without approval or rejection."
  },
  {
    keywords: ["blacklist candidate", "block candidate", "ban applicant"],
    answer: "Blacklist permanently blocks a candidate from future applications. Use only for serious issues like fraud. Be cautious."
  },
  {
    keywords: ["add notes", "screening notes", "candidate notes"],
    answer: "Add notes during screening to share observations with your team. Notes help track feedback and decisions."
  },
  {
    keywords: ["screening criteria", "what to check", "evaluation points"],
    answer: "Check: skills match, relevant experience, education, communication quality in cover letter, and overall fit for role."
  },
  {
    keywords: ["bulk actions", "multiple candidates", "batch screening"],
    answer: "Select multiple candidates using checkboxes. Use bulk actions for common decisions. Saves time with many applications."
  },
  {
    keywords: ["undo decision", "change decision", "reverse action"],
    answer: "Contact admin to reverse a screening decision if needed. Otherwise, decisions are final once submitted."
  },

  // ==================== SHORTLIST MANAGEMENT ====================
  {
    keywords: ["shortlist", "shortlist manager", "manage shortlist"],
    answer: "Go to 'Shortlist Manager' to set limits on how many candidates to shortlist per job. View all shortlisted candidates."
  },
  {
    keywords: ["shortlist limit", "max candidates", "candidate limit"],
    answer: "Set shortlist limits per job to manage pipeline size. Once reached, new approvals go to 'Hold' until spots open."
  },
  {
    keywords: ["view shortlisted", "approved list", "selected candidates"],
    answer: "Shortlist Manager shows all approved candidates by job. These are ready for recruiter to schedule interviews."
  },
  {
    keywords: ["remove from shortlist", "unshortlist", "cancel approval"],
    answer: "Contact recruiter or admin to remove candidates from shortlist. Or change status if you have permissions."
  },
  {
    keywords: ["shortlist full", "limit reached", "no more approvals"],
    answer: "When shortlist limit is reached, approve carefully. Consider rejecting less qualified or moving others to Hold."
  },

  // ==================== APPLICATION PIPELINE ====================
  {
    keywords: ["pipeline", "application flow", "candidate stages"],
    answer: "Pipeline: Applied → Screening (you) → Approved → Interview → Offer. You handle the screening stage."
  },
  {
    keywords: ["pending review", "unreviewed", "new applications"],
    answer: "New applications appear as 'Pending Review' in your screening list. Review and decide on each one."
  },
  {
    keywords: ["application status", "status meaning", "what status means"],
    answer: "Pending = awaiting review, Approved = shortlisted, Rejected = declined, Hold = considering later."
  },
  {
    keywords: ["after approval", "approved then what", "next steps"],
    answer: "After you approve, recruiter is notified. They schedule interviews with shortlisted candidates. Your part is done."
  },

  // ==================== DASHBOARD ====================
  {
    keywords: ["dashboard", "home page", "overview"],
    answer: "Dashboard shows: applications to review, approved count, rejected count, and screening activity. Your quick summary."
  },
  {
    keywords: ["dashboard stats", "my numbers", "screening metrics"],
    answer: "View: Total Reviewed, Approved, Rejected, On Hold. Track your screening efficiency and volume."
  },
  {
    keywords: ["recent activity", "latest actions", "screening history"],
    answer: "Dashboard shows recent screening activity. See your latest decisions and pending applications."
  },
  {
    keywords: ["charts", "analytics", "statistics"],
    answer: "Dashboard charts show: Applications by Job, Screening Decisions, and trends. Visual tracking of workload."
  },

  // ==================== JOBS ====================
  {
    keywords: ["view jobs", "job list", "available jobs"],
    answer: "See jobs assigned for screening in your dashboard or filter by job in Candidate Screening page."
  },
  {
    keywords: ["job details", "job requirements", "what job needs"],
    answer: "Click on job title in screening to view requirements. Use this to evaluate if candidates match the role."
  },
  {
    keywords: ["assigned jobs", "my jobs", "jobs to screen"],
    answer: "You screen applications for jobs assigned to your department. Contact admin if you need access to other jobs."
  },

  // ==================== PROFILE & ACCOUNT ====================
  {
    keywords: ["employee profile", "my profile", "update profile"],
    answer: "Click 'Profile' to update your details: name, email, phone, department, and skills. Complete for approval."
  },
  {
    keywords: ["account approval", "employee approval", "get approved"],
    answer: "Complete your profile first. Admin reviews and approves. Once approved, access screening and shortlist features."
  },
  {
    keywords: ["pending approval", "waiting approval", "not approved yet"],
    answer: "Your profile is under admin review. Ensure it's complete. Contact admin if it takes too long."
  },
  {
    keywords: ["department", "my department", "change department"],
    answer: "Your department is set in your profile. It determines which jobs you screen. Contact admin to change."
  },

  // ==================== NOTIFICATIONS ====================
  {
    keywords: ["notifications", "alerts", "updates"],
    answer: "Click bell icon for notifications: new applications to screen, approval updates, and system alerts."
  },
  {
    keywords: ["new applications alert", "application notification", "pending alert"],
    answer: "You receive notifications when new applications need screening. Check regularly to review promptly."
  },

  // ==================== COLLABORATION ====================
  {
    keywords: ["team screening", "collaborate", "share with team"],
    answer: "Notes you add are visible to your team. Coordinate screening decisions through notes and activity logs."
  },
  {
    keywords: ["who screened", "screening history", "audit trail"],
    answer: "Activity logs show who screened each candidate and when. Full audit trail for accountability."
  },

  // ==================== HELP ====================
  {
    keywords: ["help", "support", "assistance"],
    answer: "Need help? Use this assistant, check Help section, or contact admin. We support your screening work."
  },
  {
    keywords: ["hello", "hi", "hey", "greet"],
    answer: "Hello! 👋 I'm your Employee Assistant. Ask me about screening candidates, managing shortlists, or using the dashboard."
  },
  {
    keywords: ["thank", "thanks", "helpful"],
    answer: "You're welcome! Happy screening. Feel free to ask more questions anytime."
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    answer: "Goodbye! Best of luck finding great candidates. Come back if you need help! 🎯"
  },
  {
    keywords: ["logout", "sign out"],
    answer: "Click 'Logout' in the navigation to end your session securely. Always logout on shared devices."
  },
  {
    keywords: ["how many review", "daily quota", "screening volume"],
    answer: "There's no set quota. Review applications as they come in. Timely screening improves hiring speed."
  },
  {
    keywords: ["priority", "urgent applications", "review first"],
    answer: "Review older applications first to avoid delays. Check for priority flags if your company uses them."
  }
];

// Export for use with chatbot engine
if (typeof window !== 'undefined') {
  window.employeeKnowledge = employeeKnowledge;
}
