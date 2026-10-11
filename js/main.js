const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");
const sortReposSelect = document.getElementById("sortRepos");
const filterLanguageSelect = document.getElementById("filterLanguage");
const repoSearchInput = document.getElementById("repoSearchInput");
const viewGridBtn = document.getElementById("viewGridBtn");
const viewListBtn = document.getElementById("viewListBtn");
const copyProfileBtn = document.getElementById("copyProfileBtn");

async function handleDeveloperSearch(event) {
  if (event) event.preventDefault();

  const username = sanitizeUsername(usernameInput.value);

  if (!username) {
    clearDeveloperData();
    updateStatus(
      "Username Required",
      "Please enter a GitHub username before searching.",
      "warning"
    );
    showToast("Please enter a username", "error");
    return;
  }

  try {
    setLoading(true);
    setError(null);
    renderSkeletonState();

    updateStatus(
      "Fetching Profile",
      `Connecting to GitHub API to fetch @${username}...`,
      "loading"
    );

    const { user, repositories } = await fetchDeveloperData(username);

    setCurrentUser(user);
    setRepositories(repositories);
    setLanguages(calculateLanguageBreakdown(repositories));

    renderDeveloperOverview(user, repositories);

    updateStatus(
      "Profile Loaded",
      `Showing profile and ${repositories.length} public repositories for ${user.name || user.login}.`,
      "success"
    );
    showToast(`Loaded profile for @${user.login}`, "success");
  } catch (error) {
    setError(error.message);
    clearDeveloperData();
    updateStatus("Unable to Load Profile", error.message, "error");
    showToast(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function triggerSearch(username) {
  if (usernameInput) {
    usernameInput.value = username;
    handleDeveloperSearch();
  }
}

function handleClearRecents() {
  clearRecentSearches();
  renderRecentSearches();
  showToast("Recent searches cleared", "info");
}

// Mobile Navigation Drawer Helpers
const sidebar = document.getElementById("mainSidebar");
const menuOverlay = document.getElementById("menuOverlay");
const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const navLinks = document.querySelectorAll(".sidebar__link");

function openMobileMenu() {
  document.body.classList.add("sidebar-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  document.body.classList.remove("sidebar-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}

function setTheme(themeName) {
  document.body.setAttribute("data-theme", themeName);
  document.querySelectorAll(".theme-dot").forEach((dot) => {
    dot.classList.toggle("active", dot.dataset.theme === themeName);
  });
  showToast(`Theme updated to ${themeName}`, "info");
}

document.addEventListener("DOMContentLoaded", () => {
  renderRecentSearches();

  if (searchForm) {
    searchForm.addEventListener("submit", handleDeveloperSearch);
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

  // View Mode Toggles
  if (viewGridBtn) {
    viewGridBtn.addEventListener("click", () => {
      setViewMode("grid");
      viewGridBtn.classList.add("active");
      if (viewListBtn) viewListBtn.classList.remove("active");
      renderRepositories();
    });
  }

  if (viewListBtn) {
    viewListBtn.addEventListener("click", () => {
      setViewMode("list");
      viewListBtn.classList.add("active");
      if (viewGridBtn) viewGridBtn.classList.remove("active");
      renderRepositories();
    });
  }

  // Copy Profile Link Button
  if (copyProfileBtn) {
    copyProfileBtn.addEventListener("click", () => {
      if (appState.currentUser && appState.currentUser.html_url) {
        copyToClipboard(appState.currentUser.html_url).then(() => {
          showToast("GitHub profile link copied to clipboard!", "success");
        });
      } else {
        showToast("No active developer profile to copy", "info");
      }
    });
  }

  // Theme Selector Buttons
  document.querySelectorAll(".theme-dot").forEach((dot) => {
    dot.addEventListener("click", () => setTheme(dot.dataset.theme));
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
      usernameInput.focus();
      usernameInput.select();
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

  // Preset Chips Event Delegation
  const presetContainer = document.getElementById("presetDevsContainer");
  if (presetContainer) {
    presetContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".preset-chip[data-username]");
      if (chip) {
        triggerSearch(chip.dataset.username);
      }
    });
  }

  // Mobile Menu Events
  if (menuToggle) menuToggle.addEventListener("click", openMobileMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMobileMenu);
  if (menuClose) menuClose.addEventListener("click", closeMobileMenu);

  // Auto Load Initial Developer Profile (from URL query string or default: torvalds)
  const urlParams = new URLSearchParams(window.location.search);
  const userParam = urlParams.get("user") || "torvalds";
  triggerSearch(userParam);

  console.log("GitHub Developer Explorer initialized v2.5");
});