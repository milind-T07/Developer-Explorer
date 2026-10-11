# GitHub Developer Explorer

GitHub Developer Explorer is a clean, responsive web application that utilizes the public GitHub REST API to search for any GitHub username and display developer profile details, repository data, stats, and a programming language breakdown.

## Project Overview

This project is built using pure HTML, CSS, and JavaScript. The main objective of this application is to demonstrate clean code organization, asynchronous API integration, state management, error handling, responsive design, and DOM manipulation without relying on third-party frameworks.

## Features

* **Search by Username:** Quickly retrieve profile details for any valid GitHub user.
* **API Integration:** Seamlessly fetches data from the GitHub REST API.
* **Profile Insights:** Displays avatar, name, username, bio, location, company, website, and joined date.
* **Key Statistics:** Highlights public repository count, followers, following, total stars, and total forks.
* **Dynamic Repositories List:** Renders public repository cards with link references, stars, and forks count.
* **Interactive Sorting:** Sort public repositories dynamically by:
  * Most Stars
  * Most Forks
  * Recently Updated
  * Name A-Z
* **Language Breakdown:** Automatically calculates and displays a visual percentage breakdown of programming languages used across the user's repositories.
* **Comprehensive Error Handling:** Gracefully handles empty searches, invalid usernames (404), API rate limit messages (403), and general network failures.
* **Fully Responsive:** Adapts beautifully across mobile, tablet, and desktop viewports.

## Tech Stack

* **Structure:** HTML5
* **Styling:** CSS3 (Modular stylesheets with CSS variables)
* **Logic:** Vanilla JavaScript (ES6+)
* **API:** GitHub REST API

## Folder Structure

```text
github-developer-explorer/
├── README.md
├── index.html
├── assets/
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
└── js/
    ├── config.js
    ├── api.js
    ├── state.js
    ├── utils.js
    ├── render.js
    └── main.js
```

## How It Works

1. **User Input:** The user types a GitHub username and triggers the search.
2. **Sanitization:** The input is sanitized to prevent malformed API requests.
3. **Data Fetching:** The app calls the GitHub REST API endpoints in parallel to fetch user info and repository data.
4. **State Management:** The response data is loaded into the application state.
5. **Dynamic Render:** The UI is rebuilt with the profile card, stats grid, interactive repository lists, and language progress bars.
6. **Interaction:** Selecting a sorting method triggers a state update and re-renders the repositories instantly.

## GitHub API Endpoints Used

* **User Profile:** `GET https://api.github.com/users/{username}`
* **User Repositories:** `GET https://api.github.com/users/{username}/repos?per_page=100&sort=updated`

## JavaScript Architecture

* `config.js`: Stores API base URLs and configurations.
* `api.js`: Handles API requests using `fetch` and custom status code checks.
* `state.js`: Manages application state, selected repositories, and sorting actions.
* `utils.js`: Houses formatting helpers (for numbers and dates), input sanitization, and language calculation utilities.
* `render.js`: Handles UI DOM rendering templates, search indicators, skeletons, and error messaging.
* `main.js`: Binds DOM event listeners and coordinates the main application initialization and flow.

## Error Handling

* **Empty Input:** Alerts the user immediately to enter a username before querying.
* **Invalid Username (404):** Displays a user-friendly "No GitHub user found" error message.
* **Rate Limit Reached (403):** Notifies the user when GitHub API limit is exhausted and guides them to try again later.
* **Generic Failures:** Catches network connection drops or server errors, preventing application crashes.

## Responsive Design

* Employs modern CSS Layout systems (CSS Grid and Flexbox).
* Organizes responsive breakpoints in `responsive.css` to ensure smooth desktop, tablet, and mobile viewing.
* Scaling images, fluid text sizes, and column-shifting grids adapt dynamically to different screen dimensions.

## Author

* **Sankalp Tiwari (Zenthar)**
* GitHub Username: [zenthar-dev](https://github.com/zenthar-dev)
* GitHub Profile: [https://github.com/zenthar-dev](https://github.com/zenthar-dev)

## Project Status

* **Completed / Stable:** Main functions, styling, API integration, and layouts are fully operational.