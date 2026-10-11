const appState = {
  currentUser: null,
  repositories: [],
  filteredRepositories: [],
  languages: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  languageFilter: "all",
  topicFilter: "all",
  sortType: "stars",
  viewMode: "grid", // 'grid' | 'list' | 'table'
  theme: "indigo", // 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose'
  rateLimit: { remaining: 60, limit: 60, reset: null },
  activeRepoModal: null,
  compareUser: null,
  compareRepos: [],
};

function setCurrentUser(user) {
  appState.currentUser = user;
}

function setRepositories(repositories) {
  appState.repositories = repositories;
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
  appState.searchQuery = query.toLowerCase().trim();
  applyRepositoryFilters();
}

function setRepoLanguageFilter(lang) {
  appState.languageFilter = lang;
  applyRepositoryFilters();
}

function setRepoTopicFilter(topic) {
  appState.topicFilter = topic ? topic.toLowerCase().trim() : "all";
  applyRepositoryFilters();
}

function setSortType(sortType) {
  appState.sortType = sortType;
  applyRepositoryFilters();
}

function setViewMode(mode) {
  appState.viewMode = mode;
}

function updateRateLimitInfo(remaining, limit, reset) {
  appState.rateLimit = { remaining, limit, reset };
  const rateLimitEl = document.getElementById("rateLimitText");
  if (rateLimitEl) {
    rateLimitEl.textContent = `${remaining}/${limit} API calls left`;
  }
}

function applyRepositoryFilters() {
  let list = [...appState.repositories];

  // Search filter
  if (appState.searchQuery) {
    list = list.filter((repo) => {
      const nameMatch = repo.name.toLowerCase().includes(appState.searchQuery);
      const descMatch = repo.description && repo.description.toLowerCase().includes(appState.searchQuery);
      const langMatch = repo.language && repo.language.toLowerCase().includes(appState.searchQuery);
      const topicsMatch = repo.topics && repo.topics.some((t) => t.toLowerCase().includes(appState.searchQuery));
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
      list.sort((a, b) => b.stargazers_count - a.stargazers_count);
      break;
    case "forks":
      list.sort((a, b) => b.forks_count - a.forks_count);
      break;
    case "updated":
      list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      break;
    case "size":
      list.sort((a, b) => b.size - a.size);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  appState.filteredRepositories = list;
  return appState.filteredRepositories;
}