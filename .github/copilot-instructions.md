## AI Coding Assistant Instructions — Portfolio

This concise guide helps an AI coding agent become productive in this repository quickly. Focus on the files and commands listed, and follow the project-specific conventions.

Snapshot
- Framework: Next.js 15 (App Router) with TypeScript (strict).
- UI: shadcn UI + Radix + Tailwind CSS v4. Animations: Framer Motion.
- AI: Google AI SDK (`@ai-sdk/*`) for chat + embeddings; RAG stored in Azure AI Search.
- DB: Neon Postgres via Drizzle ORM. Package manager: `pnpm`.

Quick commands
- `pnpm dev --turbopack` — local development (Turbopack)
- `pnpm build` — production build
- `pnpm start` — production server
- `pnpm lint` — run ESLint
- `pnpm run rag:scrape` — re-index website and resume into Azure AI Search
- `pnpm run db:generate|db:migrate|db:push|db:pull` — Drizzle DB workflows

Big picture & data flow
- UI and content: pages and components under `app/` and `components/` (static `projects.json` feeds system prompts).
- Chat API: `app/api/chat/route.ts` implements the chat endpoint and invokes retrieval/tool-calls.
- RAG pipeline: `lib/rag/` contains scraper, chunking, embedding and index management (`runRecreateIndex.ts`, `scraper.ts`, `retrieval.ts`).
- Flow: web UI -> chat API -> retrieval layer -> Google embeddings + Azure AI Search -> chat model responses.

Conventions (follow strictly)
- Prefer Server Components; only use `"use client"` at the top of small interactive components (e.g., `components/chat-box.tsx`).
- Keep `components/ui/*` as the canonical shadcn UI primitives. Import via `@/components/ui/*`.
- Do NOT change color token values in `app/globals.css` — theme tokens (`bg-background`, `text-foreground`, etc.) are relied upon.
- Use functional components and TypeScript `interface` for props. Use `cn()` from `@/lib/utils` for conditional classes.
- Use `@/` path aliases configured in `tsconfig.json` for imports.

Integration & environment notes
- Required env vars for local testing and RAG: `GOOGLE_AI_API_KEY`, `AZURE_AISEARCH_ENDPOINT`, `AZURE_AISEARCH_KEY`.
- RAG index names referenced in code: `emjay-portfolio` and `emjay-resume`.
- Resume PDF path (used by scraper): `/Emjay_Factor_Resume.pdf` (check `lib/rag/scraper.ts`).

Files to inspect before changing behavior
- `app/api/chat/route.ts` — read first to understand chat/tool-calling.
- `lib/rag/retrieval.ts` & `lib/rag/scraper.ts` — reindexing and search logic.
- `components/chat-box.tsx` — client-side streaming UI and hooks.
- `projects.json` — canonical project metadata used in prompts.
- `components/ui/*` — shared UI components and visual patterns.

Agent checklist when making changes
1. Run unit/dev flow: `pnpm dev --turbopack` to verify UI/server changes.
2. For RAG/index changes, set env vars and run: `pnpm run rag:scrape` to populate indexes.
3. For DB migrations, use the Drizzle commands above and verify locally.
4. Respect theming tokens and `use client` boundaries.

If anything is unclear, ask for the desired behavior and point to the specific file(s) you plan to change.

— End of guide —
# AI Coding Assistant Instructions for Portfolio Project

## Project Overview
This is a Next.js 15 portfolio website with AI-powered chat assistant featuring RAG (Retrieval-Augmented Generation) capabilities. The site showcases projects, skills, and provides an interactive chat interface for visitors to learn about Emjay's work.

## Architecture & Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode enabled)
- **UI**: Shadcn UI + Radix UI primitives with Tailwind CSS v4
- **AI**: Google AI SDK + Vercel AI for chat, Azure AI Search for vector retrieval
- **Database**: Neon PostgreSQL (Drizzle ORM), Azure AI Search for embeddings
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
- Tool calling enabled with `getInformation` tool for RAG retrieval
- Messages support tool invocation states and markdown rendering
- System prompt includes project data from `projects.json`

### RAG Pipeline
- Scrapes portfolio website and resume PDF using Playwright + PDF loader
- Chunks documents (1000 chars, 200 overlap) and embeds with Google AI
- Stores in separate Azure AI Search indexes: `emjay-portfolio` and `emjay-resume`
- Retrieval combines both sources for comprehensive answers

## Critical Workflows

### Development
```bash
pnpm dev --turbopack  # Fast development with Turbopack
pnpm build           # Production build
pnpm start           # Production server
pnpm lint            # ESLint check
```

### RAG Index Management
```bash
pnpm run rag:scrape  # Update vector indexes from live content
```
- Scrapes `https://portfolio-emjay-factor.vercel.app/` and resume PDF
- Safely replaces existing Azure AI Search indexes
- Run after content updates or before deployment

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
- RAG logic in `/lib/rag/`
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
- Projects data in `projects.json` (static)
- Resume content via PDF parsing in RAG pipeline
- Environment variables for API keys (Google AI, Azure Search)

## Integration Points

### AI Services
- **Google AI**: Chat responses and embeddings (`@ai-sdk/google`, `@google/generative-ai`)
- **Azure AI Search**: Vector storage and hybrid search
- **Vercel AI**: React hooks and streaming (`@ai-sdk/react`)

### Deployment
- **Vercel**: Primary deployment with Next.js integration
- **Docker**: Multi-stage build with `standalone` output
- **Google Cloud Run**: Containerized deployment option

### External APIs
- Portfolio website scraping (self-hosted)
- Resume PDF loading from `/Emjay_Factor_Resume.pdf`
- GitHub profile data (referenced in system prompt)

## Common Patterns

### Error Handling
- Try/catch blocks in async operations
- Console logging for debugging
- Graceful fallbacks in RAG retrieval

### Environment Setup
```bash
# Required environment variables
GOOGLE_AI_API_KEY=...
AZURE_AISEARCH_ENDPOINT=...
AZURE_AISEARCH_KEY=...
```

### Build Optimization
- Next.js standalone output for Docker
- Turbopack for fast development builds
- Tree-shaking and code splitting handled by Next.js

## Key Files to Reference
- `app/api/chat/route.ts` - Chat API with tool calling
- `lib/rag/retrieval.ts` - Vector search logic
- `lib/rag/scraper.ts` - Content indexing pipeline
- `components/chat-box.tsx` - Chat UI component
- `projects.json` - Project data structure
- `components.json` - Shadcn UI configuration</content>
<parameter name="filePath">c:\Users\emjay\Downloads\PROJECTS\portfolio\.github\copilot-instructions.md