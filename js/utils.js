// Storage Keys
const RECENT_SEARCHES_KEY = "gh_dev_explorer_recents_v2";
const BOOKMARKS_KEY = "gh_dev_explorer_bookmarks_v1";
const SETTINGS_KEY = "gh_dev_explorer_settings_v1";

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNumber(value) {
  if (value === undefined || value === null) return "0";
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return Number(value).toLocaleString();
}

function formatDate(dateString) {
  if (!dateString) return "Not available";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function getAccountAge(dateString) {
  if (!dateString) return "";
  const created = new Date(dateString);
  if (isNaN(created.getTime())) return "";
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 1) return "< 1 month old";
  if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? "s" : ""} old`;
  const fullYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  return `${fullYears} yr${fullYears > 1 ? "s" : ""}${remainingMonths > 0 ? ` ${remainingMonths} mo` : ""} on GitHub`;
}

function getFallbackText(value, fallback = "Not available") {
  return value && String(value).trim() ? value : fallback;
}

function sanitizeUsername(username) {
  return username ? username.trim().replace(/^@/, "").replace(/\/$/, "") : "";
}

function getLanguageColor(language) {
  if (!language) return GITHUB_LANGUAGE_COLORS.Default || "#8b949e";
  if (GITHUB_LANGUAGE_COLORS[language]) {
    return GITHUB_LANGUAGE_COLORS[language];
  }
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

function calculateLanguageBreakdown(repositories) {
  if (!repositories || !repositories.length) return [];
  const languageCounts = repositories.reduce((accumulator, repo) => {
    if (!repo.language) return accumulator;
    accumulator[repo.language] = (accumulator[repo.language] || 0) + 1;
    return accumulator;
  }, {});

  const totalLanguageRepos = Object.values(languageCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  if (totalLanguageRepos === 0) return [];

  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / totalLanguageRepos) * 100),
      color: getLanguageColor(language),
    }))
    .sort((a, b) => b.count - a.count);
}

function animateValue(elementId, start, end, duration = 650) {
  const obj = document.getElementById(elementId);
  if (!obj) return;
  if (start === end || isNaN(end)) {
    obj.textContent = formatNumber(end);
    return;
  }

  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easedProgress * (end - start) + start);
    obj.textContent = formatNumber(currentValue);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = formatNumber(end);
    }
  };
  window.requestAnimationFrame(step);
}

function generateAvatarBannerSvg(username) {
  let hash = 0;
  const name = username || "dev";
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 55) % 360;
  const hue3 = (hue1 + 130) % 360;

  return `
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bannerGrad_${escapeHtml(name)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hue1}, 70%, 25%)" />
          <stop offset="50%" stop-color="hsl(${hue2}, 75%, 16%)" />
          <stop offset="100%" stop-color="hsl(${hue3}, 65%, 10%)" />
        </linearGradient>
        <pattern id="gridPattern_${escapeHtml(name)}" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.25" fill="rgba(255, 255, 255, 0.1)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bannerGrad_${escapeHtml(name)})"/>
      <rect width="100%" height="100%" fill="url(#gridPattern_${escapeHtml(name)})"/>
      <circle cx="330" cy="25" r="90" fill="hsl(${hue2}, 80%, 55%)" opacity="0.22" filter="blur(24px)" />
      <circle cx="50" cy="115" r="75" fill="hsl(${hue1}, 85%, 60%)" opacity="0.2" filter="blur(26px)" />
    </svg>
  `;
}

// Local Storage helpers: Recent Searches
function getRecentSearches() {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveRecentSearch(user) {
  if (!user || !user.login) return;
  let recents = getRecentSearches();
  recents = recents.filter((item) => item.login.toLowerCase() !== user.login.toLowerCase());
  recents.unshift({
    login: user.login,
    name: user.name || user.login,
    avatar_url: user.avatar_url,
    public_repos: user.public_repos || 0,
    followers: user.followers || 0,
    searchedAt: new Date().toISOString()
  });
  if (recents.length > 8) {
    recents = recents.slice(0, 8);
  }
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recents));
  } catch (e) {}
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {}
}

// Local Storage helpers: Bookmarked Profiles
function getBookmarks() {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function isBookmarked(login) {
  if (!login) return false;
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.login.toLowerCase() === login.toLowerCase());
}

function saveBookmark(user) {
  if (!user || !user.login) return false;
  let bookmarks = getBookmarks();
  const exists = bookmarks.some((b) => b.login.toLowerCase() === user.login.toLowerCase());
  if (exists) {
    // Unbookmark
    bookmarks = bookmarks.filter((b) => b.login.toLowerCase() !== user.login.toLowerCase());
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {}
    return false;
  } else {
    // Add bookmark
    bookmarks.unshift({
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      bio: user.bio || "",
      public_repos: user.public_repos || 0,
      followers: user.followers || 0,
      savedAt: new Date().toISOString()
    });
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {}
    return true;
  }
}

function removeBookmark(login) {
  if (!login) return;
  let bookmarks = getBookmarks();
  bookmarks = bookmarks.filter((b) => b.login.toLowerCase() !== login.toLowerCase());
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {}
}

// Local Storage helpers: Settings
function getSavedSettings() {
  const defaults = {
    mode: "dark", // 'dark' | 'light' | 'system'
    accent: "indigo", // 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose'
    viewMode: "grid", // 'grid' | 'list'
    reducedMotion: false
  };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (e) {
    return defaults;
  }
}

function saveUserSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

function clearAllUserData() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (e) {}
}

// Clipboard copy helper
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand("copy") ? resolve() : reject(new Error("Copy command failed"));
      textArea.remove();
    });
  }
}

// File download helper
function downloadFile(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// CSV Export Generator
function exportProfileAsCsv(user, repositories) {
  if (!user) return;
  const repos = repositories || [];

  const headers = [
    "Repository Name",
    "Description",
    "Primary Language",
    "Stargazers",
    "Forks",
    "Open Issues",
    "Size (KB)",
    "Default Branch",
    "Visibility",
    "Updated At",
    "Created At",
    "GitHub URL"
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = repos.map((r) => [
    escapeCsv(r.name),
    escapeCsv(r.description || ""),
    escapeCsv(r.language || ""),
    r.stargazers_count,
    r.forks_count,
    r.open_issues_count,
    r.size,
    escapeCsv(r.default_branch || "main"),
    escapeCsv(r.visibility || "public"),
    escapeCsv(r.updated_at),
    escapeCsv(r.created_at),
    escapeCsv(r.html_url)
  ].join(","));

  const metaHeader = [
    `# GitHub Developer Analytics Report for @${user.login}`,
    `# Name: ${user.name || user.login}`,
    `# Total Public Repos: ${user.public_repos}`,
    `# Retrieved Repos: ${repos.length}`,
    `# Followers: ${user.followers} | Following: ${user.following}`,
    `# Export Date: ${new Date().toISOString()}`,
    ""
  ].join("\n");

  const csvContent = metaHeader + headers.join(",") + "\n" + rows.join("\n");
  downloadFile(`${user.login}_repositories.csv`, csvContent, "text/csv;charset=utf-8;");
}

