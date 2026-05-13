const publicJobsState = {
  jobs: [],
  page: 1,
  total: 0,
  totalPages: 1,
  limit: 9,
  hasNextPage: false,
  loading: false,
  filtersLoaded: false,
  appliedJobIds: new Set(),
};

const publicJobsElements = {
  grid: document.getElementById("publicJobsGrid"),
  count: document.getElementById("publicJobsCount"),
  search: document.getElementById("publicSearch"),
  location: document.getElementById("publicLocationFilter"),
  category: document.getElementById("publicCategoryFilter"),
  employmentType: document.getElementById("publicEmploymentTypeFilter"),
  loadMore: document.getElementById("loadMoreJobsBtn"),
  authModal: document.getElementById("authPromptModal"),
  loginCta: document.getElementById("authPromptLogin"),
  signupCta: document.getElementById("authPromptSignup"),
  closeAuthModal: document.getElementById("authPromptClose"),
};

let searchDebounceTimer = null;

function getStoredRoleUpper() {
  const role = getStoredUser()?.role;
  return String(role || "").toUpperCase();
}

function getPublicJobsParams() {
  const params = new URLSearchParams();
  params.set("page", String(publicJobsState.page));
  params.set("limit", String(publicJobsState.limit));

  const searchValue = publicJobsElements.search.value.trim();
  const locationValue = publicJobsElements.location.value;
  const categoryValue = publicJobsElements.category.value;
  const employmentTypeValue = publicJobsElements.employmentType.value;

  if (searchValue) params.set("search", searchValue);
  if (locationValue) params.set("location", locationValue);
  if (categoryValue) params.set("category", categoryValue);
  if (employmentTypeValue) params.set("employmentType", employmentTypeValue);

  return params.toString();
}

