# Copilot Coding Agent — Repository Onboarding

This file tells a Copilot coding agent (and future contributors) how to work safely and effectively in this repository.

## Repo at-a-glance
- Name: photo2profit (package.json)
- Tech: React + Vite, Tailwind CSS
- Location of app entry: `src/main.jsx`
- Pages: `src/pages/` (e.g. `Landing.jsx`)
- Styling: `src/index.css` + Tailwind config (`tailwind.config.js`)

## Quick start (exact commands)
These commands assume a POSIX shell (bash) from the repository root.

1. Install dependencies

   npm ci

2. Start dev server (Vite)

   npm run dev

3. Build for production

   npm run build

4. Preview production build locally

   npm run preview

There are no test or lint scripts configured in `package.json` at the moment.

## Project layout (important files)
- `index.html` — app HTML
- `src/main.jsx` — React entry
- `src/pages/` — top-level pages/components
- `src/assets/` — images and static assets
- `src/index.css` — Tailwind entry
- `vite.config.js`, `tailwind.config.js`, `postcss.config.js` — build config

## What the agent is allowed to do (high-level)
- Make small, well-tested edits and bug fixes.
- Implement features if they are small and self-contained (follow the tests/PR rules below).
- Add or update documentation, README, and developer-onboarding files.
- Add small utilities, types, or helper functions that are limited in scope.

## Hard constraints & disallowed actions
- Do NOT add or commit secrets, private keys, tokens, or credentials. If a secret is needed, create a secure placeholder and open an issue describing required secrets.
- Do NOT perform large, high-risk refactors without explicit human review (open a draft PR first and request reviewers).
- Do NOT upgrade major dependencies or change CI/build infrastructure without A) running the build locally and B) including a clear migration plan in the PR.
- Avoid changing files outside `src/` unless the change is purely documentation or configuration necessary to support the change.

## PR & commit conventions for agent-generated changes
- Keep PRs small and focused (one feature/bug per PR).
- Include a short description of intent, testing steps, and any manual verification notes in the PR body.
- Reference any related issue number when present.

## Tests and verification
- There are currently no automated tests configured. For any non-trivial change, the agent should add at least one simple test or a manual verification checklist in the PR.
- Always run `npm run build` locally for changes that touch build configuration, production code paths, or dependencies.

## Assumptions the agent can make
- Browser target: modern evergreen browsers (Vite + React 18).
- Node: the agent may assume Node.js LTS is available for dev tasks. If a specific Node version is required, add an `.nvmrc` or `engines` field and document it.

## Files / areas to be careful with
- `index.html` and `vite.config.js` — changing them can affect the whole app.
- Any deployment/hosting files (not present currently) — open a PR and request review from maintainers.

## Suggested reviewer / CODEOWNERS
If possible, the repository should add a `CODEOWNERS` file to indicate who should review agent PRs. A minimal suggestion (edit as appropriate):

```
* @baddiehustleai-star
```

Place the `CODEOWNERS` file at `.github/CODEOWNERS` to enable automatic reviewer suggestions.

## If the agent is unsure
- Create a draft PR and list the open questions at the top of the PR description.
- Ping the maintainers (use GitHub reviewers or comment on the draft PR).

## Small proactive improvements the agent may make
- Add this file (onboarding) — done.
- Add a `CONTRIBUTING.md` or `README` enhancement describing local run steps.
- Add a minimal `npm test` script + a tiny smoke test if unit-test framework is acceptable to maintainers.

## Notes for maintainers (one-liner)
This onboarding file is intentionally conservative. Expand permissions (e.g., allow dependency updates) by updating this document and the repository's policy files when you want the agent to act more autonomously.

---
Generated: Copilot coding agent onboarding — lightweight, actionable guidance for automated contribution.
