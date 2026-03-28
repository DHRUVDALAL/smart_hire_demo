/**
 * ============================================================
 * SMART HIRE — Accountant Page JavaScript
 * ============================================================
 * Handles:
 * - Revenue chart rendering (static bars)
 * - Auth guard
 * ============================================================
 */

// requireAuth();

document.addEventListener('DOMContentLoaded', () => {
    // ---- Render static revenue chart ----
    const chartContainer = document.getElementById('revenueChart');
    if (chartContainer) {
        const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
        const values = [18, 24, 21, 32, 38, 42]; // Revenue in thousands
        const maxVal = Math.max(...values);

        chartContainer.innerHTML = months.map((m, i) => {
            const height = (values[i] / maxVal) * 140;
            return `<div class="bar" style="height:${height}px"><span class="bar-label">${m}<br><strong>$${values[i]}K</strong></span></div>`;
        }).join('');
    }
});
