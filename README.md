# Personal Website

React + TypeScript personal site with a fox-themed UI, a small projects feed, music status, and static-friendly self-hosting defaults.

## Stack

- React 19
- Vite
- TypeScript
- Zustand

## Routes

- `/` - about page
- `/projects` - GitHub repositories
## Environment

Copy `.env.example` to `.env` and fill in what you need.

Frontend/static variables:

- `VITE_LASTFM_API_KEY`
- `VITE_LASTFM_USERNAME`
- `VITE_GITHUB_USERNAME`
- `VITE_API_BASE_URL`
- `VITE_USE_LOCAL_API`

Local worker dev variables:

- `LASTFM_API_KEY`
- `LASTFM_USERNAME`
- `GITHUB_USERNAME`

## Development

Install dependencies:

```bash
pnpm install
```

Run the frontend with the local API worker:

```bash
pnpm dev
```

Run only the static frontend:

```bash
pnpm dev:frontend
```

Run checks:

```bash
pnpm type-check
pnpm lint
pnpm build
```

## Notes

- The nginx deployment can serve `dist/` as plain static files.
- The worker entrypoint is for local API testing. Put real worker values in `.dev.vars` or an uncommitted `.env`.
