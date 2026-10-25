(() => {
  const KEY = "lld-mastery-hub-v1";
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  function readState() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { return {}; }
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("light", isLight);
    button.textContent = isLight ? "☾" : "☼";
    button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    button.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
  }

  const state = readState();
  applyTheme(state.theme || "dark");

  button.addEventListener("click", () => {
    const current = readState();
    current.theme = document.documentElement.classList.contains("light") ? "dark" : "light";
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch {}
    applyTheme(current.theme);
  });
})();