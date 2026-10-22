import { escapeHtml } from "./lib/format.mjs";
import { load } from "./storage.js";

const store = load();
const groups = new Map();
for (const t of store.sorted()) {
  for (const tag of t.tags.length ? t.tags : ["untagged"]) {
    if (!groups.has(tag)) groups.set(tag, []);
    groups.get(tag).push(t);
  }
}

document.getElementById("groups").innerHTML = groups.size
  ? [...groups]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([tag, tasks]) => `<section><h2>${escapeHtml(tag)} <small>${tasks.length}</small></h2><ul>${tasks
          .map((t) => `<li class="${t.done ? "done" : ""}">${escapeHtml(t.title)}</li>`)
          .join("")}</ul></section>`,
      )
      .join("")
  : "<p>No tasks yet</p>";
