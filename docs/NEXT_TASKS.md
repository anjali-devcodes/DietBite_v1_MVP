# DietBite — Next Tasks

> Quick-reference task tracker. For full architectural context, see `PROJECT_CONTEXT.md`.

**Status as of:** Milestone 7 complete (Food Search UI). Milestone 8 (Nutrient Calculator) not started.

---

## Current Status

Auth, user/admin management, and the Indian food database with search are fully built and working end-to-end (frontend + backend). 42 real foods seeded across 12 categories with 13 nutrients each. The platform supports three roles (admin, dietitian, user) with role-based routing and access control. Nothing is deployed yet — everything runs locally only.

---

## Completed Features

- Monorepo setup (React+Vite+Tailwind frontend, FastAPI+PostgreSQL backend)
- JWT auth: signup, login, refresh, `/me` — with auto-refresh on token expiry (frontend interceptor)
- Role-based access control: `admin`, `dietitian`, `user` (route guards + backend `require_role`)
- User profile self-service: update name/email, change password
- Admin panel: list/view/update role/activate-deactivate/delete users
- Alembic migrations (schema is migration-managed, not `create_all`)
- Food database schema: `food_categories`, `foods`, `food_nutrients` (EAV-style nutrient rows)
- IFCT-based seed data: 42 foods, 12 categories, 13 nutrients/food
- Food search API: text search (incl. Hindi names), filter by category/type/region, pagination
- Food Search UI: debounced search bar, filters, results grid, nutrient detail modal

---

## Remaining Tasks (Priority Order)

### 1. Nutrient Calculator (Milestone 8) — next up
Let users build a meal from multiple foods with adjustable quantities and see combined totals.
**Decision needed first:** client-side calculation (simple, uses existing `/foods/{id}/nutrients`, no new backend code) vs. server-side (`POST /foods/calculate`, enables future persistence). Resolve this before coding.

### 2. Meal/Calculation Persistence (decide scope)
Determine whether calculator results need to be saved (history, daily tracking) for the `user` role, vs. kept ephemeral for now. Out of MVP scope unless explicitly requested — don't build patient/meal-plan features yet (those are post-MVP per the original spec).

### 3. Security Hardening
- Externalize frontend API URL (`VITE_API_URL` env var instead of hardcoded `localhost:8000`)
- Rate limiting on `/auth/login` and `/auth/signup`
- Email verification flow (`is_verified` field exists but unused)
- Forgot-password / password reset flow
- Refresh token revocation strategy (currently stateless, no blacklist)

### 4. Data/Consistency Cleanup
- Decide on soft-delete vs hard-delete for users (currently hard delete; foods use soft-delete — inconsistent)
- Remove dead `ENERGY` placeholder function in `FoodCard.jsx`
- Expand seed data beyond 42 foods if broader coverage is needed before real usage

### 5. Testing
- No automated tests exist yet (backend pytest, frontend test suite). Add at least basic coverage for auth and food search before deployment.

### 6. Deployment
- Choose free-tier hosting: e.g. Render/Railway for backend, Vercel/Netlify for frontend, Neon/Supabase for managed Postgres
- Update CORS origins, environment variables, and `DATABASE_URL` for production
- Set up basic CI/CD (free tier — GitHub Actions)

---

## Known Bugs / Blockers

- None blocking current functionality — all 7 completed milestones pass their verification tests.
- Pending inconsistencies (not bugs, but worth fixing): hardcoded frontend API URL, hard-delete vs soft-delete mismatch between users and foods, dead code in `FoodCard.jsx`.
- No real blocker exists for starting Milestone 8 — only an open architectural decision (client-side vs server-side calculation) that should be discussed before implementation.

---

## Recommended Next Steps

1. Start Milestone 8: present the client-side vs server-side calculation tradeoff, get a decision, then build the Nutrient Calculator (search/add foods, adjustable quantities, live totals).
2. Decide and scope whether basic meal/calculation history should be saved for the `user` role — if yes, this becomes Milestone 9 (likely a `meal_logs` table + simple "Today's Intake" view).
3. Once core nutrition features feel complete, do a hardening pass (security + consistency items above) before any deployment.
4. Deploy a free-tier MVP (backend + frontend + managed Postgres) so the product is shareable/demoable.
5. Only after deployment, revisit the explicitly-deferred clinical features (patient profiles, meal plans, progress tracking, reports) as a new phase beyond MVP.
