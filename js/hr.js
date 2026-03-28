/**
 * ============================================================
 * SMART HIRE — HR Page JavaScript
 * ============================================================
 * Handles:
 * - Add Employee modal
 * - Auth guard
 * ============================================================
 */

// requireAuth();

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addEmpBtn');
    const modal = document.getElementById('addEmpModal');

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => modal.classList.add('show'));
    }

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }
});
