// Files a fixed set of starter issues of different sizes for the factory.
// Previews by default; pass --yes to create them. Needs the gh CLI logged in.
//   node scripts/seed-issues.mjs [--repo owner/name] [--yes]
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const yes = args.includes("--yes");
const repo = args.includes("--repo") ? args[args.indexOf("--repo") + 1] : null;

const ISSUES = [
  {
    title: "Show the overdue count in the summary line",
    labels: ["ready", "size:small"],
    body: "The summary says `2 open, 1 done (3 total)`. Add the overdue count when it is above zero, e.g. `2 open (1 overdue), 1 done (3 total)`.\n\nAcceptance: `summary()` takes the count, tests cover zero and non-zero, the page shows it.",
  },
  {
    title: "Bug: a due date of today is shown as overdue in timezones west of UTC",
    labels: ["ready", "kind:bug", "size:small"],
    body: "`isOverdue` compares against the UTC date, so in the evening in America/Los_Angeles a task due today shows as overdue.\n\nAcceptance: a regression test that fails today, and the fix uses the viewer's local date.",
  },
  {
    title: "Filter the list by tag on the main page",
    labels: ["ready", "size:medium", "ui"],
    body: "Add a tag filter (a select of the tags in use) above the list on `index.html`. The selection survives a reload.\n\nAcceptance: the filter uses `TaskStore.filter`, tests cover the store side, and the page works at mobile width.",
  },
  {
    title: "Export tasks as CSV",
    labels: ["ready", "size:medium"],
    body: "Add an `Export CSV` button that downloads all tasks with columns title, priority, due, tags, done. Quote fields that contain commas, quotes or newlines.\n\nAcceptance: a pure `toCsv(tasks)` in `src/lib/` with tests for the quoting rules.",
  },
  {
    title: "Epic: recurring tasks",
    labels: ["mode:plan", "size:large"],
    body: "Users want tasks that repeat daily, weekly or monthly. When a recurring task is marked done, the next one appears.\n\nOpen questions: what happens to tags and priority on the copy, how a recurring task is deleted, and how overdue copies stack up.",
  },
];

const cmd = (issue) => [
  "issue", "create",
  ...(repo ? ["--repo", repo] : []),
  "--title", issue.title,
  "--body", issue.body,
  ...issue.labels.flatMap((l) => ["--label", l]),
];

const labels = [...new Set(ISSUES.flatMap((i) => i.labels))];
console.log(`${yes ? "Creating" : "Would create"} ${labels.length} labels and ${ISSUES.length} issues${repo ? ` in ${repo}` : ""}:`);
for (const i of ISSUES) console.log(`- ${i.title} [${i.labels.join(", ")}]`);
if (!yes) {
  console.log("\nPreview only. Re-run with --yes to create them.");
  process.exit(0);
}
for (const l of labels) {
  execFileSync("gh", ["label", "create", l, "--force", ...(repo ? ["--repo", repo] : [])], { stdio: "inherit" });
}
for (const i of ISSUES) execFileSync("gh", cmd(i), { stdio: "inherit" });
