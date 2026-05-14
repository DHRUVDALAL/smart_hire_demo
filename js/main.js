// Smart Hire shared frontend helpers.

function resolveApiBase() {
    const fromGlobal = window.SMART_HIRE_API_BASE;
    if (fromGlobal) return fromGlobal;

    const fromMeta = document
        .querySelector('meta[name="smart-hire-api-base"]')
        ?.getAttribute("content");
    if (fromMeta) return fromMeta;

    try {
        const fromStorage = localStorage.getItem("SMART_HIRE_API_BASE");
        if (fromStorage) return fromStorage;
    } catch {
        // ignore localStorage read errors
    }

    return "";
}

function normalizeApiBase(rawBase) {
    const base = String(rawBase || "").trim().replace(/\/+$/, "");
    if (!base) return "";
    return base.endsWith("/api") ? base : `${base}/api`;
}

const FALLBACK_API_ORIGIN = "https://smart-hire-backend-vq38.onrender.com";
const API_BASE = normalizeApiBase(resolveApiBase() || FALLBACK_API_ORIGIN);

function getDashboardForRole(role) {
    const map = {
        ADMIN: "admin-dashboard.html",
        RECRUITER: "recruiter-dashboard.html",
        APPLICANT: "applicant-dashboard.html",
        EMPLOYEE: "employee-dashboard.html",
        HR: "hr-dashboard.html",
        ACCOUNTANT: "accountant-dashboard.html",
    };

    return map[String(role || "").toUpperCase()] || "login.html";
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

function isAuthenticated() {
    return !!localStorage.getItem("token");
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function requireRole(expectedRole) {
    if (!isAuthenticated()) {
        window.location.href = "login.html";
        return null;
    }

    const user = getStoredUser();
    if (!user) {
        logout();
        return null;
    }

    const currentRole = String(user.role || "").toUpperCase();
    const required = String(expectedRole || "").toUpperCase();

    if (required && currentRole !== required) {
        window.location.href = getDashboardForRole(currentRole);
        return null;
    }

    return user;
}

function showToast(message, type = "success") {
    const existing = document.getElementById("app-toast-container");
    const container = existing || (() => {
        const el = document.createElement("div");
        el.id = "app-toast-container";
        el.style.position = "fixed";
        el.style.top = "16px";
        el.style.right = "16px";
        el.style.zIndex = "9999";
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.gap = "10px";
        document.body.appendChild(el);
        return el;
    })();

    const palette = {
        success: { bg: "#ecfdf3", border: "#8ce8bd", text: "#065f46" },
        error: { bg: "#fef2f2", border: "#f6a4a4", text: "#991b1b" },
        info: { bg: "#eff6ff", border: "#a5c8ff", text: "#1e40af" },
    };

    const tone = palette[type] || palette.info;
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.background = tone.bg;
    toast.style.color = tone.text;
    toast.style.border = `1px solid ${tone.border}`;
    toast.style.padding = "10px 12px";
    toast.style.borderRadius = "12px";
    toast.style.fontSize = "0.88rem";
    toast.style.fontWeight = "600";
    toast.style.boxShadow = "0 10px 22px rgba(15, 23, 42, 0.12)";
    toast.style.maxWidth = "340px";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-4px)";
    toast.style.transition = "0.2s ease";

    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-4px)";
        setTimeout(() => toast.remove(), 220);
    }, 2600);
}

function getUserInitial(name) {
    const normalized = String(name || "").trim();
    if (!normalized) return "U";
    return normalized.charAt(0).toUpperCase();
}

function setButtonBusy(button, busy, busyText = "Loading...") {
    if (!button) return;
    if (busy) {
        button.dataset.originalText = button.textContent;
        button.disabled = true;
        button.textContent = busyText;
        return;
    }

    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
}

