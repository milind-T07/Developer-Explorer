// DOM References
const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const searchSubmitBtn = document.getElementById("searchSubmitBtn");
const sortReposSelect = document.getElementById("sortRepos");
const filterLanguageSelect = document.getElementById("filterLanguage");
const repoSearchInput = document.getElementById("repoSearchInput");
const viewGridBtn = document.getElementById("viewGridBtn");
const viewListBtn = document.getElementById("viewListBtn");
const copyProfileBtn = document.getElementById("copyProfileBtn");
const bookmarkProfileBtn = document.getElementById("bookmarkProfileBtn");
const shareProfileBtn = document.getElementById("shareProfileBtn");
const copySummaryBtn = document.getElementById("copySummaryBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const printReportBtn = document.getElementById("printReportBtn");
const modeToggleBtn = document.getElementById("modeToggleBtn");

// Mobile Drawer Elements
const sidebar = document.getElementById("mainSidebar");
const menuOverlay = document.getElementById("menuOverlay");
const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");

let lastSearchedUsername = "";

// -------------------------------------------------------------
// NAVIGATION & VIEW ROUTING
// -------------------------------------------------------------
const VIEW_TITLES = {
  overview: "Overview Dashboard",
  repositories: "Repositories Explorer",
  languages: "Programming Language Analytics",
  compare: "Compare Developers",
  saved: "Saved Profiles & History",
  settings: "Application Settings",
};

function switchView(viewName) {
  let targetView = viewName ? viewName.replace(/^#/, "") : "overview";
  if (targetView.includes("?")) {
    targetView = targetView.split("?")[0];
  }
  const validViews = ["overview", "repositories", "languages", "compare", "saved", "settings"];
  const activeView = validViews.includes(targetView) ? targetView : "overview";

  setActiveView(activeView);

  // Update URL Hash and query cleanly without duplicate parameter strings
  const currentUrl = new URL(window.location.origin + window.location.pathname);
  if (appState.currentUser && appState.currentUser.login) {
    currentUrl.searchParams.set("user", appState.currentUser.login);
  }
  currentUrl.hash = `#${activeView}`;
  history.replaceState(null, "", currentUrl.toString());

  // Update View Sections Visibility
  document.querySelectorAll(".view-section").forEach((sec) => {
    sec.classList.remove("active");
  });
  const currentSection = document.getElementById(`view-${activeView}`);
  if (currentSection) {
    currentSection.classList.add("active");
  }

  // Update Sidebar Links
  document.querySelectorAll(".sidebar__link").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === activeView);
  });

  // Update Topbar Title
  const titleEl = document.getElementById("activeViewTitle");
  if (titleEl) {
    titleEl.textContent = VIEW_TITLES[activeView] || "Developer Explorer";
  }

  // Render view-specific content and status banners
  if (activeView === "repositories") {
    renderRepositories();
  } else if (activeView === "languages") {
    if (appState.repositories && appState.repositories.length) {
      renderLanguagesView(appState.repositories);
    } else {
      updateSectionStatus("lang", "Programming Language Analytics", "Load a developer profile in Overview to view language distribution.", "info");
    }
  } else if (activeView === "saved") {
    renderBookmarksView();
    renderHistoryView();
  } else if (activeView === "settings") {
    updateSectionStatus("settings", "Preferences Configured Successfully", "Application settings and visual preferences are loaded from browser storage.", "success");
  } else if (activeView === "compare") {
    if (appState.compareState && appState.compareState.dev1) {
      renderCompareView(appState.compareState);
    } else {
      updateSectionStatus("compare", "Head-to-Head Analytics Ready", "Enter any two GitHub handles below or select a preset to generate a real-time comparison.", "info");
    }
  }

  // Close mobile drawer on route change
  closeMobileMenu();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// -------------------------------------------------------------
