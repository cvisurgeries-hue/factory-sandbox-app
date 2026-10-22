// localStorage persistence for the browser pages.
import { TaskStore } from "./lib/tasks.mjs";

const KEY = "factory-sandbox-tasks";

export function load() {
  try {
    return new TaskStore(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new TaskStore();
  }
}

export function save(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store.tasks));
  } catch {
    // Storage can be unavailable (private mode); the page still works for this visit.
  }
}
