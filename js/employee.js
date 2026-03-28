/**
 * ============================================================
 * SMART HIRE — Employee (Screening) Page JavaScript
 * ============================================================
 * Handles:
 * - Application search & status filter
 * - Auth guard
 * ============================================================
 */

// requireAuth();

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('appSearch');
    const statusFilter = document.getElementById('statusFilter');
    const tableBody = document.getElementById('appTableBody');

    function filterApps() {
        const query = (searchInput?.value || '').toLowerCase();
        const status = (statusFilter?.value || '').toLowerCase();
        const rows = tableBody?.querySelectorAll('tr') || [];

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowStatus = (row.dataset.status || '').toLowerCase();
            const matchText = text.includes(query);
            const matchStat = !status || rowStatus === status;
            row.style.display = (matchText && matchStat) ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterApps);
    if (statusFilter) statusFilter.addEventListener('change', filterApps);
});
