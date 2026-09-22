# ⛳ Digital Heroes — Non-Profit Backed Golf Subscription Platform

> A full-stack Next.js web application built for the Digital Heroes technical assessment. The platform allows subscribers to submit rolling golf scores, support verified non-profit causes, and participate in automated monthly prize draw allocations.

---

## 🌟 Architecture & Tech Stack

The platform is designed as an all-in-one full-stack architecture leveraging Next.js App Router for serverless API capabilities and Supabase for relational data persistence, user sessions, and database constraints.

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 14+ (App Router)** | Client/Server rendering, dynamic routing, and layout architecture |
| **Language** | **TypeScript** | Strict type safety across UI components, state, and API payload contracts |
| **Styling** | **Tailwind CSS** | Dark-mode modern UI with clean typography and slate accents |
| **Database & Auth** | **Supabase (PostgreSQL)** | Persistent storage, Auth, Foreign Key relationships, and Row Level Security (RLS) |
| **Backend Logic** | **Next.js Route Handlers** | Serverless RESTful API endpoints for draw simulation and winner verification |

---

## 🚀 Key Platform Features

### 1. Dynamic Charity Directory & Selection Sync

- **Cause Selection:** Subscribers can browse featured non-profit organizations such as Clean Water Fund, Education For All, and Ocean Rescue and set their primary supported cause.
- **Database Persisted FK:** Selecting a charity dynamically updates the user's profile through `profiles.charity_id` in PostgreSQL.
- **Transparent Contribution:** Every subscription guarantees a minimum **10% direct allocation** to the chosen charity.

### 2. Rolling 5-Score Golf Engine

- **Stableford Validation:** Enforces strict score bounds between **1 and 45**.
- **Date Uniqueness:** Restricts users to a maximum of **1 score entry per calendar date**.
- **Automatic Trimming:** Maintains a rolling cap of the user's **5 most recent scores**, automatically removing older entries.

### 3. Automated Prize Draw Simulation Engine

- **Dynamic Pool Allocation:** Calculates real-time prize pool splits based on active subscriber counts, with **50% of the applicable pool allocated to prizes**.
- **PRD Match Tier Breakdown:**
  - 🥇 **5-Match Jackpot:** 40% pool share — rolls over if unclaimed
  - 🥈 **4-Match Tier:** 35% pool share
  - 🥉 **3-Match Tier:** 25% pool share
- **Algorithmic or Random Mode:** Administrators can trigger draws using either standard pseudo-random selection or weighted frequency algorithms based on active user score distributions.

### 4. Winner Proof Submission & Admin Control Center

- **Proof Upload Workflow:** Winners can upload official scorecard proof images through the Subscriber Dashboard using `POST /api/winners/proof`.
- **Admin Verification Queue:** Administrators can review submitted scorecards and approve payouts using `PATCH /api/winners/proof`, updating payout status from `pending` to `paid`.
- **Role-Based Access:** Payout approval controls are available only to users with the `admin` role.

---

## 🗄️ Database Schema & Security

The application uses **Supabase PostgreSQL** for relational data persistence, authentication, foreign-key relationships, and Row Level Security (RLS).

Key database entities include:

- User profiles
- Non-profit charities
- Golf scores
- Prize draws
- Winner records
- Subscription-related data

Role-based access control is used to distinguish between **subscribers** and **administrators**.

---