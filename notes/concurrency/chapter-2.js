(() => {
  const KEY = "lld-concurrency-chapter-2-progress";
  const panels = [...document.querySelectorAll("[data-panel]")];
  const label = document.getElementById("progress-label");
  const bar = document.getElementById("chapter-progress-bar");
  const valid = new Set(panels.map(p => Number(p.dataset.panel)));
  let done = new Set();
  try { done = new Set(JSON.parse(localStorage.getItem(KEY) || "[]").map(Number).filter(id => valid.has(id))); } catch (_) {}
  function render() {
    panels.forEach(panel => {
      const id = Number(panel.dataset.panel), learned = done.has(id);
      panel.classList.toggle("done", learned);
      const button = panel.querySelector("[data-complete]");
      if (button) { button.setAttribute("aria-pressed", learned); button.textContent = learned ? "✓ Learned · click to undo" : "Mark panel learned"; }
    });
    label.textContent = done.size + " / " + panels.length + " panels";
    bar.style.width = (done.size / panels.length * 100) + "%";
    try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch (_) {}
  }
  document.querySelectorAll("[data-complete]").forEach(button => button.addEventListener("click", () => {
    const id = Number(button.dataset.complete); done.has(id) ? done.delete(id) : done.add(id); render();
  }));
  const markAll = () => { done = new Set(valid); render(); };
  document.getElementById("mark-chapter")?.addEventListener("click", markAll);
  document.getElementById("mark-chapter-bottom")?.addEventListener("click", markAll);
  render();
})();