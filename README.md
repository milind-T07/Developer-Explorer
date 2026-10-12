# DevExplorer — GitHub Developer Analytics (v2.6)

DevExplorer is a premium, high-performance developer intelligence platform that utilizes the official public GitHub REST API to provide deep real-time analytics for any public GitHub profile and repository ecosystem.

## 🚀 Key Highlights & Features

### 1. Overview Dashboard
* **Profile Insights:** Live avatar, display name, handle, bio, location, company, website link, Twitter handle, and account age.
* **5 Core Metrics:** Public repositories count, followers, following, total stars, and total forks (with honest labeling regarding pagination).
* **Most Starred Repositories Showcase:** Quick glance at the developer's most celebrated open-source projects.
* **Compact Search Bar:** Instant username lookup with `⌘K` keyboard shortcut, clear button, and quick preset chips (Linus Torvalds, Dan Abramov, Evan You, Andrej Karpathy, etc.).

### 2. Repositories Explorer
* **Live Search & Filters:** Filter repositories instantly by keyword (name, description, topics).
* **Language & Topic Filters:** Dynamically populated language dropdown and interactive `#topic` chips.
* **Sorting Modes:** Sort by Stars, Forks, Recently Updated, Recently Created, Name (A-Z), and Size.
* **Layout Toggles:** Switch seamlessly between Grid View and Compact List View.
* **Repository Detail Modal:** Inspect watchers, open issues, default branch, license, clone URL with one-click copy, and live **README preview** fetched directly from GitHub!
* **Pagination (Load More):** Handles developers with >100 repositories with sequential pagination.

### 3. Dedicated Language Intelligence
* **Language Distribution:** Multi-segment percentage distribution bar.
* **Language Metric Cards:** Deep dive into each language stack, percentage share, repo counts, and top repos written in that language.
* **Interactive Navigation:** One-click filtering of repositories by selected language.

### 4. Head-to-Head Developer Comparison
* **Parallel API Requests:** Compare two public GitHub accounts side-by-side using `Promise.allSettled`.
* **Independent Error Handling:** If one handle is invalid, the other account still displays cleanly with clear error messaging.
* **Side-by-Side Matrix:** Compare annual contributions (past 12 months), active contribution days, streaks, followers, stars, forks, repository counts, account ages, and top languages with subtle winner badges.
* **Visual Contribution Heatmaps:** Real-time GitHub contribution calendar charts and activity level legends for each developer.
* **Head-to-Head Contribution Share Bar:** Visual comparison bar showing the relative 12-month contribution distribution between both developers.
* **Quick Tools:** Quick swap button (A ↔ B) and preset comparisons (e.g. Linus vs Karpathy, Dan vs Evan).

### 5. Saved Profiles & Search History
* **Profile Bookmarking:** Bookmark any developer to revisit their profile later.
* **Search History:** Revisit recent searches with one click or clear history at any time.
* **Safe Local Storage:** Stored locally in browser `localStorage` without secrets.

### 6. Settings & Personalization
* **Dark & Light Mode:** Seamless toggle between technical dark mode and crisp high-contrast light mode.
* **6 Accent Palettes:** Indigo, Cyan, Emerald, Amber, Violet, and Rose.
* **Reduced Motion:** Accessibility support honoring `prefers-reduced-motion`.
* **Data Management:** Storage usage overview with one-click reset.

### 7. Export & Sharing Suite
* **Shareable URL:** Copy direct URL with query parameters (`?user=username#overview`).
* **Markdown Summary:** Copy executive Markdown summary for documentation and resumes.
* **CSV Export:** Export full repository metadata into properly escaped `.csv` spreadsheet.
* **JSON Export:** Download structured analytics report into `.json` format.
* **Executive Print Mode:** Dedicated `@media print` stylesheet for clean, printable reports.

## 🛠 Tech Stack & Architecture

* **Markup:** Semantic HTML5 (`<main>`, `<aside>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`)
* **Styling:** Vanilla CSS with comprehensive CSS custom properties (design tokens) and responsive grid
* **Scripting:** Modular Vanilla JavaScript ES6+ (No external framework dependencies)
* **API:** GitHub Public REST API with in-memory caching, timeout safety, and rate-limit tracking

### File Structure

```text
├── index.html          # Semantic HTML shell with 6 view routes & modal
├── README.md           # Documentation
├── css/
│   ├── variables.css   # Color tokens, light/dark themes, spacing, radii
│   ├── base.css        # Resets, typography, print styles, accessibility
│   ├── layout.css      # App grid, sidebar, topbar, view section router
│   ├── components.css  # Buttons, cards, search, comparison, modal, toasts
│   └── responsive.css  # Breakpoint rules (1440px, 1024px, 768px, 390px)
└── js/
    ├── config.js       # Endpoints, preset developers, comparisons, color map
    ├── utils.js        # Formatting, CSV/JSON generators, storage, markdown parser
    ├── state.js        # Reactive central application state & filter engine
    ├── api.js          # API client with cache, timeout, abort, and pagination
    ├── render.js       # View rendering functions, modals, toasts, skeletons
    └── main.js         # Hash router, event bindings, keyboard shortcuts, boot
```

## 🌐 Running Locally

You can serve this project with any local HTTP server:

```bash
# Using Python
python3 -m http.server 5500

# Using Node.js
npx serve .
```

Open `http://localhost:5500` in your web browser.