// PRIMARY DEVELOPER SEARCH
// -------------------------------------------------------------
async function handleDeveloperSearch(event) {
  if (event) event.preventDefault();

  const rawInput = usernameInput ? usernameInput.value : "";
  const username = sanitizeUsername(rawInput);

  if (!username) {
    clearDeveloperData();
    updateStatus(
      "Username Required",
      "Please enter a valid GitHub developer handle.",
      "warning"
    );
    showToast("Please enter a username", "warning");
    return;
  }

  // Prevent duplicate concurrent requests for the same user
  if (appState.isLoading && username.toLowerCase() === lastSearchedUsername.toLowerCase()) {
    return;
  }

  try {
    setLoading(true);
    setError(null);
    lastSearchedUsername = username;

    if (searchSubmitBtn) searchSubmitBtn.disabled = true;
    updateSearchButtonLoading(true);
    renderSkeletonState();

    updateStatus(
      "Connecting to GitHub",
      `Querying GitHub REST API for @${username}...`,
      "loading"
    );

    const { user, repositories } = await fetchDeveloperData(username);

    setCurrentUser(user);
    setRepositories(repositories);
    setLanguages(calculateLanguageBreakdown(repositories));

    renderDeveloperOverview(user, repositories);

    // Update query string in URL cleanly
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("user", user.login);
    url.hash = `#${appState.activeView || "overview"}`;
    history.replaceState(null, "", url.toString());

    updateStatus(
      "Profile Loaded",
      `Retrieved ${repositories.length} public repositories for @${user.login}.`,
      "success"
    );

    showToast(`Loaded analytics for @${user.login}`, "success");
  } catch (error) {
    setError(error.message);
    clearDeveloperData();
    updateStatus("Unable to Load Profile", error.message, "error", true);
    showToast(error.message, "error");
  } finally {
    setLoading(false);
    if (searchSubmitBtn) searchSubmitBtn.disabled = false;
    updateSearchButtonLoading(false);
  }
}

function updateSearchButtonLoading(loading) {
  const text = document.getElementById("searchBtnText");
  const icon = document.getElementById("searchBtnIcon");
  if (!text || !icon) return;

  if (loading) {
    text.textContent = "Loading...";
    icon.classList.add("spin");
  } else {
    text.textContent = "Explore";
    icon.classList.remove("spin");
  }
}

function triggerSearch(username) {
  if (usernameInput) {
    usernameInput.value = username;
    updateClearButtonVisibility();
    handleDeveloperSearch();
  }
}

function retryLastSearch() {
  if (lastSearchedUsername) {
    triggerSearch(lastSearchedUsername);
  }
}

// -------------------------------------------------------------
// REPOSITORY PAGINATION (LOAD MORE)
// -------------------------------------------------------------
async function handleLoadMoreRepositories() {
  if (!appState.currentUser || appState.isLoadingMore || !appState.hasMoreRepos) return;

  appState.isLoadingMore = true;
  renderRepositories();

  try {
    const nextPage = (appState.repoPage || 1) + 1;
    const moreRepos = await fetchMoreRepositories(appState.currentUser.login, nextPage);

    if (moreRepos && moreRepos.length) {
      appState.repoPage = nextPage;
      setRepositories(moreRepos, true);
      renderLanguageOptions(appState.repositories);
      renderTopicFilters(appState.repositories);
      renderRepositories();
      renderLanguageBreakdown(calculateLanguageBreakdown(appState.repositories));
      renderLanguagesView(appState.repositories);
      showToast(`Fetched ${moreRepos.length} additional repositories`, "success");
    } else {
      appState.hasMoreRepos = false;
      renderRepositories();
    }
  } catch (err) {
    showToast(`Failed to load more repositories: ${err.message}`, "error");
  } finally {
    appState.isLoadingMore = false;
    renderRepositories();
  }
}

