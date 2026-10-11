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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function timeAgo(dateString) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
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

function getFallbackText(value, fallback = "Not available") {
  return value && String(value).trim() ? value : fallback;
}

function sanitizeUsername(username) {
  return username ? username.trim().replace(/^@/, "").replace(/\/$/, "") : "";
}

function getLanguageColor(language) {
  if (!language) return "#8b949e";
  if (GITHUB_LANGUAGE_COLORS[language]) {
    return GITHUB_LANGUAGE_COLORS[language];
  }
  // Deterministic fallback color for unknown languages
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

function calculateLanguageBreakdown(repositories) {
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

// Count-up Smooth Animation for Numbers
function animateValue(elementId, start, end, duration = 800) {
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
    // Ease out cubic
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

// Generative Pattern Background SVG based on username string hash
function generateAvatarBannerSvg(username) {
  let hash = 0;
  const name = username || "dev";
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 50) % 360;
  const hue3 = (hue1 + 140) % 360;

  return `
    <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bannerGrad_${name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hue1}, 75%, 28%)" />
          <stop offset="50%" stop-color="hsl(${hue2}, 80%, 18%)" />
          <stop offset="100%" stop-color="hsl(${hue3}, 70%, 12%)" />
        </linearGradient>
        <pattern id="gridPattern_${name}" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" fill="rgba(255, 255, 255, 0.12)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bannerGrad_${name})"/>
      <rect width="100%" height="100%" fill="url(#gridPattern_${name})"/>
      <circle cx="340" cy="20" r="90" fill="hsl(${hue2}, 80%, 50%)" opacity="0.18" filter="blur(20px)" />
      <circle cx="40" cy="120" r="70" fill="hsl(${hue1}, 90%, 60%)" opacity="0.2" filter="blur(25px)" />
    </svg>
  `;
}

// Local Storage helpers for Recent Searches
const RECENT_SEARCHES_KEY = "gh_dev_explorer_recents_v2";

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
    public_repos: user.public_repos,
    followers: user.followers
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
      document.execCommand("copy") ? resolve() : reject();
      textArea.remove();
    });
  }
}