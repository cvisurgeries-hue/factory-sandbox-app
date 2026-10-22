# House rules for agents

- Plain JavaScript ES modules, no build step, no dependencies. Do not add packages.
- Shared logic lives in `src/lib/` as pure functions so `node:test` can cover it.
- Every behaviour change comes with a test in `test/`. Run `npm run lint && npm test && npm run build` before you finish.
- Escape any user text before it reaches `innerHTML` (`escapeHtml` in `src/lib/format.mjs`).
- Do not edit `infra/`, `.github/` or `CODEOWNERS` unless the issue asks for it.
