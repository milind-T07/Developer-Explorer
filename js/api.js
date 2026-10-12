// In-memory response cache to respect GitHub rate limits
const apiCache = new Map();

// Active abort controller for ongoing primary searches
let currentSearchAbortController = null;

function getCachedData(key) {
  const entry = apiCache.get(key);
  if (!entry) return null;
  const isExpired = Date.now() - entry.timestamp > (APP_CONFIG.cacheTtlMs || 300000);
  if (isExpired) {
    apiCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedData(key, data) {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error("Request timed out. Please check your internet connection."));
  }, timeoutMs);

  // Link external signal if provided
  if (options.signal) {
    options.signal.addEventListener("abort", () => {
      controller.abort(options.signal.reason);
      clearTimeout(timeoutId);
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError" && error.message.includes("timed out")) {
      throw new Error("Request timed out (GitHub API did not respond within 12s).");
    }
    throw error;
  }
}

async function handleGitHubResponse(response) {
  // Read Rate Limit Headers
  const limit = response.headers.get("X-RateLimit-Limit");
  const remaining = response.headers.get("X-RateLimit-Remaining");
  const reset = response.headers.get("X-RateLimit-Reset");

  if (limit !== null && remaining !== null) {
    updateRateLimitInfo(parseInt(remaining, 10), parseInt(limit, 10), reset ? parseInt(reset, 10) : null);
  }

  if (response.status === 404) {
    throw new Error("No public GitHub developer profile found with that handle.");
  }

  if (response.status === 403) {
    const resetDate = reset ? new Date(parseInt(reset, 10) * 1000).toLocaleTimeString() : "in a few minutes";
    throw new Error(`GitHub API rate limit reached (60 calls/hr unauthenticated). Rate limit resets at ${resetDate}.`);
  }

  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status}): ${response.statusText || "Unable to retrieve data."}`);
  }

  return response.json();
}

async function fetchGitHubUser(username, signal) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) {
    throw new Error("Please enter a valid GitHub username.");
  }

  const cacheKey = `user_${cleanUsername.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const url = API_ENDPOINTS.user(cleanUsername);
  const response = await fetchWithTimeout(url, { signal }, APP_CONFIG.timeoutMs);
  const data = await handleGitHubResponse(response);

  setCachedData(cacheKey, data);
  return data;
}

async function fetchUserRepositories(username, page = 1, perPage = 100, signal) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) {
    throw new Error("Please enter a valid GitHub username.");
  }

  const cacheKey = `repos_${cleanUsername.toLowerCase()}_p${page}_${perPage}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const url = API_ENDPOINTS.repositories(cleanUsername, page, perPage);
  const response = await fetchWithTimeout(url, { signal }, APP_CONFIG.timeoutMs);
  const data = await handleGitHubResponse(response);

  if (Array.isArray(data)) {
    setCachedData(cacheKey, data);
    return data;
  }
  return [];
}

async function fetchDeveloperData(username) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) {
    throw new Error("Please enter a valid GitHub username.");
  }

  // Cancel prior active search if still running
  if (currentSearchAbortController) {
    currentSearchAbortController.abort("New search initiated");
  }
  currentSearchAbortController = new AbortController();
  const signal = currentSearchAbortController.signal;

  try {
    // Parallel fetch for user profile and initial 100 repositories
    const [user, repositories] = await Promise.all([
      fetchGitHubUser(cleanUsername, signal),
      fetchUserRepositories(cleanUsername, 1, APP_CONFIG.reposPerPage || 100, signal)
    ]);

    return { user, repositories };
  } finally {
    currentSearchAbortController = null;
  }
}

async function fetchMoreRepositories(username, page) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) return [];
  return fetchUserRepositories(cleanUsername, page, APP_CONFIG.reposPerPage || 100);
}

async function fetchRepoReadme(owner, repo) {
  const cacheKey = `readme_${owner.toLowerCase()}_${repo.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  try {
    const url = API_ENDPOINTS.readme(owner, repo);
    // Request raw markdown directly via GitHub Accept header
    const response = await fetchWithTimeout(url, {
      headers: {
        Accept: "application/vnd.github.raw+json"
      }
    }, 8000);

    if (response.status === 404) {
      setCachedData(cacheKey, "");
      return "";
    }

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    setCachedData(cacheKey, text);
    return text;
  } catch (err) {
    console.warn("Could not retrieve README:", err);
    return null;
  }
}

