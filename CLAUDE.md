# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nodebase is a Next.js-based workflow automation platform that allows users to create, manage, and execute workflows using a visual node-based editor. The application features:

- Visual workflow editor powered by React Flow (@xyflow/react)
- Node-based workflow execution system with triggers and actions
- User authentication via Better Auth with GitHub OAuth and Polar integration for subscriptions
- PostgreSQL database with Prisma ORM
- tRPC API with React Query for type-safe client-server communication
- Background job processing with Inngest
- Error monitoring with Sentry
- Payment/subscription handling via Polar.sh

## Development Commands

### Setup and Development
```bash
# Install dependencies (uses pnpm)
pnpm install

# Run development servers (Next.js + Inngest via mprocs)
pnpm run dev:all

# Run Next.js only
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

### Database Commands
```bash
# Generate Prisma Client (outputs to src/generated/prisma)
pnpm run db:generate

# Create and apply migrations
pnpm run db:migrate

# Reset database (destructive)
pnpm run db:reset

# Open Prisma Studio
pnpm run db:studio
```

### Code Quality
```bash
# Lint and check code with Biome
pnpm run lint

# Format code with Biome
pnpm run format
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **API Layer**: tRPC v11 with React Query
- **Authentication**: Better Auth with Polar.sh plugin for subscriptions
- **Background Jobs**: Inngest
- **UI Components**: Radix UI + shadcn/ui patterns
- **Styling**: Tailwind CSS v4
- **State Management**: Jotai for client state
- **Form Handling**: React Hook Form with Zod validation
- **Workflow Editor**: React Flow (@xyflow/react)
- **Error Tracking**: Sentry

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── (dashboard)/
│   │   ├── (rest)/        # Standard dashboard pages (workflows list, executions, credentials)
│   │   └── (editor)/      # Workflow editor page
│   ├── api/               # API routes (tRPC, auth, inngest)
│   └── layout.tsx         # Root layout with providers
├── features/              # Feature-based modules
│   ├── auth/             # Authentication components
│   ├── editor/           # Workflow editor (React Flow integration)
│   ├── executions/       # Workflow execution nodes (HTTP requests, etc.)
│   ├── subscriptions/    # Polar.sh subscription handling
│   ├── triggers/         # Workflow triggers (manual, scheduled, etc.)
│   └── workflows/        # Workflow management (CRUD, queries)
├── components/           # Shared React components
│   ├── ui/              # shadcn/ui components
│   └── [other].tsx      # App-specific shared components
├── config/              # Configuration files
│   ├── constants.ts     # App-wide constants (pagination, etc.)
│   └── node-components.ts # Node type to component mappings
├── generated/           # Auto-generated code
│   └── prisma/         # Prisma Client (custom output path)
├── hooks/              # Shared React hooks
├── inngest/            # Inngest background jobs
│   ├── client.tsx      # Inngest client setup
│   └── functions.ts    # Inngest function definitions
├── lib/                # Core utilities and clients
│   ├── auth.ts         # Better Auth configuration
│   ├── auth-client.ts  # Better Auth client
│   ├── db.ts           # Prisma client singleton
│   ├── polar.ts        # Polar.sh client
│   └── utils.ts        # Utility functions
└── trpc/               # tRPC configuration
    ├── init.ts         # tRPC initialization with procedures
    ├── routers/        # tRPC routers
    ├── query-client.ts # React Query client
    └── server.tsx      # Server-side tRPC setup
```

### Key Architectural Patterns

#### Feature-Based Organization
Features are organized in `src/features/` with each containing:
- `components/` - Feature-specific React components
- `server/routers.ts` - tRPC routes for the feature (if applicable)
- `hooks/` - Feature-specific React hooks (if applicable)

#### tRPC Procedures
Three procedure types defined in `src/trpc/init.ts`:
- `baseProcedure` - Public, no authentication required
- `protectedProcedure` - Requires user authentication via Better Auth
- `premiumProcedure` - Requires active Polar.sh subscription

#### Workflow System
Workflows are stored in PostgreSQL with:
- **Workflow**: Top-level container with user ownership
- **Node**: Individual workflow steps (INITIAL, MANUAL_TRIGGER, HTTP_REQUEST, etc.)
- **Connection**: Edges between nodes with input/output handles

The workflow editor (`src/features/editor/`) uses React Flow to visualize and edit workflows. Nodes and connections are transformed between React Flow format (client) and Prisma models (server) in `src/features/workflows/server/routers.ts`.

#### Node System
New node types are registered via:
1. Add enum value to `NodeType` in `prisma/schema.prisma`
2. Create component in appropriate feature (e.g., `src/features/executions/components/`)
3. Register in `src/config/node-components.ts`

#### Authentication & Authorization
- Better Auth handles session management with Prisma adapter
- Polar.sh integration for subscription management
- Premium features gated by `premiumProcedure`
- Session validation via `protectedProcedure` middleware

#### Database Schema
Custom Prisma Client output location: `src/generated/prisma`
Import Prisma Client as: `import { PrismaClient } from '@/generated/prisma'`
Database singleton: `import prisma from '@/lib/db'`

#### Development Environment
`mprocs.yaml` orchestrates two processes:
- `next`: Next.js dev server with Turbopack
- `ingest`: Inngest dev server for background jobs

## Important Notes

- Path alias `@/*` maps to `src/*`
- Biome (not ESLint/Prettier) is used for linting and formatting
- Prisma Client is generated to `src/generated/prisma` (not default location)
- The app redirects `/` to `/workflows` (see `next.config.ts`)
- Sentry is configured for error monitoring in production
- Use `pnpm` as the package manager
