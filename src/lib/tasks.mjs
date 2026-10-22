// Task model and an in-memory store. Pure functions, so the browser and
// node:test share the same code.

export const PRIORITIES = ["low", "normal", "high"];

export function createTask({ title, priority = "normal", due = null, tags = [] }, now = new Date()) {
  const clean = String(title ?? "").trim();
  if (!clean) throw new Error("title is required");
  if (clean.length > 200) throw new Error("title is longer than 200 characters");
  if (!PRIORITIES.includes(priority)) throw new Error(`unknown priority: ${priority}`);
  return {
    id: `t${now.getTime().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`,
    title: clean,
    priority,
    due,
    tags: normaliseTags(tags),
    done: false,
    createdAt: now.toISOString(),
  };
}

export function normaliseTags(tags) {
  const out = [];
  for (const t of tags) {
    const tag = String(t).trim().toLowerCase();
    if (tag && !out.includes(tag)) out.push(tag);
  }
  return out;
}

export class TaskStore {
  constructor(tasks = []) {
    this.tasks = [...tasks];
  }

  add(input, now) {
    const task = createTask(input, now);
    this.tasks.push(task);
    return task;
  }

  toggle(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`no task ${id}`);
    task.done = !task.done;
    return task;
  }

  remove(id) {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }

  filter({ tag = null, done = null } = {}) {
    return this.tasks.filter(
      (t) => (tag === null || t.tags.includes(tag)) && (done === null || t.done === done),
    );
  }

  // Open tasks first, then by priority (high first), then by due date.
  sorted() {
    const rank = (p) => PRIORITIES.length - PRIORITIES.indexOf(p);
    return [...this.tasks].sort(
      (a, b) =>
        Number(a.done) - Number(b.done) ||
        rank(a.priority) - rank(b.priority) ||
        (a.due ?? "9999").localeCompare(b.due ?? "9999"),
    );
  }

  totals() {
    const done = this.tasks.filter((t) => t.done).length;
    return { total: this.tasks.length, done, open: this.tasks.length - done };
  }
}
