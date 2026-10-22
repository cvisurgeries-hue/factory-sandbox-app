import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, formatDue, isOverdue, parseDate, summary } from "../src/lib/format.mjs";

const TODAY = new Date("2026-10-22T08:00:00Z");

test("parseDate reads YYYY-MM-DD and rejects other shapes and impossible dates", () => {
  assert.equal(parseDate("2026-10-22").toISOString(), "2026-10-22T00:00:00.000Z");
  assert.equal(parseDate("22/10/2026"), null);
  assert.equal(parseDate("2026-02-30"), null);
  assert.equal(parseDate(null), null);
});

test("isOverdue is true only for open tasks due before today", () => {
  assert.equal(isOverdue({ done: false, due: "2026-10-21" }, TODAY), true);
  assert.equal(isOverdue({ done: false, due: "2026-10-22" }, TODAY), false);
  assert.equal(isOverdue({ done: true, due: "2026-10-01" }, TODAY), false);
  assert.equal(isOverdue({ done: false, due: null }, TODAY), false);
});

test("formatDue marks overdue tasks", () => {
  assert.equal(formatDue({ done: false, due: "2026-10-01" }, TODAY), "2026-10-01 (overdue)");
  assert.equal(formatDue({ done: false, due: "2026-11-01" }, TODAY), "2026-11-01");
  assert.equal(formatDue({ done: false, due: null }, TODAY), "");
});

test("summary describes the totals", () => {
  assert.equal(summary({ total: 0, done: 0, open: 0 }), "No tasks yet");
  assert.equal(summary({ total: 3, done: 1, open: 2 }), "2 open, 1 done (3 total)");
});

test("escapeHtml escapes markup characters", () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
});
