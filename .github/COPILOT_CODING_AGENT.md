## Copilot Coding Agent — Onboarding and Guidelines

This file provides repository-specific instructions and constraints to help an automated Copilot coding agent work safely and productively in this repository.

Short summary
- Purpose: Photo2Profit admin/dashboard + upload pipeline (React + Vite + Firebase + Stripe + server scripts).
- Primary languages: JavaScript (ES modules), JSX/React, JSON, shell scripts.
- Dev container: repository is commonly used in an Ubuntu dev container.

Quick start (what the agent should run when building locally)
- Install: `npm install`
- Dev server: `npm run dev` (uses Vite)
- Build: `npm run build`
- Preview production build: `npm run preview`

Repository layout (relevant areas)
- `src/` — React app (components, pages, assets). Primary area for frontend changes.
- `scripts/` — Node scripts for reports, uploads, cross-posting. These are runnable Node scripts.
- `functions/` — Cloud Functions (Node) for serverless behaviour.
- `data/` — JSON fixtures (listings.json).
- `tests/` — small tests (e.g., `billing-test.js`).

Agent contract (2–4 bullets)
- Inputs: repo files; run scripts using `node`/`npm` locally; package.json scripts present above.
- Outputs: code edits, new tests, and PRs that build and (when applicable) run tests locally.
- Error modes: failing `npm run build`, runtime exceptions in Node scripts, broken imports.
- Success: PRs that keep existing behavior, add tests for new behavior when feasible, and pass quick local smoke checks (build / dev start).

Quality gates & checks for the agent
- Always keep `package.json` scripts intact unless intentionally changing them and documenting why.
- Run `npm install` and at minimum verify `npm run build` or `npm run dev` starts without syntax errors for frontend edits.
- When adding server code under `functions/` or `scripts/`, prefer small unit tests in `tests/` and run them if they are runnable with Node.

Conventions and style
- Use ES modules (the repo uses `type: "module"`).
- Keep UI components small and focused under `src/components/`.
- Prefer adding tests in `tests/` for non-trivial logic (happy path + one edge case).

Files and directories to NOT edit unless necessary
- `.env`, Firebase service account files, or any file named with `secret` (these should not be committed — if found, do not modify or expose secrets).
- `LICENSE` and brand guides in the repo root (unless performing documentation updates).

Security & secrets
- Never add secrets to the repo. If a change requires credentials, update README or docs explaining needed env variables and ask a human for secret injection.

PR and branching guidance
- Default branch: `main`.
- Branch name: `copilot/<concise-descriptive>` (e.g., `copilot/fix-upload-path`).
- PR body: include what changed, why, how to test locally (commands), and any new env or config needs.

When to create tests and how
- Add tests for business logic changes (scripts under `scripts/` or `functions/`). For UI-only cosmetic changes, tests are optional but encourage small snapshot/unit tests for reusable components.

Edge cases for the agent to consider
- Large data files under `data/` — avoid changing unless required.
- Upload and storage logic — be conservative and prefer small, reviewed changes.

Contact / escalation
- If uncertain about behavior or needing secrets, open an issue and assign maintainers (human review required).

Useful commands summary
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

Notes
- This doc is human-readable guidance modeled after best practices for Copilot coding agents. If you make changes to the repo structure or scripts, update this file accordingly.
