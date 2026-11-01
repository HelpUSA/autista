# SINEA — Dependency vulnerability policy

- `npm audit` all packages is a diagnostic check; log package names and remediation paths, never tokens.
- `npm audit --omit=dev --audit-level=high` is an enforced release gate for runtime dependencies.
- Remediate `moderate` and `high` advisories in development dependencies too before publishing.
- Do not run `npm audit fix --force` blindly: it may cause incompatible Vite/React changes.
- Every package update requires a regenerated lockfile and green unit/build/DB gates.
- Mobile dependencies are a separate npm package, must be audited and version-locked independently.

Current app remains DEMONSTRATION ONLY; no personal student data is authorized.
