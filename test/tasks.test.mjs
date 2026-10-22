import { test } from "node:test";
import assert from "node:assert/strict";
import { createTask, normaliseTags, TaskStore } from "../src/lib/tasks.mjs";

const NOW = new Date("2026-10-22T12:00:00Z");

test("createTask trims the title and applies defaults", () => {
  const t = createTask({ title: "  Write docs  " }, NOW);
  assert.equal(t.title, "Write docs");
  assert.equal(t.priority, "normal");
  assert.equal(t.done, false);
  assert.equal(t.createdAt, "2026-10-22T12:00:00.000Z");
});

test("createTask rejects an empty title, a long title and an unknown priority", () => {
  assert.throws(() => createTask({ title: "   " }), /title is required/);
  assert.throws(() => createTask({ title: "x".repeat(201) }), /longer than 200/);
  assert.throws(() => createTask({ title: "a", priority: "urgent" }), /unknown priority/);
});

test("normaliseTags lowercases, trims and removes duplicates and blanks", () => {
  assert.deepEqual(normaliseTags([" Work", "work", "", "home "]), ["work", "home"]);
});

test("TaskStore adds, toggles and removes", () => {
  const s = new TaskStore();
  const t = s.add({ title: "a" }, NOW);
  assert.equal(s.toggle(t.id).done, true);
  assert.deepEqual(s.totals(), { total: 1, done: 1, open: 0 });
  assert.equal(s.remove(t.id), true);
  assert.equal(s.remove(t.id), false);
  assert.throws(() => s.toggle(t.id), /no task/);
});

test("TaskStore filters by tag and done state", () => {
  const s = new TaskStore();
  s.add({ title: "a", tags: ["work"] }, NOW);
  const b = s.add({ title: "b", tags: ["home"] }, NOW);
  s.toggle(b.id);
  assert.deepEqual(s.filter({ tag: "work" }).map((t) => t.title), ["a"]);
  assert.deepEqual(s.filter({ done: true }).map((t) => t.title), ["b"]);
});

test("sorted puts open tasks first, then high priority, then the earliest due date", () => {
  const s = new TaskStore();
  const done = s.add({ title: "done", priority: "high" }, NOW);
  s.toggle(done.id);
  s.add({ title: "low", priority: "low" }, NOW);
  s.add({ title: "later", priority: "high", due: "2026-12-01" }, NOW);
  s.add({ title: "sooner", priority: "high", due: "2026-11-01" }, NOW);
  assert.deepEqual(s.sorted().map((t) => t.title), ["sooner", "later", "low", "done"]);
});
