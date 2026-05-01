# Personal Website

React + TypeScript personal site with a fox-themed UI, a small projects feed, music status, and a few dormant auth-related files that are intentionally kept in the repo but not wired into the active app.

## Stack

- React 19
- Vite
- TypeScript
- React Router
- Zustand

## Routes

- `/` - about page
- `/projects` - GitHub repositories
- `/apcsp` - APCSP page

## Environment

Copy `.env.example` to `.env` and fill in what you need.

Current variables:

- `LASTFM_API_KEY`
- `LASTFM_USERNAME`
- `GITHUB_USERNAME`

## Development

Install dependencies:

```bash
pnpm install
```

Run the frontend:

```bash
pnpm dev
```

Run checks:

```bash
pnpm type-check
pnpm lint
pnpm build
```

## Notes

- The auth-related files are currently parked and are not part of the active route tree or live app shell.
- The repo includes a worker entrypoint under `src/worker/`, but you said deployment will be on your own server, so it is not the primary hosting path.
