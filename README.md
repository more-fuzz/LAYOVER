# Trails & Tales — Field Guide, After Dark

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth%20%2B%20Storage-emerald?style=flat&logo=supabase)](https://supabase.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive%20Maps-green?style=flat&logo=leaflet)](https://leafletjs.com/)

**Trails & Tales** is an adventure discovery platform designed as an interactive field guide for modern explorers. It lets travelers discover wilderness expeditions, explore regional folklore and uncharted waypoints, calculate hiking and trail routes, submit authenticated proof of completion, earn verified points, climb the global expedition leaderboard, preserve personal memoirs, and redeem points for partner gear vouchers and coupon codes.

---

## Table of Contents

1. [Key Features](#1-key-features)
2. [Design System ("Field Guide, After Dark")](#2-design-system-field-guide-after-dark)
3. [Architecture & Tech Stack](#3-architecture--tech-stack)
4. [Project Structure](#4-project-structure)
5. [API Reference](#5-api-reference)
6. [Security & Row Level Security (RLS)](#6-security--row-level-security-rls)
7. [Installation & Getting Started](#7-installation--getting-started)
8. [Database Setup & Migrations](#8-database-setup--migrations)
9. [Build & Verification](#9-build--verification)

---

## 1. Key Features

### 🗺️ Field Cartography & OSRM Trail Routing
- **Interactive Map**: Powered by OpenStreetMap and Leaflet with custom pin markers, categories, and selection rings.
- **Viewport Stability**: The camera position and zoom remain preserved across search typing, category filtering, and activity selection.
- **Explicit Viewport Navigation**: Features dedicated **"Fit results"** to view all charted waypoints on demand and **"Locate"** to pan smoothly to a selected waypoint.
- **Automated Sizing with ResizeObserver**: Dynamically adapts without jitter or layout shifts when sidebars, drawers, or mobile list/map tabs are toggled.
- **OSRM Trail Routing**: Calculates real trail distance (km) and walking time with interactive polylines from regional trail hubs.

### 🧭 Adventure Discovery & Waypoint Exploration (`/explorer`)
- Dual-column interactive layout: scrollable waypoints list alongside persistent cartography.
- Real-time search by trail name, region, access notes, or lore.
- Filter by dynamic categories (Trekking, Mountaineering, Camping, Spooky/Folklore) and difficulty ratings (Easy, Moderate, Hard, Severe).
- Responsive mobile toggle between List View and Cartography Map.

### 🕯️ Folklore & Mystery Dossiers (`/brave-enough`)
- Dedicated **"After Dark"** night exploration mode highlighting haunted trails, cryptid folklore, and historic mysteries.
- Folklore dossiers with regional legends, safety advisories, spooky ratings, and access notes.
- High-contrast phosphorescent Citron accents on dark Ink slate cartography.

### 📸 Proof Submission & Field Evidence (`/submissions/new`)
- Multi-step guided submission flow: Activity selection &rarr; Image proof upload &rarr; GPS coordinate verification &rarr; Field notes & consent declaration.
- Real-time GPS coordinate extraction from images (EXIF) or manual entry with Haversine radius validation.
- Multi-tier verification status tracking: `pending` &rarr; `approved` (points awarded) or `rejected`.

### 🎟️ Outfitter Rewards Depot & Coupon Codes (`/rewards`)
- **Reward Catalogue**: Active equipment vouchers, partner gear discounts, and brass enamel pins available for points redemption.
- **Atomic Point Debiting**: Server-side validation verifying points balance and stock availability before generation.
- **Immediate In-Place Voucher Receipt**: A high-visibility modal reveals the authentic claim voucher code immediately upon redemption.
- **Claimed Vouchers Tab (`GET /api/rewards?mine=true`)**: Complete list of redeemed vouchers displaying dates, points spent, partner status, and full coupon codes.
- **Accessible One-Click Copy**: Instant clipboard copying with visual `"Copied!"` badge feedback and hidden textarea fallback.
- **Dedicated Voucher Ticket (`/rewards/redemptions/[id]`)**: Official claim ticket view with partner usage instructions, expiry dates, and outbound merchant links.

### 🏆 Expedition Leaderboard & Arena Standings (`/arena` / `/leaderboard`)
- Top explorer ranks displaying total verified points, completed expeditions count, and customized badge titles.
- Distinction between **Total Lifetime Earned** points (leaderboard rank) and **Current Redeemable Balance** (rewards spending).

### 📖 Personal Adventure Memoir (`/memoir`)
- Complete historical traveler passport documenting verified expeditions.
- Filter entries by year or search keyword, with instant toggle between Chronological Journal and Geographic Map view.

### 🛡️ Admin Verification Queue (`/admin`)
- Moderation workspace allowing administrators to review submitted evidence images, coordinates, and notes.
- One-click **Approve** (automatically credits points via transactional ledger) or **Reject** (with optional feedback reason).

### ⚙️ Traveler Profile & Privacy Settings (`/profile`)
- Manage display name, avatar, bio, and role badge.
- Granular privacy toggles for Public Profile visibility, Memoir inclusion on public maps, and Leaderboard anonymity.
- Complete consent management history with immutable audit log records.

---

## 2. Design System ("Field Guide, After Dark")

The visual language blends archival field-manual aesthetics with modern dark-mode maximalism:

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| **`--paper`** | `#F6EFE2` | Light archival base background |
| **`--ink`** | `#0F1F1A` | Deep forest-ink background & typography |
| **`--sand`** | `#EADFC8` | Secondary neutral fill & card backing |
| **`--line`** | `#D8CBB0` | Tactile border & division rules |
| **`--citron`** | `#D8F23C` | High-visibility phosphorescent accent (points, after-dark) |
| **`--flame`** | `#FF5A1F` | Adventure primary action & interactive pins |
| **`--folklore`** | `#B8390A` | Folklore dossiers, spooky pins, and warnings |
| **`--jade-deep`** | `#0B7A50` | Verified status badges & success confirmation |

- **Typography**: Display headings in Helvetica/Public Sans display weight; labels in uppercase tabular monospace (`font-mono-label`).
- **Interactive Feedback**: Rotated stamps (`VERIFIED`, `COPIED`), perforation border notches on claim tickets, and card hover translations.

---

## 3. Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 App Router                │
│  (React 19, TypeScript, Turbopack, Tailwind CSS tokens)│
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            ▼                                ▼
┌───────────────────────┐        ┌───────────────────────┐
│     Map & Routing     │        │    Data & Security    │
│  Leaflet + OpenStreet │        │  Supabase (Postgres)  │
│  OSRM Routing Machine │        │  Row Level Security   │
└───────────────────────┘        │  Supabase Auth & SSR  │
                                 └───────────────────────┘
```

- **Framework**: Next.js 16.4.0 (App Router, Turbopack)
- **UI & State**: React 19.3.0, Vanilla CSS Custom Properties + Tailwind CSS utilities
- **Maps & GIS**: Leaflet 1.9.4, OpenStreetMap tiles, OSRM Routing Engine
- **Database & Auth**: Supabase PostgreSQL 15, Supabase Auth via `@supabase/ssr`, Supabase Storage
- **Validation**: Zod schema validation for submissions and payload sanitization
- **Type Safety**: End-to-end TypeScript interfaces with clean UI adapters (`src/lib/ui/adapters.ts`)

---

## 4. Project Structure

```
├── docs/
│   └── ui-inventory.md                # Comprehensive component & route UI inventory
├── public/                            # Static assets, branding, and images
├── src/
│   ├── app/                           # Next.js App Router routes (33 routes)
│   │   ├── activities/[id]/           # Individual activity detail view
│   │   ├── admin/                     # Admin submission review dashboard
│   │   ├── api/                       # REST API route handlers
│   │   │   ├── activities/            # GET adventure activities
│   │   │   ├── admin/submissions/     # GET & POST reviewer approval endpoints
│   │   │   ├── destinations/          # GET historic/spooky destinations
│   │   │   ├── health/                # GET system & endpoint health check
│   │   │   ├── leaderboard/           # GET aggregated points leaderboard
│   │   │   ├── memoir/                # GET personal approved memoir entries
│   │   │   ├── rewards/               # GET catalogue & GET ?mine=true vouchers
│   │   │   │   ├── [id]/redeem/       # POST atomic reward redemption
│   │   │   │   └── redemptions/[id]/  # GET individual coupon voucher ticket
│   │   │   └── submissions/           # GET & POST explorer evidence submissions
│   │   ├── arena/                     # Global adventure rankings & stats
│   │   ├── auth/                      # Login & Register views
│   │   ├── brave-enough/              # Folklore & After Dark dossiers
│   │   ├── dashboard/                 # Traveler personal dashboard
│   │   ├── explorer/                  # Split Cartography & Waypoint discovery
│   │   ├── memoir/                    # Traveler expedition journal & map
│   │   ├── profile/                   # User profile, privacy & consent
│   │   ├── rewards/                   # Rewards Depot & Claimed Vouchers
│   │   │   └── redemptions/[id]/      # Authenticated coupon claim ticket
│   │   └── submissions/new/           # Multi-step proof submission wizard
│   ├── components/
│   │   ├── activities/                # Activity detail layouts
│   │   ├── arena/                     # Leaderboard arena views
│   │   ├── brand/                     # LogoMark, IntroLoader
│   │   ├── ui/                        # Reusable accessible component library
│   │   │   ├── Button, Chip, ConfirmDialog, DifficultyDots
│   │   │   ├── EmptyState, Icon, ImageTile, ProgressSteps
│   │   │   ├── SearchField, Skeleton, StampBadge, StatTile
│   │   │   └── StatusTag, Toast
│   │   ├── MapComponent.tsx           # Resilient Leaflet map component with OSRM
│   │   ├── Navbar.tsx                 # Navigation with live points chip
│   │   └── Footer.tsx                 # Field guide footer
│   ├── context/
│   │   └── AuthContext.tsx            # Supabase session & demo user switching
│   ├── data/
│   │   └── sampleData.ts              # Verified sample fallback data
│   ├── lib/
│   │   ├── supabase/                  # Server, client & middleware Supabase clients
│   │   ├── ui/
│   │   │   ├── adapters.ts            # UI data transformers & type contracts
│   │   │   └── api.ts                 # Unified fetch client with payload preservation
│   │   └── auth-server.ts             # Server-side auth helpers
│   ├── services/                      # Business logic layer (activities, rewards, osrm)
│   └── validation/schemas.ts          # Zod schemas for submissions and review
└── supabase/
    ├── migrations/                    # Versioned database migrations
    ├── seed.sql                       # Demonstration seed data
    └── tests/                         # SQL RLS policy tests
```

---

## 5. API Reference

All endpoints return JSON and provide standardized `{ status: 'ok' | 'error', ... }` responses.

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/health` | `GET` | Public | System and planned endpoints status check |
| `/api/activities` | `GET` | Public | List adventure activities (supports `?category=...`) |
| `/api/destinations` | `GET` | Public | List mystery & folklore destinations |
| `/api/submissions` | `GET` | User | List user's submissions (`?all=true` for admin) |
| `/api/submissions` | `POST` | User | Create new adventure proof submission |
| `/api/admin/submissions` | `GET` | Admin | Reviewer queue (supports `?status=pending`) |
| `/api/admin/submissions/[id]/review` | `POST` | Admin | Review action (`approve` or `reject` with notes) |
| `/api/leaderboard` | `GET` | Public | Global user rankings aggregated by verified points |
| `/api/memoir` | `GET` | User | Personal memoir of approved adventures |
| `/api/rewards` | `GET` | Public | Catalog of active outfitter rewards |
| `/api/rewards?mine=true` | `GET` | User | List of user's claimed voucher redemptions |
| `/api/rewards/[id]/redeem` | `POST` | User | Atomically redeem a reward and generate `claim_code` |
| `/api/rewards/redemptions/[id]` | `GET` | User | Retrieve specific authenticated voucher ticket |

---

## 6. Security & Row Level Security (RLS)

The Supabase database has Row Level Security (RLS) enabled across all tables:

1. **`profiles`**: Public profile data readable by all. Updates restricted to the authenticated user. Role escalation to `admin` is blocked by database trigger `trg_protect_profile_role`.
2. **`submissions`**: Explorers can only view and insert their own pending submissions. Status mutations are restricted to administrators.
3. **`point_ledger`**: Direct client inserts are disallowed. Points can only be allocated through server-side verified actions.
4. **`rewards` & `redemptions`**: Redemptions require server verification. Users can only view their own redemptions.
5. **`consent_records`**: Immutable audit logs capturing privacy policy acceptance. Updates and deletes are blocked.

---

## 7. Installation & Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **Supabase Account**: (Optional for local testing; demo fallback mode is built-in)

### Step 1: Clone Repository
```bash
git clone https://github.com/more-fuzz/LAYOVER.git
cd LAYOVER
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Database Setup & Migrations

If configuring a fresh Supabase database:

1. **Link your project**:
   ```bash
   npx supabase login
   npx supabase link --project-ref your-project-id
   ```

2. **Push migrations**:
   ```bash
   npx supabase db push
   ```

3. **Load seed data**:
   ```bash
   npx supabase db execute --file supabase/seed.sql
   ```

---

## 9. Build & Verification

To verify type safety and build output:

```bash
# 1. TypeScript compilation check
npx tsc --noEmit

# 2. Production build (compiles all 33 routes)
npm run build
```

---

## 📜 License

Created for the **Trails & Tales** Adventure Platform. Distributed under the MIT License.
