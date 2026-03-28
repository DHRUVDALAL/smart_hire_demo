/**
 * ============================================================
 * SMART HIRE — Recruiter Page JavaScript
 * ============================================================
 * Handles:
 * - Post Job modal open/close
 * - Post Job form submission
 * - Auth guard
 * ============================================================
 */

// requireAuth(); // Uncomment when backend is connected

document.addEventListener('DOMContentLoaded', () => {
    // ---- Modal Controls ----
    const modal = document.getElementById('postJobModal');
    const openBtn = document.getElementById('postJobBtn');
    const closeBtn = document.getElementById('closeJobModal');
    const cancelBtn = document.getElementById('cancelJobModal');
    const submitBtn = document.getElementById('submitJob');

    if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('show'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('show'));

    // Close modal on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }

    // ---- Submit Job ----
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            // In production: validate & call API
            // await apiFetch('/jobs', { method: 'POST', body: ... });
            showToast('Job posted successfully!', 'success');
            modal.classList.remove('show');
        });
    }
});
