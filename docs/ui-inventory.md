# Trails & Tales — UI & API Inventory (Phase 0)

## 1. Framework & Tooling
- **Framework:** Next.js `16.4.0` (Turbopack, App Router)
- **React:** `19.3.0`
- **TypeScript:** `5.x`, strict mode enabled (`tsconfig.json`)
- **Styling System:** Tailwind CSS `v4` (`@tailwindcss/turbopack`, `tailwindcss: ^4`) with CSS custom properties in `src/app/globals.css`.
- **Scripts:** `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `lint` (`eslint`), `typecheck` (`tsc --noEmit`).

---

## 2. Page Routes (`src/app/**`)
All 33 routes verified and existing:
1. `/` (`src/app/page.tsx`) - Homepage
2. `/activities/[id]` (`src/app/activities/[id]/page.tsx`) - Activity detail view
3. `/admin` (`src/app/admin/page.tsx`) - Hidden arbitrator review dashboard
4. `/arena` (`src/app/arena/page.tsx`) - The Expedition Board / Leaderboard
5. `/auth/login` (`src/app/auth/login/page.tsx`) - Traveler authentication
6. `/auth/register` (`src/app/auth/register/page.tsx`) - Traveler signup
7. `/brave-enough` (`src/app/brave-enough/page.tsx`) - Mystery & folklore field archives (Secret Level)
8. `/dashboard` (`src/app/dashboard/page.tsx`) - Traveler operational overview
9. `/explorer` (`src/app/explorer/page.tsx`) - Discovery split-view list & interactive map
10. `/leaderboard` (`src/app/leaderboard/page.tsx`) - Global standings
11. `/map` (`src/app/map/page.tsx`) - Cartography view
12. `/memoir` (`src/app/memoir/page.tsx`) - My Journal / Adventure Memoir
13. `/profile` (`src/app/profile/page.tsx`) - Profile & account identity
14. `/rewards` (`src/app/rewards/page.tsx`) - Outfitter rewards catalogue & claim history
15. `/rewards/redemptions/[id]` (`src/app/rewards/redemptions/[id]/page.tsx`) - Dedicated voucher ticket view
16. `/submissions/new` (`src/app/submissions/new/page.tsx`) - Summit proof evidence submission

Layouts:
- Root Layout (`src/app/layout.tsx`): Mounts `SplashLoader`, `AuthProvider`, `Navbar`, and `Footer`.

---

## 3. Existing Components & Authentication
- **Components:** `Navbar.tsx`, `Footer.tsx`, `MapComponent.tsx` (Leaflet canvas), `SafeImage.tsx`, `SplashLoader.tsx`, `HomeClientView.tsx`.
- **Auth Flow:** Managed via `src/context/AuthContext.tsx` (`useAuth()`), exposing `user`, `profile`, `role`, `isLoading`, `isDemoUser`, `switchDemoRole()`, `signInWithEmail()`, `signUpWithEmail()`, `signOut()`.
- **Edge Middleware:** `src/middleware.ts` delegates to `src/lib/supabase/middleware.ts`, guarding `/admin` and `/api/admin/*`.

---

## 4. API Endpoints & Actual Response Shapes

### 4.1 `GET /api/activities`
- **Status:** `200 OK`
- **Response Shape:**
  ```json
  {
    "status": "ok",
    "total": 8,
    "data": [
      {
        "id": "a1111111-1111-1111-1111-111111111111",
        "slug": "roopkund-glacial-traverse",
        "name": "Roopkund High-Altitude Glacial Trek",
        "category": "hiking",
        "description": "...",
        "difficulty": 5,
        "latitude": 30.2642,
        "longitude": 79.7317,
        "base_points": 500,
        "estimated_cost": 280.0,
        "requirements": ["Microspikes or crampons"],
        "safety_info": "...",
        "is_published": true,
        "image_url": "https://...",
        "location_name": "Chamoli, Uttarakhand, India",
        "duration_hours": 48
      }
    ]
  }
  ```
- **Error (500):** `{ "status": "error", "message": "Failed to fetch activities" }`

### 4.2 `GET /api/destinations`
- **Status:** `200 OK`
- **Response Shape:**
  ```json
  {
    "status": "ok",
    "total": 6,
    "data": [
      {
        "id": "d1111111-1111-1111-1111-111111111111",
        "name": "Bhangarh Fort Ruins",
        "category": "historical",
        "description": "...",
        "historical_context": "...",
        "source_url": "https://asi.nic.in",
        "latitude": 27.0964,
        "longitude": 76.2863,
        "access_notes": "...",
        "is_published": true,
        "is_spooky": true,
        "spooky_rating": 4,
        "folklore_legend": "...",
        "safety_advisory": "...",
        "location_name": "Alwar District, Rajasthan, India",
        "image_url": "https://..."
      }
    ]
  }
  ```
- **Error (500):** `{ "status": "error", "message": "Failed to fetch destinations" }`

### 4.3 `POST /api/submissions`
- **Body Requirement (`submissionCreateSchema`):**
  ```json
  {
    "activity_id": "UUID",
    "evidence_path": "string",
    "claimed_latitude": 30.26,
    "claimed_longitude": 79.73
  }
  ```
- **Success (200):**
  ```json
  {
    "status": "ok",
    "message": "Evidence submission registered and awaiting reviewer verification",
    "submission_id": "sub-xxx",
    "submission_status": "pending",
    "is_demo": false
  }
  ```
- **Validation Error (400):** `{ "status": "error", "errors": { ... } }`
- **Error (500):** `{ "status": "error", "message": "Failed to process submission" }`

### 4.4 `GET /api/admin/submissions`
- **Auth:** Requires Administrator session or `tt_demo_role=admin` cookie.
- **Success (200):** `{ "status": "ok", "data": SubmissionItem[] }`
- **Error (401 / 403 / 500):** `{ "status": "error", "message": "Access denied." }`

### 4.5 `POST /api/admin/submissions/[id]/review`
- **Auth:** Requires Administrator session.
- **Body Requirement (`submissionReviewSchema`):**
  ```json
  {
    "status": "approved",
    "review_notes": "Verified summit evidence."
  }
  ```
- **Success (200):**
  ```json
  {
    "status": "ok",
    "message": "Submission marked as approved. Points awarded if approved."
  }
  ```
- **Error (400 / 401 / 403 / 500):** `{ "status": "error", "message": "..." }`

### 4.6 `GET /api/leaderboard`
- **Status:** `200 OK`
- **Response Shape:**
  ```json
  {
    "status": "ok",
    "total": 6,
    "data": [
      {
        "id": "u1",
        "username": "tensing_n",
        "display_name": "Tenzing Norgay",
        "avatar_url": "https://...",
        "total_points": 5850,
        "completed_count": 14,
        "rank": 1,
        "badge_title": "Field Legend"
      }
    ]
  }
  ```

### 4.7 `GET /api/memoir`
- **Status:** `200 OK`
- **Response Shape:**
  ```json
  {
    "status": "ok",
    "data": {
      "total_expeditions": 3,
      "total_points": 1100,
      "badges": ["Trail Pathfinder", "Alpine Pioneer"],
      "entries": [
        {
          "id": "sub-001",
          "activity_id": "a2222222-2222-2222-2222-222222222222",
          "activity_name": "Ganges Gorge Class IV Whitewater Run",
          "category": "kayaking",
          "completed_at": "2026-10-09T10:30:00Z",
          "points_earned": 350,
          "latitude": 30.0869,
          "longitude": 78.2676,
          "evidence_url": "https://...",
          "notes": "Clear video proof of rapid navigation.",
          "location_name": "Rishikesh, Uttarakhand, India",
          "badge_awarded": "Wilderness Trailblazer"
        }
      ]
    }
  }
  ```

### 4.8 `GET /api/rewards`
- **Status:** `200 OK`
- **Response Shape (Catalogue):**
  ```json
  {
    "status": "ok",
    "total": 6,
    "data": [
      {
        "id": "r1111111-1111-1111-1111-111111111111",
        "name": "Official Expedition Brass Enamel Pin & Iron-On Patch",
        "description": "...",
        "cost_points": 300,
        "stock": 480,
        "is_active": true,
        "category": "badge",
        "merchant_name": "Trails & Tales Outfitter Depot",
        "merchant_url": "https://example.com/outfitter",
        "usage_instructions": ["Copy your unique voucher code below..."],
        "image_url": "https://..."
      }
    ]
  }
  ```
- When `?mine=true`: returns `{ "status": "ok", "data": RedemptionItem[] }`.

### 4.9 `POST /api/rewards/[id]/redeem`
- **Auth:** Requires Authenticated User.
- **Success (200):**
  ```json
  {
    "status": "ok",
    "message": "Reward redeemed successfully! Your claim voucher code is ready.",
    "claim_code": "TT-APEX-938174",
    "redemption_id": "red-1728612345"
  }
  ```
- **Error (400):** `{ "status": "error", "message": "Insufficient points balance" }`

### 4.10 `GET /api/rewards/redemptions/[id]`
- **Auth:** Requires Authenticated Owner or Admin.
- **Success (200):**
  ```json
  {
    "status": "ok",
    "data": {
      "id": "red-001",
      "user_id": "u6",
      "reward_id": "r1111111-1111-1111-1111-111111111111",
      "reward_name": "Official Expedition Brass Enamel Pin & Iron-On Patch",
      "reward_description": "...",
      "reward_image": "https://...",
      "points_spent": 300,
      "status": "pending",
      "claim_code": "TT-OUT-9921",
      "created_at": "2026-10-10T14:20:00Z",
      "merchant_name": "Trails & Tales Outfitter Depot",
      "merchant_url": "https://example.com/outfitter",
      "usage_instructions": ["..."]
    }
  }
  ```
- **Error (403):** `{ "status": "error", "message": "Unauthorized to view this coupon redemption" }`
- **Error (404):** `{ "status": "error", "message": "Redemption record not found" }`

### 4.11 `GET /api/health`
- **Status:** `200 OK`
- **Response Shape:**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-11T...",
    "service": "Adventure Passport API Foundation",
    "environment": {
      "supabase_configured": true
    }
  }
  ```

---

## 5. Routing & Cartography Integration
- OSRM service is located in `src/services/osrm.ts` (`calculateRouteOSRM`).
- It takes `startCoords: [number, number]` (lat, lng) and `destCoords: [number, number]` (lat, lng).
- Converts to OSRM order `{lng},{lat}`.
- Returns `{ success, coordinates: [lat, lng][], distanceKm, durationMinutes, durationFormatted, error }`.
- Called in `src/components/MapComponent.tsx`.

---

## 6. Image Provenance & Association
- Activities hold image URLs in `image_url`.
- Destinations hold image URLs in `image_url`.
- Rewards hold image URLs in `image_url`.
- Submissions hold image URLs in `evidence_url` (or storage path in `evidence_path`).
- Redemptions hold image URLs in `reward_image`.
- User profiles hold image URLs in `avatar_url`.
