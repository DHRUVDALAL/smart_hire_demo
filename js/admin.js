/**
 * ============================================================
 * SMART HIRE — Admin Page JavaScript
 * ============================================================
 * Handles:
 * - User search & role filter
 * - Auth guard
 * ============================================================
 */

// requireAuth(); // Uncomment when backend is connected

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const tableBody = document.getElementById('usersTableBody');

    /**
     * Filter the users table based on search text and role dropdown.
     */
    function filterUsers() {
        const query = (searchInput?.value || '').toLowerCase();
        const role = (roleFilter?.value || '').toLowerCase();
        const rows = tableBody?.querySelectorAll('tr') || [];

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const roleCell = row.querySelector('.badge-status.info')?.textContent.toLowerCase() || '';
            const matchSearch = text.includes(query);
            const matchRole = !role || roleCell.includes(role);
            row.style.display = (matchSearch && matchRole) ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterUsers);
    if (roleFilter) roleFilter.addEventListener('change', filterUsers);
});
