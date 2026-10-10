# Adventure Passport - Backend Foundation

Adventure Passport is a travel and adventure discovery platform built for adventurers to discover outdoor sports, explore mysterious and historic locations, submit proof of completion, earn verified points/badges, climb the leaderboard, redeem rewards, and curate personal memoirs.

This repository represents the initial **backend foundation** for the application, establishing strict data schemas, Row Level Security (RLS) policies, client/server Supabase integrations, environment validation, and planned API route conventions.

---

## 1. Architecture & Client Strategy

The application uses **Next.js App Router** with **TypeScript** and **Supabase (PostgreSQL + Auth + Storage)**.

### Supabase Client Usage Guide

To maintain security, prevent session leakage, and adhere to Next.js cookie handling constraints:

1. **Browser Client (`src/lib/supabase/client.ts`)**
   - **Usage**: Exclusively in React Client Components marked with `'use client'`.
   - **Mechanics**: Built using `@supabase/ssr` `createBrowserClient`. Uses public environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
   - **Security**: Never uses or receives administrative secrets.

2. **Server Client (`src/lib/supabase/server.ts`)**
   - **Usage**: In React Server Components, Server Actions, and Route Handlers (`src/app/api/.../route.ts`).
   - **Mechanics**: Built using `@supabase/ssr` `createServerClient` and Next.js `cookies()`. Evaluated per request so user sessions are never cached or shared across concurrent requests.
   - **Cookie safety**: In Server Components, cookie writes are safely intercepted without throwing errors, while middleware refreshes expired auth sessions before rendering.

3. **Session Refresh Middleware (`src/middleware.ts` / `src/lib/supabase/middleware.ts`)**
   - Intercepts incoming requests to keep the Supabase Auth session active and synchronized across cookie headers.

---

## 2. Prerequisites & Dependencies

- **Node.js**: v20+ (Node v25+ supported)
- **Package Manager**: `npm`
- **Supabase CLI**: installed as a local dev dependency (`npx supabase`) or Docker for local Postgres.

### Core Dependencies
- `next`: `16.4.0` (App Router)
- `react` & `react-dom`: `19.3.0`
- `@supabase/supabase-js`: `^2.117.3`
- `@supabase/ssr`: `^0.12.7`
- `zod`: `^4.6.5`
- `tailwindcss`: `^4`
- `supabase`: `^2.120.0` (dev dependency)

---

## 3. Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/more-fuzz/LAYOVER.git
   cd LAYOVER
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Provide your Supabase URL and anon/publishable key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
   ```
   > **Important**: Never add `SUPABASE_SERVICE_ROLE_KEY` to client-side code or prefix it with `NEXT_PUBLIC_`.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application or [http://localhost:3000/api/health](http://localhost:3000/api/health) for backend status.

---

## 4. Database Migrations & Seed Data

Database migrations are version-controlled under `supabase/migrations/`.

### Local Supabase Workflow

1. **Initialize and start local Supabase instance** (requires Docker):
   ```bash
   npx supabase start
   ```

2. **Apply migrations**:
   ```bash
   npx supabase db reset
   # Or manually apply:
   npx supabase migration up
   ```

3. **Load Demonstration Seed Data**:
   ```bash
   # Automatically loaded on 'supabase db reset', or manually execute:
   npx supabase db execute --file supabase/seed.sql
   ```

4. **Run RLS & Security Tests**:
   ```bash
   npx supabase db execute --file supabase/tests/rls_test.sql
   ```

### Remote Supabase Project Workflow

1. Link your remote Supabase project:
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   ```

2. Push migrations to remote database:
   ```bash
   npx supabase db push
   ```

---

## 5. Security & Row Level Security (RLS) Architecture

Row Level Security is enabled on **all 8 application tables**:

| Table | SELECT | INSERT | UPDATE | DELETE |
| :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | Anyone (public profile data) | Handled by `auth.users` trigger | Self (role changes blocked by trigger) | Admin only |
| **`activities`** | Published (or Admin) | Admin only | Admin only | Admin only |
| **`destinations`** | Published (or Admin) | Admin only | Admin only | Admin only |
| **`submissions`** | Owner or Admin | Authenticated owner (pending status only) | Admin only (review status) | Owner (pending only) |
| **`point_ledger`** | Owner or Admin | Disallowed from client (server-only) | Disallowed | Disallowed |
| **`rewards`** | Active (or Admin) | Admin only | Admin only | Admin only |
| **`redemptions`** | Owner or Admin | Disallowed direct client insert | Admin only | Disallowed |
| **`consent_records`**| Owner or Admin | Authenticated owner | Disallowed (immutable) | Disallowed (immutable) |

### Anti-Tampering Database Triggers
- `trg_protect_profile_role`: Blocks non-admins from changing their role or escalating privileges to `admin`.
- `trg_protect_submission_review`: Prevents travelers from approving their own submissions, assigning reviewers, or altering review timestamps.
- `idx_point_ledger_unique_submission_award`: Partial unique index preventing duplicate reward/point allocations for a single submission.
- `on_auth_user_created`: Server-side trigger automatically creating a traveler profile on registration, ignoring client-submitted role metadata.

---

## 6. Current Limitations & Next Planned Phases

### Current Limitations
- Frontend UI components, interactive maps (Mapbox), and image upload components are intentionally not included in this foundation phase.
- Submission review actions and reward point deductions require atomic database functions (`RPC`) scheduled for the next phase.

### Planned Next Phases
1. **API Endpoints**:
   - `GET /api/activities`: Discovery and category filtering.
   - `GET /api/destinations`: Historic, mystery, and natural destination catalog.
   - `POST /api/submissions`: Upload private evidence to Supabase Storage and register submission.
   - `POST /api/admin/submissions/[id]/review`: Admin verification with transactional point ledger insertion.
   - `GET /api/leaderboard`: Aggregated points computation.
   - `GET /api/memoir`: Verified user accomplishments.
   - `POST /api/rewards/[id]/redeem`: Atomic balance check, point deduction, and stock decrement.
2. **Supabase Storage Integration**:
   - Private bucket configuration for evidence media with signed URLs for authorized reviewer access.
