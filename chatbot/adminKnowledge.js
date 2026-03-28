/**
 * SmartHire Admin Portal Knowledge Base
 * ============================================================
 * 50 knowledge entries for admin-specific questions.
 */

const adminKnowledge = [
  // ==================== RECRUITER APPROVAL ====================
  {
    keywords: ["approve recruiter", "recruiter approval", "accept recruiter"],
    answer: "Go to 'Recruiters' page. Review recruiter profile details. Click 'Approve' to grant them access to post jobs."
  },
  {
    keywords: ["reject recruiter", "decline recruiter", "deny recruiter"],
    answer: "Click 'Reject' on a recruiter profile. They cannot post jobs until approved. You may add a rejection reason."
  },
  {
    keywords: ["pending recruiters", "recruiter requests", "new recruiters"],
    answer: "Recruiters page shows pending approvals. Review company details, verify legitimacy, then approve or reject."
  },
  {
    keywords: ["view recruiter", "recruiter profile", "recruiter details"],
    answer: "Click 'View Profile' on any recruiter card to see full details: company info, contact, and registration date."
  },
  {
    keywords: ["recruiter company", "company verification", "verify company"],
    answer: "Review company name, industry, size, and description. Verify legitimacy before approval. Protect platform quality."
  },
  {
    keywords: ["recruiter list", "all recruiters", "manage recruiters"],
    answer: "Recruiters page shows all registered recruiters. Filter by status: Pending, Approved, Rejected."
  },

  // ==================== EMPLOYEE APPROVAL ====================
  {
    keywords: ["approve employee", "employee approval", "accept employee"],
    answer: "Go to 'Employees' page. Review profile details. Click 'Approve' to grant screening access."
  },
  {
    keywords: ["reject employee", "decline employee", "deny employee"],
    answer: "Click 'Reject' on employee profile if not qualified. They cannot screen candidates until approved."
  },
  {
    keywords: ["pending employees", "employee requests", "new employees"],
    answer: "Employees page shows pending approvals. Review department, position, and qualifications before deciding."
  },
  {
    keywords: ["view employee", "employee profile", "employee details"],
    answer: "Click 'View Profile' on employee card to see full details: name, department, position, skills, and bio."
  },
  {
    keywords: ["employee list", "all employees", "manage employees"],
    answer: "Employees page shows all registered employees. Filter by status: Pending, Approved, Rejected."
  },
  {
    keywords: ["employee department", "department check", "verify department"],
    answer: "Verify employee's department and position match your organization structure before approving."
  },

  // ==================== JOB MANAGEMENT ====================
  {
    keywords: ["approve job", "job approval", "publish job"],
    answer: "Review job postings in Jobs section. Check details meet standards. Approve to make visible to applicants."
  },
  {
    keywords: ["reject job", "decline job", "job rejection"],
    answer: "Reject job postings that don't meet guidelines. Recruiter is notified to revise and resubmit."
  },
  {
    keywords: ["pending jobs", "job requests", "jobs waiting"],
    answer: "Jobs section shows pending approvals. Review title, description, requirements, and salary before approving."
  },
  {
    keywords: ["job quality", "job guidelines", "posting standards"],
    answer: "Check: clear job title, complete description, appropriate requirements, and proper salary range."
  },
  {
    keywords: ["manage jobs", "job overview", "all jobs"],
    answer: "Jobs page shows all postings. Filter by status, recruiter, or date. Monitor job quality platform-wide."
  },
  {
    keywords: ["close job", "remove job", "deactivate job"],
    answer: "Admins can close any job if needed. This removes it from applicant view. Use for policy violations."
  },

  // ==================== DASHBOARD ANALYTICS ====================
  {
    keywords: ["dashboard", "admin dashboard", "overview"],
    answer: "Dashboard shows: total users, active jobs, applications, and platform activity. Your control center."
  },
  {
    keywords: ["platform stats", "statistics", "analytics"],
    answer: "View: Total Recruiters, Employees, Applicants, Active Jobs, and Application counts. Real-time metrics."
  },
  {
    keywords: ["hiring trends", "trends", "analytics trends"],
    answer: "Dashboard charts show hiring trends: applications over time, jobs posted, and approval rates."
  },
  {
    keywords: ["user count", "total users", "registered users"],
    answer: "Dashboard displays user counts by role: Recruiters, Employees, and Applicants. Track platform growth."
  },
  {
    keywords: ["job statistics", "job metrics", "posting stats"],
    answer: "View job stats: total posted, active, paused, closed. See distribution by industry or company."
  },
  {
    keywords: ["application metrics", "application stats", "application volume"],
    answer: "Track application volume: total submitted, approved, rejected, pending. Monitor hiring pipeline health."
  },

  // ==================== USER MANAGEMENT ====================
  {
    keywords: ["manage users", "user management", "all users"],
    answer: "Access user management through Recruiters, Employees, and Applicants pages. Monitor and manage each group."
  },
  {
    keywords: ["deactivate user", "suspend user", "disable account"],
    answer: "For policy violations, you can deactivate user accounts. They lose access until reactivated."
  },
  {
    keywords: ["user issues", "user problems", "user complaints"],
    answer: "Review user reports and complaints. Take action as needed: warnings, suspension, or account closure."
  },
  {
    keywords: ["reset password", "user password", "password help"],
    answer: "Direct users to 'Forgot Password' on login. For persistent issues, contact technical support."
  },

  // ==================== APPROVAL WORKFLOW ====================
  {
    keywords: ["approval process", "how approval works", "approval flow"],
    answer: "Flow: User registers → Completes profile → Admin reviews → Approves/Rejects. Users need approval for full access."
  },
  {
    keywords: ["pending approvals", "what to approve", "approval queue"],
    answer: "Check: Recruiters page for recruiter approvals, Employees page for employee approvals, Jobs for job approvals."
  },
  {
    keywords: ["approval criteria", "what to check", "approval checklist"],
    answer: "Check: Complete profile, valid information, appropriate role/department, and compliance with platform policies."
  },
  {
    keywords: ["bulk approve", "approve multiple", "batch approval"],
    answer: "Select multiple items using checkboxes. Use bulk approve action if available. Verify each before batch approval."
  },

  // ==================== PLATFORM MONITORING ====================
  {
    keywords: ["monitor platform", "platform health", "system status"],
    answer: "Dashboard provides platform overview. Check user activity, job postings, and application flow for health indicators."
  },
  {
    keywords: ["activity log", "audit trail", "user actions"],
    answer: "Activity logs track all major actions. Review for compliance, troubleshooting, and accountability."
  },
  {
    keywords: ["reports", "generate report", "export data"],
    answer: "Generate reports from dashboard or specific sections. Export data for analysis or compliance needs."
  },
  {
    keywords: ["platform issues", "system problems", "technical issues"],
    answer: "For technical issues, contact development team. Document the issue with screenshots and steps to reproduce."
  },

  // ==================== NOTIFICATIONS ====================
  {
    keywords: ["notifications", "alerts", "admin alerts"],
    answer: "Bell icon shows notifications: new approval requests, system alerts, and important platform updates."
  },
  {
    keywords: ["notification settings", "alert settings", "configure alerts"],
    answer: "Configure which notifications you receive in Settings. Prioritize critical alerts for efficient management."
  },

  // ==================== PROFILE & SETTINGS ====================
  {
    keywords: ["admin profile", "my profile", "update profile"],
    answer: "Click 'Profile' to update your admin details. Keep contact information current for team communication."
  },
  {
    keywords: ["platform settings", "system settings", "configuration"],
    answer: "Access system settings to configure platform behavior, defaults, and policies. Changes affect all users."
  },

  // ==================== HELP ====================
  {
    keywords: ["help", "support", "assistance"],
    answer: "Need help? Use this assistant, check admin documentation, or contact technical support team."
  },
  {
    keywords: ["hello", "hi", "hey", "greet"],
    answer: "Hello! 👋 I'm your Admin Assistant. Ask me about approvals, user management, or platform analytics."
  },
  {
    keywords: ["thank", "thanks", "helpful"],
    answer: "You're welcome! Glad to help with admin tasks. Feel free to ask more questions anytime."
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    answer: "Goodbye! Best of luck managing the platform. Come back if you need help! 🎯"
  },
  {
    keywords: ["logout", "sign out"],
    answer: "Click 'Logout' in the navigation to end your session securely. Always logout for security."
  },
  {
    keywords: ["admin responsibilities", "my role", "what to do"],
    answer: "Admin tasks: Approve recruiters/employees, monitor jobs, review analytics, and ensure platform quality."
  },
  {
    keywords: ["priority tasks", "urgent items", "important actions"],
    answer: "Prioritize: Pending approvals (blocking users), reported issues, and platform compliance matters."
  }
];

// Export for use with chatbot engine
if (typeof window !== 'undefined') {
  window.adminKnowledge = adminKnowledge;
}
