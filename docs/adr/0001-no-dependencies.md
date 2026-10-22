# ADR 0001: no dependencies

Status: accepted

The app uses only Node's standard library and the browser. `npm ci` is instant, there is no supply chain to audit, and every failure the factory sees comes from its own change, not from a package update.
