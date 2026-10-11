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
    ? repo.topics.slice(0, 5).map(t => `<button class="repo-card__topic" onclick="filterByTopic('${escapeHtml(t)}', event)">#${escapeHtml(t)}</button>`).join("")
    : "";

  const isStarred = (repo.stargazers_count || 0) > 100;
  const cloneUrl = repo.clone_url || `https://github.com/${repo.full_name}.git`;

  return `
    <article class="repo-card ${isStarred ? 'repo-card--featured' : ''}" data-repo-id="${repo.id}">
      <div class="repo-card__header">
        <div class="repo-card__title-group">
          <svg class="repo-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-card__title-link">
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
        <button class="repo-card__action-btn" onclick="copyCloneCommand('${escapeHtml(cloneUrl)}', event)" title="Copy git clone URL">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Clone</span>
        </button>
        <button class="repo-card__action-btn" onclick="openRepoModal(${repo.id})" title="View detailed repository analytics">
          <span>Details</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="repo-card__meta">
        ${repoLanguage ? `
          <div class="repo-card__meta-item">
            <span class="language-item__dot" style="background-color: ${langColor};"></span>
            <span>${escapeHtml(repoLanguage)}</span>
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
  const repoCountText = document.getElementById("repoCountText");
  const loadMoreContainer = document.getElementById("loadMoreContainer");
  if (!repositoriesGrid) return;

  const repositories = appState.filteredRepositories;

  repositoriesGrid.className = `repositories-grid repositories-grid--${appState.viewMode}`;

  if (!appState.currentUser) {
    repositoriesGrid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <h4>No developer profile loaded</h4>
        <p>Go to Overview and search a GitHub username to explore repositories.</p>
      </article>
    `;
    if (repoCountText) repoCountText.textContent = "Showing 0 repositories";
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    updateSectionStatus("repo", "Repositories Explorer", "Load a developer profile in Overview to view and search repositories.", "info");
    return;
  }

  if (appState.currentUser.public_repos === 0) {
    repositoriesGrid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <h4>Zero public repositories</h4>
        <p>@${escapeHtml(appState.currentUser.login)} has not created any public repositories yet.</p>
      </article>
    `;
    if (repoCountText) repoCountText.textContent = "0 public repositories";
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    updateSectionStatus("repo", "No Repositories Available", `@${appState.currentUser.login} does not have any public repositories.`, "warning");
    return;
  }

  if (!repositories || !repositories.length) {
    repositoriesGrid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <h4>No matching repositories found</h4>
        <p>No repositories matched your query. Try clearing your search keyword or language filter.</p>
        <button class="btn btn--secondary" onclick="resetRepoFilters()" style="margin-top:0.5rem;">Reset Filters</button>
      </article>
    `;
    if (repoCountText) repoCountText.textContent = `0 of ${appState.repositories.length} repositories matching filter`;
    if (loadMoreContainer) loadMoreContainer.innerHTML = "";
    const filterDesc = appState.repoSearchQuery ? ` matching "${appState.repoSearchQuery}"` : "";
    updateSectionStatus("repo", "No Repositories Match Filter", `No repositories found${filterDesc}. Try adjusting your search query or language filter.`, "warning");
    return;
  }

  if (repoCountText) {
    const totalLoaded = appState.repositories.length;
    const totalPublic = appState.currentUser.public_repos;
    repoCountText.textContent = `Showing ${repositories.length} of ${totalLoaded} loaded repositories (${totalPublic} total on GitHub)`;
  }

  // Dynamic Section Status Feedback Banner
  if (appState.repoSearchQuery) {
    updateSectionStatus(
      "repo",
      "Repositories Loaded Successfully",
      `Found ${repositories.length} of ${appState.repositories.length} repositories matching "${appState.repoSearchQuery}".`,
      "success"
    );
  } else if (appState.languageFilter && appState.languageFilter !== "all") {
    updateSectionStatus(
      "repo",
      "Repositories Loaded Successfully",
      `Displaying ${repositories.length} repositories written in ${appState.languageFilter}.`,
      "success"
    );
  } else {
    updateSectionStatus(
      "repo",
      "Repositories Loaded Successfully",
      `Retrieved ${repositories.length} public repositories for @${appState.currentUser.login}.`,
      "success"
    );
  }

  repositoriesGrid.innerHTML = repositories.map(createRepositoryCard).join("");

  // Load More Button
  if (loadMoreContainer) {
    if (appState.hasMoreRepos) {
      loadMoreContainer.innerHTML = `
        <button class="btn btn--secondary" id="loadMoreBtn" onclick="handleLoadMoreRepositories()">
          ${appState.isLoadingMore ? '<span class="spin">⏳</span> Loading Next Page...' : `Load More Repositories (${appState.repositories.length}/${appState.currentUser.public_repos})`}
        </button>
      `;
    } else {
      loadMoreContainer.innerHTML = "";
    }
  }
}

function renderLanguageOptions(repositories) {
  const select = document.getElementById("filterLanguage");
  if (!select) return;

  const currentVal = appState.languageFilter || "all";
  const languages = Array.from(
    new Set(repositories.map((r) => r.language).filter(Boolean))
  ).sort();

  select.innerHTML = `<option value="all">All Languages (${repositories.length})</option>` +
    languages.map(lang => `<option value="${escapeHtml(lang)}" ${lang === currentVal ? "selected" : ""}>${escapeHtml(lang)}</option>`).join("");
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
      <button class="topic-chip ${appState.topicFilter === t.toLowerCase() ? 'active' : ''}" onclick="filterByTopic('${escapeHtml(t)}')">
        #${escapeHtml(t)} <span class="topic-chip__count">${count}</span>
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

function renderLanguagesView(repositories) {
  const breakdown = calculateLanguageBreakdown(repositories);
  const totalCountEl = document.getElementById("langTotalCount");
  const topNameEl = document.getElementById("langTopName");
  const topPercentEl = document.getElementById("langTopPercent");
  const barEl = document.getElementById("langViewSegmentedBar");
  const cardsGrid = document.getElementById("langViewCardsGrid");

  if (!cardsGrid) return;

  if (!breakdown || !breakdown.length) {
    if (totalCountEl) totalCountEl.textContent = "0";
    if (topNameEl) topNameEl.textContent = "None";
    if (topPercentEl) topPercentEl.textContent = "0%";
    if (barEl) barEl.innerHTML = "";
    cardsGrid.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        <h4>No language analytics available</h4>
        <p>Search for a GitHub developer profile to view language intelligence.</p>
      </article>
    `;
    updateSectionStatus("lang", "Programming Language Analytics", "Go to Overview and search for a developer profile to view language intelligence.", "info");
    return;
  }

  if (totalCountEl) totalCountEl.textContent = String(breakdown.length);
  if (topNameEl) topNameEl.textContent = breakdown[0].language;
  if (topPercentEl) topPercentEl.textContent = `${breakdown[0].percentage}%`;

  const userText = appState.currentUser ? ` for @${appState.currentUser.login}` : "";
  updateSectionStatus("lang", "Languages Loaded Successfully", `Identified ${breakdown.length} unique languages across ${repositories.length} repositories${userText}.`, "success");

  if (barEl) {
    barEl.innerHTML = breakdown.map(item => `
      <div class="segmented-bar__item" style="width: ${item.percentage}%; background-color: ${item.color};" title="${escapeHtml(item.language)}: ${item.percentage}%"></div>
    `).join("");
  }

  cardsGrid.innerHTML = breakdown.map((item) => {
    const reposInLang = repositories.filter(r => r.language === item.language).slice(0, 4);
    const reposListHtml = reposInLang.map(r => `
      <div class="lang-intel-card__repo-item">
        <a href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.name)}</a>
        <span>⭐ ${formatNumber(r.stargazers_count)}</span>
      </div>
    `).join("");

    return `
      <article class="lang-intel-card">
        <div class="lang-intel-card__header">
          <div class="lang-intel-card__title-group">
            <span class="language-item__dot" style="background-color: ${item.color}; width:12px; height:12px;"></span>
            <h4 class="lang-intel-card__title">${escapeHtml(item.language)}</h4>
          </div>
          <span style="font-weight:800; color:var(--text-primary);">${item.percentage}%</span>
        </div>

        <div style="font-size:0.84rem; color:var(--text-muted);">
          Used across <strong>${item.count}</strong> ${item.count === 1 ? 'repository' : 'repositories'}.
        </div>

        <div class="lang-intel-card__repos-list">
          <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700; color:var(--text-muted);">Notable Repositories:</span>
          ${reposListHtml}
        </div>

        <button class="btn btn--secondary btn--sm" style="margin-top:auto;" onclick="selectLanguageFilterAndSwitch('${escapeHtml(item.language)}')">
          Filter Repositories by ${escapeHtml(item.language)}
        </button>
      </article>
    `;
  }).join("");
}