function mountNotificationsBell(options = {}) {
    const user = getStoredUser();
    if (!user) return;
    const showUnreadOnly = options.showUnreadOnly === true;
    const markReadLabel = options.markReadLabel || "Mark all read";

    // Try multiple selectors for different topbar structures
    const bellContainer = document.getElementById("notificationBell") || 
                          document.querySelector(options.rowSelector || ".topbar-user") ||
                          document.querySelector(".topbar .row");
    if (!bellContainer) return;
    if (bellContainer.querySelector("[data-notification-bell]")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "notif-wrap";
    wrapper.setAttribute("data-notification-bell", "true");

    wrapper.innerHTML = `
        <button type="button" class="notif-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:20px;height:20px;stroke-width:1.75">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notif-count" style="display:none">0</span>
        </button>
        <div class="notif-dropdown">
            <div class="notif-header">
                <span>Notifications</span>
                <span class="mark-read" id="markAllRead">${markReadLabel}</span>
            </div>
            <div class="notif-list">
                <div class="notif-empty">Loading...</div>
            </div>
        </div>
    `;

    // If using #notificationBell container, replace its content, otherwise insert
    if (bellContainer.id === "notificationBell") {
        bellContainer.innerHTML = "";
        bellContainer.appendChild(wrapper);
    } else {
        bellContainer.insertBefore(wrapper, bellContainer.firstChild);
    }

    const btn = wrapper.querySelector(".notif-btn");
    const count = wrapper.querySelector(".notif-count");
    const dropdown = wrapper.querySelector(".notif-dropdown");
    const list = wrapper.querySelector(".notif-list");
    const markAllReadBtn = wrapper.querySelector("#markAllRead");
    let latestItems = [];

    function getNotificationIcon(title) {
        const titleLower = (title || "").toLowerCase();
        if (titleLower.includes("interview")) {
            return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2;color:#176087;flex-shrink:0"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
        }
        if (titleLower.includes("approved") || titleLower.includes("accepted")) {
            return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2;color:#059669;flex-shrink:0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        }
        if (titleLower.includes("rejected")) {
            return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2;color:#DC2626;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>';
        }
        if (titleLower.includes("reminder")) {
            return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2;color:#D97706;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
        }
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;stroke-width:2;color:#176087;flex-shrink:0"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
    }

    function formatTimeAgo(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    }

    async function loadNotifications() {
        try {
            const response = await apiFetch(`/notifications${showUnreadOnly ? "?unread=true" : ""}`);
            const items = response?.data || [];
            latestItems = items;
            const unread = items.filter((item) => !item.isRead).length;

            if (unread > 0) {
                count.style.display = "inline-flex";
                count.textContent = String(unread > 9 ? "9+" : unread);
            } else {
                count.style.display = "none";
            }

            if (!items.length) {
                list.innerHTML = `
                    <div class="notif-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:40px;height:40px;stroke-width:1.5;color:#94A3B8;margin-bottom:8px">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        <p>No recent notifications</p>
                    </div>
                `;
                return;
            }

            list.innerHTML = items.slice(0, 5).map((item) => `
                <button class="notif-item ${item.isRead ? "" : "unread"}" data-id="${item.id}">
                    <div class="notif-icon-wrap">${getNotificationIcon(item.title)}</div>
                    <div class="notif-content">
                        <span class="notif-title">${item.title || "Notification"}</span>
                        <span class="notif-msg">${item.message || ""}</span>
                        <span class="notif-time">${formatTimeAgo(item.createdAt)}</span>
                        ${!item.isRead ? '<span class="notif-item-mark-read" data-action="mark-read" style="margin-top:4px;display:inline-block;color:#176087;font-size:0.75rem;font-weight:600;">Mark as Read</span>' : ""}
                    </div>
                </button>
            `).join("");
        } catch {
            list.innerHTML = '<div class="notif-empty">Unable to load notifications.</div>';
        }
    }

    btn.addEventListener("click", async (event) => {
        event.stopPropagation();
        dropdown.classList.toggle("open");
        if (dropdown.classList.contains("open")) {
            await loadNotifications();
        }
    });

    markAllReadBtn.addEventListener("click", async (event) => {
        event.stopPropagation();
        const unreadItems = latestItems.filter((item) => !item.isRead);
        if (!unreadItems.length) return;
        try {
            try {
                await apiFetch("/notifications/read-all", { method: "PUT" });
            } catch {
                await Promise.all(
                    unreadItems.map((item) => apiFetch(`/notifications/${item.id}/read`, { method: "PUT" }))
                );
            }
            await loadNotifications();
            showToast("Notifications marked as read", "success");
        } catch {
            showToast("Unable to mark notification as read", "error");
        }
    });

    list.addEventListener("click", async (event) => {
        const markBtn = event.target.closest("[data-action='mark-read']");
        if (markBtn) {
            event.stopPropagation();
        }
        const item = event.target.closest(".notif-item");
        if (!item) return;

        const id = item.getAttribute("data-id");
        if (!id) return;

        try {
            await apiFetch(`/notifications/${id}/read`, { method: "PUT" });
            item.classList.remove("unread");
            await loadNotifications();
        } catch {
            showToast("Unable to mark notification as read", "error");
        }
    });

    document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
            dropdown.classList.remove("open");
        }
    });

    loadNotifications();
}

