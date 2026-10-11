const appState = {
  activeView: "overview", // 'overview' | 'repositories' | 'languages' | 'compare' | 'saved' | 'settings'
  currentUser: null,
  repositories: [],
  repoPage: 1,
  hasMoreRepos: false,
  isLoadingMore: false,
  filteredRepositories: [],
  languages: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  languageFilter: "all",
  topicFilter: "all",
  sortType: "stars",
  viewMode: "grid", // 'grid' | 'list'
  themeMode: "dark", // 'dark' | 'light' | 'system'
  accent: "indigo", // 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose'
  reducedMotion: false,
  rateLimit: { remaining: 60, limit: 60, reset: null },
  activeRepoModal: null,
  activeReadme: null,
  isLoadingReadme: false,
  compareState: {
    user1: null,
    user2: null,
    repos1: [],
    repos2: [],
    loading: false,
    error1: null,
    error2: null,
  },
};

function setActiveView(view) {
  const validViews = ["overview", "repositories", "languages", "compare", "saved", "settings"];
  if (validViews.includes(view)) {
    appState.activeView = view;
  }
}

function setCurrentUser(user) {
  appState.currentUser = user;
  appState.repoPage = 1;
  if (user && user.public_repos > appState.repositories.length) {
    appState.hasMoreRepos = true;
  } else {
    appState.hasMoreRepos = false;
  }
}

function setRepositories(repositories, append = false) {
  if (append) {
    // Prevent duplicates by repo id
    const existingIds = new Set(appState.repositories.map((r) => r.id));
    const newRepos = repositories.filter((r) => !existingIds.has(r.id));
    appState.repositories = [...appState.repositories, ...newRepos];
  } else {
    appState.repositories = repositories || [];
    appState.repoPage = 1;
  }

  if (appState.currentUser) {
    appState.hasMoreRepos = appState.repositories.length < appState.currentUser.public_repos;
  } else {
    appState.hasMoreRepos = false;
  }

  applyRepositoryFilters();
}

function setLanguages(languages) {
  appState.languages = languages;
}

function setLoading(isLoading) {
  appState.isLoading = isLoading;
}

function setError(errorMessage) {
  appState.error = errorMessage;
}

function setRepoSearchQuery(query) {
  appState.searchQuery = (query || "").toLowerCase().trim();
  applyRepositoryFilters();
}

function setRepoLanguageFilter(lang) {
  appState.languageFilter = lang || "all";
  applyRepositoryFilters();
}

function setRepoTopicFilter(topic) {
  appState.topicFilter = topic ? topic.toLowerCase().trim() : "all";
  applyRepositoryFilters();
}

function setSortType(sortType) {
  appState.sortType = sortType || "stars";
  applyRepositoryFilters();
}

function setViewMode(mode) {
  appState.viewMode = mode === "list" ? "list" : "grid";
}

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

function applyRepositoryFilters() {
  let list = [...appState.repositories];

  // Search filter (name, description, topics)
  if (appState.searchQuery) {
    const q = appState.searchQuery;
    list = list.filter((repo) => {
      const nameMatch = repo.name && repo.name.toLowerCase().includes(q);
      const descMatch = repo.description && repo.description.toLowerCase().includes(q);
      const langMatch = repo.language && repo.language.toLowerCase().includes(q);
      const topicsMatch = repo.topics && repo.topics.some((t) => t.toLowerCase().includes(q));
      return nameMatch || descMatch || langMatch || topicsMatch;
    });
  }

  // Language filter
  if (appState.languageFilter && appState.languageFilter !== "all") {
    list = list.filter((repo) => repo.language === appState.languageFilter);
  }

  // Topic filter
  if (appState.topicFilter && appState.topicFilter !== "all") {
    list = list.filter((repo) =>
      repo.topics && repo.topics.some((t) => t.toLowerCase() === appState.topicFilter)
    );
  }

  // Sorting
  switch (appState.sortType) {
    case "stars":
      list.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
      break;
    case "forks":
      list.sort((a, b) => (b.forks_count || 0) - (a.forks_count || 0));
      break;
    case "updated":
      list.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
      break;
    case "created":
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      break;
    case "size":
      list.sort((a, b) => (b.size || 0) - (a.size || 0));
      break;
    case "name":
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      break;
    default:
      break;
  }

  appState.filteredRepositories = list;
  return appState.filteredRepositories;
}