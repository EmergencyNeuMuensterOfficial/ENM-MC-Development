const sidebarLinks = [...document.querySelectorAll('.side a[href^="#"]')];
const themeToggle = document.querySelector(".theme-toggle");
const tracker = document.querySelector("[data-version-tracker]");
const sections = sidebarLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

function setActive(id) {
  sidebarLinks.forEach((link) =>
    link.classList.toggle("is-active", link.hash === `#${id}`),
  );
}

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.classList.toggle("is-dark", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
  localStorage.setItem("enm-theme", theme);
}

const trackedVersions = [
  "26.3",
  "26.2",
  "26.1",
  "1.21.11",
  "1.21.10",
  "1.21.9",
  "1.21.8",
  "1.21.7",
  "1.21.6",
  "1.21.5",
  "1.21.4",
  "1.21.3",
  "1.21.2",
  "1.21.1",
  "1.20.6",
  "1.20.5",
  "1.20.4",
  "1.20.3",
  "1.20.2",
  "1.20.1",
];

function renderVersionTracker() {
  if (!tracker) return;
  const kind = tracker.dataset.versionTracker;
  const rows = trackedVersions.map((version) => {
    if (kind === "powerranks") {
      const fabric =
        version === "1.20.1"
          ? "In Progress"
          : version === "1.21.1" || version.startsWith("26.")
            ? "Planned"
            : "Skipped";
      return [version, fabric, "Unavailable", "Unavailable", "Unavailable"];
    }
    if (kind === "country-flags") {
      return [
        version,
        "Unavailable",
        version === "1.21.1" ? "Available" : "Unavailable",
        "Unavailable",
        "Unavailable",
      ];
    }
    return [version, "Unavailable", "Unavailable"];
  });
  tracker.insertAdjacentHTML(
    "beforeend",
    rows
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
      )
      .join(""),
  );
}

function updateActiveFromScroll() {
  const marker = 110; // Sticky header plus a small reading offset.
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) current = section;
    else break;
  }
  if (current) setActive(current.id);
}

sidebarLinks.forEach((link) =>
  link.addEventListener("click", () => setActive(link.hash.slice(1))),
);
window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
window.addEventListener("resize", updateActiveFromScroll);
updateActiveFromScroll();
renderVersionTracker();
window.lucide?.createIcons();
setTheme(localStorage.getItem("enm-theme") === "dark" ? "dark" : "light");
themeToggle.addEventListener("click", () =>
  setTheme(document.body.classList.contains("dark") ? "light" : "dark"),
);
