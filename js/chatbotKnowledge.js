/**
 * SmartHire AI Chatbot Knowledge Base
 * ============================================================
 * Contains 100+ Q&A entries for the SmartHire platform.
 * Topics: Job posting, screening, interviews, approvals, etc.
 */

const chatbotKnowledge = [
  // ==================== JOB POSTING ====================
  {
    keywords: ["post job", "create job", "add job", "new job", "publish job"],
    answer: "Go to Recruiter Dashboard → Click 'Post Job'. Fill in job title, description, location, and requirements. Submit for admin approval before it goes live."
  },
  {
    keywords: ["job status", "job states", "job lifecycle"],
    answer: "Jobs have these statuses: Draft → Pending Approval → Active → Paused → Closed. Admin must approve before a job becomes Active and visible to applicants."
  },
  {
    keywords: ["edit job", "update job", "modify job"],
    answer: "Go to 'Manage Jobs' in the Recruiter Portal. Click on the job you want to edit. Make changes and save. Major changes may require re-approval."
  },
  {
    keywords: ["pause job", "unpause job", "stop job"],
    answer: "In 'Manage Jobs', click the pause icon on any active job. This hides it from applicants temporarily. Click again to reactivate."
  },
  {
    keywords: ["close job", "delete job", "remove job"],
    answer: "Go to 'Manage Jobs' → Select the job → Click 'Close Job'. Closed jobs are archived and no longer accept applications."
  },
  {
    keywords: ["job requirements", "job skills", "required skills"],
    answer: "When posting a job, add required skills in the Skills field. Separate multiple skills with commas. This helps filter matching candidates."
  },
  {
    keywords: ["job description", "write job", "job details"],
    answer: "Include role responsibilities, requirements, benefits, and company culture. Clear descriptions attract better candidates. Keep it concise but informative."
  },
  {
    keywords: ["salary range", "job salary", "compensation"],
    answer: "When posting a job, specify salary range in the Salary field. You can set min/max values. Transparent salaries attract more applicants."
  },
  {
    keywords: ["job location", "remote job", "work location"],
    answer: "Specify the job location when posting. Options include office address, remote, hybrid, or multiple locations. Be specific for better matches."
  },
  {
    keywords: ["job type", "full time", "part time", "contract"],
    answer: "Select job type when posting: Full-Time, Part-Time, Contract, or Internship. This helps candidates filter relevant opportunities."
  },

  // ==================== CANDIDATE SCREENING ====================
  {
    keywords: ["screen candidates", "review applicants", "candidate review"],
    answer: "Employees screen candidates in 'Candidate Screening'. Review profiles, resumes, and application details. Then approve, reject, hold, or blacklist."
  },
  {
    keywords: ["approve candidate", "accept candidate", "candidate approval"],
    answer: "In Candidate Screening, click 'Approve' on a candidate. This moves them forward in the pipeline and notifies recruiters for interview scheduling."
  },
  {
    keywords: ["reject candidate", "decline candidate", "reject applicant"],
    answer: "Click 'Reject' on a candidate in screening. Optionally add a reason. The candidate is notified and removed from the active pipeline."
  },
  {
    keywords: ["hold candidate", "candidate on hold", "pause candidate"],
    answer: "Use 'Hold' to pause a candidate's progress. They remain in the system for future consideration without moving forward or being rejected."
  },
  {
    keywords: ["blacklist candidate", "block candidate", "ban applicant"],
    answer: "Blacklisting permanently blocks a candidate from future applications. Use cautiously. Only for serious issues like fraud or misconduct."
  },
  {
    keywords: ["view resume", "candidate resume", "download resume"],
    answer: "Click on any candidate to open their profile. The resume is displayed there. Click the resume link to download or view in full."
  },
  {
    keywords: ["candidate skills", "applicant skills", "match skills"],
    answer: "Candidate skills are shown on their profile. Compare with job requirements to assess fit. Use filters to find candidates with specific skills."
  },
  {
    keywords: ["candidate experience", "work experience", "applicant history"],
    answer: "View candidate's work experience in their profile. This includes years of experience, previous roles, and relevant achievements."
  },
  {
    keywords: ["candidate notes", "add notes", "screening notes"],
    answer: "Add notes to any candidate during screening. These notes are visible to your team and help track feedback across reviewers."
  },
  {
    keywords: ["filter candidates", "search candidates", "find applicants"],
    answer: "Use filters in Candidate Screening to sort by status, job role, skills, or date. This helps manage large applicant pools efficiently."
  },

  // ==================== SHORTLIST MANAGEMENT ====================
  {
    keywords: ["shortlist", "shortlist candidates", "shortlist manager"],
    answer: "Shortlist Manager lets employees set limits on how many candidates to shortlist per job. Access it from 'Shortlist Manager' in the Employee Portal."
  },
  {
    keywords: ["shortlist limit", "max shortlist", "candidate limit"],
    answer: "Set shortlist limits per job to manage pipeline size. Once limit is reached, new candidates go to 'Hold' until spots open up."
  },
  {
    keywords: ["view shortlisted", "shortlisted candidates", "approved candidates"],
    answer: "View all shortlisted candidates in Shortlist Manager. These are candidates approved by employees and ready for recruiter review."
  },

  // ==================== INTERVIEWS ====================
  {
    keywords: ["schedule interview", "book interview", "create interview"],
    answer: "Recruiters schedule interviews from Applications page. Select a candidate → Click 'Schedule Interview' → Set date, time, mode, and link."
  },
  {
    keywords: ["interview modes", "online interview", "offline interview"],
    answer: "Two interview modes: Online (video call with meeting link) or Offline (in-person at specified location). Choose based on role requirements."
  },
  {
    keywords: ["interview status", "interview states", "track interview"],
    answer: "Interview statuses: Scheduled → Completed → Cancelled. Track all interviews from the Interviews section in Recruiter Portal."
  },
  {
    keywords: ["cancel interview", "reschedule interview", "change interview"],
    answer: "To cancel or reschedule, go to Interviews page → Find the interview → Click cancel or edit. Candidate will be notified automatically."
  },
  {
    keywords: ["interview feedback", "rate candidate", "interview notes"],
    answer: "After interviews, add feedback with ratings for technical skills, communication, and overall fit. This helps final hiring decisions."
  },
  {
    keywords: ["interview reminder", "interview notification", "upcoming interview"],
    answer: "Both candidates and interviewers receive notifications for upcoming interviews. Check the notification bell for reminders."
  },
  {
    keywords: ["video interview", "virtual interview", "meeting link"],
    answer: "For online interviews, add a meeting link (Zoom, Google Meet, etc.) when scheduling. The link is shared with the candidate automatically."
  },
  {
    keywords: ["interview panel", "multiple interviewers", "team interview"],
    answer: "You can add multiple team members to an interview. They'll receive the meeting details and can add their feedback independently."
  },

  // ==================== APPLICATIONS ====================
  {
    keywords: ["view applications", "see applications", "application list"],
    answer: "Recruiters see all applications in 'Applications' section. Filter by job, status, or date. Click any application to view details."
  },
  {
    keywords: ["application status", "applicant status", "track application"],
    answer: "Application statuses: Applied → Reviewed → Approved → Interview → Accepted/Rejected. Track progress in the Applications page."
  },
  {
    keywords: ["application pipeline", "hiring pipeline", "recruitment funnel"],
    answer: "The pipeline shows candidates at each stage: Applied → Screening → Approved → Interview → Offer → Hired. Visual progress tracking."
  },
  {
    keywords: ["accept candidate", "hire candidate", "final acceptance"],
    answer: "After successful interviews, mark candidate as 'Accepted' in Applications. This is the final hiring decision before onboarding."
  },
  {
    keywords: ["application count", "how many applied", "applicant numbers"],
    answer: "View application counts on your Dashboard. Each job card shows total applications. Click to see the breakdown by status."
  },
  {
    keywords: ["recent applications", "new applications", "latest applicants"],
    answer: "Recent applications appear on your Dashboard. They're sorted by date with newest first. Click 'Open Applications' for the full list."
  },

  // ==================== ADMIN APPROVAL ====================
  {
    keywords: ["admin approval", "get approved", "approval process"],
    answer: "Recruiters and employees need admin approval to access full features. Complete your profile → Admin reviews → You get approved."
  },
  {
    keywords: ["profile approval", "account approval", "pending approval"],
    answer: "After completing your profile, it goes to admin for review. You'll see 'Pending Approval' status. Admin will approve or reject."
  },
  {
    keywords: ["why pending", "approval waiting", "not approved yet"],
    answer: "Your account is pending because admin hasn't reviewed it yet. Make sure your profile is 100% complete. Contact admin if it takes too long."
  },
  {
    keywords: ["admin reject", "approval rejected", "rejection reason"],
    answer: "If admin rejects your profile, you'll receive a notification with the reason. Fix the issues and contact admin to request re-review."
  },
  {
    keywords: ["job approval", "job pending", "job review"],
    answer: "All new jobs require admin approval before going live. Submit your job → Admin reviews → Approved jobs become Active."
  },
  {
    keywords: ["contact admin", "reach admin", "admin help"],
    answer: "For admin assistance, use the contact form or email the admin directly. Check your company's admin contact in the Help section."
  },

  // ==================== PROFILE MANAGEMENT ====================
  {
    keywords: ["complete profile", "profile completion", "fill profile"],
    answer: "Go to Profile section. Fill all required fields: name, email, phone, department, bio, and skills. 100% completion unlocks all features."
  },
  {
    keywords: ["update profile", "edit profile", "change profile"],
    answer: "Click 'Profile' in the navigation. Edit any field and click 'Save Changes'. Some changes may require re-approval."
  },
  {
    keywords: ["profile picture", "avatar", "profile photo"],
    answer: "Upload a profile picture in the Profile section. Click the avatar area → Select image → Save. Professional photos are recommended."
  },
  {
    keywords: ["add skills", "update skills", "my skills"],
    answer: "In your Profile, find the Skills section. Type a skill and press Enter to add. Remove skills by clicking the X button."
  },
  {
    keywords: ["company profile", "company info", "company details"],
    answer: "Recruiters can update company info in Company Profile. Add company name, description, industry, size, and location."
  },
  {
    keywords: ["profile tips", "improve profile", "better profile"],
    answer: "Complete all fields, add a professional photo, list relevant skills, and write a clear bio. Complete profiles get faster approval."
  },

  // ==================== DASHBOARD ====================
  {
    keywords: ["dashboard", "home page", "main page", "overview"],
    answer: "The Dashboard shows your key metrics: total applications, scheduled interviews, approved candidates, and recent activity at a glance."
  },
  {
    keywords: ["dashboard stats", "statistics", "metrics"],
    answer: "Dashboard displays: Total Applications, Scheduled Interviews, Candidates On Hold, and Accepted Candidates. Charts show trends."
  },
  {
    keywords: ["recent jobs", "my jobs", "job overview"],
    answer: "Recent Jobs on Dashboard shows your latest job postings with status. Click 'Manage Jobs' to see all jobs and details."
  },
  {
    keywords: ["charts", "graphs", "analytics"],
    answer: "Dashboard charts show Applications Per Job and Job Status Distribution. Use these to track hiring performance."
  },
  {
    keywords: ["refresh data", "update dashboard", "reload"],
    answer: "Dashboard data loads automatically. Refresh the page or click the refresh button to get the latest numbers."
  },

  // ==================== NOTIFICATIONS ====================
  {
    keywords: ["notifications", "alerts", "bell icon"],
    answer: "Click the bell icon to see notifications. You'll receive alerts for new applications, approvals, interviews, and status changes."
  },
  {
    keywords: ["mark read", "clear notifications", "read all"],
    answer: "In the notification dropdown, click 'Mark all read' to clear unread badges. Click individual notifications to mark them read."
  },
  {
    keywords: ["notification types", "what notifications", "alert types"],
    answer: "You get notified for: new applications, candidate approvals/rejections, interview schedules, profile approvals, and job status changes."
  },

  // ==================== RECRUITER PORTAL ====================
  {
    keywords: ["recruiter portal", "recruiter features", "recruiter access"],
    answer: "Recruiter Portal includes: Dashboard, Post Job, Manage Jobs, Applications, Interviews, and Profile. Access all hiring tools here."
  },
  {
    keywords: ["recruiter workflow", "recruiter process", "recruiting steps"],
    answer: "Workflow: Post Jobs → Review Applications → Schedule Interviews → Make Hiring Decisions → Onboard. Track everything in one place."
  },
  {
    keywords: ["recruiter approval", "recruiter pending", "new recruiter"],
    answer: "New recruiters must complete profile and get admin approval. Once approved, you can post jobs and manage applications."
  },
  {
    keywords: ["manage jobs", "jobs page", "my postings"],
    answer: "'Manage Jobs' shows all your job postings. Filter by status, edit details, pause/resume, or close jobs. Track applications per job."
  },

  // ==================== EMPLOYEE PORTAL ====================
  {
    keywords: ["employee portal", "employee features", "employee access"],
    answer: "Employee Portal includes: Dashboard, Candidate Screening, Shortlist Manager, and Profile. Focus on reviewing and screening candidates."
  },
  {
    keywords: ["employee workflow", "screening workflow", "employee process"],
    answer: "Workflow: Review Applications → Screen Candidates → Approve/Reject → Manage Shortlist. Approved candidates go to recruiters."
  },
  {
    keywords: ["employee approval", "employee pending", "new employee"],
    answer: "New employees must complete profile and get admin approval. Once approved, you can screen candidates and manage shortlists."
  },
  {
    keywords: ["screening stats", "my reviews", "screening metrics"],
    answer: "Dashboard shows your screening stats: Total Reviewed, Approved, Rejected. Track your screening efficiency over time."
  },

  // ==================== APPLICANT FLOW ====================
  {
    keywords: ["how apply", "submit application", "apply job"],
    answer: "Applicants browse jobs → Click 'Apply' → Upload resume → Add cover letter → Submit. Application goes to screening queue."
  },
  {
    keywords: ["applicant status", "application progress", "track my application"],
    answer: "Applicants can track their application status in their dashboard. They receive notifications at each stage of the process."
  },
  {
    keywords: ["applicant portal", "applicant features", "job seeker"],
    answer: "Applicant Portal shows: Available Jobs, My Applications, Interview Schedule, and Profile. One place to manage job search."
  },

  // ==================== GENERAL HELP ====================
  {
    keywords: ["help", "support", "assistance", "guide"],
    answer: "Need help? Check the Help section, contact admin, or ask me any question about SmartHire features and workflows."
  },
  {
    keywords: ["how to use", "get started", "tutorial", "quick start"],
    answer: "Getting started: 1) Complete your profile 2) Get admin approval 3) Access your portal features. Ask me about any specific feature!"
  },
  {
    keywords: ["logout", "sign out", "exit"],
    answer: "Click the 'Logout' button in the top navigation bar. This securely ends your session. Remember to logout on shared devices."
  },
  {
    keywords: ["login", "sign in", "access account"],
    answer: "Go to the login page → Enter email and password → Click 'Sign In'. You'll be redirected to your role-specific dashboard."
  },
  {
    keywords: ["forgot password", "reset password", "change password"],
    answer: "Click 'Forgot Password' on the login page → Enter email → Check inbox for reset link → Create new password."
  },
  {
    keywords: ["roles", "user types", "account types"],
    answer: "SmartHire has 4 roles: Admin (manages platform), Recruiter (posts jobs), Employee (screens candidates), Applicant (applies to jobs)."
  },
  {
    keywords: ["what is smarthire", "about platform", "platform purpose"],
    answer: "SmartHire is a recruitment management platform. It connects employers with job seekers, streamlining the entire hiring process."
  },
  {
    keywords: ["benefits", "why smarthire", "advantages"],
    answer: "SmartHire benefits: Streamlined hiring, organized candidate tracking, team collaboration, interview scheduling, and real-time notifications."
  },

  // ==================== TECHNICAL ====================
  {
    keywords: ["browser support", "compatible browser", "which browser"],
    answer: "SmartHire works best on Chrome, Firefox, Safari, and Edge. Use the latest browser version for optimal experience."
  },
  {
    keywords: ["mobile app", "phone access", "mobile version"],
    answer: "SmartHire is fully responsive. Access it from any device browser. Native mobile apps may be available in the future."
  },
  {
    keywords: ["data security", "privacy", "secure"],
    answer: "SmartHire uses encrypted connections and secure authentication. Your data is protected following industry best practices."
  },
  {
    keywords: ["bug report", "issue", "problem"],
    answer: "Found a bug? Contact admin with details: what happened, when, and screenshots if possible. We'll investigate and fix it."
  },

  // ==================== WORKFLOW SPECIFIC ====================
  {
    keywords: ["end to end", "full process", "complete workflow"],
    answer: "Full workflow: Job Posted → Applicant Applies → Employee Screens → Candidate Approved → Recruiter Interviews → Final Decision → Hired."
  },
  {
    keywords: ["after approval", "candidate approved then", "next step approval"],
    answer: "After candidate approval: Recruiter receives notification → Schedules interview → Conducts interview → Makes final hiring decision."
  },
  {
    keywords: ["before interview", "pre interview", "interview prep"],
    answer: "Before interview: Review candidate profile, prepare questions, set up meeting link (for online), and ensure calendar availability."
  },
  {
    keywords: ["after interview", "post interview", "interview done"],
    answer: "After interview: Add feedback and ratings → Discuss with team → Make final decision (Accept/Reject) → Notify candidate."
  },
  {
    keywords: ["hiring decision", "final decision", "accept or reject"],
    answer: "Final decision is made after interviews. Mark candidate as 'Accepted' to hire or 'Rejected' to decline. Both trigger notifications."
  },
  {
    keywords: ["time to hire", "hiring duration", "process length"],
    answer: "Time to hire varies by role. Track your metrics on the Dashboard. Streamline by responding quickly to applications and scheduling promptly."
  },

  // ==================== COLLABORATION ====================
  {
    keywords: ["team collaboration", "work together", "team members"],
    answer: "Team members can see shared candidates, add notes, provide feedback, and coordinate on hiring decisions through the platform."
  },
  {
    keywords: ["share candidate", "collaborate candidate", "team review"],
    answer: "Candidates are automatically visible to relevant team members. Add notes to share insights. Use the activity log to track actions."
  },
  {
    keywords: ["activity log", "history", "audit trail"],
    answer: "Activity logs track all actions on candidates and jobs. See who did what and when. Useful for team coordination and compliance."
  },

  // ==================== REPORTS & ANALYTICS ====================
  {
    keywords: ["reports", "analytics", "insights"],
    answer: "Dashboard shows key analytics: applications per job, status distribution, hiring trends. Use these to optimize your recruiting."
  },
  {
    keywords: ["export data", "download report", "get data"],
    answer: "Export features may be available in the Admin portal. Contact admin for specific data exports or reports you need."
  },
  {
    keywords: ["hiring metrics", "kpi", "performance"],
    answer: "Key metrics: Applications received, screening rate, interview-to-hire ratio, time to fill. Track these to improve hiring efficiency."
  },

  // ==================== QUICK ANSWERS ====================
  {
    keywords: ["yes no", "confirm", "simple answer"],
    answer: "Ask me a specific question and I'll give you a clear, concise answer. Try: 'How do I post a job?' or 'What is screening?'"
  },
  {
    keywords: ["thank", "thanks", "helpful"],
    answer: "You're welcome! Feel free to ask more questions anytime. I'm here to help you navigate SmartHire efficiently."
  },
  {
    keywords: ["hello", "hi", "hey", "greet"],
    answer: "Hello! 👋 I'm your SmartHire Assistant. Ask me anything about posting jobs, screening candidates, interviews, or using the platform."
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    answer: "Goodbye! Come back anytime you have questions. Happy hiring! 🎯"
  }
];

// Export for use in chatbot.js
if (typeof window !== 'undefined') {
  window.chatbotKnowledge = chatbotKnowledge;
}