async function fetchUserContributions(username, signal) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) return null;

  const cacheKey = `contrib_${cleanUsername.toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = API_ENDPOINTS.contributions(cleanUsername);
    const response = await fetchWithTimeout(url, { signal }, 8000);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data && (data.total !== undefined || Array.isArray(data.contributions))) {
      setCachedData(cacheKey, data);
      return data;
    }
    return null;
  } catch (err) {
    console.warn(`Could not retrieve contribution stats for ${cleanUsername}:`, err);
    return null;
  }
}

async function fetchDeveloperComparison(user1, user2) {
  const clean1 = sanitizeUsername(user1);
  const clean2 = sanitizeUsername(user2);

  if (!clean1 || !clean2) {
    throw new Error("Please provide two GitHub handles to compare.");
  }

  // Parallel fetch using Promise.allSettled so that if one fails or contributions fail, the other can still show
  const [res1, res2, contrib1, contrib2] = await Promise.allSettled([
    Promise.all([fetchGitHubUser(clean1), fetchUserRepositories(clean1, 1, 100)]),
    Promise.all([fetchGitHubUser(clean2), fetchUserRepositories(clean2, 1, 100)]),
    fetchUserContributions(clean1),
    fetchUserContributions(clean2)
  ]);

  return {
    dev1: res1.status === "fulfilled"
      ? {
          user: res1.value[0],
          repositories: res1.value[1],
          contributions: contrib1.status === "fulfilled" ? contrib1.value : null,
          error: null
        }
      : { user: null, repositories: [], contributions: null, error: res1.reason.message },
    dev2: res2.status === "fulfilled"
      ? {
          user: res2.value[0],
          repositories: res2.value[1],
          contributions: contrib2.status === "fulfilled" ? contrib2.value : null,
          error: null
        }
      : { user: null, repositories: [], contributions: null, error: res2.reason.message },
  };
}

// -------------------------------------------------------------
// GLOBAL GITHUB REPOSITORY SEARCH API
// -------------------------------------------------------------
let globalRepoAbortController = null;

async function searchGlobalRepositories(query, { language = "all", minStars = "all", sort = "best-match", page = 1, perPage = 30 } = {}) {
  const trimmed = (query || "").trim();
  if (!trimmed) {
    throw new Error("Please enter keywords, topics, or technologies to search repositories.");
  }

  // Cancel prior in-flight search if still running
  if (globalRepoAbortController) {
    globalRepoAbortController.abort("New global search initiated");
  }
  globalRepoAbortController = new AbortController();
  const signal = globalRepoAbortController.signal;

  // Build GitHub query qualifiers safely
  let fullQuery = trimmed;
  if (language && language !== "all") {
    fullQuery += ` language:${language}`;
  }
  if (minStars && minStars !== "all") {
    fullQuery += ` stars:>=${minStars}`;
  }

  // Map sort parameter
  let apiSort = "";
  const order = "desc";
  if (sort === "stars") {
    apiSort = "stars";
  } else if (sort === "forks") {
    apiSort = "forks";
  } else if (sort === "updated") {
    apiSort = "updated";
  }

  const cacheKey = `global_search_${fullQuery.toLowerCase()}_${apiSort}_p${page}_${perPage}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = API_ENDPOINTS.searchRepositories(fullQuery, page, perPage, apiSort, order);
    const response = await fetchWithTimeout(url, { signal }, APP_CONFIG.timeoutMs || 12000);
    const data = await handleGitHubResponse(response);

    if (data && Array.isArray(data.items)) {
      setCachedData(cacheKey, data);
      return data;
    }
    return { total_count: 0, items: [] };
  } finally {
    globalRepoAbortController = null;
  }
}