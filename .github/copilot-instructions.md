## AI Coding Assistant Instructions — Portfolio

This concise guide helps an AI coding agent become productive in this repository quickly. Focus on the files and commands listed, and follow the project-specific conventions.

Snapshot
- Framework: Next.js 16 (App Router) with TypeScript (strict).
- UI: shadcn UI + Radix + Tailwind CSS v4. Animations: Framer Motion.
- AI: Google AI SDK (`@ai-sdk/*`) for chat (system prompt + `projects.json`, no retrieval).
- DB: Neon Postgres via Drizzle ORM. Package manager: `pnpm`.

Quick commands
- `pnpm dev` — local development (Turbopack is default)
- `pnpm build` — production build
- `pnpm start` — production server
- `pnpm lint` — run ESLint
- `pnpm run db:generate|db:migrate|db:push|db:pull` — Drizzle DB workflows

Big picture & data flow
- UI and content: pages and components under `app/` and `components/` (static `projects.json` feeds system prompts).
- Chat API: `app/api/chat/route.ts` implements the chat endpoint with a system prompt built from `projects.json` (no tools, no retrieval).
- Flow: web UI -> chat API -> Google Gemini model responses.

Conventions (follow strictly)
- Prefer Server Components; only use `"use client"` at the top of small interactive components (e.g., `components/chat-box.tsx`).
- Keep `components/ui/*` as the canonical shadcn UI primitives. Import via `@/components/ui/*`.
- Do NOT change color token values in `app/globals.css` — theme tokens (`bg-background`, `text-foreground`, etc.) are relied upon.
- Use functional components and TypeScript `interface` for props. Use `cn()` from `@/lib/utils` for conditional classes.
- Use `@/` path aliases configured in `tsconfig.json` for imports.

Integration & environment notes
- Required env vars for local chat: `GOOGLE_API_KEY` and `GOOGLE_GENERATIVE_AI_API_KEY`.
- Resume PDF path (linked in chat system prompt): `/Emjay_Factor_Resume.pdf` in `public/`.

Files to inspect before changing behavior
- `app/api/chat/route.ts` — read first to understand the chat system prompt.
- `components/chat-box.tsx` — client-side streaming UI and hooks.
- `projects.json` — canonical project metadata used in prompts.
- `components/ui/*` — shared UI components and visual patterns.

Agent checklist when making changes
1. Run unit/dev flow: `pnpm dev` to verify UI/server changes.
2. For chatbot content changes, update `projects.json` and the system prompt in `app/api/chat/route.ts`.
3. For DB migrations, use the Drizzle commands above and verify locally.
4. Respect theming tokens and `use client` boundaries.

If anything is unclear, ask for the desired behavior and point to the specific file(s) you plan to change.

— End of guide —
# AI Coding Assistant Instructions for Portfolio Project

## Project Overview
This is a Next.js 16 portfolio website with AI-powered chat assistant. The site showcases projects, skills, and provides an interactive chat interface for visitors to learn about Emjay's work.

## Architecture & Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **UI**: Shadcn UI + Radix UI primitives with Tailwind CSS v4
- **AI**: Google AI SDK + Vercel AI for chat (system prompt only)
- **Database**: Neon PostgreSQL (Drizzle ORM)
- **Deployment**: Vercel (primary) + Google Cloud Run (Docker)
- **Animations**: Framer Motion
- **Package Manager**: pnpm

## Key Components & Patterns

### Component Structure
- Use functional components with TypeScript interfaces
- Mark client components with `"use client"` directive
- Prefer server components by default (Next.js App Router)
- Import from `@/components/ui/*` for Shadcn components
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Example Component Pattern
```tsx
interface ComponentProps {
  // props interface
}

export function ComponentName({ prop }: ComponentProps) {
  return (
    <div className={cn("base-classes", conditionalClass)}>
      {/* content */}
    </div>
  )
}
```

### AI Chat System
- Chat uses `@ai-sdk/react` with Google Gemini 2.5 Flash
- No tools, no retrieval — answers come from the system prompt + `projects.json`
- Messages support markdown rendering
- System prompt includes project data from `projects.json`

### Chat Content
- Chatbot answers from the system prompt in `app/api/chat/route.ts` + `projects.json`
- Update `projects.json` when project info changes; no reindex step

## Critical Workflows

### Development
```bash
pnpm dev  # Fast development with Turbopack (default)
pnpm build           # Production build
pnpm start           # Production server
pnpm lint            # ESLint check
```

### Database
```bash
pnpm run db:generate  # Generate Drizzle migrations
pnpm run db:migrate   # Apply migrations
pnpm run db:push      # Push schema changes
pnpm run db:pull      # Pull remote schema
```

## Project-Specific Conventions

### Theming & Styling
- **DO NOT modify color values** - Uses shadcn/ui theming system
- Use semantic CSS variables: `bg-background`, `text-foreground`, `border-border`
- Theme-aware classes work in both light/dark modes
- OKLCH color space with CSS custom properties

### File Organization
- Components in `/components/` (shared) or `/app/components/` (page-specific)
- UI components in `/components/ui/` (Shadcn library)
- Utilities in `/lib/`
- Static data in root (e.g., `projects.json`)

### Path Aliases
- `@/*` maps to `./*` (configured in `tsconfig.json`)
- Use `@/components/*`, `@/lib/*`, etc. for imports

### Technology Icons
- Use `simple-icons` package for consistent tech badges
- Wrap in custom `SimpleIcon` component with proper SVG props
- Example: `<SimpleIcon icon={siReact} size={16} className="text-primary" />`

### Animations
- Use Framer Motion for complex animations
- `motion.div` with `initial`, `animate`, `whileInView` props
- `viewport={{ once: true }}` for performance

### Data Management
- Projects data in `projects.json` (static, inlined into chat system prompt)
- Resume linked as static PDF in `public/`
- Environment variables for API keys (Google AI)

## Integration Points

### AI Services
- **Google AI**: Chat responses (`@ai-sdk/google`)
- **Vercel AI**: React hooks and streaming (`@ai-sdk/react`)

### Deployment
- **Vercel**: Primary deployment with Next.js integration
- **Docker**: Multi-stage build with `standalone` output
- **Google Cloud Run**: Containerized deployment option

### External Links
- Resume PDF served from `/Emjay_Factor_Resume.pdf`
- GitHub profile data (referenced in system prompt)

## Common Patterns

### Error Handling
- Try/catch blocks in async operations
- Console logging for debugging
- Graceful error handling in chat API

### Environment Setup
```bash
# Required environment variables
GOOGLE_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

### Build Optimization
- Next.js standalone output for Docker
- Turbopack for fast development builds
- Tree-shaking and code splitting handled by Next.js

## Key Files to Reference
- `app/api/chat/route.ts` - Chat API (system prompt + `projects.json`)
- `components/chat-box.tsx` - Chat UI component
- `projects.json` - Project data structure
- `components.json` - Shadcn UI configuration</content>
<parameter name="filePath">c:\Users\emjay\Downloads\PROJECTS\portfolio\.github\copilot-instructions.md