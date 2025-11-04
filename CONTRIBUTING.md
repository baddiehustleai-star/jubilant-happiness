# Contributing to Photo2Profit

Thanks for your interest in contributing! This project uses a few simple quality gates and conventions to keep changes smooth and safe.

## Development

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Quick verify (mirrors CI): `npm run verify`

## Pull Requests

- Branch from `main`
- Ensure CI passes (lint, format:check, tests, build)
- Prefer small, focused changes with a clear summary
- Do not commit secrets; use `.env` locally (see `.env.example`)

## Automated agents

If you are using a coding agent, please read `/.github/COPILOT_CODING_AGENT.md` for repository-specific guidance including branching, PR body requirements, and quality gates.

## Code style

- ESLint (flat config) with React rules
- Prettier for formatting (enforced in CI)

## Tests

- Vitest is configured. Please add a basic test for non-trivial logic.

## Security

- Never commit secrets.
- If server credentials or API keys are required, document the environment variables in README and `.env.example`.
