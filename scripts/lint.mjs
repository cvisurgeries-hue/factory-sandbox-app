// Dependency-free lint: syntax-checks every script and flags a few
// house-rule violations. Exits 1 on any problem.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOTS = ["src", "test", "scripts"];
const problems = [];
const DEBUGGER = /^\s*debugger\s*;?\s*$/;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if ([".js", ".mjs"].includes(extname(path))) check(path);
  }
}

function check(path) {
  try {
    execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
  } catch (e) {
    problems.push(`${path}: syntax error\n${e.stderr}`);
    return;
  }
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (DEBUGGER.test(line)) problems.push(`${path}:${i + 1}: debugger statement`);
      if (/\s+$/.test(line)) problems.push(`${path}:${i + 1}: trailing whitespace`);
      if (path.startsWith("src") && /console\.log\(/.test(line)) problems.push(`${path}:${i + 1}: console.log in app code`);
    });
}

for (const root of ROOTS) walk(root);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`lint: ok`);
