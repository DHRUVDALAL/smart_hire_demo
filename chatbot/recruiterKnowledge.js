/**
 * SmartHire Recruiter Portal Knowledge Base
 * ============================================================
 * 50 knowledge entries for recruiter-specific questions.
 */

const recruiterKnowledge = [
  // ==================== JOB POSTING ====================
  {
    keywords: ["post job", "create job", "add job", "new job", "publish job"],
    answer: "Go to 'Post Job' in the navigation. Fill job title, description, requirements, and salary. Submit for admin approval before it goes live."
  },
  {
    keywords: ["job title", "name job", "title field"],
    answer: "Enter a clear, specific job title. Example: 'Senior Software Engineer' not 'Developer'. Good titles attract qualified candidates."
  },
  {
    keywords: ["job description", "write description", "describe job"],
    answer: "Include responsibilities, requirements, benefits, and company culture. Be clear and concise. Good descriptions get more qualified applicants."
  },
  {
    keywords: ["job requirements", "add requirements", "skills needed"],
    answer: "List required skills, experience level, education, and certifications. Separate must-haves from nice-to-haves for better matches."
  },
  {
    keywords: ["salary range", "compensation", "pay range"],
    answer: "Specify min-max salary in the Salary field. Transparent salary ranges attract more applicants and set clear expectations."
  },
  {
    keywords: ["job location", "work location", "remote option"],
    answer: "Specify: office location, remote, or hybrid. Be specific about location requirements. Remote jobs attract wider talent pools."
  },
  {
    keywords: ["job type", "employment type", "full time part time"],
    answer: "Select: Full-Time, Part-Time, Contract, or Internship. This helps candidates filter jobs matching their availability."
  },
  {
    keywords: ["job approval", "pending approval", "waiting approval"],
    answer: "After posting, jobs go to admin for approval. Once approved, they become visible to applicants. Check status in 'Manage Jobs'."
  },

  // ==================== MANAGE JOBS ====================
  {
    keywords: ["manage jobs", "my jobs", "job list", "view jobs"],
    answer: "Click 'Manage Jobs' to see all your postings. View status, applications count, and edit any job. Filter by status."
  },
  {
    keywords: ["edit job", "update job", "modify job", "change job"],
    answer: "In 'Manage Jobs', click on a job to edit. Update details and save. Major changes may require re-approval."
  },
  {
    keywords: ["pause job", "stop job", "deactivate job"],
    answer: "In 'Manage Jobs', click the pause icon on any active job. This hides it from applicants temporarily."
  },
  {
    keywords: ["resume job", "reactivate job", "unpause job"],
    answer: "In 'Manage Jobs', click the resume icon on paused jobs. The job becomes visible to applicants again."
  },
  {
    keywords: ["close job", "end job", "finish hiring"],
    answer: "Click 'Close Job' when hiring is complete. Closed jobs are archived and stop accepting applications."
  },
  {
    keywords: ["delete job", "remove job", "cancel job"],
    answer: "Jobs can be closed but not deleted to maintain records. Close the job instead. Contact admin for special cases."
  },
  {
    keywords: ["job status", "job states", "status meaning"],
    answer: "Statuses: Draft → Pending Approval → Active → Paused → Closed. Active jobs are visible to applicants."
  },
  {
    keywords: ["duplicate job", "copy job", "repost job"],
    answer: "In 'Manage Jobs', use 'Duplicate' to copy an existing job. Modify details and submit. Saves time for similar roles."
  },

  // ==================== APPLICATIONS ====================
  {
    keywords: ["view applications", "see applications", "application list"],
    answer: "Click 'Applications' to see all candidates. Filter by job, status, or date. Click any application for full details."
  },
  {
    keywords: ["application status", "candidate status", "applicant stage"],
    answer: "Statuses: Applied → Reviewed → Approved → Interview → Accepted/Rejected. Track each candidate's progress."
  },
  {
    keywords: ["review application", "check application", "evaluate candidate"],
    answer: "Click on any application to view candidate profile, resume, and application details. Review before scheduling interviews."
  },
  {
    keywords: ["approved candidates", "shortlisted", "selected candidates"],
    answer: "Approved candidates have passed screening. They're ready for interviews. View them in Applications with 'Approved' filter."
  },
  {
    keywords: ["filter applications", "search candidates", "sort applications"],
    answer: "Use filters: by job, status, date, or skills. Click column headers to sort. Find candidates quickly."
  },
  {
    keywords: ["candidate profile", "view resume", "applicant details"],
    answer: "Click any candidate to see their full profile: contact info, resume, skills, experience, and application history."
  },

  // ==================== INTERVIEWS ====================
  {
    keywords: ["schedule interview", "book interview", "create interview"],
    answer: "In Applications, select an approved candidate. Click 'Schedule Interview'. Set date, time, mode, and add details."
  },
  {
    keywords: ["interview mode", "online offline", "video interview"],
    answer: "Choose: Online (add meeting link) or Offline (add location). Select based on role and candidate availability."
  },
  {
    keywords: ["interview date", "when interview", "set time"],
    answer: "Select date and time when scheduling. Consider timezone for remote candidates. Allow reasonable notice period."
  },
  {
    keywords: ["meeting link", "video link", "zoom link"],
    answer: "For online interviews, add the meeting link (Zoom, Meet, Teams). Candidate receives this in their notification."
  },
  {
    keywords: ["view interviews", "interview list", "scheduled interviews"],
    answer: "Click 'Interviews' to see all scheduled interviews. View upcoming, completed, and cancelled. Manage from here."
  },
  {
    keywords: ["cancel interview", "remove interview", "stop interview"],
    answer: "In Interviews page, find the interview and click 'Cancel'. Candidate is notified automatically."
  },
  {
    keywords: ["reschedule interview", "change interview", "move interview"],
    answer: "Cancel the existing interview and create a new one. Or edit the interview details if allowed. Notify the candidate."
  },
  {
    keywords: ["interview feedback", "rate candidate", "interview notes"],
    answer: "After interview, add feedback: technical skills, communication, culture fit. Ratings help final decisions."
  },

  // ==================== HIRING DECISIONS ====================
  {
    keywords: ["accept candidate", "hire candidate", "make offer"],
    answer: "After successful interview, mark candidate as 'Accepted' in Applications. This is the final hiring decision."
  },
  {
    keywords: ["reject candidate", "decline candidate", "not hire"],
    answer: "Mark candidate as 'Rejected' if not proceeding. Optionally add a reason. Candidate is notified of decision."
  },
  {
    keywords: ["hold candidate", "maybe later", "keep candidate"],
    answer: "Use 'Hold' status for candidates to consider later. They remain in pipeline without rejection."
  },
  {
    keywords: ["hiring pipeline", "recruitment funnel", "candidate flow"],
    answer: "Pipeline: Applied → Screening → Approved → Interview → Offer → Hired. Track candidates at each stage."
  },

  // ==================== DASHBOARD ====================
  {
    keywords: ["dashboard", "home page", "overview", "main page"],
    answer: "Dashboard shows: open jobs, total applications, scheduled interviews, and recent activity. Your command center."
  },
  {
    keywords: ["dashboard stats", "metrics", "numbers"],
    answer: "View: Active Jobs, Total Applications, Interviews Scheduled, Candidates Accepted. Charts show trends."
  },
  {
    keywords: ["recent jobs", "job overview", "my postings"],
    answer: "Dashboard shows recent job postings with status and application counts. Quick access to manage them."
  },
  {
    keywords: ["recent applications", "new applicants", "latest candidates"],
    answer: "Recent applications appear on dashboard sorted by date. Click 'View All' for complete list."
  },

  // ==================== PROFILE & ACCOUNT ====================
  {
    keywords: ["company profile", "update company", "company info"],
    answer: "Go to Profile to update company details: name, description, industry, size, and location. Complete for credibility."
  },
  {
    keywords: ["recruiter profile", "my profile", "edit profile"],
    answer: "Click 'Profile' to update your info: name, email, phone, and bio. Complete profile required for approval."
  },
  {
    keywords: ["account approval", "recruiter approval", "get approved"],
    answer: "Complete your profile first. Admin reviews and approves. Once approved, you can post jobs and manage applications."
  },
  {
    keywords: ["pending approval", "waiting approval", "not approved"],
    answer: "Your profile is under admin review. Ensure it's 100% complete. Contact admin if taking too long."
  },

  // ==================== NOTIFICATIONS ====================
  {
    keywords: ["notifications", "alerts", "updates"],
    answer: "Click bell icon for notifications: new applications, interview reminders, approval updates, and system alerts."
  },

  // ==================== HELP ====================
  {
    keywords: ["help", "support", "assistance"],
    answer: "Need help? Use this assistant, check Help section, or contact admin. We support your recruitment process."
  },
  {
    keywords: ["hello", "hi", "hey", "greet"],
    answer: "Hello! 👋 I'm your Recruiter Assistant. Ask me about posting jobs, managing applications, or scheduling interviews."
  },
  {
    keywords: ["thank", "thanks", "helpful"],
    answer: "You're welcome! Happy recruiting. Feel free to ask more questions anytime."
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    answer: "Goodbye! Best of luck finding great candidates. Come back if you need help! 🎯"
  },
  {
    keywords: ["logout", "sign out"],
    answer: "Click 'Logout' in the navigation to end your session securely. Always logout on shared devices."
  }
];

// Export for use with chatbot engine
if (typeof window !== 'undefined') {
  window.recruiterKnowledge = recruiterKnowledge;
}
