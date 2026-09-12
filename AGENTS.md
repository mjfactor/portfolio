# AGENTS.md — portfolio

Next.js 16 (App Router) + TypeScript strict + Tailwind v4 + shadcn new-york + Framer Motion. Single-package repo (not a monorepo). Package manager is **pnpm** (`pnpm-lock.yaml`); Dockerfile uses `corepack enable pnpm`.

## Commands

- `pnpm dev` (`next dev`) — local dev (Turbopack is default in Next 16). `pnpm build` / `pnpm start` — prod build/serve.
- `pnpm lint` — `eslint .` with flat `eslint.config.mjs` (`eslint-config-next` core-web-vitals + typescript).
- `pnpm db:generate|db:migrate|db:push|db:pull` — **dead scripts**: `drizzle-orm`/`drizzle-kit`/`@neondatabase/serverless` are installed but there is no `drizzle.config.ts`, no schema, and no DB usage in code. Do not run expecting a database.
- No test runner, no typecheck script. Closest verification: `pnpm build` (also runs type inference via Next plugin).

## Architecture

- Entrypoints: `app/layout.tsx` (fonts, ThemeProvider, Toaster), `app/page.tsx` (client component, composes `AboutMe`/`ProjectsSection`/`ChatBox`), `app/api/chat/route.ts` (edge runtime, `maxDuration = 30`, streams `gemini-2.5-flash` via `streamText` with a system prompt built from `projects.json` — no tools, no retrieval).
- `projects.json` (root) is static data inlined into the chat system prompt — update it when project info changes.
- `next.config.ts`: `output: 'standalone'` for Docker (`Dockerfile` copies `.next/standalone` + `.next/static` + `public`, `node server.js`).

## Conventions & gotchas

- Path alias is `@/*` → `./*` (`tsconfig.json`), so imports look like `@/lib/utils`, `@/projects.json`. shadcn aliases: `@/components`, `@/lib/utils`, `@/components/ui`.
- Prefer Server Components; `"use client"` only for small interactive pieces (`app/page.tsx`, `components/chat-box.tsx`). `components/ui/*` are canonical shadcn primitives — don't fork them.
- **Do not change color token values in `app/globals.css`.** Use semantic classes (`bg-background`, `text-foreground`, `border-border`); OKLCH tokens support light/dark. Tailwind v4: styling via CSS + `@tailwindcss/postcss`, no `tailwind.config`.
- Props: `interface` (not `type`); `cn()` from `@/lib/utils` for conditional classes; named exports for components.
- Chat auth: set both `GOOGLE_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY` locally if chat auth fails.
- Push to `main` triggers Vercel deploy. There is no reindex step — the chatbot answers from the system prompt + `projects.json` only.
- `.github/copilot-instructions.md` + `.github/instructions/guide.instructions.md` hold the longer style/theming rules.
