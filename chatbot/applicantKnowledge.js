/**
 * SmartHire Applicant Portal Knowledge Base
 * ============================================================
 * 50 knowledge entries for applicant-specific questions.
 */

const applicantKnowledge = [
  // ==================== PROFILE ====================
  {
    keywords: ["create profile", "make profile", "setup profile", "new profile"],
    answer: "Go to your Profile page from the dashboard. Fill in your personal details, contact info, and professional summary. Complete all fields for a stronger application."
  },
  {
    keywords: ["update profile", "edit profile", "change profile", "modify profile"],
    answer: "Click 'Profile' in the navigation menu. Update any field and click 'Save Changes'. Keep your profile current for best results."
  },
  {
    keywords: ["profile picture", "add photo", "upload photo", "avatar"],
    answer: "In your Profile page, click on the avatar area to upload a photo. Use a professional headshot for better impression with recruiters."
  },
  {
    keywords: ["profile complete", "completion", "fill profile"],
    answer: "Complete your profile by filling: name, email, phone, location, skills, work experience, and education. 100% completion increases visibility."
  },
  {
    keywords: ["add skills", "my skills", "update skills", "list skills"],
    answer: "In your Profile, find the Skills section. Type a skill and press Enter to add it. Add relevant skills that match jobs you're targeting."
  },
  {
    keywords: ["work experience", "add experience", "job history"],
    answer: "Add your work experience in the Profile section. Include job title, company, dates, and key achievements. Detailed experience attracts recruiters."
  },
  {
    keywords: ["education", "add education", "qualifications", "degree"],
    answer: "Add your education in the Profile page. Include degree, institution, year, and any relevant certifications. Education helps match you to roles."
  },
  {
    keywords: ["bio", "about me", "summary", "professional summary"],
    answer: "Write a brief professional summary in your Profile. Highlight your strengths, experience, and career goals in 2-3 sentences."
  },

  // ==================== RESUME ====================
  {
    keywords: ["upload resume", "add resume", "submit resume", "resume upload"],
    answer: "Go to your Profile page and find the Resume section. Click 'Upload Resume' and select your PDF or DOC file. Keep it under 5MB."
  },
  {
    keywords: ["update resume", "change resume", "new resume", "replace resume"],
    answer: "In your Profile, click on the Resume section. Upload a new file to replace your current resume. Always keep it updated."
  },
  {
    keywords: ["resume format", "resume type", "file format"],
    answer: "We accept PDF and DOC/DOCX formats. PDF is recommended as it preserves formatting. Maximum file size is 5MB."
  },
  {
    keywords: ["download resume", "view my resume", "see resume"],
    answer: "Your uploaded resume is visible in your Profile page. Click on it to view or download. Recruiters see this when reviewing your application."
  },
  {
    keywords: ["resume tips", "better resume", "improve resume"],
    answer: "Tips: Keep it 1-2 pages, highlight achievements with numbers, use clear formatting, include relevant keywords, and proofread carefully."
  },

  // ==================== BROWSE JOBS ====================
  {
    keywords: ["browse jobs", "find jobs", "search jobs", "look for jobs"],
    answer: "Click 'Browse Jobs' on your dashboard. View all available positions. Use filters to narrow down by location, type, or skills."
  },
  {
    keywords: ["job filters", "filter jobs", "search criteria", "narrow search"],
    answer: "Use the filter options: location/city, job type (full-time, part-time), experience level, and salary range. Combine filters for precise results."
  },
  {
    keywords: ["job location", "city filter", "locality", "remote jobs"],
    answer: "Filter jobs by city or locality using the Location filter. Select 'Remote' to see work-from-home opportunities."
  },
  {
    keywords: ["job type", "full time", "part time", "contract jobs"],
    answer: "Filter by job type: Full-Time, Part-Time, Contract, or Internship. Select the type that matches your availability."
  },
  {
    keywords: ["new jobs", "recent jobs", "latest openings"],
    answer: "Recent jobs appear first on the Browse Jobs page. Check regularly for new opportunities. You can also sort by date posted."
  },
  {
    keywords: ["job details", "view job", "job description", "read job"],
    answer: "Click on any job card to view full details: description, requirements, salary, location, and company info. Review before applying."
  },
  {
    keywords: ["save job", "bookmark job", "favorite job"],
    answer: "Click the bookmark icon on any job to save it for later. View saved jobs in your dashboard under 'Saved Jobs'."
  },
  {
    keywords: ["job requirements", "qualifications needed", "eligibility"],
    answer: "Each job listing shows required qualifications, skills, and experience. Review these to ensure you're a good match before applying."
  },

  // ==================== APPLYING ====================
  {
    keywords: ["apply job", "apply for job", "how to apply", "submit application"],
    answer: "Go to Browse Jobs, select a job, and click 'Apply'. Your profile and resume are sent to the screening team. Add a cover letter if requested."
  },
  {
    keywords: ["cover letter", "add cover letter", "application letter"],
    answer: "When applying, you may add a cover letter. Explain why you're interested and highlight relevant experience. Keep it concise."
  },
  {
    keywords: ["apply multiple", "apply several jobs", "how many applications"],
    answer: "You can apply to multiple jobs. Each application is reviewed separately. Apply to roles that match your skills and interests."
  },
  {
    keywords: ["withdraw application", "cancel application", "remove application"],
    answer: "Go to 'My Applications' and find the application. Click 'Withdraw' if available. Note: You may not be able to reapply to the same job."
  },
  {
    keywords: ["application submitted", "after applying", "what happens next"],
    answer: "After applying, your application goes to the screening team. You'll receive updates on status changes. Check 'My Applications' to track progress."
  },
  {
    keywords: ["reapply", "apply again", "second application"],
    answer: "Typically you can only apply once per job. If rejected, wait for feedback or look for similar openings. Some roles allow reapplication."
  },

  // ==================== TRACKING APPLICATIONS ====================
  {
    keywords: ["track application", "my applications", "application status", "check status"],
    answer: "Click 'My Applications' on your dashboard. See all your applications with current status. Click any to view details."
  },
  {
    keywords: ["application stages", "hiring stages", "process steps"],
    answer: "Stages: Applied → Under Review → Screening → Interview → Offer. Each stage updates automatically. Check notifications for changes."
  },
  {
    keywords: ["pending application", "under review", "waiting"],
    answer: "'Under Review' means your application is being evaluated. The screening team will update the status. Please be patient."
  },
  {
    keywords: ["approved application", "shortlisted", "selected"],
    answer: "'Approved' means you've been shortlisted! Expect interview details soon. Check notifications and email regularly."
  },
  {
    keywords: ["rejected application", "not selected", "declined"],
    answer: "If rejected, don't be discouraged. Review feedback if provided, update your profile, and apply to other matching roles."
  },
  {
    keywords: ["hold status", "on hold", "application hold"],
    answer: "'On Hold' means your application is being considered for future openings. You haven't been rejected. Stay patient."
  },

  // ==================== INTERVIEWS ====================
  {
    keywords: ["interview scheduled", "upcoming interview", "interview date"],
    answer: "Check your dashboard for scheduled interviews. You'll see date, time, mode (online/offline), and meeting details."
  },
  {
    keywords: ["join interview", "attend interview", "interview link"],
    answer: "For online interviews, click the meeting link provided in your interview details. Join 5 minutes early. Test your camera and mic."
  },
  {
    keywords: ["prepare interview", "interview tips", "interview preparation"],
    answer: "Tips: Research the company, review the job description, prepare examples of your work, dress professionally, and be punctual."
  },
  {
    keywords: ["reschedule interview", "change interview date", "interview conflict"],
    answer: "Contact the recruiter immediately if you need to reschedule. Use the contact info provided in your interview notification."
  },
  {
    keywords: ["interview location", "where interview", "office address"],
    answer: "For in-person interviews, the address is in your interview details. Plan your route and arrive 10-15 minutes early."
  },
  {
    keywords: ["after interview", "interview result", "feedback"],
    answer: "After the interview, wait for the recruiter's decision. Results appear in your application status. This may take a few days."
  },

  // ==================== DASHBOARD ====================
  {
    keywords: ["dashboard", "home page", "main page", "overview"],
    answer: "Your dashboard shows: application stats, recent activity, upcoming interviews, and quick links. It's your central hub."
  },
  {
    keywords: ["notifications", "alerts", "updates", "bell icon"],
    answer: "Click the bell icon to see notifications. You'll get alerts for status changes, interview schedules, and messages."
  },
  {
    keywords: ["application count", "how many applied", "my stats"],
    answer: "Dashboard shows your stats: total applications, interviews scheduled, and results. Track your job search progress here."
  },

  // ==================== ACCOUNT ====================
  {
    keywords: ["logout", "sign out", "exit account"],
    answer: "Click the 'Logout' button in the top navigation. This securely ends your session. Log out on shared devices."
  },
  {
    keywords: ["login", "sign in", "access account"],
    answer: "Go to the login page, enter your email and password, then click 'Sign In'. You'll be redirected to your dashboard."
  },
  {
    keywords: ["forgot password", "reset password", "change password"],
    answer: "Click 'Forgot Password' on login page. Enter your email to receive a reset link. Create a new secure password."
  },
  {
    keywords: ["delete account", "remove account", "close account"],
    answer: "To delete your account, contact admin support. Note that this will remove all your applications and data permanently."
  },

  // ==================== HELP ====================
  {
    keywords: ["help", "support", "assistance", "contact"],
    answer: "Need help? Check this assistant, the Help section, or contact admin support. We're here to assist your job search."
  },
  {
    keywords: ["hello", "hi", "hey", "greet"],
    answer: "Hello! 👋 I'm your Applicant Assistant. Ask me about applying to jobs, tracking applications, or preparing for interviews."
  },
  {
    keywords: ["thank", "thanks", "helpful"],
    answer: "You're welcome! Good luck with your job search. Feel free to ask more questions anytime."
  },
  {
    keywords: ["bye", "goodbye", "see you"],
    answer: "Goodbye! Best of luck with your applications. Come back if you need any help! 🎯"
  }
];

// Export for use with chatbot engine
if (typeof window !== 'undefined') {
  window.applicantKnowledge = applicantKnowledge;
}
