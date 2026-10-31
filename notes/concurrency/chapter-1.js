(() => {
  const KEY = "lld-concurrency-chapter-1-progress";
  const panels = [...document.querySelectorAll("[data-panel]")];
  const progressLabel = document.getElementById("progress-label");
  const progressBar = document.getElementById("chapter-progress-bar");
  let completed = new Set();
  try { completed = new Set(JSON.parse(localStorage.getItem(KEY) || "[]").map(Number)); } catch (_) {}
  function render() {
    panels.forEach(panel => {
      const id = Number(panel.dataset.panel), done = completed.has(id);
      panel.classList.toggle("learned", done);
      const button = panel.querySelector("[data-complete]");
      if (button) button.textContent = done ? "✓ Learned · click to undo" : "Mark panel learned";
    });
    const count = completed.size;
    progressLabel.textContent = count + " / " + panels.length + " panels";
    progressBar.style.width = (count / panels.length * 100) + "%";
    try { localStorage.setItem(KEY, JSON.stringify([...completed])); } catch (_) {}
  }
  document.querySelectorAll("[data-complete]").forEach(button => button.addEventListener("click", () => {
    const id = Number(button.dataset.complete);
    completed.has(id) ? completed.delete(id) : completed.add(id);
    render();
  }));
  function markAll() { completed = new Set(panels.map(p => Number(p.dataset.panel))); render(); }
  document.getElementById("mark-chapter")?.addEventListener("click", markAll);
  document.getElementById("mark-chapter-bottom")?.addEventListener("click", markAll);
  document.querySelectorAll(".copy-code").forEach(button => button.addEventListener("click", async () => {
    const code = button.closest(".code-card")?.querySelector("code")?.innerText || "";
    try { await navigator.clipboard.writeText(code); button.textContent = "Copied!"; }
    catch (_) { button.textContent = "Select code to copy"; }
    setTimeout(() => { button.textContent = "Copy code"; }, 1400);
  }));
  render();
})();