function renderCompareView(compareData) {
  const container = document.getElementById("compareMatrixContainer");
  if (!container) return;

  if (!compareData || (!compareData.dev1 && !compareData.dev2)) {
    container.innerHTML = `
      <article class="empty-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>
        <h4>Enter two usernames to compare</h4>
        <p>Compare followers, stars, repository volume, account age, and top languages side-by-side.</p>
      </article>
    `;
    updateSectionStatus("compare", "Head-to-Head Analytics Ready", "Enter any two GitHub handles above or select a preset to generate a real-time comparison.", "info");
    return;
  }

  const { dev1, dev2 } = compareData;

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
  renderLanguageOptions(repositories);
  renderTopicFilters(repositories);
  renderRepositories();
  renderLanguageBreakdown(languageBreakdown);
  renderLanguagesView(repositories);
  saveRecentSearch(user);
  renderRecentSearches();
  renderHistoryView();
  renderBookmarksView();
}

function renderSkeletonState() {
  const repositoriesGrid = document.getElementById("repositoriesGrid");
  if (repositoriesGrid) {
    repositoriesGrid.innerHTML = Array(6)
      .fill(0)
      .map(
        () => `
      <div class="repo-card skeleton" style="height: 180px;"></div>
    `
      )
      .join("");
  }
}

async function openRepoModal(repoId) {
  const repo = appState.repositories.find((r) => r.id === repoId);
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
  showToast("Repository filters reset", "info");
}

function selectLanguageFilterAndSwitch(lang) {
  setRepoLanguageFilter(lang);
  const langSelect = document.getElementById("filterLanguage");
  if (langSelect) langSelect.value = lang;
  window.location.hash = "#repositories";
  renderRepositories();
  showToast(`Filtered repositories by ${lang}`, "info");
}

function clearDeveloperData() {
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