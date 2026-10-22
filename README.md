# factory-sandbox-app

A small task-list web app. It exists so the software factory has a safe,
private repo to work on during live checks. It is not a product.

## Run it

Requires Node 22 or later. There are no dependencies.

```sh
npm ci
npm run lint
npm test
npm run build
npm run preview   # serves dist/ on http://127.0.0.1:4173
```

## Layout

| Path | What |
|---|---|
| `src/lib/` | Task model, store and formatting (shared by the browser and the tests) |
| `src/web/` | Two pages: all tasks (`index.html`) and tasks by tag (`tags.html`) |
| `test/` | `node:test` unit tests |
| `scripts/` | lint, build, a static server, and `seed-issues.mjs` |
| `infra/` | A Terraform stub that creates nothing (`null_resource`) |
| `docs/` | Specs and ADRs the factory reads as context |

## Resetting

The starting point is tagged `baseline`. To reset between live-check rounds:

```sh
git checkout main
git reset --hard baseline
git push --force-with-lease origin main
```

Only a human does this. The factory never force-pushes `main`.
