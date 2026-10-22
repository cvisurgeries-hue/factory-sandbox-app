// Copies the web pages and the shared library into dist/.
import { cpSync, rmSync, mkdirSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
cpSync("src/web", "dist", { recursive: true });
cpSync("src/lib", "dist/lib", { recursive: true });
console.log("build: dist/ written");
