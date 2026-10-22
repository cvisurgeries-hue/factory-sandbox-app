import { escapeHtml, formatDue, isOverdue, summary } from "./lib/format.mjs";
import { load, save } from "./storage.js";

const store = load();
const list = document.getElementById("list");
const form = document.getElementById("add");

function render() {
  document.getElementById("summary").textContent = summary(store.totals());
  list.innerHTML = store
    .sorted()
    .map(
      (t) => `<li class="${t.done ? "done" : ""} ${isOverdue(t) ? "overdue" : ""}" data-id="${t.id}">
        <label><input type="checkbox" ${t.done ? "checked" : ""} /> ${escapeHtml(t.title)}</label>
        <span class="priority ${t.priority}">${t.priority}</span>
        <span class="due">${escapeHtml(formatDue(t))}</span>
        <span class="tags">${t.tags.map((g) => `<em>${escapeHtml(g)}</em>`).join(" ")}</span>
        <button class="remove" aria-label="Remove ${escapeHtml(t.title)}">×</button>
      </li>`,
    )
    .join("");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  store.add({
    title: data.get("title"),
    priority: data.get("priority"),
    due: data.get("due") || null,
    tags: String(data.get("tags") ?? "").split(","),
  });
  save(store);
  form.reset();
  render();
});

list.addEventListener("click", (e) => {
  const id = e.target.closest("li")?.dataset.id;
  if (!id) return;
  if (e.target.matches("input[type=checkbox]")) store.toggle(id);
  else if (e.target.matches("button.remove")) store.remove(id);
  else return;
  save(store);
  render();
});

render();
