const GITHUB_API_BASE_URL = "https://api.github.com";

const API_ENDPOINTS = {
  user: (username) => `${GITHUB_API_BASE_URL}/users/${username}`,
  repositories: (username) =>
    `${GITHUB_API_BASE_URL}/users/${username}/repos?per_page=100&sort=updated`,
  rateLimit: () => `${GITHUB_API_BASE_URL}/rate_limit`,
};

// Categorized preset developers for rich exploration
const PRESET_DEVELOPERS = [
  { username: "torvalds", name: "Linus Torvalds", role: "Creator of Linux & Git", avatar: "https://github.com/torvalds.png" },
  { username: "gaearon", name: "Dan Abramov", role: "Co-author Redux & React", avatar: "https://github.com/gaearon.png" },
  { username: "yyx99", name: "Evan You", role: "Creator of Vue.js & Vite", avatar: "https://github.com/yyx99.png" },
  { username: "karpathy", name: "Andrej Karpathy", role: "AI & Neural Networks Pioneer", avatar: "https://github.com/karpathy.png" },
  { username: "rich-harris", name: "Rich Harris", role: "Creator of Svelte & Rollup", avatar: "https://github.com/rich-harris.png" },
  { username: "sindresorhus", name: "Sindre Sorhus", role: "Prolific Open Source Author", avatar: "https://github.com/sindresorhus.png" },
  { username: "mitchellh", name: "Mitchell Hashimoto", role: "Co-founder HashiCorp (Terraform/Vagrant)", avatar: "https://github.com/mitchellh.png" },
  { username: "rauchg", name: "Guillermo Rauch", role: "CEO Vercel & Next.js Lead", avatar: "https://github.com/rauchg.png" },
];

// Comprehensive GitHub Language Colors Palette
const GITHUB_LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  R: "#198CE7",
  Scala: "#c22d40",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
  Zig: "#ec915c",
  Docker: "#384d54",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  TeX: "#3D6117",
  SCSS: "#c6538c",
  Nix: "#7e78d5",
  Astro: "#ff5d01",
  Assembly: "#6E4C13",
  Clojure: "#db5855",
  Erlang: "#B83998",
  "Emacs Lisp": "#c065db",
  OCaml: "#ef7a08",
  "Vim Script": "#199f4b",
  Solidity: "#AA6746",
  PowerShell: "#012456"
};