function formatDateShort(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeText(value) {
  return String(value || "")
    .replace(/[<>&]/g, "")
    .trim();
}

function setCountLabel() {
  const total = publicJobsState.total || 0;
  publicJobsElements.count.textContent =
    total === 1 ? "1 public job found" : `${total} public jobs found`;
}

function renderStateMessage(message) {
  publicJobsElements.grid.innerHTML = `<div class="public-state">${message}</div>`;
}

function renderSkeletons() {
  publicJobsElements.grid.innerHTML = Array.from({ length: 6 })
    .map(() => '<div class="public-skeleton" aria-hidden="true"></div>')
    .join("");
}

function renderJobs() {
  if (!publicJobsState.jobs.length) {
    renderStateMessage("No active jobs match these filters yet.");
    return;
  }

  publicJobsElements.grid.innerHTML = publicJobsState.jobs
    .map((job) => {
      const isApplied = publicJobsState.appliedJobIds.has(job.id);
      const safeTitle = normalizeText(job.title || "Untitled job");
      const safeCompany = normalizeText(job.company || "Confidential company");
      const safeLocation = normalizeText(job.location || "Location not specified");
      const safeSalary = normalizeText(job.salary || "Competitive");
      const safeDescription = normalizeText(job.shortDescription || "No description available.");
      const safeCategory = normalizeText(job.category || "General");
      const safeEmploymentType = normalizeText(job.employmentType || "Full-time");
      const safeDate = formatDateShort(job.createdAt);

      return `
        <article class="public-job-card">
          <div class="public-job-top">
            <div>
              <h3 class="public-job-title">${safeTitle}</h3>
              <p class="public-job-company">${safeCompany}</p>
            </div>
            <span class="public-job-category">${safeCategory}</span>
          </div>
          <div class="public-job-meta">
            <span>${safeLocation}</span>
            <span>${safeSalary}</span>
            <span>${safeEmploymentType}</span>
          </div>
          <p class="public-job-description">${safeDescription}</p>
          <div class="public-job-actions">
            <span class="public-job-date">Posted ${safeDate}</span>
            <button
              type="button"
              class="public-apply-btn"
              data-job-id="${job.id}"
              ${isApplied ? "disabled" : ""}
            >
              ${isApplied ? "Already Applied" : "Apply"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  publicJobsElements.grid.querySelectorAll(".public-apply-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-job-id");
      if (!jobId) return;
      void handleApply(jobId, button);
    });
  });
}

function renderLoadMoreButton() {
  const hasMore = publicJobsState.hasNextPage && !publicJobsState.loading;
  publicJobsElements.loadMore.hidden = !hasMore;
}

function updateFilterOptions(selectElement, options, selectedValue) {
  const retained = selectedValue || "";
  selectElement.innerHTML =
    selectElement === publicJobsElements.location
      ? '<option value="">All locations</option>'
      : selectElement === publicJobsElements.category
        ? '<option value="">All categories</option>'
        : '<option value="">All types</option>';

  options.forEach((value) => {
    const safeValue = normalizeText(value);
    if (!safeValue) return;
    const option = document.createElement("option");
    option.value = safeValue;
    option.textContent = safeValue;
    selectElement.appendChild(option);
  });

  if (retained) {
    selectElement.value = retained;
  }
}

function hydrateFilterOptions(filters) {
  if (!filters || publicJobsState.filtersLoaded) return;
  updateFilterOptions(publicJobsElements.location, filters.locations || [], publicJobsElements.location.value);
  updateFilterOptions(publicJobsElements.category, filters.categories || [], publicJobsElements.category.value);
  updateFilterOptions(
    publicJobsElements.employmentType,
    filters.employmentTypes || [],
    publicJobsElements.employmentType.value
  );
  publicJobsState.filtersLoaded = true;
}

async function loadMyApplicationsIfApplicant() {
  if (!isAuthenticated() || getStoredRoleUpper() !== "APPLICANT") {
    publicJobsState.appliedJobIds = new Set();
    return;
  }

  try {
    const response = await apiFetch("/applications/my");
    const applications = response?.data || [];
    publicJobsState.appliedJobIds = new Set(applications.map((item) => item.jobId).filter(Boolean));
  } catch {
    publicJobsState.appliedJobIds = new Set();
  }
}

async function fetchPublicJobs(reset = false) {
  if (publicJobsState.loading) return;
  publicJobsState.loading = true;

  if (reset) {
    publicJobsState.page = 1;
    publicJobsState.jobs = [];
    renderSkeletons();
  }

  try {
    const query = getPublicJobsParams();
    const response = await apiFetch(`/public/jobs?${query}`);
    const payload = response?.data || {};
    const incomingJobs = payload.jobs || [];

    if (reset) {
      publicJobsState.jobs = incomingJobs;
    } else {
      publicJobsState.jobs = [...publicJobsState.jobs, ...incomingJobs];
    }

    publicJobsState.total = payload.total || publicJobsState.jobs.length;
    publicJobsState.totalPages = payload.totalPages || 1;
    publicJobsState.hasNextPage = Boolean(payload.hasNextPage);

    hydrateFilterOptions(payload.filters);
    setCountLabel();
    renderJobs();
  } catch (error) {
    publicJobsState.jobs = [];
    publicJobsState.total = 0;
    setCountLabel();
    renderStateMessage(error.message || "Unable to load jobs right now.");
  } finally {
    publicJobsState.loading = false;
    renderLoadMoreButton();
  }
}

function openAuthPrompt() {
  publicJobsElements.authModal.classList.add("open");
  publicJobsElements.authModal.setAttribute("aria-hidden", "false");
}

function closeAuthPrompt() {
  publicJobsElements.authModal.classList.remove("open");
  publicJobsElements.authModal.setAttribute("aria-hidden", "true");
}

function configureAuthLinks() {
  const redirect = encodeURIComponent(window.location.href);
  publicJobsElements.loginCta.href = `login.html?redirect=${redirect}`;
  publicJobsElements.signupCta.href = `register.html?redirect=${redirect}`;
}

async function handleApply(jobId, buttonElement) {
  if (!jobId) return;

  if (!isAuthenticated()) {
    sessionStorage.setItem("publicJobsPendingApply", jobId);
    openAuthPrompt();
    return;
  }

  const role = getStoredRoleUpper();
  if (role !== "APPLICANT") {
    showToast("Only applicant accounts can apply. Please log in as an applicant.", "error");
    return;
  }

  buttonElement.disabled = true;
  const previousText = buttonElement.textContent;
  buttonElement.textContent = "Applying...";

  try {
    await apiFetch("/applications", {
      method: "POST",
      body: JSON.stringify({ jobId }),
    });

    publicJobsState.appliedJobIds.add(jobId);
    showToast("Application submitted successfully.", "success");
    renderJobs();
  } catch (error) {
    buttonElement.disabled = false;
    buttonElement.textContent = previousText;
    showToast(error.message || "Unable to submit your application.", "error");
  }
}

function bindFilters() {
  publicJobsElements.search.addEventListener("input", () => {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      void fetchPublicJobs(true);
    }, 250);
  });

  [publicJobsElements.location, publicJobsElements.category, publicJobsElements.employmentType].forEach((select) => {
    select.addEventListener("change", () => {
      void fetchPublicJobs(true);
    });
  });

  publicJobsElements.loadMore.addEventListener("click", () => {
    if (!publicJobsState.hasNextPage || publicJobsState.loading) return;
    publicJobsState.page += 1;
    void fetchPublicJobs(false);
  });
}

function bindAuthPrompt() {
  publicJobsElements.closeAuthModal.addEventListener("click", closeAuthPrompt);
  publicJobsElements.authModal.addEventListener("click", (event) => {
    if (event.target === publicJobsElements.authModal) {
      closeAuthPrompt();
    }
  });
}

function handlePendingApplyHint() {
  const pendingApplyJobId = sessionStorage.getItem("publicJobsPendingApply");
  if (!pendingApplyJobId) return;

  if (isAuthenticated() && getStoredRoleUpper() === "APPLICANT") {
    showToast("You are logged in. Click Apply on your selected job.", "info");
    sessionStorage.removeItem("publicJobsPendingApply");
    return;
  }

  if (isAuthenticated() && getStoredRoleUpper() !== "APPLICANT") {
    showToast("This account cannot apply. Use an applicant account.", "error");
    sessionStorage.removeItem("publicJobsPendingApply");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  configureAuthLinks();
  bindFilters();
  bindAuthPrompt();
  await loadMyApplicationsIfApplicant();
  handlePendingApplyHint();
  await fetchPublicJobs(true);
});
