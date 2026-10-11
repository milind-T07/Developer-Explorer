const appState = {
  // Navigation
  activeView: "overview", // 'overview' | 'repositories' | 'compare' | 'saved' | 'settings'

  // Overview Developer Analytics State (Independent)
  overviewUsername: "torvalds",
  currentUser: null,
  overviewRepositories: [],
  repositories: [], // backward-compatible alias for overview developer repos
  overviewLanguages: [],
  languages: [], // backward-compatible alias for overview languages
  isOverviewLoading: false,
  isLoading: false,
  overviewError: null,
  error: null,

  // Global Repository Search State (Completely Independent of Overview)
  repoSearchQuery: "",
  repoSearchResults: [],
  repoSearchTotalCount: 0,
  repoSearchPage: 1,
  repoSearchHasMore: false,
  repoSearchLoading: false,
  repoSearchLoadingMore: false,
  repoSearchError: null,
  repoSearchLanguage: "all",
  repoSearchMinStars: "all",
  repoSearchSort: "best-match", // 'best-match' | 'stars' | 'forks' | 'updated'
  repoSearchLayout: "grid", // 'grid' | 'list'
  repoSearchActiveFilters: [],

  // Theme & Preferences
  themeMode: "dark", // 'dark' | 'light'
  accent: "indigo", // 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose'
  reducedMotion: false,
  viewMode: "grid", // default layout setting

  // API Status & Modals
  rateLimit: { remaining: 60, limit: 60, reset: null },
  activeRepoModal: null,
  activeReadme: null,
  isLoadingReadme: false,

  // Compare Developers State
  compareState: {
    dev1: null,
    dev2: null,
    loading: false,
    error: null,
  },
};

// -----------------------------------------------------------------
// Navigation State
// -----------------------------------------------------------------
function setActiveView(view) {
  const validViews = ["overview", "repositories", "compare", "saved", "settings"];
  // If user requests removed 'languages' view or invalid, redirect to 'overview'
  if (view === "languages" || !validViews.includes(view)) {
    appState.activeView = "overview";
  } else {
    appState.activeView = view;
  }
}

// -----------------------------------------------------------------
// Overview Developer Profile State Handlers
// -----------------------------------------------------------------
function setCurrentUser(user) {
  appState.currentUser = user;
  if (user) {
    appState.overviewUsername = user.login;
  }
}

function setOverviewRepositories(repos) {
  appState.overviewRepositories = repos || [];
  appState.repositories = appState.overviewRepositories; // alias
}

function setOverviewLanguages(langs) {
  appState.overviewLanguages = langs || [];
  appState.languages = appState.overviewLanguages; // alias
}

function setOverviewLoading(isLoading) {
  appState.isOverviewLoading = Boolean(isLoading);
  appState.isLoading = appState.isOverviewLoading;
}

function setOverviewError(errorMessage) {
  appState.overviewError = errorMessage;
  appState.error = errorMessage;
}

// Backward-compatibility shims
function setRepositories(repos) {
  setOverviewRepositories(repos);
}
function setLanguages(langs) {
  setOverviewLanguages(langs);
}
function setLoading(loading) {
  setOverviewLoading(loading);
}
function setError(err) {
  setOverviewError(err);
}

// -----------------------------------------------------------------
// Global Repository Discovery State Handlers
// -----------------------------------------------------------------
function setGlobalRepoQuery(query) {
  appState.repoSearchQuery = (query || "").trim();
}

function setGlobalRepoResults(results, totalCount = 0, append = false) {
  if (append) {
    const existingIds = new Set(appState.repoSearchResults.map((r) => r.id));
    const newItems = (results || []).filter((r) => !existingIds.has(r.id));
    appState.repoSearchResults = [...appState.repoSearchResults, ...newItems];
  } else {
    appState.repoSearchResults = results || [];
    appState.repoSearchPage = 1;
  }

  appState.repoSearchTotalCount = totalCount;
  // GitHub search limits results to the first 1,000 items
  const maxPossible = Math.min(totalCount, 1000);
  appState.repoSearchHasMore = appState.repoSearchResults.length < maxPossible;
}

function setGlobalRepoLoading(isLoading) {
  appState.repoSearchLoading = Boolean(isLoading);
  if (isLoading) {
    appState.repoSearchError = null;
  }
}

function setGlobalRepoLoadingMore(isLoadingMore) {
  appState.repoSearchLoadingMore = Boolean(isLoadingMore);
}

function setGlobalRepoError(errorMessage) {
  appState.repoSearchError = errorMessage;
  appState.repoSearchLoading = false;
  appState.repoSearchLoadingMore = false;
}

function setGlobalRepoFilters({ language, minStars, sort } = {}) {
  if (language !== undefined) appState.repoSearchLanguage = language;
  if (minStars !== undefined) appState.repoSearchMinStars = minStars;
  if (sort !== undefined) appState.repoSearchSort = sort;

  // Compute active filter chips list
  const active = [];
  if (appState.repoSearchLanguage && appState.repoSearchLanguage !== "all") {
    active.push({ type: "language", label: `Language: ${appState.repoSearchLanguage}` });
  }
  if (appState.repoSearchMinStars && appState.repoSearchMinStars !== "all") {
    active.push({ type: "stars", label: `Min Stars: >${appState.repoSearchMinStars}` });
  }
  if (appState.repoSearchSort && appState.repoSearchSort !== "best-match") {
    const sortLabels = { stars: "Most Stars", forks: "Most Forks", updated: "Recently Updated" };
    active.push({ type: "sort", label: `Sort: ${sortLabels[appState.repoSearchSort] || appState.repoSearchSort}` });
  }
  appState.repoSearchActiveFilters = active;
}

function resetGlobalRepoFilters() {
  appState.repoSearchLanguage = "all";
  appState.repoSearchMinStars = "all";
  appState.repoSearchSort = "best-match";
  appState.repoSearchActiveFilters = [];
}

function setGlobalRepoLayout(mode) {
  appState.repoSearchLayout = mode === "list" ? "list" : "grid";
}

// -----------------------------------------------------------------
// Rate Limit & UI Helpers
// -----------------------------------------------------------------
function updateRateLimitInfo(remaining, limit, reset) {
  appState.rateLimit = { remaining, limit, reset };
  const rateLimitEl = document.getElementById("rateLimitText");
  if (rateLimitEl) {
    if (remaining !== undefined && limit !== undefined) {
      rateLimitEl.textContent = `${remaining}/${limit} API calls left`;
      if (remaining === 0) {
        const resetTime = reset ? new Date(reset * 1000).toLocaleTimeString() : "soon";
        rateLimitEl.title = `Rate limit exhausted. Resets at ${resetTime}.`;
      }
    } else {
      rateLimitEl.textContent = "GitHub API Live";
    }
  }
}

function setViewMode(mode) {
  appState.viewMode = mode === "list" ? "list" : "grid";
  appState.repoSearchLayout = appState.viewMode;
}