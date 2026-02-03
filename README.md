# HVAC Maintenance App

Web application for HVAC service management with client/task tracking and superadmin management.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Database**: PostgreSQL + Prisma 7 ORM
- **Auth**: Session-based (httpOnly cookies + bcrypt)
- **Validation**: Zod + React Hook Form
- **File uploads**: Local storage in `./uploads`

## Setup

### 1. Clone and install

```bash
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run database migrations

```bash
pnpm db:migrate
```

### 5. Seed the database

```bash
pnpm db:seed
```

This creates a default superadmin with credentials from `.env` (default: `admin@example.com` / `changeme123`).

### 6. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed the database |

## Project Structure

```
src/
  app/
    page.tsx              # Dashboard (client list + details)
    login/page.tsx        # Login page
    superadmins/page.tsx  # Admin management
    api/                  # API routes
  components/
    ui/                   # shadcn/ui components
    ClientList.tsx        # Client list sidebar
    ClientDetails.tsx     # Client details panel
    TaskDetail.tsx        # Task detail modal
    AddClientModal.tsx    # New client form
    AddTaskModal.tsx      # New task form
    ...
  lib/
    db.ts                 # Prisma client singleton
    auth.ts               # Session management
    password.ts           # bcrypt utilities
    utils.ts              # Shared utilities
    validations/          # Zod schemas
prisma/
  schema.prisma           # Database schema
  prisma.config.ts        # Prisma 7 config
  seed.ts                 # Database seeder
```
