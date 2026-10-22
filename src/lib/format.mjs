// Display helpers.

// Parses YYYY-MM-DD into a UTC date. Returns null for anything else.
export function parseDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text ?? "").trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (d.getUTCMonth() !== Number(m[2]) - 1) return null;
  return d;
}

export function isOverdue(task, today = new Date()) {
  if (task.done || !task.due) return false;
  const due = parseDate(task.due);
  if (!due) return false;
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return due.getTime() < start;
}

export function formatDue(task, today = new Date()) {
  if (!task.due) return "";
  return isOverdue(task, today) ? `${task.due} (overdue)` : task.due;
}

export function summary({ total, done, open }) {
  if (total === 0) return "No tasks yet";
  return `${open} open, ${done} done (${total} total)`;
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
