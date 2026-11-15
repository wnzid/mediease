# Archive notes

MediEase was cleaned for local archiving on 15 November 2026.

## Preserved

- Application source, route architecture, shared UI, domain features, localization and Supabase integration.
- Branding, photographs, icons and other runtime assets.
- Dependency manifests and lockfile, middleware and build/lint/TypeScript configuration.
- Project README, Git history and existing local environment settings. The local environment file remains private and ignored by Git.

## Removed

- Installed dependencies (`node_modules`).
- Next.js build/development output and caches (`.next`).
- Generated Next.js types (`next-env.d.ts`) and TypeScript incremental state (`tsconfig.tsbuildinfo`).
- Local editor settings (`.vscode`).

No separate AI instruction or attachment files were present outside generated dependencies and caches. Runtime assets were retained even where they could be recreated, because they are part of the archived project.

The source and runtime assets were verified against pre-cleanup hashes. No build or test suite was run, since doing so would recreate the dependencies and generated output. The cleanup did not perform any deployment or hosted database operation.

## If reopened

Use `npm ci` to install the locked dependencies. `npm run dev` or `npm run build` regenerates Next.js output and generated types; TypeScript checks recreate the incremental cache. Environment configuration and the route architecture remain documented in the main README. Local editor settings can be configured again as needed.
