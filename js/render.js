function updateTextContent(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  let iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else if (type === "warning") {
    iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

function updateStatus(title, message, type = "info", retryAction = null) {
  const statusCard = document.getElementById("statusCard");
  const statusIcon = document.getElementById("statusCardIcon");
  const statusTitle = document.getElementById("statusTitle");
  const statusMessage = document.getElementById("statusMessage");
  const statusActions = document.getElementById("statusActions");

  if (!statusCard) return;

  statusCard.className = `status-card status-card--${type}`;
  if (statusTitle) statusTitle.textContent = title;
  if (statusMessage) statusMessage.textContent = message;

  let iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else if (type === "loading") {
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
  }

  if (statusIcon) statusIcon.innerHTML = iconSvg;

  if (statusActions) {
    if (retryAction) {
      statusActions.innerHTML = `<button class="status-card__retry-btn" onclick="retryLastSearch()">Retry Search</button>`;
    } else {
      statusActions.innerHTML = "";
    }
  }
}

function updateSectionStatus(sectionPrefix, title, message, type = "info") {
  const card = document.getElementById(`${sectionPrefix}StatusCard`);
  const icon = document.getElementById(`${sectionPrefix}StatusIcon`);
  const titleEl = document.getElementById(`${sectionPrefix}StatusTitle`);
  const msgEl = document.getElementById(`${sectionPrefix}StatusMessage`);

  if (!card) return;
  card.style.display = "flex";
  card.className = `status-card status-card--${type}`;
  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  let iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "warning") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else if (type === "loading") {
    iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;
  }

  if (icon) icon.innerHTML = iconSvg;
}

function updateBookmarkButtonState(isSaved) {
  const btn = document.getElementById("bookmarkProfileBtn");
  const text = document.getElementById("bookmarkBtnText");
  if (!btn) return;
  if (isSaved) {
    btn.classList.add("active");
    if (text) text.textContent = "Saved";
  } else {
    btn.classList.remove("active");
    if (text) text.textContent = "Save";
  }
}

function renderUserStats(user, repositories) {
  const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);

  animateValue("publicRepos", 0, user.public_repos || 0);
  animateValue("followers", 0, user.followers || 0);
  animateValue("following", 0, user.following || 0);
  animateValue("totalStars", 0, totalStars);
  animateValue("totalForks", 0, totalForks);

  const disclaimer = document.getElementById("statsDisclaimerText");
  if (disclaimer) {
    if (user.public_repos > repositories.length) {
      disclaimer.textContent = `* Showing initial ${repositories.length} of ${user.public_repos} total public repos. Click 'Load More' in Repositories to fetch more.`;
    } else {
      disclaimer.textContent = `* Derived from all ${repositories.length} public repositories.`;
    }
  }
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
  updateTextContent("userBio", getFallbackText(user.bio, "No public biography provided."));

  // Profile metadata items
  const detailsContainer = document.getElementById("userDetails");
  if (detailsContainer) {
    const blogUrl = user.blog ? (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`) : null;
    const twitterHandle = user.twitter_username ? `@${user.twitter_username}` : null;
    const accountAgeText = getAccountAge(user.created_at);

    detailsContainer.innerHTML = `
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>${escapeHtml(getFallbackText(user.location, "Location not set"))}</span>
      </div>
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        <span>${escapeHtml(getFallbackText(user.company, "Independent Developer"))}</span>
      </div>
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        ${blogUrl ? `<a href="${escapeHtml(blogUrl)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary); text-decoration:underline;">${escapeHtml(user.blog)}</a>` : `<span>Website not listed</span>`}
      </div>
      ${twitterHandle ? `
        <div class="profile-card__detail-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          <a href="https://twitter.com/${escapeHtml(user.twitter_username)}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);">${escapeHtml(twitterHandle)}</a>
        </div>
      ` : ""}
      <div class="profile-card__detail-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Joined ${formatDate(user.created_at)} ${accountAgeText ? `(${accountAgeText})` : ""}</span>
      </div>
    `;
  }

  // Update bookmark button state
  updateBookmarkButtonState(isBookmarked(user.login));
}

function renderTopReposShowcase(repositories) {
  const container = document.getElementById("topReposShowcase");
  if (!container) return;

  if (!repositories || !repositories.length) {
    container.innerHTML = `<p class="empty-text">No repositories available to showcase.</p>`;
    return;
  }

  const topRepos = [...repositories]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 4);

  container.innerHTML = topRepos
    .map((repo) => {
      const langColor = getLanguageColor(repo.language);
      return `
        <article class="top-repo-card" onclick="openRepoModal(${repo.id})" style="cursor:pointer;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <h4 class="top-repo-card__name font-heading">${escapeHtml(repo.name)}</h4>
            <span class="repo-card__badge">${repo.visibility || "public"}</span>
          </div>
          <p class="top-repo-card__desc">${escapeHtml(getFallbackText(repo.description, "No description provided."))}</p>
          <div class="top-repo-card__meta">
            ${repo.language ? `
              <div style="display:flex; align-items:center; gap:0.35rem;">
                <span class="language-item__dot" style="background-color: ${langColor};"></span>
                <span>${escapeHtml(repo.language)}</span>
              </div>
            ` : ""}
            <div style="display:flex; align-items:center; gap:0.3rem;">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${formatNumber(repo.stargazers_count)}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.3rem;">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
              <span>${formatNumber(repo.forks_count)}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function createRepositoryCard(repo) {
  const repoDescription = getFallbackText(
    repo.description,
    "No description provided for this repository."
  );
  const repoLanguage = repo.language;
  const langColor = getLanguageColor(repoLanguage);

  const topicsHtml = repo.topics && repo.topics.length
    ? repo.topics.slice(0, 5).map(t => `<button type="button" class="repo-card__topic" onclick="filterByTopicTag('${escapeHtml(t)}', event)">#${escapeHtml(t)}</button>`).join("")
    : "";

  const isStarred = (repo.stargazers_count || 0) > 100;
  const cloneUrl = repo.clone_url || `https://github.com/${repo.full_name || repo.name}.git`;
  const owner = repo.owner || {};
  const ownerLogin = owner.login || "";
  const ownerAvatar = owner.avatar_url || "";
  const openIssues = repo.open_issues_count !== undefined && repo.open_issues_count !== null ? repo.open_issues_count : null;

  return `
    <article class="repo-card ${isStarred ? 'repo-card--featured' : ''}" data-repo-id="${repo.id}">
      ${ownerLogin ? `
        <div class="repo-card__owner">
          ${ownerAvatar ? `<img src="${escapeHtml(ownerAvatar)}" alt="${escapeHtml(ownerLogin)}" class="repo-card__owner-avatar" loading="lazy" />` : ""}
          <a href="https://github.com/${escapeHtml(ownerLogin)}" target="_blank" rel="noopener noreferrer" class="repo-card__owner-name" onclick="event.stopPropagation()">
            @${escapeHtml(ownerLogin)}
          </a>
        </div>
      ` : ""}

      <div class="repo-card__header">
        <div class="repo-card__title-group">
          <svg class="repo-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-card__title-link" title="${escapeHtml(repo.name)}">
            ${escapeHtml(repo.name)}
          </a>
        </div>
        <div class="repo-card__badges">
          ${repo.homepage ? `<a href="${escapeHtml(repo.homepage)}" target="_blank" rel="noopener noreferrer" class="repo-card__badge repo-card__badge--link" title="Live Site">Demo ↗</a>` : ""}
          <span class="repo-card__badge">${repo.fork ? "Fork" : (repo.visibility || "Public")}</span>
        </div>
      </div>

      <p class="repo-card__description">${escapeHtml(repoDescription)}</p>

      ${topicsHtml ? `<div class="repo-card__topics">${topicsHtml}</div>` : ""}

      <div class="repo-card__actions-row">
        <button type="button" class="repo-card__action-btn" onclick="copyCloneCommand('${escapeHtml(cloneUrl)}', event)" title="Copy git clone URL">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Clone</span>
        </button>
        <button type="button" class="repo-card__action-btn" onclick="openRepoModal(${repo.id})" title="View detailed repository analytics">
          <span>Details</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="repo-card__meta">
        ${repoLanguage ? `
          <div class="repo-card__meta-item" title="Language: ${escapeHtml(repoLanguage)}">
            <span class="language-item__dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(repoLanguage)}</span>
          </div>
        ` : ""}
        <div class="repo-card__meta-item" title="Stars">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${formatNumber(repo.stargazers_count)}</span>
        </div>
        <div class="repo-card__meta-item" title="Forks">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
          <span>${formatNumber(repo.forks_count)}</span>
        </div>
        ${openIssues !== null ? `
          <div class="repo-card__meta-item" title="Open Issues">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <span>${formatNumber(openIssues)}</span>
          </div>
        ` : ""}
        <div class="repo-card__meta-item" title="Last updated">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${timeAgo(repo.updated_at)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderPopularSuggestions() {
  const container = document.getElementById("globalRepoSuggestionsContainer");
  if (!container) return;

  const currentQuery = (appState.repoSearchQuery || "").toLowerCase();
  container.innerHTML = `
    <span class="repo-search-suggestions__label">Suggested:</span>
    ${POPULAR_REPO_SUGGESTIONS.map((sug) => {
      const isActive = currentQuery === sug.toLowerCase();
      return `
        <button type="button" class="suggestion-chip ${isActive ? 'active' : ''}" onclick="applySearchSuggestion('${escapeHtml(sug)}')">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>${escapeHtml(sug)}</span>
        </button>
      `;
    }).join("")}
  `;
}

function renderActiveFilterTags() {
  const container = document.getElementById("globalRepoActiveFilters");
  if (!container) return;

  const filters = [];
  if (appState.repoSearchLanguage && appState.repoSearchLanguage !== "all") {
    filters.push({ type: "language", label: `Language: ${appState.repoSearchLanguage}` });
  }
  if (appState.repoSearchMinStars && appState.repoSearchMinStars !== "all") {
    filters.push({ type: "stars", label: `Stars: >${appState.repoSearchMinStars}` });
  }
  if (appState.repoSearchSort && appState.repoSearchSort !== "best-match") {
    const sortLabels = { stars: "Most Stars", forks: "Most Forks", updated: "Recently Updated" };
    filters.push({ type: "sort", label: `Sort: ${sortLabels[appState.repoSearchSort] || appState.repoSearchSort}` });
  }

  if (!filters.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = filters.map(f => `
    <span class="active-filter-tag">
      <span>${escapeHtml(f.label)}</span>
      <button type="button" class="active-filter-tag__remove" onclick="removeGlobalRepoFilter('${f.type}')" title="Remove filter" aria-label="Remove filter">&times;</button>
    </span>
  `).join("") + `
    <button type="button" class="btn btn--secondary btn--sm" style="padding:0.15rem 0.5rem; font-size:0.75rem; min-height:22px;" onclick="resetGlobalRepoSearchFilters()">Clear All</button>
  `;
}

function applySearchSuggestion(sug) {
  const searchInput = document.getElementById("globalRepoSearchInput");
  if (searchInput) searchInput.value = sug;
  setGlobalRepoQuery(sug);
  if (typeof handleGlobalRepoSearch === "function") {
    handleGlobalRepoSearch();
  }
}

function filterByTopicTag(topic, event) {
  if (event) event.stopPropagation();
  const query = `topic:${topic}`;
  const searchInput = document.getElementById("globalRepoSearchInput");
  if (searchInput) searchInput.value = query;
  setGlobalRepoQuery(query);
  if (appState.activeView !== "repositories") {
    if (typeof switchView === "function") switchView("repositories");
  }
  if (typeof handleGlobalRepoSearch === "function") {
    handleGlobalRepoSearch();
  }
}

function resetGlobalRepoSearchFilters() {
  resetGlobalRepoFilters();
  const langSelect = document.getElementById("globalRepoLanguage");
  const minStarsSelect = document.getElementById("globalRepoMinStars");
  const sortSelect = document.getElementById("globalRepoSort");
  if (langSelect) langSelect.value = "all";
  if (minStarsSelect) minStarsSelect.value = "all";
  if (sortSelect) sortSelect.value = "best-match";
  if (appState.repoSearchQuery) {
    if (typeof handleGlobalRepoSearch === "function") handleGlobalRepoSearch();
  } else {
    renderGlobalRepositories();
  }
  showToast("Filters reset to default", "info");
}

function removeGlobalRepoFilter(type) {
  if (type === "language") {
    appState.repoSearchLanguage = "all";
    const el = document.getElementById("globalRepoLanguage");
    if (el) el.value = "all";
  } else if (type === "stars") {
    appState.repoSearchMinStars = "all";
    const el = document.getElementById("globalRepoMinStars");
    if (el) el.value = "all";
  } else if (type === "sort") {
    appState.repoSearchSort = "best-match";
    const el = document.getElementById("globalRepoSort");
    if (el) el.value = "best-match";
  }
  setGlobalRepoFilters({
    language: appState.repoSearchLanguage,
    minStars: appState.repoSearchMinStars,
    sort: appState.repoSearchSort
  });
  if (appState.repoSearchQuery) {
    if (typeof handleGlobalRepoSearch === "function") handleGlobalRepoSearch();
  } else {
    renderGlobalRepositories();
  }
}

function renderGlobalRepositories() {
  const grid = document.getElementById("globalRepositoriesGrid");
  const countText = document.getElementById("globalRepoCountText");
  const paginationNotice = document.getElementById("globalRepoPaginationNotice");
  const loadMoreContainer = document.getElementById("globalRepoLoadMoreContainer");
  const searchInput = document.getElementById("globalRepoSearchInput");
  const clearBtn = document.getElementById("globalRepoClearBtn");
  const langSelect = document.getElementById("globalRepoLanguage");
  const minStarsSelect = document.getElementById("globalRepoMinStars");
  const sortSelect = document.getElementById("globalRepoSort");
  const gridBtn = document.getElementById("globalRepoGridBtn");
  const listBtn = document.getElementById("globalRepoListBtn");

  if (!grid) return;

  // Sync inputs with state
  if (searchInput && searchInput.value !== appState.repoSearchQuery) {
    searchInput.value = appState.repoSearchQuery || "";
  }
  if (clearBtn) {
    clearBtn.style.display = appState.repoSearchQuery ? "flex" : "none";
  }
  if (langSelect && langSelect.value !== appState.repoSearchLanguage) {
    langSelect.value = appState.repoSearchLanguage || "all";
  }
  if (minStarsSelect && minStarsSelect.value !== appState.repoSearchMinStars) {
    minStarsSelect.value = appState.repoSearchMinStars || "all";
  }
  if (sortSelect && sortSelect.value !== appState.repoSearchSort) {
    sortSelect.value = appState.repoSearchSort || "best-match";
  }

  // Update layout buttons & grid class
  const layout = appState.repoSearchLayout || "grid";
  grid.className = `repositories-grid repositories-grid--${layout}`;
  if (gridBtn) gridBtn.classList.toggle("active", layout === "grid");
  if (listBtn) listBtn.classList.toggle("active", layout === "list");

  // Render popular suggestions & active filter tags
  renderPopularSuggestions();
  renderActiveFilterTags();

  // 1. Loading State
  if (appState.repoSearchLoading) {
    grid.innerHTML = Array(6).fill(0).map(() => `<div class="repo-card skeleton" style="height: 190px;"></div>`).join("");
    if (countText) {
      countText.textContent = `Searching GitHub for "${appState.repoSearchQuery}"...`;
      countText.classList.remove("repo-count-text--success");
      countText.style.color = "";
    }
    if (paginationNotice) paginationNotice.textContent = "";
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    updateSectionStatus("globalRepo", "Querying GitHub REST API", `Searching public repositories matching "${appState.repoSearchQuery}"...`, "loading");
    return;
  }

  // 2. Error State
  if (appState.repoSearchError) {
    grid.innerHTML = `
      <article class="empty-card" style="border-color: rgba(239, 68, 68, 0.3);">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--color-rose-500);"><circle cx="12" cy="10" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <h4 style="color:var(--color-rose-400);">Search Request Failed</h4>
        <p>${escapeHtml(appState.repoSearchError)}</p>
        <button type="button" class="btn btn--secondary" onclick="retryGlobalRepoSearch()" style="margin-top:0.75rem;">Retry Search</button>
      </article>
    `;
    if (countText) {
      countText.textContent = "Search error";
      countText.classList.remove("repo-count-text--success");
      countText.style.color = "";
    }
    if (paginationNotice) paginationNotice.textContent = "";
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    updateSectionStatus("globalRepo", "Unable to Retrieve Repositories", appState.repoSearchError, "error");
    return;
  }

  // 3. Discovery Landing State (No search performed yet)
  if (!appState.repoSearchQuery && (!appState.repoSearchResults || !appState.repoSearchResults.length)) {
    grid.innerHTML = `
      <article class="discovery-landing">
        <div class="discovery-landing__icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3 class="discovery-landing__title font-heading">Discover GitHub Repositories</h3>
        <p class="discovery-landing__desc">
          Search millions of open-source projects across GitHub by keyword, topic, or technology. Filter by programming language, star count, and sort by community traction.
        </p>
        <div class="discovery-landing__grid">
          <div class="discovery-feature-card">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <strong>Live GitHub Search API</strong>
              <div style="color:var(--text-muted); font-size:0.76rem;">Direct public discovery across all GitHub owners.</div>
            </div>
          </div>
          <div class="discovery-feature-card">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <strong>Qualifiers &amp; Filters</strong>
              <div style="color:var(--text-muted); font-size:0.76rem;">Filter by language, minimum stars, and sorting.</div>
            </div>
          </div>
          <div class="discovery-feature-card">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <div>
              <strong>Instant Inspection</strong>
              <div style="color:var(--text-muted); font-size:0.76rem;">View metrics, copy clone URLs, and examine details.</div>
            </div>
          </div>
        </div>
      </article>
    `;
    if (countText) {
      countText.textContent = "Search GitHub repositories to discover projects";
      countText.classList.remove("repo-count-text--success");
      countText.style.color = "";
    }
    if (paginationNotice) paginationNotice.textContent = "";
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    updateSectionStatus("globalRepo", "Global Repository Discovery Ready", "Enter keywords or choose a suggested topic to explore open-source repositories.", "info");
    return;
  }

  // 4. No Results Matching Query
  if (!appState.repoSearchResults || !appState.repoSearchResults.length) {
    grid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h4>No repositories match your search</h4>
        <p>No repositories found matching "${escapeHtml(appState.repoSearchQuery)}". Try adjusting your search query or resetting filters.</p>
        <button type="button" class="btn btn--secondary" onclick="resetGlobalRepoSearchFilters()" style="margin-top:0.75rem;">Reset Filters</button>
      </article>
    `;
    if (countText) {
      countText.textContent = `0 results for "${appState.repoSearchQuery}"`;
      countText.classList.remove("repo-count-text--success");
      countText.style.color = "";
    }
    if (paginationNotice) paginationNotice.textContent = "";
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    updateSectionStatus("globalRepo", "Zero Matching Repositories", `No public repositories found for query "${appState.repoSearchQuery}". Try broader search terms.`, "warning");
    return;
  }

  // 5. Successful Search Results
  const total = appState.repoSearchTotalCount;
  const loaded = appState.repoSearchResults.length;
  if (countText) {
    countText.textContent = `Found ${formatNumber(total)} repositories for "${appState.repoSearchQuery}" (Showing ${loaded})`;
    countText.classList.add("repo-count-text--success");
    countText.style.color = "var(--success-color)";
  }
  if (paginationNotice) {
    paginationNotice.textContent = total > 1000 ? "• Note: GitHub API limits search to top 1,000 results" : "";
  }

  updateSectionStatus("globalRepo", "Repositories Discovered Successfully", `Found ${formatNumber(total)} repositories across GitHub for "${appState.repoSearchQuery}".`, "success");

  grid.innerHTML = appState.repoSearchResults.map(createRepositoryCard).join("");

  // Load More Button
  if (loadMoreContainer) {
    if (appState.repoSearchHasMore) {
      loadMoreContainer.innerHTML = `
        <button type="button" class="btn btn--secondary" id="globalRepoLoadMoreBtn" onclick="handleGlobalRepoLoadMore()">
          ${appState.repoSearchLoadingMore ? '<span class="spin">⏳</span> Loading Next Page...' : `Load More Repositories (${loaded} of ${formatNumber(Math.min(total, 1000))})`}
        </button>
      `;
    } else {
      loadMoreContainer.innerHTML = loaded >= 10 ? `<p style="text-align:center; color:var(--text-muted); font-size:0.84rem;">All available results loaded (${loaded} repositories).</p>` : "";
    }
  }
}

// Backward-compatibility alias
function renderRepositories() {
  renderGlobalRepositories();
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

  if (segmentedBar) {
    segmentedBar.innerHTML = languageBreakdown
      .map(
        (item) => `
        <div class="segmented-bar__item" style="width: ${item.percentage}%; background-color: ${item.color};" title="${escapeHtml(item.language)}: ${item.percentage}%"></div>
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
            <span class="language-item__name">${escapeHtml(item.language)}</span>
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

function renderCompareView(compareData) {
  const container = document.getElementById("compareMatrixContainer");
  if (!container) return;

  if (!compareData || (!compareData.dev1 && !compareData.dev2)) {
    container.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
        <h4>Enter two usernames to compare</h4>
        <p>Compare contributions, followers, stars, repository volume, account age, and top languages side-by-side.</p>
      </article>
    `;
    updateSectionStatus("compare", "Head-to-Head Analytics Ready", "Enter any two GitHub handles above or select a preset to generate a real-time comparison.", "info");
    return;
  }

  const { dev1, dev2 } = compareData;

  // Head-to-Head Annual Contribution Share Banner
  let h2hBanner = "";
  if (dev1 && !dev1.error && dev2 && !dev2.error) {
    const stats1 = calculateContributionStats(dev1.contributions);
    const stats2 = calculateContributionStats(dev2.contributions);

    if (stats1 && stats2 && typeof stats1.total === "number" && typeof stats2.total === "number" && (stats1.total > 0 || stats2.total > 0)) {
      const sum = stats1.total + stats2.total;
      const ratio1 = sum > 0 ? Math.round((stats1.total / sum) * 100) : 50;
      const ratio2 = 100 - ratio1;

      h2hBanner = `
        <div class="compare-h2h-summary">
          <div class="compare-h2h-summary__meta">
            <div class="compare-h2h-user">
              <span class="compare-h2h-login">@${escapeHtml(dev1.user.login)}</span>
              <span class="compare-h2h-count">${formatNumber(stats1.total)} contribs</span>
              <span class="compare-h2h-pct">${ratio1}%</span>
            </div>
            <div class="compare-h2h-center">
              <span class="compare-h2h-badge">⚡ 12-Month Contribution Distribution</span>
            </div>
            <div class="compare-h2h-user compare-h2h-user--right">
              <span class="compare-h2h-pct">${ratio2}%</span>
              <span class="compare-h2h-count">${formatNumber(stats2.total)} contribs</span>
              <span class="compare-h2h-login">@${escapeHtml(dev2.user.login)}</span>
            </div>
          </div>
          <div class="compare-h2h-track">
            <div class="compare-h2h-segment compare-h2h-segment--dev1" style="width: ${ratio1}%;" title="@${escapeHtml(dev1.user.login)}: ${ratio1}% (${formatNumber(stats1.total)} contributions)"></div>
            <div class="compare-h2h-segment compare-h2h-segment--dev2" style="width: ${ratio2}%;" title="@${escapeHtml(dev2.user.login)}: ${ratio2}% (${formatNumber(stats2.total)} contributions)"></div>
          </div>
        </div>
      `;
    }
  }

  const renderSide = (dev, otherDev) => {
    if (dev.error) {
      return `
        <div class="compare-box" style="border-color: rgba(239, 68, 68, 0.35);">
          <div style="display:flex; align-items:center; gap:0.6rem; color:var(--danger-color); font-weight:700;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <span>Unable to load profile</span>
          </div>
          <p style="margin-top:0.5rem; color:var(--text-secondary); font-size:0.88rem;">${escapeHtml(dev.error)}</p>
        </div>
      `;
    }

    const u = dev.user;
    const repos = dev.repositories || [];
    const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const forks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const langs = calculateLanguageBreakdown(repos).slice(0, 3).map(l => l.language).join(", ") || "None";
    const topRepo = repos.length ? [...repos].sort((a,b) => b.stargazers_count - a.stargazers_count)[0] : null;

    // Helper for subtle winner badges
    const otherRepos = (otherDev && !otherDev.error && otherDev.repositories) ? otherDev.repositories : [];
    const otherStars = otherRepos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const otherForks = otherRepos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const otherUser = otherDev && otherDev.user ? otherDev.user : null;

    // Contribution Analytics
    const stats = calculateContributionStats(dev.contributions);
    const otherStats = calculateContributionStats(otherDev && !otherDev.error ? otherDev.contributions : null);

    const isWinner = (val1, val2) => val1 > val2 && val1 > 0;

    return `
      <div class="compare-box">
        <div class="compare-box__header">
          <img src="${u.avatar_url}" class="compare-box__avatar" alt="${u.login}" />
          <div>
            <h3 style="font-size:1.2rem; font-weight:800;" class="font-heading">${escapeHtml(u.name || u.login)}</h3>
            <a href="${u.html_url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary); font-size:0.84rem; font-weight:700;">@${escapeHtml(u.login)} ↗</a>
          </div>
        </div>

        <p style="color:var(--text-secondary); font-size:0.86rem; margin-bottom:1rem; line-height:1.5;">${escapeHtml(getFallbackText(u.bio, "No bio provided."))}</p>

        <!-- Annual Contributions Primary Row -->
        <div class="compare-row compare-row--highlight">
          <span class="compare-row__label">
            <span class="compare-row__icon">🔥</span>
            <span>Contributions (Past Year)</span>
          </span>
          <span class="compare-row__value font-heading">
            ${stats && stats.total !== null ? formatNumber(stats.total) : (stats ? "0" : '<span style="color:var(--text-muted); font-size:0.8rem;">Not available</span>')}
            ${stats && otherStats && stats.total !== null && otherStats.total !== null && isWinner(stats.total, otherStats.total) ? '<span class="winner-badge">Higher</span>' : ""}
          </span>
        </div>

        ${stats && stats.longestStreak > 0 ? `
        <div class="compare-row">
          <span class="compare-row__label">Longest Streak</span>
          <span class="compare-row__value">
            ${stats.longestStreak} days
            ${otherStats && isWinner(stats.longestStreak, otherStats.longestStreak) ? '<span class="winner-badge">Higher</span>' : ""}
          </span>
        </div>
        ` : ""}

        <div class="compare-row">
          <span class="compare-row__label">Followers</span>
          <span class="compare-row__value">
            ${formatNumber(u.followers)}
            ${otherUser && isWinner(u.followers, otherUser.followers) ? '<span class="winner-badge">Higher</span>' : ""}
          </span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Following</span>
          <span class="compare-row__value">${formatNumber(u.following)}</span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Public Repos</span>
          <span class="compare-row__value">
            ${formatNumber(u.public_repos)}
            ${otherUser && isWinner(u.public_repos, otherUser.public_repos) ? '<span class="winner-badge">Higher</span>' : ""}
          </span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Total Stars (Retrieved)</span>
          <span class="compare-row__value">
            ⭐ ${formatNumber(stars)}
            ${otherUser && isWinner(stars, otherStars) ? '<span class="winner-badge">Higher</span>' : ""}
          </span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Total Forks (Retrieved)</span>
          <span class="compare-row__value">
            🍴 ${formatNumber(forks)}
            ${otherUser && isWinner(forks, otherForks) ? '<span class="winner-badge">Higher</span>' : ""}
          </span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Account Created</span>
          <span class="compare-row__value">${formatDate(u.created_at)}</span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Account Age</span>
          <span class="compare-row__value">${getAccountAge(u.created_at)}</span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Top Languages</span>
          <span class="compare-row__value" style="font-size:0.8rem;">${escapeHtml(langs)}</span>
        </div>

        <div class="compare-row">
          <span class="compare-row__label">Top Starred Repo</span>
          <span class="compare-row__value" style="font-size:0.8rem;">
            ${topRepo ? `<a href="${topRepo.html_url}" target="_blank" rel="noopener" style="color:var(--accent-primary); text-decoration:underline;">${escapeHtml(topRepo.name)} (${formatNumber(topRepo.stargazers_count)}⭐)</a>` : "None"}
          </span>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    ${h2hBanner}
    <div class="compare-matrix-grid">
      ${renderSide(dev1, dev2)}
      ${renderSide(dev2, dev1)}
    </div>
  `;

  if (dev1.error || dev2.error) {
    updateSectionStatus("compare", "Comparison Notice", "One or both profiles could not be loaded completely.", "warning");
  } else {
    updateSectionStatus("compare", "Comparison Loaded Successfully", `Head-to-head comparison loaded for @${dev1.user.login} vs @${dev2.user.login}.`, "success");
  }
}

function renderBookmarksView() {
  const grid = document.getElementById("bookmarksGrid");
  const badge = document.getElementById("bookmarkCountBadge");
  if (!grid) return;

  const bookmarks = getBookmarks();
  if (badge) badge.textContent = String(bookmarks.length);

  if (!bookmarks.length) {
    grid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        <h4>No bookmarked profiles yet</h4>
        <p>Save any developer profile using the Save button in the header or profile card to easily revisit them later.</p>
      </article>
    `;
    updateSectionStatus("saved", "Saved Profiles & History", "No profiles bookmarked yet. Save profiles from the Overview dashboard.", "info");
    return;
  }

  updateSectionStatus("saved", "Saved Profiles Loaded Successfully", `Loaded ${bookmarks.length} bookmarked developer ${bookmarks.length === 1 ? 'profile' : 'profiles'}.`, "success");

  grid.innerHTML = bookmarks.map((b) => `
    <article class="saved-card">
      <div class="saved-card__top">
        <img src="${b.avatar_url}" class="saved-card__avatar" alt="${b.login}" />
        <div>
          <h4 class="saved-card__name">${escapeHtml(b.name || b.login)}</h4>
          <span class="saved-card__handle">@${escapeHtml(b.login)}</span>
        </div>
      </div>

      <div class="saved-card__meta">
        <span>📦 ${formatNumber(b.public_repos)} repos</span>
        <span>👥 ${formatNumber(b.followers)} followers</span>
      </div>

      <div class="saved-card__actions">
        <button class="btn btn--primary btn--sm" style="flex:1;" onclick="triggerSearch('${escapeHtml(b.login)}')">Open Profile</button>
        <button class="btn btn--secondary btn--sm" onclick="handleRemoveBookmark('${escapeHtml(b.login)}')">Remove</button>
      </div>
    </article>
  `).join("");
}

function renderHistoryView() {
  const container = document.getElementById("historyList");
  const badge = document.getElementById("historyCountBadge");
  if (!container) return;

  const history = getRecentSearches();
  if (badge) badge.textContent = String(history.length);

  if (!history.length) {
    container.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
        <h4>Search history is empty</h4>
        <p>Recent searches will appear here automatically.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = history.map((item) => `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border-radius:var(--border-radius-sm); background:var(--bg-card-solid); border:1px solid var(--border-color); margin-bottom:0.5rem;">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <img src="${item.avatar_url}" style="width:28px; height:28px; border-radius:50%;" alt="${item.login}" />
        <span style="font-weight:700;">${escapeHtml(item.name || item.login)}</span>
        <span style="color:var(--text-muted); font-size:0.82rem;">@${escapeHtml(item.login)}</span>
      </div>
      <button class="btn btn--secondary btn--sm" onclick="triggerSearch('${escapeHtml(item.login)}')">Explore</button>
    </div>
  `).join("");
}

function renderPresetChips() {
  const container = document.getElementById("presetDevsContainer");
  if (!container) return;

  container.innerHTML = `
    <span class="preset-devs__label">Presets:</span>
    ${PRESET_DEVELOPERS.map(d => `
      <button class="preset-chip" data-username="${d.username}" title="${d.role}">
        <img src="${d.avatar}" class="preset-chip__avatar" alt="${d.username}" />
        <span>${d.name}</span>
      </button>
    `).join("")}
  `;
}

function renderComparePresets() {
  const container = document.getElementById("comparePresetsContainer");
  if (!container) return;

  container.innerHTML = `
    <span class="preset-devs__label">Quick Compare:</span>
    ${PRESET_COMPARISONS.map(p => `
      <button class="preset-chip" onclick="handlePresetCompare('${p.dev1}', '${p.dev2}')">
        <span>${p.label}</span>
      </button>
    `).join("")}
  `;
}

function renderRecentSearches() {
  const container = document.getElementById("recentSearchesContainer");
  if (!container) return;

  const recents = getRecentSearches();
  if (!recents.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap; margin-top:0.65rem;">
      <span style="font-size:0.76rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Recent:</span>
      ${recents.slice(0, 5).map(r => `
        <button class="preset-chip" onclick="triggerSearch('${escapeHtml(r.login)}')">
          <img src="${r.avatar_url}" class="preset-chip__avatar" alt="${r.login}" />
          <span>${escapeHtml(r.login)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderDeveloperOverview(user, repositories) {
  const languageBreakdown = calculateLanguageBreakdown(repositories);

  renderUserProfile(user);
  renderUserStats(user, repositories);
  renderTopReposShowcase(repositories);
  renderLanguageBreakdown(languageBreakdown);
  saveRecentSearch(user);
  renderRecentSearches();
  renderHistoryView();
  renderBookmarksView();
}

function renderSkeletonState() {
  const showcase = document.getElementById("topReposShowcase");
  if (showcase) {
    showcase.innerHTML = Array(4)
      .fill(0)
      .map(() => `<div class="top-repo-card skeleton" style="height: 120px;"></div>`)
      .join("");
  }
}

async function openRepoModal(repoId) {
  const repo = (appState.repoSearchResults && appState.repoSearchResults.find((r) => r.id === repoId)) ||
               (appState.overviewRepositories && appState.overviewRepositories.find((r) => r.id === repoId)) ||
               (appState.repositories && appState.repositories.find((r) => r.id === repoId));
  if (!repo) return;

  appState.activeRepoModal = repo;
  const modal = document.getElementById("repoDetailModal");
  const modalContent = document.getElementById("repoModalBody");
  if (!modal || !modalContent) return;

  const langColor = getLanguageColor(repo.language);
  const topicsHtml = repo.topics && repo.topics.length
    ? repo.topics.map((t) => `<span class="repo-card__topic">#${escapeHtml(t)}</span>`).join("")
    : "<span style='color:var(--text-muted); font-size:0.8rem;'>No topics assigned.</span>";

  modalContent.innerHTML = `
    <div class="modal-header">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <div>
          <h2 class="modal-title font-heading" id="modalRepoTitle">${escapeHtml(repo.name)}</h2>
          <p class="modal-subtitle">${escapeHtml(repo.full_name)}</p>
        </div>
      </div>
      <button class="modal-close-btn" onclick="closeRepoModal()" aria-label="Close modal">&times;</button>
    </div>

    <div class="modal-body-scroll">
      <p class="modal-description">${escapeHtml(getFallbackText(repo.description, "No detailed description available."))}</p>

      <div class="modal-stats-grid">
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Language</span>
          <div class="modal-stat-box__value">
            <span class="language-item__dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(repo.language || "N/A")}</span>
          </div>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Stars</span>
          <span class="modal-stat-box__value">⭐ ${formatNumber(repo.stargazers_count)}</span>
        </div>
        <div class="modal-stat-box">
          <span class="modal-stat-box__label">Forks</span>
          <span class="modal-stat-box__value">🍴 ${formatNumber(repo.forks_count)}</span>
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
          <span class="modal-stat-box__value mono">${escapeHtml(repo.default_branch || "main")}</span>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.84rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Topics</h4>
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">${topicsHtml}</div>
      </div>

      <div>
        <h4 style="font-size:0.84rem; text-transform:uppercase; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Clone Command</h4>
        <div class="modal-code-box">
          <code class="mono">git clone ${escapeHtml(repo.clone_url || `https://github.com/${repo.full_name}.git`)}</code>
          <button class="btn btn--secondary btn--sm" onclick="copyCloneCommand('${escapeHtml(repo.clone_url)}', event)">Copy</button>
        </div>
      </div>

      <!-- README Preview Section -->
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
          <h4 style="font-size:0.84rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Repository README</h4>
          <button class="btn btn--secondary btn--sm" id="loadReadmeBtn" onclick="loadReadmeForActiveModal('${escapeHtml(repo.owner ? repo.owner.login : appState.currentUser.login)}', '${escapeHtml(repo.name)}')">
            Load README
          </button>
        </div>
        <div id="modalReadmeContainer" class="readme-preview-box">
          <p style="color:var(--text-muted);">Click "Load README" above to fetch markdown documentation from GitHub.</p>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      ${repo.homepage ? `<a href="${escapeHtml(repo.homepage)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary">Live Site ↗</a>` : ""}
      <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">Open on GitHub ↗</a>
    </div>
  `;

  modal.classList.add("open");
}

async function loadReadmeForActiveModal(owner, repoName) {
  const container = document.getElementById("modalReadmeContainer");
  const btn = document.getElementById("loadReadmeBtn");
  if (!container) return;

  if (btn) btn.disabled = true;
  container.innerHTML = `<p style="color:var(--text-muted);"><span class="spin">⏳</span> Fetching README from GitHub...</p>`;

  try {
    const markdown = await fetchRepoReadme(owner, repoName);
    if (!markdown) {
      container.innerHTML = `<p style="color:var(--text-muted);">No README file found in this repository.</p>`;
    } else {
      container.innerHTML = parseMarkdownBasic(markdown);
    }
  } catch (err) {
    container.innerHTML = `<p style="color:var(--danger-color);">Failed to load README: ${escapeHtml(err.message)}</p>`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

function closeRepoModal() {
  const modal = document.getElementById("repoDetailModal");
  if (modal) modal.classList.remove("open");
  appState.activeRepoModal = null;
}

function copyCloneCommand(cloneUrl, event) {
  if (event) event.stopPropagation();
  const cmd = `git clone ${cloneUrl}`;
  copyToClipboard(cmd).then(() => {
    showToast(`Copied clone command to clipboard`, "success");
  }).catch(() => {
    showToast(`Failed to copy clone command`, "error");
  });
}

function filterByTopic(topic, event) {
  if (event) event.stopPropagation();
  filterByTopicTag(topic, event);
}

function resetRepoFilters() {
  resetGlobalRepoSearchFilters();
}

function selectLanguageFilterAndSwitch(lang) {
  setGlobalRepoFilters({ language: lang });
  if (typeof switchView === "function") {
    switchView("repositories");
  }
  if (appState.repoSearchQuery) {
    if (typeof handleGlobalRepoSearch === "function") handleGlobalRepoSearch();
  } else {
    renderGlobalRepositories();
  }
  showToast(`Filtered repositories by ${lang}`, "info");
}

function clearDeveloperData() {
  if (typeof setCurrentUser === "function") setCurrentUser(null);
  if (typeof setRepositories === "function") setRepositories([]);
  if (typeof setLanguages === "function") setLanguages([]);
  appState.overviewUsername = "";

  updateTextContent("publicRepos", "0");
  updateTextContent("followers", "0");
  updateTextContent("following", "0");
  updateTextContent("totalStars", "0");
  updateTextContent("totalForks", "0");

  updateTextContent("userName", "Developer");
  updateTextContent("userUsername", "@username");
  updateTextContent("userBio", "Search for a developer to inspect analytics.");

  const avatar = document.getElementById("userAvatar");
  const avatarPlaceholder = document.getElementById("userAvatarPlaceholder");
  if (avatar) avatar.style.display = "none";
  if (avatarPlaceholder) avatarPlaceholder.style.display = "flex";

  const detailsContainer = document.getElementById("userDetails");
  if (detailsContainer) detailsContainer.innerHTML = "";

  const showcase = document.getElementById("topReposShowcase");
  if (showcase) showcase.innerHTML = `<p class="empty-text">Top repositories will be displayed here.</p>`;

  const repositoriesGrid = document.getElementById("repositoriesGrid");
  if (repositoriesGrid) {
    repositoriesGrid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <h4>No developer profile loaded</h4>
        <p>Enter a username above or choose a preset to start exploring.</p>
      </article>
    `;
  }

  const languageList = document.getElementById("languageList");
  if (languageList) {
    languageList.innerHTML = `<p class="empty-text">Language usage will appear after searching a developer.</p>`;
  }

  const segmentedBar = document.getElementById("segmentedLangBar");
  if (segmentedBar) segmentedBar.innerHTML = "";

  updateBookmarkButtonState(false);
}

// -------------------------------------------------------------
// SHARE DEVELOPER PROFILE MODAL
// -------------------------------------------------------------
function closeShareModal() {
  const modal = document.getElementById("shareProfileModal");
  if (modal) modal.classList.remove("open");
}

function copyShareText(text, label, buttonEl) {
  copyToClipboard(text).then(() => {
    showToast(`${label} copied to clipboard!`, "success");
    if (buttonEl) {
      const origSpan = buttonEl.querySelector("span");
      if (origSpan) {
        const origText = origSpan.textContent;
        origSpan.textContent = "Copied!";
        setTimeout(() => {
          origSpan.textContent = origText;
        }, 2000);
      }
    }
  }).catch(() => {
    showToast(`Failed to copy ${label}`, "error");
  });
}

async function triggerNativeDeviceShare() {
  if (!appState.currentUser) return;
  const user = appState.currentUser;
  const actualGithubUrl = user.html_url || `https://github.com/${user.login}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${user.name || user.login} on GitHub`,
        text: `Check out ${user.name || user.login}'s GitHub developer profile (${user.public_repos || 0} repos, ${user.followers || 0} followers):`,
        url: actualGithubUrl
      });
      showToast("Profile shared successfully!", "success");
    } catch (err) {
      if (err.name !== "AbortError") {
        showToast("Device share failed, please use copy link", "info");
      }
    }
  } else {
    copyShareText(actualGithubUrl, "Actual GitHub profile link");
  }
}

function openShareModal(user) {
  if (!user) return;
  const modal = document.getElementById("shareProfileModal");
  const modalContent = document.getElementById("shareModalBody");
  if (!modal || !modalContent) return;

  const actualGithubUrl = user.html_url || `https://github.com/${user.login}`;
  const dashboardUrl = `${window.location.origin}${window.location.pathname}?user=${encodeURIComponent(user.login)}${window.location.hash || "#overview"}`;
  const shareMessage = `Check out ${user.name || user.login}'s GitHub profile: ${actualGithubUrl}`;
  const tweetText = `Check out ${user.name || user.login} (@${user.login}) on GitHub: ${actualGithubUrl}`;
  const emailSubject = `GitHub Developer Profile: ${user.name || user.login}`;
  const emailBody = `Hi,\n\nCheck out ${user.name || user.login}'s (@${user.login}) GitHub developer profile:\nGitHub: ${actualGithubUrl}\nAnalytics: ${dashboardUrl}\n\nOverview:\n- Public Repos: ${user.public_repos || 0}\n- Followers: ${user.followers || 0}\n- Bio: ${user.bio || "N/A"}`;

  modalContent.innerHTML = `
    <div class="modal-header">
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        <div>
          <h2 class="modal-title font-heading" id="modalShareTitle">Share Developer Profile</h2>
          <p class="modal-subtitle">Share actual GitHub profile of @${escapeHtml(user.login)}</p>
        </div>
      </div>
      <button class="modal-close-btn" onclick="closeShareModal()" aria-label="Close modal">&times;</button>
    </div>

    <div class="share-modal-body">
      <div class="share-profile-card">
        <img src="${escapeHtml(user.avatar_url)}" alt="${escapeHtml(user.login)}" class="share-profile-card__avatar" />
        <div class="share-profile-card__info">
          <h4 class="share-profile-card__name font-heading">${escapeHtml(user.name || user.login)}</h4>
          <span class="share-profile-card__handle">@${escapeHtml(user.login)}</span>
          <p class="share-profile-card__meta">${user.public_repos || 0} Repositories • ${user.followers || 0} Followers</p>
        </div>
      </div>

      <div class="share-group">
        <label class="share-group__label">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          Actual GitHub Profile URL
        </label>
        <div class="share-input-row">
          <input type="text" class="share-input" readonly value="${escapeHtml(actualGithubUrl)}" id="shareGithubInput" />
          <button type="button" class="btn btn--primary btn--sm" id="copyActualGithubBtn" onclick="copyShareText('${escapeHtml(actualGithubUrl)}', 'Actual GitHub profile link', this)">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy</span>
          </button>
          <a href="${escapeHtml(actualGithubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm" title="Open actual GitHub profile">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            <span>Open</span>
          </a>
        </div>
      </div>

      <div class="share-group">
        <label class="share-group__label">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          DevExplorer Analytics Link
        </label>
        <div class="share-input-row">
          <input type="text" class="share-input" readonly value="${escapeHtml(dashboardUrl)}" id="shareDashboardInput" />
          <button type="button" class="btn btn--secondary btn--sm" id="copyDashboardBtn" onclick="copyShareText('${escapeHtml(dashboardUrl)}', 'Analytics link', this)">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy</span>
          </button>
        </div>
      </div>

      <div class="share-channels">
        <div class="share-channels__title">Send Profile Directly:</div>
        <div class="share-channels__grid">
          <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-channel-btn--whatsapp">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.08l-.29-.17-3.12.82.83-3.04-.19-.3a8.21 8.21 0 0 1-1.26-4.46c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
            <span>WhatsApp</span>
          </a>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-channel-btn--twitter">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>X (Twitter)</span>
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(actualGithubUrl)}" target="_blank" rel="noopener noreferrer" class="share-channel-btn share-channel-btn--linkedin">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            <span>LinkedIn</span>
          </a>
          <a href="mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}" class="share-channel-btn share-channel-btn--email">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>Email</span>
          </a>
        </div>

        ${navigator.share ? `
          <button type="button" class="btn btn--secondary btn--block" id="nativeShareTriggerBtn" style="margin-top:0.75rem;" onclick="triggerNativeDeviceShare()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            <span>Open System / Device Share</span>
          </button>
        ` : ""}
      </div>
    </div>
  `;

  modal.classList.add("open");
}