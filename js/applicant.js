/**
 * ============================================================
 * SMART HIRE — Applicant Page JavaScript
 * ============================================================
 * Handles:
 * - Profile completion ring rendering
 * - Job search filtering
 * - Apply to job action
 * - Auth guard
 * ============================================================
 */

// Auth guard — redirect if not logged in
// requireAuth();  // Uncomment when backend is connected

// ============================================================
// 1. PROFILE COMPLETION RING
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const ringContainer = document.getElementById('completionRing');
    if (ringContainer) {
        // Calculate profile completion (demo value — replace with API data)
        const percentage = 72;
        ringContainer.innerHTML = createCompletionRing(percentage);
    }
});

// ============================================================
// 2. JOB SEARCH FILTER
// ============================================================

const jobSearchInput = document.getElementById('jobSearch');
if (jobSearchInput) {
    jobSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.job-card-item');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// ============================================================
// 3. APPLY TO JOB
// ============================================================

/**
 * Handle job application.
 * @param {string} jobId - The ID of the job to apply to.
 */
async function applyToJob(jobId) {
    try {
        // In production, uncomment:
        // await apiFetch(`/applications`, { method: 'POST', body: JSON.stringify({ jobId }) });

        showToast('Application submitted successfully!', 'success');

        // Simulate: disable the button after applying
        event.target.disabled = true;
        event.target.innerHTML = '<i class="bi bi-check-circle me-1"></i>Applied';
        event.target.classList.remove('btn-primary-custom');
        event.target.classList.add('btn-outline-custom');

    } catch (err) {
        showToast(err.message || 'Failed to submit application.', 'error');
    }
}