// JSON Export Generator
function exportProfileAsJson(user, repositories) {
  if (!user) return;
  const repos = repositories || [];
  const languageBreakdown = calculateLanguageBreakdown(repos);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  const exportData = {
    metadata: {
      generatedBy: "DevExplorer - GitHub Analytics",
      generatedAt: new Date().toISOString(),
      note: "Retrieved public repository analytics via GitHub REST API"
    },
    developer: {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      twitter_username: user.twitter_username,
      public_repos: user.public_repos,
      public_gists: user.public_gists,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
      updated_at: user.updated_at
    },
    analytics: {
      retrievedRepositoriesCount: repos.length,
      totalStarsAcrossRetrievedRepos: totalStars,
      totalForksAcrossRetrievedRepos: totalForks,
      languageDistribution: languageBreakdown
    },
    repositories: repos.map((r) => ({
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      open_issues_count: r.open_issues_count,
      size: r.size,
      default_branch: r.default_branch,
      topics: r.topics || [],
      homepage: r.homepage,
      created_at: r.created_at,
      updated_at: r.updated_at
    }))
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(`${user.login}_github_analytics.json`, jsonContent, "application/json");
}

// Global Repository Search CSV Export Generator
function exportGlobalRepositoriesAsCsv(query, repositories) {
  const repos = repositories || [];
  const headers = [
    "Repository Name",
    "Owner",
    "Description",
    "Primary Language",
    "Stargazers",
    "Forks",
    "Open Issues",
    "Visibility",
    "Last Updated",
    "GitHub URL"
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = repos.map((r) => [
    escapeCsv(r.name),
    escapeCsv(r.owner ? r.owner.login : ""),
    escapeCsv(r.description || ""),
    escapeCsv(r.language || ""),
    r.stargazers_count || 0,
    r.forks_count || 0,
    r.open_issues_count || 0,
    escapeCsv(r.visibility || "public"),
    escapeCsv(r.updated_at),
    escapeCsv(r.html_url)
  ].join(","));

  const metaHeader = [
    `# GitHub Repository Discovery Export for "${query || 'all'}"`,
    `# Results Exported: ${repos.length}`,
    `# Export Date: ${new Date().toISOString()}`,
    ""
  ].join("\n");

  const safeQuery = (query || "repositories").replace(/[^a-z0-9_-]/gi, "_");
  const csvContent = metaHeader + headers.join(",") + "\n" + rows.join("\n");
  downloadFile(`github_discovery_${safeQuery}.csv`, csvContent, "text/csv;charset=utf-8;");
}

// Global Repository Search JSON Export Generator
function exportGlobalRepositoriesAsJson(query, repositories, totalCount = 0) {
  const repos = repositories || [];
  const exportData = {
    metadata: {
      generatedBy: "DevExplorer - Repository Discovery",
      generatedAt: new Date().toISOString(),
      query: query,
      totalMatchesOnGitHub: totalCount,
      exportedCount: repos.length
    },
    repositories: repos.map((r) => ({
      name: r.name,
      full_name: r.full_name,
      owner: r.owner ? { login: r.owner.login, avatar_url: r.owner.avatar_url, html_url: r.owner.html_url } : null,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      open_issues_count: r.open_issues_count,
      visibility: r.visibility,
      topics: r.topics || [],
      homepage: r.homepage,
      created_at: r.created_at,
      updated_at: r.updated_at
    }))
  };

  const safeQuery = (query || "repositories").replace(/[^a-z0-9_-]/gi, "_");
  const jsonContent = JSON.stringify(exportData, null, 2);
  downloadFile(`github_discovery_${safeQuery}.json`, jsonContent, "application/json");
}

// Markdown Summary Generator
function generateProfileMarkdownSummary(user, repositories) {
  if (!user) return "";
  const repos = repositories || [];
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const langBreakdown = calculateLanguageBreakdown(repos).slice(0, 5);
  const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);

  const langList = langBreakdown.map((l) => `${l.language} (${l.percentage}%)`).join(", ") || "None";
  const repoList = topRepos.map((r) => `- [${r.name}](${r.html_url}) — ⭐ ${formatNumber(r.stargazers_count)}: ${r.description || "No description"}`).join("\n");

  return `### GitHub Analytics: ${user.name || user.login} (@${user.login})
- **Profile:** [github.com/${user.login}](${user.html_url})
- **Public Repositories:** ${user.public_repos} (analyzed: ${repos.length})
- **Community:** 👥 ${formatNumber(user.followers)} followers • Following ${formatNumber(user.following)}
- **Impact:** ⭐ ${formatNumber(totalStars)} total stars • 🍴 ${formatNumber(totalForks)} forks
- **Top Languages:** ${langList}

#### Notable Repositories
${repoList || "No public repositories available."}

*Report generated by DevExplorer (${new Date().toLocaleDateString()})*`;
}

// Safe basic markdown parser for README preview
function parseMarkdownBasic(md) {
  if (!md) return "<p>No content available.</p>";

  // Clean raw string
  let html = md.replace(/\r\n/g, "\n");

  // Code blocks (triple backticks)
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="readme-pre"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_, code) => `<code class="readme-code">${escapeHtml(code)}</code>`);

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="readme-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="readme-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="readme-h1">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="readme-link">$1</a>');

  // Unordered list items
  html = html.replace(/^\s*[-*+]\s+(.*)$/gim, '<li class="readme-li">$1</li>');

  // Paragraphs
  const paragraphs = html.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      p = p.trim();
      if (!p) return "";
      if (p.startsWith("<h") || p.startsWith("<pre") || p.startsWith("<li")) return p;
      return `<p class="readme-p">${p}</p>`;
    })
    .join("\n");
}