// -------------------------------------------------------------
// DEVELOPER COMPARISON
// -------------------------------------------------------------
async function handleCompareSubmit(event) {
  if (event) event.preventDefault();

  const user1Input = document.getElementById("compareUser1Input");
  const user2Input = document.getElementById("compareUser2Input");
  const submitBtn = document.getElementById("compareSubmitBtn");
  const container = document.getElementById("compareMatrixContainer");

  const u1 = sanitizeUsername(user1Input ? user1Input.value : "");
  const u2 = sanitizeUsername(user2Input ? user2Input.value : "");

  if (!u1 || !u2) {
    showToast("Please enter two developer usernames to compare", "warning");
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  if (container) {
    container.innerHTML = `
      <div class="empty-card">
        <span class="spin" style="font-size:2rem;">⏳</span>
        <h4>Comparing @${escapeHtml(u1)} and @${escapeHtml(u2)}</h4>
        <p>Fetching metrics and public repositories...</p>
      </div>
    `;
  }

  try {
    const result = await fetchDeveloperComparison(u1, u2);
    appState.compareState = result;
    renderCompareView(result);
    showToast(`Compared @${u1} vs @${u2}`, "success");
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function handlePresetCompare(dev1, dev2) {
  const user1Input = document.getElementById("compareUser1Input");
  const user2Input = document.getElementById("compareUser2Input");
  if (user1Input) user1Input.value = dev1;
  if (user2Input) user2Input.value = dev2;
  switchView("compare");
  handleCompareSubmit();
}

function swapCompareUsers() {
  const user1Input = document.getElementById("compareUser1Input");
  const user2Input = document.getElementById("compareUser2Input");
  if (user1Input && user2Input) {
    const temp = user1Input.value;
    user1Input.value = user2Input.value;
    user2Input.value = temp;
    if (user1Input.value && user2Input.value) {
      handleCompareSubmit();
    }
  }
}

// -------------------------------------------------------------
// BOOKMARKS & HISTORY HANDLERS
// -------------------------------------------------------------
function handleToggleBookmark() {
  if (!appState.currentUser) {
    showToast("Load a developer profile first to bookmark them", "info");
    return;
  }
  const isSavedNow = saveBookmark(appState.currentUser);
  updateBookmarkButtonState(isSavedNow);
  renderBookmarksView();
  showToast(
    isSavedNow
      ? `Saved @${appState.currentUser.login} to bookmarks!`
      : `Removed @${appState.currentUser.login} from bookmarks.`,
    isSavedNow ? "success" : "info"
  );
}

function handleRemoveBookmark(login) {
  removeBookmark(login);
  renderBookmarksView();
  if (appState.currentUser && appState.currentUser.login.toLowerCase() === login.toLowerCase()) {
    updateBookmarkButtonState(false);
  }
  showToast(`Removed @${login} from bookmarks`, "info");
}

function handleClearRecents() {
  clearRecentSearches();
  renderRecentSearches();
  renderHistoryView();
  showToast("Search history cleared", "info");
}

// -------------------------------------------------------------
// SETTINGS & THEME CUSTOMIZATION
// -------------------------------------------------------------
function applyThemeMode(mode) {
  document.body.setAttribute("data-mode", mode);
  const darkIcon = document.getElementById("modeIconDark");
  const lightIcon = document.getElementById("modeIconLight");

  if (mode === "light") {
    if (darkIcon) darkIcon.style.display = "none";
    if (lightIcon) lightIcon.style.display = "inline-block";
  } else {
    if (darkIcon) darkIcon.style.display = "inline-block";
    if (lightIcon) lightIcon.style.display = "none";
  }

  // Update settings pills
  document.querySelectorAll("#settingsModePills .radio-pill-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const settings = getSavedSettings();
  settings.mode = mode;
  saveUserSettings(settings);
  if (typeof updateSectionStatus === "function") {
    updateSectionStatus("settings", "Preferences Configured Successfully", `Interface switched to ${mode} mode and saved.`, "success");
  }
}

function applyAccentTone(accent) {
  document.body.setAttribute("data-theme", accent);

  document.querySelectorAll(".theme-dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.theme === accent);
  });

  const settings = getSavedSettings();
  settings.accent = accent;
  saveUserSettings(settings);
  if (typeof updateSectionStatus === "function") {
    updateSectionStatus("settings", "Preferences Configured Successfully", `Accent theme updated to ${accent} and saved.`, "success");
  }
}

function applyReducedMotion(enabled) {
  document.body.classList.toggle("reduced-motion", enabled);
  const text = document.getElementById("reducedMotionStatusText");
  if (text) text.textContent = enabled ? "Enabled" : "Disabled";

  const settings = getSavedSettings();
  settings.reducedMotion = enabled;
  saveUserSettings(settings);
  if (typeof updateSectionStatus === "function") {
    updateSectionStatus("settings", "Preferences Configured Successfully", `Reduced motion is ${enabled ? "enabled" : "disabled"} and saved.`, "success");
  }
}

function applyDefaultLayout(layout) {
  setViewMode(layout);
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.classList.toggle("active", layout === "grid");
    viewListBtn.classList.toggle("active", layout === "list");
  }
  document.querySelectorAll("#settingsLayoutPills .radio-pill-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.layout === layout);
  });
  renderRepositories();

  const settings = getSavedSettings();
  settings.viewMode = layout;
  saveUserSettings(settings);
  if (typeof updateSectionStatus === "function") {
    updateSectionStatus("settings", "Preferences Configured Successfully", `Default repository view set to ${layout} layout.`, "success");
  }
}

function toggleThemeMode() {
  const currentMode = document.body.getAttribute("data-mode") || "dark";
  const newMode = currentMode === "light" ? "dark" : "light";
  applyThemeMode(newMode);
  showToast(`Switched to ${newMode} mode`, "info");
}

// -------------------------------------------------------------
// EXPORT & SHARING
// -------------------------------------------------------------
function handleShareProfile() {
  if (!appState.currentUser) {
    showToast("No active developer profile to share", "info");
    return;
  }
  const shareUrl = `${window.location.origin}${window.location.pathname}?user=${appState.currentUser.login}${window.location.hash}`;
  copyToClipboard(shareUrl).then(() => {
    showToast("Shareable profile link copied to clipboard!", "success");
  });
}

function handleCopySummary() {
  if (!appState.currentUser) {
    showToast("No active developer profile loaded", "info");
    return;
  }
  const summary = generateProfileMarkdownSummary(appState.currentUser, appState.repositories);
  copyToClipboard(summary).then(() => {
    showToast("Markdown executive summary copied to clipboard!", "success");
  });
}

function handleExportCsv() {
  if (!appState.currentUser) {
    showToast("No active profile loaded to export", "info");
    return;
  }
  exportProfileAsCsv(appState.currentUser, appState.repositories);
  showToast(`Exported ${appState.repositories.length} repositories to CSV`, "success");
}

function handleExportJson() {
  if (!appState.currentUser) {
    showToast("No active profile loaded to export", "info");
    return;
  }
  exportProfileAsJson(appState.currentUser, appState.repositories);
  showToast("Exported complete profile analytics to JSON", "success");
}

function handlePrintReport() {
  if (!appState.currentUser) {
    showToast("Load a developer profile first to print report", "info");
    return;
  }
  window.print();
}

// -------------------------------------------------------------
// MOBILE DRAWER
// -------------------------------------------------------------
function openMobileMenu() {
  document.body.classList.add("sidebar-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  document.body.classList.remove("sidebar-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}

function updateClearButtonVisibility() {
  if (!searchClearBtn || !usernameInput) return;
  searchClearBtn.style.display = usernameInput.value.length > 0 ? "flex" : "none";
}

// -------------------------------------------------------------
// APPLICATION INITIALIZATION
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Load and apply saved user settings
  const settings = getSavedSettings();
  applyThemeMode(settings.mode || "dark");
  applyAccentTone(settings.accent || "indigo");
  applyReducedMotion(Boolean(settings.reducedMotion));
  applyDefaultLayout(settings.viewMode || "grid");

  // Render presets & initial states
  renderPresetChips();
  renderComparePresets();
  renderRecentSearches();
  renderBookmarksView();
  renderHistoryView();

  // Search Form Submit
  if (searchForm) {
    searchForm.addEventListener("submit", handleDeveloperSearch);
  }

  // Clear Input Button
  if (usernameInput) {
    usernameInput.addEventListener("input", updateClearButtonVisibility);
  }
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      if (usernameInput) {
        usernameInput.value = "";
        updateClearButtonVisibility();
        usernameInput.focus();
      }
    });
  }

  // Live Repo Search Input
  if (repoSearchInput) {
    repoSearchInput.addEventListener("input", (e) => {
      setRepoSearchQuery(e.target.value);
      renderRepositories();
    });
  }

  // Language Filter Dropdown
  if (filterLanguageSelect) {
    filterLanguageSelect.addEventListener("change", (e) => {
      setRepoLanguageFilter(e.target.value);
      renderRepositories();
    });
  }

  // Sort Repos Dropdown
  if (sortReposSelect) {
    sortReposSelect.addEventListener("change", (e) => {
      setSortType(e.target.value);
      renderRepositories();
    });
  }

  // Layout View Toggles
  if (viewGridBtn) {
    viewGridBtn.addEventListener("click", () => applyDefaultLayout("grid"));
  }
  if (viewListBtn) {
    viewListBtn.addEventListener("click", () => applyDefaultLayout("list"));
  }

  // Compare Form & Controls
  const compareForm = document.getElementById("compareForm");
  if (compareForm) {
    compareForm.addEventListener("submit", handleCompareSubmit);
  }
  const swapBtn = document.getElementById("swapCompareBtn");
  if (swapBtn) {
    swapBtn.addEventListener("click", swapCompareUsers);
  }

  // Global Action Buttons
  if (bookmarkProfileBtn) {
    bookmarkProfileBtn.addEventListener("click", handleToggleBookmark);
  }
  if (shareProfileBtn) {
    shareProfileBtn.addEventListener("click", handleShareProfile);
  }
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener("click", handleCopySummary);
  }
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", handleExportCsv);
  }
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click", handleExportJson);
  }
  if (printReportBtn) {
    printReportBtn.addEventListener("click", handlePrintReport);
  }
  if (copyProfileBtn) {
    copyProfileBtn.addEventListener("click", () => {
      if (appState.currentUser && appState.currentUser.html_url) {
        copyToClipboard(appState.currentUser.html_url).then(() => {
          showToast("Profile URL copied to clipboard", "success");
        });
      }
    });
  }

  // Mode Toggle in Sidebar
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener("click", toggleThemeMode);
  }

  // Accent selector click handlers
  document.querySelectorAll(".theme-dot").forEach((dot) => {
    dot.addEventListener("click", () => applyAccentTone(dot.dataset.theme));
  });

  // Settings Mode & Layout Radio Pills
  document.querySelectorAll("#settingsModePills .radio-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyThemeMode(btn.dataset.mode));
  });
  document.querySelectorAll("#settingsLayoutPills .radio-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyDefaultLayout(btn.dataset.layout));
  });

  // Reduced motion toggle in settings
  const toggleMotionBtn = document.getElementById("toggleReducedMotionBtn");
  if (toggleMotionBtn) {
    toggleMotionBtn.addEventListener("click", () => {
      const isCurrentlyReduced = document.body.classList.contains("reduced-motion");
      applyReducedMotion(!isCurrentlyReduced);
      showToast(`Reduced motion ${!isCurrentlyReduced ? "enabled" : "disabled"}`, "info");
    });
  }

  // Settings Reset & Clear All Data
  const resetSettingsBtn = document.getElementById("resetSettingsBtn");
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", () => {
      saveUserSettings({
        mode: "dark",
        accent: "indigo",
        viewMode: "grid",
        reducedMotion: false
      });
      applyThemeMode("dark");
      applyAccentTone("indigo");
      applyReducedMotion(false);
      applyDefaultLayout("grid");
      showToast("Settings restored to defaults", "success");
    });
  }

  const clearAllDataBtn = document.getElementById("clearAllDataBtn");
  if (clearAllDataBtn) {
    clearAllDataBtn.addEventListener("click", () => {
      clearAllUserData();
      renderBookmarksView();
      renderHistoryView();
      renderRecentSearches();
      showToast("All cached data and bookmarks deleted", "info");
    });
  }

  // Saved Profiles Tabs (Bookmarks vs History)
  const tabBookmarksBtn = document.getElementById("tabBookmarksBtn");
  const tabHistoryBtn = document.getElementById("tabHistoryBtn");
  const bookmarksContainer = document.getElementById("bookmarksContainer");
  const historyContainer = document.getElementById("historyContainer");

  if (tabBookmarksBtn && tabHistoryBtn && bookmarksContainer && historyContainer) {
    tabBookmarksBtn.addEventListener("click", () => {
      tabBookmarksBtn.classList.add("active");
      tabHistoryBtn.classList.remove("active");
      bookmarksContainer.style.display = "block";
      historyContainer.style.display = "none";
    });
    tabHistoryBtn.addEventListener("click", () => {
      tabHistoryBtn.classList.add("active");
      tabBookmarksBtn.classList.remove("active");
      bookmarksContainer.style.display = "none";
      historyContainer.style.display = "block";
    });
  }

  const clearAllHistoryBtn = document.getElementById("clearAllHistoryBtn");
  if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener("click", handleClearRecents);
  }

  // Navigation Links Click Handling
  document.querySelectorAll(".sidebar__link, .section-header__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        switchView(href);
      }
    });
  });

  // Popstate / Hashchange support
  window.addEventListener("hashchange", () => {
    switchView(window.location.hash);
  });

  // Modal Backdrop Click Close
  const repoModal = document.getElementById("repoDetailModal");
  if (repoModal) {
    repoModal.addEventListener("click", (e) => {
      if (e.target === repoModal) {
        closeRepoModal();
      }
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement !== usernameInput) {
      e.preventDefault();
      if (usernameInput) {
        usernameInput.focus();
        usernameInput.select();
      }
    } else if (e.key === "Escape") {
      if (repoModal && repoModal.classList.contains("open")) {
        closeRepoModal();
      } else if (document.body.classList.contains("sidebar-open")) {
        closeMobileMenu();
      } else if (document.activeElement === usernameInput) {
        usernameInput.blur();
      }
    }
  });

  // Featured Presets delegation
  const presetContainer = document.getElementById("presetDevsContainer");
  if (presetContainer) {
    presetContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".preset-chip[data-username]");
      if (chip) {
        triggerSearch(chip.dataset.username);
      }
    });
  }

  // Mobile Menu Drawer Events
  if (menuToggle) menuToggle.addEventListener("click", openMobileMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMobileMenu);
  if (menuClose) menuClose.addEventListener("click", closeMobileMenu);

  // Initialize Route from Hash
  const initialHash = window.location.hash || "#overview";
  switchView(initialHash);

  // Auto-load Developer Profile from URL Query or default preset
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get("user") || APP_CONFIG.defaultUsername || "torvalds";
  triggerSearch(userParam);

  console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} initialized successfully.`);
});