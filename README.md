# ⛳ Digital Heroes — Golf Subscription Platform

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0%2B-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment%20Gateway-635bff?style=flat-square&logo=stripe)](https://stripe.com/)

> A full-stack subscription platform combining golf performance tracking, charitable giving, and dynamic draw-based monthly reward engines. Built to deliver an emotion-first, modern user experience that moves away from traditional golf clichés.

---

## 📋 Table of Contents

- [Overview & PRD Core Objectives](#-overview--prd-core-objectives)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features & System Design](#-key-features--system-design)
- [Database Schema & Access Control](#-database-schema--access-control)
- [API Endpoints](#-api-endpoints)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Deployment & Constraints](#-deployment--constraints)
- [Evaluation & Verification Checklist](#-evaluation--verification-checklist)

---

## 🎯 Overview & PRD Core Objectives

Digital Heroes is an all-in-one web application built against the **Digital Heroes Product Requirements Document (PRD 2026 Edition)**. The application is designed to meet six core objectives:

1. **Subscription Engine:** Flexible subscription management (Monthly & Yearly discounted plans) via PCI-compliant payment gateways with real-time access control.
2. **Score Entry Experience:** Simple, engaging Stableford score management enforcing a strict rolling 5-score limit.
3. **Custom Draw Engine:** Automated, simulation-ready monthly prize draw logic supporting both pseudo-random and algorithm-weighted score frequency distributions.
4. **Charity Integration:** Seamless charity directory, discovery spotlight, and custom donation allocations (minimum 10%).
5. **Admin Control Center:** Comprehensive management tools for subscribers, scores, draw simulations, charity listings, and winner scorecard verification.
6. **Modern UI/UX:** An emotion-driven interface prioritizing charitable impact over traditional golf aesthetics (avoiding fairway/plaid clichés).

---

## 🌟 Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 14+ (App Router)** | Server/Client components, dynamic routing, layout architecture, and server actions |
| **Language** | **TypeScript** | Strict end-to-end type safety for components, state, database schemas, and API contracts |
| **Styling & UI** | **Tailwind CSS + Lucide Icons** | Modern, dark-mode-first aesthetic with motion transitions and responsive layout |
| **Database & Auth** | **Supabase (PostgreSQL)** | Relational database, secure auth sessions, foreign key constraints, and Row Level Security (RLS) |
| **Payments** | **Stripe API** | Subscription lifecycle management (checkout, webhooks, renewal, cancellation) |
| **Backend Logic** | **Next.js Route Handlers** | Serverless RESTful endpoints for score validation, draw simulation, and winner verification |

---

## 🚀 Key Features & System Design

### 1. Dynamic Charity Directory & Impact System
- **Discovery Directory:** Searchable/filterable non-profit listing page featuring active causes (e.g., *Clean Water Fund*, *Education For All*, *Ocean Rescue*) with detailed descriptions and event callouts.
- **Dynamic Allocation:** Directs a **minimum 10% base contribution** from each subscription fee to the selected charity, with subscriber options to voluntarily increase their donation percentage.
- **Database Synchronization:** Dynamically links subscriber profiles to `profiles.charity_id` using relational foreign keys.

### 2. Rolling 5-Score Golf Engine
- **Stableford Bounds:** Enforces strict entry validation bounds between **1 and 45**.
- **Date Uniqueness:** Enforces a strict constraint of **maximum 1 score entry per calendar date**. Duplicate dates must be edited or deleted.
- **Rolling Write-Time Trimming:** Keeps only the user's **5 most recent scores** on write, automatically replacing the oldest record while maintaining reverse chronological display (most recent first).

### 3. Automated Prize Draw Simulation Engine
- **Tier Pool Allocation:** Automatically calculates applicable prize pool splits based on active subscriber counts (50% of the active pool allocated to prizes):
  - 🥇 **5-Number Match Jackpot:** 40% pool share *(Rolls over to next month if unclaimed)*
  - 🥈 **4-Number Match Tier:** 35% pool share *(Split equally among winners)*
  - 🥉 **3-Number Match Tier:** 25% pool share *(Split equally among winners)*
- **Draw Execution Modes:**
  - **Random Mode:** Standard pseudo-random draw generation.
  - **Algorithmic Mode:** Weighted probability selection based on active subscriber score frequency.
- **Admin Simulation Workspace:** Allows admins to simulate draws and preview prize pool distributions prior to official publishing.

### 4. Winner Proof Submission & Verification Center
- **Proof Upload Workflow:** Eligible draw winners can upload digital scorecard proof directly from their Subscriber Dashboard.
- **Admin Review Queue:** Dedicated admin review pipeline to inspect scorecard proof images and approve payouts, advancing state from `pending` to `paid`.
- **Role-Based Guards:** All verification, user editing, and draw execution routes are strictly guarded by role middleware (`role === 'admin'`).

---

## 🗄️ Database Schema & Access Control

The platform utilizes **Supabase PostgreSQL** with enforced foreign key relationships and Row Level Security (RLS) policies across three distinct user roles:

- **Public Visitor:** Unauthenticated access to platform concept pages, charity discovery, and subscription signup flows.
- **Registered Subscriber:** Authenticated access to profile settings, rolling score entries, charity selection, draw participation history, and winner proof uploads.
- **Administrator:** Elevated access to user/subscription management, draw configuration/simulation/publishing, charity CMS, and payout verification.

## 🛠️ API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/charities` | Fetch active charity directory & featured spotlight | Public / Subscriber |
| `POST` | `/api/scores` | Submit new golf score (enforces rolling 5 cap & date constraints) | Subscriber |
| `GET` | `/api/scores` | Retrieve subscriber's 5 most recent scores | Subscriber |
| `POST` | `/api/draws/simulate` | Run prize draw simulation with random/algorithmic modes | Admin |
| `POST` | `/api/draws/publish` | Lock and publish draw results & jackpot roll over state | Admin |
| `POST` | `/api/winners/proof` | Upload scorecard proof image for pending winnings | Winner (Subscriber) |
| `PATCH` | `/api/winners/proof` | Review, approve, or reject winner proof (update `pending` ➔ `paid`) | Admin |