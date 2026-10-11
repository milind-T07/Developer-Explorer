async function handleGitHubResponse(response) {
  // Read Rate Limit Headers if present
  const limit = response.headers.get("X-RateLimit-Limit");
  const remaining = response.headers.get("X-RateLimit-Remaining");
  const reset = response.headers.get("X-RateLimit-Reset");

  if (limit && remaining) {
    updateRateLimitInfo(parseInt(remaining, 10), parseInt(limit, 10), parseInt(reset, 10));
  }

  if (response.status === 404) {
    throw new Error("No GitHub developer profile found with that username.");
  }

  if (response.status === 403) {
    const resetDate = reset ? new Date(reset * 1000).toLocaleTimeString() : "later";
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate}.`);
  }

  if (!response.ok) {
    throw new Error(`GitHub API Error (${response.status}): ${response.statusText}`);
  }

  return response.json();
}

async function fetchGitHubUser(username) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) {
    throw new Error("Please enter a valid GitHub username.");
  }

  const response = await fetch(API_ENDPOINTS.user(cleanUsername));
  return handleGitHubResponse(response);
}

async function fetchUserRepositories(username) {
  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) {
    throw new Error("Please enter a valid GitHub username.");
  }

  const response = await fetch(API_ENDPOINTS.repositories(cleanUsername));
  return handleGitHubResponse(response);
}

async function fetchDeveloperData(username) {
  const user = await fetchGitHubUser(username);
  const repositories = await fetchUserRepositories(username);

  return {
    user,
    repositories,
  };
}