async function apiFetch(path, options = {}) {
    const isAbsoluteUrl = /^https?:\/\//i.test(String(path || ""));
    if (!isAbsoluteUrl && !API_BASE) {
        throw new Error("API base URL is not configured. Set SMART_HIRE_API_BASE.");
    }

    const token = localStorage.getItem("token");
    const endpoint = isAbsoluteUrl ? path : `${API_BASE}${path}`;
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    let rawBody = "";
    try {
        rawBody = await response.text();
    } catch {
        rawBody = "";
    }

    let payload = null;
    try {
        payload = rawBody ? JSON.parse(rawBody) : {};
    } catch {
        payload = {
            success: false,
            message: `Server returned a non-JSON response (HTTP ${response.status})`,
            raw: rawBody.slice(0, 500),
        };
    }

    if (!response.ok || payload?.success === false) {
        const message = payload?.message || `Request failed (HTTP ${response.status})`;
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        error.response = {
            status: response.status,
            data: payload,
        };
        throw error;
    }

    return payload;
}

function injectUserMeta() {
    const user = getStoredUser();
    if (!user) return;

    const name = String(user.name || "User").trim() || "User";
    const initial = getUserInitial(name);
    const role = String(user.role || "").toUpperCase();

    const avatarTargets = document.querySelectorAll(".user-avatar.user-name, .user-avatar[data-user-name]");
    const nameTargets = document.querySelectorAll(".user-name:not(.user-avatar), [data-user-name]:not(.user-avatar)");
    const roleTargets = document.querySelectorAll(".user-role, [data-user-role]");

    avatarTargets.forEach((el) => {
        if (el.querySelector("img")) return;
        el.textContent = initial;
        el.setAttribute("aria-label", `${name} avatar`);
        el.setAttribute("title", name);
    });

    nameTargets.forEach((el) => {
        el.textContent = name;
    });

    roleTargets.forEach((el) => {
        el.textContent = role;
    });
}

function initTopbarMobileNav() {
    const topbars = document.querySelectorAll(".applicant-portal .topbar, .admin-portal .topbar");
    if (!topbars.length) return;

    topbars.forEach((topbar) => {
        const toggle = topbar.querySelector(".mobile-nav-toggle");
        const nav = topbar.querySelector(".topbar-nav");
        if (!toggle || !nav) return;
        if (toggle.dataset.initialized === "true") return;
        toggle.dataset.initialized = "true";

        const closeMenu = () => {
            topbar.classList.remove("mobile-open");
            toggle.setAttribute("aria-expanded", "false");
        };

        toggle.addEventListener("click", () => {
            const isOpen = topbar.classList.toggle("mobile-open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        nav.querySelectorAll("a, button").forEach((item) => {
            item.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("click", (event) => {
            if (!topbar.classList.contains("mobile-open")) return;
            if (!topbar.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            closeMenu();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTopbarMobileNav();
    injectUserMeta();

    document.querySelectorAll(".logout-btn, [data-logout]").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            logout();
        });
    });
});

window.API_BASE = API_BASE;
window.apiFetch = apiFetch;
window.getDashboardForRole = getDashboardForRole;
window.getStoredUser = getStoredUser;
window.isAuthenticated = isAuthenticated;
window.logout = logout;
window.requireRole = requireRole;
window.showToast = showToast;
window.setButtonBusy = setButtonBusy;
window.mountNotificationsBell = mountNotificationsBell;
