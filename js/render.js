function updateTextContent(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function showToast(message, type = "info", duration = 3200) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  let iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

function updateStatus(title, message, type = "info") {
  const statusCard = document.getElementById("statusCard");
  if (!statusCard) return;

  let iconSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else if (type === "loading") {
    iconSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" class="spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
  }

  statusCard.className = `status-card status-card--${type}`;
  statusCard.innerHTML = `
    <div class="status-card__icon-wrapper">${iconSvg}</div>
    <div>
      <h3 class="status-card__title">${title}</h3>
      <p class="status-card__message">${message}</p>
    </div>
  `;
}

function renderUserStats(user, repositories) {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

  // Smooth Count-Up Animations
  animateValue("publicRepos", 0, user.public_repos);
  animateValue("followers", 0, user.followers);
  animateValue("following", 0, user.following);
  animateValue("totalStars", 0, totalStars);
  animateValue("totalForks", 0, totalForks);

  // Extra Metric highlights inside sidebar / topbar
  updateTextContent("statStarsRatio", repositories.length ? (totalStars / repositories.length).toFixed(1) : "0");
}

function renderUserProfile(user) {
  const avatar = document.getElementById("userAvatar");
  const avatarPlaceholder = document.getElementById("userAvatarPlaceholder");
  const profileLink = document.getElementById("githubProfileLink");
  const cardBanner = document.getElementById("profileBannerBg");

  if (avatar) {
    avatar.src = user.avatar_url;
    avatar.alt = `${user.login}'s avatar`;
    avatar.style.display = "block";
  }

  if (avatarPlaceholder) {
    avatarPlaceholder.style.display = "none";
  }

  if (cardBanner) {
    cardBanner.innerHTML = generateAvatarBannerSvg(user.login);
  }

  if (profileLink) {
    profileLink.href = user.html_url;
  }

  updateTextContent("userName", getFallbackText(user.name, user.login));
  updateTextContent("userUsername", `@${user.login}`);
  updateTextContent("userBio", getFallbackText(user.bio, "No bio provided by this developer."));

  // Details list with icons
  const detailsContainer = document.getElementById("userDetails");
  if (detailsContainer) {
    const blogUrl = user.blog ? (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`) : null;
    const twitterHandle = user.twitter_username ? `@${user.twitter_username}` : null;

    detailsContainer.innerHTML = `
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>${getFallbackText(user.location, "Location not set")}</span>
      </div>
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <span>${getFallbackText(user.company, "Company not specified")}</span>
      </div>
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        ${blogUrl ? `<a href="${blogUrl}" target="_blank" rel="noopener noreferrer" class="profile-link-hover">${user.blog}</a>` : `<span>Website not listed</span>`}
      </div>
      ${twitterHandle ? `
        <div class="profile-card__detail-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          <a href="https://twitter.com/${user.twitter_username}" target="_blank" rel="noopener noreferrer" class="profile-link-hover">${twitterHandle}</a>
        </div>
      ` : ""}
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Joined ${formatDate(user.created_at)}</span>
      </div>
    `;
  }
}

function renderDeveloperOverview(user, repositories) {
  const languageBreakdown = calculateLanguageBreakdown(repositories);

  renderUserProfile(user);
  renderUserStats(user, repositories);
  renderLanguageOptions(repositories);
  renderTopicFilters(repositories);
  renderRepositories();
  renderLanguageBreakdown(languageBreakdown);
  saveRecentSearch(user);
  renderRecentSearches();
}

function createRepositoryCard(repo) {
  const repoDescription = getFallbackText(
    repo.description,
    "No description provided for this repository."
  );
  const repoLanguage = repo.language;
  const langColor = getLanguageColor(repoLanguage);

  const topicsHtml = repo.topics && repo.topics.length
    ? repo.topics.slice(0, 5).map(t => `<button class="repo-card__topic" onclick="filterByTopic('${t}', event)">#${t}</button>`).join("")
    : "";

  const isStarred = repo.stargazers_count > 100;
  const cloneUrl = repo.clone_url || `https://github.com/${repo.full_name}.git`;

  return `
    <article class="repo-card ${isStarred ? 'repo-card--featured' : ''}" data-repo-id="${repo.id}">
      <div class="repo-card__header">
        <div class="repo-card__title-group">
          <svg class="repo-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card__title-link">
            ${repo.name}
          </a>
        </div>
        <div class="repo-card__badges">
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="repo-card__badge repo-card__badge--link" title="Live Demo">Live Demo ↗</a>` : ""}
          <span class="repo-card__badge">${repo.visibility || "public"}</span>
        </div>
      </div>

      <p class="repo-card__description">${repoDescription}</p>

      ${topicsHtml ? `<div class="repo-card__topics">${topicsHtml}</div>` : ""}

      <div class="repo-card__actions-row">
        <button class="repo-card__clone-btn" onclick="copyCloneCommand('${cloneUrl}', event)" title="Copy git clone command">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>git clone</span>
        </button>
        <button class="repo-card__detail-btn" onclick="openRepoModal(${repo.id})" title="View repository breakdown">
          <span>Details</span>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="repo-card__meta">
        ${repoLanguage ? `
          <div class="repo-card__meta-item">
            <span class="language-item__dot" style="background-color: ${langColor};"></span>
            <span>${repoLanguage}</span>
          </div>
        ` : ""}
        <div class="repo-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${formatNumber(repo.stargazers_count)}</span>
        </div>
        <div class="repo-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
          <span>${formatNumber(repo.forks_count)}</span>
        </div>
        <div class="repo-card__meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${timeAgo(repo.updated_at)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderRepositories() {
  const repositoriesGrid = document.getElementById("repositoriesGrid");
  if (!repositoriesGrid) return;

  const repositories = appState.filteredRepositories;

  // Toggle grid vs list vs table view
  repositoriesGrid.className = `repositories-grid repositories-grid--${appState.viewMode}`;

  if (!repositories || !repositories.length) {
    repositoriesGrid.innerHTML = `
      <article class="repo-empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <h4>No repositories match your criteria</h4>
        <p>Try clearing your keyword, language filter, or topic filter.</p>
        <button class="btn btn--secondary" onclick="resetRepoFilters()" style="margin-top: 0.5rem;">Reset Filters</button>
      </article>
    `;
    return;
  }

  repositoriesGrid.innerHTML = repositories
    .map((repo) => createRepositoryCard(repo))
    .join("");
}

function renderLanguageOptions(repositories) {
  const select = document.getElementById("filterLanguage");
  if (!select) return;

  const languages = Array.from(
    new Set(repositories.map((r) => r.language).filter(Boolean))
  ).sort();

  select.innerHTML = `<option value="all">All Languages (${repositories.length})</option>` +
    languages.map(lang => `<option value="${lang}">${lang}</option>`).join("");
}

function renderTopicFilters(repositories) {
  const container = document.getElementById("topicFilterContainer");
  if (!container) return;

  const topicCounts = {};
  repositories.forEach((r) => {
    if (r.topics && Array.isArray(r.topics)) {
      r.topics.forEach((t) => {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
    }
  });

  const sortedTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (!sortedTopics.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <span class="topic-filter__label">Popular Topics:</span>
    <button class="topic-chip ${appState.topicFilter === 'all' ? 'active' : ''}" onclick="filterByTopic('all')">All</button>
    ${sortedTopics.map(([t, count]) => `
      <button class="topic-chip ${appState.topicFilter === t.toLowerCase() ? 'active' : ''}" onclick="filterByTopic('${t}')">
        #${t} <span class="topic-chip__count">${count}</span>
      </button>
    `).join("")}
  `;
}

function renderLanguageBreakdown(languageBreakdown) {
  const languageList = document.getElementById("languageList");
  const segmentedBar = document.getElementById("segmentedLangBar");
  if (!languageList) return;

  if (!languageBreakdown || !languageBreakdown.length) {
    languageList.innerHTML = `<p class="empty-text">No language data available for this developer.</p>`;
    if (segmentedBar) segmentedBar.innerHTML = "";
    return;
  }

  // Multi-colored segmented progress bar
  if (segmentedBar) {
    segmentedBar.innerHTML = languageBreakdown
      .map(
        (item) => `
        <div class="segmented-bar__item" style="width: ${item.percentage}%; background-color: ${item.color};" title="${item.language}: ${item.percentage}%"></div>
      `
      )
      .join("");
  }

  languageList.innerHTML = languageBreakdown
    .map((item) => `
      <div class="language-item">
        <div class="language-item__header">
          <div class="language-item__meta">
            <span class="language-item__dot" style="background-color: ${item.color};"></span>
            <span class="language-item__name">${item.language}</span>
          </div>
          <span class="language-item__percentage">${item.percentage}% (${item.count} ${item.count === 1 ? 'repo' : 'repos'})</span>
        </div>
        <div class="language-item__track">
          <div class="language-item__bar" style="width: ${item.percentage}%; background-color: ${item.color};"></div>
        </div>
      </div>
    `)
    .join("");
}

function renderRecentSearches() {
  const container = document.getElementById("recentSearches");
  if (!container) return;

  const recents = getRecentSearches();
  if (!recents.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="recent-searches__header">
      <span class="recent-searches__title">Recent Searches:</span>
      <button class="recent-searches__clear" onclick="handleClearRecents()" title="Clear search history">Clear</button>
    </div>
    <div class="recent-searches__chips">
      ${recents
        .map(
          (dev) => `
        <button class="preset-chip" onclick="triggerSearch('${dev.login}')">
          <img src="${dev.avatar_url}" class="preset-chip__avatar" alt="${dev.login}" />
          <span>${dev.login}</span>
        </button>
      `
        )
        .join("")}
    </div>
  `;
}

function renderSkeletonState() {
  const repositoriesGrid = document.getElementById("repositoriesGrid");
  if (repositoriesGrid) {
    repositoriesGrid.innerHTML = Array(6)
      .fill(0)
      .map(
        () => `
      <div class="repo-card skeleton" style="height: 200px;"></div>
    `
      )
      .join("");
  }
}

function copyCloneCommand(cloneUrl, event) {
  if (event) event.stopPropagation();
  const cmd = `git clone ${cloneUrl}`;
  copyToClipboard(cmd).then(() => {
    showToast(`Copied: ${cmd}`, "success");
  });
}

function filterByTopic(topic, event) {
  if (event) event.stopPropagation();
  setRepoTopicFilter(topic);
  renderRepositories();
  renderTopicFilters(appState.repositories);
  showToast(`Filtered by topic #${topic}`, "info");
}

function resetRepoFilters() {
  setRepoSearchQuery("");
  setRepoLanguageFilter("all");
  setRepoTopicFilter("all");
  const searchInput = document.getElementById("repoSearchInput");
  const langSelect = document.getElementById("filterLanguage");
  if (searchInput) searchInput.value = "";
  if (langSelect) langSelect.value = "all";
  renderRepositories();
  renderTopicFilters(appState.repositories);
}

function openRepoModal(repoId) {
  const repo = appState.repositories.find((r) => r.id === repoId);
  if (!repo) return;

  const modal = document.getElementById("repoDetailModal");
  const modalContent = document.getElementById("repoModalBody");
  if (!modal || !modalContent) return;

  const langColor = getLanguageColor(repo.language);
  const topicsHtml = repo.topics && repo.topics.length
    ? repo.topics.map((t) => `<span class="modal-topic">#${t}</span>`).join("")
    : "No topics assigned.";

  modalContent.innerHTML = `
    <div class="modal-header">
      <div class="modal-header__title-wrapper">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <div>
          <h2 class="modal-title">${repo.name}</h2>
          <p class="modal-subtitle">${repo.full_name}</p>
        </div>
      </div>
      <button class="modal-close-btn" onclick="closeRepoModal()">&times;</button>
    </div>

    <div class="modal-body-scroll">
      <p class="modal-description">${getFallbackText(repo.description, "No detailed description available.")}</p>

      <div class="modal-stats-grid">
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Primary Language</span>
          <div class="modal-stat-box__value">
            <span class="language-item__dot" style="background-color: ${langColor};"></span>
            ${repo.language || "N/A"}
          </div>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Stars</span>
          <span class="modal-stat-box__value">${formatNumber(repo.stargazers_count)}</span>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Forks</span>
          <span class="modal-stat-box__value">${formatNumber(repo.forks_count)}</span>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Open Issues</span>
          <span class="modal-stat-box__value">${formatNumber(repo.open_issues_count)}</span>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Size</span>
          <span class="modal-stat-box__value">${formatNumber(repo.size)} KB</span>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Default Branch</span>
          <span class="modal-stat-box__value mono">${repo.default_branch || "main"}</span>
        </div>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Topics & Tags</h4>
        <div class="modal-topics-list">${topicsHtml}</div>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Clone Command</h4>
        <div class="modal-code-box">
          <code>git clone ${repo.clone_url || `https://github.com/${repo.full_name}.git`}</code>
          <button class="btn btn--secondary btn--sm" onclick="copyCloneCommand('${repo.clone_url}', event)">Copy</button>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="btn btn--secondary">Visit Live Site ↗</a>` : ""}
      <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn--primary">View on GitHub ↗</a>
    </div>
  `;

  modal.classList.add("open");
}

function closeRepoModal() {
  const modal = document.getElementById("repoDetailModal");
  if (modal) modal.classList.remove("open");
}

function clearDeveloperData() {
  updateTextContent("publicRepos", "0");
  updateTextContent("followers", "0");
  updateTextContent("following", "0");
  updateTextContent("totalStars", "0");
  updateTextContent("totalForks", "0");

  updateTextContent("userName", "Developer Name");
  updateTextContent("userUsername", "@username");
  updateTextContent("userBio", "Search for a GitHub username to load developer profile insights.");

  const avatar = document.getElementById("userAvatar");
  const avatarPlaceholder = document.getElementById("userAvatarPlaceholder");
  if (avatar) avatar.style.display = "none";
  if (avatarPlaceholder) avatarPlaceholder.style.display = "flex";

  const detailsContainer = document.getElementById("userDetails");
  if (detailsContainer) detailsContainer.innerHTML = "";

  const repositoriesGrid = document.getElementById("repositoriesGrid");
  if (repositoriesGrid) {
    repositoriesGrid.innerHTML = `
      <article class="repo-empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h4>No developer profile loaded</h4>
        <p>Enter a username above or choose a preset to start exploring.</p>
      </article>
    `;
  }

  const languageList = document.getElementById("languageList");
  if (languageList) {
    languageList.innerHTML = `<p class="empty-text">Language usage will appear after searching a developer.</p>`;
  }
}